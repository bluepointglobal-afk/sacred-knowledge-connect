# SacredChain — Deployment Plan (Revenue-Ready)

## Recommended target

- **Frontend:** Vercel (fast Vite/React deploy, previews, easy env vars)
- **Backend:** Supabase (hosted Postgres + Auth + Storage + Edge Functions)
- **Payments:** Stripe (Checkout + Connect)

This matches the current architecture and minimizes moving parts.

---

## 1) Production Supabase

1. Create a Supabase project (prod)
2. Apply migrations:
   - `supabase link --project-ref <ref>`
   - `supabase db push`
3. Deploy Edge Functions:
   - `supabase functions deploy create-checkout-session`
   - `supabase functions deploy stripe-webhook`
   - `supabase functions deploy release-escrow`
   - `supabase functions deploy create-connect-account`
   - `supabase functions deploy create-connect-link`
   - `supabase functions deploy request-payout`
4. Set Supabase secrets (prod):
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - any app URLs used by checkout success/cancel redirects

---

## 2) Stripe (prod)

1. Create Stripe **Product/Price** strategy (if needed) OR rely on dynamic Checkout Session creation (current approach).
2. Stripe Connect settings:
   - configure your platform profile
   - set payout schedule / requirements
3. Add a **Webhook endpoint** pointing at Supabase Edge Function:

`https://<project-ref>.supabase.co/functions/v1/stripe-webhook`

Enable event types used in code:
- `checkout.session.completed`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`
- `account.updated`
- `transfer.created`
- `transfer.failed`
- `payout.paid`
- `payout.failed`

Confirm the endpoint signing secret is stored in Supabase as `STRIPE_WEBHOOK_SECRET`.

---

## 3) Frontend deploy (Vercel)

1. Import the repo into Vercel
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Configure env vars in Vercel:
   - `VITE_SUPABASE_URL` (prod project URL)
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - (recommended) `VITE_USE_MOCK_DATA=false` in production
4. Deploy

---

## 4) Post-deploy validation checklist (staging/prod)

### B2C
- Browse teachers + bundles loads from Supabase (no demo banner)
- Teacher profile loads
- Checkout completes (Stripe test mode first)
- Stripe webhook creates:
  - `payments` row with `status=held`
  - `teacher_earnings` row with `status=pending`
  - `stripe_charge_id` populated
- Escrow release flow:
  - for bundle: earning becomes available after the hold window
  - teacher payout uses Connect transfer

### B2B
- Current state: `/business` is a marketing page only (no project posting / bidding flow yet)

---

## 5) Known constraints

- "Escrow" is currently logical (DB status + delayed payout), not card auth/capture-later.
- If you need true authorization holds, payment flow must be redesigned.
