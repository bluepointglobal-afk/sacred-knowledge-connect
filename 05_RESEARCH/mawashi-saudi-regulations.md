# Saudi Arabia Livestock Marketplace Regulatory Requirements
## Mawashi Platform Compliance Research Report

**Report Date:** February 7, 2026  
**Prepared For:** Mawashi Livestock Marketplace  
**Target Market:** Kingdom of Saudi Arabia  
**Scope:** Camels, Sheep, Cattle Trading Platform

---

## Executive Summary

This report outlines the comprehensive regulatory framework governing the launch and operation of an online livestock marketplace in Saudi Arabia. The Mawashi platform must navigate multiple regulatory authorities including MEWA (Ministry of Environment, Water and Agriculture), SAMA (Saudi Arabian Monetary Authority), MCI (Ministry of Commerce and Investment), ZATCA (Zakat, Tax and Customs Authority), and SFDA (Saudi Food and Drug Authority).

**Key Findings:**
- No specific regulations currently exist for *online* livestock marketplaces; compliance defaults to general e-commerce and agricultural trading laws
- Multiple licenses required across different authorities
- Strong emphasis on animal welfare, traceability, and halal compliance
- Vision 2030 digital transformation initiatives create favorable environment
- Estimated compliance timeline: 6-12 months from initial application

---

## 1. MEWA (Ministry of Environment, Water and Agriculture) Livestock Trading Regulations

### 1.1 Current Regulatory Landscape

**Key Regulation:** MEWA standardized livestock sales rules (effective June 2023) apply to physical markets but establish foundational requirements that extend to online platforms.

