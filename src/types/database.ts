// Database types matching Supabase schema
// Generated from supabase/schema.sql

export type UserRole = "student" | "teacher" | "admin";
export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type EnrollmentStatus = "active" | "completed" | "paused" | "cancelled";
export type BundleStatus = "draft" | "published" | "archived";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfile {
  id: string;
  user_id: string;
  bio: string | null;
  headline: string | null;
  specializations: string[];
  qualifications: string[];
  hourly_rate_cents: number;
  currency: string;
  years_experience: number;
  is_verified: boolean;
  is_featured: boolean;
  video_intro_url: string | null;
  availability: Record<string, unknown>;
  total_students: number;
  total_sessions: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface Bundle {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  cover_image_url: string | null;
  price_cents: number;
  currency: string;
  duration_weeks: number;
  total_sessions: number;
  max_students: number | null;
  category: string | null;
  tags: string[];
  level: string;
  status: BundleStatus;
  is_featured: boolean;
  total_enrollments: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  title: string;
  description: string | null;
  item_type: string;
  content_url: string | null;
  duration_minutes: number;
  sort_order: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingResponse {
  id: string;
  user_id: string;
  step_key: string;
  response: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  bundle_id: string;
  status: EnrollmentStatus;
  progress_percent: number;
  started_at: string;
  completed_at: string | null;
  sessions_completed: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  teacher_id: string;
  student_id: string;
  bundle_id: string | null;
  enrollment_id: string | null;
  title: string | null;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: SessionStatus;
  meeting_url: string | null;
  notes_teacher: string | null;
  notes_student: string | null;
  rating: number | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  bundle_id: string | null;
  session_id: string | null;
  title: string | null;
  content: string;
  mood: string | null;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  session_id: string;
  student_id: string;
  teacher_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

// Extended types with relations
export interface TeacherProfileWithUser extends TeacherProfile {
  profiles: Profile;
}

export interface BundleWithTeacher extends Bundle {
  teacher_profiles: TeacherProfileWithUser;
}

export interface EnrollmentWithBundle extends Enrollment {
  bundles: Bundle;
}

export interface SessionWithDetails extends Session {
  teacher_profiles: TeacherProfileWithUser;
  bundles: Bundle | null;
  feedback?: Feedback[];
}

export interface EnrollmentWithDetails extends Enrollment {
  bundles: Bundle & {
    teacher_profiles: TeacherProfileWithUser;
  };
}

export interface SessionWithFeedback extends Session {
  feedback: Feedback | null;
}

// Insert types (omit auto-generated fields)
export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;

export type TeacherProfileInsert = Omit<TeacherProfile, "id" | "created_at" | "updated_at" | "total_students" | "total_sessions" | "average_rating">;
export type TeacherProfileUpdate = Partial<Omit<TeacherProfile, "id" | "user_id" | "created_at" | "updated_at">>;

export type BundleInsert = Omit<Bundle, "id" | "created_at" | "updated_at" | "total_enrollments" | "average_rating">;
export type BundleUpdate = Partial<Omit<Bundle, "id" | "teacher_id" | "created_at" | "updated_at">>;

export type BundleItemInsert = Omit<BundleItem, "id" | "created_at" | "updated_at">;
export type BundleItemUpdate = Partial<Omit<BundleItem, "id" | "bundle_id" | "created_at" | "updated_at">>;

export type OnboardingResponseInsert = Omit<OnboardingResponse, "id" | "created_at" | "updated_at">;
export type OnboardingResponseUpdate = Partial<Omit<OnboardingResponse, "id" | "user_id" | "step_key" | "created_at" | "updated_at">>;

export type EnrollmentInsert = Omit<Enrollment, "id" | "created_at" | "updated_at" | "progress_percent" | "sessions_completed">;
export type EnrollmentUpdate = Partial<Omit<Enrollment, "id" | "student_id" | "bundle_id" | "created_at" | "updated_at">>;

export type SessionInsert = Omit<Session, "id" | "created_at" | "updated_at">;
export type SessionUpdate = Partial<Omit<Session, "id" | "teacher_id" | "student_id" | "created_at" | "updated_at">>;

export type JournalEntryInsert = Omit<JournalEntry, "id" | "created_at" | "updated_at">;
export type JournalEntryUpdate = Partial<Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">>;

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      teacher_profiles: {
        Row: TeacherProfile;
        Insert: TeacherProfileInsert;
        Update: TeacherProfileUpdate;
      };
      bundles: {
        Row: Bundle;
        Insert: BundleInsert;
        Update: BundleUpdate;
      };
      bundle_items: {
        Row: BundleItem;
        Insert: BundleItemInsert;
        Update: BundleItemUpdate;
      };
      onboarding_responses: {
        Row: OnboardingResponse;
        Insert: OnboardingResponseInsert;
        Update: OnboardingResponseUpdate;
      };
      enrollments: {
        Row: Enrollment;
        Insert: EnrollmentInsert;
        Update: EnrollmentUpdate;
      };
      sessions: {
        Row: Session;
        Insert: SessionInsert;
        Update: SessionUpdate;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: JournalEntryInsert;
        Update: JournalEntryUpdate;
      };
    };
    Enums: {
      user_role: UserRole;
      session_status: SessionStatus;
      enrollment_status: EnrollmentStatus;
      bundle_status: BundleStatus;
    };
  };
}
