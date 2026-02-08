# SME Evaluation — AFAQ ESG
*Date: 2026-02-08*
*Evaluator: Dave (as Ahmed, HSE Manager at Saudi manufacturing SME)*
*Production URL: https://afaq-esg-navigator.vercel.app*

---

## VERDICT: WOULD EXPLORE ✅

Ahmed would sign up for a free report. He would NOT pay yet — needs to see his own report first.

---

## The Walk (As Ahmed)

### Landing Page — First 5 Seconds
**Reaction:** "ESG Compliance Made Simple" — speaks directly to my pain. My CEO just asked why we don't have an ESG report. Consultants quote SAR 50K+. This looks clean and professional.

**Trust Signals That Work:**
- ✅ "Built specifically for GCC SMEs" — not a generic EU tool
- ✅ Arabic language toggle (عربي) — they thought about me
- ✅ "2 Hours, Not 2 Months" — I don't have a sustainability team
- ✅ 6 GCC countries covered, Tadawul/ADX guidelines mentioned by name
- ✅ "Trusted by 500+ GCC Companies" badge
- ✅ 4-step process feels manageable
- ✅ AI-powered estimates for missing data — my data collection is a mess

**Trust Killers:**
- 🚩 **Page title says "Lovable App"** — generic, not branded. Looks like a template.
- 🚩 **"500+ GCC Companies" but no logos or testimonials** — creates suspicion
- 🚩 No pricing visible on landing page — I want to know cost before signing up

### Auth Page
**Reaction:** Clean, professional. Blue gradient, centered card, bilingual branding. Would sign up.
- ✅ Clean design, appropriate for B2B SaaS
- ✅ Arabic text (آفاق) under logo — bilingual touch
- ⚠️ No social/SSO sign-up (acceptable for B2B compliance tool)
- ⚠️ No password strength requirements visible

### Sample Report
**Reaction:** This is the money page. 61,478 characters of content. Comprehensive.
- ✅ Clearly marked "SAMPLE • FICTIONAL DATA" — honest, professional
- ✅ Executive Summary, structured sections, detailed metrics
- ✅ GCC-specific regulatory references
- ⚠️ **Very text-dense** — needs visual dashboards, charts, risk matrices
- ⚠️ Senior managers expect executive-level summaries with KPIs
- ⚠️ Formatting could be more polished — looks template-stage

### Dashboard (redirects to auth)
**Observation:** Unauthenticated users get redirected to signup. Expected behavior.

### Questionnaire (redirects to landing)
**Observation:** Unauthenticated access to /questionnaire redirects to landing page. Need to sign up first.

---

## Scoring

| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| **First Impression** | 4/5 | Clean, professional, GCC-focused messaging |
| **Trust** | 3/5 | "500+ companies" with no proof. "Lovable App" title kills credibility |
| **Value Proposition** | 4/5 | "2 hours not 2 months" is compelling for SMEs |
| **Sample Report Quality** | 3/5 | Comprehensive but needs visual polish |
| **Pricing Clarity** | 2/5 | Can't find pricing without deep navigation |
| **Would I Sign Up?** | YES | Free report → low barrier |
| **Would I Pay?** | MAYBE | Need to see my own report first |

**Overall: 3.2/5 — WOULD EXPLORE**

---

## Top 3 Actions (Feedback Matrix)

### 1. FIX: Page Title → "AFAQ ESG Navigator" (not "Lovable App")
- **Impact:** HIGH (trust killer for any tech-savvy buyer)
- **Effort:** 5 minutes (change index.html title tag)
- **Routes to:** Phase 2 (quick fix)

### 2. ADD: Social proof on landing page (logos, testimonials, case study)
- **Impact:** HIGH (moves from "looks promising" to "other companies trust this")
- **Effort:** Medium (need real or sample testimonials)
- **Routes to:** Phase 2 (content update)

### 3. ADD: Pricing section on landing page
- **Impact:** HIGH (Ahmed wants to know cost before signing up)
- **Effort:** Low (Pricing page exists at /pricing but not prominent enough)
- **Routes to:** Phase 2 (link pricing in hero section)

### Bonus: Visual polish on Sample Report
- Add charts, risk matrices, executive dashboard
- Add branded header/footer
- Make it look like a $10K consulting deliverable

---

## Screenshots
- `reports/screenshots/afaq-landing.png` — Landing page
- `reports/screenshots/afaq-auth.png` — Auth/signup page
- `reports/screenshots/afaq-sample-report.png` — Sample report
- `reports/screenshots/afaq-dashboard.png` — Dashboard (redirects to auth)
- `reports/screenshots/afaq-questionnaire.png` — Questionnaire (redirects to landing)

---

*Framework: M2M_LOOP.md Phase 4*
*Persona: Ahmed, HSE Manager, Riyadh manufacturing SME*
*ICP Source: reports/icp-afaq.md*
