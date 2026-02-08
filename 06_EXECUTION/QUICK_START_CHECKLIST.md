# Content Distribution: Quick Start Checklist

**Goal:** Get from zero to fully automated content distribution in 6 weeks.

---

## ✅ Week 1: Foundation Setup (Feb 10-16)

### Platform Accounts (3 hours)

**Buffer Setup:**
- [ ] Sign up: buffer.com/pricing → Essentials plan ($6/channel)
- [ ] Connect 6 X (Twitter) accounts
- [ ] Connect 6 Instagram Business accounts (convert to Business in IG app first)
- [ ] Connect 6 TikTok Business accounts
- [ ] Set posting queues: X (9 AM, 1 PM, 3 PM), IG (11 AM, 7 PM), TikTok (7 PM)
- [ ] Enable "Optimal Timing Tool" in Buffer settings

**Meta Business Suite:**
- [ ] Create Facebook Pages for each Instagram account (if needed)
- [ ] Go to business.facebook.com → Add all 6 Instagram accounts
- [ ] Test: Schedule 1 Instagram Story with sticker per account
- [ ] Verify analytics access

**SocialBu:**
- [ ] Sign up: socialbu.com → Standard plan ($19/month)
- [ ] Connect all 18 social accounts
- [ ] Set up keyword monitoring: brand names, industry hashtags
- [ ] Create 3 auto-response templates (FAQ-only)
- [ ] Set limit: Max 10 auto-responses/day per account

---

### Content Storage (2 hours)

**Google Drive:**
- [ ] Create folder: "Social Media Content"
- [ ] Create subfolders: AFAQ_ESG, Petdate, SacredChain, NikahX, NoorStudio, Mawashi
- [ ] Within each: Images/, Videos/, Drafts/
- [ ] Create Templates/ folder for Canva links

**Airtable:**
- [ ] Go to airtable.com/templates → Search "Social Media Calendar"
- [ ] Duplicate template or create base from scratch
- [ ] Add columns: Post ID, Project, Platform, Content Pillar, Post Copy, Media, Post Date, Status, Performance
- [ ] Create views: This Week, By Project, By Platform, Drafts, Performance
- [ ] Bookmark for quick access

---

### Script Setup (1 hour)

- [ ] Open Terminal
- [ ] Navigate: `cd /Users/architect/.openclaw/workspace/06_EXECUTION/scripts`
- [ ] Test run: `./daily_research.sh`
- [ ] Test run: `./generate_blog_post.sh "AFAQ" "Test Topic"`
- [ ] Review outputs in `/content/` and `/research/` folders
- [ ] Verify all scripts are executable: `chmod +x *.sh`

**Week 1 Complete!** 🎉 Infrastructure ready.

---

## ✅ Week 2: Content Templates & First Batch (Feb 17-23)

### Templates Creation (4 hours)

**Twitter Thread Templates:**
- [ ] Create template for AFAQ: Regulatory update thread
- [ ] Create template for Petdate: Community story thread
- [ ] Create template for SacredChain: Islamic education thread
- [ ] Create template for NikahX: Marriage advice thread
- [ ] Create template for NoorStudio: Book reveal thread
- [ ] Create template for Mawashi: Market insight thread
- [ ] Save in: `/templates/twitter_threads/[project]_[type].txt`

**Instagram Carousel Templates (Canva):**
- [ ] AFAQ: "5-Step Compliance Checklist" (1080x1080px, 5 slides)
- [ ] Petdate: "How to Plan a Playdate" carousel
- [ ] SacredChain: "Teacher Spotlight" carousel
- [ ] NikahX: "Marriage Myths Debunked" carousel
- [ ] NoorStudio: "Character Design Process" carousel
- [ ] Mawashi: "Livestock Quality Checklist" carousel
- [ ] Save Canva links in Google Drive Templates/ folder

**TikTok Script Templates:**
- [ ] AFAQ: 60s "ESG Explained" script
- [ ] Petdate: 60s "Dog park tips" script
- [ ] SacredChain: 60s "Learning Quran online" script
- [ ] NikahX: 60s "Halal dating tips" script
- [ ] NoorStudio: 60s "Book creation process" script
- [ ] Mawashi: 60s "Choosing quality livestock" script

---

