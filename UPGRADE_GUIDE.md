# OpenClaw Upgrade Guide — Clawdbot File System

## What's New

This upgrade introduces the Clawdbot/Bujji file system pattern which separates concerns properly:

### Before (Old System)
```
~/.openclaw/workspace/
├── SYSTEM_PROMPT.md    ← Everything in one file
├── HEARTBEAT.md        ← Monitoring checklist
└── SPRINT.md           ← Status matrix
```

### After (New System)
```
~/.openclaw/workspace/
├── SOUL.md             ← Personality & voice (rarely edited)
├── USER.md             ← Who the Architect is (setup once)
├── AGENTS.md           ← Subagent rules & workspace config
├── TOOLS.md            ← Local config (API keys, paths, hosts)
├── MEMORY.md           ← Long-term curated learnings
├── SPRINT.md           ← Concrete task queue (checkboxes, not status)
├── HEARTBEAT.md        ← Execution trigger (not monitoring)
├── SYSTEM_PROMPT.md    ← References other files, stays lean
└── memory/
    └── YYYY-MM-DD.md   ← Daily raw logs (auto-generated)
```

---

## File Purposes

| File | Who Edits | When | Purpose |
|------|-----------|------|---------|
| SOUL.md | Architect (rare) | Major personality changes | Agent identity |
| USER.md | Architect (setup) | Once, then rarely | Principal context |
| AGENTS.md | Both | When processes change | Colony rules |
| TOOLS.md | Both (anytime) | Config changes | Local setup, secrets |
| MEMORY.md | Both (weekly) | After daily log review | Curated learnings |
| SPRINT.md | Dave (constantly) | Every task update | What to work on |
| HEARTBEAT.md | Architect | When heartbeat behavior changes | Execution trigger |
| memory/*.md | Dave (auto) | Daily | Raw session logs |

---

## Installation Steps

### 1. Backup Current State
```bash
cp -r ~/.openclaw/workspace ~/.openclaw/workspace-backup-$(date +%Y%m%d)
```

### 2. Create Memory Directory
```bash
mkdir -p ~/.openclaw/workspace/memory
```

### 3. Copy New Files
```bash
# From this upgrade package:
cp SOUL.md ~/.openclaw/workspace/
cp USER.md ~/.openclaw/workspace/
cp AGENTS.md ~/.openclaw/workspace/
cp TOOLS.md ~/.openclaw/workspace/
cp MEMORY.md ~/.openclaw/workspace/
cp SPRINT.md ~/.openclaw/workspace/
cp HEARTBEAT.md ~/.openclaw/workspace/
cp SYSTEM_PROMPT.md ~/.openclaw/workspace/
cp memory/2026-02-07.md ~/.openclaw/workspace/memory/
```

### 4. Clear Sessions (Fresh Start)
```bash
rm -rf ~/.openclaw/agents/main/sessions/*
rm -rf ~/.openclaw/agents/main/memory/*
```

### 5. Restart Gateway
```bash
openclaw gateway restart
```

### 6. Verify
```bash
openclaw gateway status
openclaw doctor
```

---

## Key Behavioral Changes

### Old Heartbeat (Monitoring)
```
- Check for hung subagents
- Check web_search works
- Update M2M phases
- If nothing actionable, reply HEARTBEAT_OK
```

### New Heartbeat (Execution)
```
1. Read SPRINT.md
2. Find first unblocked task
3. Execute it. Now.
```

**No more HEARTBEAT_OK.** Either HEARTBEAT_SHIPPED or HEARTBEAT_BLOCKED.

---

### Old SPRINT (Status Matrix)
```
| Project | Phase | Status | Next Action |
|---------|-------|--------|-------------|
| AFAQ    | 2     | WIP    | Continue... |
```

### New SPRINT (Task Queue)
```
## P0 — Ship This Week
- [ ] Fix /sample-report Vercel 404
- [ ] Verify sample report renders correctly
- [ ] Screenshot both local and production working
```

**Checkboxes, not status.** Either TODO or DONE.

---

### Old Memory (None)
No separation between daily logs and long-term learnings.

### New Memory (Two-Tier)
```
memory/2026-02-07.md  ← Raw daily logs
MEMORY.md             ← Curated patterns (weekly review)
```

---

## Critical Rules

1. **TOOLS.md never goes in git** — Contains API keys and local paths
2. **MEMORY.md is curated** — Don't dump everything, extract patterns
3. **Daily logs are raw** — Append on every heartbeat/task completion
4. **SPRINT.md is source of truth** — Always read first on heartbeat
5. **Subagent isolation** — Never change global defaults, use agents.list

---

## Verification Checklist

After installation:

- [ ] Gateway running: `openclaw gateway status`
- [ ] Files in place: `ls ~/.openclaw/workspace/*.md`
- [ ] Memory dir exists: `ls ~/.openclaw/workspace/memory/`
- [ ] Sessions cleared: `ls ~/.openclaw/agents/main/sessions/` (should be empty)
- [ ] Send test message via Telegram

---

*Upgrade created: 2026-02-07*
