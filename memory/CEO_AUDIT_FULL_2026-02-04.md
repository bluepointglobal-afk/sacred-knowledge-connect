# FULL PORTFOLIO AUDIT — 2026-02-04 (CEO Deep Dive)

**Purpose:** Build Tim's knowledge base so worker spawning is precise, not vague.  
**Stored in:** Long-term memory for future sessions.  
**Last updated:** 14:20 PST  

---

## EXEC SUMMARY (Revenue Potential)

| Project | Phase | Revenue Model | Est. Readiness | Blocker | Next Owner |
|---------|-------|---|---|---|---|
| **AFAQ ESG** | 4 (SME eval) | $29/mo OR $99 one-time | 70% | None (re-eval pending) | Kimi (Phase 4 test) |
| **Petdate** | 4 (SME eval) | $9.99/mo OR $99/yr | 40% | Location bug + messaging UX | Codex (fix) OR Tim (fix) |
| **NoorStudio** | 2 (build) | $29-199/mo OR $69/book | 50% | Character consistency blocker | Codex (verify output) OR Tim (fix) |
| **SacredChain** | 2/3 (build+deploy) | 15% platform fee | 85% (was 65%) | None (E2E test pending) | Tim (E2E test) → Codex (deploy) |
| **NikahX** | 1→2 (Phase 2 start) | $4.99/mo OR $39.99/yr | 20% | None (lower priority) | Codex (Phase 2 build when ready) |
| **Madinah** | 1 (market validation) | TBD | 90% (emails drafted) | HUMAN ACTION: send emails | Architect (send 6 emails) |
| **Agent Marketplace** | 1 (market validation) | Revenue per job won | 95% (proposals drafted) | HUMAN ACTION: submit to Upwork | Architect (submit 10 proposals) |

---

## 1. PETDATE — Deep Code Audit

**File:** `/03_REPOS/petdate/`  
**Core Stack:** React Native/Expo, Firebase (Auth, Firestore), RevenueCat (monetization)

### Swipe Limit Status
**File:** `/petdatev1/lib/config.ts` line 15  
**Current code:**
```typescript
export const FREE_SWIPE_LIMIT = readInt(process.env.EXPO_PUBLIC_FREE_SWIPE_LIMIT, 25);
```
**Status:** Default is 25 (not 5). Configurable via env var. ✅ LIKELY FIXED

**But:** Need to verify this is actually being used. Check enforcement:
**File:** `/petdatev1/screens/Matches.tsx` line 283
```typescript
if (swipeCount >= FREE_SWIPE_LIMIT) {
  // Show paywall
}
```
**Status:** Enforced correctly. ✅ Code looks good.

### Location Bug (BLOCKER #1)
**File:** `/petdatev1/hooks/useLocation.ts` (identified in grep but not yet read)
**Status:** Known issue from first-loop memo: "Showed London, UK instead of SF"
**Root cause:** IP-based geolocation OR browser API misconfiguration
**Fix needed:** Verify geolocation implementation, allow user override
**Effort:** LOW (1-2h)

### Messaging Clarity (BLOCKER #2)
**Files to update:**
- `/petdatev1/screens/Landing.tsx` — Hero copy
- `/petdatev1/components/OnboardingFlow.tsx` — Value prop messaging
- `/petdatev1/screens/Matches.tsx` — Card labels
**Current messaging:** "Pet dating" → ambiguous
**Fix:** Change to "Pet Playdates" + clarify "Schedule park meetups with other pet owners"
**Effort:** LOW (content changes only, no code)

### Revenue Model
**Status:** Premium tier exists (RevenueCat integration). Code reviewed in market analysis.
**Pricing:** $9.99/mo OR $99/year
**Blocker:** None at code level; customer acquisition is marketing problem

### SME Eval Status
**Source:** `/reports/cycle-decision-2026-02-04.md`
**Verdict:** ITERATE (not KILL)
**Main friction:** Only 5 swipes (but config shows 25 — env mismatch?)
**Next action:** Re-test with corrected swipe limit + fixed messaging

### EXECUTION PLAN
```
1. Verify swipe limit is actually 25 (may have been 5 at eval time)
2. Find + fix location geolocation code (1h)
3. Update messaging in 3 files (30min)
4. Re-run Phase 4 SME eval with Kimi (shows Petdate persona the fixed app)
5. If SME converts → SHIP (prep for app store)
```

---

## 2. NOORSTUDIO — Deep Code Audit

**File:** `/03_REPOS/Noorstudio/`  
**Core Stack:** React/Vite, TypeScript, Tailwind, shadcn/ui, Supabase, NanoBanana (image gen)

### Character Consistency (BLOCKER #1 — CRITICAL)

**Problem:** Same character looks different across illustrations (face, hijab, skin tone, accessories change)

