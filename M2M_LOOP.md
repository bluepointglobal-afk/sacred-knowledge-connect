# M2M AUTONOMOUS LOOP — Dave + OpenClaw Architecture
## Revised Blueprint: Keep Dave, Fix the Broken Parts

---

## PRINCIPLE

Dave (OpenClaw) stays as the CEO/orchestrator. But every tool he uses must be bulletproof.
If a tool breaks, the loop breaks. So we fix each tool independently and give Dave reliable commands.

---

## THE FULL LOOP

```
YOU (Telegram/WhatsApp)
  ↕
DAVE (OpenClaw) — CEO orchestrator
  │
  ├── PHASE 1: MARKET ANALYSIS
  │   ├── Perplexity → competitor research, market data
  │   ├── Kimi → parallel research tasks
  │   └── Ollama → synthesize into ICP + gap analysis
  │   Output: reports/icp-{project}.md
  │   Notify you: "Phase 1 done. ICP ready."
  │
  ├── PHASE 2: BUILD & DEV
  │   ├── Codex → autonomous coding (greenfield or brownfield)
  │   ├── Cursor → interactive coding (when you're hands-on)
  │   ├── Ollama → boilerplate, commit messages
  │   ├── TEST LOCAL: dev server → OpenClaw Chrome browser → screenshot localhost
  │   └── DEPLOY: deploy.sh → Vercel → verify production URL
  │   Output: Live URL + screenshots
  │   Notify you: "Phase 2 done. Live at {url}."
  │
  ├── PHASE 3: QA (Robot Tester)
  │   ├── Playwright → headless E2E tests
  │   │   - Does the page load? (status 200)
  │   │   - Do buttons work? Do forms submit?
  │   │   - Are there console errors?
  │   │   - Screenshot every step
  │   └── Ollama → analyze screenshots for broken layouts
  │   Output: reports/qa-{project}-{date}.md + screenshots/
  │   Notify you: "QA done. {pass_rate}% pass."
  │
  └── PHASE 4: SME EVALUATION (Human-Like Browser Walk)
      ├── OpenClaw Chrome browser (NOT Playwright)
      │   - Dave opens the LIVE production URL in Chrome
      │   - Browses AS the ICP persona from Phase 1
      │   - "I'm Ahmed, HSE manager at a Saudi SME..."
      │   - Reads the copy. Evaluates trust. Checks pricing.
      │   - Takes screenshots of friction points
      │   - This is JUDGMENT, not mechanical testing
      │   
      ├── Verdict: WOULD PAY / WOULD EXPLORE / WOULD BOUNCE
      ├── Trust killers, value gaps, buy triggers
      ├── Feedback matrix → routes back to Phase 1 or 2
      │
      └── Output: reports/sme-evaluation-{project}-{date}.md
                  reports/feedback-matrix-{project}-{date}.md
          Notify you: "SME verdict: {verdict}. Top 3 actions."
```

---

## PLAYWRIGHT vs CHROME — DIFFERENT JOBS

| | Playwright (Phase 3 QA) | OpenClaw Chrome (Phase 4 SME) |
|---|---|---|
| **Purpose** | Does it WORK? | Would someone PAY? |
| **Mindset** | Robot tester | Human buyer |
| **Checks** | Links, forms, errors, load times | Trust, value, pricing, copy |
| **Runs** | Headless, no UI needed | Real Chrome, sees what user sees |
| **Example** | "Button returns 200" | "This pricing page confuses me" |
| **Output** | Pass/fail report | Feedback matrix with actions |

**Phase 3 runs BEFORE Phase 4.** No point doing SME evaluation on a broken product.

---

## GREENFIELD vs BROWNFIELD

### Greenfield (New Project, Empty/New Repo)

```
Phase 1 Question: "What should we build?"
│
├── Perplexity: Market research from scratch
├── Output: ICP, gap analysis, sweet spot, feature list
├── Result: PRD (Product Requirements Document)
│
▼ Phase 2: Build from zero based on PRD
```

### Brownfield (Existing Repo with Code)

```
Phase 1 Question: "Did we build the right thing?"
│
├── Dave: Crawl the repo — what features exist?
├── Perplexity: Current market state, competitors
├── Compare: What we have vs what market wants
├── Categorize every feature:
│   ├── MISSING — market needs it, we don't have it → build
│   ├── UNNECESSARY — we built it, nobody cares → cut
│   ├── BROKEN — exists but doesn't work → fix
│   └── GOLD — exists, works, market wants → protect
│
├── Output: PRD delta (what to add, cut, fix)
│
▼ Phase 2: Modify existing code based on PRD delta
```

### Phase 1 ALWAYS Runs
Even for existing projects with 22 modules (AFAQ), Phase 1 re-validates:
- "Do Saudi SMEs actually need all 22 modules?"
- "What are competitors charging?"  
- "Which 5 modules would make someone pay?"
- Cut the rest. Ship lean.

---

## FIXING DAVE'S BROKEN PARTS

### 1. Browser Extension (for Phase 4 SME)

**Status from last session:** Extension reinstalled (v2026.2.6-3), extension at `~/.openclaw/browser/chrome-extension`

