# Airtable Content Calendar Setup Guide

## Overview
Airtable serves as the central content calendar for all 6 projects. It allows collaboration, scheduling, asset storage, and integration with Buffer/SocialBu.

## Step 1: Airtable Base Creation

### Create New Base
1. Go to https://airtable.com
2. Click "+ Create"
3. Choose: **Start from scratch**
4. Name: `Content Distribution Calendar`
5. Workspace: [Your Team]
6. Click "Create"

### Alternative: Import Template
1. Airtable → Templates
2. Search: "Social Media Calendar"
3. Choose template closest to your needs
4. Click "Use Template"
5. Rename: `Content Distribution Calendar`

## Step 2: Table Structure

### Create Main Tables

#### Table 1: Master Calendar
- **Purpose**: Central posting schedule across all projects
- **Records**: One row per post (60 posts for Week 1)
- **Shared with**: All team members

#### Table 2: Project Configs
- **Purpose**: Project-specific settings
- **Records**: One row per project (AFAQ, SacredChain, etc.)
- **Shared with**: Managers only

#### Table 3: Content Assets
- **Purpose**: Store media, templates, brand guidelines
- **Records**: Images, videos, approved templates
- **Shared with**: All team members

#### Table 4: Hashtag Library
- **Purpose**: Curated hashtags by project
- **Records**: One row per hashtag set
- **Shared with**: All team members

#### Table 5: Analytics Log
- **Purpose**: Track post performance
- **Records**: One row per post + metrics
- **Shared with**: All team members

## Step 3: Master Calendar Table Structure

### Field Configuration

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Post ID | Text (auto) | Unique identifier | AFAQ-001 |
| Project | Single Select | Which project | AFAQ, SacredChain, etc. |
| Title | Text | Short post title | "New Feature Release" |
| Content | Long Text | Full post caption | "Check out our latest..." |
| Content Type | Single Select | Type of content | Blog, Tutorial, News, Story, Product |
| Platforms | Multiple Select | Where to post | Instagram, Twitter, LinkedIn, etc. |
| Scheduled Date | Date | Publication date | 2026-02-10 |
| Scheduled Time | Single Select | Time slot | 9:00 AM, 12:00 PM, 6:00 PM |
| Timezone | Single Select | Timezone | PST, EST, UTC |
| Status | Single Select | Post status | Draft, Approved, Scheduled, Published |
| Hashtags | Text | Post hashtags | #feature #launch #news |
| Mentions | Text | People/accounts to tag | @account1 @account2 |
| Media URLs | Long Text | Links to images/videos | https://example.com/img.jpg |
| Media Type | Single Select | Content format | Image, Video, Carousel, Text Only |
| Video Duration | Number | Length in seconds | 30 |
| CTA | Text | Call-to-action | "Learn more at..." |
| Link URL | URL | External link | https://example.com |
| Approval Status | Single Select | Review status | Pending, Approved, Rejected |
| Approved By | Collaborator | Who approved | [User] |
| Approved Date | Date | When approved | 2026-02-05 |
| Posted By | Collaborator | Who scheduled post | [User] |
| Published Date | Date | Actual publish date | 2026-02-10 |
| Engagement Rate | Percent | Performance metric | 4.5% |
| Reach | Number | Total impressions | 1200 |
| Engagement Count | Number | Likes + comments + shares | 54 |
| Notes | Long Text | Additional comments | "Monitor engagement closely" |

### Field Validations

```
Status: {Draft, Approved, Scheduled, Published}
Approval Status: {Pending, Approved, Rejected}
Content Type: {Blog, Tutorial, News, Story, Product, Announcement, Community}
Media Type: {Image, Video, Carousel, Text Only, Reels, Stories, TikTok}
Project: {AFAQ, SacredChain, NoorStudio, Petdate, Mawashi, NikahX}
Platforms: {Instagram, Twitter, Facebook, LinkedIn, TikTok, Pinterest, Threads}
Time Slots: {6:00 AM, 7:00 AM, 8:00 AM, 9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM, 6:00 PM, 7:00 PM, 8:00 PM, 9:00 PM, 10:00 PM}
```

