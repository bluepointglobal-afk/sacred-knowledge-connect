# AFAQ Enhanced Sustainability Report Generator - Product Requirements Document

**Version:** 2.0.0  
**Date:** February 5, 2026  
**Status:** Production-Ready Specification  
**Author:** AFAQ ESG Platform Team

---

## 1. Executive Summary

This PRD defines the complete specifications for the AFAQ Enhanced Sustainability Report Generator, a comprehensive 50+ page enterprise-grade ESG reporting solution targeting SMEs in the GCC region (UAE, Saudi Arabia, Qatar).

### Key Objectives
- Generate 50-65 page professional sustainability reports
- Integrate GCC-specific regulatory context (ADX, Tadawul, QSE)
- Support 7 major industry verticals with tailored templates
- Enable jurisdiction-specific compliance language
- Provide data-driven narratives with actionable recommendations

---

## 2. Regulatory Landscape Analysis

### 2.1 United Arab Emirates (UAE)

#### ADX Sustainability Disclosure Rules (2025)
**Status:** Mandatory for listed companies; de facto mandatory for ambitious non-listed

**Key Requirements:**
- **Framework Alignment:** IFRS S1 and S2, GRI Standards, GCC ESG Metrics
- **31 Essential ESG Indicators** across E/S/G categories
- **Double Materiality Assessment:** Financial + impact materiality required
- **Reporting Timeline:** Within 90 days of financial year-end or before AGM (whichever is earlier)
- **Format:** Standalone sustainability report OR integrated within annual report
- **Governance Linkage:** ESG targets must connect to executive remuneration

**Strategic Alignment References:**
- UAE Vision 2031
- Net Zero by 2050 commitment
- Cabinet Resolution No. 67 (2024)
- Abu Dhabi Economic Vision 2030

**UAE Climate Law (Federal Decree-Law No. 11 of 2024):**
- **Effective:** May 30, 2025 (full compliance by May 30, 2026)
- **Scope:** Nationwide GHG emissions measurement and reporting (all entities including SMEs)
- **Penalties:** AED 50,000 to AED 2,000,000 for non-compliance
- **Platform:** MOCCAE digital reporting platform mandatory

**Dubai Clean Energy Strategy 2050:**
- **Target:** 75% clean energy by 2050
- **Interim:** 25% solar by 2030
- **Projects:** Mohammed Bin Rashid Al Maktoum Solar Park (5,000 MW by 2030, AED 50B investment)
- **Business Requirements:** Environmental Impact Assessments, ISO 14001, DEWA standards
- **Incentives:** Shams Dubai program, tax incentives, PPP opportunities

**ADNOC/Government Procurement ESG Requirements:**
- ESG scoring integrated into tender evaluations
- Scope 1/2/3 emissions reporting required for major suppliers
- Net-zero alignment mandatory for government-linked contracts
- Sustainability due diligence in prequalification

#### Financial Services & Banking (UAE)
- **Guidelines:** UAE Central Bank ESG guidelines for banks
- **Requirements:** Climate risk stress testing, sustainable finance frameworks
- **Disclosure:** TCFD-aligned climate risk reporting

---

### 2.2 Kingdom of Saudi Arabia (KSA)

#### Tadawul ESG Disclosure Guidelines
**Status:** Voluntary (2021) but rapidly evolving toward mandatory

**Current Framework:**
- **Adoption Rate:** 40% of Main Market issuers (2024); target 45% by end-2025
- **Principles:** Relevance, materiality, responsibility, reporting options
- **Structure:** Non-binding roadmap for consistent voluntary disclosures

**Vision 2030 Integration:**
- **Pillars:** Vibrant society, thriving economy, ambitious nation
- **93% of Vision 2030 targets met** as of third phase
- **ESG embedded from launch** (2016)

**Saudi Green Initiative (SGI):**
- **Launched:** 2021
- **Net Zero Target:** 2060
- **Renewable Energy:** 50% of electricity by 2030
- **Initiatives:** 85+ initiatives affecting supply chains
- **Key Programs:** Tree planting, land/sea protection, emissions cuts

**Environmental Priorities:**
- Carbon emissions reduction (circular carbon economy)
- Renewable energy expansion (NEOM, solar, wind)
- Water management and waste-to-energy
- Biodiversity protection through afforestation

**Social Priorities:**
- Healthcare and education investments
- Employee diversity and human rights
- Health & safety standards
- Community involvement

