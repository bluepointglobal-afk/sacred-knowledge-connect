import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type {
  Session,
  Feedback,
  TeacherProfile,
  Profile,
  Bundle,
} from "@/types/database";

// Cache times
const STALE_TIME = 1 * 60 * 1000; // 1 minute
const GC_TIME = 10 * 60 * 1000; // 10 minutes

// Extended session type with teacher info and feedback
export interface SessionWithTeacherAndFeedback extends Session {
  teacher_profiles: TeacherProfile & {
    profiles: Profile;
  };
  feedback: Feedback[];
}

// Session with bundle info for upcoming sessions
export interface UpcomingSession extends Session {
  bundles: Bundle | null;
  teacher_profiles: TeacherProfile & {
    profiles: Profile;
  };
}

/**
 * Get all sessions for an enrollment
 */
export function useSessionsByEnrollment(enrollmentId: string | undefined) {
  return useQuery({
    queryKey: ["sessions", "enrollment", enrollmentId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<SessionWithTeacherAndFeedback[]> => {
      if (!enrollmentId) return [];

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          teacher_profiles (
            *,
            profiles (*)
          ),
          feedback (*)
        `)
        .eq("enrollment_id", enrollmentId)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data as SessionWithTeacherAndFeedback[];
    },
    enabled: !!enrollmentId,
  });
}

/**
 * Get upcoming sessions for the current user (student)
 */
export function useUpcomingSessions(limit = 5) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sessions", "upcoming", user?.id, limit],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<UpcomingSession[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          bundles (*),
          teacher_profiles (
            *,
            profiles (*)
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "scheduled")
        .gt("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as UpcomingSession[];
    },
    enabled: !!user?.id,
  });
}

/**
 * Get a single session by ID
 */
export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["session", sessionId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<SessionWithTeacherAndFeedback | null> => {
      if (!sessionId) return null;

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          teacher_profiles (
            *,
            profiles (*)
          ),
          feedback (*)
        `)
        .eq("id", sessionId)
        .single();

      if (error) throw error;
      return data as SessionWithTeacherAndFeedback;
    },
    enabled: !!sessionId,
  });
}

interface CreateSessionParams {
  enrollmentId: string;
  teacherId: string;
  bundleId: string;
  scheduledAt: string;
  durationMinutes: number;
  title?: string;
}

/**
 * Create a new session (student schedules)
 */
export function useCreateSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      enrollmentId,
      teacherId,
      bundleId,
      scheduledAt,
      durationMinutes,
      title,
    }: CreateSessionParams) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("sessions")
        .insert({
          student_id: user.id,
          teacher_id: teacherId,
          bundle_id: bundleId,
          enrollment_id: enrollmentId,
          scheduled_at: scheduledAt,
          duration_minutes: durationMinutes,
          title: title || null,
          status: "scheduled",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", "enrollment", variables.enrollmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions", "upcoming"] });
    },
  });
}

interface UpdateSessionParams {
  sessionId: string;
  meetingUrl?: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
  notesTeacher?: string;
  notesStudent?: string;
}

/**
 * Update a session (teacher adds link, marks complete, etc.)
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      meetingUrl,
      status,
      notesTeacher,
      notesStudent,
    }: UpdateSessionParams) => {
      const updates: Record<string, unknown> = {};

      if (meetingUrl !== undefined) updates.meeting_url = meetingUrl;
      if (status !== undefined) updates.status = status;
      if (notesTeacher !== undefined) updates.notes_teacher = notesTeacher;
      if (notesStudent !== undefined) updates.notes_student = notesStudent;

      const { data, error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["session", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["sessions", "enrollment", data.enrollment_id],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions", "upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

interface CreateFeedbackParams {
  sessionId: string;
  teacherId: string;
  rating: number;
  reviewText?: string;
}

/**
 * Create feedback for a completed session (student)
 */
export function useCreateFeedback() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      teacherId,
      rating,
      reviewText,
    }: CreateFeedbackParams) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("feedback")
        .insert({
          session_id: sessionId,
          student_id: user.id,
          teacher_id: teacherId,
          rating,
          review_text: reviewText || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session", variables.sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/**
 * Get feedback for a session
 */
export function useFeedbackBySession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["feedback", sessionId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<Feedback | null> => {
      if (!sessionId) return null;

      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });
}
