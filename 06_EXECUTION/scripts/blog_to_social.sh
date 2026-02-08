#!/bin/bash

# Convert blog post to social media posts
# Usage: ./blog_to_social.sh [blog_url_or_file] [project]

INPUT=$1
PROJECT=$2
DATE=$(date +%Y-%m-%d)
OUTPUT="/Users/architect/.openclaw/workspace/06_EXECUTION/content/social_from_blog"

if [ -z "$INPUT" ] || [ -z "$PROJECT" ]; then
    echo "Usage: ./blog_to_social.sh [blog_url_or_file] [project]"
    echo "Example: ./blog_to_social.sh 'https://blog.com/post' AFAQ"
    echo "   OR  : ./blog_to_social.sh '/path/to/post.md' AFAQ"
    exit 1
fi

mkdir -p "$OUTPUT/$PROJECT"

# Determine if input is URL or file
if [[ "$INPUT" =~ ^https?:// ]]; then
    echo "📥 Fetching blog content from URL: $INPUT..."
    # Use curl + html2text or lynx
    BLOG_CONTENT=$(curl -s "$INPUT" | lynx -dump -stdin 2>/dev/null || echo "Error fetching URL")
    if [ "$BLOG_CONTENT" == "Error fetching URL" ]; then
        echo "❌ Failed to fetch URL. Install lynx: brew install lynx"
        exit 1
    fi
else
    echo "📄 Reading blog content from file: $INPUT..."
    if [ ! -f "$INPUT" ]; then
        echo "❌ File not found: $INPUT"
        exit 1
    fi
    BLOG_CONTENT=$(cat "$INPUT")
fi

echo ""
echo "📊 Blog content length: $(echo "$BLOG_CONTENT" | wc -w) words"
echo ""

# Generate Twitter thread
echo "🐦 Generating Twitter thread..."
TWITTER_PROMPT="Convert this blog post into a 7-tweet Twitter thread. 

Requirements:
- Tweet 1: Hook (shocking stat or question)
- Tweets 2-6: Key points from blog (1 point per tweet)
- Tweet 7: CTA with link
- Use emojis strategically
- Each tweet max 280 characters
- Include relevant hashtags (max 3 per tweet)
- Make it engaging and shareable

Blog content:
---
$BLOG_CONTENT
---

Format output as:
[1/7] [Tweet text]
[2/7] [Tweet text]
etc."

echo "$TWITTER_PROMPT" > /tmp/twitter_thread_prompt.txt

cat > "$OUTPUT/$PROJECT/${DATE}_twitter_thread.txt" << EOF
# Twitter Thread - Generated from Blog

**Project:** $PROJECT
**Date:** $DATE
**Source:** $INPUT

---

## Thread Preview

[1/7] 🚨 [Hook - grab attention]

[2/7] [Key point #1]

[3/7] [Key point #2]

[4/7] [Key point #3]

[5/7] [Key point #4]

[6/7] [Key point #5]

[7/7] [CTA + Link]

Read the full post: $INPUT

#Hashtag1 #Hashtag2 #Hashtag3

---

## Generation Prompt

To generate this thread using AI:
1. Copy prompt from: /tmp/twitter_thread_prompt.txt
2. Paste into OpenClaw/ChatGPT/Claude
3. Review output and adjust for brand voice
4. Copy to Airtable content calendar
5. Schedule in Buffer

---

## Manual Editing Notes

- [ ] Verify character counts (280 max per tweet)
- [ ] Check emoji placement
- [ ] Validate hashtags (not banned, relevant)
- [ ] Ensure thread flows logically
- [ ] Add visual cues (1/7, 2/7, etc.)
- [ ] Test link shortener if needed

EOF

echo "✅ Twitter thread template saved"
echo ""

# Generate Instagram carousel
echo "📸 Generating Instagram carousel..."
IG_PROMPT="Convert this blog post into a 5-slide Instagram carousel post.

Requirements:
- Slide 1: Eye-catching title + subtitle
- Slides 2-4: One key point per slide (visual-first, minimal text)
- Slide 5: Summary + CTA
- Each slide: Max 50 words
- Use emojis and bullet points
- Include caption (max 2200 chars) with storytelling
- Add 10-15 relevant hashtags
- First comment: Link to blog

Blog content:
---
$BLOG_CONTENT
---

Format output as:
SLIDE 1: [Title text]
SLIDE 2: [Key point text]
etc.

CAPTION: [Full caption]

HASHTAGS: [List]

FIRST COMMENT: [Link]"

echo "$IG_PROMPT" > /tmp/instagram_carousel_prompt.txt

cat > "$OUTPUT/$PROJECT/${DATE}_instagram_carousel.txt" << EOF
# Instagram Carousel - Generated from Blog

**Project:** $PROJECT
**Date:** $DATE
**Source:** $INPUT

---

## Carousel Slides

**SLIDE 1 (Cover):**
[Eye-catching title]
[Subtitle or hook]

**SLIDE 2:**
[Key Point #1]
• [Bullet 1]
• [Bullet 2]

**SLIDE 3:**
[Key Point #2]
• [Bullet 1]
• [Bullet 2]

**SLIDE 4:**
[Key Point #3]
• [Bullet 1]
• [Bullet 2]

**SLIDE 5 (CTA):**
[Summary sentence]
[Call to action]

---

## Caption

[Hook sentence to grab attention in feed]

[2-3 paragraphs expanding on carousel content]

[CTA: "Swipe for tips 👉" or "Link in bio for full post"]

---

## Hashtags

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5
#Hashtag6 #Hashtag7 #Hashtag8 #Hashtag9 #Hashtag10

---

## First Comment (for link)

📖 Read the full blog post: $INPUT

---

## Design Notes

- Use Canva template: [Link to project-specific template]
- Brand colors: [Based on $PROJECT]
- Font: [Based on brand guidelines]
- Size: 1080x1080px (square)
- Export: PNG or JPG

---

## Generation Prompt

Copy from: /tmp/instagram_carousel_prompt.txt

EOF

echo "✅ Instagram carousel template saved"
echo ""

# Generate LinkedIn post
echo "💼 Generating LinkedIn post..."
LINKEDIN_PROMPT="Convert this blog post into a LinkedIn post (max 1300 characters).

Requirements:
- Professional tone but conversational
- Hook in first line (before 'see more' cutoff)
- 3 key takeaways with emojis
- Include question to drive engagement
- CTA with link in first comment
- 3-5 relevant hashtags

Blog content:
---
$BLOG_CONTENT
---

Format output as:
[Hook line]

[Body paragraphs]

Key takeaways:
💡 [Takeaway 1]
💡 [Takeaway 2]
💡 [Takeaway 3]

[Engagement question]

[Hashtags]

---
FIRST COMMENT:
[Link to full post]"

echo "$LINKEDIN_PROMPT" > /tmp/linkedin_post_prompt.txt

cat > "$OUTPUT/$PROJECT/${DATE}_linkedin_post.txt" << EOF
# LinkedIn Post - Generated from Blog

**Project:** $PROJECT
**Date:** $DATE
**Source:** $INPUT

---

## Post Text

[Hook: Attention-grabbing first line before "see more"]

[Body: 2-3 paragraphs expanding on the topic]

Key takeaways:
💡 [Takeaway 1]
💡 [Takeaway 2]
💡 [Takeaway 3]

[Engagement question to spark comments]

#Hashtag1 #Hashtag2 #Hashtag3

---

## First Comment

📖 Read the full article: $INPUT

---

## LinkedIn Tips

- [ ] Character count: ____ / 1300
- [ ] Hook under 150 chars (before fold)
- [ ] Include personal story if applicable
- [ ] Tag relevant connections/companies
- [ ] Post during optimal time (Tue-Thu, 9-11 AM)

---

## Generation Prompt

Copy from: /tmp/linkedin_post_prompt.txt

EOF

echo "✅ LinkedIn post template saved"
echo ""

# Summary
echo "📋 Summary"
echo ""
echo "Social posts generated:"
echo "  1. Twitter thread: $OUTPUT/$PROJECT/${DATE}_twitter_thread.txt"
echo "  2. Instagram carousel: $OUTPUT/$PROJECT/${DATE}_instagram_carousel.txt"
echo "  3. LinkedIn post: $OUTPUT/$PROJECT/${DATE}_linkedin_post.txt"
echo ""
echo "Next steps:"
echo "1. Use AI to generate content from prompts in /tmp/"
echo "2. Review and edit for brand voice"
echo "3. Create Instagram carousel graphics in Canva"
echo "4. Upload all to Airtable content calendar"
echo "5. Schedule in Buffer (Twitter, LinkedIn)"
echo "6. Schedule in Meta Business Suite (Instagram carousel)"
echo ""
echo "✅ Blog-to-social conversion complete!"
