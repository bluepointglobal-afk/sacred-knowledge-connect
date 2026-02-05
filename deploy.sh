#!/bin/bash
# SacredChain Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e

ENV=${1:-staging}

echo "🚀 SacredChain Deployment - $ENV"
echo "=================================="

# Check requirements
command -v supabase >/dev/null 2>&1 || { echo "❌ supabase CLI not found. Install: brew install supabase/tap/supabase"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "❌ vercel CLI not found. Install: npm i -g vercel"; exit 1; }

# Confirm deployment
read -p "Deploy to $ENV? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# 1. Deploy Supabase Edge Functions
echo ""
echo "📦 Deploying Supabase Edge Functions..."
cd supabase/functions
supabase functions deploy create-checkout-session --project-ref ${SUPABASE_PROJECT_REF}
supabase functions deploy stripe-webhook --project-ref ${SUPABASE_PROJECT_REF}
supabase functions deploy release-escrow --project-ref ${SUPABASE_PROJECT_REF}
supabase functions deploy create-connect-account --project-ref ${SUPABASE_PROJECT_REF}
supabase functions deploy create-connect-link --project-ref ${SUPABASE_PROJECT_REF}
supabase functions deploy request-payout --project-ref ${SUPABASE_PROJECT_REF}
cd ../..

echo "✅ Edge Functions deployed"

# 2. Apply database migrations
echo ""
echo "🗄️  Applying database migrations..."
supabase db push --project-ref ${SUPABASE_PROJECT_REF}
echo "✅ Migrations applied"

# 3. Deploy frontend to Vercel
echo ""
echo "🌐 Deploying frontend to Vercel..."
if [ "$ENV" == "production" ]; then
    vercel --prod
else
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Post-deployment checklist:"
echo "  1. Set Supabase secrets (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)"
echo "  2. Configure Stripe webhook endpoint: https://<project-ref>.supabase.co/functions/v1/stripe-webhook"
echo "  3. Test E2E flow: Browse teachers → Enroll → Pay → Verify DB records"
echo "  4. Check Vercel env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_STRIPE_PUBLISHABLE_KEY"
echo ""
echo "🔗 Deployment URLs:"
echo "  Frontend: Check Vercel dashboard"
echo "  Supabase: https://app.supabase.com/project/${SUPABASE_PROJECT_REF}"
