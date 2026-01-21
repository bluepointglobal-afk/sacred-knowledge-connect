-- Migration: 004_payments.sql
-- Purpose: Add payment tables for Stripe integration with escrow support
-- Created: 2025-01-20

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
  'pending',      -- Created, awaiting payment
  'held',         -- Payment received, in escrow
  'completed',    -- Session confirmed, funds released
  'refunded',     -- Fully or partially refunded
  'failed',       -- Payment failed
  'disputed'      -- Under dispute
);

-- Earning status enum
CREATE TYPE earning_status AS ENUM (
  'pending',      -- Awaiting escrow release
  'available',    -- Released, can be paid out
  'paid_out',     -- Paid to teacher
  'held',         -- On hold (dispute)
  'forfeited'     -- Lost due to refund/dispute
);

-- Payout status enum
CREATE TYPE payout_status AS ENUM (
  'pending',      -- Requested, not yet processed
  'processing',   -- Being processed by Stripe
  'completed',    -- Successfully paid
  'failed'        -- Payout failed
);

-- Payment type enum
CREATE TYPE payment_type AS ENUM (
  'session',      -- Single session purchase
  'bundle',       -- Bundle purchase
  'tip'           -- Optional tip
);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parties
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- What was purchased
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  bundle_id UUID REFERENCES bundles(id) ON DELETE SET NULL,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,

  -- Amount details
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  platform_fee_cents INTEGER NOT NULL CHECK (platform_fee_cents >= 0),
  teacher_amount_cents INTEGER NOT NULL CHECK (teacher_amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',

  -- Status
  status payment_status NOT NULL DEFAULT 'pending',
  payment_type payment_type NOT NULL,

  -- Stripe references
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  stripe_charge_id TEXT,

  -- Escrow tracking
  escrow_released_at TIMESTAMPTZ,

  -- Refund tracking
  refund_amount_cents INTEGER DEFAULT 0,
  refund_reason TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT payment_has_item CHECK (session_id IS NOT NULL OR bundle_id IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_teacher ON payments(teacher_id);
CREATE INDEX idx_payments_session ON payments(session_id);
CREATE INDEX idx_payments_bundle ON payments(bundle_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_pi ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_stripe_cs ON payments(stripe_checkout_session_id);

-- ============================================================================
-- TEACHER EARNINGS TABLE
-- ============================================================================

CREATE TABLE teacher_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Teacher
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Source
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  bundle_id UUID REFERENCES bundles(id) ON DELETE SET NULL,

  -- Amount
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',

  -- Status
  status earning_status NOT NULL DEFAULT 'pending',

  -- Escrow timing
  available_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_teacher_earnings_teacher ON teacher_earnings(teacher_id);
CREATE INDEX idx_teacher_earnings_payment ON teacher_earnings(payment_id);
CREATE INDEX idx_teacher_earnings_status ON teacher_earnings(status);
CREATE INDEX idx_teacher_earnings_available ON teacher_earnings(available_at);

-- ============================================================================
-- TEACHER PAYOUTS TABLE
-- ============================================================================

CREATE TABLE teacher_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Teacher
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Amount
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 5000), -- Min $50
  currency TEXT NOT NULL DEFAULT 'usd',

  -- Status
  status payout_status NOT NULL DEFAULT 'pending',

  -- Stripe references
  stripe_transfer_id TEXT,
  stripe_payout_id TEXT,

  -- Timing
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Failure tracking
  failure_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_teacher_payouts_teacher ON teacher_payouts(teacher_id);
CREATE INDEX idx_teacher_payouts_status ON teacher_payouts(status);

-- ============================================================================
-- ADD STRIPE COLUMNS TO EXISTING TABLES
-- ============================================================================

-- Add Stripe customer ID to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add Stripe Connect fields to teacher_profiles
ALTER TABLE teacher_profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_payouts ENABLE ROW LEVEL SECURITY;

-- Payments: Students see their payments, teachers see payments to them
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (
    auth.uid() = student_id OR auth.uid() = teacher_id
  );

-- Payments: Only service role can insert/update (via Edge Functions)
CREATE POLICY "payments_service_role" ON payments
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Teacher Earnings: Teachers see their own
CREATE POLICY "teacher_earnings_select_own" ON teacher_earnings
  FOR SELECT USING (auth.uid() = teacher_id);

-- Teacher Earnings: Only service role can insert/update
CREATE POLICY "teacher_earnings_service_role" ON teacher_earnings
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Teacher Payouts: Teachers see their own
CREATE POLICY "teacher_payouts_select_own" ON teacher_payouts
  FOR SELECT USING (auth.uid() = teacher_id);

-- Teacher Payouts: Teachers can request (insert)
CREATE POLICY "teacher_payouts_insert_own" ON teacher_payouts
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

-- Teacher Payouts: Only service role can update
CREATE POLICY "teacher_payouts_update_service" ON teacher_payouts
  FOR UPDATE USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at on payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get teacher's available balance (earnings that can be paid out)
CREATE OR REPLACE FUNCTION get_teacher_available_balance(p_teacher_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount_cents), 0)
  INTO v_balance
  FROM teacher_earnings
  WHERE teacher_id = p_teacher_id
    AND status = 'available';

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get teacher's pending balance (in escrow)
CREATE OR REPLACE FUNCTION get_teacher_pending_balance(p_teacher_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount_cents), 0)
  INTO v_balance
  FROM teacher_earnings
  WHERE teacher_id = p_teacher_id
    AND status = 'pending';

  RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate platform fee (15%)
CREATE OR REPLACE FUNCTION calculate_platform_fee(amount_cents INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN ROUND(amount_cents * 0.15);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate teacher amount (85%)
CREATE OR REPLACE FUNCTION calculate_teacher_amount(amount_cents INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN amount_cents - calculate_platform_fee(amount_cents);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
