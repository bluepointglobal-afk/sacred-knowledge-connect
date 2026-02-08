# Mawashi — Phase 1 Market Analysis (Saudi Livestock Marketplace)
*Scope: Saudi Arabia (KSA). Categories: camels, horses, sheep, goats. Focus: mobile-first marketplace positioning.*

## 1) Executive summary
Saudi livestock trading is already highly digital via large horizontal classifieds (especially Haraj) and a long tail of niche apps. The market’s core needs are **trust, verification, logistics coordination, and pricing clarity**—areas where Haraj-style classifieds are intentionally light.

**Main insight:** A **mobile-first hybrid marketplace** (classifieds + optional verified/escrow flow + logistics + vet/ID verification) is best positioned to win vs. pure classifieds or pure auctions.

---

## 2) How Haraj positions livestock trading (what “good enough” looks like)
Haraj is the dominant pattern in KSA for peer-to-peer selling across categories, including animals/livestock.

### 2.1 Category structure & discovery
Haraj’s Livestock/Animals section is structured primarily as **classified browsing**:
- Top navigation includes **“Livestock and Animals”**.
- Quick navigation by animal type: **sheep, goats, camels, horses, cows, etc.** (e.g., sheep/غنم, goats/ماعز, camels/أبل, horses/خيل). (Observed on Haraj animals section UI.)
- Listings are discoverable by **city/region**, with visible post counts by region (e.g., “Livestock and Animals in Riyadh …”, “in Jeddah …”, etc.). (Observed on Haraj animals section UI.)

### 2.2 Listing format (Haraj-style classifieds)
Listings are simple and optimized for volume:
- Title, photo thumbnail, city, seller profile link.
- Communication is essentially **direct contact / negotiation**.

### 2.3 Trust & governance signals
Haraj includes platform-level trust and compliance components (not livestock-specific):
- **Safety Center**, **Prohibited Items**, Terms/Privacy, and account/number checks are part of the footer navigation.
- Haraj displays corporate identity and VAT details (e.g., VAT certificate link is shown in footer). (Observed on Haraj animals section UI.)

### 2.4 Implications for Mawashi
Haraj “wins” on:
- **Liquidity** (massive traffic)
- **Low friction** (post fast, negotiate via chat/call)
- **Breadth** (everything for sale)

Haraj is weak (by design) on:
- Verification of animal health/identity/lineage
- Standardization of listing data
- Escrow, delivery, and post-sale dispute workflows
- Professional seller tooling (inventory, repeat sales, compliance documents)

---

## 3) Competitor models in KSA/GCC (auction vs classifieds vs direct sales)
Below are representative models relevant to Mawashi.

### 3.1 Classifieds (horizontal or vertical)
**Pattern:** user posts listing, negotiates, closes off-platform.
- **Haraj** (horizontal classifieds) is the reference pattern for KSA.
- **Almawashisouq (iOS)** explicitly states it is **“a classified advertising platform”** for livestock and related supplies/services; users post ads, browse by location/category, and chat directly. It emphasizes “trust” and “transparency” but remains classifieds-first. Source: Apple App Store description. https://apps.apple.com/us/app/almawashisouq/id6748773817

**Strengths:** scale, simple UX, minimal compliance burden.
**Weaknesses:** fraud risk, low data quality, no real transaction layer.

### 3.2 Direct sales / “order & deliver” (managed supply)
**Pattern:** operator sources animals, offers ordering, sometimes slaughter + delivery, payment plans.
- **مواشينا (Mawashina)** positions itself as ordering carcasses/livestock with **multiple payment methods**, **delivery**, and even **buy-now-pay-later installments** (“pay later … installments and without interest”). Source: Google Play listing text. https://play.google.com/store/apps/details?id=com.mawashena.client

**Strengths:** high trust, consistent quality, controlled logistics.
**Weaknesses:** capital intensive, limited selection, inventory risk.

### 3.3 Auction / bidding-led marketplaces
**Pattern:** real-time or time-boxed bidding (English/Dutch). Often used where price discovery matters and inventory is standardized/verified.
- Some local apps mention “electronic payment” and facilitation; **حراج سهم (Haraj Saham)** claims it facilitates buying/selling livestock and includes electronic payment + photo/video. Source: Google Play listing text. https://play.google.com/store/apps/details?id=com.harajsahm

**Strengths:** price discovery, speed for sellers, excitement.
**Weaknesses:** requires strong verification + dispute handling; harder UX; may not fit all segments.

---

## 4) Key gaps (friction points) in today’s livestock trading experience
These gaps are consistent with what classifieds usually fail to solve, and what regulated live-animal trading increasingly requires.

### 4.1 Trust & fraud
- Misrepresentation of breed/age/condition (especially when listings are unstructured).
- “Dealer vs individual” opacity.
- Payment risk and non-serious buyers.

### 4.2 Verification & documentation
- Buyers want proof: vaccinations, vet checks, lineage/registry (esp. horses, high-value camels).
- Government direction is toward **digital identity + records** (see camel passport project).

### 4.3 Logistics coordination
- Transport availability, cost uncertainty, and handling requirements.
- Matching buyers/sellers with trustworthy transporters.