### First Content Batch (6 hours)

**Target: 70+ posts for Week 1**

- [ ] Open Airtable content calendar
- [ ] Plan content mix (see strategy doc for cadence)
- [ ] Write captions using templates
- [ ] Create visuals in Canva or source from Unsplash/Pexels
- [ ] Attach media to Airtable records
- [ ] Mark Status = "Draft"

**Content breakdown:**
- [ ] AFAQ: 5 X posts, 3 IG posts, 7 IG Stories, 2 TikToks
- [ ] Petdate: 4 X posts, 5 IG posts, 7 IG Stories, 4 TikToks
- [ ] SacredChain: 4 X posts, 4 IG posts, 3 IG Stories, 3 TikToks
- [ ] NikahX: 3 X posts, 4 IG posts, 7 IG Stories, 2 TikToks
- [ ] NoorStudio: 3 X posts, 5 IG posts, 7 IG Stories, 4 TikToks
- [ ] Mawashi: 4 X posts, 4 IG posts, 3 IG Stories, 3 TikToks

---

### Schedule in Buffer (30 min)

- [ ] Export drafted posts from Airtable
- [ ] Buffer → Select project queue → "Add to Queue"
- [ ] Bulk upload (or use CSV upload for speed)
- [ ] Review calendar view for gaps/overlaps
- [ ] Update Airtable: Status = "Scheduled"

**Week 2 Complete!** 🎉 First week of content scheduled.

---

## ✅ Week 3: Blog & Newsletter Automation (Feb 24 - Mar 1)

### Blog Setup (3 hours)

**Choose Platform:**
- [ ] Option A: Ghost (recommended) → ghost.org or self-host
- [ ] Option B: WordPress → wordpress.com or Bluehost

**Set Up:**
- [ ] Create account/install
- [ ] Configure per-project blog (subdomains or separate sites)
- [ ] Import brand assets (logo, colors, fonts)
- [ ] Create basic pages (About, Contact)
- [ ] Test publish 1 post manually

---

### Blog Automation (2 hours)

- [ ] Run: `./generate_blog_post.sh "AFAQ" "SEC Climate Disclosure"`
- [ ] Review output in `/content/blog_drafts/AFAQ/`
- [ ] Edit draft for quality and brand voice
- [ ] Add images/graphics
- [ ] Publish to blog
- [ ] Run: `./blog_to_social.sh [published_url] "AFAQ"`
- [ ] Review generated Twitter thread, IG carousel, LinkedIn post
- [ ] Upload social posts to Airtable → Schedule in Buffer

**Repeat for 2-3 blog posts per project this week.**

---

### Newsletter Setup (2 hours)

**Choose Platform:**
- [ ] Option A: Substack (free) → substack.com/signup
- [ ] Option B: Beehiiv (free up to 2,500 subs) → beehiiv.com

**Set Up:**
- [ ] Create publication per project (or unified)
- [ ] Customize design/branding
- [ ] Import email list (if you have one)
- [ ] Configure welcome email

---

### Newsletter Automation (1 hour)

- [ ] Run: `./generate_newsletter.sh "NoorStudio"`
- [ ] Review template in `/content/newsletters/NoorStudio/`
- [ ] Fill in content using prompts provided
- [ ] Convert to HTML (copy HTML prompt → paste into AI)
- [ ] Copy HTML to Substack/Beehiiv editor
- [ ] Send test to personal email
- [ ] Schedule for Friday 9 AM

**Week 3 Complete!** 🎉 Blog + newsletter workflows operational.

---

## ✅ Week 4: Video & Podcast Workflows (Mar 3-9)

### Video Script Generation (2 hours)

- [ ] Create: `/scripts/generate_video_script.sh` (see implementation plan)
- [ ] Test run: `./generate_video_script.sh "Petdate" "Dog Park Etiquette" "60"`
- [ ] Review output script
- [ ] Film test video following script
- [ ] Edit in CapCut/iMovie/DaVinci Resolve

---

### FFmpeg Setup (1 hour)

- [ ] Install: `brew install ffmpeg` (macOS)
- [ ] Verify: `ffmpeg -version`
- [ ] Create: `/scripts/create_video_clip.sh` (see implementation plan)
- [ ] Test: Extract 60s clip from longer video
- [ ] Output clip suitable for TikTok/Reels