**Official Source:** [MEWA Rules Library](https://www.mewa.gov.sa/en/InformationCenter/DocsCenter/RulesLibrary/Pages/default.aspx)

### 1.2 Core Trading Requirements

| Requirement | Description | Applicability to Online Platform |
|-------------|-------------|----------------------------------|
| **Weight-Based Sales** | Sales must be by weight using approved, calibrated scales | Platform must integrate certified weighing verification |
| **Transparency** | Weighing must be visible to all parties | Platform must provide weight documentation/proof |
| **Transaction Logging** | Record date, animal type, weight for all sales | Platform must maintain comprehensive transaction records |
| **Fraud Prohibition** | Scale tampering and misleading practices banned | Platform terms must prohibit fraudulent listings |
| **Animal Welfare** | Safe conditions to prevent stress/disease | Sellers must certify humane handling standards |

### 1.3 Agriculture License Requirements

For livestock trading activities, Mawashi requires an **Agriculture License** (specifically Livestock Trading/Breeding category) from MEWA.

**Prerequisites:**
- Commercial Registration (CR) from Ministry of Commerce
- Proof of land ownership or lease agreement (Ejar contract acceptable)
- Detailed business plan/feasibility study
- Environmental Impact Assessment (EIA)
- Proof of financial stability (minimum SAR 25,000 capital for foreign entities)
- Compliance with animal welfare and sustainability standards

**Application Process:**
1. Reserve commercial name via MCI
2. Obtain Commercial Registration
3. Prepare EIA and business documentation
4. Submit application to MEWA
5. Undergo facility inspection (if applicable)
6. Receive license (processing time: 4-12 weeks)

**Foreign Ownership:** Up to 100% foreign ownership permitted for agricultural activities.

### 1.4 Official Documentation Sources

- MEWA Rules Library: https://www.mewa.gov.sa/en/InformationCenter/DocsCenter/RulesLibrary/Pages/default.aspx
- Saudi Regulations (Bureau of Experts): https://laws.boe.gov.sa/BoeLaws/Laws/Folders/2
- Implementing Regulations of Agriculture Law: Available via MEWA Rules Library

---

## 2. Required Licenses and Permits for Online Livestock Marketplace

### 2.1 Core License Matrix

| License/Permit | Issuing Authority | Purpose | Timeline | Estimated Cost |
|----------------|-------------------|---------|----------|----------------|
| **Commercial Registration (CR)** | Ministry of Commerce (MCI) | Legal business entity | 1-2 weeks | SAR 1,200-5,000 |
| **Agriculture License** | MEWA | Livestock trading authorization | 4-12 weeks | Variable by activity |
| **E-Commerce Activity** | MCI | Online trading authorization | Included with CR | - |
| **Payment Service Provider** | SAMA | Payment processing (if handling funds) | 6-12 months | High (capital requirements) |
| **VAT Registration** | ZATCA | Tax compliance | 10-14 days | Free |
| **Data Controller Registration** | SDAIA | PDPL compliance (if applicable) | TBD | TBD |

### 2.2 Commercial Registration (CR) Requirements

**Platform:** business.sa (Ministry of Commerce portal)

**Required Information:**
- Company name (reserved via MCI)
- Business activity code (select appropriate codes for livestock trading + e-commerce)
- Shareholder details
- Capital declaration
- National address

**Key Activity Codes to Include:**
- Livestock trading/breeding
- E-commerce activities
- Platform/marketplace operations
- Technology services

### 2.3 Alternative: Partner with Licensed Payment Provider

Rather than obtaining a full SAMA PSP license, Mawashi can:
- Partner with existing licensed payment gateway (e.g., STC Pay, Urway, HyperPay)
- Use escrow services from licensed banks
- Implement "payment facilitator" model with reduced regulatory burden

### 2.4 Maroof Platform Considerations

**Important:** The previous Maroof registration requirement for e-commerce has been replaced by mandatory Commercial Registration through MCI's Business Platform.

---

## 3. Animal Health Certification Requirements

### 3.1 Health Certificate Framework

For livestock transactions facilitated through the platform, sellers must provide:

| Certificate Type | Issuing Authority | Validity | Requirements |
|------------------|-------------------|----------|--------------|
| **Veterinary Health Certificate** | Licensed veterinarian | 7-14 days | Disease-free attestation, vaccination records |
| **Animal Identification** | MEWA-approved system | Animal lifetime | RFID tag or approved identification method |
| **Movement Permit** | MEWA (for inter-region) | Per transport | Fitness to travel, destination approval |
| **Import/Export Certificate** | MEWA General Department of Animal Quarantine | Per shipment | For cross-border transactions |

### 3.2 Veterinary Health Certificate Components

Per MEWA and international standards (WOAH Terrestrial Code alignment):

1. **Exporter/Seller Information**
   - Name, address, identification
   - Farm/establishment registration number

2. **Animal Identification**
   - Species, breed, age, sex
   - RFID tag numbers or other approved identifiers
   - Individual animal photos (recommended for high-value)

3. **Health Attestations**
   - Free from clinical signs of infectious disease
   - Vaccinated per MEWA specifications
   - Treated for parasites within 30 days
   - No feeding of prohibited animal proteins

4. **Veterinary Inspection**
   - Inspection within 24 hours of transport
   - Fitness to travel certification
   - Veterinarian license number and signature

### 3.3 Vaccination Requirements

Standard vaccinations required for marketplace eligibility:
- Foot and Mouth Disease (FMD)
- Peste des Petits Ruminants (PPR) - for sheep/goats
- Brucellosis (where applicable)
- Other region-specific requirements per MEWA directives

### 3.4 Traceability and RFID Systems

**SMART FLOCK SAUDI Initiative:**
- MEWA-aligned traceability system
- Options include: biometric identification, live RFID ear tags, barcode-based plastic tags
- Real-time tracking capabilities for temperature and location

**Platform Integration Requirements:**
- Verify and record animal identification numbers
- Link RFID data to transaction records
- Maintain traceability chain from farm to buyer

---

## 4. Payment and Transaction Regulations (SAMA)

### 4.1 SAMA Regulatory Framework

**Primary Legislation:**
- Payment Services Provider Regulations (PSPR)
- Implementing Regulations of the Law of Payments and Payment Services
- SAMA Regulatory Sandbox (for innovative solutions)

### 4.2 Licensing Options

| Option | Requirements | Capital | Timeline | Best For |
|--------|--------------|---------|----------|----------|
| **Full PSP License** | Full SAMA authorization | SAR 5M+ | 12+ months | Handling customer funds directly |
| **Partnership Model** | Use licensed provider | None | 1-2 months | Marketplace without payment risk |
| **Regulatory Sandbox** | Testing with relaxed rules | Variable | 6-12 months | Innovative payment features |
| **Micro PI License** | Limited payment services | Lower threshold | 6-9 months | Small-scale operations |

### 4.3 PSP License Application Process

**Stage 1: In-Principle Approval**
1. Submit SAMA application form to LICPayments@SAMA.GOV.SA
2. Provide board resolution and authorized signatory documentation
3. Submit feasibility study and business model
4. Provide CVs and background checks for key personnel
5. Submit irrevocable bank guarantee (20% of minimum capital)
6. SAMA review period (typically 60-90 days)

**Stage 2: Final Licensing**
1. Complete MCI registration
2. Deposit minimum capital
3. Implement operational infrastructure
4. Pass SAMA final inspection

### 4.4 Key SAMA Compliance Requirements

- **AML/KYC:** Identity verification, transaction monitoring, suspicious activity reporting
- **Cybersecurity:** Data encryption, multi-factor authentication, incident response
- **Capital Requirements:** Maintain minimum paid-up capital
- **Governance:** Qualified board members, compliance officer appointment
- **Operational Standards:** Service availability, dispute resolution mechanisms

### 4.5 Recommended Approach for Mawashi

**Phase 1:** Partner with licensed payment gateway (e.g., STC Pay, Urway, Moyasar)
- Faster time-to-market
- Reduced regulatory burden
- Shared compliance responsibility

**Phase 2:** Pursue SAMA Regulatory Sandbox for innovative livestock-specific payment features
- Test escrow for livestock transactions
- Develop seller verification linked to MEWA licenses

**Phase 3:** Consider full PSP license if payment services become core business

---

## 5. Data Privacy and PDPL Compliance

### 5.1 PDPL Overview

**Effective Date:** September 14, 2023  
**Full Enforcement:** September 14, 2024  
**Regulator:** Saudi Data and AI Authority (SDAIA)

### 5.2 Applicability to Mawashi

As a digital marketplace processing Saudi resident data, Mawashi qualifies as a **Data Controller** (determines purposes of processing) and potentially **Data Processor** (if processing on behalf of sellers).

### 5.3 Core PDPL Requirements

| Requirement | Implementation | Timeline |
|-------------|----------------|----------|
| **Consent Management** | Clear, informed, withdrawable consent for data processing | Before launch |
| **Data Minimization** | Collect only necessary data for marketplace operations | Ongoing |
| **Purpose Limitation** | Use data only for specified, legitimate purposes | Ongoing |
| **Transparency** | Privacy policy, user notifications, data subject rights | Before launch |
| **Security Safeguards** | Encryption, access controls, breach detection | Before launch |
| **Breach Notification** | Report to SDAIA within 72 hours | Within 72h of discovery |
| **Record-Keeping** | Maintain processing records for processing period + 5 years | Ongoing |
| **DPO Appointment** | Designate Data Protection Officer (if required) | As needed |

### 5.4 Data Subject Rights

Platform must enable users to:
- Access their personal data
- Correct inaccurate data
- Request deletion (where applicable)
- Withdraw consent
- Receive data in portable format

### 5.5 Registration Requirements

Controllers must register with SDAIA National Register if:
- Public entity
- Processing sensitive personal data
- Transferring data abroad
- Processing data of vulnerable groups (minors)

**Likely applicable to Mawashi due to:**
- Payment data processing (sensitive)
- Potential international data transfers (cloud infrastructure)

### 5.6 Cross-Border Data Transfers

If using international cloud services:
- Ensure recipient country has "adequate protection" (per SDAIA list)
- OR obtain explicit user consent
- OR establish legal justification
- Review contracts with cloud providers for PDPL compliance

### 5.7 Penalties for Non-Compliance

| Violation Type | Penalty |
|----------------|---------|
| General breaches | Up to SAR 5 million per violation |
| Repeat violations | Double penalties |
| Intentional disclosure of sensitive data | Up to 2 years imprisonment + SAR 3 million fine |
| Executive/DPO liability | Personal liability for violations |

---

## 6. Halal Slaughter Compliance

### 6.1 Regulatory Framework

**Authority:** Saudi Food and Drug Authority (SFDA) - Saudi Halal Center  
**Key Standard:** GSO 2055-2 (GCC Halal Food Standard)

### 6.2 Applicability to Mawashi

Halal certification requirements apply if:
- Platform facilitates sale of slaughtered meat products
- Animals are sold for slaughter (abattoir-bound transactions)
- Export to GCC or other Muslim-majority markets

### 6.3 Halal Certification Requirements

**For Slaughter Facilities:**
- SFDA-recognized halal certification body
- Muslim slaughtermen certification
- Proper slaughter method (single throat cut with tasmiyah)
- Full bleeding verification
- Non-lethal stunning (if used) must not kill animal
- Hygiene to prevent cross-contamination
- Traceability from slaughter to shipment

**For Platform:**
- Verify seller halal certification (if selling processed products)
- Display halal certification status on listings
- Maintain certification documentation

### 6.4 Documentation Requirements

- Halal manufacturer certificate (facility-level)
- Halal shipment certificate (per shipment)
- Production/expiration dates
- Storage temperature records
- Origin certificates

### 6.5 Platform Recommendations

**Option 1:** Partner only with SFDA-certified slaughterhouses
**Option 2:** Verify and display halal certification status for each seller
**Option 3:** Focus on live animal trading (certification responsibility transfers to buyer)

---

## 7. Cross-Region Transport Regulations Within KSA

### 7.1 Regulatory Framework

**Primary Authority:** MEWA - General Department of Animal Quarantine  
**Governing Standards:**
- WOAH Terrestrial Animal Health Code
- GCC Veterinary Quarantine Law
- Saudi Agriculture Law Implementing Regulations

### 7.2 Transport Requirements

### 7.2.1 Fitness to Travel Assessment

Animals must be assessed by licensed veterinarian before transport:
- Free from infectious diseases
- Physically capable of enduring journey
- Not in late pregnancy (for females)
- Not neonates without mother

### 7.2.2 Vehicle and Container Standards

| Requirement | Specification |
|-------------|---------------|
| **Space Allocation** | 70-80% of vehicle capacity maximum |
| **Ventilation** | Adequate airflow for animal type and climate |
| **Flooring** | Non-slip, absorbent bedding |
| **Feed/Water** | Provision for journeys over 8 hours |
| **Separation** | Compatible animals grouped; aggressive animals isolated |
| **Climate Control** | Protection from extreme temperatures |

### 7.2.3 Journey Documentation

Required records for inter-region transport:
- Veterinary health certificate (fitness to travel)
- Animal identification list (RFID/ear tag numbers)
- Journey log (origin, destination, duration, rest stops)
- Driver/transporter certification
- Vehicle registration and approval

### 7.3 Permit Requirements

**Domestic Inter-Regional Movement:**
- No specific "permit" required for routine transport within KSA
- Veterinary health certificate serves as authorization
- MEWA inspectors may verify compliance at checkpoints

**Quarantine Requirements:**
- Some regions may require post-transport quarantine
- Check MEWA regional directives for specific requirements

### 7.4 Platform Responsibilities

Mawashi should:
- Verify seller transport compliance documentation
- Provide transport guidelines to sellers
- Partner with licensed livestock transport providers
- Enable tracking/verification of animal movement
- Maintain transport records for traceability

---

## 8. Vision 2030 Alignment and Digital Marketplace Initiatives

### 8.1 Strategic Context

Saudi Arabia's Vision 2030 emphasizes digital transformation across all sectors, including agriculture and food security. Key relevant initiatives:

**E-Commerce Growth:**
- Market valued at $5.15 billion (2023), projected $23.46 billion (2027)
- Target: 70% cashless transactions by 2030
- 99% internet penetration achieved

**Agricultural Technology:**
- MEWA Innovation Platform for agritech solutions
- Saudi AgriFood Tech Alliance
- $5M CGIAR partnership for digital irrigation and water management

### 8.2 Opportunities for Mawashi

1. **Food Security Priority:** Livestock marketplace aligns with Vision 2030 food security goals
2. **Digital Infrastructure:** Strong government investment supports platform scalability
3. **MSME Enablement:** Government programs support small livestock traders
4. **Traceability Mandates:** Vision 2030 sustainability goals favor digital tracking solutions

### 8.3 Regulatory Support

While no specific "livestock marketplace" regulations exist, the regulatory environment is:
- Generally supportive of digital transformation
- Moving toward standardized traceability
- Emphasizing food safety and transparency

---

## 9. Compliance Checklist for Marketplace Launch

### Phase 1: Foundation (Months 1-2)

- [ ] Reserve company name via MCI
- [ ] Prepare business plan and feasibility study
- [ ] Secure initial capital funding
- [ ] Identify legal structure (LLC recommended)
- [ ] Engage legal counsel with Saudi regulatory experience
- [ ] Conduct regulatory gap analysis

### Phase 2: Licensing (Months 2-5)

- [ ] Obtain Commercial Registration (CR) from MCI
- [ ] Apply for Agriculture License from MEWA
- [ ] Register for VAT with ZATCA (if > SAR 375K projected revenue)
- [ ] Register National Address
- [ ] Open corporate bank account
- [ ] Engage payment gateway partner (if not pursuing PSP license)

### Phase 3: Compliance Infrastructure (Months 3-6)

- [ ] Develop PDPL-compliant privacy policy
- [ ] Implement consent management system
- [ ] Establish data security protocols
- [ ] Create seller verification procedures
- [ ] Develop terms of service and seller agreements
- [ ] Implement transaction logging system
- [ ] Create animal health documentation workflows

### Phase 4: Operational Readiness (Months 5-8)

- [ ] Verify seller license checking system
- [ ] Implement health certificate verification
- [ ] Establish transport documentation tracking
- [ ] Test payment processing workflows
- [ ] Conduct compliance audit
- [ ] Train staff on regulatory requirements
- [ ] Prepare regulatory inspection readiness

### Phase 5: Launch (Month 8+)

- [ ] Soft launch with limited seller base
- [ ] Monitor compliance metrics
- [ ] Iterate based on regulatory feedback
- [ ] Scale operations gradually
- [ ] Maintain ongoing compliance monitoring

---

## 10. Risk Areas and Mitigation Strategies

### 10.1 High-Risk Areas

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Regulatory Uncertainty** | High | Medium | Engage directly with MEWA for guidance; join industry associations |
| **Seller Non-Compliance** | High | High | Rigorous seller verification; compliance requirements in terms of service |
| **Animal Health Incidents** | Medium | High | Require veterinary certification; insurance requirements; traceability systems |
| **PDPL Violations** | Medium | High | Appoint DPO; conduct privacy impact assessment; implement security controls |
| **Payment Fraud** | Medium | High | Partner with licensed PSP; implement escrow; transaction monitoring |
| **Zakat/Tax Issues** | Low | Medium | Proper accounting systems; regular ZATCA compliance reviews |

### 10.2 Regulatory Gap Risk

**Issue:** No specific regulations exist for online livestock marketplaces.

**Mitigation:**
- Proactively engage with MEWA and MCI
- Position as agritech innovation under Vision 2030
- Implement best practices from physical market regulations
- Join relevant industry associations for regulatory updates
- Maintain flexibility to adapt to new regulations

### 10.3 Cross-Border Complexity

**Issue:** International livestock trade involves multiple authorities (MEWA, SFDA, Customs).

**Mitigation:**
- Initially focus on domestic KSA market
- Phase international features post-domestic establishment
- Partner with licensed import/export agents
- Understand GSO standards for GCC expansion

---

## 11. Implementation Timeline Estimate

### Conservative Timeline: 10-12 Months

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| **Planning & Setup** | 2 months | Company formation, legal structure |
| **Licensing** | 3-4 months | CR, Agriculture License, VAT registration |
| **Platform Development** | 4-6 months | Build, test, integrate compliance features |
| **Compliance Certification** | 2 months | Legal review, security audit |
| **Launch Preparation** | 1 month | Seller onboarding, soft launch |

### Aggressive Timeline: 6-8 Months

- Use established legal/consulting partners
- Parallel track licensing and development
- Leverage existing payment gateway partnerships
- Pre-negotiate seller agreements

### Factors Affecting Timeline

1. **MEWA Licensing Speed:** Variable based on application volume
2. **Payment Partner Selection:** PSP partnerships can accelerate vs. own license
3. **Development Complexity:** Traceability features add time
4. **Regulatory Engagement:** Proactive MEWA consultation may streamline

---

## 12. Key Contacts and Resources

### Regulatory Authorities

| Authority | Website | Contact |
|-----------|---------|---------|
| **MEWA** | mewa.gov.sa | Agency for Economic Affairs and Investment |
| **MCI** | mc.gov.sa | Business Platform (business.sa) |
| **SAMA** | sama.gov.sa | LICPayments@SAMA.GOV.SA |
| **ZATCA** | zatca.gov.sa | eServices portal |
| **SDAIA** | sdaia.gov.sa | PDPL compliance unit |
| **SFDA** | sfda.gov.sa | Saudi Halal Center |

### Important Documents and Links

1. MEWA Rules Library: https://www.mewa.gov.sa/en/InformationCenter/DocsCenter/RulesLibrary/Pages/default.aspx
2. Saudi Regulations (Bureau of Experts): https://laws.boe.gov.sa/BoeLaws/Laws/Folders/2
3. SAMA Payment Services Guidelines: https://www.sama.gov.sa/en-US/payment/SiteAssets/Guidelines.pdf
4. MCI Business Platform: https://business.sa
5. ZATCA VAT Portal: https://zatca.gov.sa/en/eServices/Pages/eServices_001.aspx

### Industry Resources

- Saudi AgriFood Tech Alliance (MEWA)
- Chamber of Commerce (regional)
- Saudi Business Center

---

## 13. Recommendations

### Immediate Actions (Week 1-2)

1. **Engage Legal Counsel:** Retain Saudi law firm with expertise in agricultural licensing and fintech regulations
2. **MEWA Consultation:** Schedule meeting with MEWA Agency for Economic Affairs to discuss online marketplace model
3. **MCI Registration:** Begin company formation process
4. **Market Research:** Validate demand with Saudi livestock traders

### Short-Term (Month 1-3)

1. **License Strategy:** Decide on PSP partnership vs. own license
2. **Technology Architecture:** Design for traceability and compliance from day one
3. **Seller Engagement:** Begin recruiting initial seller cohort
4. **Compliance Framework:** Develop PDPL and animal health compliance procedures

### Medium-Term (Month 3-6)

1. **Pilot Program:** Launch limited beta with verified sellers
2. **Regulatory Sandbox:** Consider SAMA sandbox application for innovative features
3. **Partnership Development:** Negotiate with logistics and veterinary service providers
4. **Industry Engagement:** Join relevant agricultural and tech associations

### Long-Term (Month 6-12)

1. **Full Launch:** Scale operations with full compliance framework
2. **Regulatory Leadership:** Position as industry leader for livestock marketplace standards
3. **GCC Expansion:** Prepare for expansion to UAE, Kuwait, Bahrain markets
4. **Innovation:** Develop proprietary traceability and payment solutions

---

## 14. Conclusion

Launching an online livestock marketplace in Saudi Arabia is feasible but requires navigating multiple regulatory frameworks. The absence of specific online livestock regulations creates both opportunity and uncertainty—opportunity to establish industry standards, uncertainty regarding exact compliance requirements.

**Key Success Factors:**
1. Proactive engagement with MEWA and other regulators
2. Robust compliance infrastructure from day one
3. Strong seller verification and quality control
4. Partnership with established payment and logistics providers
5. Alignment with Vision 2030 digital transformation goals

**Estimated Investment for Compliance:**
- Legal and licensing: SAR 100,000 - 300,000
- Technology development: SAR 500,000 - 2,000,000 (varies by scope)
- Capital requirements (if PSP license): SAR 5,000,000+
- Ongoing compliance: SAR 200,000 - 500,000 annually

The regulatory environment is generally supportive of digital innovation in agriculture, and Mawashi has the potential to become a flagship example of Vision 2030's digital transformation in the livestock sector.

---

*Report compiled from official sources including MEWA, SAMA, MCI, ZATCA, SDAIA, and SFDA. Regulations are subject to change; consult current official sources before making compliance decisions.*

**Report Version:** 1.0  
**Last Updated:** February 7, 2026