**Root cause:** No seed persistence. Each scene generation is independent.

**Code path:**
```
User creates character → Pose sheet generated (12 poses)
  ↓
User creates scene 1 → Illustration generated (references pose sheet + character description)
  ↓
User creates scene 2 → New illustration generated (PROBLEM: doesn't use scene 1 as reference)
```

**Files involved:**
1. `/src/lib/ai/providers/imageProvider.ts` — Main generation function
2. `/src/lib/ai/imagePrompts.ts` — Prompt building (includes character DNA)
3. `/src/lib/storage/charactersStore.ts` — Character storage (holds reference image URL)
4. `/src/pages/IllustrationGenerator.tsx` OR similar — UI that calls generation

**Current approach:** Character visual DNA in prompts, no img2img seed from first generated image

**FIX REQUIRED:**
1. Store first character illustration URL (after pose sheet generation)
2. Pass that URL as PRIMARY reference to all subsequent scene generations
3. Modify prompt to: "EXACT MATCH to character reference image. Only pose and background change."
4. Use img2img with seed from pose sheet + character ref

**Effort:** MEDIUM (2-3h) — need to trace generation flow

### Illustration Approval Flow (BLOCKER #2)

**Current:** Illustration generates, no option to reject/regenerate

**Fix needed:** After each scene generates, show:
- [✓ Approve] → save & move to next
- [↻ Regenerate] → try again
- [✏️ Edit Prompt] → customize scene description

**Files to modify:**
- `/src/pages/BookBuilder.tsx` OR `/src/pages/IllustrationGenerator.tsx` (UI)
- State management for storing approved vs rejected images

**Effort:** LOW (2h for UI + state management)

### Story Import (BONUS FIX)

**Current:** Manual chapter creation only

**Fix:** "Paste story" text area → auto-split into chapters

**Effort:** LOW (1h, regex-based chapter detection)

### EXECUTION PLAN
```
1. Read /src/lib/ai/providers/imageProvider.ts fully (understand generation flow)
2. Identify where character first image is stored in DB (charactersStore)
3. Modify buildIllustrationPrompt() to pass character image as primary reference
4. Add prompt enforcement: "Match character face EXACTLY"
5. Test with 3-chapter book generation
6. If character face identical across all 3 → ship
7. Add illustration approval UI (secondary priority)
```

---

## 3. SACREDCHAIN — Deployment Audit

**Status:** Codex just fixed Supabase fallback + Stripe webhook (verified in code above)

**Current readiness:**
- ✅ Frontend code builds
- ✅ Supabase schema exists (migrations in `/supabase/migrations/`)
- ✅ Stripe integration code exists (Edge Functions + checkout components)
- ✅ Mock fallback for dev
- ✅ Local dev docs created

**What's NOT done:**
- E2E test (student finds teacher → books session → pays → teacher gets earnings)
- Deployment to Vercel + Supabase prod
- B2B marketplace (Phase 3, defer)

### E2E Test Plan
```
1. Follow README_LOCAL_DEV.md (Codex wrote it)
2. Run: npm run dev
3. Browse /teachers → see mock teachers (if Supabase down) OR real teachers
4. Click teacher → view profile + bundles
5. Click "Enroll Bundle" → Stripe Checkout
6. Use Stripe test key (pk_test_...) + test card 4242 4242 4242 4242
7. Complete payment → verify:
   - Payment record created in Supabase
   - Teacher earning created (status: held)
   - Enrollment created
   - 24h escrow timer starts
8. Check teacher dashboard: earnings showing as "pending"
```

**Risk:** Stripe webhook may not fire locally (need Stripe CLI forwarding as per docs)

### EXECUTION PLAN
```
1. Follow E2E test above (1h)
2. If test passes → proceed to deploy
3. If test fails → read error logs, fix with Codex
4. Deploy to Vercel + Supabase prod (30min)
5. Re-run E2E on production URLs
6. If prod E2E passes → SHIP (beta launch)
```

---

## 4. AFAQ ESG — SME Eval Status

**Status:** Sample report added by Codex (verified in code)

**Current:** Free tier users can view sample report on Compliance Results page

**SME Eval finding:** 
- Friction #1 was "no sample report" → now fixed
- GCC manager might convert now

**Next action:** Run Phase 4 SME eval with Kimi
- Show sample report to GCC sustainability manager persona
- Measure: "Would you pay $99?" → track conversion lift

**EXECUTION PLAN**
```
1. Spawn Kimi: Phase 4 SME eval for AFAQ (GCC manager persona)
2. Kimi shows: Landing → sample report → paywall → pricing
3. Kimi rates: likelihood to pay, remaining friction
4. If >70% conversion → proceed to launch prep
5. If <70% → identify remaining gap + iterate
```

---

## 5. NIKAHX — Phase 1 Complete, Phase 2 Queued

