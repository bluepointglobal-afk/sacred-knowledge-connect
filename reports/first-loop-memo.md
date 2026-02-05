# SacredChain (sacred1) — Local First User Loop (Feb 2, 2026)

## TL;DR
- **Entrypoint:** Vite + React SPA in `sacred1` (`index.html` → `src/main.tsx` → `src/App.tsx`).
- **Dev server:** runs via `npm run dev` (Vite). On this machine, running required a clean reinstall due to Rollup native module / codesigning restriction.
- **Core B2C loop blocked in this environment** because outbound DNS to Supabase fails (`ERR_NAME_NOT_RESOLVED`), and **Teachers/Bundles pages hard-fail on query errors** (no mock fallback when Supabase is unreachable).
- **Payments/escrow readiness (code-level):** Stripe Checkout + Supabase Edge Functions exist (checkout, webhook, escrow release, payouts). Escrow is *logical* (DB status + delayed transfer), not Stripe-authorized-hold.

---

## 1) How to run locally (what worked here)
### Repo
`/Users/architect/.openclaw/workspace/03_REPOS/Sacredchain/sacred1`

### Install
`npm install`

**Issue hit:** Vite crashed with:
- `Cannot find module @rollup/rollup-darwin-arm64`
- plus `code signature ... not valid for use in process: library load disallowed by system policy`

**Fix that worked:** remove lock + reinstall optional deps:
- moved aside `node_modules/` and `package-lock.json` then re-ran `npm install`.

### Start
`npm run dev`
- Note: `vite.config.ts` sets server defaults `host: "::", port: 8080`.

**Gotcha:** In this workspace there were other Vite servers running from other repos, which created confusion when opening ports. Ensure you’re hitting the correct port for `sacred1`.

---

## 2) Product entrypoints / routing
- `index.html` → `src/main.tsx` → `src/App.tsx`
- Key routes (`src/App.tsx`):
  - `/` landing
  - `/onboarding` (CTA → login)
  - `/login`
  - `/teachers`, `/teachers/:id`
  - `/bundles`, `/bundles/:id`
  - `/dashboard`, `/enrollments/:id`
  - `/teacher/earnings` (Stripe Connect)

---

## 3) Walkthrough of B2C flow (what I could/couldn’t complete)
### Landing
- Loads correctly, SacredKnowledge branding.
- Primary CTA: **Find your teacher** → `/onboarding`.

### Onboarding
- Presents:
  - **Sign In or Create Account** → `/login`
  - **Browse Teachers First** → `/teachers`

### Browse Teachers (/teachers)
- **Observed:** shows “Loading teachers…” then **“Failed to load teachers”**.
- Root cause in console:
  - `ERR_NAME_NOT_RESOLVED` for `https://<project>.supabase.co/rest/v1/teacher_profiles...`
  - i.e. Supabase unreachable in this environment (DNS/network), not necessarily an app bug.

**Important UX issue:** even though `Teachers.tsx` defines `mockTeachers`, that fallback only applies when `dbTeachers` is empty — it does **not** apply when the query errors. On any Supabase error, the page is a dead-end.

### Browse Bundles (/bundles)
- Same pattern: **“Failed to load bundles”** on Supabase request error.

### Teacher profile / booking
- `TeacherProfile.tsx` depends on `useTeacher(id)` + `useBundlesByTeacher(id)`.
- No mock fallback; if Supabase fails, the profile becomes **“Teacher Not Found”** and booking can’t be exercised.

### Signup
- Login page UI loads (Google + email/password). Actual auth could not be validated in this environment due to Supabase network failure.

---

## 4) Payments + escrow readiness (code review)
### What’s present
- Stripe client dependency (`@stripe/stripe-js`) and UI checkout components:
  - `SessionCheckoutButton` (date/time/duration → invokes `create-checkout-session`)
  - `BundleCheckoutButton`
- Supabase Edge Functions:
  - `create-checkout-session` (creates Stripe Checkout Session)
  - `stripe-webhook` (creates DB `payments`, `sessions`/`enrollments`, `teacher_earnings` on checkout completion)
  - `release-escrow` (cron/manual release; session completed/no-show paths)
  - `create-connect-account`, `create-connect-link` (Stripe Connect onboarding)
  - `request-payout` (Stripe transfer to connected account)
- DB migration `004_payments.sql`:
  - enums (`payment_status`, `earning_status`, etc.)
  - tables: `payments`, `teacher_earnings`, `teacher_payouts`
  - helper RPCs: `get_teacher_available_balance`, `get_teacher_pending_balance`

### Escrow semantics
- **Escrow is implemented at the application level**:
  - Stripe Checkout captures payment to the platform.
  - DB marks `payments.status='held'`.
  - After 24h, `teacher_earnings` becomes `available`, and payouts transfer via `stripe.transfers.create`.

### Gaps / risks
- **No true “authorization hold” on card** (Stripe is capture-now). If you need hold-then-capture, this needs redesign.
- Webhook refund handling references `stripe_charge_id`, but the `checkout.session.completed` handler doesn’t appear to set it. (May require fetching PaymentIntent → Charge and persisting.)
- Local dev setup for Stripe webhooks + Supabase functions not documented in repo README (at least not in top-level README).

---

## 5) Friction / pain map (from first-run)
1) **Dev server can silently point to the wrong app** if multiple Vite servers are running. (Observed a totally different UI on a port.)
2) **Rollup native module / codesigning** broke `npm run dev` until reinstall; likely Node version / optional dep mismatch.
3) **Supabase hard dependency blocks exploration**: Teachers/Bundles/Profiles become dead pages when Supabase unreachable.
4) **No local Supabase “happy path” guide**: no single “do this to get teachers + bundles seeded” walkthrough.
5) **Payments are present but not end-to-end testable without env + webhooks**.

---

## 6) Top 5 fixes (highest leverage)
1) **Offline/dev resilience:** In `Teachers` and `Bundles`, if query errors, render mock data with a banner (“Using demo data — connect Supabase to see live teachers/bundles”). Don’t dead-end.
2) **Local Supabase bootstrap:** Add a `README_LOCAL_DEV.md` with:
   - `supabase start`
   - apply migrations/seed (`supabase db reset`)
   - required env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
   - where to find/connect keys
3) **Pin Node version** (add `.nvmrc` / `.tool-versions`) to a stable LTS (20/22). Document it. This likely avoids the Rollup native module/codesign issue.
4) **Fix checkout/webhook data completeness:** Persist `stripe_charge_id` (and any needed IDs) in `payments` during webhook processing by retrieving PaymentIntent details.
5) **Avoid port confusion:** set a consistent dev port in `package.json` script (e.g., `vite --port 5173`) or print a clearer banner. Also consider adding a health endpoint or title showing the app name.

---

## Quick-win backlog (1–2 day items)
- [ ] Teachers/Bundles pages: on `error`, fall back to mock data instead of showing “Failed to load …”.
- [ ] TeacherProfile: if `id` matches mock teacher IDs, use local mock profile/bundles so booking UI can be exercised offline.
- [ ] Add `.nvmrc` and document Node LTS requirement.
- [ ] Add `scripts/dev.sh` that:
  - checks Node version
  - runs `npm install` (or warns if lock mismatch)
  - starts Vite on a known port
- [ ] Add a “Dev Mode” banner when Supabase unreachable with a link to setup docs.

---

## Notes for next run
If you can provide a networked environment (or local Supabase), we can complete the full B2C loop:
- browse teachers
- open teacher profile
- book session (Stripe checkout)
- enroll bundle (Stripe checkout)
- validate dashboards and escrow release flows
