# Mawashi — Positioning Strategy (Mobile-first livestock marketplace)

## 1) Recommendation (model choice)
**Recommended model: Hybrid marketplace**
- **On-ramp:** Haraj-style classifieds for fast supply acquisition (easy posting, chat/negotiation).
- **Upgrade path:** optional **verified, higher-trust transaction flow** (structured data, verification, deposits/escrow, logistics support) for high-value or professional trades.

### Why not pure classifieds?
- You will be “Haraj-but-smaller” unless you differentiate on trust + workflow.

### Why not pure auction?
- Auctions require stronger verification and dispute handling from day 1.
- Many livestock purchases are relationship/negotiation-driven and local.

### Why hybrid fits livestock best
Livestock trading combines:
- high variance in quality/lineage/health (needs verification)
- logistics and handling complexity (needs coordination)
- negotiation culture (needs chat + offers)
- seasonality spikes (needs scheduling + deposits)

Also, KSA is explicitly moving toward digitized identity/records (e.g., camel passport with microchip + vaccination records). Source: https://www.aa.com.tr/en/middle-east/saudi-arabia-launches-camel-passport-project-to-regulate-sector/3820215

---

## 2) ICP (Ideal Customer Profile) — who to target first
### 2.1 ICP #1 (Primary): Professional traders & farms selling sheep/goats at scale
**Sellers:**
- Small-to-mid farms and traders with repeat inventory (incl. “small-scale farmers” often defined in government support context as 50–250 head). Source context: https://saudipedia.com/en/livestock-in-saudi-arabia

**Buyers:**
- Retail butchers / local buyers preparing for seasonal demand
- Traders sourcing for resale

**Why ICP #1 first:**
- High listing volume → liquidity
- Strong need for transport coordination
- Repeat usage → willingness to pay for boosts + subscriptions

**Key pain points:**
- Time-wasting inquiries, no-shows
- Difficulty proving quality and negotiating fairly
- Transport coordination

**Willingness to pay:**
- Ad boosts/promotions
- Subscription for “storefront” / inventory management
- Commission on verified/deposit-enabled deals (only if trust value is clear)

### 2.2 ICP #2 (Premium): High-value camel and horse sellers/buyers
**Why later:** lower volume, higher trust and verification requirements.

**Wedge:** integrate evidence and identity:
- Camel passport details (microchip, vaccination table) as a **verification badge**.
- For horses: pedigree/registry and vet check workflows.

---

## 3) Competitive positioning vs Haraj and niche apps
### 3.1 Positioning statement
**“Mawashi is the trusted mobile marketplace for livestock in Saudi—classifieds speed with optional verification, serious-buyer tools, and transport coordination.”**

### 3.2 What you do that Haraj doesn’t (explicitly)
- Structured listing data (breed/age/count/weight)
- Verification tiers (seller identity + optional vet/ID evidence)
- Serious buyer tools (deposit/reservation, offers, scheduling)
- Transport quotes and vetted carriers
- Compliance-forward UX (animal welfare flags; documentation attachments)

---

## 4) Mobile-first feature priorities (Phase 1 → Phase 2)
### Phase 1 (MVP that can beat “WhatsApp + Haraj” on workflow)
1. **Fast listing creation**
   - photo-first
   - category: sheep/goats/camels/horses
   - structured fields (breed, age, sex, count, location)
2. **Chat + Offers (in-app)**
   - preset quick messages (price? location? transport?)
   - offers with expiry
3. **Seller verification (tiered)**
   - phone + national ID/CR verification (badge)
   - seller type tags: individual / trader / farm
4. **Transport request / quote**
   - “Need transport?” toggle
   - capture pickup/dropoff, animal count, preferred time window

### Phase 2 (Trust layer: where monetization becomes defensible)
5. **Deposits / reservation** (optional)
   - reduces no-shows, supports seasonal peaks
6. **Escrow / delivery confirmation** (for high-value deals)
7. **Verification add-ons**
   - camel passport/microchip attachment
   - vet-check partner network
8. **Seller storefront + inventory tools**
   - bulk upload, repeat listing templates

---

## 5) Design considerations (trust, payments, verification)
### 5.1 Trust signals
- Verified seller badge and “verified documents attached” badge
- Display seller history: completed deals, ratings (careful with defamation)
- Clear safety guidance and prohibited practices (aligning with MEWA animal welfare enforcement). Source: https://www.mewa.gov.sa/en/MediaCenter/News/Pages/News-23-7-2018.aspx

### 5.2 Payment clarity
- In listings, clearly indicate:
  - “Cash/transfer on pickup” vs “deposit supported” vs “escrow supported”
- If you charge fees/commissions, show VAT-inclusive pricing and generate invoices appropriately (ZATCA VAT guidance exists). Source: https://zatca.gov.sa/en/RulesRegulations/VAT/Pages/default.aspx

### 5.3 Livestock verification UX
- Camel flow: upload passport fields (microchip number, photos) + vaccination table photo
- Sheep/goats: optional vet report upload; weight fields (if available)

---

## 6) Monetization (aligned with positioning)
Start with low-friction revenue, then expand:
1. **Promoted listings / boosts** (works even for classifieds)
2. **Subscriptions** for professional sellers (storefront + analytics + bulk tools)
3. **Transaction fees** only on verified deposit/escrow deals (charge for trust)
4. **Logistics lead fees** (carriers pay per lead or subscription)

---

## Appendix — evidence used in positioning
- Haraj Animals/Livestock section (categories + region counts + listing structure): https://haraj.com.sa/en/tags/مواشي%20وحيوانات%20وطيور/
- Camel passport contents and rationale: https://www.aa.com.tr/en/middle-east/saudi-arabia-launches-camel-passport-project-to-regulate-sector/3820215
- MEWA animal welfare prohibition examples: https://www.mewa.gov.sa/en/MediaCenter/News/Pages/News-23-7-2018.aspx
- ZATCA VAT overview: https://zatca.gov.sa/en/RulesRegulations/VAT/Pages/default.aspx
- Market supply proxies (sheep/goat heads; camels): https://saudipedia.com/ما-حجم-إنتاج-السعودية-من-الأغنام؟ and https://saudipedia.com/en/livestock-in-saudi-arabia
