import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.5.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENT = 15;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase client
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
    const {
      bundle_id,
      teacher_id,
      payment_type,
      scheduled_at,
      duration_minutes,
      title,
      success_url,
      cancel_url,
    } = body;

    if (!payment_type || !["bundle", "session"].includes(payment_type)) {
      throw new Error("Invalid payment type");
    }

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let metadata: Record<string, string> = {
      student_id: user.id,
      payment_type,
    };
    let teacherId: string;
    let amountCents: number;

    if (payment_type === "bundle") {
      // Bundle checkout
      if (!bundle_id) {
        throw new Error("bundle_id is required for bundle checkout");
      }

      // Get bundle details
      const { data: bundle, error: bundleError } = await supabase
        .from("bundles")
        .select("*, teacher_profiles(user_id, stripe_account_id)")
        .eq("id", bundle_id)
        .single();

      if (bundleError || !bundle) {
        throw new Error("Bundle not found");
      }

      if (bundle.status !== "published") {
        throw new Error("Bundle is not available for purchase");
      }

      teacherId = bundle.teacher_profiles.user_id;
      amountCents = bundle.price_cents;

      lineItems = [
        {
          price_data: {
            currency: bundle.currency || "usd",
            product_data: {
              name: bundle.title,
              description: bundle.short_description || `${bundle.total_sessions} sessions over ${bundle.duration_weeks} weeks`,
            },
            unit_amount: bundle.price_cents,
          },
          quantity: 1,
        },
      ];

      metadata.bundle_id = bundle_id;
      metadata.teacher_id = teacherId;
    } else {
      // Session checkout (hourly booking)
      if (!teacher_id || !scheduled_at) {
        throw new Error("teacher_id and scheduled_at are required for session checkout");
      }

      // Get teacher details
      const { data: teacherProfile, error: teacherError } = await supabase
        .from("teacher_profiles")
        .select("*, profiles(*)")
        .eq("user_id", teacher_id)
        .single();

      if (teacherError || !teacherProfile) {
        throw new Error("Teacher not found");
      }

      teacherId = teacher_id;
      const durationMins = duration_minutes || 60;
      // Calculate amount based on hourly rate and duration
      amountCents = Math.round((teacherProfile.hourly_rate_cents * durationMins) / 60);

      const teacherName = teacherProfile.profiles.full_name || "Teacher";
      const sessionTitle = title || `Session with ${teacherName}`;

      lineItems = [
        {
          price_data: {
            currency: teacherProfile.currency || "usd",
            product_data: {
              name: sessionTitle,
              description: `${durationMins}-minute session on ${new Date(scheduled_at).toLocaleDateString()}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ];

      metadata.teacher_id = teacherId;
      metadata.scheduled_at = scheduled_at;
      metadata.duration_minutes = String(durationMins);
      if (title) metadata.title = title;
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: user.id },
      });

      customerId = customer.id;

      // Save customer ID
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Calculate platform fee
    const platformFeeCents = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));
    const teacherAmountCents = amountCents - platformFeeCents;

    // Add fee info to metadata for webhook
    metadata.amount_cents = String(amountCents);
    metadata.platform_fee_cents = String(platformFeeCents);
    metadata.teacher_amount_cents = String(teacherAmountCents);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: lineItems,
      success_url: success_url || `${req.headers.get("origin")}/checkout/success`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/checkout/cancel`,
      metadata,
      payment_intent_data: {
        metadata,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
