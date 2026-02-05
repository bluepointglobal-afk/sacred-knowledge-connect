import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'wmhieeqtuewvagwrphte.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'admin123',
  ssl: { rejectUnauthorized: false }
});

const migrationSQL = `
ALTER TABLE teacher_profiles
  ADD COLUMN IF NOT EXISTS payout_method TEXT,
  ADD COLUMN IF NOT EXISTS iban_or_account_number TEXT,
  ADD COLUMN IF NOT EXISTS country_of_bank TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS country_of_residence TEXT,
  ADD COLUMN IF NOT EXISTS teaching_languages JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS regional_specialization TEXT;

ALTER TABLE teacher_profiles
  ADD CONSTRAINT teacher_profiles_payout_method_check
  CHECK (payout_method IS NULL OR payout_method IN ('wise', 'paypal', 'iban'));

ALTER TABLE teacher_profiles
  ADD CONSTRAINT teacher_profiles_regional_specialization_check
  CHECK (regional_specialization IS NULL OR regional_specialization IN ('north_africa', 'south_asia', 'middle_east', 'western_diaspora'));
`;

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL');
    
    await client.query(migrationSQL);
    console.log('✅ Migration executed successfully!');
    console.log('✅ teacher_profiles table schema updated');
    
    await client.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
