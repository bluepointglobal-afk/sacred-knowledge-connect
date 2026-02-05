-- Phase 2 (global): teacher payout + timezone fields
-- Supports global teacher onboarding (North Africa / SE Asia) and cross-timezone scheduling.

BEGIN;

ALTER TABLE teacher_profiles
  ADD COLUMN IF NOT EXISTS payout_method TEXT,
  ADD COLUMN IF NOT EXISTS iban_or_account_number TEXT,
  ADD COLUMN IF NOT EXISTS country_of_bank TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Optional: constrain payout_method values (soft constraint via CHECK)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'teacher_profiles_payout_method_check'
  ) THEN
    ALTER TABLE teacher_profiles
      ADD CONSTRAINT teacher_profiles_payout_method_check
      CHECK (payout_method IS NULL OR payout_method IN ('wise', 'paypal', 'iban'));
  END IF;
END
$$;

COMMIT;
