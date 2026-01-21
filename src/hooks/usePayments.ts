import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getStripe, calculateTeacherAmount, MINIMUM_PAYOUT_CENTS } from "@/lib/stripe";
import type {
  Payment,
  TeacherEarning,
  TeacherPayout,
  EarningsSummary,
  Profile,
  Bundle,
  Session,
} from "@/types/database";

// Cache times
const STALE_TIME = 1 * 60 * 1000; // 1 minute
const GC_TIME = 10 * 60 * 1000; // 10 minutes

// Payment flow: checkout -> escrow hold (24h) -> release to teacher

// Extended types
export interface PaymentWithDetails extends Payment {
  student: Profile;
  teacher: Profile;
  session: Session | null;
  bundle: Bundle | null;
}

export interface TeacherEarningWithDetails extends TeacherEarning {
  payment: Payment;
  session: Session | null;
  bundle: Bundle | null;
}

/**
 * Hook for fetching student's payment history
 */
export function useStudentPayments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payments", "student", user?.id],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<PaymentWithDetails[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          student:profiles!payments_student_id_fkey(*),
          teacher:profiles!payments_teacher_id_fkey(*),
          session:sessions(*),
          bundle:bundles(*)
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentWithDetails[];
    },
    enabled: !!user?.id,
  });
}

/**
 * Hook for fetching teacher's received payments
 */
export function useTeacherPayments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payments", "teacher", user?.id],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<PaymentWithDetails[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          student:profiles!payments_student_id_fkey(*),
          teacher:profiles!payments_teacher_id_fkey(*),
          session:sessions(*),
          bundle:bundles(*)
        `)
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PaymentWithDetails[];
    },
    enabled: !!user?.id,
  });
}

/**
 * Hook for fetching teacher's earnings
 */
export function useTeacherEarnings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["earnings", user?.id],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<TeacherEarningWithDetails[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("teacher_earnings")
        .select(`
          *,
          payment:payments(*),
          session:sessions(*),
          bundle:bundles(*)
        `)
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TeacherEarningWithDetails[];
    },
    enabled: !!user?.id,
  });
}

/**
 * Hook for fetching teacher's earnings summary (for dashboard)
 */
export function useEarningsSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["earnings", "summary", user?.id],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<EarningsSummary> => {
      if (!user?.id) {
        return {
          available_balance_cents: 0,
          pending_balance_cents: 0,
          total_earned_cents: 0,
          total_paid_out_cents: 0,
        };
      }

      // Get available balance using database function
      const { data: availableData } = await supabase
        .rpc("get_teacher_available_balance", { p_teacher_id: user.id });

      // Get pending balance using database function
      const { data: pendingData } = await supabase
        .rpc("get_teacher_pending_balance", { p_teacher_id: user.id });

      // Get total earned (sum all earnings except forfeited)
      const { data: earningsData, error: earningsError } = await supabase
        .from("teacher_earnings")
        .select("amount_cents, status")
        .eq("teacher_id", user.id)
        .neq("status", "forfeited");

      if (earningsError) throw earningsError;

      const totalEarned = earningsData?.reduce(
        (sum, e) => sum + e.amount_cents,
        0
      ) ?? 0;

      // Get total paid out (completed payouts)
      const { data: payoutsData, error: payoutsError } = await supabase
        .from("teacher_payouts")
        .select("amount_cents")
        .eq("teacher_id", user.id)
        .eq("status", "completed");

      if (payoutsError) throw payoutsError;

      const totalPaidOut = payoutsData?.reduce(
        (sum, p) => sum + p.amount_cents,
        0
      ) ?? 0;

      return {
        available_balance_cents: availableData ?? 0,
        pending_balance_cents: pendingData ?? 0,
        total_earned_cents: totalEarned,
        total_paid_out_cents: totalPaidOut,
      };
    },
    enabled: !!user?.id,
  });
}

/**
 * Hook for fetching teacher's payout history
 */
export function useTeacherPayouts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["payouts", user?.id],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<TeacherPayout[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("teacher_payouts")
        .select("*")
        .eq("teacher_id", user.id)
        .order("requested_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

/**
 * Hook for creating a bundle checkout session
 */
export function useBundleCheckout() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ bundleId }: { bundleId: string }) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Call Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            bundle_id: bundleId,
            payment_type: "bundle",
            success_url: `${window.location.origin}/dashboard/student/enrollments?checkout=success`,
            cancel_url: `${window.location.origin}/bundles/${bundleId}?checkout=cancelled`,
          },
        }
      );

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
  });
}

/**
 * Hook for creating a session checkout (hourly booking)
 */
export function useSessionCheckout() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      teacherId,
      scheduledAt,
      durationMinutes = 60,
      title,
    }: {
      teacherId: string;
      scheduledAt: string;
      durationMinutes?: number;
      title?: string;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Call Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            teacher_id: teacherId,
            payment_type: "session",
            scheduled_at: scheduledAt,
            duration_minutes: durationMinutes,
            title,
            success_url: `${window.location.origin}/dashboard/student/sessions?checkout=success`,
            cancel_url: `${window.location.origin}/teachers/${teacherId}?checkout=cancelled`,
          },
        }
      );

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
  });
}

/**
 * Hook for requesting a payout
 */
export function useRequestPayout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amountCents }: { amountCents: number }) => {
      if (!user?.id) throw new Error("Not authenticated");

      if (amountCents < MINIMUM_PAYOUT_CENTS) {
        throw new Error(`Minimum payout is $${MINIMUM_PAYOUT_CENTS / 100}`);
      }

      // Call Edge Function to request payout
      const { data, error } = await supabase.functions.invoke("request-payout", {
        body: { amount_cents: amountCents },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
    },
  });
}

/**
 * Hook for initiating Stripe Connect onboarding
 */
export function useStripeConnect() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      // Call Edge Function to create/get Connect account link
      const { data, error } = await supabase.functions.invoke(
        "create-connect-link",
        {
          body: {
            return_url: `${window.location.origin}/dashboard/teacher/earnings`,
            refresh_url: `${window.location.origin}/dashboard/teacher/earnings?connect=refresh`,
          },
        }
      );

      if (error) throw error;
      if (!data?.url) throw new Error("No Connect URL returned");

      // Redirect to Stripe Connect onboarding
      window.location.href = data.url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
    },
  });
}

/**
 * Hook for creating a Stripe Connect account (first step)
 */
export function useCreateConnectAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      // Call Edge Function to create Connect account
      const { data, error } = await supabase.functions.invoke(
        "create-connect-account",
        { body: {} }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
    },
  });
}