**Governance Requirements:**
- Transparency and anti-corruption measures
- Board diversity mandates
- ESG disclosure alignment with UN SDGs
- CMA anti-greenwashing regulations (Market Conduct)

**ARAMCO Supply Chain Requirements:**
- ESG standards for suppliers
- Carbon accounting and waste reduction
- Ethical practices alignment
- Digital ESG tracking systems recommended

**National Standards for Sustainability:**
- Corporate reporting guidance on environment, social, governance
- Alignment with Vision 2030 and UN SDGs
- CMA corporate governance reforms linking ESG to financial sustainability

---

### 2.3 State of Qatar

#### QSE ESG Listing Rules
**Status:** Voluntary → Mandatory transition (2025-2026)

**Historical (2016-2024):**
- Voluntary QSE ESG guidance and platform
- 34 KPIs across environmental, social, governance
- TCFD-style climate risk narratives

**QFMA Corporate Governance Code (2025):**
- **Published:** August 17, 2025
- **Effective:** Immediate publication
- **Compliance Deadline:** August 2026 (one-year grace period)
- **Scope:** All listed companies (~50 on QSE)

**Mandatory Requirements:**
- Environmental/Social Responsibility (ESR) programs
- Climate change risk management policies
- Environmental impact assessments on business plans
- Annual governance reports with ESG performance
- Real-time material information disclosure to QFMA, QSE, and company websites

**Disclosure Framework:**
- Environmental: Scope 1/2 (Scope 3 if material), energy, water, waste
- Social: Board diversity, ethics, labor metrics
- Governance: Governance structure, social indicators

**Future Evolution (2026/2027+):**
- Full ISSB/IFRS S1-S2 alignment expected
- Quantitative emissions reporting with transition plans
- Double materiality assessment
- Limited assurance requirements
- Machine-readable formats
- QFMA/QSE penalties for non-compliance

**Qatar National Vision 2030:**
- ESG integration in national development strategy
- Support for sustainable finance growth
- Human development pillar emphasizing social metrics

---

### 2.4 GCC Unified ESG Metrics (2023)

**Framework:** 29 Voluntary ESG Disclosure Metrics
**Launched:** January 9, 2023
**Chair:** Saudi Exchange
**Participating Exchanges:** ADX, Bahrain Bourse, Boursa Kuwait, Qatar Stock Exchange, Muscat Stock Exchange

**Environmental (10 metrics):**
- GHG emissions (Scopes 1-3 in CO2 equivalents)
- Energy usage (direct/indirect)
- Water usage
- Emissions intensity
- Energy mix
- Climate risk mitigation investments
- Aligned with GRI 305, 302, 303

**Social (10 metrics):**
- Gender pay gap
- Employee turnover
- Gender diversity
- Child labor policies
- Global health impacts
- Training hours
- Safety incidents

**Governance (9 metrics):**
- Board diversity
- Data privacy policies
- Ethics policies
- Sustainability reporting oversight
- Management team ESG responsibilities
- Anti-corruption measures

**Standards Alignment:**
- World Federation of Exchanges (WFE)
- Sustainable Stock Exchanges Initiative
- Global Reporting Initiative (GRI)

**Status:** Voluntary as of 2023; evolution toward mandates ongoing

---

### 2.5 Islamic Finance ESG Considerations

**Green Sukuk Framework:**
- **Definition:** Sharia-compliant Islamic bonds financing sustainable projects
- **Market Size:** $35+ billion issued globally (early 2025); $10-12B projected annual issuance
- **Key Markets:** Malaysia, Saudi Arabia, Islamic Development Bank

**Requirements:**
- 100% use of proceeds for eco-friendly projects
- Asset-backing (renewable facilities, green infrastructure)
- Profit-sharing/lease structures (ijara, mudarabah) - no interest
- Sharia board certification (AAOIFI standards)
- ICMA Green/Social/Sustainability Principles compliance
- Third-party verification for eligible green assets
- Post-issuance reporting on fund allocation and environmental outcomes

**Islamic Principles Alignment:**
- **Khalifah:** Stewardship of resources
- **Maqasid al-Shariah:** Preservation of faith, life, intellect, lineage, wealth
- **Prohibited:** Riba (interest), maysir (gambling), gharar (uncertainty)

**Project Categories:**
- Renewable energy (solar, wind, biogas)
- Energy efficiency
- Clean transport (electric vehicles)
- Water conservation
- Pollution mitigation
- Sustainable agriculture
- Biodiversity preservation

