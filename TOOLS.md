# TOOLS.md — Local Configuration

> ⚠️ This file contains local setup specifics. Do NOT commit to git.
> Keep separate from MEMORY.md for security.

---

## Workspace Paths

```
WORKSPACE:     ~/.openclaw/workspace/
REPOS:         ~/.openclaw/workspace/03_REPOS/
SKILLS:        ~/.openclaw/skills/
CONFIG:        ~/.openclaw/openclaw.json
MEMORY:        ~/.openclaw/workspace/MEMORY.md
DAILY_LOGS:    ~/.openclaw/workspace/memory/
```

---

## Project Repositories

| Project | Path | Dev Server | Production URL |
|---------|------|------------|----------------|
| AFAQ ESG | `03_REPOS/afaq-esg/` | `localhost:5001` | https://afaq-esg.vercel.app |
| NoorStudio | `03_REPOS/Noorstudio/` | `localhost:5173` | https://noorstudio-staging.vercel.app |
| Mawashi | `03_REPOS/mawashi/` | `localhost:3000` | https://mawashi.vercel.app |
| NikahPlus | `03_REPOS/nikahplus/` | `localhost:8081` | TBD |
| SacredChain | `03_REPOS/sacredchain/` | `localhost:5174` | https://sacredchain.vercel.app |

---

## API Integrations

### Anthropic (Primary LLM)
```
Provider: anthropic
Models: claude-opus-4-5, claude-sonnet-4-5
Config: models.providers.anthropic.apiKey
```

### Moonshot (Kimi)
```
Provider: moonshot
Model: kimi-k2.5
Config: models.providers.moonshot.apiKey
```

### Perplexity (Search)
```
Provider: perplexity
Model: sonar-pro
Config: models.providers.perplexity.apiKey
```

### Ollama (Local)
```
Provider: ollama
Model: qwen3:8b
Reasoning: false (important!)
Config: models.providers.ollama
```

---

## Channels

### Telegram
```
Bot Token: [CONFIGURED]
DM Policy: pairing
Config: channels.telegram
```

---

## Deployment Platforms

### Vercel
```
Projects: AFAQ, NoorStudio, Mawashi, SacredChain
CLI: vercel (installed globally)
Config: vercel.json per project
```

### Supabase
```
Projects: AFAQ, SacredChain
Edge Functions: Yes
Config: supabase/ directory per project
```

---

## Browser Tool

```
Status: Requires Chrome extension
Issue: "Chrome extension relay is running, but no tab is connected"
Workaround: Request Architect manual verification before pushing untested code
```

---

## Common Commands

```bash
# Start dev servers
cd ~/.openclaw/workspace/03_REPOS/afaq-esg && npm run dev
cd ~/.openclaw/workspace/03_REPOS/noor-studio && npm run dev

# Deploy to Vercel
vercel --prod

# Gateway management
openclaw gateway status
openclaw gateway restart
openclaw doctor
openclaw logs --follow

# Config management
openclaw config get <path>
openclaw config set <path> <value>
```

---

*Last updated: 2026-02-07*
*Edit anytime when local setup changes*
