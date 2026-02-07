import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Dispute types matching the UI
 type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';
 type DisputeReason = 'service_not_received' | 'unsatisfactory_service' | 'billing_error' | 'unauthorized_charge' | 'other';
 type DisputeResolution = 'favor_client' | 'favor_consultant' | 'split' | 'refunded';

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, dispute_id, payment_id, reason, description, evidence, resolution } = body;

    switch (action) {
      case 'create':
        return await createDispute(supabase, payment_id, reason, description);
      case 'submit_evidence':
        return await submitEvidence(supabase, dispute_id, evidence);
      case 'update_status':
        return await updateDisputeStatus(supabase, dispute_id, body.status);
      case 'resolve':
        return await resolveDispute(supabase, dispute_id, resolution);
      case 'get_disputes':
        return await getDisputes(supabase, body.user_id, body.role);
      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in handle-dispute:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

async function createDispute(
  supabase: ReturnType<typeof createClient>,
  paymentId: string,
  reason: DisputeReason,
  description: string
) {
  // Verify payment exists and is in a disputable state
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (paymentError || !payment) {
    return new Response(
      JSON.stringify({ error: "Payment not found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
    );
  }

  if (payment.status !== 'held' && payment.status !== 'completed') {
    return new Response(
      JSON.stringify({ error: "Payment cannot be disputed in its current state" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }

  // Check if dispute already exists
  const { data: existingDispute } = await supabase
    .from("disputes")
    .select("id")
    .eq("payment_id", paymentId)
    .not("status", "in", "(resolved,closed)")
    .single();

  if (existingDispute) {
    return new Response(
      JSON.stringify({ error: "Active dispute already exists for this payment" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }

  // Create the dispute
  const { data: dispute, error: disputeError } = await supabase
    .from("disputes")
    .insert({
      payment_id: paymentId,
      client_id: payment.student_id,
      consultant_id: payment.teacher_id,
      status: 'open',
      reason,
      description,
      evidence: [],
    })
    .select()
    .single();

  if (disputeError) {
    return new Response(
      JSON.stringify({ error: "Failed to create dispute" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  // Update payment status to disputed
  await supabase
    .from("payments")
    .update({ status: 'disputed' })
    .eq("id", paymentId);

  // Put earning on hold
  await supabase
    .from("teacher_earnings")
    .update({ status: 'held' })
    .eq("payment_id", paymentId);

  // Create notification for admin
  await supabase
    .from("notifications")
    .insert({
      user_id: payment.teacher_id, // Notify consultant
      type: 'dispute_created',
      title: 'Payment Disputed',
      message: `A dispute has been raised for payment ${paymentId}`,
      data: { dispute_id: dispute.id, payment_id: paymentId },
    });

  return new Response(
    JSON.stringify({ success: true, dispute }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}

async function submitEvidence(
  supabase: ReturnType<typeof createClient>,
  disputeId: string,
  evidence: {
    type: string;
    url: string;
    description: string;
    submitted_by: string;
  }
) {
  const { data: dispute, error: disputeError } = await supabase
    .from("disputes")
    .select("evidence")
    .eq("id", disputeId)
    .single();

  if (disputeError || !dispute) {
    return new Response(
      JSON.stringify({ error: "Dispute not found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
    );
  }

  const newEvidence = {
    id: crypto.randomUUID(),
    ...evidence,
    submitted_at: new Date().toISOString(),
  };

  const updatedEvidence = [...(dispute.evidence || []), newEvidence];

  const { error: updateError } = await supabase
    .from("disputes")
    .update({ 
      evidence: updatedEvidence,
      updated_at: new Date().toISOString(),
    })
    .eq("id", disputeId);

  if (updateError) {
    return new Response(
      JSON.stringify({ error: "Failed to submit evidence" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ success: true, evidence: newEvidence }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}

async function updateDisputeStatus(
  supabase: ReturnType<typeof createClient>,
  disputeId: string,
  status: DisputeStatus
) {
  const { error } = await supabase
    .from("disputes")
    .update({ 
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", disputeId);

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update dispute status" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}

async function resolveDispute(
  supabase: ReturnType<typeof createClient>,
  disputeId: string,
  resolution: DisputeResolution
) {
  // Get dispute details
  const { data: dispute, error: disputeError } = await supabase
    .from("disputes")
    .select("*")
    .eq("id", disputeId)
    .single();

  if (disputeError || !dispute) {
    return new Response(
      JSON.stringify({ error: "Dispute not found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
    );
  }

  // Get payment details
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", dispute.payment_id)
    .single();

  if (!payment) {
    return new Response(
      JSON.stringify({ error: "Payment not found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
    );
  }

  // Handle resolution
  switch (resolution) {
    case 'favor_client':
      // Refund client, forfeit consultant earning
      await supabase
        .from("payments")
        .update({ 
          status: 'refunded',
          refund_amount_cents: payment.amount_cents,
          refund_reason: 'dispute_resolved_favor_client',
        })
        .eq("id", payment.id);

      await supabase
        .from("teacher_earnings")
        .update({ status: 'forfeited' })
        .eq("payment_id", payment.id);
      break;

    case 'favor_consultant':
      // Release funds to consultant
      await supabase
        .from("payments")
        .update({ 
          status: 'completed',
          escrow_released_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      await supabase
        .from("teacher_earnings")
        .update({ 
          status: 'available',
          available_at: new Date().toISOString(),
        })
        .eq("payment_id", payment.id);
      break;

    case 'split':
      // Partial refund, partial release
      const halfAmount = Math.floor(payment.amount_cents / 2);
      await supabase
        .from("payments")
        .update({ 
          status: 'refunded',
          refund_amount_cents: halfAmount,
          refund_reason: 'dispute_resolved_split',
        })
        .eq("id", payment.id);

      await supabase
        .from("teacher_earnings")
        .update({ 
          status: 'available',
          available_at: new Date().toISOString(),
          amount_cents: Math.floor(payment.teacher_amount_cents / 2),
        })
        .eq("payment_id", payment.id);
      break;

    case 'refunded':
      // Full refund to client
      await supabase
        .from("payments")
        .update({ 
          status: 'refunded',
          refund_amount_cents: payment.amount_cents,
          refund_reason: 'dispute_resolved_full_refund',
        })
        .eq("id", payment.id);

      await supabase
        .from("teacher_earnings")
        .update({ status: 'forfeited' })
        .eq("payment_id", payment.id);
      break;
  }

  // Update dispute as resolved
  await supabase
    .from("disputes")
    .update({ 
      status: 'resolved',
      resolution,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", disputeId);

  // Notify both parties
  await supabase
    .from("notifications")
    .insert([
      {
        user_id: dispute.client_id,
        type: 'dispute_resolved',
        title: 'Dispute Resolved',
        message: `Your dispute has been resolved: ${resolution}`,
        data: { dispute_id: disputeId, resolution },
      },
      {
        user_id: dispute.consultant_id,
        type: 'dispute_resolved',
        title: 'Dispute Resolved',
        message: `A dispute has been resolved: ${resolution}`,
        data: { dispute_id: disputeId, resolution },
      },
    ]);

  return new Response(
    JSON.stringify({ success: true, resolution }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}

async function getDisputes(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  role: string
) {
  let query = supabase
    .from("disputes")
    .select("*, payments(*)")
    .order("created_at", { ascending: false });

  if (role !== 'admin') {
    query = query.or(`client_id.eq.${userId},consultant_id.eq.${userId}`);
  }

  const { data: disputes, error } = await query;

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch disputes" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ success: true, disputes }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );
}
