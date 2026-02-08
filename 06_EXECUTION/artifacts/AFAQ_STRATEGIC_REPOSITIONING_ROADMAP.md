# AFAQ Product Repositioning — Strategic Roadmap

**Date:** 2026-02-05 06:08 PST  
**Source:** Architect strategic guidance  
**Objective:** Reposition AFAQ from "ESG disclosure tool" to "consultancy-grade sustainability reporting engine" for GCC SMEs

---

## Strategic Insight: Market Trajectory

### GCC Regulatory Landscape
- **Qatar (Jan 2026+):** All QSE-listed companies must prepare sustainability reports aligned with IFRS S1/S2
- **Saudi Arabia:** Moving from voluntary ESG (Tadawul guidelines) toward unified national ESG guidelines aligned with international norms
- **Region-wide:** Shift from glossy CSR narratives to structured ESG governance with board-level responsibility

### The Opportunity
SMEs in GCC need help with **data, workflows, and metrics** — not just templates. Current Big-4 engagements cost 200k+ SAR. AFAQ can capture this market with "EY/Deloitte-lite in a box" positioning.

---

## Product Architecture: Engine + Packs

### Core: Sustainability Reporting Engine
Data model aligned with ISSB (IFRS S1/S2) + GCC Unified ESG Metrics:

| Module | Schema Fields |
|--------|--------------|
| **Entity Structure** | Company profile, sector, size, facilities, boundaries |
| **Governance** | ESG committee, board oversight frequency, policies (climate, H&S, anti-bribery) |
| **Environmental** | Energy (kWh by source), GHG Scopes 1/2, water, waste |
| **Social** | Workforce (gender, nationality split), H&S (LTIFR), training |
| **Governance/Compliance** | Policies, anti-corruption, whistleblowing |
| **Targets & KPIs** | Metric, baseline, target year, target value, RAG status |

### Layer 2: Disclosure Packs
Same data backbone → multiple outputs:
1. **Saudi Pack:** Tadawul ESG metrics + unified guidelines mapping
2. **Qatar Pack:** QSE/IFRS S1/S2 sustainability report with climate annex
3. **Bank Pack:** Auto-answer ESG questionnaires from GCC banks

---

## Consulting-Grade Feature Set

To compete with EY/Deloitte at SME level, AFAQ needs:

### 1. Guided Diagnostic Wizard
- Sector, footprint, supply-chain role, regulatory exposure
- Auto-generate risk/opportunity profile + "business case for sustainability"

### 2. Materiality & Stakeholders Module
- Prebuilt GCC SME stakeholder sets (owners, regulators, banks, customers, workforce)
- 30-40 ESG topics mapped to GRI/ISSB
- Survey/scoring logic → materiality matrix visualization

### 3. Strategy & Roadmap Builder
- Opinionated blueprint: 3-5 ESG pillars, 10-20 standard initiatives per sector
- Roadmap generator with timelines, owners, RAG status
- One-page "Action Plan" output

### 4. Quant Engine with Commentary
Every major metric gets **consulting-style interpretation**:
- **Diagnostic:** Where you stand
- **Implication:** What this means
- **Recommendation:** What to do next

### 5. Narrative & Design Layer
- Multiple report "personas": Board, bank, key customer, internal
- Section-by-section templates modelled on Big-4 outputs
- Branded, visually rich exports

---

## 10-Step Implementation Blueprint

### Step 1: Fix Report Blueprint
Lock reusable consulting-style structure (barely changes between clients):
1. Executive Summary
2. Company Context
3. ESG & Regulatory Landscape (GCC + country)
4. Stakeholder Analysis & Materiality
5. ESG Governance
6. Environmental Performance (data + narrative + actions)
7. Social Performance
8. Governance Practices
9. Strategy, Targets & 3-Year Roadmap
10. Methodology & Appendices

### Step 2: Structured Intake Layer
Build clean data capture:
- Company profile (sector, size, markets)
- ESG context (customers, banks, ESG requests)
- Quantitative KPIs (emissions, energy, water, workforce)
- Policy documents (upload/link)

