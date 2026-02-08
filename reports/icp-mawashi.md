# ICP — Mawashi (Livestock Trading Marketplace)
*Generated: 2026-02-08*

## Ideal Customer Profile

**Primary Persona: Hamad**
- **Role:** Livestock broker/dealer
- **Location:** Riyadh, Saudi Arabia
- **Business:** Buys and sells cattle/sheep in bulk (5-50 head per month)
- **Current Method:** Physical livestock exhibitions (SIAP, Saudi Agriculture), WhatsApp networks, phone calls
- **Pain Point:** Inefficient - travels to exhibitions, limited buyer/seller reach, no price transparency, manual record-keeping
- **Goal:** Quick transactions, find best prices, verify animal quality remotely, manage inventory digitally
- **Budget:** Can pay 2-3% commission per transaction (standard for livestock brokers)
- **Tech Adoption:** Moderate (uses WhatsApp, basic smartphone)
- **Decision Criteria:** Trust (verified sellers), animal verification (photos/videos), price comparison, transaction safety

**Secondary Personas:**
1. **Fatima** (Farm owner, Saudi, 200 sheep, wants direct buyer access without broker markup)
2. **Ali** (Feed supplier, Qatar, looking to find livestock buyers for vertical integration)
3. **Khalid** (Veterinarian, wants platform for animal health certification + trading)

## Target Markets
1. **Saudi Arabia** - Largest market, 4.5M livestock heads by 2026
2. **GCC** (UAE, Qatar, Bahrain, Oman) - Import/export within GCC
3. **Regional** - International buyers (EU, Asia) for premium livestock

## Competitors (2026)

No clear digital-native livestock marketplace dominates GCC.

| Channel | Strength | Reach | Weakness |
|---------|----------|-------|----------|
| **Physical Exhibitions** (SIAP, MEP, Saudi Ag) | Face-to-face trust, price transparency | Regional (Feb, Jun, Oct) | Seasonal, travel costs, limited reach |
| **WhatsApp/Telegram Groups** | Instant, personal networks | Limited (community-based) | Chaotic, no verification, scams |
| **Traditional Brokers** | Trusted relationships | Small (1 broker's network) | Expensive commission (3-5%) |
| **Emerging Global Ag Platforms** (AgriTech from India/Asia) | Digital infrastructure | Global but not localized | No livestock focus, no GCC presence |

**No GCC-native livestock digital marketplace exists. Huge gap.**

## Mawashi Feature Audit (Brownfield - Minimal MVP)

### What Exists
- Landing page (HTML/CSS)
- Listings section (basic UI)
- Vercel deployed (live)

### ❌ CRITICAL MISSING (MVP Blockers)
- **Authentication** (how do buyers/sellers register?)
- **Listings form** (sellers can't create/post animals yet)
- **Messaging** (no buyer-seller communication)
- **Verification** (how to verify animal quality/seller?)
- **Payment/Escrow** (transaction safety)
- **Animal photos** (with specs: weight, age, breed, health)
- **Search/Filter** (find by breed, location, price, date)
- **Reviews** (seller reputation)

### 🚩 BUSINESS LAYER MISSING
- Commission model clarity (2-3% charged by platform?)
- Payment flow (cash, bank transfer, cryptocurrency?)
- Verification of livestock (veterinary inspection, certificates?)
- Shipping/logistics integration?
- Halal certification requirements?

## Sweet Spot

**Mawashi's Potential Edge:**
1. **First-mover in GCC livestock digital marketplace**
2. **Local team + Arabic-first** (competitors are global/English)
3. **Deep domain knowledge** (understands Saudi livestock ecosystem)
4. **Regional network opportunity** (SIAP, Saudi Ag expo partnerships)

**Winning Positioning:**
"The only livestock marketplace built for Saudi & GCC traders. Transparent prices, verified animals, zero commission first month. Buy/sell cattle and sheep online."

## Market Gaps to Exploit

1. **Transparency:** Live price feeds (vs. opaque broker deals)
2. **Speed:** List animal today, sell tomorrow (vs. waiting for next exhibition)
3. **Safety:** Escrow + verification (vs. cash-on-hand risk)
4. **Reach:** National/regional (vs. local broker network)
5. **Cost:** No commission vs. 3-5% broker markup
6. **Halal Compliance:** Islamic financing options (Riba-free)

## Phase 2 Priority (CRITICAL - MVP Blocker)

This is **GREENFIELD INCOMPLETE**. Must build basic MVP first:

**P0 - Ship This Week:**
1. **Authentication** (user registration, email/phone verification)
2. **Listings form** (seller can post: breed, weight, age, price, photos)
3. **Listings grid** (buyer can browse, filter by location/breed/price)
4. **Seller profile** (reputation, verified badge, contact info)

**P0 - Next Week:**
5. **Messaging** (buyer ↔️ seller direct chat)
6. **Escrow payment** (Stripe or local Saudi payment gateway)
7. **Vet verification** (upload health certificate, optional vet review)
8. **Search + filters** (location, breed, weight range, price range)

**P1 - After MVP:**
9. Shipping logistics integration (Uber Eats for livestock?)
10. Live price feed (market analytics)
11. Community features (discussion forum, buyer tips)
12. Mobile app

## Revenue Model Check

- Stripe integrated? (need to verify)
- Commission model defined? (need PM clarity)
- Payment gateways for GCC? (SADAD, Telr, HyperPay?)

**Critical Success Gate:** Can seller post animal listing + buyer message them → transaction scheduled in <24 hours.

---

*Source: Perplexity market research 2026-02-08*
*Market Gap: No digital livestock marketplace in GCC (physical exhibitions dominate)*
*Opportunity: First-mover advantage in $3B+ GCC livestock sector*
*Status: GREENFIELD INCOMPLETE - Need full MVP build*