---

## 3. Industry-Specific Templates

### 3.1 Manufacturing & Industrial

**Materiality Topics:**
- Energy efficiency and renewable transition
- GHG emissions reduction (Scope 1 heavy)
- Water stewardship in water-scarce regions
- Waste management and circular economy
- Supply chain ESG screening
- Occupational health & safety
- Product lifecycle environmental impact

**Key Metrics:**
- Energy intensity (kWh/unit produced)
- Carbon intensity (tCO2e/unit produced)
- Water intensity (m³/unit produced)
- Waste diversion rate (%)
- Renewable energy (% of total)
- TRIR/LTIFR safety rates
- Supplier ESG assessment coverage (%)

**Regulatory Context:**
- Environmental permits and compliance
- ISO 14001 EMS certification
- ADNOC/supplier ESG requirements (UAE)
- SGI circular carbon economy (KSA)

**Narrative Focus:**
- Operational efficiency improvements
- Clean technology investments
- Supply chain decarbonization
- Worker safety culture
- Product sustainability

---

### 3.2 Retail & Consumer Goods

**Materiality Topics:**
- Sustainable sourcing and supply chain
- Packaging waste and circularity
- Product safety and quality
- Customer data privacy
- Employee wellbeing and retail working conditions
- Community engagement
- Green building/retail operations

**Key Metrics:**
- Sustainable sourcing (% of spend)
- Recyclable/recycled packaging (%)
- Product safety incidents
- Customer satisfaction/loyalty
- Employee turnover (retail staff)
- Training hours per employee
- Community investment ($/revenue %)

**Regulatory Context:**
- Consumer protection regulations
- Product safety standards
- Extended producer responsibility (emerging)
- Data protection (GDPR-style requirements)

**Narrative Focus:**
- Sustainable product offerings
- Supply chain transparency
- Customer trust and loyalty
- Employee experience in retail
- Community impact programs

---

### 3.3 Financial Services & Banking

**Materiality Topics:**
- Sustainable finance and ESG-linked products
- Climate risk assessment and stress testing
- Green sukuk and sustainable bond frameworks
- Responsible investment policies
- Data security and privacy
- Financial inclusion
- Anti-money laundering/compliance

