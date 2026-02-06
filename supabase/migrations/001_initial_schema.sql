-- ============================================
-- SACRED KNOWLEDGE CONNECT - DATABASE SCHEMA
-- Version: 1.0 (MVP)
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'paused', 'cancelled');
CREATE TYPE bundle_status AS ENUM ('draft', 'published', 'archived');

-- ============================================
-- TABLE: profiles
-- Base user profile, auto-created on signup
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'student' NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read any profile (for teacher listings)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles are created via trigger, not direct insert
CREATE POLICY "Profiles are created via trigger"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLE: teacher_profiles
-- Extended profile for verified teachers
-- ============================================

CREATE TABLE teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  headline TEXT,
  specializations TEXT[] DEFAULT '{}',
  qualifications TEXT[] DEFAULT '{}',
  hourly_rate_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  years_experience INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  video_intro_url TEXT,
  availability JSONB DEFAULT '{}',
  total_students INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

CREATE INDEX idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX idx_teacher_profiles_verified ON teacher_profiles(is_verified) WHERE is_verified = true;
CREATE INDEX idx_teacher_profiles_featured ON teacher_profiles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_teacher_profiles_specializations ON teacher_profiles USING GIN(specializations);

ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view verified teacher profiles
CREATE POLICY "Verified teachers are viewable by everyone"
  ON teacher_profiles FOR SELECT
  USING (is_verified = true OR auth.uid() = user_id);

-- Teachers can update their own profile
CREATE POLICY "Teachers can update own profile"
  ON teacher_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Teachers can insert their own profile
CREATE POLICY "Teachers can create own profile"
  ON teacher_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TABLE: bundles
-- Learning packages/courses created by teachers
-- ============================================

CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  cover_image_url TEXT,
  price_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  duration_weeks INTEGER DEFAULT 4,
  total_sessions INTEGER DEFAULT 4,
  max_students INTEGER,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  level TEXT DEFAULT 'beginner',
  status bundle_status DEFAULT 'draft' NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  total_enrollments INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_bundles_teacher_id ON bundles(teacher_id);
CREATE INDEX idx_bundles_status ON bundles(status);
CREATE INDEX idx_bundles_category ON bundles(category);
CREATE INDEX idx_bundles_tags ON bundles USING GIN(tags);
CREATE INDEX idx_bundles_featured ON bundles(is_featured) WHERE is_featured = true;

ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

-- Published bundles are viewable by everyone
CREATE POLICY "Published bundles are viewable by everyone"
  ON bundles FOR SELECT
  USING (
    status = 'published'
    OR teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
  );

-- Teachers can manage their own bundles
CREATE POLICY "Teachers can insert own bundles"
  ON bundles FOR INSERT
  WITH CHECK (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can update own bundles"
  ON bundles FOR UPDATE
  USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()))
  WITH CHECK (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can delete own bundles"
  ON bundles FOR DELETE
  USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

-- ============================================
-- TABLE: bundle_items
-- Individual lessons/materials within a bundle
-- ============================================

CREATE TABLE bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT DEFAULT 'lesson',
  content_url TEXT,
  duration_minutes INTEGER DEFAULT 60,
  sort_order INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_bundle_items_bundle_id ON bundle_items(bundle_id);
CREATE INDEX idx_bundle_items_sort_order ON bundle_items(bundle_id, sort_order);

ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: onboarding_responses
-- User answers from onboarding flow
-- ============================================

CREATE TABLE onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, step_key)
);

CREATE INDEX idx_onboarding_responses_user_id ON onboarding_responses(user_id);

ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Users can only access their own onboarding responses
CREATE POLICY "Users can view own onboarding responses"
  ON onboarding_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses"
  ON onboarding_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses"
  ON onboarding_responses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TABLE: enrollments
-- Student enrollment in bundles
-- ============================================

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'active' NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  sessions_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(student_id, bundle_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_bundle_id ON enrollments(bundle_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can view enrollments in their bundles
CREATE POLICY "Teachers can view enrollments in their bundles"
  ON enrollments FOR SELECT
  USING (
    bundle_id IN (
      SELECT b.id FROM bundles b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  );

-- Students can enroll themselves
CREATE POLICY "Students can create own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own enrollments (pause, etc)
CREATE POLICY "Students can update own enrollments"
  ON enrollments FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- ============================================
-- POLICIES FOR bundle_items (after enrollments exists)
-- ============================================

-- Bundle items follow bundle visibility
CREATE POLICY "Bundle items viewable if bundle is viewable"
  ON bundle_items FOR SELECT
  USING (
    bundle_id IN (
      SELECT id FROM bundles
      WHERE status = 'published'
      OR teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
    )
    OR bundle_id IN (
      SELECT bundle_id FROM enrollments WHERE student_id = auth.uid()
    )
  );

-- Teachers can manage items in their bundles
CREATE POLICY "Teachers can insert bundle items"
  ON bundle_items FOR INSERT
  WITH CHECK (
    bundle_id IN (
      SELECT b.id FROM bundles b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update bundle items"
  ON bundle_items FOR UPDATE
  USING (
    bundle_id IN (
      SELECT b.id FROM bundles b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete bundle items"
  ON bundle_items FOR DELETE
  USING (
    bundle_id IN (
      SELECT b.id FROM bundles b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  );

-- ============================================
-- TABLE: sessions
-- Scheduled 1-on-1 or group sessions
-- ============================================

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bundle_id UUID REFERENCES bundles(id) ON DELETE SET NULL,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status session_status DEFAULT 'scheduled' NOT NULL,
  meeting_url TEXT,
  notes_teacher TEXT,
  notes_student TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_sessions_teacher_id ON sessions(teacher_id);
CREATE INDEX idx_sessions_student_id ON sessions(student_id);
CREATE INDEX idx_sessions_bundle_id ON sessions(bundle_id);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_sessions_status ON sessions(status);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Students can view their own sessions
CREATE POLICY "Students can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can view sessions they teach
CREATE POLICY "Teachers can view own sessions"
  ON sessions FOR SELECT
  USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

-- Teachers can create sessions
CREATE POLICY "Teachers can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

-- Teachers can update sessions they teach
CREATE POLICY "Teachers can update own sessions"
  ON sessions FOR UPDATE
  USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));

-- Students can update their session notes and feedback
CREATE POLICY "Students can update session feedback"
  ON sessions FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- ============================================
-- TABLE: journal_entries
-- Student reflection/journaling
-- ============================================

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bundle_id UUID REFERENCES bundles(id) ON DELETE SET NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_bundle_id ON journal_entries(bundle_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_tags ON journal_entries USING GIN(tags);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Users can only access their own journal entries
CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION & TRIGGER: Auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON bundles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON bundle_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON onboarding_responses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- END OF SCHEMA
-- ============================================
