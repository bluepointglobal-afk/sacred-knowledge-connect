import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MOCK_BUNDLES, MOCK_TEACHERS, withMockFallback } from "@/lib/mock-data";
import type { BundleWithTeacher } from "@/types/database";

// Cache times for bundle data (moderately static)
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const GC_TIME = 30 * 60 * 1000; // 30 minutes

interface UseBundlesOptions {
  featured?: boolean;
  category?: string;
  limit?: number;
}

export function useBundles(options: UseBundlesOptions = {}) {
  const { featured, category, limit = 20 } = options;

  return useQuery({
    queryKey: ["bundles", { featured, category, limit }],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<BundleWithTeacher[]> => {
      const mockBundlesWithTeachers = MOCK_BUNDLES.map(b => ({
        ...b,
        teacher_profiles: MOCK_TEACHERS.find(t => t.id === b.teacher_id) || MOCK_TEACHERS[0],
      }));

      return withMockFallback(
        async () => {
          let query = supabase
            .from("bundles")
            .select(`
              *,
              teacher_profiles (
                *,
                profiles (*)
              )
            `)
            .eq("status", "published")
            .limit(limit);

          if (featured) {
            query = query.eq("is_featured", true);
          }

          if (category) {
            query = query.eq("category", category);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data as BundleWithTeacher[];
        },
        mockBundlesWithTeachers.slice(0, limit) as BundleWithTeacher[],
        "useBundles"
      );
    },
  });
}

export function useBundle(bundleId: string | undefined) {
  return useQuery({
    queryKey: ["bundle", bundleId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<BundleWithTeacher | null> => {
      if (!bundleId) return null;

      const mockBundlesWithTeachers = MOCK_BUNDLES.map(b => ({
        ...b,
        teacher_profiles: MOCK_TEACHERS.find(t => t.id === b.teacher_id) || MOCK_TEACHERS[0],
      }));

      return withMockFallback(
        async () => {
          const { data, error } = await supabase
            .from("bundles")
            .select(`
              *,
              teacher_profiles (
                *,
                profiles (*)
              )
            `)
            .eq("id", bundleId)
            .single();

          if (error) throw error;
          return data as BundleWithTeacher;
        },
        (mockBundlesWithTeachers.find(b => b.id === bundleId) as BundleWithTeacher | undefined) ?? null,
        "useBundle"
      );
    },
    enabled: !!bundleId,
  });
}

export function useBundlesByTeacher(teacherId: string | undefined) {
  return useQuery({
    queryKey: ["bundles", "teacher", teacherId],
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryFn: async (): Promise<BundleWithTeacher[]> => {
      if (!teacherId) return [];

      const mockBundlesWithTeachers = MOCK_BUNDLES.map(b => ({
        ...b,
        teacher_profiles: MOCK_TEACHERS.find(t => t.id === b.teacher_id) || MOCK_TEACHERS[0],
      }));

      return withMockFallback(
        async () => {
          const { data, error } = await supabase
            .from("bundles")
            .select(`
              *,
              teacher_profiles (
                *,
                profiles (*)
              )
            `)
            .eq("teacher_id", teacherId)
            .eq("status", "published");

          if (error) throw error;
          return data as BundleWithTeacher[];
        },
        mockBundlesWithTeachers.filter(b => b.teacher_id === teacherId) as BundleWithTeacher[],
        "useBundlesByTeacher"
      );
    },
    enabled: !!teacherId,
  });
}