**Pre-flight check Dave should run before any SME walk:**
```bash
# Verify browser relay is running
openclaw browser status | grep running
# If "running: false" → start it:
openclaw browser start
```

**If extension detaches (common issue):**
- Click the OpenClaw extension icon on the tab to reattach
- Badge shows "ON" when connected

**Give Dave this rule:**
```
Before any Phase 4 SME evaluation:
1. Run: openclaw browser status
2. If not running: openclaw browser start
3. Open production URL in Chrome tab
4. Click OpenClaw extension icon to attach tab
5. Verify: openclaw browser snapshot (should return page content)
6. THEN start the SME walk

If browser tool fails after 2 attempts → skip SME walk, 
notify Architect, continue with other projects.
```

### 2. Deploy Script (for Phase 2)

**Already working.** Script at: `~/.openclaw/workspace/scripts/deploy.sh`
```bash
bash ~/.openclaw/workspace/scripts/deploy.sh <repo-folder-name>
```
Uses `vercel --prod --yes --no-wait` — no hanging.

### 3. Playwright (for Phase 3 QA)

**Needs one-time install:**
```bash
npm install -g playwright
npx playwright install chromium
```

**Test scripts per project at:** `~/.openclaw/workspace/scripts/qa-{project}.js`

Dave can run them:
```bash
node ~/.openclaw/workspace/scripts/qa-nikahx.js
```

### 4. Deployment Protection (Vercel)

**Already fixed for NikahX.** For new projects, Dave must check:
```bash
# After first deploy, test if public:
curl -s -o /dev/null -w "%{http_code}" <DEPLOY_URL>
# If 401 → tell Architect to disable deployment protection in Vercel dashboard
```

---

## DAVE'S STANDING ORDERS

```
You are Dave, CEO orchestrator managing projects through the M2M cycle.

PROJECTS (in ~/.openclaw/workspace/03_REPOS/):
Any folder in 03_REPOS is a project. Currently:
- AFAQesg, NikahX, mawashi-marketplace, Sacredchain
- Noorstudio, petdate, agent-hub-connect
- nabawi-immersion-premier, madinah-immersion
- Plus any new folder Architect drops in

FOR EACH PROJECT, DETERMINE:

1. Is it GREENFIELD (new/empty) or BROWNFIELD (has existing code)?
   - Greenfield: Phase 1 asks "what should we build?"
   - Brownfield: Phase 1 asks "did we build the right thing?"

2. What M2M phase is it in?
   - No ICP/market research → Phase 1
   - Has ICP but not deployed → Phase 2
   - Deployed but not QA'd → Phase 3
   - QA'd but no SME evaluation → Phase 4
   - Has SME evaluation → check feedback matrix, start next cycle

EXECUTION RULES:

Phase 1 (Market Analysis):
- Use Perplexity for competitor/market research
- Use Kimi for parallel research tasks
- Use Ollama to synthesize findings
- Output: reports/icp-{project}.md + reports/gap-analysis-{project}.md
- For brownfield: also output feature audit (MISSING/UNNECESSARY/BROKEN/GOLD)

Phase 2 (Build & Dev):
- Code the changes
- TEST LOCALLY FIRST (non-negotiable)
- Screenshot localhost with browser tool
- Only then: bash ~/.openclaw/workspace/scripts/deploy.sh {project}
- Screenshot production
- Both screenshots must show the feature working

Phase 3 (QA):
- Run Playwright E2E tests: node ~/.openclaw/workspace/scripts/qa-{project}.js
- Analyze screenshots with Ollama
- Output: reports/qa-{project}-{date}.md
- Must pass >80% before moving to Phase 4

Phase 4 (SME Evaluation):
- This is DIFFERENT from QA
- Open production URL in Chrome (openclaw browser)
- Load ICP persona from Phase 1
- Browse AS that person — read copy, evaluate trust, check pricing
- Verdict: WOULD PAY / WOULD EXPLORE / WOULD BOUNCE
- Output: reports/sme-evaluation-{project}-{date}.md
- Output: reports/feedback-matrix-{project}-{date}.md
- Feedback matrix routes actions back to Phase 1 or 2

COMMUNICATION:
- Notify Architect on Telegram after each phase completes
- Format: "[PROJECT] Phase X complete. {one-line summary}. {next action}."
- Only escalate if blocked after 2 attempts at solving yourself

NEW PROJECTS:
When Architect drops a new folder in 03_REPOS:
1. Check .gitignore has node_modules/ — add if missing
2. Determine greenfield/brownfield
3. Start at Phase 1
4. Run the full M2M cycle

DEPLOY COMMAND:
bash ~/.openclaw/workspace/scripts/deploy.sh <folder-name>

NEVER:
- Push code you haven't tested locally
- Skip Phase 1 for ANY project (even existing ones)
- Commit node_modules
- Report "done" without screenshots
- Stay blocked — try 2 fixes, then escalate once
```

---

## IMMEDIATE SETUP CHECKLIST

