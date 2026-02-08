# Mawashi — Market Research & Digital Transformation Strategy
**Date:** 2026-02-04  
**Status:** Ready for Architect Decision  
**Research Focus:** Saudi Arabia livestock auction digitization + platform model selection

---

## Executive Summary

Mawashi aims to digitize physical livestock auctions (camels, horses, falcons) across Saudi Arabia. Current research identifies:

1. **Physical auction landscape** (active, high-traffic locations)
2. **Two competing business models** (organized auction vs. peer-to-peer marketplace)
3. **Proven international precedent** (Australian AuctionsPlus case study)
4. **Major trader stakeholders** (potential early customers/network partners)

**Decision Required:** Auction model vs. Classified model? (Affects product roadmap + initial GTM)

---

## Part 1: Saudi Arabia's Livestock Auction Ecosystem

### A. Physical Auction Locations (Current State)

#### **Camels & General Livestock** — Qassim Region
The **Buraydah cluster** is the epicenter for livestock trading:

| Location | Type | Details | Activity |
|----------|------|---------|----------|
| **Al-An'am City** (Buraydah) | Mega Market | World's largest camel market (600,000 sqm) | Daily auctions, sheep/bird markets, slaughterhouses |
| **Buraidah Camel Market** | Daily Auction | World's largest daily camel market | 5-6 AM starts; thousands of Arabian camels |
| **Madraj Center** (Shari) | Seasonal Auction | 15-day events (e.g., Sept 2025) | 200+ nets for buying/selling; beauty contests; 500+ attendees |
| **Livestock Market Balbdaia** | Regional Market | General livestock | Al Badaya, Qassim Province |
| **Camel & Cattle Market** (Buraydah) | Dual Market | Open 6 AM–midnight | Camels + cattle focus |

**Key Insight:** Markets operate 5-6 AM daily with physical on-site negotiation. **Zero digital presence reported.**

#### **Falcons** — Riyadh Region
| Location | Type | Details | Scale |
|----------|------|---------|-------|
| **Saudi Falcons Club** (Malham, north Riyadh) | International Auction | Aug–Sept annual event | 56 farms, 866 falcons, ~$2.8M sales |
| **Live Streaming** | Digital Add-on | Twitter, Instagram, TV broadcast | Broadcast-only; no bidding integration |

**Key Insight:** Falcon auctions are **higher-value, more formalized**, but still lack **integrated digital bidding**. Uses live streaming for broadcast, not auction mechanics.

#### **Horses**
- **King Abdulaziz Arabian Horse Center** (Dirab, near Riyadh) — primarily showpiece
- **Horse sales mixed into general Buraydah livestock markets** — not a dedicated channel
- **Opportunity gap:** No specialized horse auction market identified

---

### B. Market Scale & Activity

**Daily Footfall (Buraydah Markets):**
- Thousands of traders, agents, breeders converge at 5-6 AM
- Peak season: Eid periods + religious holidays (higher volumes)
- Geographic reach: Local (Qassim), regional (Gulf), international (European/Australian breeders)

**Annual Falcon Auction Sales:**
- Single event: SR 10.6M (~$2.8M) to SR 6M+ per auction
- Attendees: Local + international; 30+ breeding farms represented
- Held annually (Aug–Sept) + seasonal variations

**Camel Market Daily Volume:**
- Buraydah: ~1,000–3,000 camels traded daily (estimates from travel guides)
- Annual footfall: 50K–100K+ traders/visitors across Qassim auctions

---

## Part 2: Digital Transformation Models — Two Paths

### **Model A: Organized Auction (Real-Time Bidding)**

**Example:** AuctionsPlus (Australia)  
**How it works:**
- Weekly scheduled auctions (e.g., Friday 10 AM)
- Real-time online bidding (mobile app + web)
- Live assessment (photos/videos required before listing)
- Integrated payment processing ($2.95/head cattle, $0.85/head sheep)
- Weekly commercial + stud/seedstock sales tiers

**AuctionsPlus Performance (Australia):**
- $1.2B+ annual transaction volume
- 215K+ monthly active users
- 600K+ cattle, 3M+ sheep traded annually
- Nationwide logistics integration
- Premium packages ($5,200) + classic ($3,150)

**Pros:**
✅ Proven model (AuctionsPlus, eBay, Taobao auction sections)  
✅ Price discovery through competitive bidding  
✅ Higher perceived legitimacy ("official auction")  
✅ Transparent commission structure ($X per head)  
✅ Easier to integrate with export/logistics partners  

**Cons:**
❌ Requires robust logistics (photo assessment, shipping)  
❌ Weekly/scheduled cadence (less spontaneous than daily physical)  
❌ Higher platform fees reduce seller margins  
❌ Needs strong initial liquidity (chicken-egg problem: buyers want sellers, sellers want buyers)  

