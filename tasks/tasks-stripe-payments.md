# Tasks: Stripe Payment Integration (P0)

> Feature: Complete Stripe Payments with Escrow
> Priority: P0 (Critical)
> Branch: feat/stripe-payments

---

## Overview

Complete the Stripe payment integration to enable:
- Paid bundle purchases (existing, enhance)
- Hourly session purchases (new)
- Escrow system (hold → confirm → release)
- Teacher payouts via Stripe Connect

---

## Completed Stories

### SP-01: Stripe Setup & Configuration ✅
- [x] Stripe account and API keys
- [x] Environment variables configured
- [x] Stripe client initialization
- [x] Webhook endpoint configured

### SP-02: Database Schema ✅
- [x] `payments` table created
- [x] `teacher_earnings` table created
- [x] `teacher_payouts` table created
- [x] `stripe_customer_id` on profiles
- [x] `stripe_account_id` on teacher_profiles
- [x] RLS policies for payment tables

### SP-03: Payment Hooks ✅
- [x] `usePayments.ts` - payment data hooks
- [x] `useCreateCheckout()` - create checkout session
- [x] `usePaymentStatus()` - check payment status

### SP-04: Checkout UI Components ✅
- [x] `CheckoutButton.tsx` - trigger checkout
- [x] `CheckoutSuccess.tsx` - success page
- [x] `CheckoutCancel.tsx` - cancel page
- [x] Price formatting utilities

### SP-05: BundleDetail Payment Flow ✅
- [x] "Buy Now" button for paid bundles
- [x] Free bundle direct enrollment
- [x] Checkout redirect flow

### SP-06: Teacher Earnings Hook & Page ✅
- [x] `useEarnings.ts` - earnings data hooks
- [x] `TeacherEarnings.tsx` - earnings dashboard
- [x] Earnings summary display

---

## Remaining Stories

### SP-07: Session Purchase Checkout

**Goal:** Enable students to purchase single hourly sessions

**Tasks:**
- [ ] 7.1 Create `useSessionCheckout.ts` hook
- [ ] 7.2 Update `create-checkout-session` Edge Function for session type
- [ ] 7.3 Create `SessionCheckoutButton.tsx` component
- [ ] 7.4 Add checkout flow to teacher profile page
- [ ] 7.5 Handle session creation on checkout success
- [ ] 7.6 Calculate price from teacher hourly rate

**Acceptance Criteria:**
- [ ] Student can purchase a session from teacher profile
- [ ] Session is created with status 'scheduled' after payment
- [ ] Payment record linked to session

---

### SP-08: Escrow Hold System

**Goal:** Hold payments in escrow until session is confirmed complete

**Tasks:**
- [ ] 8.1 Add `status: 'held'` as initial payment state (not 'completed')
- [ ] 8.2 Update payment creation in webhook to use 'held' status
- [ ] 8.3 Add `escrow_released_at` column to payments table
- [ ] 8.4 Create `teacher_earnings` with status 'pending' (not 'available')
- [ ] 8.5 Add `available_at` timestamp to earnings (null until released)
- [ ] 8.6 Update earnings dashboard to show pending vs available

**Acceptance Criteria:**
- [ ] New payments start with status 'held'
- [ ] Earnings show as 'pending' until escrow releases
- [ ] Earnings dashboard distinguishes pending vs available

**Database Changes:**
```sql
-- Ensure payment status supports 'held'
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'held';

-- Add escrow release timestamp
ALTER TABLE payments ADD COLUMN IF NOT EXISTS
  escrow_released_at TIMESTAMPTZ;

-- Ensure earning status supports states
ALTER TYPE earning_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE earning_status ADD VALUE IF NOT EXISTS 'available';
```

---

### SP-09: Escrow Release Logic

**Goal:** Automatically release escrow 24 hours after session completion

**Tasks:**
- [ ] 9.1 Create `release-escrow` Edge Function
- [ ] 9.2 Trigger on session status change to 'completed'
- [ ] 9.3 Set `available_at` to NOW() + 24 hours
- [ ] 9.4 Create scheduled job to release mature escrows
- [ ] 9.5 Update payment status from 'held' to 'completed'
- [ ] 9.6 Update earning status from 'pending' to 'available'
- [ ] 9.7 Handle no-show scenarios (student no-show = release, teacher no-show = refund)

**Acceptance Criteria:**
- [ ] Teacher marks session complete → escrow timer starts
- [ ] 24 hours later → funds become available
- [ ] Student no-show → teacher still gets paid
- [ ] Teacher no-show → auto-refund to student

**Edge Function: `release-escrow`**
```typescript
// Triggered by: pg_cron or session status change
// Logic:
// 1. Find earnings where available_at <= NOW() AND status = 'pending'
// 2. Update earning status to 'available'
// 3. Update payment status to 'completed'
// 4. Set escrow_released_at = NOW()
```

---

### SP-10: Stripe Connect Onboarding

**Goal:** Enable teachers to receive payouts via Stripe Connect

**Tasks:**
- [ ] 10.1 Create `create-connect-account` Edge Function
- [ ] 10.2 Create `create-connect-link` Edge Function (onboarding URL)
- [ ] 10.3 Create `TeacherStripeSetup.tsx` page
- [ ] 10.4 Store `stripe_account_id` after Connect creation
- [ ] 10.5 Handle `account.updated` webhook event
- [ ] 10.6 Track `charges_enabled` and `payouts_enabled` status
- [ ] 10.7 Add Connect status indicator to teacher dashboard
- [ ] 10.8 Block payout requests if Connect not complete

