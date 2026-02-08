#!/bin/bash

# OpenClaw Blog Post Generator
# Usage: ./generate_blog_post.sh [project_name] [topic]

PROJECT=$1
TOPIC=$2
DATE=$(date +%Y-%m-%d)
OUTPUT_DIR="/Users/architect/.openclaw/workspace/06_EXECUTION/content/blog_drafts"

if [ -z "$PROJECT" ] || [ -z "$TOPIC" ]; then
    echo "Usage: ./generate_blog_post.sh [project_name] [topic]"
    echo "Example: ./generate_blog_post.sh AFAQ 'SEC Climate Disclosure Rules 2026'"
    exit 1
fi

mkdir -p "$OUTPUT_DIR/$PROJECT"

# Step 1: Research topic using web search
echo "🔍 Researching topic: $TOPIC for $PROJECT..."
echo ""

# Use OpenClaw to research (placeholder - adjust based on actual OpenClaw CLI)
RESEARCH_QUERY="$TOPIC latest news insights 2026"
echo "Research query: $RESEARCH_QUERY"
echo ""

# Step 2: Generate blog post outline
echo "📝 Generating outline..."
echo ""

OUTLINE_PROMPT="Based on the topic '$TOPIC' for project $PROJECT, create a detailed blog post outline. Include:

1. Catchy SEO-optimized title (60 chars max)
2. Meta description (150 chars)
3. Introduction hook (2-3 sentences)
4. 3-5 main sections with key points
5. Conclusion with clear CTA
6. Suggested SEO keywords (5-7)

Target audience: [Based on project]
- AFAQ: Sustainability officers, compliance managers
- Petdate: Pet owners, dog park communities
- SacredChain: Muslim parents, Islamic educators
- NikahX: Single Muslims seeking marriage
- NoorStudio: Muslim parents buying children's books
- Mawashi: Livestock farmers and traders

Tone: Professional yet conversational, actionable, valuable."

echo "$OUTLINE_PROMPT" > /tmp/blog_outline_prompt.txt
echo "Outline prompt saved to /tmp/blog_outline_prompt.txt"
echo ""

# Step 3: Placeholder for full blog post generation
echo "✍️ Full blog post generation..."
echo ""

BLOG_PROMPT="Using the topic '$TOPIC', write a complete 1000-1500 word blog post for $PROJECT.

Requirements:
- Engaging hook in first paragraph
- Use conversational tone
- Include 3-5 real-world examples
- Break up with subheadings (H2, H3)
- Add bullet points for readability
- Include internal/external links [placeholder]
- Optimize for SEO keywords
- End with clear CTA
- Format in Markdown

Remember the audience and brand voice for $PROJECT."

echo "$BLOG_PROMPT" > /tmp/blog_post_prompt.txt
echo "Blog prompt saved to /tmp/blog_post_prompt.txt"
echo ""

# Step 4: Save draft template
OUTPUT_FILE="$OUTPUT_DIR/$PROJECT/${DATE}_${TOPIC// /_}.md"

cat > "$OUTPUT_FILE" << EOF
# [TITLE PLACEHOLDER]

**Date:** $DATE
**Project:** $PROJECT
**Topic:** $TOPIC
**Status:** Draft - Needs human review

---

## Meta Information
- **SEO Title:** [60 chars]
- **Meta Description:** [150 chars]
- **Keywords:** [keyword1, keyword2, keyword3]

---

## Introduction

[Hook paragraph - grab attention in first 3 sentences]

---

## [Section 1: Main Point]

[Content for section 1]

### [Subsection 1.1]

[Details, examples]

---

## [Section 2: Main Point]

[Content for section 2]

---

## [Section 3: Main Point]

[Content for section 3]

---

## Conclusion

[Summary of key takeaways]

**Call to Action:**
[Clear next step for reader - download, sign up, learn more]

---

## Editorial Notes

**Next Steps:**
1. Research and fill in content sections
2. Add real-world examples and data
3. Insert relevant images/infographics
4. Add internal links to other blog posts
5. Proofread for brand voice consistency
6. Publish to Ghost/WordPress
7. Run blog_to_social.sh to generate social posts

**Prompts for AI assistance:**
- Research prompt: /tmp/blog_outline_prompt.txt
- Full post prompt: /tmp/blog_post_prompt.txt

**Integration Note:**
To use OpenClaw for content generation, uncomment and adjust:
# OUTLINE=\$(cat /tmp/blog_outline_prompt.txt | openclaw chat --model claude-sonnet-4)
# BLOG_POST=\$(cat /tmp/blog_post_prompt.txt | openclaw chat --model claude-sonnet-4)
EOF

echo "✅ Blog post template saved: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Open file: code $OUTPUT_FILE"
echo "2. Use AI (OpenClaw/ChatGPT/Claude) to generate content from prompts"
echo "3. Copy prompts from /tmp/blog_*_prompt.txt"
echo "4. Edit for quality and brand voice"
echo "5. Add images/media"
echo "6. Publish to Ghost/WordPress"
echo "7. Run: ./blog_to_social.sh [published_url] $PROJECT"
echo ""
