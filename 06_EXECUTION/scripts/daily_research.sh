#!/bin/bash

# Daily Content Research Script
# Aggregates trending topics across project domains
# Usage: ./daily_research.sh

DATE=$(date +%Y-%m-%d)
OUTPUT="/Users/architect/.openclaw/workspace/06_EXECUTION/research/daily/${DATE}.md"

mkdir -p "/Users/architect/.openclaw/workspace/06_EXECUTION/research/daily"

echo "🔍 Running daily content research for $DATE..."
echo ""

# Create research file header
cat > "$OUTPUT" << EOF
# Daily Content Research
**Date:** $DATE
**Generated:** $(date +"%Y-%m-%d %H:%M:%S")

---

## Overview

This research aggregates trending topics, news, and discussions across all project domains to inspire content creation.

---

EOF

# Define project domains for research
declare -A DOMAINS=(
    ["AFAQ ESG"]="ESG sustainability climate compliance SEC disclosure"
    ["Petdate"]="pet care dog parks playdates pet socialization"
    ["SacredChain"]="Islamic education Quran online learning madrasah"
    ["NikahX"]="Muslim marriage halal dating Muslim singles"
    ["NoorStudio"]="children's books Muslim kids representation AI books"
    ["Mawashi"]="livestock farming halal meat cattle trading"
)

# Research each domain
for PROJECT in "${!DOMAINS[@]}"; do
    echo "## $PROJECT" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "**Search Query:** ${DOMAINS[$PROJECT]}" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    
    echo "📊 Researching: $PROJECT..."
    
    # Placeholder for actual web search
    # Replace with: openclaw web search "${DOMAINS[$PROJECT]} latest news" --count 3
    
    cat >> "$OUTPUT" << EOF
### Trending Topics

1. **[Topic 1 Placeholder]**
   - Source: [URL]
   - Summary: [Brief summary of what's trending]
   - Content Angle: [How to use this for $PROJECT]

2. **[Topic 2 Placeholder]**
   - Source: [URL]
   - Summary: [Brief summary]
   - Content Angle: [Content idea]

3. **[Topic 3 Placeholder]**
   - Source: [URL]
   - Summary: [Brief summary]
   - Content Angle: [Content idea]

---

EOF
    
    echo "  ✓ $PROJECT research template created"
done

# Add social media trends section
cat >> "$OUTPUT" << EOF

## Social Media Trends

### Twitter/X Trending
- [Trending hashtag 1]
- [Trending hashtag 2]
- [Trending hashtag 3]

### Reddit Hot Topics
- r/sustainability: [Hot post]
- r/dogs: [Hot post]
- r/islam: [Hot post]

### Industry News
- [News item 1]
- [News item 2]
- [News item 3]

---

## Content Ideas Generated

Based on today's research:

1. **AFAQ:** [Blog post idea based on trend]
2. **Petdate:** [Social media post idea]
3. **SacredChain:** [Educational content idea]
4. **NikahX:** [Relationship advice post]
5. **NoorStudio:** [Book theme idea]
6. **Mawashi:** [Market insight post]

---

## Action Items

- [ ] Review research findings
- [ ] Select 2-3 topics per project for this week's content
- [ ] Create content outlines in Airtable
- [ ] Generate blog posts using generate_blog_post.sh
- [ ] Schedule social posts in Buffer

---

## Research Integration

**To fill in actual research data:**

1. **Manual Web Search:**
   - Search Google News for each domain
   - Check Reddit hot posts
   - Browse Twitter trending topics
   - Scan industry newsletters

2. **Using OpenClaw (if available):**
   \`\`\`bash
   # Replace placeholders above with:
   openclaw web search "ESG latest news" --count 3
   openclaw web search "pet care trends 2026" --count 3
   # etc. for each project
   \`\`\`

3. **Using Other Tools:**
   - Feedly: Subscribe to industry RSS feeds
   - Google Alerts: Set up alerts for keywords
   - BuzzSumo: Track trending content
   - AnswerThePublic: Find common questions

---

## Archive

Previous research: /workspace/06_EXECUTION/research/daily/
Weekly summaries: /workspace/06_EXECUTION/research/weekly/

EOF

echo ""
echo "✅ Daily research template saved: $OUTPUT"
echo ""
echo "Next steps:"
echo "1. Fill in actual research data (web search, social trends)"
echo "2. Review for content inspiration"
echo "3. Add best topics to Airtable content calendar"
echo "4. Generate blog posts: ./generate_blog_post.sh [project] [topic]"
echo ""
echo "📖 Open research file: code $OUTPUT"
echo ""

# Optional: Open file automatically
# code "$OUTPUT"
