# Perplexity — Market / Deep Research Helper

## Key storage
- The Perplexity API key is stored in OpenClaw config env vars as `PERPLEXITY_API_KEY`.
- Do **not** paste it into repos/docs.

## What we use it for
- Market anchoring: competitor maps, pricing signals, buyer triggers
- Deep research summaries with citations

## API notes
Perplexity exposes an OpenAI-style chat API (`/chat/completions`).

## Quick CLI (local)
Create a one-off query using curl (prints JSON):

```bash
curl https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar-pro",
    "messages": [
      {"role": "system", "content": "You are a market research analyst. Cite sources."},
      {"role": "user", "content": "List alternatives to Nasdaq Metrio for SMEs in GCC. Include pricing signals."}
    ]
  }'
```

## Colony protocol
- Market Specialist uses Perplexity to generate *candidate lists*, then we still verify critical claims by visiting primary sources (vendor sites, docs, pricing pages).
