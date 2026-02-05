# SacredChain SME E2E Evaluation (Head of Compliance, UK Food Manufacturer)
**Date:** 2026-02-03 (PST)  
**Persona:** Head of Compliance at a 500-employee UK food manufacturer preparing for GCC export; urgent Halal certification support needed in 8–10 weeks; budget £5k–£15k.

## Goal / Expected E2E Flow
Browse experts/teachers → find **Halal certification consultant** → book a session → pay → confirm **escrow held** → mark session complete → confirm **payout to expert triggered**.

## What I Tested (What Actually Happened)
### 1) Discovery: finding Halal certification expertise
- Navigated to **For Organizations / Business** landing page.
- The page messaging is on-point for this persona:
  - “Verified scholars and consultants in Shariah, halal, ethics…”
  - A service card explicitly titled **“Halal Product Certification”**
  - A featured expert card: **“Sheikh Abdullah Yusuf — Halal Certification Specialist”**

**Friction / blocker:**
- Both **“Browse Experts”** and **“View All Experts”** link to **`/business/experts`**, which currently **404s**.
- The app logs show: `404 Error: User attempted to access non-existent route: /business/experts`.

**Impact:** as an SME buyer, I cannot:
- Browse/filter experts (e.g., food manufacturing experience, UK references)
- Open the featured Halal expert profile reliably (no profile route exists)
- Validate credentials/case studies (critical trust trigger)

### 2) Booking a session
- In the consumer/teacher flow (`/teachers/:id`) there is a **“Book Session”** flow with date/time + duration.
- However, for the org/compliance Halal use case, the **Business expert booking surface is incomplete** due to the missing experts route/profile.

**Impact:** I couldn’t complete “find Halal consultant → book”.

### 3) Payment + escrow verification
- The UI copy states: “Your payment will be held until the session is completed.”
- The backend schema and functions suggest escrow is designed:
  - `payments` table with statuses including **`held`**, **`completed`**, and `escrow_released_at`
  - `teacher_earnings` with statuses **`pending`** → **`available`** → **`paid_out`**
  - Edge functions exist: `create-checkout-session`, `stripe-webhook`, `release-escrow`, `request-payout`

**Blocker:** Without a working expert profile / booking entry point, I couldn’t create a real booking/payment to observe:
- payment record creation
- transition to **held/escrow** via webhook
- earnings record creation

### 4) Session completion + payout trigger
- Backend functions exist to support escrow release and payout request.

**Blocker:** No reachable, end-user-visible UI path to:
- mark a session complete / confirm delivery
- trigger escrow release
- verify payout event/state change from the SME side

## Additional Technical Friction Observed
- Running the dev server twice resulted in it being terminated with **SIGKILL** (Vite process exited unexpectedly). This interrupted the manual E2E run.

## SME View: What I Need to See (to proceed)
As Head of Compliance buying Halal certification support, I need:
1. **Expert profiles that prove domain fit**: halal certification bodies worked with, audit success rates, food manufacturing case studies, UK/EU references.
2. **Clear scope + deliverables**: audit prep checklist, ingredient traceability templates, cross-contamination controls, expected timeline.
3. **Commercial clarity**: hourly vs fixed price; milestones; what escrow protects (and when it releases).
4. **A working booking surface** for business experts (not just teachers) including discovery call booking.

## Verdict
**WOULD BOUNCE**

### Why
The product proposition is compelling for this persona, but the **critical path is broken at discovery**:
- The key route for organizations (**`/business/experts`**) 404s, preventing expert evaluation and booking.
- Without that, I can’t reach payment/escrow/payout verification in a credible business flow.

## Top Fixes (Highest leverage)
1. **Implement `/business/experts` route** (list + filters) and individual expert profiles.
2. Add **credential proof** and **case studies** on expert profiles (food-manufacturing specific).
3. Expose **project-style engagement** (milestones) for business buyers, not only 1:1 “teacher sessions.”
4. Add **dashboard transparency**:
   - “Payment held in escrow” status
   - “Release on completion” confirmation step
   - Payout status to expert (at least state transitions)
5. Stabilize local dev server/process management to avoid SIGKILL interruptions.