## Step 4: Project Configs Table

### Project Settings

| Field Name | Type | Example |
|------------|------|---------|
| Project Name | Text | AFAQ |
| Status | Single Select | Active |
| Description | Long Text | Islamic Q&A platform |
| Website | URL | https://afaq.example.com |
| Brand Colors | Text | Primary: #FF6B6B |
| Hashtag Set | Link to Records | [Links to Hashtag Library] |
| Team Lead | Collaborator | [User] |
| Content Creator | Collaborator | [User] |
| Posting Frequency | Text | 2 posts/day |
| Best Times (PST) | Text | 9 AM, 12 PM, 6 PM |
| Posting Days | Text | Mon-Fri |
| Target Platforms | Multiple Select | Instagram, Twitter, LinkedIn |
| Audience Demographics | Long Text | Age 18-45, interested in religion |
| Approved Hashtags | Long Text | #AFAQ #IslamicKnowledge #QandA |

## Step 5: Content Assets Table

### Asset Organization

| Field Name | Type | Description |
|------------|------|-------------|
| Asset ID | Text (auto) | Unique ID |
| Project | Link to Records | Project reference |
| Asset Name | Text | "AFAQ Logo - Horizontal" |
| Asset Type | Single Select | Logo, Template, Image, Video, Banner |
| File/Link | Attachment | Upload or link |
| Approved | Checkbox | Is asset approved? |
| Usage Rights | Text | Own, CC, Licensed |
| Dimensions | Text | 1920x1080, 1:1, 9:16 |
| Format | Single Select | PNG, JPG, MP4, MOV |
| Expiration Date | Date | When asset expires |
| Notes | Long Text | Usage guidelines |

## Step 6: Hashtag Library Table

### Hashtag Organization

| Field Name | Type | Description |
|------------|------|-------------|
| Hashtag | Text | #AFAQ |
| Project | Link to Records | AFAQ |
| Category | Single Select | Brand, Topic, Trending, Industry |
| Performance | Single Select | High, Medium, Low |
| Engagement Rate | Percent | Average engagement % |
| Usage Count | Number | How many times used |
| Last Used | Date | Last posted with tag |
| Recommended Platforms | Multiple Select | Instagram, Twitter, TikTok |
| Notes | Long Text | When to use, context |

### Pre-populated Hashtags by Project

#### AFAQ
- #AFAQ (brand)
- #IslamicKnowledge (topic)
- #QandA (format)
- #IslamicTeaching (topic)
- #ReligiousFAQ (topic)

#### SacredChain
- #SacredChain (brand)
- #BlockchainFaith (topic)
- #IslamicTech (topic)
- #MuslimInnovation (topic)

#### NoorStudio
- #NoorStudio (brand)
- #DesignArt (topic)
- #IslamicArt (topic)
- #CreativeDesign (topic)

#### Petdate
- #Petdate (brand)
- #PetLovers (topic)
- #AnimalCare (topic)
- #PetsOfInstagram (topic)
- #DogMom (topic)
- #CatLady (topic)

#### Mawashi
- #Mawashi (brand)
- #MotionGraphics (topic)
- #AnimationStudio (topic)
- #VideoProduction (topic)

#### NikahX
- #NikahX (brand)
- #MuslimMatrimony (topic)
- #IslamicMarriage (topic)
- #HalalDating (topic)
- #MarriageGoals (topic)

## Step 7: Analytics Log Table

### Performance Tracking

| Field Name | Type | Purpose |
|------------|------|---------|
| Post ID | Link to Records | Link to Master Calendar |
| Project | Single Select | For filtering |
| Published Date | Date | When posted |
| Engagement Rate | Percent | (Engagement/Reach) × 100 |
| Reach | Number | Total impressions |
| Likes | Number | Like count |
| Comments | Number | Comment count |
| Shares | Number | Share/retweet count |
| Engagement Count | Number | Total interactions |
| Click Through Rate | Percent | Link clicks / reach |
| Follower Growth | Number | +/- followers from post |
| Platform | Single Select | Where posted |
| Notes | Long Text | Observations, anomalies |

