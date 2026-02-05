/**
 * Mock data for offline/dev fallback when Supabase is unavailable.
 * Used to prevent UI hard-failures during development or connectivity issues.
 */

export const MOCK_TEACHERS = [
  {
    id: "mock-teacher-1",
    user_id: "mock-user-1",
    bio: "Experienced Quran teacher with 15 years of ijazah-backed instruction. Specializing in tajweed and memorization for beginners and intermediate students.",
    specializations: ["tajweed", "hifz", "qiraat"],
    hourly_rate: 50,
    hourly_rate_cents: 5000,
    currency: "usd",
    is_verified: true,
    is_featured: true,
    years_experience: 15,
    languages: ["Arabic", "English"],
    timezone: "Asia/Dubai",
    availability_status: "available",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    profiles: {
      id: "mock-user-1",
      full_name: "Sheikh Ahmad Al-Rashid",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AR",
      email: "ahmad@example.com",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    },
  },
  {
    id: "mock-teacher-2",
    user_id: "mock-user-2",
    bio: "Certified Islamic studies teacher from Al-Azhar University. Focus on Arabic grammar, fiqh fundamentals, and Quran memorization with proper tajweed.",
    specializations: ["tajweed", "arabic", "fiqh"],
    hourly_rate: 40,
    hourly_rate_cents: 4000,
    currency: "usd",
    is_verified: true,
    is_featured: true,
    years_experience: 10,
    languages: ["Arabic", "English", "Urdu"],
    timezone: "Africa/Cairo",
    availability_status: "available",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    profiles: {
      id: "mock-user-2",
      full_name: "Ustadha Fatima Hassan",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=FH",
      email: "fatima@example.com",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    },
  },
  {
    id: "mock-teacher-3",
    user_id: "mock-user-3",
    bio: "Hafiz with multiple qiraat certifications. Patient teaching style suitable for children and adults. Online sessions available globally.",
    specializations: ["hifz", "qiraat", "tajweed"],
    hourly_rate: 35,
    hourly_rate_cents: 3500,
    currency: "usd",
    is_verified: true,
    is_featured: false,
    years_experience: 8,
    languages: ["Arabic", "English", "Malay"],
    timezone: "Asia/Kuala_Lumpur",
    availability_status: "available",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    profiles: {
      id: "mock-user-3",
      full_name: "Ustaz Ibrahim Rahman",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=IR",
      email: "ibrahim@example.com",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    },
  },
];

export const MOCK_BUNDLES = [
  {
    id: "mock-bundle-1",
    teacher_id: "mock-teacher-1",
    title: "Tajweed Foundations",
    description: "Master the fundamentals of Quran recitation with proper pronunciation and rules. 10 sessions covering all essential tajweed principles.",
    sessions_count: 10,
    total_sessions: 10,
    duration_weeks: 4,
    price: 400,
    price_cents: 40000,
    currency: "usd",
    discount_percent: 20,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "mock-bundle-2",
    teacher_id: "mock-teacher-1",
    title: "Hifz Program - Juz Amma",
    description: "Complete memorization of Juz Amma with tajweed. Includes revision sessions and certification upon completion.",
    sessions_count: 20,
    total_sessions: 20,
    duration_weeks: 8,
    price: 700,
    price_cents: 70000,
    currency: "usd",
    discount_percent: 15,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "mock-bundle-3",
    teacher_id: "mock-teacher-2",
    title: "Arabic for Quran",
    description: "Learn Arabic grammar specifically for understanding the Quran. No prior Arabic knowledge required.",
    sessions_count: 15,
    total_sessions: 15,
    duration_weeks: 6,
    price: 500,
    price_cents: 50000,
    currency: "usd",
    discount_percent: 10,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

export const MOCK_SESSIONS = [
  {
    id: "mock-session-1",
    student_id: "mock-student-1",
    teacher_id: "mock-teacher-1",
    bundle_id: null,
    scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    duration_minutes: 60,
    status: "scheduled",
    meeting_url: "https://meet.example.com/mock-session-1",
    notes: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

export const MOCK_ENROLLMENTS = [
  {
    id: "mock-enrollment-1",
    student_id: "mock-student-1",
    bundle_id: "mock-bundle-1",
    status: "active",
    sessions_used: 3,
    sessions_total: 10,
    enrolled_at: "2025-01-15T00:00:00Z",
    expires_at: "2025-07-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z",
  },
];

export const MOCK_PROFILE = {
  id: "mock-student-1",
  full_name: "Test Student",
  avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=TS",
  email: "student@example.com",
  role: "student",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

/**
 * Mock payment-related tables for offline/dev E2E.
 *
 * Note: These are intentionally lightweight and only cover the fields
 * required by the offline golden-path tests.
 */

export const MOCK_PAYMENTS = [
  {
    id: "mock-payment-1",
    user_id: "mock-student-1",
    teacher_id: "mock-teacher-1",
    session_id: "mock-session-1",
    amount: 5000,
    status: "held",
    stripe_charge_id: "ch_mock_seed_0001",
    created_at: "2025-01-01T00:00:00Z",
  },
];

export const MOCK_TEACHER_EARNINGS = [
  {
    id: "mock-earning-1",
    teacher_id: "mock-teacher-1",
    amount: 4250,
    status: "pending",
    stripe_charge_id: "ch_mock_seed_0001",
    teacher_name: "Sheikh Ahmad Al-Rashid",
    teacher_email: "ahmad@example.com",
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: "mock-transaction-1",
    user_id: "mock-student-1",
    teacher_id: "mock-teacher-1",
    session_id: "mock-session-1",
    amount_paid: 5000,
    timestamp: "2025-01-01T00:00:00Z",
    status: "succeeded",
  },
];

export function generateMockStripeChargeId(): string {
  return `ch_mock_${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Check if we should use mock data (dev mode + Supabase unavailable)
 */
export function shouldUseMockData(): boolean {
  const flag = (import.meta.env.VITE_USE_MOCK_DATA ?? "auto").toLowerCase();

  // Explicit override in ANY mode (including preview/prod builds used in E2E)
  if (flag === "true") return true;
  if (flag === "false") return false;

  // Auto mode: enable mocks by default in development.
  if (import.meta.env.PROD) return false;
  return true;
}

/**
 * Wrapper to try Supabase first, fall back to mock data on error.
 *
 * Behavior:
 * - PROD: never fall back (errors surface as-is)
 * - DEV:
 *   - If VITE_USE_MOCK_DATA="false" → never fall back (surface errors)
 *   - Else (unset or "true") → fall back to mock data on any Supabase error
 *
 * This prevents hard-failures during local/dev when Supabase is unreachable
 * (DNS/network, missing env, etc.) while still allowing strict mode.
 */
export async function withMockFallback<T>(
  supabaseFn: () => Promise<T>,
  mockData: T,
  label: string
): Promise<T> {
  try {
    return await supabaseFn();
  } catch (error) {
    if (import.meta.env.PROD) throw error;

    const mockMode = (import.meta.env.VITE_USE_MOCK_DATA ?? "auto").toLowerCase();
    if (mockMode !== "false") {
      console.warn(`[MockFallback] ${label}: Supabase failed, using mock data (VITE_USE_MOCK_DATA=${mockMode})`, error);
      return mockData;
    }

    throw error;
  }
}
