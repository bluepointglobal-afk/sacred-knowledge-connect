# Buffer Account Setup Guide

## Overview
Buffer is a social media scheduling platform that allows you to queue posts across multiple channels and maintain a consistent posting schedule.

## Step 1: Account Creation & Initial Setup

### Create Buffer Account
1. Go to https://buffer.com
2. Sign up with email or Google account
3. Verify email address
4. Complete company profile:
   - Company name: [Your Company]
   - Industry: Social Media Management
   - Team size: [Specify]

### Set Timezone
1. Settings → Account → Timezone
2. Select: **America/Los_Angeles** (PST)
3. Save changes

## Step 2: API Key Configuration

### Generate API Token
1. Go to https://buffer.com/developers/api
2. Click "Create Token"
3. Name: `content-distribution-phase1`
4. Set scopes:
   - `posts:write` (Create posts)
   - `posts:read` (Read post data)
   - `buffers:read` (Read channel info)
   - `analytics:read` (Access analytics)
5. **Save token securely** in `.env` or secure vault:
   ```
   BUFFER_API_TOKEN=your_token_here
   ```

### Verify Token
```bash
curl -X GET "https://api.bufferapp.com/1/user.json?access_token=YOUR_TOKEN"
```

Should return user profile JSON.

## Step 3: Connect Social Channels

### Supported Platforms
- Twitter/X
- Facebook (Pages)
- LinkedIn (Company Pages)
- Instagram (Business Accounts)
- TikTok
- Pinterest
- Threads

### Connection Process (Per Channel)
1. Settings → Connected Accounts
2. Click "+ Add Account"
3. Select platform
4. Authorize Buffer access (OAuth)
5. Verify connection successful

### For Each Project (AFAQ, SacredChain, NoorStudio, Petdate, Mawashi, NikahX):
- Connect project-specific social accounts
- Label channels clearly: `[ProjectName]-Twitter`, `[ProjectName]-Instagram`, etc.
- Document credentials in secure file

## Step 4: Team Setup

### Create Team (Optional but Recommended)
1. Settings → Team & Permissions
2. Click "Invite Team Member"
3. Enter email: [team member email]
4. Set role:
   - **Manager**: Full access + analytics
   - **Member**: Post scheduling only
   - **Viewer**: Analytics/reports only

### Assign to Projects
- Architect: Full access (all projects)
- Content creators: Member (assigned projects only)

## Step 5: Posting Schedule Configuration

### Set Optimal Times Per Project

#### AFAQ
- **Best times**: 9 AM, 12 PM, 6 PM (PST)
- **Frequency**: 2 posts/day
- **Days**: Mon-Fri
- **Channels**: Twitter, LinkedIn, Instagram

#### SacredChain
- **Best times**: 10 AM, 7 PM (PST)
- **Frequency**: 1-2 posts/day
- **Days**: Daily (engagement heavy)
- **Channels**: Twitter, Instagram, TikTok

#### NoorStudio
- **Best times**: 11 AM, 5 PM (PST)
- **Frequency**: 1 post/day
- **Days**: Mon-Fri
- **Channels**: Instagram, Pinterest, LinkedIn

#### Petdate
- **Best times**: 8 AM, 12 PM, 7 PM (PST)
- **Frequency**: 2-3 posts/day
- **Days**: Daily
- **Channels**: Instagram, TikTok, Twitter

#### Mawashi
- **Best times**: 10 AM, 6 PM (PST)
- **Frequency**: 1-2 posts/day
- **Days**: Daily
- **Channels**: Twitter, Instagram, LinkedIn

#### NikahX
- **Best times**: 9 AM, 8 PM (PST)
- **Frequency**: 1 post/day
- **Days**: Daily
- **Channels**: Instagram, LinkedIn, Twitter

### Configure in Buffer
1. Settings → Posting Schedule
2. For each connected account:
   - Set "Recommended Time"
   - Enable/disable days
   - Set frequency cap (posts per day)
3. Save per-account schedule

## Step 6: Integration with Content Calendar

