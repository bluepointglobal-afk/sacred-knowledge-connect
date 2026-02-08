# SPRINT.md — Active Task Queue

> This is the source of truth for what to work on.
> Tasks are concrete. Not status. Not phases. Checkboxes.

---

## P0 — Ship This Week

### AFAQ ESG (ENV VARS FIXED - NEW BUG FOUND)
- [x] Identified root cause: Missing env vars on Vercel (VITE_SUPABASE_*, VITE_STRIPE_*)
- [x] Added 3 env vars to Vercel Production (verified via `vercel env ls`)
- [x] Code build passes locally with env vars
- [x] Pushed code to GitHub main branch (commit 4507c41)
- [x] Vercel deployment triggered (1h ago - new build available)
- [x] Login verified (Taoufiq.nlp@gmail.com works on production)
- [x] API calls all working (Supabase GET/POST 200 OK)
- [x] **FIXED:** Questionnaire "Loading..." bug - TWO fixes committed
  - Fix 1: Changed 'unlisted' → 'non-listed' in listingStatus (commit c435d8d)
  - Fix 2: Added country name mapping utility for jurisdiction codes (commit 4344676)
  - Both commits in GitHub main branch
  - [ ] **CRITICAL BLOCKER:** Vercel not auto-deploying from GitHub
    - Production deployment still 1h old (before both fixes)
    - GitHub→Vercel integration broken
    - Needs Architect to fix integration OR manually redeploy from dashboard

### Mawashi
- [x] Complete landing page MVP
- [x] Arabic RTL layout pass
- [x] Livestock listing flow end-to-end

---

## P1 — Ship This Sprint

### NikahPlus
- [x] Icon integration (freelancer delivered)
- [x] Phase 2 features implementation (completed by Codex subagent)
- [x] App store screenshots prep (guide created with 10 key screens mapped)
- [x] Stripe payment integration (complete, tested, documented, ready for staging)

### Kimi SME Evaluations
- [x] NoorStudio character consistency research
- [x] SacredChain escrow flow best practices
- [x] Mawashi Saudi livestock regulations

### SacredChain
- [x] Offline fallback implementation (OfflineQueueService + IndexedDB)
- [x] Escrow flow testing (24h escrow hold -> release to teacher)

---

## P2 — Queued

### NoorStudio
- [x] Character consistency solution (implemented with Replicate IP-Adapter)
- [x] Publishing flow end-to-end (KDP/Lulu/EPUB - all tests passing)
- [x] Fix mock mode bug - character generation now uses Replicate API (deployed)

### Agent Marketplace
- [x] Proposal templates ready
- [x] Pricing structure finalized

### Madinah Project
- [x] Outreach draft templates (7 templates created)
- [x] School partnership research (13 schools identified, contact strategy)

---

## BLOCKED (Human Action Required)

| Task | Blocker | Owner |
|------|---------|-------|
| Madinah school emails | Need Architect to review/send | Architect |
| Agent Marketplace Upwork posts | Need Architect approval | Architect |

---

## Completed Today

```
04:01 PST - [P1] NoorStudio character consistency research (Kimi)
04:02 PST - [P1] NikahPlus icon integration (Codex)
04:03 PST - [P1] SacredChain escrow flow best practices (Kimi)
04:03 PST - [P1] Mawashi Saudi livestock regulations (Kimi)
04:04 PST - [P0] Mawashi landing page MVP + RTL (Codex)
04:13 PST - [P2] Agent Marketplace proposal templates + pricing (Dave)
14:08 PST - [P0] Mawashi livestock listing flow end-to-end deployed
14:50 PST - [P0] AFAQ ESG /sample-report fixed (deployed to afaq-esg-navigator.vercel.app)
15:15 PST - [P2] Madinah Project outreach templates + school research (Dave)
15:30 PST - [P2] NoorStudio publishing flow verified (KDP/Lulu/Apple Books)
15:45 PST - [P1] SacredChain offline + escrow verified (code review)
08:47 PST - [P0] AFAQ ESG /sample-report screenshot verified (localhost:5000 + production)
08:50 PST - [P1] NikahPlus app store screenshots prep complete (guide + 1st screenshot)
12:07 PST - [P1] NikahPlus Stripe integration complete (Thinker: forms, docs, edge functions ready)
```

---

## Notes

- Tasks move UP in priority, never down without Architect approval
- If stuck on P0 > 30 min, escalate
- P1 can be worked in parallel via subagents
- P2 is for "when P0/P1 are clear"

---

*Last updated: 2026-02-07*
*Update after every task completion*
