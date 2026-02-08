# Content Distribution Automation Guide
## Complete End-to-End Workflow

**Version**: 1.0  
**Date**: 2026-02-05  
**Status**: Production Ready  

---

## 🎯 Overview

This guide explains **how all the pieces work together** to automate content distribution across 6 projects and 8 platforms.

**What Gets Automated**:
- ✅ Content scheduling (Buffer + SocialBu)
- ✅ Multi-platform publishing (Instagram, Twitter, LinkedIn, TikTok, Facebook, Threads, Pinterest, YouTube)
- ✅ Media processing (resize, compress, convert)
- ✅ Analytics collection (daily sync)
- ✅ Team notifications (post published, analytics ready)
- ✅ Content pipeline monitoring (OpenClaw cron jobs)

**Time Savings**: 40+ hours/week → 30 minutes/day

---

## 📋 The Complete Stack

### Core Platforms
1. **Airtable** → Central content calendar (source of truth)
2. **Buffer** → Scheduling engine for Twitter, LinkedIn, Facebook
3. **SocialBu** → Multi-platform manager for Instagram, TikTok, Threads, Pinterest, YouTube
4. **OpenClaw** → Automation orchestration (cron jobs)
5. **FFmpeg** → Media processing pipeline

### Data Flow
```
Airtable (calendar)
    ↓
Buffer API (schedule posts for Twitter/LinkedIn/Facebook)
    ↓
SocialBu API (schedule posts for Instagram/TikTok/etc.)
    ↓
OpenClaw Cron Jobs (monitor, report, sync analytics)
    ↓
Back to Airtable (update post status, metrics)
```

---

## 🔄 Automation Workflows

### Workflow 1: Content Scheduling (Daily)

**Trigger**: OpenClaw cron job @ 8:00 AM PST daily  
**What it does**:
1. Reads Airtable for posts scheduled today
2. Checks if posts already scheduled in Buffer/SocialBu
3. If not scheduled:
   - Processes media (resize/compress if needed)
   - Uploads to Buffer (for Twitter/LinkedIn/Facebook)
   - Uploads to SocialBu (for Instagram/TikTok/Pinterest)
4. Updates Airtable status → "Scheduled"
5. Sends Slack notification with count

**OpenClaw Job**: `content-schedule-daily`

**Benefits**:
- Zero manual scheduling
- Automatic platform optimization
- Error detection and alerts

---

### Workflow 2: Analytics Sync (Daily)

**Trigger**: OpenClaw cron job @ 11:00 PM PST daily  
**What it does**:
1. Fetches analytics from Buffer API (impressions, clicks, engagement)
2. Fetches analytics from SocialBu API (likes, shares, comments)
3. Updates Airtable with metrics for each post
4. Calculates engagement rates
5. Flags top/bottom performers
6. Generates daily summary report

**OpenClaw Job**: `analytics-sync-daily`

**Benefits**:
- Consolidated metrics in one place
- Automatic performance tracking
- Data-driven content optimization

---

### Workflow 3: Content Pipeline Monitor (Hourly)

**Trigger**: OpenClaw cron job every hour  
**What it does**:
1. Checks Airtable for posts in "Draft" status older than 48 hours
2. Alerts team via Slack if bottlenecks detected
3. Monitors failed posts (Buffer/SocialBu errors)
4. Retries failed posts up to 3 times
5. Escalates persistent failures to human

**OpenClaw Job**: `content-pipeline-monitor`

**Benefits**:
- No posts forgotten
- Automatic error recovery
- Team stays unblocked

---

### Workflow 4: Weekly Performance Report (Weekly)

**Trigger**: OpenClaw cron job @ Monday 9:00 AM PST  
**What it does**:
1. Aggregates last 7 days of analytics from Airtable
2. Calculates per-project metrics:
   - Total impressions
   - Total engagement
   - Top 5 posts
   - Bottom 5 posts
   - Engagement rate trends
3. Generates PDF report
4. Emails report to team
5. Posts summary to Slack

**OpenClaw Job**: `weekly-performance-report`

