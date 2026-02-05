import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmhieeqtuewvagwrphte.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaGllZXF0dWV3dmFnd3JwaHRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMzNzI0OSwiZXhwIjoyMDgxOTEzMjQ5fQ.Oj2CIY5N4HN6yx0CGVLoeHzKp9gBeAgb_DrzicUDXmI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const migration = `
ALTER TABLE teacher_profiles
  ADD COLUMN IF NOT EXISTS payout_method TEXT,
  ADD COLUMN IF NOT EXISTS iban_or_account_number TEXT,
  ADD COLUMN IF NOT EXISTS country_of_bank TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS country_of_residence TEXT,
  ADD COLUMN IF NOT EXISTS teaching_languages JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS regional_specialization TEXT;
`;

(async () => {
  try {
    // Check if columns already exist
    const { data: columns, error: checkError } = await supabase
      .from('teacher_profiles')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking table:', checkError);
      return;
    }
    
    console.log('✅ Connected to Supabase');
    console.log('✅ teacher_profiles table exists');
    console.log('📝 Columns in table:', Object.keys(columns[0] || {}));
    
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
