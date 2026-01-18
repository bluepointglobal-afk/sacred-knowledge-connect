import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Enrollment, Bundle, TeacherProfile, Profile } from "@/types/database";

// Cache times for enrollment data (changes more frequently)
const STALE_TIME = 1 * 60 * 1000; // 1 minute
const GC_TIME = 10 * 60 * 1000; // 10 minutes

// Extended type for enrollment with bundle and teacher details
export interface EnrollmentWithDetails extends Enrollment {
  bundles: Bundle & {
    teacher_profiles: TeacherProfile & {
      profiles: Profile;
    };
  };
}

export function useEnrollments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrollments", user?.id],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<EnrollmentWithDetails[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          bundles (
            *,
            teacher_profiles (
              *,
              profiles (*)
            )
          )
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EnrollmentWithDetails[];
    },
    enabled: !!user?.id,
  });
}

export function useEnrollment(bundleId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["enrollment", user?.id, bundleId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<Enrollment | null> => {
      if (!user?.id || !bundleId) return null;

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("student_id", user.id)
        .eq("bundle_id", bundleId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!bundleId,
  });
}

/**
 * Get a single enrollment by ID with full bundle and teacher details
 */
export function useEnrollmentById(enrollmentId: string | undefined) {
  return useQuery({
    queryKey: ["enrollment", "byId", enrollmentId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<EnrollmentWithDetails | null> => {
      if (!enrollmentId) return null;

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          bundles (
            *,
            teacher_profiles (
              *,
              profiles (*)
            )
          )
        `)
        .eq("id", enrollmentId)
        .single();

      if (error) throw error;
      return data as EnrollmentWithDetails;
    },
    enabled: !!enrollmentId,
  });
}

export function useCreateEnrollment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bundleId }: { bundleId: string }) => {
      if (!user?.id) throw new Error("Not authenticated");

      // Check if enrollment already exists
      const { data: existing } = await supabase
        .from("enrollments")
        .select("id, status")
        .eq("student_id", user.id)
        .eq("bundle_id", bundleId)
        .maybeSingle();

      if (existing) {
        if (existing.status === "active") {
          throw new Error("Already enrolled in this bundle");
        }
        // If cancelled or completed, allow re-enrollment by updating
        const { data, error } = await supabase
          .from("enrollments")
          .update({
            status: "active",
            started_at: new Date().toISOString(),
            progress_percent: 0,
            sessions_completed: 0,
            completed_at: null,
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Create new enrollment
      const { data, error } = await supabase
        .from("enrollments")
        .insert({
          student_id: user.id,
          bundle_id: bundleId,
          status: "active",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate enrollments queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });
    },
  });
}
