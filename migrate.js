const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wmhieeqtuewvagwrphte.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaGllZXF0dWV3dmFnd3JwaHRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMzNzI0OSwiZXhwIjoyMDgxOTEzMjQ5fQ.Oj2CIY5N4HN6yx0CGVLoeHzKp9gBeAgb_DrzicUDXmI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const migration = `
BEGIN;

ALTER TABLE teacher_profiles
  ADD COLUMN IF NOT EXISTS payout_method TEXT,
  ADD COLUMN IF NOT EXISTS iban_or_account_number TEXT,
  ADD COLUMN IF NOT EXISTS country_of_bank TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS country_of_residence TEXT,
  ADD COLUMN IF NOT EXISTS teaching_languages JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS regional_specialization TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'teacher_profiles_payout_method_check'
  ) THEN
    ALTER TABLE teacher_profiles
      ADD CONSTRAINT teacher_profiles_payout_method_check
      CHECK (payout_method IS NULL OR payout_method IN ('wise', 'paypal', 'iban'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'teacher_profiles_regional_specialization_check'
  ) THEN
    ALTER TABLE teacher_profiles
      ADD CONSTRAINT teacher_profiles_regional_specialization_check
      CHECK (regional_specialization IS NULL OR regional_specialization IN ('north_africa', 'south_asia', 'middle_east', 'western_diaspora'));
  END IF;
END
$$;

COMMIT;
`;

(async () => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: migration });
    if (error) {
      console.error('Migration error:', error);
    } else {
      console.log('✅ Migration successful');
      console.log('Response:', data);
    }
  } catch (err) {
    console.error('Execution error:', err.message);
  }
})();