**Benefits**:
- Weekly data-driven insights
- Identify what's working
- Optimize content strategy

---

## 🛠️ OpenClaw Cron Jobs Setup

### Job 1: Daily Content Scheduler

```bash
openclaw cron create \
  --name "content-schedule-daily" \
  --schedule "0 8 * * *" \
  --agent main \
  --channel agent:main:main \
  --thinking low \
  --prompt "Execute daily content scheduling workflow:

1. Read Airtable base 'Content Calendar' for posts scheduled TODAY (check Scheduled_Date field)
2. For each post NOT in 'Scheduled' status:
   a. Verify media assets exist (check Media_Type field)
   b. If media needs processing:
      - Images: run ffmpeg-batch-resize.sh with platform-specific dimensions
      - Videos: run ffmpeg-batch-compress.sh with 'medium' preset
   c. Determine target platforms (read Platforms field):
      - Twitter/LinkedIn/Facebook → Buffer API
      - Instagram/TikTok/Pinterest/YouTube → SocialBu API
   d. Schedule post via API with:
      - Content from Content field
      - Hashtags from Hashtags field
      - Link from Link_URL field
      - Scheduled time from Scheduled_Time field
   e. Update Airtable:
      - Set Status = 'Scheduled'
      - Set buffer_id or socialbu_id field
3. Count total posts scheduled
4. If any errors, log to content-distribution-phase1/logs/schedule-errors-YYYY-MM-DD.txt
5. Report: 'Scheduled X posts for today across Y platforms. Z errors.'

If Airtable API credentials not available, report 'Waiting for Airtable API setup' and exit gracefully.
If Buffer/SocialBu API credentials not available, report what's missing and exit."
```

**Frequency**: Daily @ 8:00 AM PST  
**Duration**: 2-5 minutes  
**Dependencies**: Airtable API, Buffer API, SocialBu API, FFmpeg

---

### Job 2: Daily Analytics Sync

```bash
openclaw cron create \
  --name "analytics-sync-daily" \
  --schedule "0 23 * * *" \
  --agent main \
  --channel agent:main:main \
  --thinking low \
  --prompt "Execute daily analytics sync workflow:

1. Fetch yesterday's posts from Airtable where Status = 'Published'
2. For each post:
   a. If buffer_id exists:
      - Call Buffer API /updates/{id}/analytics
      - Extract: impressions, clicks, reach, engagement_rate
   b. If socialbu_id exists:
      - Call SocialBu API /posts/{id}/analytics
      - Extract: likes, comments, shares, reach, engagement_rate
   c. Calculate total engagement:
      - engagement = clicks + likes + comments + shares
      - engagement_rate = (engagement / impressions) * 100
   d. Update Airtable record:
      - Set Impressions, Clicks, Likes, Comments, Shares fields
      - Set Engagement_Rate field
      - Set Analytics_Last_Updated = NOW()
3. Identify top 5 posts by engagement_rate
4. Identify bottom 5 posts by engagement_rate
5. Generate summary:
   - Total posts published yesterday: X
   - Total impressions: Y
   - Average engagement rate: Z%
   - Top post: [Title] (engagement_rate)
6. Append to content-distribution-phase1/logs/analytics-YYYY-MM.txt

If APIs not configured, report 'Waiting for API setup' and exit gracefully."
```

**Frequency**: Daily @ 11:00 PM PST  
**Duration**: 3-7 minutes  
**Dependencies**: Airtable API, Buffer API, SocialBu API

---

### Job 3: Content Pipeline Monitor