## Step 8: Airtable Views Setup

### View 1: Calendar View
- **Type**: Calendar
- **Field**: Scheduled Date
- **Grouped by**: Project
- **Purpose**: Visual timeline of posts

### View 2: Approval Queue
- **Type**: Grid
- **Filter**: Status = "Pending" OR Approval Status = "Pending"
- **Purpose**: See posts awaiting approval

### View 3: Weekly Schedule
- **Type**: Grid
- **Filter**: Scheduled Date (current week)
- **Sort**: Scheduled Date, then Scheduled Time
- **Purpose**: Weekly posting overview

### View 4: By Project
- **Type**: Separate grid per project
- **Filter**: Project = [AFAQ/SacredChain/etc.]
- **Purpose**: Project-specific content planning

### View 5: Performance Dashboard
- **Type**: Gallery + Summary
- **Filter**: Status = "Published"
- **Summary**: Avg Engagement Rate, Avg Reach
- **Purpose**: Analyze top performers

### View 6: Hashtag Performance
- **Type**: Grid
- **Filter**: None (show all)
- **Sort**: Performance (High → Low)
- **Purpose**: Monitor hashtag effectiveness

## Step 9: Automations & Integrations

### Airtable Automations

#### Automation 1: Status Update
- **Trigger**: When Approval Status changes to "Approved"
- **Action**: Update Status field to "Scheduled"
- **Notify**: Post author

#### Automation 2: Weekly Digest
- **Trigger**: Every Monday at 9 AM
- **Action**: Email summary of week's posts
- **Recipients**: Team members

#### Automation 3: Performance Log
- **Trigger**: When Published Date is filled
- **Action**: Create Analytics Log record (1-2 days later)
- **Link**: To original post

#### Automation 4: Hashtag Suggestion
- **Trigger**: When Content Type is filled
- **Action**: Lookup and suggest hashtags
- **Source**: Hashtag Library table

### External Integrations

#### Buffer Integration
1. Airtable → Zapier → Buffer
2. Trigger: Approval Status = "Approved"
3. Action: Create Buffer post
4. Map fields:
   - Content → Caption
   - Scheduled Date + Time → Schedule
   - Platforms → Buffer accounts
   - Media URLs → Attachments

#### SocialBu Integration
1. Airtable → Zapier → SocialBu
2. Trigger: Status = "Scheduled"
3. Action: Create SocialBu post
4. Map similar fields

#### Slack Notification
1. Airtable → Slack
2. Trigger: Approval Status = "Rejected"
3. Message: Post rejected, reason: [Notes field]
4. Channel: #content-approval

## Step 10: Sharing & Permissions

### Team Access

| Role | Permissions | View |
|------|-------------|------|
| **Admin** (Architect) | Create/Edit/Delete all | All tables, all views |
| **Manager** (Team Lead) | Create/Edit own project | Master Calendar + Project views |
| **Creator** (Content Writer) | Create new, Edit own | Approval Queue + My Posts |
| **Viewer** (Analytics) | Read-only | Analytics Log + Performance |

### Share Base
1. Base → Share
2. Add email: [team member]
3. Set role: Restricted/Editor/Commenter/Viewer
4. Send invite

## Step 11: Data Entry Guide

### Creating a New Post (Master Calendar)

**Step 1: Basic Info**
1. Click "+ Add Record"
2. Fill Post ID (auto-generated or manual)
3. Select Project
4. Enter Title (e.g., "Launch Announcement")

**Step 2: Content**
1. Write full caption in Content field
2. Select Content Type (Tutorial, News, Story, etc.)
3. Add Hashtags (copy-paste from Hashtag Library)
4. Add Mentions (@accounts to tag)

**Step 3: Technical**
1. Select Platforms (multi-select)
2. Set Scheduled Date
3. Set Scheduled Time (choose from preset times)
4. Auto-populate Timezone (PST)

**Step 4: Media**
1. Paste Media URLs (one per line in textarea)
2. Select Media Type (Image, Video, Carousel)
3. If video: Enter Video Duration
4. Add CTA (if applicable)