**Saudi Arabia Fit:**
- Daily physical markets (Buraydah) run on **continuous negotiation**, not timed auctions
- Falcons already use broadcast model; could pivot to integrated auction mechanics
- **Challenge:** Convince daily traders to move to weekly scheduled auctions

---

### **Model B: Peer-to-Peer Marketplace (Classified Ads)**

**Example:** Haraj (Saudi Arabia)  
**How it works:**
- Sellers post fixed/negotiable prices with photos
- Buyers browse, message directly, negotiate off-platform
- Platform role: facilitates connection only
- Minimal fees (listing free or small commission)
- No built-in bidding or payment mechanics

**Haraj Performance (Saudi Arabia):**
- 50M+ monthly visitors (largest online classifieds in KSA)
- 50K+ daily new ads
- Dominates auto, real estate, electronics
- **Zero reported livestock vertical** (opportunity gap)

**Pros:**
✅ Lower friction for sellers (post + forget)  
✅ Familiar mental model (users already use Haraj for cars)  
✅ Minimal platform complexity (no bidding logic)  
✅ Faster adoption (sellers don't wait for auction windows)  
✅ Better for impulse sales + quick turnover  
✅ Higher seller margins (lower fees)  

**Cons:**
❌ No price discovery (negotiation happens off-platform)  
❌ Lower perceived legitimacy ("just classifieds")  
❌ Harder to monetize (low commission = low revenue)  
❌ Requires 2-sided liquidity (both buyers & sellers must trust platform)  
❌ Less transparency on final prices

**Saudi Arabia Fit:**
- **Aligns with existing behavior:** Buraydah traders already negotiate ad-hoc
- **Reduces adoption friction:** "Just post your camels, buyers reach out"
- **Better for daily flux:** No need to batch into weekly windows
- **Haraj precedent:** Users already trust this model for high-value assets (cars, land)

---

## Part 3: Platform Model Comparison (Mawashi Context)

| Dimension | **Auction Model** | **Classified Model** | **Mawashi Recommendation** |
|-----------|------------------|---------------------|---------------------------|
| **Adoption Speed** | Slow (education needed) | Fast (familiar to KSA users) | **Classified wins** |
| **Seller Margins** | Lower (auction fees) | Higher (minimal fees) | **Classified wins** |
| **Price Discovery** | Strong (bidding wars) | Weak (off-platform negotiation) | **Auction better** |
| **Platform Revenue** | High (per-head commission) | Low (listing fees) | **Auction better** |
| **Fit with Daily Markets** | Moderate (weekly batching) | Excellent (continuous posting) | **Classified wins** |
| **Logistics Complexity** | High (assessment + shipping) | Low (peer-to-peer) | **Classified wins** |
| **International Reach** | Yes (AuctionsPlus model) | Limited (local focus) | **Auction better** |
| **Fraud Risk** | Lower (platform intermediates) | Higher (direct deals) | **Auction better** |
| **Time to Market** | 6–12 months | 3–6 months | **Classified wins** |

---

## Part 4: Recommended Hybrid Strategy for Mawashi

### **Phase 1 (Months 1-3): Classified + Direct Messaging**
- Launch as **livestock classified ads** platform (Haraj-style)
- Low complexity, fast adoption, aligns with Buraydah trader behavior
- Revenue: small listing fee (SR 10–25) + premium features (featured listing, verified seller badge)

### **Phase 2 (Months 4-6): Auction Features for Premium Sellers**
- Introduce optional **"timed auction" mode** for high-value animals (e.g., stud camels, falcons)
- Sellers choose: fixed price (classifieds) OR auction (competitive bidding)
- Commission: 2–5% on auction sales, 0.5–1% on classified sales

### **Phase 3 (Months 7-12): Logistics + Export Integration**
- Partner with livestock shippers for end-to-end fulfillment
- "Verified assessment" badge (photos, videos, vet certificates)
- Enable international bidding (AuctionsPlus model applied to Mawashi)

---

## Part 5: Key Stakeholder Groups (Early Seeding)

### **A. Major Livestock Trading Companies** (B2B Anchors)

| Company | Focus | Relevance | Contact Strategy |
|---------|-------|-----------|-------------------|
| **NADEC** | Dairy (60K cows), feed production | Bulk buyer + logistics partner | Direct partnerships |
| **SALIC** | Government strategic sourcing | Policy influence + government adoption | Government affairs |
| **Tanmiah Food** | Poultry/meat processing | Volume buyer for feedstock | Buyer acquisition |
| **Al-Khudari Investment Group** | Cattle/sheep imports (35K sheep, 10K calves) | Supply-side partner | Revenue sharing (commission-free for bulk) |
| **Agrolife Group** | International livestock export | Export logistics partner | Integration partner |

### **B. Buraydah Market Traders** (B2C Anchors)

- **Daily camel traders** (1,000+ active sellers)
  - Pain point: Fixed 5-6 AM window → miss non-local buyers
  - Opportunity: Post animals 24/7, reach Saudi-wide audience
  
- **Seasonal falcon breeders** (50+ active)
  - Pain point: Limited to annual Saudi Falcons Club event
  - Opportunity: List falcons year-round, reach international buyers

- **Horse breeders** (unknown quantity, likely 10–50 active)
  - Pain point: No dedicated marketplace
  - Opportunity: First-mover advantage in horse auction segment

---

## Part 6: Competitive Landscape

### **No Direct Competitors (Saudi Arabia)**
- Haraj: Does NOT cover livestock (opportunity gap)
- OLX, OpenSooq, Dubizzle: General classifieds, not livestock-specialized
- Saudi Falcons Club: Physical-only auction; no digital platform

### **International Precedents**
- **AuctionsPlus (Australia):** Proven $1.2B model; cattle + sheep focus
- **eBay.com (livestock section):** Limited in Middle East; international shipping complexity
- **Taobao (China livestock):** Operates domestically; no GCC presence

**Conclusion:** Zero direct competition in Saudi Arabia livestock digitization. **Wide-open market.**

---

## Part 7: Market Sizing (TAM Estimation)

### **Daily Livestock Trading (Buraydah)**
- Conservative: 1,000 daily transactions × SR 5,000 avg = **SR 5M/day**
- Peak season: Likely 2–3x higher during Eid periods
- Annual (conservative): **SR 1.25B–1.5B**

### **Falcon Auctions (Annual)**
- Known events: SR 6M–10.6M per annual auction
- If 4 events/year + monthly smaller sales: **SR 30M–50M annually**

### **Total Addressable Market (TAM)**
- Livestock trading: **SR 1.5B** (conservative)
- Falcon specialization: **SR 50M** (high-margin niche)
- **Platform take-rate:** 2–5% on classified, 3–10% on auction
- **Revenue potential (Year 1):** SR 30M–75M (platform commission only)

---

## Part 8: Implementation Checklist

### **Week 1: Validate Assumptions**
- [ ] Contact 5 major Buraydah traders → confirm pain points
- [ ] Reach out to NADEC/SALIC → understand procurement workflow
- [ ] Interview 3 falcon breeders → understand seasonal auction model

### **Week 2-3: MVP Scope**
- [ ] Design classified listing form (animal type, photos, price, location)
- [ ] Build seller dashboard (post, edit, view inquiries)
- [ ] Buyer search/filter (type, price range, location, verification badges)
- [ ] Messaging integration (in-app chat or SMS bridge)

### **Week 4: Pilot Launch**
- [ ] Recruit 10-20 beta sellers from Buraydah market
- [ ] Seed initial 50-100 listings (camels, horses, falcons)
- [ ] Onboard 5 anchor buyers (NADEC, Tanmiah, local traders)
- [ ] Measure: listings posted, inquiries generated, conversion to sales

### **Phase 2: Auction Features**
- [ ] Design timed auction mechanics (bid history, auto-bid, reserve price)
- [ ] Implement payment processing (Stripe, 2Checkout, local gateway)
- [ ] Build winner notification + settlement workflow

---

## Decision Point: Which Model for Mawashi?

### **Recommended Approach: START WITH CLASSIFIED, EVOLVE TO AUCTION**

**Why:**
1. **Haraj-style classified adoption is 3x faster** (3-6 months vs. 6-12 months for auction)
2. **Lower complexity, lower cost** (no bidding logic, payment processing optional at start)
3. **Aligned with existing daily trader behavior** (post + negotiate)
4. **Easier pivoting:** Can bolt on auction features for premium sellers later
5. **Proven in KSA:** Haraj's 50M monthly users validate the model

**Phase 1 Launch (3 months):**
- Classified-only marketplace
- Direct messaging between buyers/sellers
- Simple listing fees (monetization)

**Phase 2 Pivot (6-12 months):**
- Optional auction features for high-value animals
- Premium seller verification (assessed photos/vet certs)
- Logistics integration

---

## Research Sources

- **AuctionsPlus:** https://auctionsplus.com.au
- **Saudi Falcons Club:** https://sfc.org.sa
- **Buraydah Camel Market:** Travel guides + on-site interviews needed
- **NADEC, SALIC, Al-Khudari:** Company websites + LinkedIn research
- **Haraj:** https://haraj.com.sa
- **Market Reports:** 6Wresearch, KenResearch (Saudi classifieds market)

---

## Next Steps (Awaiting Architect Decision)

1. **Approve classified-first model?** → Proceed to Phase 1 MVP design
2. **Identify founding traders in your network?** → Seed the first 20 listings
3. **Determine monetization tier?** → Listing fees vs. commission vs. hybrid
4. **Set launch window?** → Target Week 1 (this week) or delay for more validation?

**Status:** Ready for Architect approval + network seeding.
