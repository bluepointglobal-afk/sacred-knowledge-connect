import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ESCROW_HOLD_HOURS = 24;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // This function can be called:
    // 1. By a cron job to release mature escrows
    // 2. By a webhook when a session is completed
    // 3. Manually by admin

    const body = await req.json().catch(() => ({}));
    const { session_id, action } = body;

    if (session_id && action === "session_completed") {
      // Handle session completion - set available_at to 24h from now
      await handleSessionCompleted(supabase, session_id);
    } else if (session_id && action === "student_no_show") {
      // Student didn't show up - release funds to teacher immediately
      await handleStudentNoShow(supabase, session_id);
    } else if (session_id && action === "teacher_no_show") {
      // Teacher didn't show up - refund student
      await handleTeacherNoShow(supabase, session_id);
    } else {
      // Default: release all mature escrows (called by cron)
      await releaseMatureEscrows(supabase);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in release-escrow:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function handleSessionCompleted(
  supabase: ReturnType<typeof createClient>,
  sessionId: string
) {
  // Get the session's payment and earning
  const { data: earning, error } = await supabase
    .from("teacher_earnings")
    .select("id, payment_id")
    .eq("session_id", sessionId)
    .eq("status", "pending")
    .single();

  if (error || !earning) {
    console.log(`No pending earning found for session ${sessionId}`);
    return;
  }

  // Set available_at to 24 hours from now
  const availableAt = new Date(Date.now() + ESCROW_HOLD_HOURS * 60 * 60 * 1000).toISOString();

  await supabase
    .from("teacher_earnings")
    .update({ available_at: availableAt })
    .eq("id", earning.id);

  console.log(`Session ${sessionId} completed, escrow will release at ${availableAt}`);
}

async function handleStudentNoShow(
  supabase: ReturnType<typeof createClient>,
  sessionId: string
) {
  // Student didn't show - release funds to teacher immediately
  const { data: earning } = await supabase
    .from("teacher_earnings")
    .select("id, payment_id")
    .eq("session_id", sessionId)
    .eq("status", "pending")
    .single();

  if (!earning) return;

  // Release earning immediately
  await supabase
    .from("teacher_earnings")
    .update({
      status: "available",
      available_at: new Date().toISOString(),
    })
    .eq("id", earning.id);

  // Update payment status
  await supabase
    .from("payments")
    .update({
      status: "completed",
      escrow_released_at: new Date().toISOString(),
    })
    .eq("id", earning.payment_id);

  // Update session status
  await supabase
    .from("sessions")
    .update({ status: "no_show" })
    .eq("id", sessionId);

  console.log(`Student no-show for session ${sessionId}, funds released to teacher`);
}

async function handleTeacherNoShow(
  supabase: ReturnType<typeof createClient>,
  sessionId: string
) {
  // Teacher didn't show - forfeit earning and initiate refund
  const { data: earning } = await supabase
    .from("teacher_earnings")
    .select("id, payment_id")
    .eq("session_id", sessionId)
    .eq("status", "pending")
    .single();

  if (!earning) return;

  // Forfeit the earning
  await supabase
    .from("teacher_earnings")
    .update({ status: "forfeited" })
    .eq("id", earning.id);

  // Get payment details for refund
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", earning.payment_id)
    .single();

  if (payment) {
    // Mark for refund (actual Stripe refund would be processed separately)
    await supabase
      .from("payments")
      .update({
        status: "refunded",
        refund_amount_cents: payment.amount_cents,
        refund_reason: "teacher_no_show",
      })
      .eq("id", payment.id);
  }

  // Update session status
  await supabase
    .from("sessions")
    .update({ status: "cancelled" })
    .eq("id", sessionId);

  console.log(`Teacher no-show for session ${sessionId}, funds refunded to student`);
}

async function releaseMatureEscrows(supabase: ReturnType<typeof createClient>) {
  const now = new Date().toISOString();

  // Find all pending earnings where available_at has passed
  const { data: matureEarnings, error } = await supabase
    .from("teacher_earnings")
    .select("id, payment_id")
    .eq("status", "pending")
    .lte("available_at", now)
    .not("available_at", "is", null);

  if (error) {
    console.error("Error fetching mature escrows:", error);
    return;
  }

  if (!matureEarnings || matureEarnings.length === 0) {
    console.log("No mature escrows to release");
    return;
  }

  console.log(`Releasing ${matureEarnings.length} mature escrows`);

  for (const earning of matureEarnings) {
    // Update earning to available
    await supabase
      .from("teacher_earnings")
      .update({ status: "available" })
      .eq("id", earning.id);

    // Update payment to completed
    await supabase
      .from("payments")
      .update({
        status: "completed",
        escrow_released_at: now,
      })
      .eq("id", earning.payment_id);
  }

  console.log(`Released ${matureEarnings.length} escrows`);
}