### 4.4 Price discovery and comparables
- With negotiation-based classifieds, buyers lack price benchmarks.
- Sellers struggle to justify premium animals (lineage/health) without standardized evidence.

### 4.5 Seasonal demand spikes create operational stress
- Eid al-Adha and Ramadan create demand surges for sheep/goats and related services.
- Buyers want fast booking + delivery windows, while supply and transport capacity tighten.

---

## 5) Market size & dynamics (what we can credibly cite)
### 5.1 Herd/heads (proxy for supply base)
- **Sheep + goats (KSA, Sept 2021):** 28,463,878 heads total; sheep 21,724,724; goats 6,739,154. Source: Saudipedia (Arabic). https://saudipedia.com/ما-حجم-إنتاج-السعودية-من-الأغنام؟
- **Camels (KSA, 2022):** ~1.8 million camels; ownership ~80,000 people. Source: Saudipedia (English). https://saudipedia.com/en/livestock-in-saudi-arabia

### 5.2 Seasonality (demand patterns)
- Saudipedia notes **Eid al-Adha** drives “a significant increase” in buying/selling sacrificial animals in livestock markets. Source: Saudipedia (English). https://saudipedia.com/en/livestock-in-saudi-arabia
- Camel fattening seasons: Saudipedia notes spring/fall as best seasons for fattening due to grazing quality. (Operational implication for supply readiness.) Source: Saudipedia (English). https://saudipedia.com/en/livestock-in-saudi-arabia

### 5.3 Segments (who trades)
- **Small-scale livestock farmers**: Saudipedia notes classification of small-scale farmers as those with **50–250 head** (context: support programs). Source: Saudipedia (English). https://saudipedia.com/en/livestock-in-saudi-arabia

**Interpretation for Mawashi:**
- The supply base is large and geographically distributed.
- The market is not just “hobby animals”—it includes professional farming/trading.
- Seasonality suggests a need for surge capacity features (inventory availability, delivery scheduling, deposits).

---

## 6) Vision 2030 alignment opportunities (market tailwinds)
Vision 2030 pushes digitization, productivity, and formalization across sectors.

### 6.1 Digitization of livestock identity & records
- **Camel passport project (Feb 2026)**: MEWA launched an official camel passport containing microchip number, breed, ownership data, and a vaccination table certified by a veterinarian. This directly supports a marketplace’s ability to offer **verified listings** and safe transfers.
  - Source: Anadolu Agency summary quoting MEWA statement. https://www.aa.com.tr/en/middle-east/saudi-arabia-launches-camel-passport-project-to-regulate-sector/3820215

### 6.2 Formal regulation and animal welfare enforcement
- MEWA explicitly enforces GCC Animal Welfare Law and prohibits animal cruelty practices (including cosmetic fillers/Botox on camels, growth stimulants for racing, etc.). This creates demand for marketplaces that can show **compliance signals**.
  - Source: MEWA news page (2018). https://www.mewa.gov.sa/en/MediaCenter/News/Pages/News-23-7-2018.aspx

### 6.3 Government e-services as integration surfaces
- MEWA provides mobile app access to ministry services (inquiries, applications, citizen voice). This signals that users are already acclimated to **government digital workflows**.
  - Source: MEWA Mobile Applications page. https://www.mewa.gov.sa/en/HowWeCanHelp/Help/MobileApps/Pages/default.aspx

---

## 7) What this means for Mawashi (Phase 1 product direction)
If Mawashi launches as “another Haraj for livestock,” it competes on traffic alone.

A stronger wedge is to become the **trusted transaction & verification layer** for high-value livestock and professional sellers while still keeping a low-friction classifieds on-ramp.

**Early differentiators (high impact):**
- Structured listings (breed, age, count, weight, location, transport readiness)
- Verification tiers (ID, phone, seller type; optional vet-check, microchip/passport for camels)
- Buyer seriousness (deposit/reservation options)
- Transport marketplace/quotes
- Price guidance and comparables

---

## Appendix — Sources used
- Haraj animals/livestock section UI (observed via browser snapshot): https://haraj.com.sa/en/tags/مواشي%20وحيوانات%20وطيور/
- Saudipedia — livestock overview: https://saudipedia.com/en/livestock-in-saudi-arabia
- Saudipedia (Arabic) — sheep/goat heads: https://saudipedia.com/ما-حجم-إنتاج-السعودية-من-الأغنام؟
- MEWA — General Directorate of Animal Production responsibilities (regulation, registration/numbering, movement control): https://www.mewa.gov.sa/en/Ministry/Agencies/AgencyLivestock/Departments/Pages/General%20Directorate%20of%20Animal%20Production.aspx
- MEWA — animal cruelty practices prohibited: https://www.mewa.gov.sa/en/MediaCenter/News/Pages/News-23-7-2018.aspx
- Camel passport project: https://www.aa.com.tr/en/middle-east/saudi-arabia-launches-camel-passport-project-to-regulate-sector/3820215
- Almawashisouq (classifieds): https://apps.apple.com/us/app/almawashisouq/id6748773817
- Mawashina (direct ordering + payment plans): https://play.google.com/store/apps/details?id=com.mawashena.client
- Haraj Saham (mentions e-payment + transport facilitation): https://play.google.com/store/apps/details?id=com.harajsahm
