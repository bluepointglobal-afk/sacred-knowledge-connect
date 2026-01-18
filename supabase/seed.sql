-- ============================================
-- SEED DATA FOR DEVELOPMENT
-- Run this after schema.sql to populate test data
-- ============================================

-- First, create test users in auth.users (you'll need to do this via Supabase Auth UI or signup)
-- For now, we'll create profiles manually that match existing auth users

-- If you have a test user, get their ID from auth.users and insert here:
-- INSERT INTO profiles (id, email, full_name, role) VALUES ('your-user-id', 'your@email.com', 'Your Name', 'teacher');

-- For development, let's create some teacher profiles with placeholder UUIDs
-- These will need real user IDs from auth.users to work properly

-- Sample teacher profiles (will work once you have users)
-- You can run this after signing up as a teacher

/*
-- Example: After creating a user, run:

-- 1. First update their role to 'teacher':
UPDATE profiles SET role = 'teacher', full_name = 'Sheikh Ahmad Ibrahim' WHERE email = 'your-teacher-email@example.com';

-- 2. Then create their teacher profile:
INSERT INTO teacher_profiles (user_id, bio, headline, specializations, qualifications, hourly_rate_cents, currency, years_experience, is_verified, is_featured)
SELECT id,
  'Dedicated to teaching Quran with proper Tajweed. Over 15 years of experience teaching students from around the world.',
  'Quran & Tajweed Specialist',
  ARRAY['Quran Memorization', 'Tajweed', 'Tafsir'],
  ARRAY['Ijazah in Quran', 'Islamic University of Madinah'],
  5000,
  'USD',
  15,
  true,
  true
FROM profiles WHERE email = 'your-teacher-email@example.com';
*/

-- Sample bundles (will work once you have teacher_profiles)
/*
INSERT INTO bundles (teacher_id, title, description, short_description, price_cents, currency, duration_weeks, total_sessions, category, tags, level, status, is_featured)
SELECT id,
  'Quran Memorization Program',
  'A comprehensive program designed to help you memorize the Quran with proper Tajweed. Includes weekly sessions, revision schedules, and progress tracking.',
  'Memorize the Quran with proper Tajweed',
  29900,
  'USD',
  12,
  24,
  'Quran',
  ARRAY['memorization', 'hifz', 'tajweed'],
  'beginner',
  'published',
  true
FROM teacher_profiles LIMIT 1;
*/

-- ============================================
-- QUICK START: Run these commands after you have at least one user
-- ============================================

-- Check if you have any users:
-- SELECT id, email FROM profiles;

-- Make a user a teacher:
-- UPDATE profiles SET role = 'teacher' WHERE email = 'your@email.com';

-- ============================================
-- END OF SEED DATA
-- ============================================
