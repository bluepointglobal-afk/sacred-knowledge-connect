#!/bin/bash
REPO="$HOME/.openclaw/workspace/03_REPOS/$1"
if [ ! -d "$REPO" ]; then echo "❌ Repo not found: $1"; exit 1; fi
cd "$REPO"
echo "🚀 Deploying $1..."
git add -A && git commit -m "deploy: $(date +%Y%m%d-%H%M%S)" --allow-empty && git push origin main 2>&1
vercel --prod --yes --no-wait 2>&1
echo "✅ $1 deployed"