**Key Metrics:**
- Sustainable finance portfolio ($/%)
- ESG-linked loans ($/%)
- Green/sustainable bond issuance ($)
- Climate risk exposure (% of portfolio)
- Financial inclusion reach (# customers)
- Data breach incidents
- AML compliance training completion (%)

**Regulatory Context:**
- Central Bank ESG guidelines (UAE, KSA, Qatar)
- TCFD climate risk disclosure
- IFRS S1/S2 alignment
- Sharia compliance (Islamic banks)
- Anti-greenwashing regulations (CMA KSA)

**Narrative Focus:**
- Sustainable finance leadership
- Climate risk management
- ESG integration in lending/investment
- Financial inclusion initiatives
- Digital transformation and security

---

### 3.4 Energy & Utilities

**Materiality Topics:**
- Energy transition and decarbonization
- Renewable energy development
- Carbon capture and circular carbon
- Water-energy nexus
- Biodiversity and ecosystem protection
- Health & safety (high-risk operations)
- Community impact and local content

**Key Metrics:**
- Renewable energy capacity (MW/%)
- Carbon intensity (tCO2e/MWh)
- Methane emissions reduction (%)
- Water recycling/reuse rate (%)
- Biodiversity offset/acreage
- TRIR (target: <0.5 for oil & gas)
- Local content spend (%)

**Regulatory Context:**
- Nationally Determined Contributions (NDCs)
- Net Zero 2050/2060 commitments
- Environmental permits (major projects)
- ADNOC ESG standards (UAE)
- SGI circular carbon economy (KSA)

**Narrative Focus:**
- Energy transition strategy
- Decarbonization technology investments
- Operational excellence and safety
- Community partnership models
- Natural resource stewardship

---

### 3.5 Real Estate & Construction

**Materiality Topics:**
- Green building certification (LEED, Estidama, Mostadam)
- Energy and water efficiency in buildings
- Construction waste management
- Sustainable materials sourcing
- Worker safety (construction hazards)
- Affordable housing/accessibility
- Urban heat island mitigation

**Key Metrics:**
- Green building certified portfolio (%)
- Energy use intensity (kWh/m²/year)
- Water use intensity (L/m²/year)
- Construction waste diversion (%)
- Sustainable materials (%)
- Safety incident rate (construction)
- Affordable housing units (%)

**Regulatory Context:**
- Green building regulations (Dubai, Abu Dhabi)
- Estidama Pearl rating system
- Mostadam (KSA green building)
- Barjeel (Qatar green building)
- Construction safety regulations

**Narrative Focus:**
- Sustainable design and construction
- Building performance optimization
- Healthy indoor environments
- Construction safety excellence
- Community-integrated developments

---

### 3.6 Healthcare & Pharmaceuticals

**Materiality Topics:**
- Patient safety and quality of care
- Healthcare access and equity
- Medical waste management
- Pharmaceutical product safety
- Clinical trial ethics
- Data privacy (patient records)
- Employee wellbeing (healthcare worker burnout)

**Key Metrics:**
- Patient safety incidents
- Healthcare-associated infections
- Medical waste properly disposed (%)
- Patient satisfaction scores
- Clinical trial compliance
- Data breach incidents
- Staff wellbeing scores
- Training hours (clinical staff)

**Regulatory Context:**
- Healthcare licensing and accreditation
- Medical waste regulations
- Data protection (healthcare-specific)
- Pharmaceutical regulations
- Clinical trial ethics boards

**Narrative Focus:**
- Patient-centered care quality
- Healthcare innovation and access
- Medical waste circularity
- Employee resilience programs
- Community health initiatives

---

### 3.7 Professional Services & Consulting

**Materiality Topics:**
- Talent attraction and retention
- Professional development and certification
- Ethics and independence
- Client data confidentiality
- Carbon footprint (office operations, travel)
- Diversity and inclusion
- Thought leadership and knowledge sharing

**Key Metrics:**
- Employee retention rate (%)
- Professional certification coverage (%)
- Ethics training completion (%)
- Client data breaches (zero target)
- Carbon per employee (tCO2e)
- Gender diversity (leadership %)
- Pro bono/community service hours

**Regulatory Context:**
- Professional licensing requirements
- Ethics codes (by profession)
- Data protection regulations
- Independence requirements (audit firms)

**Narrative Focus:**
- Talent excellence and development
- Ethics-first culture
- Client trust and confidentiality
- Low-carbon operations
- Knowledge economy contribution

---

## 4. Report Structure Specification

### 4.1 Section 1: Executive Summary (5 pages)

**Page 1: Company Overview & Profile**
- Company snapshot (sector, employees, facilities, operations)
- Overall ESG Readiness Score with maturity level
- Pillar performance summary table
- Key strengths and capabilities
- Key gaps and improvement opportunities

**Page 2-3: Gap Analysis & Priority Actions**
- Critical gaps identified by category
- Priority actions phased (90/180/365 days)
- Investment and resource requirements
- Estimated timeline to maturity

**Page 3-4: Strategic Context & Jurisdiction Alignment**
- Regulatory environment overview (jurisdiction-specific)
- Market context and competitive positioning
- Strategic imperatives

**Page 5: Implementation Roadmap Summary**
- 12-month transformation path
- Maturity evolution projections
- Success metrics and KPIs

---

### 4.2 Section 2: Regulatory Landscape (8 pages)

**Section A: Global ESG Regulatory Trends (1 page)**
- IFRS Sustainability Standards (S1, S2)
- TCFD and climate risk framework
- EU Taxonomy influence

**Section B: GCC Regional Framework (2 pages)**
- UAE: ADX Rules, Vision 2031, Net Zero 2050, Climate Law
- KSA: Tadawul Guidelines, Vision 2030, SGI
- Qatar: QSE Rules, QFMA Code 2025, National Vision 2030

**Section C: Sector-Specific Regulations (1.5 pages)**
- Industry-tailored regulatory overview
- Compliance requirements by sector

**Section D: SME Compliance Obligations (2 pages)**
- Direct regulatory requirements
- Indirect pressure (lenders, customers, procurement)
- Compliance roadmap

**Section E: Key Takeaways (1.5 pages)**
- Strategic implications
- Competitive advantage opportunities

---

### 4.3 Section 3: Pillar Analysis (25 pages)

#### 3.1 Environmental (10 pages)
1. Overview and maturity score
2-3. Climate & GHG Management
4-5. Energy & Renewable Transition
6. Water Stewardship
7. Waste & Circular Economy
8. Ecosystem & Biodiversity
9-10. Environmental Compliance & EMS

#### 3.2 Social (8 pages)
1. Overview and maturity score
2. Workforce & Human Capital
3-4. Health & Safety
5. Learning & Development
6. Diversity & Inclusion
7. Community Impact
8. Future Focus

#### 3.3 Governance (7 pages)
1. Overview and maturity score
2-3. Board & Management Structure
4. Business Ethics & Compliance
5. Risk Management & Integration
6. Supply Chain Responsibility
7. Stakeholder Engagement

---

### 4.4 Section 4: Evidence Register (10 pages)

1. Purpose & Framework
2-4. Disclosure-to-Evidence Mapping Tables (E/S/G)
5. Data Quality Assessment Framework
6-7. Critical Data Dependencies & Risks
8. Assurance Strategy
9-10. Supporting Document References

---

### 4.5 Section 5: Action Plan (10 pages)

1. Overview & Planning Approach
2-4. Phase 1: Foundation (0-90 days)
5-7. Phase 2: Control Enhancement (90-180 days)
8-10. Phase 3: Maturity & Disclosure (180-365 days)

---

### 4.6 Section 6: Benchmarking (5 pages)

1. Market Positioning & Peer Comparison
2-3. Sector-Specific Benchmarking
4. Pillar-Level Analysis
5. Competitive Advantage Opportunities

---

### 4.7 Section 7: Appendices (5 pages)

1. Glossary of Terms
2. Assessment Methodology
3. References & Resources
4. Report Preparation Notes
5. Contact Information

---

## 5. Jurisdiction-Specific Content Requirements

### 5.1 UAE Content Markers

**Must Include:**
- References to "ADX Sustainability Disclosure Rules"
- "UAE Vision 2031" alignment
- "Net Zero by 2050" commitment
- "Dubai Clean Energy Strategy 2050" (if Dubai-based)
- "Federal Decree-Law No. 11 of 2024" (Climate Law)
- "MOCCAE" reporting platform mention
- "ADNOC" or government procurement ESG requirements (if relevant)
- "DEWA" standards (Dubai Electricity & Water Authority)
- "Emirates Nature-WWF" or local environmental partnerships
- "UAE Green Agenda 2030"

**Regulatory Tone:**
- Emphasize mandatory compliance deadlines
- Highlight penalty implications
- Focus on competitive advantage through early adoption
- Reference government-linked entity requirements

---

### 5.2 Saudi Arabia Content Markers

**Must Include:**
- References to "Tadawul ESG Disclosure Guidelines"
- "Vision 2030" integration
- "Saudi Green Initiative (SGI)"
- "Circular Carbon Economy" approach
- "Net Zero 2060" target
- "CMA" (Capital Market Authority) references
- "ARAMCO" supply chain requirements (if relevant)
- "NEOM" as sustainability benchmark
- "Saudi Exchange" sustainability platform
- "National Standards for Sustainability"

**Regulatory Tone:**
- Emphasize voluntary-to-mandatory transition
- Highlight Vision 2030 strategic alignment
- Reference G20 leadership and global best practices
- Focus on economic diversification narrative

---

### 5.3 Qatar Content Markers

**Must Include:**
- References to "QSE ESG Listing Rules"
- "QFMA Corporate Governance Code 2025"
- "Qatar National Vision 2030"
- "ESR" (Environmental/Social Responsibility) programs
- "Qatar Stock Exchange" sustainability dashboard
- Compliance deadline: "August 2026"
- "TCFD-style" climate risk narratives
- "ISSB/IFRS S1-S2" future alignment

**Regulatory Tone:**
- Emphasize transition period (grace until 2026)
- Highlight immediate preparation needs
- Reference governance report integration
- Focus on QFMA disclosure requirements

---

## 6. Implementation Specifications

### 6.1 Core Functions

```typescript
// Main entry point
function generateEnhancedSustainabilityReport(
    input: GenerateReportInput
): SustainabilityReport

// Section generators
function generateExecutiveSummary(
    assessment: AssessmentResult,
    companyName: string,
    jurisdiction: 'uae' | 'ksa' | 'qatar',
    industryContext?: IndustryContext
): EnhancedReportSection

function generateRegulatoryLandscape(
    jurisdiction: 'uae' | 'ksa' | 'qatar',
    industry: string
): EnhancedReportSection

function generatePillarAnalysis(
    disclosure: DisclosureOutput,
    assessment: AssessmentResult,
    industry: string
): EnhancedReportSection[]

function generateEvidenceRegister(
    disclosure: DisclosureOutput,
    metrics: MetricData[]
): EnhancedReportSection

function generateActionPlan(
    assessment: AssessmentResult,
    jurisdiction: 'uae' | 'ksa' | 'qatar'
): EnhancedReportSection

function generateBenchmarking(
    assessment: AssessmentResult,
    industry: string
): EnhancedReportSection

function generateAppendices(
    methodology: string,
    jurisdiction: 'uae' | 'ksa' | 'qatar'
): EnhancedReportSection
```

### 6.2 Industry Template System

```typescript
interface IndustryTemplate {
    sector: string;
    subsectors: string[];
    materialityTopics: string[];
    keyMetrics: string[];
    regulatoryContext: string[];
    narrativeFocus: string[];
    benchmarkData: BenchmarkData[];
}

const industryTemplates: Record<string, IndustryTemplate> = {
    manufacturing: { ... },
    retail: { ... },
    financial_services: { ... },
    energy: { ... },
    real_estate: { ... },
    healthcare: { ... },
    professional_services: { ... }
};
```

### 6.3 Jurisdiction Context System

```typescript
interface JurisdictionContext {
    code: 'uae' | 'ksa' | 'qatar';
    name: string;
    regulatoryBody: string;
    keyRegulations: Regulation[];
    strategicVision: string;
    netZeroTarget: string;
    mandatoryDeadline?: string;
    contentMarkers: string[];
    toneGuidance: string;
}

const jurisdictionContexts: Record<string, JurisdictionContext> = {
    uae: { ... },
    ksa: { ... },
    qatar: { ... }
};
```

---

## 7. Quality Assurance Criteria

### 7.1 Content Quality
- [ ] 50-65 pages generated
- [ ] All 7 major sections present
- [ ] Jurisdiction-specific content markers included
- [ ] Industry-specific metrics and context
- [ ] Data-driven narratives (not generic)
- [ ] Actionable recommendations with timelines
- [ ] Professional/consulting-grade tone

### 7.2 Regulatory Accuracy
- [ ] ADX Rules correctly referenced (UAE)
- [ ] Tadawul Guidelines correctly referenced (KSA)
- [ ] QSE/QFMA rules correctly referenced (Qatar)
- [ ] GCC ESG Metrics referenced
- [ ] Climate Law requirements included (UAE)
- [ ] Vision 2030 alignment (KSA)
- [ ] National Vision 2030 alignment (Qatar)

### 7.3 Technical Requirements
- [ ] TypeScript compilation successful
- [ ] All imports resolved
- [ ] PDF generation successful
- [ ] Page count validation
- [ ] Content coverage validation
- [ ] Stripe payment flow integration

---

## 8. Success Metrics

### 8.1 Report Generation
- 50+ pages per report
- < 10 seconds generation time
- 100% section coverage
- 0% broken content references

### 8.2 Content Quality
- Jurisdiction-specific content: 100% match
- Industry-specific content: 100% match
- Regulatory accuracy: >95% (SME validated)
- Narrative quality: Consulting-grade

### 8.3 User Experience
- PDF export successful
- Print-friendly formatting
- Professional visual design
- Clear action items

---

## 9. Appendix: Regulatory Citations

### UAE Sources
1. ADX ESG Disclosure Guidance for Listed Companies (June 2025)
2. Federal Decree-Law No. 11 of 2024 (UAE Climate Law)
3. Cabinet Resolution No. 67 (2024)
4. Dubai Clean Energy Strategy 2050
5. ADX Sustainability Framework

### KSA Sources
1. Tadawul ESG Disclosure Guidelines (2021)
2. Saudi Vision 2030
3. Saudi Green Initiative (2021)
4. CMA Market Conduct Regulations
5. National Standards for Sustainability

### Qatar Sources
1. QSE ESG Guidance Template
2. QFMA Corporate Governance Code 2025
3. Qatar National Vision 2030
4. QFMA Rules and Regulations

### GCC Sources
1. GCC Exchanges Committee Unified ESG Metrics (January 2023)
2. World Federation of Exchanges (WFE) ESG Guidance
3. Sustainable Stock Exchanges Initiative Framework

---

**END OF PRD**
