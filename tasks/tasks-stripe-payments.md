# tasks-stripe-payments.md

## Feature: Stripe Payment Integration

**Priority:** P0 (Critical)
**Estimated Complexity:** High
**Dependencies:** Supabase Edge Functions or External API

---

## Overview

Implement Stripe payment processing to enable:
- Paid bundle enrollments
- Revenue capture at checkout
- Teacher earnings tracking
- Payout management

---

## Tasks

### 1. Stripe Setup & Configuration

- [ ] 1.1 Create Stripe account and obtain API keys
- [ ] 1.2 Add Stripe keys to `.env.local` (STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY)
- [ ] 1.3 Install `@stripe/stripe-js` and `@stripe/react-stripe-js` packages
- [ ] 1.4 Create `/src/lib/stripe.ts` - Stripe client initialization
- [ ] 1.5 Configure Stripe webhook endpoint URL

### 2. Database Schema Updates

- [ ] 2.1 Create `payments` table (id, enrollment_id, stripe_payment_intent_id, amount_cents, currency, status, created_at)
- [ ] 2.2 Create `teacher_earnings` table (id, teacher_id, enrollment_id, amount_cents, platform_fee_cents, net_amount_cents, status, paid_at)
- [ ] 2.3 Create `payouts` table (id, teacher_id, stripe_payout_id, amount_cents, status, requested_at, completed_at)
- [ ] 2.4 Add `stripe_customer_id` column to `profiles` table
- [ ] 2.5 Add `stripe_connect_account_id` column to `teacher_profiles` table
- [ ] 2.6 Create RLS policies for new tables
- [ ] 2.7 Create migration file `004_payments.sql`

### 3. Checkout Flow (Student)

- [ ] 3.1 Create `/src/hooks/usePayments.ts` - Payment hooks (createCheckoutSession, getPaymentStatus)
- [ ] 3.2 Create `/src/components/checkout/CheckoutButton.tsx` - Stripe checkout trigger
- [ ] 3.3 Create `/src/pages/Checkout.tsx` - Checkout page with payment form
- [ ] 3.4 Create `/src/pages/CheckoutSuccess.tsx` - Post-payment success page
- [ ] 3.5 Create `/src/pages/CheckoutCancel.tsx` - Payment cancelled page
- [ ] 3.6 Update `BundleDetail.tsx` - Replace "Enroll" with "Buy Now" for paid bundles
- [ ] 3.7 Add price display formatting (cents to dollars)
- [ ] 3.8 Handle free bundles (price_cents = 0) - direct enrollment without checkout

### 4. Stripe Webhook Handler

- [ ] 4.1 Create Supabase Edge Function `stripe-webhook`
- [ ] 4.2 Handle `checkout.session.completed` event - create enrollment + payment record
- [ ] 4.3 Handle `payment_intent.succeeded` event - update payment status
- [ ] 4.4 Handle `payment_intent.payment_failed` event - log failure
- [ ] 4.5 Verify webhook signature for security
- [ ] 4.6 Create teacher earning record on successful payment (with platform fee calculation)

### 5. Teacher Stripe Connect Onboarding

- [ ] 5.1 Create `/src/pages/TeacherStripeOnboarding.tsx` - Connect account setup flow
- [ ] 5.2 Create Supabase Edge Function `create-connect-account` - Generate Stripe Connect account
- [ ] 5.3 Create Supabase Edge Function `create-connect-onboarding-link` - Generate onboarding URL
- [ ] 5.4 Store `stripe_connect_account_id` after successful onboarding
- [ ] 5.5 Add verification status check (charges_enabled, payouts_enabled)
- [ ] 5.6 Handle Connect account updates via webhook

### 6. Teacher Earnings Dashboard

- [ ] 6.1 Create `/src/hooks/useEarnings.ts` - Earnings data hooks
- [ ] 6.2 Create `/src/pages/TeacherEarnings.tsx` - Earnings dashboard page
- [ ] 6.3 Display total earnings, pending payouts, completed payouts
- [ ] 6.4 List earning history by enrollment
- [ ] 6.5 Show platform fee breakdown (e.g., 15% platform fee)
- [ ] 6.6 Add earnings summary to teacher dashboard (when created)

### 7. Payout System

- [ ] 7.1 Create Supabase Edge Function `request-payout` - Initiate Stripe payout
- [ ] 7.2 Create `/src/components/earnings/RequestPayoutButton.tsx`
- [ ] 7.3 Handle payout webhook events (payout.paid, payout.failed)
- [ ] 7.4 Update payout status in database
- [ ] 7.5 Add minimum payout threshold ($50)
- [ ] 7.6 Display payout history and status

### 8. Testing & Validation

- [ ] 8.1 Test checkout flow with Stripe test cards
- [ ] 8.2 Test webhook handling locally with Stripe CLI
- [ ] 8.3 Test failed payment scenarios
- [ ] 8.4 Test Connect onboarding flow
- [ ] 8.5 Test payout request and completion
- [ ] 8.6 Add Playwright E2E test for checkout flow
- [ ] 8.7 Verify RLS policies protect payment data

### 9. UI Polish

- [ ] 9.1 Add loading states during payment processing
- [ ] 9.2 Add error handling and user-friendly messages
- [ ] 9.3 Add payment receipt/confirmation display
- [ ] 9.4 Add "Stripe Secured" badge for trust
- [ ] 9.5 Responsive checkout UI for mobile

---

## Acceptance Criteria

- [ ] Students can purchase paid bundles via Stripe Checkout
- [ ] Free bundles (price = 0) bypass checkout
- [ ] Payments create enrollment records automatically
- [ ] Teachers receive earnings (minus platform fee) after successful payments
- [ ] Teachers can onboard to Stripe Connect
- [ ] Teachers can view earnings dashboard
- [ ] Teachers can request payouts
- [ ] All payment data is secured with RLS
- [ ] Webhooks handle all payment lifecycle events

---

## Notes

- Platform fee: 15% of bundle price
- Currency: USD (configurable per bundle)
- Minimum payout: $50
- Stripe Connect: Standard accounts (simplest integration)
