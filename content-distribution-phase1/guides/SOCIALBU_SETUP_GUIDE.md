# SocialBu Setup Guide

## Overview
SocialBu is a multi-platform social media management tool that provides unified dashboard for posting, scheduling, and analytics across multiple networks simultaneously.

## Step 1: Account Creation

### Create SocialBu Account
1. Go to https://socialbu.com
2. Sign up with email (recommended for team setup)
3. Choose plan:
   - **Starter**: 1 account (testing)
   - **Pro**: 5 accounts (recommended for 2-3 projects)
   - **Team**: Unlimited (recommended for all 6 projects)
4. Complete onboarding

### Company Profile
1. Settings → Business Profile
2. Enter:
   - Company Name: [Your Company]
   - Website: [Your URL]
   - Industry: Social Media/Content Distribution
   - Logo: [Upload]
3. Save profile

## Step 2: Platform Connection

### Supported Platforms in SocialBu
- Instagram (Feed + Reels + Stories)
- Facebook (Pages + Groups)
- TikTok
- Twitter/X
- LinkedIn (Company Pages + Personal)
- Pinterest
- YouTube Shorts
- Threads

### Connection Process

#### Step 2A: Connect Instagram
1. Social Accounts → Add Account
2. Select "Instagram"
3. Choose: **Instagram Business Account**
4. Click "Connect with Instagram"
5. Authorize SocialBu app
6. Verify: Account appears in dashboard
7. **Label**: `[ProjectName]-Instagram`

#### Step 2B: Connect Facebook
1. Add Account → Facebook Page
2. Authorize access
3. Select page(s) to manage
4. **Verify**: Can post to page
5. **Label**: `[ProjectName]-Facebook`

#### Step 2C: Connect TikTok
1. Add Account → TikTok
2. Select: **Business Account**
3. Authorize app access
4. Grant posting permissions
5. **Label**: `[ProjectName]-TikTok`

#### Step 2D: Connect Twitter/X
1. Add Account → Twitter
2. Authorize with Twitter Developer API
3. Ensure API credentials configured:
   - API Key: [from Twitter Dev Console]
   - API Secret: [from Twitter Dev Console]
   - Access Token: [from Twitter Dev Console]
   - Access Secret: [from Twitter Dev Console]
4. **Label**: `[ProjectName]-Twitter`

#### Step 2E: Connect LinkedIn
1. Add Account → LinkedIn
2. Select: **Company Page**
3. Authorize LinkedIn app
4. Grant posting + analytics permissions
5. **Label**: `[ProjectName]-LinkedIn`

#### Step 2F: Connect Pinterest
1. Add Account → Pinterest
2. Authorize app
3. Select business account
4. Grant board access
5. **Label**: `[ProjectName]-Pinterest`

### Project Connection Matrix

| Project | Instagram | Facebook | TikTok | Twitter | LinkedIn | Pinterest |
|---------|-----------|----------|--------|---------|----------|-----------|
| AFAQ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| SacredChain | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| NoorStudio | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Petdate | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Mawashi | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| NikahX | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |

## Step 3: Workspace & Team Setup

### Create Project Workspaces
1. Settings → Workspaces
2. Click "New Workspace"
3. Enter name: `[ProjectName]-Workspace`
4. Add team members:
   - Architect: Admin role (all workspaces)
   - Content creator for project: Manager
   - Approvers: Viewer role

### Permissions Structure
- **Admin**: Create/delete/edit posts, manage team, analytics
- **Manager**: Schedule posts, view analytics
- **Viewer**: View analytics only, no posting

## Step 4: Content Calendar Integration

### Enable Content Calendar
1. Settings → Integrations
2. Activate: **Airtable Integration**
3. Connect Airtable account (OAuth)
4. Select base: `[Content-Distribution-Calendar]`
5. Select table: `[Project-Calendar]`
6. Map fields:
   - **Airtable Post Text** → SocialBu Caption
   - **Airtable Scheduled Date** → Post Schedule
   - **Airtable Media** → Attachment
   - **Airtable Platform Tags** → Targeted Accounts
   - **Airtable Hashtags** → Hashtag field