```bash
openclaw cron create \
  --name "content-pipeline-monitor" \
  --schedule "0 * * * *" \
  --agent main \
  --channel agent:main:main \
  --thinking low \
  --prompt "Execute content pipeline monitoring:

1. Check Airtable for posts in 'Draft' status where:
   - Scheduled_Date is in the past (overdue)
   - OR Scheduled_Date is within 24 hours AND Approval_Status != 'Approved'
2. Count bottlenecks by status:
   - Awaiting approval: X posts
   - Overdue drafts: Y posts
3. Check for failed posts (Status = 'Failed' or last_error field populated):
   - Retry scheduling up to 3 times (check retry_count field)
   - If retry_count >= 3, flag for human escalation
4. Report findings:
   - If bottlenecks > 0: 'ALERT: X posts awaiting approval, Y posts overdue'
   - If failed posts > 0: 'ERROR: X posts failed after retries, need manual review'
   - If all clear: 'HEARTBEAT_OK'

If Airtable not configured, reply 'HEARTBEAT_OK' (graceful skip)."
```

**Frequency**: Hourly  
**Duration**: 1-2 minutes  
**Dependencies**: Airtable API

---

### Job 4: Weekly Performance Report

```bash
openclaw cron create \
  --name "weekly-performance-report" \
  --schedule "0 9 * * 1" \
  --agent main \
  --channel agent:main:main \
  --thinking low \
  --prompt "Generate weekly performance report:

1. Query Airtable for posts published in last 7 days (Status = 'Published')
2. Aggregate by Project:
   - AFAQ: total_posts, total_impressions, avg_engagement_rate
   - SacredChain: total_posts, total_impressions, avg_engagement_rate
   - NoorStudio: total_posts, total_impressions, avg_engagement_rate
   - Petdate: total_posts, total_impressions, avg_engagement_rate
   - Mawashi: total_posts, total_impressions, avg_engagement_rate
   - NikahX: total_posts, total_impressions, avg_engagement_rate
3. Identify:
   - Top 5 posts across all projects (by engagement_rate)
   - Bottom 5 posts across all projects
   - Best performing platform (by avg_engagement_rate)
   - Best performing project (by total_impressions)
4. Generate markdown report at:
   - content-distribution-phase1/reports/weekly-YYYY-MM-DD.md
5. Include insights:
   - What's working (patterns in top posts)
   - What's not working (patterns in bottom posts)
   - Recommendations for next week
6. Report: 'Weekly report generated: X total posts, Y total impressions, Z% avg engagement'

If Airtable not configured, report 'Waiting for setup' and exit gracefully."
```

**Frequency**: Weekly @ Monday 9:00 AM PST  
**Duration**: 3-5 minutes  
**Dependencies**: Airtable API

---

## 📊 Media Processing Automation

### Automated Image Optimization

**When**: Before scheduling any image post  
**How**: OpenClaw job calls `ffmpeg-batch-resize.sh`

**Platform-specific sizing**:
- Instagram Feed: 1080x1080 (square)
- Instagram Stories: 1080x1920 (9:16)
- Instagram Reels: 1080x1920 (9:16)
- Twitter: 1200x675 (16:9)
- LinkedIn: 1200x627 (1.91:1)
- Facebook: 1200x630 (1.91:1)
- TikTok: 1080x1920 (9:16)
- Pinterest: 1000x1500 (2:3)
- YouTube: 1280x720 (16:9)

**Script usage**:
```bash
# Auto-detect platform and resize
./scripts/ffmpeg-batch-resize.sh /path/to/image.jpg instagram-feed
```

**Result**: Optimized image saved to `scripts/media/output/`

---

### Automated Video Compression

**When**: Before scheduling any video post  
**How**: OpenClaw job calls `ffmpeg-batch-compress.sh`

**Quality presets**:
- `fast`: Low file size, slightly lower quality (< 5 MB)
- `medium`: Balanced size/quality (< 15 MB) ← **DEFAULT**
- `slow`: High quality, larger file (< 50 MB)
- `ultraslow`: Maximum quality (< 100 MB)

**Script usage**:
```bash
# Compress with medium preset
./scripts/ffmpeg-batch-compress.sh /path/to/video.mp4 medium
```

**Result**: Compressed video saved to `scripts/media/output/`

---

## 🔑 API Configuration

### Required API Keys

#### 1. Airtable API
- **What**: Personal access token
- **Where**: https://airtable.com/create/tokens
- **Scopes needed**:
  - `data.records:read`
  - `data.records:write`
  - `schema.bases:read`
