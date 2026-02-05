import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { shouldUseMockData } from "@/lib/mock-data";
import { createMockSupabaseClient } from "@/lib/mock-supabase";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * In offline/mock mode we still need a Supabase client instance so that the rest
 * of the app can import `supabase` without throwing at module-load time.
 *
 * When VITE_USE_MOCK_DATA=true we tolerate missing env vars and point to a
 * harmless placeholder URL/key; callers should use withMockFallback() (or
 * dedicated mock flows) to avoid hard failures.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  if (shouldUseMockData()) {
    console.warn(
      "[Supabase] Missing env vars, but VITE_USE_MOCK_DATA=true. Using placeholder Supabase client for offline/dev mode."
    );
    supabaseUrl = supabaseUrl ?? "http://127.0.0.1:54321";
    supabaseAnonKey = supabaseAnonKey ?? "mock-anon-key";
  } else {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }
}

// In offline/mock mode, return a lightweight in-memory supabase lookalike.
// This keeps the rest of the app (hooks/components) working without needing a running Supabase.
export const supabase: any = shouldUseMockData()
  ? createMockSupabaseClient()
  : createClient<Database>(supabaseUrl, supabaseAnonKey);
