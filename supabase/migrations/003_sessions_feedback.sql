-- ============================================
-- SACRED KNOWLEDGE CONNECT - SESSIONS & FEEDBACK
-- Version: 1.2 (Sessions Lifecycle)
-- Run this AFTER 002_hardening.sql
-- ============================================

-- ============================================
-- A) FEEDBACK TABLE
-- Student ratings/reviews for completed sessions
-- ============================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(session_id) -- Only one feedback per session
);

CREATE INDEX idx_feedback_session_id ON feedback(session_id);
CREATE INDEX idx_feedback_student_id ON feedback(student_id);
CREATE INDEX idx_feedback_teacher_id ON feedback(teacher_id);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Students can view their own feedback
CREATE POLICY "Students can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can view feedback for their sessions
CREATE POLICY "Teachers can view feedback on their sessions"
  ON feedback FOR SELECT
  USING (
    teacher_id IN (SELECT user_id FROM teacher_profiles WHERE user_id = auth.uid())
  );

-- Students can insert feedback only for completed sessions they attended
CREATE POLICY "Students can create feedback for completed sessions"
  ON feedback FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    AND session_id IN (
      SELECT s.id FROM sessions s
      WHERE s.student_id = auth.uid()
      AND s.status = 'completed'
    )
  );

-- No update/delete for feedback (immutable once submitted)

-- ============================================
-- B) SESSIONS TABLE ENHANCEMENTS
-- Add composite index for enrollment queries
-- ============================================

-- Composite index for session queries by enrollment
CREATE INDEX IF NOT EXISTS idx_sessions_enrollment_status
  ON sessions(enrollment_id, status, scheduled_at);

-- Index for upcoming sessions query
CREATE INDEX IF NOT EXISTS idx_sessions_student_scheduled
  ON sessions(student_id, status, scheduled_at)
  WHERE status = 'scheduled';

-- ============================================
-- C) ADDITIONAL RLS POLICIES FOR SESSIONS
-- Tighten existing policies for session lifecycle
-- ============================================

-- Drop existing student update policy and create more restrictive one
DROP POLICY IF EXISTS "Students can update session feedback" ON sessions;

-- Students can only cancel their own scheduled sessions
CREATE POLICY "Students can cancel own scheduled sessions"
  ON sessions FOR UPDATE
  USING (
    auth.uid() = student_id
    AND status = 'scheduled'
  )
  WITH CHECK (
    auth.uid() = student_id
    AND status IN ('cancelled') -- Students can only cancel
  );

-- Students can add their notes to any of their sessions
CREATE POLICY "Students can update own session notes"
  ON sessions FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (
    auth.uid() = student_id
    -- Only allow updating notes_student field (enforced at app level)
  );

-- Teachers can mark sessions complete and add notes/links
DROP POLICY IF EXISTS "Teachers can update own sessions" ON sessions;

CREATE POLICY "Teachers can update sessions they teach"
  ON sessions FOR UPDATE
  USING (
    teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    teacher_id IN (SELECT id FROM teacher_profiles WHERE user_id = auth.uid())
  );

-- Students can create sessions for their enrollments
DROP POLICY IF EXISTS "Students can create sessions" ON sessions;

CREATE POLICY "Students can schedule sessions for own enrollments"
  ON sessions FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    AND enrollment_id IN (
      SELECT id FROM enrollments WHERE student_id = auth.uid() AND status = 'active'
    )
  );

-- ============================================
-- D) TRIGGER: Update enrollment progress on session completion
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_session_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Set completed_at if not already set
    IF NEW.completed_at IS NULL THEN
      NEW.completed_at = now();
    END IF;

    -- Update enrollment sessions_completed count
    IF NEW.enrollment_id IS NOT NULL THEN
      UPDATE enrollments
      SET
        sessions_completed = sessions_completed + 1,
        progress_percent = LEAST(100, ROUND(
          ((sessions_completed + 1)::numeric / NULLIF(
            (SELECT total_sessions FROM bundles WHERE id = enrollments.bundle_id), 0
          )) * 100
        )::integer)
      WHERE id = NEW.enrollment_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_session_completed ON sessions;

CREATE TRIGGER on_session_completed
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_session_completed();

-- ============================================
-- E) TRIGGER: Update teacher stats on session completion
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_teacher_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE teacher_profiles
    SET total_sessions = total_sessions + 1
    WHERE id = NEW.teacher_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_session_teacher_stats ON sessions;

CREATE TRIGGER on_session_teacher_stats
  AFTER UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_teacher_session_stats();

-- ============================================
-- F) TRIGGER: Update teacher rating on feedback
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_feedback_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC(3,2);
  teacher_profile_id UUID;
BEGIN
  -- Get teacher_profile_id from session
  SELECT s.teacher_id INTO teacher_profile_id
  FROM sessions s
  WHERE s.id = NEW.session_id;

  -- Calculate new average rating for teacher
  SELECT AVG(f.rating)::NUMERIC(3,2) INTO avg_rating
  FROM feedback f
  JOIN sessions s ON f.session_id = s.id
  WHERE s.teacher_id = teacher_profile_id;

  -- Update teacher profile
  UPDATE teacher_profiles
  SET average_rating = COALESCE(avg_rating, 0)
  WHERE id = teacher_profile_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_feedback_created ON feedback;

CREATE TRIGGER on_feedback_created
  AFTER INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_feedback_rating();

-- ============================================
-- G) HELPER FUNCTION: Get upcoming sessions for student
-- ============================================

CREATE OR REPLACE FUNCTION public.get_upcoming_sessions(user_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  session_id UUID,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  meeting_url TEXT,
  bundle_title TEXT,
  teacher_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id as session_id,
    s.scheduled_at,
    s.duration_minutes,
    s.meeting_url,
    b.title as bundle_title,
    COALESCE(p.full_name, p.email) as teacher_name
  FROM sessions s
  JOIN enrollments e ON s.enrollment_id = e.id
  JOIN bundles b ON e.bundle_id = b.id
  JOIN teacher_profiles tp ON s.teacher_id = tp.id
  JOIN profiles p ON tp.user_id = p.id
  WHERE s.student_id = user_uuid
    AND s.status = 'scheduled'
    AND s.scheduled_at > now()
  ORDER BY s.scheduled_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- END OF SESSIONS & FEEDBACK MIGRATION
-- ============================================
