import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TeacherProfileWithUser } from "@/types/database";

// Cache times for teacher data (relatively static)
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 30 * 60 * 1000; // 30 minutes

interface UseTeachersOptions {
  featured?: boolean;
  specialization?: string;
  limit?: number;
}

export function useTeachers(options: UseTeachersOptions = {}) {
  const { featured, specialization, limit = 20 } = options;

  return useQuery({
    queryKey: ["teachers", { featured, specialization, limit }],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<TeacherProfileWithUser[]> => {
      let query = supabase
        .from("teacher_profiles")
        .select(`
          *,
          profiles (*)
        `)
        .eq("is_verified", true)
        .limit(limit);

      if (featured) {
        query = query.eq("is_featured", true);
      }

      if (specialization) {
        query = query.contains("specializations", [specialization]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TeacherProfileWithUser[];
    },
  });
}

export function useTeacher(teacherId: string | undefined) {
  return useQuery({
    queryKey: ["teacher", teacherId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<TeacherProfileWithUser | null> => {
      if (!teacherId) return null;

      const { data, error } = await supabase
        .from("teacher_profiles")
        .select(`
          *,
          profiles (*)
        `)
        .eq("id", teacherId)
        .single();

      if (error) throw error;
      return data as TeacherProfileWithUser;
    },
    enabled: !!teacherId,
  });
}
