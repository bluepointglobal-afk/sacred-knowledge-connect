# AFAQ ESG — Project Brief (Draft)

## What it is
ESG compliance + disclosure platform targeting UAE, KSA, Qatar SMEs (listed and non-listed).

## Core product split (freemium boundary)
- **Module A (Free):** Compliance Engine — assessment, scoring, gap analysis
- **Module B (Paid):** Disclosure Generator — AI-assisted narrative generation + outputs

## Stack (from repo)
- Frontend: React + TypeScript + Vite + shadcn/ui + Tailwind
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions)
- Payments: Stripe JS present
- AI: Supabase Edge Function `generate_disclosure` (Claude API mentioned in docs)

## What I will assess next
1) Product flow: Landing → Auth → Onboarding → Questionnaire → Results → Disclosure (paid) 
2) Freemium gate enforcement points (UI + DB/RLS + Edge function)
3) Deployment readiness: env vars, supabase config/migrations, build scripts
4) Monetization readiness: Stripe integration completeness, pricing/tier logic

## Immediate risks spotted
- Repo contains `.env` and `.DS_Store` (potential hygiene/security issue). We should verify `.env` isn’t committed upstream and ensure secrets are not stored.

## Next milestone candidate
- Run local dev + tests (unit + Playwright smoke) and confirm paid wall.
