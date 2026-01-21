import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.5.0?target=deno";

const ESCROW_HOLD_HOURS = 24;

serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify webhook signature
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      throw new Error("Missing webhook signature or secret");
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
      });
    }

    console.log(`Processing event: ${event.type}`);

    // Idempotency check - prevent duplicate processing
    const { data: existingEvent } = await supabase
      .from("payments")
      .select("id")
      .eq("metadata->>stripe_event_id", event.id)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Event ${event.id} already processed, skipping`);
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        status: 200,
      });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session, event.id);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(supabase, event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleChargeRefunded(supabase, event.data.object as Stripe.Charge);
        break;

      case "charge.dispute.created":
        await handleDisputeCreated(supabase, event.data.object as Stripe.Dispute);
        break;

      case "account.updated":
        await handleAccountUpdated(supabase, event.data.object as Stripe.Account);
        break;

      case "transfer.created":
        await handleTransferCreated(supabase, event.data.object as Stripe.Transfer);
        break;

      case "transfer.failed":
        await handleTransferFailed(supabase, event.data.object as Stripe.Transfer);
        break;

      case "payout.paid":
        await handlePayoutPaid(supabase, event.data.object as Stripe.Payout);
        break;

      case "payout.failed":
        await handlePayoutFailed(supabase, event.data.object as Stripe.Payout);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof createClient>,
  session: Stripe.Checkout.Session,
  eventId: string
) {
  const metadata = session.metadata || {};
  const {
    student_id,
    teacher_id,
    bundle_id,
    payment_type,
    scheduled_at,
    duration_minutes,
    title,
    amount_cents,
    platform_fee_cents,
    teacher_amount_cents,
  } = metadata;

  if (!student_id || !teacher_id || !payment_type) {
    console.error("Missing required metadata in checkout session");
    return;
  }

  let sessionId: string | null = null;
  let enrollmentId: string | null = null;

  // Create session record if this is a session payment
  if (payment_type === "session" && scheduled_at) {
    const { data: newSession, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        teacher_id,
        student_id,
        scheduled_at,
        duration_minutes: parseInt(duration_minutes || "60"),
        title: title || "Scheduled Session",
        status: "scheduled",
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Error creating session:", sessionError);
    } else {
      sessionId = newSession.id;
    }
  }

  // Create enrollment if this is a bundle payment
  if (payment_type === "bundle" && bundle_id) {
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .insert({
        student_id,
        bundle_id,
        status: "active",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (enrollmentError) {
      console.error("Error creating enrollment:", enrollmentError);
    } else {
      enrollmentId = enrollment.id;
    }
  }

  // Create payment record with status 'held' (escrow)
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      student_id,
      teacher_id,
      session_id: sessionId,
      bundle_id: bundle_id || null,
      enrollment_id: enrollmentId,
      amount_cents: parseInt(amount_cents || "0"),
      platform_fee_cents: parseInt(platform_fee_cents || "0"),
      teacher_amount_cents: parseInt(teacher_amount_cents || "0"),
      currency: session.currency || "usd",
      status: "held", // Start in escrow
      payment_type,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_checkout_session_id: session.id,
      metadata: { stripe_event_id: eventId },
    })
    .select()
    .single();

  if (paymentError) {
    console.error("Error creating payment:", paymentError);
    return;
  }

  // Create teacher earning with status 'pending' (in escrow)
  // For bundles, earnings become available immediately after 24h
  // For sessions, earnings become available 24h after session completion
  const availableAt = payment_type === "bundle"
    ? new Date(Date.now() + ESCROW_HOLD_HOURS * 60 * 60 * 1000).toISOString()
    : null; // Will be set when session is completed

  await supabase.from("teacher_earnings").insert({
    teacher_id,
    payment_id: payment.id,
    session_id: sessionId,
    bundle_id: bundle_id || null,
    amount_cents: parseInt(teacher_amount_cents || "0"),
    currency: session.currency || "usd",
    status: "pending",
    available_at: availableAt,
  });

  console.log(`Payment ${payment.id} created with status 'held'`);
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createClient>,
  paymentIntent: Stripe.PaymentIntent
) {
  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .maybeSingle();

  if (payment) {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", payment.id);

    console.log(`Payment ${payment.id} marked as failed`);
  }
}

async function handleChargeRefunded(
  supabase: ReturnType<typeof createClient>,
  charge: Stripe.Charge
) {
  const { data: payment } = await supabase
    .from("payments")
    .select("id, teacher_amount_cents")
    .eq("stripe_charge_id", charge.id)
    .maybeSingle();

  if (!payment) {
    // Try finding by payment_intent
    const { data: paymentByPi } = await supabase
      .from("payments")
      .select("id, teacher_amount_cents")
      .eq("stripe_payment_intent_id", charge.payment_intent)
      .maybeSingle();

    if (!paymentByPi) return;

    await processRefund(supabase, paymentByPi, charge);
    return;
  }

  await processRefund(supabase, payment, charge);
}

async function processRefund(
  supabase: ReturnType<typeof createClient>,
  payment: { id: string; teacher_amount_cents: number },
  charge: Stripe.Charge
) {
  const refundAmount = charge.amount_refunded;

  await supabase
    .from("payments")
    .update({
      status: "refunded",
      refund_amount_cents: refundAmount,
      refund_reason: charge.refunds?.data[0]?.reason || "requested_by_customer",
    })
    .eq("id", payment.id);

  // Forfeit teacher earning
  await supabase
    .from("teacher_earnings")
    .update({ status: "forfeited" })
    .eq("payment_id", payment.id);

  console.log(`Payment ${payment.id} refunded, earning forfeited`);
}

async function handleDisputeCreated(
  supabase: ReturnType<typeof createClient>,
  dispute: Stripe.Dispute
) {
  const chargeId = dispute.charge as string;

  // Find payment by charge
  const { data: payment } = await supabase
    .from("payments")
    .select("id")
    .eq("stripe_charge_id", chargeId)
    .maybeSingle();

  if (payment) {
    await supabase
      .from("payments")
      .update({ status: "disputed" })
      .eq("id", payment.id);

    // Hold the earning
    await supabase
      .from("teacher_earnings")
      .update({ status: "held" })
      .eq("payment_id", payment.id);

    console.log(`Payment ${payment.id} disputed, earning held`);
  }
}

async function handleAccountUpdated(
  supabase: ReturnType<typeof createClient>,
  account: Stripe.Account
) {
  // Update teacher profile with Connect status
  const { error } = await supabase
    .from("teacher_profiles")
    .update({
      stripe_onboarded: account.details_submitted,
      stripe_charges_enabled: account.charges_enabled,
      stripe_payouts_enabled: account.payouts_enabled,
    })
    .eq("stripe_account_id", account.id);

  if (error) {
    console.error("Error updating teacher Connect status:", error);
  } else {
    console.log(`Teacher Connect account ${account.id} updated`);
  }
}

async function handleTransferCreated(
  supabase: ReturnType<typeof createClient>,
  transfer: Stripe.Transfer
) {
  const payoutId = transfer.metadata?.payout_id;
  if (!payoutId) return;

  await supabase
    .from("teacher_payouts")
    .update({
      status: "processing",
      stripe_transfer_id: transfer.id,
    })
    .eq("id", payoutId);

  console.log(`Payout ${payoutId} transfer created`);
}

async function handleTransferFailed(
  supabase: ReturnType<typeof createClient>,
  transfer: Stripe.Transfer
) {
  const payoutId = transfer.metadata?.payout_id;
  if (!payoutId) return;

  await supabase
    .from("teacher_payouts")
    .update({
      status: "failed",
      failure_reason: "Transfer failed",
    })
    .eq("id", payoutId);

  // Restore earnings to available
  // Note: In a real system, you'd track which earnings were part of this payout
  console.log(`Payout ${payoutId} transfer failed`);
}

async function handlePayoutPaid(
  supabase: ReturnType<typeof createClient>,
  payout: Stripe.Payout
) {
  const payoutId = payout.metadata?.payout_id;
  if (!payoutId) return;

  await supabase
    .from("teacher_payouts")
    .update({
      status: "completed",
      stripe_payout_id: payout.id,
      processed_at: new Date().toISOString(),
    })
    .eq("id", payoutId);

  console.log(`Payout ${payoutId} completed`);
}

async function handlePayoutFailed(
  supabase: ReturnType<typeof createClient>,
  payout: Stripe.Payout
) {
  const payoutId = payout.metadata?.payout_id;
  if (!payoutId) return;

  await supabase
    .from("teacher_payouts")
    .update({
      status: "failed",
      failure_reason: payout.failure_message || "Payout failed",
    })
    .eq("id", payoutId);

  console.log(`Payout ${payoutId} failed`);
}
