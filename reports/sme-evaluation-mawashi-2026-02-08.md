# SME Evaluation — Mawashi (Golden Path)
*Date: 2026-02-08*
*Evaluator: Dave (as Hamad, livestock broker, Riyadh)*
*Production URL: https://mawashi-marketplace.vercel.app*

---

## VERDICT: WOULD EXPLORE ✅

Hamad would browse listings. He would NOT list animals yet — needs to see real sellers and trust verification first. The Arabic-first UI is a major trust signal.

---

## Golden Path Results

| Step | Route | Status | Notes |
|------|-------|--------|-------|
| 1. Home | / | ✅ RENDERED (908 chars) | Full Arabic landing page with categories |
| 2. Listings | /listings | ✅ RENDERED (497 chars) | Category browse page |
| 3. New Listing | /listings/new | ⚠️ NOSCRIPT | Shows noscript fallback HTML only |
| 4. Listing Detail | /listings/1 | ⚠️ NOSCRIPT | Shows noscript fallback HTML only |
| 5. Auth | /auth | ❌ BLANK (11 chars) | Auth page doesn't render |
| 6. Messages | /messages | ✅ RENDERED (370 chars) | Messages page renders |

**Golden Path Completion: 4/6 (67%)**
**Critical: Auth page blank. Listing creation shows noscript only.**

---

## Trust Signals (As Hamad)

### ✅ Strong
- **Arabic-first UI** — "مواشي" prominently displayed. This is FOR Saudis, not an English app with Arabic bolted on.
- **Category counts visible** — إبل (2,450), أغنام (4,567), خيول (890), ماعز (856) — tells me there's activity
- **"بائعون موثقون" (Verified Sellers)** — exactly what I need. WhatsApp has no verification.
- **45,000+ active users claimed** — if real, this is a bigger network than my WhatsApp contacts
- **Messages system** — direct buyer-seller communication

### 🚩 Trust Killers
- **Auth page broken** — can't actually sign up = can't use the platform
- **New listing form shows noscript only** — seller can't create listings
- **Are those numbers real?** — 4,567 sheep listings but I can't browse them? Suspicious.
- **No photos of actual animals** — livestock buyers need to SEE the animal
- **No price information visible** — what does it cost to list? What's the commission?

---

## Scoring

| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| First Impression | 4/5 | Arabic-first, clean, professional |
| Trust | 2/5 | Numbers look good but can't verify. Auth broken. |
| Core Feature (listings) | 1/5 | Can't create listings, can't sign up |
| Arabic Quality | 5/5 | Native Arabic, not translated |
| Would Browse? | YES | The categories draw me in |
| Would List Animals? | NO | Auth is broken, listing form is broken |

**Overall: 2.5/5 — WOULD EXPLORE (but WOULD BOUNCE if auth stays broken)**

---

## Top 3 Actions

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Fix auth page (blank — Supabase client not initializing) | CRITICAL | 1 hr |
| 2 | Fix listing form (noscript only, JS not executing) | CRITICAL | 1 hr |
| 3 | Add real animal photos to listings | HIGH | 2 hrs |

---

*Screenshots: reports/screenshots/mawashi-golden/*