---

### Podcast Research (2 hours)

- [ ] Create: `/scripts/podcast_research.sh` (see implementation plan)
- [ ] Run for each project
- [ ] Review generated episode outlines
- [ ] Select 2-3 topics to record

**Decide:** Will you actually do podcasts? (Optional - can skip if video-first strategy)

**Week 4 Complete!** 🎉 Multimedia content workflows ready.

---

## ✅ Week 5: Distribution Automation (Mar 10-16)

### Zapier/Make.com Setup (3 hours)

**Workflow 1: Airtable → Buffer**
- [ ] Sign up: zapier.com or make.com
- [ ] Create Zap: "New Record in View" (Airtable) → "Create Post" (Buffer)
- [ ] Map fields: Post Copy → Text, Media → Image, Project → Profile
- [ ] Test with sample Airtable record
- [ ] Turn on Zap

**Workflow 2: Buffer → Airtable**
- [ ] Trigger: "Post Published" (Buffer)
- [ ] Action: "Update Record" (Airtable) → Status = "Published"
- [ ] Test and activate

**Workflow 3: SocialBu → Alert**
- [ ] Trigger: "New Mention" with negative sentiment
- [ ] Action: "Send Email" or "Send Slack Message"
- [ ] Filter: Only negative sentiment
- [ ] Test and activate

---

### Analytics Dashboard (2 hours)

**Google Sheets:**
- [ ] Create spreadsheet: "Content Distribution Analytics"
- [ ] Sheet 1: Weekly Overview (posts, impressions, engagement, top performers)
- [ ] Sheet 2: Per-Project Performance
- [ ] Sheet 3: Platform Breakdown
- [ ] Add formulas for automatic calculations
- [ ] Set up conditional formatting (green = >6% ER, yellow = 3-6%, red = <3%)

**Optional Automation:**
- [ ] Zapier: Weekly trigger → Pull Buffer analytics → Append to Google Sheets

**Week 5 Complete!** 🎉 Full automation operational.

---

## ✅ Week 6: Testing & Launch (Mar 17-22)

### End-to-End Testing (4 hours)

- [ ] **Blog Test:** Generate → Edit → Publish → Convert to social → Schedule
- [ ] **Newsletter Test:** Generate → Edit HTML → Send test email → Schedule
- [ ] **Video Test:** Script → Film → Edit → Upload to TikTok via Buffer
- [ ] **Automation Test:** Update Airtable record → Verify Zapier triggers Buffer
- [ ] **Engagement Test:** Post test content → Comment → Verify SocialBu auto-response
- [ ] **Analytics Test:** Check Google Sheets pulls data from Buffer

**Fix any errors found!**

---

### Documentation (2 hours)

- [ ] Create: `/docs/Content_Distribution_SOP.md`
- [ ] Document: Weekly workflow (Monday content day)
- [ ] Document: Daily engagement routine (15 min × 3)
- [ ] Document: Monthly review process
- [ ] Document: Troubleshooting guide
- [ ] Review all scripts have clear comments

---

### Cron Jobs (1 hour)

- [ ] Add daily research to cron: `crontab -e`
- [ ] Add line: `0 7 * * * /path/to/daily_research.sh`
- [ ] Add Monday reminder: `0 8 * * 1 /path/to/monday_reminder.sh`
- [ ] Add Friday newsletter reminder
- [ ] Test: Verify cron jobs run correctly

---

### Pre-Launch Prep (2 hours)

**March 22 Evening:**
- [ ] Finalize Week 1 content (70+ posts) in Airtable
- [ ] Schedule all posts in Buffer for March 23-29
- [ ] Verify Zapier workflows active
- [ ] Publish first blog post per project
- [ ] Send test newsletter to personal email
- [ ] Film/upload at least 6 TikTok videos
- [ ] Set 3 calendar reminders for daily engagement (9 AM, 12 PM, 6 PM)

**Week 6 Complete!** 🎉 Ready for launch!

---

## 🚀 Launch Day: March 23, 2026

### Hourly Checklist

**8:00 AM:**
- [ ] Check Buffer: First posts published successfully?
- [ ] Monitor platforms: Posts live on X, Instagram, TikTok?
- [ ] Check SocialBu: Any mentions/comments yet?