### Step 3: Break Into Generation Blocks
30-60 small generation tasks, never ask for "50 pages at once":
- B1: Executive summary (1.5-2 pages)
- B2: Company context (1-2 pages)
- B3: ESG landscape (3-4 pages)
- B4-B5: Stakeholder/materiality (1-2 pages each)
- B6-B9: Pillar sections (2-3 pages each, subsections)
- B10: Strategy & roadmap (4-6 pages)
- B11-B12: Methodology & appendices (2-3 pages each)

### Step 4: Strict Prompt Patterns
For each block:
- Voice: "Write like a management consultant presenting to a board"
- Length: "Write 5 paragraphs, each 4-6 sentences"
- Inputs: Include structured data
- Constraints: "No bullet points, no repetition, don't invent numbers"

### Step 5: Template Libraries
Maintain reusable "consulting" snippets:
- Sector context blocks (hospitality, construction, F&B, services)
- ESG risk/opportunity paragraphs by sector
- Governance model descriptions
- Roadmap actions by maturity level

Workflow: Select 5-10 base paragraphs → AI adapts to client

### Step 6: Data-Driven Commentary Pattern
For each metric/cluster:
1. What the data says
2. Why it matters
3. What should be done (12-36 months, GCC context)

### Step 7: Control Length Backwards
Design for 20,000-25,000 words total:
- 400-500 words ≈ 1 page
- 10-15 major blocks × 1,000-1,500 words each
- Explicit prompt: "Produce 1,200-1,600 words in 5-7 paragraphs"

### Step 8: Orchestration & Stitching
Build report generator flow:
1. Gather intake data
2. Validate completeness
3. Run generation tasks (parallel where possible)
4. Collect into structured object
5. Consistency pass (flag contradictions, unify terminology)
6. Export to template with fixed styles

### Step 9: Human-in-the-Loop Review
- Section review UI for quick edits
- Resize actions: "short", "standard", "extended"
- AI actions: "More conservative tone", "Add GCC example", "Specific recommendations"

### Step 10: Iterate with Real Reports
First 3-5 clients refine:
- Where AI vague → add input fields
- Where sections thin → split into more blocks
- Where too generic → enrich libraries with own IP

---

## GCC-Specific Differentiators

Where AFAQ beats Big-4 for SMEs:

1. **National Vision Alignment:** Pre-configured for Vision 2030, Qatar National Vision 2030
2. **Localized Case Examples:** By sector (energy-intensive, construction, hospitality, F&B, services)
3. **Price Point:** "Consultancy-grade structure in days, not months" — fraction of 200k SAR engagements
4. **Speed:** Automated data capture + generation vs. manual billable hours

---

## Current AFAQ State vs. Target

| Component | Current | Target |
|-----------|---------|--------|
| Report length | ~10 pages summary | 50+ pages consulting-grade |
| Data model | Basic questionnaire | Structured ISSB-aligned schema |
| Narrative | Template filling | Diagnostic + implication + recommendation |
| Strategy | None | Materiality matrix + roadmap builder |
| Workflows | Minimal | Periods, roles, approvals, audit trail |
| Commentary | Generic | Data-driven, peer-benchmarked |

---

## Immediate Next Steps

1. **Validate existing schema** against ISSB/GCC unified metrics
2. **Design block-by-block generation pipeline** (30-60 blocks)
3. **Build template library** for GCC sectors
4. **Implement intake layer** with structured data capture
5. **Create report blueprint** (locked table of contents)
6. **Prototype with one full report** using blocked generation

---

## Success Metrics

- Report generation time: < 2 hours (vs. weeks for consultants)
- Report depth: 50+ pages, data-driven narratives
- Page count consistency: ±5 pages across clients
- Quality perception: "Indistinguishable from boutique report" (SME feedback)
- Sales metric: Close pilot at SAR 15-30k (vs. 200k SAR Big-4)
