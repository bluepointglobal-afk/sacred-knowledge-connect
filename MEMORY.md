# MEMORY.md — Long-Term Learnings

> This file contains **curated** learnings and decisions.
> Daily raw logs go in `memory/YYYY-MM-DD.md`.
> Review weekly and extract patterns here.

---

## Decisions

### 2026-02-07: Orchestrator Model Clarified

**Context:** Dave was acting as solo dev OR admin, neither is correct.

**Decision:** Dave operates as a CEO with capable employees:
1. Scope tasks clearly for workers
2. Review output critically
3. Verify it works before shipping
4. Ship or send back with specific feedback

**Key insight:** The missing piece is steps 3 and 4 — critical review and verification. That's what makes a CEO, not an admin.

---

### 2026-02-06: Verification Protocol Established

**Context:** Code was being pushed without visual verification.

**Decision:** Non-negotiable workflow:
```
Code → Local test → Screenshot → Push → Test prod → Screenshot → Done
```

No exceptions for tool failures — escalate and wait for manual verification.

---

### 2026-02-06: Subagent Isolation Pattern

**Context:** Changing global model defaults broke the main session.

**Decision:** Never change `agents.defaults.model.primary`. Create specific agent entries in `agents.list` instead. Main session stays stable, subagents use their own models.

---

## Learnings

### Pattern: Status Reports = No Output

When Dave produces status matrices, summaries, or asks "Ready to proceed?" — this means zero actual work happened. The correct response is immediate execution, not reporting.

### Pattern: Browser Tool Dependency

Dave cannot visually verify without browser tool working. When browser tool fails:
1. Do NOT push untested code
2. Request Architect manual verification
3. Wait for confirmation before deploying

curl/web_fetch are insufficient for UI verification.

### Pattern: Heartbeat as Execution Trigger

Heartbeat is for **execution**, not monitoring. On every heartbeat:
1. Read SPRINT.md
2. Find first unblocked task
3. Execute it. Now.

Never produce status documents on heartbeat.

---

## Project-Specific Learnings

### AFAQ ESG
- Vercel SPA routing requires `vercel.json` with rewrites
- Sample report route: `/sample-report`
- Build succeeds locally but Vercel may need cache clear

### NoorStudio
- Character consistency is the P2 blocker
- Image generation via replicate API

### Mawashi
- Saudi livestock market has specific regulatory requirements
- Arabic RTL support essential

---

## Blocked Items (Human-Only)

These require Architect action, not Dave:
- External emails to real contacts
- Upwork proposal submissions
- Production deploys with payment integration
- Spending > $5
- Killing projects
- Modifying openclaw.json model providers

---

*Last updated: 2026-02-07*
*Curate weekly from daily logs. Both Architect and Dave can update.*
