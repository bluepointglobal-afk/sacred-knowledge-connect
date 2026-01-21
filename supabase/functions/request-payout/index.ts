import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.5.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MINIMUM_PAYOUT_CENTS = 5000; // $50 minimum

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Parse request body
    const body = await req.json();
    const { amount_cents } = body;

    if (!amount_cents || amount_cents < MINIMUM_PAYOUT_CENTS) {
      throw new Error(`Minimum payout amount is $${MINIMUM_PAYOUT_CENTS / 100}`);
    }

    // Get teacher profile with Connect account
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("id, stripe_account_id, stripe_onboarded, stripe_payouts_enabled")
      .eq("user_id", user.id)
      .single();

    if (teacherError || !teacherProfile) {
      throw new Error("Teacher profile not found");
    }

    if (!teacherProfile.stripe_account_id) {
      throw new Error("Please complete Stripe Connect setup first");
    }

    if (!teacherProfile.stripe_onboarded || !teacherProfile.stripe_payouts_enabled) {
      throw new Error("Stripe Connect account is not fully verified. Please complete onboarding.");
    }

    // Get available balance
    const { data: availableBalance } = await supabase
      .rpc("get_teacher_available_balance", { p_teacher_id: user.id });

    if (!availableBalance || availableBalance < amount_cents) {
      throw new Error(`Insufficient available balance. Available: $${(availableBalance || 0) / 100}`);
    }

    // Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from("teacher_payouts")
      .insert({
        teacher_id: user.id,
        amount_cents,
        currency: "usd",
        status: "pending",
      })
      .select()
      .single();

    if (payoutError) {
      throw new Error("Failed to create payout request");
    }

    // Get available earnings to mark as paid_out
    const { data: availableEarnings, error: earningsError } = await supabase
      .from("teacher_earnings")
      .select("id, amount_cents")
      .eq("teacher_id", user.id)
      .eq("status", "available")
      .order("created_at", { ascending: true });

    if (earningsError) {
      throw new Error("Failed to fetch available earnings");
    }

    // Mark earnings as paid_out up to the requested amount
    let remainingAmount = amount_cents;
    const earningIds: string[] = [];

    for (const earning of availableEarnings || []) {
      if (remainingAmount <= 0) break;
      earningIds.push(earning.id);
      remainingAmount -= earning.amount_cents;
    }

    if (earningIds.length > 0) {
      await supabase
        .from("teacher_earnings")
        .update({ status: "paid_out" })
        .in("id", earningIds);
    }

    // Create Stripe Transfer to Connected account
    try {
      const transfer = await stripe.transfers.create({
        amount: amount_cents,
        currency: "usd",
        destination: teacherProfile.stripe_account_id,
        metadata: {
          payout_id: payout.id,
          teacher_id: user.id,
        },
      });

      // Update payout with transfer ID
      await supabase
        .from("teacher_payouts")
        .update({
          status: "processing",
          stripe_transfer_id: transfer.id,
        })
        .eq("id", payout.id);

      return new Response(
        JSON.stringify({
          payout_id: payout.id,
          transfer_id: transfer.id,
          amount_cents,
          status: "processing",
          message: "Payout initiated successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (stripeError) {
      // Revert earning status on Stripe failure
      if (earningIds.length > 0) {
        await supabase
          .from("teacher_earnings")
          .update({ status: "available" })
          .in("id", earningIds);
      }

      // Mark payout as failed
      await supabase
        .from("teacher_payouts")
        .update({
          status: "failed",
          failure_reason: stripeError.message,
        })
        .eq("id", payout.id);

      throw new Error(`Transfer failed: ${stripeError.message}`);
    }
  } catch (error) {
    console.error("Error processing payout:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