**Acceptance Criteria:**
- [ ] Teacher can initiate Stripe Connect onboarding
- [ ] Redirect to Stripe hosted onboarding flow
- [ ] Return to app with Connect account linked
- [ ] Dashboard shows Connect status
- [ ] Cannot request payout until Connect verified

**Edge Function: `create-connect-account`**
```typescript
// Creates Stripe Connect Express account
const account = await stripe.accounts.create({
  type: 'express',
  email: teacher.email,
  capabilities: {
    transfers: { requested: true },
  },
});
// Store account.id in teacher_profiles.stripe_account_id
```

---

### SP-11: Payout Request System

**Goal:** Teachers can request payouts of available earnings

**Tasks:**
- [ ] 11.1 Create `request-payout` Edge Function
- [ ] 11.2 Create `RequestPayoutButton.tsx` component
- [ ] 11.3 Create `PayoutHistory.tsx` component
- [ ] 11.4 Validate minimum payout ($50)
- [ ] 11.5 Validate Connect account is active
- [ ] 11.6 Create Transfer to Connected account
- [ ] 11.7 Create payout record with status 'pending'
- [ ] 11.8 Handle payout webhook events

**Acceptance Criteria:**
- [ ] Teacher sees available balance
- [ ] Can request payout if balance >= $50
- [ ] Blocked if Connect not verified
- [ ] Payout history shows all requests
- [ ] Status updates via webhook

**Edge Function: `request-payout`**
```typescript
// 1. Verify teacher has >= $50 available
// 2. Verify Stripe Connect is active
// 3. Create Stripe Transfer
const transfer = await stripe.transfers.create({
  amount: amountCents,
  currency: 'usd',
  destination: teacher.stripe_account_id,
});
// 4. Create payout record
```

---

### SP-12: Complete Webhook Handler

**Goal:** Handle all Stripe webhook events reliably

**Tasks:**
- [ ] 12.1 Handle `checkout.session.completed` (existing, verify)
- [ ] 12.2 Handle `payment_intent.succeeded`
- [ ] 12.3 Handle `payment_intent.payment_failed`
- [ ] 12.4 Handle `charge.refunded`
- [ ] 12.5 Handle `charge.dispute.created`
- [ ] 12.6 Handle `account.updated` (Connect)
- [ ] 12.7 Handle `transfer.created`
- [ ] 12.8 Handle `transfer.failed`
- [ ] 12.9 Handle `payout.paid`
- [ ] 12.10 Handle `payout.failed`
- [ ] 12.11 Add idempotency checks (prevent duplicate processing)
- [ ] 12.12 Add error logging and alerting

**Acceptance Criteria:**
- [ ] All payment lifecycle events handled
- [ ] Refunds update payment and earning status
- [ ] Disputes put earnings on hold
- [ ] Payout events update payout status
- [ ] No duplicate event processing

**Webhook Events Matrix:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create payment (held), session, earning (pending) |
| `payment_intent.payment_failed` | Mark payment failed, release slot hold |
| `charge.refunded` | Update payment to refunded, forfeit earning |
| `charge.dispute.created` | Mark payment disputed, hold earning |
| `account.updated` | Update teacher Connect status |
| `transfer.created` | Update payout to processing |
| `transfer.failed` | Update payout to failed |
| `payout.paid` | Update payout to completed |
| `payout.failed` | Update payout to failed |

---

### SP-13: Edge Functions Deployment

**Goal:** Deploy and test all Edge Functions in production

**Tasks:**
- [ ] 13.1 Create `supabase/functions/create-checkout-session/index.ts`
- [ ] 13.2 Create `supabase/functions/stripe-webhook/index.ts`
- [ ] 13.3 Create `supabase/functions/create-connect-account/index.ts`
- [ ] 13.4 Create `supabase/functions/create-connect-link/index.ts`
- [ ] 13.5 Create `supabase/functions/request-payout/index.ts`
- [ ] 13.6 Create `supabase/functions/release-escrow/index.ts`
- [ ] 13.7 Deploy all functions to Supabase
- [ ] 13.8 Configure webhook URL in Stripe dashboard
- [ ] 13.9 Test with Stripe test mode
- [ ] 13.10 Verify RLS policies work with service role

**Acceptance Criteria:**
- [ ] All Edge Functions deployed
- [ ] Webhook receiving events from Stripe
- [ ] End-to-end payment flow works
- [ ] End-to-end payout flow works

---

## Verification Commands

```bash
# Check migrations applied
supabase db diff

# Test webhook locally
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# Test checkout
curl -X POST http://localhost:54321/functions/v1/create-checkout-session \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"type":"session","teacherId":"xxx","studentId":"xxx"}'

# Check Edge Functions deployed
supabase functions list
```

---

## Platform Fee Configuration

| Setting | Value |
|---------|-------|
| Platform fee | 15% |
| Teacher receives | 85% |
| Minimum payout | $50 |
| Escrow hold period | 24 hours |
| Currency | USD |

---

## Notes

- Use Stripe test mode for development
- Stripe CLI for local webhook testing
- All Edge Functions use service role for database access
- Escrow release can be manual trigger or pg_cron scheduled job