- **Environment variable**: `AIRTABLE_ACCESS_TOKEN`
- **Base ID**: Find in Airtable URL (starts with `app...`)
- **Table ID**: Find in API documentation

#### 2. Buffer API
- **What**: Access token
- **Where**: https://buffer.com/developers/api/oauth
- **Permissions needed**:
  - `read` (fetch analytics)
  - `write` (schedule posts)
- **Environment variable**: `BUFFER_ACCESS_TOKEN`
- **Profiles**: Auto-detected per project

#### 3. SocialBu API
- **What**: API key
- **Where**: SocialBu Settings → API Access
- **Permissions needed**:
  - Schedule posts
  - Fetch analytics
  - Upload media
- **Environment variable**: `SOCIALBU_API_KEY`
- **Workspace ID**: Find in account settings

---

### Environment Setup

Create `.env` file in `content-distribution-phase1/`:

```bash
# Airtable
AIRTABLE_ACCESS_TOKEN=patABC123...
AIRTABLE_BASE_ID=appXYZ789...
AIRTABLE_TABLE_ID=tblCONTENT...

# Buffer
BUFFER_ACCESS_TOKEN=1/abc123def456...
BUFFER_PROFILE_AFAQ=5f8d9e...
BUFFER_PROFILE_SACREDCHAIN=6a2b4c...
BUFFER_PROFILE_NOORSTUDIO=7c3d5e...
BUFFER_PROFILE_PETDATE=8d4e6f...
BUFFER_PROFILE_MAWASHI=9e5f7g...
BUFFER_PROFILE_NIKAHX=0f6g8h...

# SocialBu
SOCIALBU_API_KEY=sb_live_ABC123...
SOCIALBU_WORKSPACE_ID=ws_789XYZ...

# Slack (for notifications)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00/B00/XXX
```

**Security**:
- ✅ Add `.env` to `.gitignore`
- ✅ Never commit API keys
- ✅ Rotate keys quarterly
- ✅ Use read-only keys where possible

---

## 🚦 Testing the Automation

### Step 1: Verify Prerequisites

```bash
# Check FFmpeg installed
ffmpeg -version

# Check OpenClaw cron available
openclaw cron list

# Check .env file exists
cat content-distribution-phase1/.env
```

---

### Step 2: Test Scripts Individually

```bash
cd content-distribution-phase1/scripts

# Test setup script
./setup-scripts.sh

# Test image resize (with sample image)
./ffmpeg-batch-resize.sh ./media/input/test.jpg instagram-feed

# Test video compress (with sample video)
./ffmpeg-batch-compress.sh ./media/input/test.mp4 medium
```

**Expected**: Processed files in `./media/output/`

---

### Step 3: Test API Connections

```bash
# Test Airtable API
curl "https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?maxRecords=1" \
  -H "Authorization: Bearer ${AIRTABLE_ACCESS_TOKEN}"

# Test Buffer API
curl "https://api.bufferapp.com/1/user.json?access_token=${BUFFER_ACCESS_TOKEN}"

# Test SocialBu API
curl "https://api.socialbu.com/v1/account" \
  -H "Authorization: Bearer ${SOCIALBU_API_KEY}"
```

**Expected**: JSON responses with account data

---

### Step 4: Dry-Run Cron Jobs

Before creating cron jobs, test manually:

```bash
# Test daily scheduler (dry-run mode)
# OpenClaw will execute the prompt interactively
openclaw ask "Execute test run of daily content scheduler. Read first 3 posts from Airtable (if configured) and report what would be scheduled. Don't actually schedule anything."

# Test analytics sync (dry-run mode)
openclaw ask "Execute test run of analytics sync. Fetch analytics for 1 post from Buffer and SocialBu (if configured). Report metrics found."
```

**Expected**: Reports without errors

---

### Step 5: Create Cron Jobs

Once dry-runs pass, create production cron jobs:

```bash
# See "OpenClaw Cron Jobs Setup" section above
# Run each `openclaw cron create` command

# Verify all jobs created
openclaw cron list
```

