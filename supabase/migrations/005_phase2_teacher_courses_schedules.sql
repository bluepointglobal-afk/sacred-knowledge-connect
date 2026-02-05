-- Phase 2: Teacher onboarding + courses + schedules
-- Adds a few teacher onboarding fields and introduces courses + schedules tables.

BEGIN;

-- Extend teacher_profiles to support the onboarding form fields
ALTER TABLE teacher_profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS credentials_url TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- ============================================
-- TABLE: courses
-- Simple course objects created by teachers
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_per_session_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  max_students INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Public can view published courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Published courses are viewable by everyone'
  ) THEN
    CREATE POLICY "Published courses are viewable by everyone"
      ON courses FOR SELECT
      USING (
        status = 'published'
        OR teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
      );
  END IF;
END
$$;

-- Teachers can manage their own courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Teachers can insert own courses'
  ) THEN
    CREATE POLICY "Teachers can insert own courses"
      ON courses FOR INSERT
      WITH CHECK (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Teachers can update own courses'
  ) THEN
    CREATE POLICY "Teachers can update own courses"
      ON courses FOR UPDATE
      USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()))
      WITH CHECK (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'courses' AND policyname = 'Teachers can delete own courses'
  ) THEN
    CREATE POLICY "Teachers can delete own courses"
      ON courses FOR DELETE
      USING (teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid()));
  END IF;
END
$$;

-- ============================================
-- TABLE: schedules
-- Weekly availability blocks per course
-- ============================================

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_schedules_course_id ON schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_of_week ON schedules(day_of_week);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can read schedules for published courses; teachers can read their own.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedules' AND policyname = 'Schedules are viewable for published courses'
  ) THEN
    CREATE POLICY "Schedules are viewable for published courses"
      ON schedules FOR SELECT
      USING (
        course_id IN (SELECT id FROM courses WHERE status = 'published')
        OR course_id IN (
          SELECT c.id
          FROM courses c
          JOIN teacher_profiles tp ON tp.id = c.teacher_id
          WHERE tp.user_id = auth.uid()
        )
      );
  END IF;
END
$$;

-- Teachers can manage schedules for their own courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedules' AND policyname = 'Teachers can insert own schedules'
  ) THEN
    CREATE POLICY "Teachers can insert own schedules"
      ON schedules FOR INSERT
      WITH CHECK (
        course_id IN (
          SELECT c.id
          FROM courses c
          JOIN teacher_profiles tp ON tp.id = c.teacher_id
          WHERE tp.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedules' AND policyname = 'Teachers can update own schedules'
  ) THEN
    CREATE POLICY "Teachers can update own schedules"
      ON schedules FOR UPDATE
      USING (
        course_id IN (
          SELECT c.id
          FROM courses c
          JOIN teacher_profiles tp ON tp.id = c.teacher_id
          WHERE tp.user_id = auth.uid()
        )
      )
      WITH CHECK (
        course_id IN (
          SELECT c.id
          FROM courses c
          JOIN teacher_profiles tp ON tp.id = c.teacher_id
          WHERE tp.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schedules' AND policyname = 'Teachers can delete own schedules'
  ) THEN
    CREATE POLICY "Teachers can delete own schedules"
      ON schedules FOR DELETE
      USING (
        course_id IN (
          SELECT c.id
          FROM courses c
          JOIN teacher_profiles tp ON tp.id = c.teacher_id
          WHERE tp.user_id = auth.uid()
        )
      );
  END IF;
END
$$;

COMMIT;
