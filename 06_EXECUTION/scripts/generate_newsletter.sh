#!/bin/bash

# Weekly Newsletter Generator
# Usage: ./generate_newsletter.sh [project]

PROJECT=$1
DATE=$(date +%Y-%m-%d)
OUTPUT="/Users/architect/.openclaw/workspace/06_EXECUTION/content/newsletters"

if [ -z "$PROJECT" ]; then
    echo "Usage: ./generate_newsletter.sh [project]"
    echo "Projects: AFAQ, Petdate, SacredChain, NikahX, NoorStudio, Mawashi"
    exit 1
fi

mkdir -p "$OUTPUT/$PROJECT"

echo "📧 Generating newsletter for $PROJECT..."
echo ""

# Step 1: Aggregate recent content
echo "📊 Step 1/3: Aggregating recent content..."

BLOG_DIR="/Users/architect/.openclaw/workspace/06_EXECUTION/content/blog_drafts/$PROJECT"
RESEARCH_DIR="/Users/architect/.openclaw/workspace/06_EXECUTION/research/daily"

# Get last 3 blog posts
if [ -d "$BLOG_DIR" ]; then
    RECENT_BLOGS=$(ls -t "$BLOG_DIR"/*.md 2>/dev/null | head -3)
    BLOG_COUNT=$(echo "$RECENT_BLOGS" | grep -c '^' || echo 0)
    echo "  → Found $BLOG_COUNT recent blog posts"
else
    RECENT_BLOGS=""
    BLOG_COUNT=0
    echo "  → No blog posts found (directory doesn't exist)"
fi

# Get last 7 days of research
RECENT_RESEARCH=$(ls -t "$RESEARCH_DIR"/*.md 2>/dev/null | head -7 | xargs cat)
echo "  → Aggregated past 7 days of research"
echo ""

# Step 2: Generate newsletter structure
echo "📝 Step 2/3: Creating newsletter structure..."

cat > "$OUTPUT/$PROJECT/${DATE}_newsletter.md" << EOF
# ${PROJECT} Newsletter
**Week of:** $DATE
**Status:** Draft - Needs Content Generation

---

## Newsletter Structure

### 1. Welcome Message (50-75 words)
[Friendly greeting that sets the tone for this week's newsletter]

Example:
"Happy Friday! 🌟 This week in [industry], we've seen [notable trend]. Whether you're [audience action 1] or [audience action 2], we've curated the best insights just for you. Let's dive in!"

---

### 2. This Week's Highlights (150-200 words)

#### Blog Post #1: [Title]
[2-3 sentence summary with key takeaway]
→ [Read more: link]

#### Blog Post #2: [Title]
[2-3 sentence summary with key takeaway]
→ [Read more: link]

#### Blog Post #3: [Title]
[2-3 sentence summary with key takeaway]
→ [Read more: link]

---

### 3. Industry News Roundup (100-150 words)

**🔥 What's Hot:**
- [Trending topic 1]: [Brief description + why it matters]
- [Trending topic 2]: [Brief description + why it matters]
- [Trending topic 3]: [Brief description + why it matters]

---

### 4. Featured Resource/Tool (75-100 words)

**[Resource Name]**
[Description of tool/resource and how it helps audience]

Why we love it: [Specific benefit]
Try it: [Link]

---

### 5. Community Spotlight (50-75 words)

This week we're celebrating [customer name/story/achievement]!

[Brief story that showcases community/product value]

Want to be featured? [Reply to this email / Tag us on social / Submit story]

---

### 6. Product/Service Promotion (50-100 words)

[Soft pitch for product/feature/offer]

**Special Offer (Optional):**
[Discount code / Free trial / Limited-time offer]
[CTA button: "Get Started" / "Learn More" / "Claim Offer"]

---

### 7. Closing & CTA (25-50 words)

[Wrap-up message]

Until next week,
[Sender name/team]

P.S. [Casual note or question to encourage replies]

---

## Newsletter Stats

- **Word Count Target:** 600-800 words
- **Read Time:** 3-5 minutes
- **Links:** 5-8 total
- **CTAs:** 2-3 (primary: product, secondary: social/blog)

---

## Generation Prompts

### Full Newsletter Prompt (for AI):

\`\`\`
Create a weekly newsletter for $PROJECT targeting [audience]. Include:

**Recent Content:**
$RECENT_BLOGS

**Industry Trends:**
$RECENT_RESEARCH

**Structure:**
1. Welcome (50-75 words) - warm, engaging tone
2. This week's highlights (3 blog summaries, 150-200 words total)
3. Industry news roundup (3 trends, 100-150 words)
4. Featured resource/tool (75-100 words)
5. Community spotlight (customer story, 50-75 words)
6. Product promotion (soft pitch, 50-100 words)
7. Closing & CTA (25-50 words)

**Brand Voice:** [Based on project]
- AFAQ: Professional, data-driven, authoritative
- Petdate: Friendly, playful, community-focused
- SacredChain: Respectful, knowledgeable, empowering
- NikahX: Hopeful, modern yet traditional, supportive
- NoorStudio: Magical, creative, nurturing
- Mawashi: Down-to-earth, trustworthy, knowledgeable

**Total Length:** 600-800 words
**Tone:** Conversational, valuable, not salesy
\`\`\`

---

## HTML Conversion Prompt (for AI):

\`\`\`
Convert this newsletter to clean HTML suitable for Substack/Beehiiv:

[Paste newsletter content]

Requirements:
- Responsive design
- Clear section breaks
- CTA buttons styled prominently
- Mobile-friendly
- Email-safe CSS (inline styles)
- Alt text for images (if any)
\`\`\`

---

## Next Steps

1. **Generate Content:**
   - Copy "Full Newsletter Prompt" above
   - Paste into OpenClaw/ChatGPT/Claude
   - Review and edit output

2. **Convert to HTML:**
   - Copy newsletter text
   - Use "HTML Conversion Prompt"
   - Save output to ${DATE}_newsletter.html

3. **Add Visuals:**
   - Header image (1200x600px recommended)
   - Icons/dividers between sections
   - Product screenshots if promoting feature

4. **Publish:**
   - Copy HTML to Substack/Beehiiv editor
   - Add subject line (max 50 chars, catchy)
   - Preview in email client
   - Schedule for Friday 9 AM

5. **Promote:**
   - Share on social media
   - Post snippet on LinkedIn
   - Add to blog as web version

---

## Subject Line Ideas

- 🌟 [Week of $DATE]: [Main theme] + [Hook]
- Your weekly dose of [industry] insights 📬
- [Number] trends shaping [industry] this week
- [Interesting stat/fact] (+ what it means for you)
- Friday reads: [Topic 1], [Topic 2], and more

**Test A/B subject lines** for best open rates!

---

## Archive

Previous newsletters: $OUTPUT/$PROJECT/
Newsletter analytics: [Link to Substack/Beehiiv dashboard]

EOF

echo "✅ Newsletter structure saved: $OUTPUT/$PROJECT/${DATE}_newsletter.md"
echo ""

# Create simplified text version
cat > "$OUTPUT/$PROJECT/${DATE}_newsletter.txt" << EOF
${PROJECT} Newsletter - Week of $DATE

[WELCOME MESSAGE]
Happy Friday! 🌟 This week we're sharing...

[HIGHLIGHTS]
📖 Blog Post 1: [Title]
[Summary]

📖 Blog Post 2: [Title]
[Summary]

[INDUSTRY NEWS]
🔥 What's trending:
• [Trend 1]
• [Trend 2]

[FEATURED RESOURCE]
⭐ [Resource name]: [Description]

[COMMUNITY]
💚 Spotlight: [Customer story]

[PRODUCT/OFFER]
🚀 [Product pitch + CTA]

[CLOSING]
Until next week!
[Sender]

P.S. [Reply-worthy question]
EOF

echo "✅ Text version saved: $OUTPUT/$PROJECT/${DATE}_newsletter.txt"
echo ""

echo "📋 Summary"
echo ""
echo "Newsletter templates created:"
echo "  1. Markdown structure: ${DATE}_newsletter.md"
echo "  2. Text version: ${DATE}_newsletter.txt"
echo ""
echo "Next steps:"
echo "1. Fill in content using AI prompts from .md file"
echo "2. Convert to HTML for email"
echo "3. Publish to Substack/Beehiiv"
echo "4. Schedule for Friday 9 AM"
echo ""
echo "📖 Open newsletter: code $OUTPUT/$PROJECT/${DATE}_newsletter.md"
echo ""