**Step 5: Links**
1. Paste external link (if any)
2. Verify link works

**Step 6: Status**
1. Set Status: Draft
2. Set Approval Status: Pending
3. Add Notes (any special instructions)

**Step 7: Save & Review**
1. Click Save
2. Preview post content
3. Verify all fields correct
4. Submit to approval

### Example Post Entry (AFAQ - Week 1, Day 1)

| Field | Value |
|-------|-------|
| Post ID | AFAQ-001 |
| Project | AFAQ |
| Title | "What is the best time for Dua?" |
| Content | "Did you know? The best times for making Dua are... [full explanation]" |
| Content Type | Tutorial |
| Platforms | Instagram, Twitter, LinkedIn |
| Scheduled Date | 2026-02-10 |
| Scheduled Time | 9:00 AM |
| Timezone | PST |
| Hashtags | #AFAQ #IslamicKnowledge #QandA #DUA #IslamicTeaching |
| Media URLs | https://cdn.example.com/afaq-dua-guide.jpg |
| Media Type | Image |
| CTA | "Share your experiences in the comments!" |
| Link URL | https://afaq.example.com/dua-guide |
| Status | Draft |
| Approval Status | Pending |

## Step 12: Troubleshooting

### Records Not Syncing with Buffer
1. Verify Zapier integration is active
2. Check Zapier logs for errors
3. Re-authenticate if tokens expired
4. Manual post in Buffer as backup

### Performance Metrics Not Updating
1. Manually update Analytics Log table
2. Or wait for scheduled sync (24-48 hours)
3. Use platform dashboards (Buffer/SocialBu) as source

### Cannot Add Records
1. Check permissions (read-only?)
2. Verify base is not locked
3. Clear browser cache

## Reference: CSV Import Format

If importing posts in bulk:

```csv
Post ID,Project,Title,Content,Content Type,Platforms,Scheduled Date,Scheduled Time,Hashtags,Media URLs,Status,Approval Status
AFAQ-001,AFAQ,New Feature,Check out our latest...,Tutorial,"Instagram;Twitter;LinkedIn",2026-02-10,09:00 AM,"#AFAQ #Launch","https://example.com/img.jpg",Approved,Pending
AFAQ-002,AFAQ,Community Feature,Join our community...,Community,"Instagram;Facebook",2026-02-10,12:00 PM,"#Community #Join","https://example.com/img2.jpg",Draft,Pending
```

## Security & Best Practices

- ✅ Use Airtable's built-in permissions (don't share passwords)
- ✅ Enable 2FA on Airtable account
- ✅ Audit access logs monthly
- ✅ Backup base (Airtable auto-backups)
- ✅ Use API keys for integrations (not passwords)
- ❌ Don't share base link publicly
- ❌ Don't hardcode passwords in automations

## Maintenance Schedule

**Daily (5 min)**
- Review Approval Queue
- Check any failed posts

**Weekly (30 min - Monday)**
- Export Analytics Log
- Review engagement trends
- Update hashtag performance

**Monthly (1 hour - First Friday)**
- Audit permissions
- Clean up old/archived posts
- Update project configs if needed
- Backup critical data

## Airtable Tips & Tricks

### Formula Fields (Advanced)
```
Create auto-incrementing ID:
= "AFAQ-" & ROWNUMBER()

Calculate engagement rate:
= IF({Reach} = 0, 0, ({Engagement Count} / {Reach}) * 100)

Auto-populate timezone:
= "PST"

Status badge color:
IF({Status} = "Published", "green", IF({Status} = "Scheduled", "blue", "yellow"))
```

### Useful Views Combos
1. **Approval Queue** + **Creator Filter**: Only shows YOUR posts needing approval
2. **Calendar View** + **Project Filter**: Visual week per project
3. **Performance** + **Date Range**: Track last 7 days' posts

## Resources

- **Airtable Help**: https://support.airtable.com
- **API Docs**: https://airtable.com/api
- **Universe (Templates)**: https://airtable.com/universe
- **Community**: https://community.airtable.com

---

**Last Updated**: 2026-02-05  
**Owner**: Architect  
**Status**: Ready for Implementation