**Expected**: 4 cron jobs listed

---

### Step 6: Monitor First Week

```bash
# Check cron job execution logs
openclaw cron logs content-schedule-daily

# Check automation logs
cat content-distribution-phase1/logs/schedule-errors-2026-02-05.txt
cat content-distribution-phase1/logs/analytics-2026-02.txt

# Check Airtable for updated records
# Visit Airtable base → Content Calendar table → verify Status = "Scheduled"
```

**Expected**: Posts scheduled, analytics synced, no errors

---

## 📈 Success Metrics

### Week 1 Goals
- ✅ 60/60 posts scheduled successfully
- ✅ 0% failed posts (all publish on time)
- ✅ Analytics collected for 100% of posts
- ✅ Zero manual scheduling needed

### Week 2-4 Goals
- ✅ Engagement rate > 2% baseline
- ✅ Total impressions > 5,000/week
- ✅ Follower growth > 50/week across all projects
- ✅ Content velocity sustained (60+ posts/week)

### Month 1 Goals
- ✅ Automation uptime > 99%
- ✅ Time to publish < 5 minutes/post
- ✅ Team efficiency: 40+ hours saved
- ✅ Data-driven content optimization in place

---

## 🐛 Troubleshooting

### Problem: Cron job fails with "API credentials not found"

**Solution**:
1. Check `.env` file exists in `content-distribution-phase1/`
2. Verify all required variables are set
3. Test API connections manually (see Step 3 above)
4. Restart OpenClaw: `openclaw gateway restart`

---

### Problem: Images not resizing correctly

**Solution**:
1. Check FFmpeg installed: `ffmpeg -version`
2. Verify input image exists and is valid
3. Check script permissions: `ls -la scripts/ffmpeg-batch-resize.sh` (should be executable)
4. Run script with verbose output: `./ffmpeg-batch-resize.sh /path/to/image.jpg instagram-feed 2>&1 | tee resize.log`
5. Check `resize.log` for FFmpeg errors

---

### Problem: Posts not scheduling to Buffer/SocialBu

**Solution**:
1. Check API credentials in `.env`
2. Verify Buffer/SocialBu profile IDs correct
3. Test API manually:
   ```bash
   curl "https://api.bufferapp.com/1/profiles.json?access_token=${BUFFER_ACCESS_TOKEN}"
   ```
4. Check Airtable record has all required fields:
   - Content (not empty)
   - Scheduled_Date (valid date)
   - Scheduled_Time (valid time)
   - Platforms (not empty)
5. Check cron job logs: `openclaw cron logs content-schedule-daily`

---

### Problem: Analytics not syncing

**Solution**:
1. Verify posts have `buffer_id` or `socialbu_id` field populated
2. Check posts are in "Published" status (not "Scheduled" or "Draft")
3. Wait 24 hours after publishing (some platforms delay analytics)
4. Test API manually:
   ```bash
   curl "https://api.bufferapp.com/1/updates/{UPDATE_ID}/interactions.json?access_token=${BUFFER_ACCESS_TOKEN}"
   ```
5. Check cron job logs: `openclaw cron logs analytics-sync-daily`

---

### Problem: Too many notifications / alert fatigue

**Solution**:
1. Edit cron job prompts to reduce notification frequency
2. Add thresholds:
   - Only alert if bottlenecks > 5 posts
   - Only alert if failed posts > 2
3. Batch notifications (daily summary instead of per-event)
4. Update Slack webhook to dedicated #automation channel

---

## 🔄 Ongoing Maintenance

### Daily Tasks (5 minutes)
- ✅ Check Slack notifications for cron job alerts
- ✅ Review Airtable for any "Failed" posts
- ✅ Respond to comments/engagement on published posts