7. Enable: **Auto-publish from Airtable**

## Step 5: Posting & Scheduling

### Create Post in SocialBu
1. Dashboard → "+ New Post"
2. Select accounts to post to
3. Enter post content
4. Add media (images/videos)
5. Add hashtags (use SocialBu suggestions)
6. Choose scheduling:
   - **Now**: Publish immediately
   - **Schedule**: Pick date/time
   - **Best Time**: Use SocialBu AI recommendation
7. Review cross-platform preview
8. Click "Schedule" or "Publish"

### Best Time AI Feature
- SocialBu analyzes engagement per platform
- Recommends optimal posting times per account
- Considers timezone, audience demographics
- Click "Best Time" to auto-select

### Platform-Specific Optimization

#### Instagram
- **Carousel posts**: 3-5 images (SocialBu auto-sizes)
- **Captions**: 150-300 characters (optimal)
- **Hashtags**: 20-30 (place in first comment)
- **Reels**: 15-90 seconds, vertical video
- **Stories**: 5-10 seconds per slide

#### TikTok
- **Video**: 9:16 aspect ratio, 15 sec - 10 min
- **Hashtags**: 3-5 trending, 2-3 niche
- **Captions**: Short, punchy, engaging
- **Music**: Use SocialBu music library
- **Text overlays**: Readable, 20pt+ font

#### Twitter
- **Text only**: 280 characters max
- **Threading**: SocialBu auto-threads long content
- **Media**: 1-4 images per tweet
- **Hashtags**: 2-3 max, place at end
- **Links**: Twitter link shortener (t.co)

#### LinkedIn
- **Captions**: 1,000-1,500 characters (optimal)
- **Hashtags**: 3-5, relevant to audience
- **Media**: Professional images/documents
- **Articles**: Link to external content
- **Engagement**: Ask questions to boost reach

#### Facebook
- **Posts**: 40-80 characters (title), 300-500 body
- **Images**: 1,200x628px (optimal)
- **Video**: MP4, max 2GB, 120min length
- **Hashtags**: 5-10, relevant
- **CTA Buttons**: Use native FB CTAs

#### Pinterest
- **Pins**: Vertical (1000x1500px), 2:3 ratio
- **Descriptions**: 300 characters + keywords
- **Boards**: Organize by topic
- **Rich Pins**: Product/recipe/article type
- **Hashtags**: 5-10, searchable

## Step 6: Analytics & Reporting

### Access Analytics Dashboard
1. Analytics → Select date range
2. View by:
   - All accounts (overview)
   - Individual account (platform-specific)
   - By post (performance per content)

### Key Metrics to Track

#### Engagement Metrics
- **Reach**: Total people who saw post
- **Impressions**: Total post views
- **Engagement Rate**: (Likes+Comments+Shares) / Reach
- **Clicks**: Link clicks from post
- **Shares**: Reposts/retweets

#### Growth Metrics
- **Follower Growth**: Net new followers/day
- **Lost Followers**: Unfollow rate
- **Follower Growth %**: Percentage increase
- **Engagement Growth**: Week-over-week change

#### Content Performance
- **Top Posts**: By engagement rate
- **Best Platform**: Highest engagement platform
- **Best Time**: Time-of-day analysis
- **Content Type**: Performance by content type

### Generate Reports
1. Analytics → Reports
2. Select metric(s)
3. Choose period: Weekly, Monthly
4. Add to recurring report (auto-email)
5. Export as PDF/CSV

### Weekly Export
1. Every Sunday, generate report for:
   - All 6 projects
   - All platforms
   - Engagement summary
   - Top 3 posts per project
2. Save to: `content-distribution-phase1/reports/weekly/[YYYY-WW].csv`

## Step 7: Hashtag Management

### SocialBu Hashtag Tool
1. Tools → Hashtag Generator
2. Enter keyword/topic
3. Select platform
4. View suggestions with:
   - Hashtag popularity
   - Post volume
   - Engagement rate
5. Save to favorites

### Hashtag Library
1. Tools → Hashtag Library
2. Create tags per project:
   - `afaq-core`, `afaq-tips`, `afaq-community`
   - `sacredchain-news`, `sacredchain-events`, `sacredchain-stories`
   - etc.