### Zapier/Make Integration (Optional Automation)
1. Buffer → Zapier
2. Create Zap: Airtable → Buffer
3. Trigger: New record in content calendar
4. Action: Create Buffer post
5. Map fields:
   - Content → Post text
   - Scheduled Time → Buffer scheduling
   - Media → Attached files
   - Platform tags → Target accounts

## Step 7: Daily Operations

### Morning Workflow
1. Open Buffer dashboard
2. Check queue for all channels
3. Verify posts are scheduled correctly
4. Monitor any posting failures

### Post Format in Buffer
```
[Content Text]

[Hashtags: up to 5 relevant]

[Link if applicable]

[Scheduled for: TIME on DATE]

[Platform: TWITTER/INSTAGRAM/LINKEDIN]
```

### Publishing Options
- **Schedule**: Queue for optimal time
- **Draft**: Save for later review
- **Publish**: Post immediately (use for urgent content)

## Step 8: Analytics & Reporting

### Access Analytics
1. Dashboard → Analytics
2. Date range: Last 7 days (default)
3. Metrics to track:
   - **Impressions**: Total reach
   - **Clicks**: Traffic driven
   - **Engagement Rate**: Likes/comments/shares
   - **Best Performers**: Top 3 posts

### Weekly Report
1. Every Sunday, download:
   - Posts published (count)
   - Engagement summary
   - Top content by platform
2. Export to CSV for Airtable correlation

### Monthly Review
1. Compare performance across projects
2. Identify top content types
3. Adjust posting schedule if needed
4. Document in analytics log

## Step 9: Best Practices

### Content Guidelines
- ✅ Use platform-native features (carousels, threads)
- ✅ Include CTA (Call-to-Action) when relevant
- ✅ Tag team members for visibility
- ✅ Use project-specific hashtags
- ❌ Don't duplicate exact posts across platforms
- ❌ Don't post more than 3 times in 2 hours
- ❌ Don't engage in controversial topics without approval

### Queue Management
- **Target buffer**: 2 weeks ahead minimum
- **Review schedule**: Daily (morning)
- **Refill cadence**: Tuesday/Friday
- **Hold buffer**: 3+ days for urgent posts

### Account Security
- ✅ Enable 2FA on Buffer account
- ✅ Rotate API tokens quarterly
- ✅ Use strong passwords (16+ chars)
- ✅ Monitor team member logins
- ❌ Don't share tokens in Slack/email
- ❌ Don't use personal devices for sensitive data

## Step 10: Troubleshooting

### Post Failed to Publish
1. Check platform authorization (may be expired)
2. Verify content meets platform guidelines
3. Check character limits for platform
4. Retry manually from dashboard

### API Connection Issues
```bash
# Test connection
curl -X GET "https://api.bufferapp.com/1/user.json?access_token=YOUR_TOKEN"

# If 401: Token invalid/expired - regenerate
# If 429: Rate limited - wait 15 minutes
```

### Scheduling Not Working
1. Verify timezone is correct
2. Check team member permissions
3. Ensure channel is still connected
4. Try publishing as draft first

## Reference: API Endpoints Used

```
GET  /1/user.json                    → Get profile
GET  /1/buffers.json                 → List connected accounts
POST /1/updates/create.json           → Create post
GET  /1/updates/pending.json          → View scheduled posts
POST /1/updates/{id}/share.json      → Publish draft
GET  /1/updates/{id}/interactions.json → Get engagement
```

## Security Checklist

- [ ] API token generated and stored securely
- [ ] 2FA enabled on Buffer account
- [ ] All social accounts authorized
- [ ] Team members invited with correct roles
- [ ] Posting schedule configured per project
- [ ] Integration tested (if using Zapier)
- [ ] Analytics dashboard accessible
- [ ] Backup of account credentials in vault

## Support & Resources

- **Buffer Help**: https://support.buffer.com
- **API Docs**: https://buffer.com/developers/api
- **Community**: https://community.buffer.com
- **Status Page**: https://status.buffer.com

---

**Last Updated**: 2026-02-05  
**Owner**: Architect  
**Status**: Ready for Implementation
