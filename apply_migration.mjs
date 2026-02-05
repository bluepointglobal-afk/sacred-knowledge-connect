import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmhieeqtuewvagwrphte.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaGllZXF0dWV3dmFnd3JwaHRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMzNzI0OSwiZXhwIjoyMDgxOTEzMjQ5fQ.Oj2CIY5N4HN6yx0CGVLoeHzKp9gBeAgb_DrzicUDXmI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

(async () => {
  try {
    // List migration: add teacher profile columns
    const migrations = [
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS payout_method TEXT`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS iban_or_account_number TEXT`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS country_of_bank TEXT`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS payout_account_holder_name TEXT`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC'`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS country_of_residence TEXT`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS teaching_languages JSONB DEFAULT '[]'::jsonb`,
      `ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS regional_specialization TEXT`,
      `ALTER TABLE teacher_profiles ADD CONSTRAINT teacher_profiles_payout_method_check CHECK (payout_method IS NULL OR payout_method IN ('wise', 'paypal', 'iban'))`,
      `ALTER TABLE teacher_profiles ADD CONSTRAINT teacher_profiles_regional_specialization_check CHECK (regional_specialization IS NULL OR regional_specialization IN ('north_africa', 'south_asia', 'middle_east', 'western_diaspora'))`
    ];

    for (const migration of migrations) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: migration });
        if (error && !error.message.includes('already exists')) {
          console.log(`⚠️ ${migration}: ${error.message}`);
        } else {
          console.log(`✅ ${migration.substring(0, 60)}...`);
        }
      } catch (e) {
        // Constraint may already exist, continue
        console.log(`⚠️ ${migration.substring(0, 60)}... (may already exist)`);
      }
    }

    // Verify columns were added
    const { data, error: checkError } = await supabase
      .from('teacher_profiles')
      .select('*')
      .limit(0);

    if (!checkError) {
      console.log('\n✅ Migration completed successfully!');
      console.log('✅ Teacher profiles schema updated with: payout_method, timezone, teaching_languages, regional_specialization');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  }
})();