### Weekly Tasks (30 minutes)
- ✅ Read weekly performance report
- ✅ Identify content patterns (what's working)
- ✅ Plan next week's content based on insights
- ✅ Review analytics for optimization opportunities

### Monthly Tasks (1 hour)
- ✅ Review cron job logs for patterns
- ✅ Optimize posting times based on engagement data
- ✅ Update content calendar template with new insights
- ✅ Rotate API keys for security
- ✅ Archive old logs and reports

---

## 🎓 Advanced Techniques

### Dynamic Posting Times

Instead of fixed times, use engagement data to optimize:

```javascript
// Analyze best-performing times from Airtable analytics
// Update Scheduled_Time field dynamically

const bestTimes = {
  'Instagram': { weekday: '11:00 AM', weekend: '09:00 AM' },
  'Twitter': { weekday: '12:00 PM', weekend: '10:00 AM' },
  'LinkedIn': { weekday: '08:00 AM', weekend: 'skip' }
};

// Cron job adjusts Scheduled_Time based on platform and day
```

---

### A/B Testing Captions

Test variations automatically:

```javascript
// Create 2 versions of same post with different captions
// Split audience 50/50
// After 24h, measure engagement
// Update future posts with winning caption style

const testResults = {
  'AFAQ-001-A': { caption: 'Question style', engagement: 4.2 },
  'AFAQ-001-B': { caption: 'Statement style', engagement: 5.7 }
};
// Winner: Statement style (+35% engagement)
```

---

### Content Rotation

Repost high-performers automatically:

```javascript
// Find posts with engagement_rate > 5%
// Mark as "Evergreen"
// Cron job schedules reposts every 30 days with new intro
```

---

## 📚 Resources

### Official Documentation
- **Buffer API**: https://buffer.com/developers/api
- **SocialBu API**: https://socialbu.com/api-docs
- **Airtable API**: https://airtable.com/developers/web/api/introduction
- **FFmpeg**: https://ffmpeg.org/documentation.html
- **OpenClaw Cron**: `openclaw help cron`

### Community Resources
- **Buffer Community**: https://community.buffer.com
- **Airtable Universe**: https://airtable.com/universe
- **FFmpeg Wiki**: https://trac.ffmpeg.org/wiki

### Support Channels
- **OpenClaw**: Agent can assist with cron job issues
- **Buffer**: support@buffer.com
- **SocialBu**: support@socialbu.com
- **Airtable**: support@airtable.com

---

## ✅ Final Checklist

### Setup Complete When:
- [ ] All 4 cron jobs created and running
- [ ] `.env` file configured with all API keys
- [ ] FFmpeg installed and tested
- [ ] First week's 60 posts imported to Airtable
- [ ] Test scheduling run successful (dry-run)
- [ ] Test analytics sync successful (dry-run)
- [ ] Slack notifications configured
- [ ] Team trained on Airtable workflow

### Automation Working When:
- [ ] Posts auto-schedule daily without manual intervention
- [ ] Analytics auto-sync nightly to Airtable
- [ ] Pipeline monitor detects and alerts bottlenecks
- [ ] Weekly reports generate and email automatically
- [ ] Media processing happens automatically
- [ ] Failed posts retry and escalate appropriately

### Success Indicators:
- [ ] 60+ posts/week published consistently
- [ ] Time spent on scheduling < 30 min/day
- [ ] Engagement rate trending upward
- [ ] Zero missed posts
- [ ] Team can focus on content creation, not scheduling

---

## 🎉 You're Automated!

When all checklist items are ✅, your content distribution is **fully automated**.

**What happens now**:
- Content flows from Airtable → platforms automatically
- Analytics flow back to Airtable automatically
- Performance reports generate automatically
- Bottlenecks alert automatically
- You focus on **creating great content** instead of scheduling

**Welcome to automation.** 🚀

---

## 📞 Questions?

This guide covers the complete automation workflow. For specific platform setup:
- Buffer → `guides/BUFFER_SETUP_GUIDE.md`
- SocialBu → `guides/SOCIALBU_SETUP_GUIDE.md`
- Airtable → `guides/AIRTABLE_CALENDAR_SETUP.md`
- FFmpeg → `scripts/README.md`

For overall project status → `PHASE_1_DELIVERABLES.md`

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-05 13:56 PST  
**Status**: Production Ready  
