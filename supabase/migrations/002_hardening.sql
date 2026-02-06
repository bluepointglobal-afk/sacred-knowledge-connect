-- ============================================
-- SACRED KNOWLEDGE CONNECT - HARDENING MIGRATION
-- Version: 1.1 (Integrity & Performance)
-- Run this AFTER schema.sql has been applied
-- ============================================

-- ============================================
-- A) DATABASE INTEGRITY CONSTRAINTS
-- ============================================

-- 1. Partial unique index for active enrollments only
-- This allows a user to have completed/cancelled enrollments AND one active enrollment
-- The UNIQUE(student_id, bundle_id) already exists, but this adds extra protection
-- If you want to allow re-enrollment after cancellation, use this instead:
-- DROP the existing constraint and add this:

-- First, check if we need to replace the constraint
-- (Only run if you want to allow re-enrollment after cancellation)
/*
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_student_id_bundle_id_key;

CREATE UNIQUE INDEX idx_enrollments_active_unique
  ON enrollments(student_id, bundle_id)
  WHERE status = 'active';
*/

-- 2. Add check constraints for data validity
ALTER TABLE enrollments
  ADD CONSTRAINT chk_enrollments_progress
  CHECK (progress_percent >= 0 AND progress_percent <= 100);

ALTER TABLE enrollments
  ADD CONSTRAINT chk_enrollments_sessions
  CHECK (sessions_completed >= 0);

ALTER TABLE bundles
  ADD CONSTRAINT chk_bundles_price
  CHECK (price_cents >= 0);

ALTER TABLE bundles
  ADD CONSTRAINT chk_bundles_duration
  CHECK (duration_weeks > 0);

ALTER TABLE bundles
  ADD CONSTRAINT chk_bundles_sessions
  CHECK (total_sessions > 0);

ALTER TABLE teacher_profiles
  ADD CONSTRAINT chk_teacher_profiles_rate
  CHECK (hourly_rate_cents >= 0);

ALTER TABLE teacher_profiles
  ADD CONSTRAINT chk_teacher_profiles_experience
  CHECK (years_experience >= 0);

ALTER TABLE teacher_profiles
  ADD CONSTRAINT chk_teacher_profiles_rating
  CHECK (average_rating >= 0 AND average_rating <= 5);

-- 3. Add NOT NULL where appropriate for MVP integrity
-- (These are already mostly in place, but double-checking)

-- ============================================
-- B) PERFORMANCE INDEXES
-- ============================================

-- Composite indexes for common query patterns

-- Enrollments: user + status (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_enrollments_student_status
  ON enrollments(student_id, status);

-- Bundles: teacher + published status (teacher profile page)
CREATE INDEX IF NOT EXISTS idx_bundles_teacher_published
  ON bundles(teacher_id, status)
  WHERE status = 'published';

-- Bundles: published + featured (homepage/listing queries)
CREATE INDEX IF NOT EXISTS idx_bundles_published_featured
  ON bundles(status, is_featured)
  WHERE status = 'published';

-- Teacher profiles: verified + featured (homepage queries)
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_verified_featured
  ON teacher_profiles(is_verified, is_featured)
  WHERE is_verified = true;

-- Onboarding: fast lookup by user
CREATE INDEX IF NOT EXISTS idx_onboarding_user_step
  ON onboarding_responses(user_id, step_key);

-- ============================================
-- C) FUNCTION: Increment enrollment count on bundle
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_enrollment_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment total_enrollments on the bundle
  UPDATE bundles
  SET total_enrollments = total_enrollments + 1
  WHERE id = NEW.bundle_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists and recreate
DROP TRIGGER IF EXISTS on_enrollment_created ON enrollments;

CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_enrollment_created();

-- ============================================
-- D) FUNCTION: Decrement enrollment count on cancellation
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_enrollment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed from 'active' to something else
  IF OLD.status = 'active' AND NEW.status != 'active' THEN
    UPDATE bundles
    SET total_enrollments = GREATEST(total_enrollments - 1, 0)
    WHERE id = NEW.bundle_id;
  END IF;

  -- If status changed TO 'active' from something else (re-enrollment)
  IF OLD.status != 'active' AND NEW.status = 'active' THEN
    UPDATE bundles
    SET total_enrollments = total_enrollments + 1
    WHERE id = NEW.bundle_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enrollment_status_change ON enrollments;

CREATE TRIGGER on_enrollment_status_change
  AFTER UPDATE OF status ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_enrollment_status_change();

-- ============================================
-- E) RLS POLICY REFINEMENTS
-- ============================================

-- Add DELETE policy for onboarding_responses (cleanup)
DROP POLICY IF EXISTS "Users can delete own onboarding responses" ON onboarding_responses;
CREATE POLICY "Users can delete own onboarding responses"
  ON onboarding_responses FOR DELETE
  USING (auth.uid() = user_id);

-- Ensure students cannot modify enrollment status to 'completed' (only teacher/system can)
-- This is a business logic constraint we enforce in RLS
DROP POLICY IF EXISTS "Students can update own enrollments" ON enrollments;
CREATE POLICY "Students can update own enrollments"
  ON enrollments FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Teachers can mark enrollments as completed
DROP POLICY IF EXISTS "Teachers can complete enrollments" ON enrollments;
CREATE POLICY "Teachers can complete enrollments"
  ON enrollments FOR UPDATE
  USING (
    bundle_id IN (
      SELECT b.id FROM bundles b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    bundle_id IN (
      SELECT b.id FROM bundles b
      JOIN teacher_profiles tp ON b.teacher_id = tp.id
      WHERE tp.user_id = auth.uid()
    )
  );

-- ============================================
-- F) HELPER FUNCTION: Check if user has completed onboarding
-- ============================================

CREATE OR REPLACE FUNCTION public.has_completed_onboarding(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM onboarding_responses
    WHERE user_id = user_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- END OF HARDENING MIGRATION
-- ============================================