**9:00 AM:**
- [ ] Respond to any early comments
- [ ] Like/reply to engagement on posts

**12:00 PM:**
- [ ] Check SocialBu dashboard for new mentions
- [ ] Respond to DMs across platforms

**3:00 PM:**
- [ ] Review Buffer queue: Afternoon posts scheduled?
- [ ] Engage with 5-10 posts in your niche

**6:00 PM:**
- [ ] TikTok engagement focus (highest activity time)
- [ ] Respond to all TikTok comments

**9:00 PM:**
- [ ] End-of-day summary in Airtable notes
- [ ] Review analytics: First-day performance
- [ ] Plan any quick adjustments for Day 2

---

## 📊 Post-Launch: First Week (Mar 24-30)

### Daily (15 min × 3)
- [ ] Morning: SocialBu check + urgent responses
- [ ] Midday: Comment replies on today's posts
- [ ] Evening: TikTok engagement + thank sharers

### Monitor
- [ ] Zapier task history: Any errors?
- [ ] Buffer publishing: All posts going live?
- [ ] SocialBu alerts: Negative mentions handled?
- [ ] Analytics: Which posts performing best?

### Adjust
- [ ] Posting times: Shift based on early engagement data
- [ ] Content mix: Double down on what works
- [ ] Automation: Fix any workflow issues immediately

---

## 🎉 Week 2 Review: March 30

- [ ] Open Google Sheets analytics dashboard
- [ ] Analyze first week performance:
  - Total posts published
  - Engagement rates per platform/project
  - Top 5 performing posts
  - Bottom 5 (what to avoid)
- [ ] Adjust content mix for Week 2:
  - More video if video performed well
  - Different posting times if engagement was low
  - New content angles if audience didn't respond
- [ ] Document lessons learned in SOP
- [ ] Celebrate first week complete! 🎉🍾

---

## 🎯 Success Criteria Checklist

**Infrastructure:**
- [x] All 18 social accounts connected to Buffer
- [x] SocialBu monitoring all brand mentions
- [x] Airtable content calendar operational
- [x] Google Sheets analytics dashboard live

**Automation:**
- [x] Daily research cron job running
- [x] Zapier workflows active (Airtable ↔ Buffer)
- [x] Blog-to-social conversion automated
- [x] Newsletter generation streamlined

**Content:**
- [x] 70+ posts/week publishing automatically
- [x] 2 blog posts/week per project
- [x] 1 newsletter/week per project
- [x] Video content created weekly

**Performance:**
- [ ] Engagement rate >5% (track after Week 1)
- [ ] Response time <6 hours (track daily)
- [ ] Content creation time <4 hours/week (track Monday)
- [ ] ROI >10x ($1000 time saved / $100 cost)

---

## 📈 3-Month Goals (By May 23, 2026)

- [ ] Twitter: +1000 followers total across projects
- [ ] LinkedIn: +500 connections total
- [ ] Newsletter: +100 subscribers per project
- [ ] Blog: 5000+ monthly visitors per project
- [ ] Engagement rate: Consistent 6%+
- [ ] Automation: <1 hour/week manual work

---

## 🎓 Pro Tips

1. **Start Small:** Week 1 focus on X and Instagram only. Add TikTok Week 2.
2. **Batch Everything:** Monday = content day. No piecemeal posting throughout week.
3. **Test Before Scaling:** Run scripts on 1 project first, then replicate to others.
4. **Quality > Quantity:** 50 great posts better than 100 mediocre ones.
5. **Iterate Fast:** Check analytics daily in Week 1, adjust quickly.
6. **Document Everything:** Future-you will thank present-you for good notes.
7. **Automate Wisely:** Automate distribution, keep engagement human.

---

## 🆘 Emergency Contacts

- **Buffer Support:** help.buffer.com
- **SocialBu Support:** socialbu.com/contact
- **Zapier Support:** zapier.com/app/troubleshoot

**OpenClaw Issues:** Check documentation or community forums

---

**You've got this!** 🚀 Follow this checklist, check boxes as you go, and by March 23 you'll have a fully automated content distribution machine running for 6 projects. 

**Remember:** Progress > Perfection. Launch and iterate! 🔥
