# SacredChain Navigation Testing Workflow

## The Loop: Code → Test → Debug → Fix → Repeat

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT LOOP                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐                                                      │
│   │ 1. UPDATE    │ ◄─────────────────────────────────────────────┐      │
│   │ USER_FLOWS.md│    If adding new routes/features              │      │
│   └──────┬───────┘                                               │      │
│          │                                                       │      │
│          ▼                                                       │      │
│   ┌──────────────┐                                               │      │
│   │ 2. CODE      │                                               │      │
│   │ Feature      │                                               │      │
│   └──────┬───────┘                                               │      │
│          │                                                       │      │
│          ▼                                                       │      │
│   ┌──────────────┐     ┌──────────────┐                         │      │
│   │ 3. RUN TESTS │────►│ ALL PASS?    │────► YES ───► COMMIT ───┘      │
│   │ npm run      │     │              │                                 │
│   │ test:nav     │     └──────┬───────┘                                 │
│   └──────────────┘            │                                         │
│                               │ NO                                      │
│                               ▼                                         │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │ 4. DEBUG WITH CLAUDE                                      │         │
│   │                                                           │         │
│   │  "Here's the test failure: [output]                       │         │
│   │   Here's the expected flow from USER_FLOWS.md: [section]  │         │
│   │   Help me trace what's wrong."                            │         │
│   │                                                           │         │
│   └───────────────────────────┬──────────────────────────────┘         │
│                               │                                         │
│                               ▼                                         │
│   ┌──────────────┐     ┌──────────────┐                                │
│   │ 5. FIX       │────►│ RUN TESTS    │────► Loop back to step 3       │
│   │              │     │ AGAIN        │                                 │
│   └──────────────┘     └──────────────┘                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference Commands

```bash
# Quick smoke test (30 seconds)
npm run test:quick

# Full navigation tests (2-3 minutes)
npm run test:nav

# See what's happening visually
npm run test:debug

# Interactive test UI (best for debugging)
npm run test:ui

# View last test report
npm run report

# Pre-commit check
npm run precommit
```

---

## Daily Workflow

### Starting Your Day
```bash
# Pull latest, then verify navigation still works
npm run test:nav
```

### While Coding
```bash
# After any router/navigation change
npm run test:quick

# If quick test fails
npm run test:debug   # See what's happening
```

### Before Committing
```bash
# Always run full test
npm run test:nav

# If pass → commit
# If fail → debug with Claude, fix, re-test
```

---

## Files in This Testing Suite

```
sacredchain-testing/
├── USER_FLOWS.md              # Source of truth - expected navigation
├── CLAUDE_DEBUG_PROMPTS.md    # Copy-paste prompts for debugging
├── WORKFLOW.md                # This file - the process
├── playwright.config.ts       # Test configuration
├── package.json               # Scripts and dependencies
├── test-nav.sh               # Bash runner with nice output
└── tests/
    ├── navigation.spec.ts    # Core route tests (run frequently)
    ├── auth.spec.ts          # Login/logout/redirect tests
    └── flow-student.spec.ts  # Full user journey tests
```

---

## Setup (One Time)

```bash
# Install dependencies
npm install

# Install browsers for Playwright
npx playwright install chromium

# Make test script executable
chmod +x test-nav.sh

# Run first test to verify setup
npm run test:quick
```

---

## Integration with Your SacredChain Project

Copy these files into your SacredChain repo:

```bash
# From your sacredchain directory:
cp -r /path/to/sacredchain-testing/* ./testing/

# Or merge into existing structure:
cp USER_FLOWS.md ./docs/
cp -r tests/* ./tests/e2e/
cp playwright.config.ts ./
```

Add to your existing package.json scripts:
```json
{
  "scripts": {
    "test:nav": "playwright test --project=navigation",
    "test:debug": "playwright test --headed"
  }
}
```

---

## When Things Break (Debugging Guide)

### "Route not found" or 404
1. Check `USER_FLOWS.md` - is the route documented?
2. Check your router config (React Router)
3. Check if the route is behind auth guard

### "Element not visible"
1. Run `npm run test:debug` to see the page state
2. Check if element is conditionally rendered
3. Check if data needs to load first (add waitFor)

### "Timeout waiting for navigation"
1. Check if redirect is happening
2. Check auth state - are you logged in/out as expected?
3. Check for infinite redirect loops

### "Expected X but got Y"
1. Trace the flow in `USER_FLOWS.md`
2. Find where actual diverges from expected
3. Check the component/route at that divergence point

---

## The Golden Rule

**Never commit code without `npm run test:nav` passing.**

This single habit will save you hours of debugging broken flows later.