### Already Done ✅
- [x] deploy.sh script created and working
- [x] NikahX deployed and returning 200
- [x] All repos cleaned (gitignore fixed)
- [x] Git config set globally
- [x] OpenClaw browser extension reinstalled (v2026.2.6-3)
- [x] Vercel deployment protection disabled for NikahX

### Needs Doing (on Mac Mini)
- [ ] Install Playwright:
      `npm install -g playwright && npx playwright install chromium`
- [ ] Verify browser extension works:
      `openclaw browser status` → should show running: true
      If not: `openclaw browser start`
- [ ] Set up Telegram bot (if not already):
      Message @BotFather → /newbot → get token
- [ ] Fix AFAQ git remote:
      `cd ~/.openclaw/workspace/03_REPOS/AFAQesg && git remote -v`
      Then fix the URL if it says "yourusername"
- [ ] Disable Vercel deployment protection for all projects
- [ ] Send Dave the standing orders above

### First Test Run
Pick NikahX (already deployed). Tell Dave:
```
Run M2M Phase 4 on NikahX. It's brownfield.
Phase 1: Already have ICP from before.
Phase 2: Already deployed.
Phase 3: Skip for now (we'll add Playwright later).
Phase 4: Open https://nikahplus-app.vercel.app in browser.
You are Fatima, 28, British-Somali Muslim living in London.
Looking for a practising husband. Tech-savvy but cautious about apps.
Walk the product as Fatima. Give me your verdict.
```

This tests the SME browser walk end-to-end.
If it works → the loop works → replicate for all projects.

---

## COST

| Tool | Monthly Cost |
|------|-------------|
| OpenClaw | Free (self-hosted) |
| Ollama | Free (local) |
| Playwright | Free |
| n8n | Free (self-hosted) |
| Vercel | Free tier |
| Telegram | Free |
| Perplexity API | ~$5 |
| Cursor Pro | $20 (optional, for interactive coding) |
| **Total** | **$5-25/month** |

---

## THE DIFFERENCE FROM BEFORE

Before: Dave tried to do everything → broke constantly → you fixed Dave all day.

Now: Dave orchestrates. Each tool does ONE job reliably.
- deploy.sh deploys (proven today)
- Playwright tests mechanically (headless, no extension needed)  
- Chrome extension browses as SME (human-like evaluation)
- Perplexity/Kimi research (API calls, no local issues)
- Ollama synthesizes (local, free, no rate limits)
- Telegram notifies (simple, reliable)

Dave's job is to call the right tool at the right phase. Not to BE all the tools.

---

## PHASE 4 GOLDEN PATH (MANDATORY)

Phase 4 is NOT a landing page review. It is a FULL PRODUCT WALK.

The SME persona must complete the ENTIRE user journey — signup to core value delivery. If a step is broken or missing, that's a Phase 2 finding.

### Golden Path Definition Per Project

Before running Phase 4 on any project, define the golden path:
"What does a paying user DO with this product, step by step?"

Then walk every step. Screenshot every step. If you can't complete a step, document WHY in the feedback matrix.

### Example Golden Paths

**Noorstudio (AI Children's Books):**
1. Sign up / create account
2. Create character universe / knowledge base
3. Add characters with descriptions
4. Generate story from template
5. Preview illustrated book with consistent characters
6. Export PDF
7. Every step screenshotted. Every failure documented.

**AFAQ (ESG Reporting):**
1. Sign up / create company profile
2. Select reporting framework (GRI/SASB/TCFD)
3. Run compliance gap assessment
4. View compliance score / dashboard
5. Generate full disclosure report
6. Export report (PDF/KDP)
7. Every step screenshotted. Every failure documented.

**NikahX (Islamic Matrimonial):**
1. Sign up / create profile
2. Add photos, bio, preferences
3. Set Islamic criteria (sect, practice level)
4. Browse/filter matches
5. Send interest / message
6. Every step screenshotted. Every failure documented.

**Mawashi (Livestock Marketplace):**
1. Sign up as buyer or seller
2. Create livestock listing (seller)
3. Browse listings with filters (buyer)
4. Contact seller / negotiate
5. Complete transaction
6. Every step screenshotted. Every failure documented.

**Sacredchain (Islamic Learning):**
1. Sign up as student
2. Browse courses / teachers
3. Enroll in course
4. Access learning content
5. Complete lesson / track progress
6. Verify escrow payment flow
7. Every step screenshotted. Every failure documented.

**Petdate (Pet Dating):**
1. Sign up / create pet profile
2. Add pet photos and details
3. Set preferences / compatibility criteria
4. Browse matches
5. Send interest / connect
6. Every step screenshotted. Every failure documented.

### Scoring After Golden Path

Only score WOULD PAY / WOULD EXPLORE / WOULD BOUNCE after completing the golden path, not after seeing the homepage.

If golden path breaks at step 2, the verdict is WOULD BOUNCE with feedback: "Product is not functional beyond signup."

### Greenfield vs Brownfield Golden Path

**Brownfield:** Walk the existing golden path. Document what works and what's broken.

**Greenfield:** If golden path doesn't exist yet (no signup, no core feature), Phase 4 verdict is automatic: WOULD BOUNCE — route back to Phase 2 to build the core flow first. Don't waste time SME-evaluating a landing page.