**Status:** Market analysis done, Phase 2 build ready to start

**Market:** Muslim singles looking to marry (halal dating)

**Revenue model:** $4.99/mo OR $39.99/yr

**ICP:** Ages 25-35, practicing Muslim, looking for serious relationship

**Phase 2 deliverables:**
- Onboarding flow (questions: age, location, interests, religiosity level)
- Matching algorithm (based on values + location + age preferences)
- Payment integration (Stripe)
- Chat system
- Profile verification (photo + phone)

**Blocker:** None. Lower priority than P1 projects (Petdate, NoorStudio, SacredChain)

**EXECUTION PLAN**
```
1. Start after Petdate/NoorStudio/SacredChain ship
2. Spawn Codex for Phase 2 build (2-3 weeks)
3. Focus on MVP: matching + chat + payments
4. Defer: verification system (Phase 3)
5. Target: Beta launch in 4 weeks
```

---

## 6. MADINAH — Phase 1 Market Validation

**Status:** 6 personalized emails drafted, ready to send

**Schools identified:**
1. Al-Huda (Denver)
2. Universal Academy (Warren, MI)
3. Islamic School of Irving (TX)
4. Tarbiyah Academy (NYC)
5. Muslim Community Center (Chicago)
6. Al-Rahmah Islamic School (LA)

**Email content:** Ramadan 6-week program, $X per child, Islamic values + learning

**Success metric:** 40%+ response rate (≥4 schools) = ICP validated

**BLOCKER:** Architect must send manually (no automation allowed per routing rules)

**EXECUTION PLAN**
```
1. Architect sends 6 emails (this week)
2. Track responses in spreadsheet
3. Schedule discovery calls with interested schools
4. Measure: response rate + interest level
5. If 40%+ → Phase 2 (build curriculum + materials)
6. If <40% → refine ICP or pivot positioning
```

---

## 7. AGENT MARKETPLACE — Phase 1 Market Validation

**Status:** 10 Upwork proposals drafted (ready to submit)

**Proposal templates:**
- ESG compliance specialist
- AI implementation advisor
- React/TypeScript developer
- Islamic finance consultant
- Marketing strategist

**Success metric:** 1 job won within 7 days = revenue proof

**BLOCKER:** Architect must submit manually (Upwork login required)

**EXECUTION PLAN**
```
1. Architect logs into Upwork
2. Search 5-10 jobs matching our templates
3. Submit personalized proposals (1-2h)
4. Track: response rate, interview requests, jobs won
5. If 1 job won in 7 days → Phase 2 (automate hiring + build agent pool)
6. If 0 jobs won → revisit proposal quality OR ICP positioning
```

---

## MASTER EXECUTION SCHEDULE (Next 72h)

**TODAY (14:20 PST):**
- [ ] Tim: Read Petdate location code + fix (1h)
- [ ] Tim: Test SacredChain E2E locally (1h)
- [ ] Tim: Read NoorStudio character generation code (1.5h)

**TOMORROW (Thursday):**
- [ ] Tim OR Codex: Fix NoorStudio character consistency (2-3h)
- [ ] Architect: Send 6 Madinah school emails
- [ ] Architect: Submit 10 Upwork proposals
- [ ] Codex: Deploy SacredChain to Vercel + Supabase (1h)

**48h:**
- [ ] Kimi: Phase 4 SME eval for AFAQ (sample report impact)
- [ ] Kimi: Phase 4 SME eval for Petdate (location + messaging fixes)
- [ ] Tim: Gather initial responses from Madinah + Agent Marketplace

**72h (Decision point):**
- [ ] Decisions:
  - Madinah: 40%+ response? YES → Phase 2 START, NO → pivot
  - Agent Mkt: 1 job won? YES → Phase 2 START, NO → revisit
  - Petdate: SME converts with fixes? YES → SHIP (app store), NO → kill
  - NoorStudio: Character consistency works? YES → continue build, NO → pivot

---

## KNOWLEDGE STORED FOR FUTURE SESSIONS

**This audit is now in:** `/Users/architect/.openclaw/workspace/memory/CEO_AUDIT_FULL_2026-02-04.md`

**Key takeaways:**
1. PETDATE location bug is fixable (1-2h), then ready for re-eval
2. NOORSTUDIO character consistency requires img2img seed from first generated image (2-3h fix)
3. SACREDCHAIN is deployment-ready (just needs E2E test + deploy)
4. AFAQ needs Phase 4 re-eval (no code work)
5. MADINAH + AGENT MARKETPLACE are waiting on Architect (human actions)
6. NIKAHX queued for Phase 2 when capacity available

**Revenue potential if all ship:** $3,850-12,500/mo within 4-6 weeks

**Critical path:** Fix Petdate + NoorStudio + Ship SacredChain = $3,000-5,000/mo minimum
