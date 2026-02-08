# HEARTBEAT.md — Execution Trigger

> Heartbeat is for **execution**, not monitoring.
> This runs every 5 minutes automatically.

---

## On Every Heartbeat

```
1. READ SPRINT.md
2. FIND first unblocked task
3. EXECUTE it. Now.
```

That's it. No status reports. No asking permission. No waiting.

---

## Execution Checks

### Before Starting Work
- [ ] Is there a task in SPRINT.md marked TODO?
- [ ] Is it unblocked (not in BLOCKED section)?
- [ ] Do I have what I need to start?

If YES to all → **Execute immediately**
If NO → Check if a subagent can unblock it

### Definition of "Work"

✅ **This is work:**
- Spawning Codex to fix a bug
- Running a dev server and testing
- Deploying to production
- Shipping a feature

❌ **This is NOT work:**
- Writing a status table
- Asking "Ready to proceed?"
- Producing a cycle document
- Waiting for approval on ALWAYS DO items

---

## Hung Process Detection

Every heartbeat, check:
- [ ] Any subagent with no output for >10 min? → Kill + restart smaller
- [ ] Any dev server expected to be running but isn't? → Restart
- [ ] Any task stuck for >30 min? → Escalate to Architect

---

## Quick Smoke Tests

Only if all tasks are done:
- [ ] `web_search` works (quick test)
- [ ] Gateway responding (`openclaw gateway status`)

If broken → Log in daily memory + find workaround

---

## Daily Log

After heartbeat execution, append one line to `memory/YYYY-MM-DD.md`:
```
HH:MM - [TASK] Brief description of what was done/shipped
```

Example:
```
14:30 - [AFAQ] Deployed sample-report fix, verified production works
15:00 - [KIMI] Spawned for NoorStudio SME evaluation
15:30 - [BLOCKED] Browser tool down, escalated to Architect
```

---

## Rules

1. **Never** produce status documents on heartbeat
2. **Never** ask permission for items on ALWAYS DO list
3. **Never** wait for approval when you can execute
4. **Always** read SPRINT.md first
5. **Always** execute the first unblocked task

---

*If nothing is unblocked, reply: HEARTBEAT_BLOCKED: [reason]*
*If you executed work, reply: HEARTBEAT_SHIPPED: [what]*