3. Use in posts for consistency
4. Track performance per tag

## Step 8: Content Approval Workflow

### Enable Approval Flow
1. Settings → Workflow
2. Enable: **Content Approval**
3. Set roles:
   - Creator: Author of post
   - Approver: Reviews before publishing
   - Scheduler: Handles timing

### Approval Process
1. Creator schedules post → Goes to "Pending Approval"
2. Approver reviews in SocialBu dashboard
3. Approver clicks "Approve" or "Request Changes"
4. If approved: Auto-publish at scheduled time
5. If rejected: Returns to creator with feedback

## Step 9: Bulk Scheduling

### Upload CSV for Bulk Posts
1. Tools → Bulk Upload
2. Download CSV template
3. Fill in columns:
   - Caption (post text)
   - Accounts (comma-separated)
   - Scheduled_Date (YYYY-MM-DD)
   - Scheduled_Time (HH:MM, 24hr)
   - Media_URLs (pipe-separated)
   - Hashtags (comma-separated)
4. Upload CSV
5. Preview all posts
6. Click "Schedule All"

### CSV Format Example
```csv
caption,accounts,scheduled_date,scheduled_time,media_urls,hashtags
"Check out our new feature!",instagram;twitter,2026-02-10,09:00,"https://example.com/img1.jpg|https://example.com/img2.jpg","#feature #news #launch"
```

## Step 10: Integration with Automation

### Webhook Setup (For Custom Automations)
1. Settings → Integrations → Webhooks
2. Create endpoint:
   - Event: `post.published`
   - URL: `[Your automation server]`
   - Auth: `Bearer [Token]`
3. Test webhook
4. Your server receives:
   ```json
   {
     "event": "post.published",
     "post_id": "12345",
     "accounts": ["instagram", "twitter"],
     "timestamp": "2026-02-05T09:00:00Z",
     "engagement": { "likes": 45, "comments": 8 }
   }
   ```

## Step 11: Troubleshooting

### Post Failed to Publish
1. Check account authorization (may be revoked)
2. Verify content meets platform guidelines:
   - No external links (for some platforms)
   - No prohibited hashtags
   - Compliant media (size, format)
3. Check account-specific limits:
   - Instagram: Max 3 posts/hour
   - Twitter: No rate limit with API
   - TikTok: Max 10 posts/day
4. Retry or contact SocialBu support

### Platform Connection Lost
1. Settings → Social Accounts
2. Find account with ⚠️ icon
3. Click "Reconnect"
4. Re-authorize with platform
5. Verify posting works

### Analytics Not Updating
1. Allow 2-3 hours for data sync
2. Try manual refresh (⟲ icon)
3. Check internet connection
4. Clear browser cache if web-based

## Reference: SocialBu API

### Available Endpoints (for custom automation)
```
POST /api/v1/posts/create           → Create post
GET  /api/v1/posts/scheduled        → List scheduled posts
GET  /api/v1/analytics/summary      → Get analytics
GET  /api/v1/accounts               → List connected accounts
```

## Security Checklist

- [ ] All platform accounts connected
- [ ] Team members with correct roles assigned
- [ ] 2FA enabled on SocialBu account
- [ ] API keys stored securely (if using API)
- [ ] Content approval workflow enabled
- [ ] Webhooks configured (if using automations)
- [ ] Analytics dashboard accessible
- [ ] Posting test successful on all platforms

## Daily Operations Checklist

- [ ] Review scheduled posts (any issues?)
- [ ] Check new notifications (replies/comments)
- [ ] Verify best-time recommendations
- [ ] Monitor engagement metrics
- [ ] Approve any pending content
- [ ] Update content calendar in Airtable

## Resources

- **SocialBu Help**: https://help.socialbu.com
- **Platform Guidelines**: 
  - Instagram: https://help.instagram.com
  - TikTok: https://support.tiktok.com
  - Twitter: https://help.twitter.com
- **Community**: https://community.socialbu.com

---

**Last Updated**: 2026-02-05  
**Owner**: Architect  
**Status**: Ready for Implementation
