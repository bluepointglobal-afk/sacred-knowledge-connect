# SacredChain — Local Dev (Supabase + Stripe)

This repo is a Vite + React SPA with a Supabase backend and Stripe payments (Checkout + Connect).

## 0) Prereqs

- Node (recommend LTS 20/22)
- Supabase CLI: https://supabase.com/docs/guides/cli
- Docker (required by `supabase start`)
- Stripe CLI (for local webhook forwarding): https://stripe.com/docs/stripe-cli

## 1) Install + run the frontend

```bash
npm install
npm run dev
```

Vite runs on port **8080** (see `vite.config.ts`).

## 2) Environment variables

Create `.env.local` at repo root:

```bash
# Supabase (required for real data)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe (client)
VITE_STRIPE_PUBLISHABLE_KEY=

# Optional: mock/demo fallback for local development
# - unset or "auto" => auto-fallback to demo data in DEV when Supabase errors
# - "false" => strict mode (surface errors)
VITE_USE_MOCK_DATA=auto
```

Supabase Edge Functions use server-side env vars (set via `supabase secrets set ...`).

## 3) Run Supabase locally (recommended)

From repo root:

```bash
supabase start
supabase db reset
```

- Migrations live in `supabase/migrations/`
- (If present) seed lives in `supabase/seed.sql`

Then point the frontend `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to your local Supabase (from `supabase status`).

## 4) Run Edge Functions locally

```bash
supabase functions serve
```

Functions live in `supabase/functions/`:
- `create-checkout-session`
- `stripe-webhook`
- `release-escrow`
- `create-connect-account`
- `create-connect-link`
- `request-payout`

## 5) Stripe webhooks (local)

### 5.1 Configure secrets for local functions

Set secrets for your local Supabase project:

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  SUPABASE_URL=http://localhost:54321 \
  SUPABASE_SERVICE_ROLE_KEY=...service_role...
```

### 5.2 Forward Stripe events to the local webhook

In a second terminal:

```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

Copy the `whsec_...` value Stripe CLI prints and set it as `STRIPE_WEBHOOK_SECRET`.

### 5.3 Test a Checkout session

Use the UI to trigger Checkout and pay with Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 9995`

## 6) Escrow model (current)

Escrow is implemented at the **application / DB level**:
- Checkout captures payment to the platform
- `payments.status` starts as `held`
- Teacher earnings are created as `pending`
- Release happens via `release-escrow` (after rules / time window)

Note: this is **not** an authorization hold (capture-later). It is a logical hold before payout.

## 7) Demo mode / offline fallback

In **DEV only**, if Supabase is unreachable (DNS, missing env, etc.), the app can fall back to demo/mock data.

### 7.1 Enable / disable

- Enable mock mode:
  - `VITE_USE_MOCK_DATA=true`
- Disable mock mode (strict):
  - `VITE_USE_MOCK_DATA=false`

> Production safety: `shouldUseMockData()` returns **false** in PROD builds, so no mock fallback is used in production.

### 7.2 What is mocked today

- Teachers + Bundles list/detail pages
- (Optional) Auth flows (see below)

Not fully mocked yet:
- Stripe + Edge Function driven flows (Checkout / webhooks)
- Payments / teacher_earnings / transactions data access (these still require Supabase)

### 7.3 Mock auth behavior

Auth has an **offline-compatible** mode that avoids hard failures when Supabase auth is unavailable.

Defaults (when `VITE_USE_MOCK_DATA=true`):
- **No auto-login** (user starts unauthenticated; login page + protected route redirects still work)
- Email/password sign-in is **strict** by default:
  - valid: `student@example.com` + `password123`
  - anything else returns: `Invalid login credentials`

Optional flags:
- `VITE_MOCK_AUTOLOGIN=true`
  - auto-logs in a mock user at app start (useful for demos/offline UI work)
- `VITE_MOCK_AUTH_ACCEPT_ANY=true`
  - accepts any email/password in mock mode (useful for rapid UI testing)

### 7.4 Running E2E tests in offline mode

```bash
VITE_USE_MOCK_DATA=true npx playwright test
```

This runs the current navigation/auth E2E suite without requiring a running Supabase instance.
