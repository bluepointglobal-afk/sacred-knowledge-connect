import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.5.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // Check if user is a teacher
    const { data: teacherProfile, error: teacherError } = await supabase
      .from("teacher_profiles")
      .select("id, stripe_account_id")
      .eq("user_id", user.id)
      .single();

    if (teacherError || !teacherProfile) {
      throw new Error("Teacher profile not found. Only teachers can create Connect accounts.");
    }

    // Check if already has Connect account
    if (teacherProfile.stripe_account_id) {
      return new Response(
        JSON.stringify({
          account_id: teacherProfile.stripe_account_id,
          message: "Connect account already exists",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get user profile for prefilling
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "US", // Default, can be changed during onboarding
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        supabase_user_id: user.id,
        teacher_profile_id: teacherProfile.id,
      },
    });

    // Save Connect account ID to teacher profile
    const { error: updateError } = await supabase
      .from("teacher_profiles")
      .update({
        stripe_account_id: account.id,
        stripe_onboarded: false,
        stripe_charges_enabled: false,
        stripe_payouts_enabled: false,
      })
      .eq("id", teacherProfile.id);

    if (updateError) {
      console.error("Error saving Connect account ID:", updateError);
      // Don't throw - account was created successfully
    }

    return new Response(
      JSON.stringify({
        account_id: account.id,
        message: "Connect account created successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Connect account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
