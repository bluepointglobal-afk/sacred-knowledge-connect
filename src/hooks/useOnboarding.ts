import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { OnboardingResponse } from "@/types/database";

export function useOnboardingResponses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["onboarding", user?.id],
    queryFn: async (): Promise<OnboardingResponse[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useSaveOnboardingResponse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stepKey,
      response,
    }: {
      stepKey: string;
      response: Record<string, unknown>;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("onboarding_responses")
        .upsert(
          {
            user_id: user.id,
            step_key: stepKey,
            response,
          },
          {
            onConflict: "user_id,step_key",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding", user?.id] });
    },
  });
}
