# Mawashi — Phase 2 Build Plan (MVP Mobile Marketplace)
*Target: 6 weeks (3 sprints × 2 weeks). Scope: iOS + Android MVP with hybrid classifieds + optional verified flow.*

---

## Executive Summary

**What we're building:**
A mobile-first livestock marketplace for Saudi Arabia that combines Haraj-style classifieds speed with optional verification, serious-buyer tools, and transport coordination.

**Why this positioning wins:**
- Phase 1 research shows Haraj dominates on liquidity but is weak on trust, verification, and transaction workflows
- MEWA's camel passport initiative and animal welfare enforcement create demand for compliance-forward platforms
- Professional traders (50–250 head farms) need repeat inventory tools and serious-buyer filters
- Seasonal demand spikes (Eid) require deposits and scheduling

**Core differentiator:**
"Classifieds speed with trust layer" — fast listing creation for volume, optional verification/escrow for high-value trades.

---

## 1. MVP Feature Set (Hybrid Model)

### 1.1 Seller Onboarding & Profile
**Goal:** Get traders/farms listing fast while building trust signals.

**Features:**
- **Registration flow:**
  - Phone verification via SMS (Twilio)
  - Seller type selection: Individual / Trader / Farm
  - Optional: National ID or CR (Commercial Registration) upload for verification badge
- **Profile:**
  - Display name, location (city), seller type badge
  - Verification status: "Phone verified" / "ID verified" / "Documents verified"
  - Listing count and "member since" date
- **Seller storefront:**
  - View all active listings from a seller
  - Simple "about" text field (describe farm/trading business)

**Why this matters:**
- Verification tiers address trust gap vs Haraj (Phase 1: "fraud risk, dealer vs individual opacity")
- Seller type tags help buyers filter for professional vs individual sellers

---

### 1.2 Livestock Listing Creation
**Goal:** Photo-first, structured, mobile-optimized listing flow. Faster than WhatsApp; richer than Haraj.

**Features:**
- **Photo capture:**
  - Camera + gallery upload (min 1, max 8 photos)
  - Photo reordering and cover photo selection
  - Auto-compress for rural bandwidth
- **Category & species:**
  - Primary categories: Sheep / Goats / Camels / Horses
  - Breed dropdown (pre-populated common breeds per species)
- **Core details (structured fields):**
  - Age (months or years)
  - Sex (male / female / mixed flock)
  - Count (number of animals in listing)
  - Weight (optional, kg or estimated range)
  - Price (SAR) + negotiable toggle
  - Location (auto-fill from GPS + manual city selection)
- **Optional verification attachments:**
  - Camel passport (microchip number field + vaccination table photo)
  - Vet certificate (photo upload)
  - Other documents (pedigree for horses, etc.)
- **Transport readiness:**
  - Toggle: "Transport available" / "Buyer arranges transport" / "Need transport help"
- **Description (free text):**
  - Max 500 characters
  - Quick-add tags: "Healthy" / "Vaccinated" / "Ready for Eid" / "Breeding quality"

**UX priorities:**
- Autosave drafts (offline-friendly)
- Smart defaults (location from GPS, seller info pre-filled)
- Estimated completion time: <3 minutes for basic listing

**Why this matters:**
- Structured data enables search/filtering (Phase 1 gap: "price discovery, comparables")
- Document attachments support MEWA compliance direction (camel passports, vet records)
- Transport toggle addresses logistics coordination friction

---

### 1.3 Browse & Search
**Goal:** Help buyers find animals fast. Filters that matter, not feature bloat.

**Features:**
- **Home feed:**
  - Location-sorted by default (nearest first, with distance shown)
  - Category tabs: All / Sheep / Goats / Camels / Horses
  - Card format: cover photo, species, price, location, seller type badge
- **Search & filters:**
  - Species/breed
  - Location (city or radius in km)
  - Price range (SAR min-max)
  - Seller type (individual / trader / farm)
  - Verification status ("verified sellers only" toggle)
  - Count range (useful for bulk buyers)
- **Listing detail view:**
  - Photo gallery (swipeable)
  - All structured data displayed clearly
  - Seller profile link
  - "Make Offer" and "Chat" buttons (primary CTAs)
  - Verification badges (phone / ID / documents attached)
  - Map snippet (approximate location for privacy)

**Offline support:**
- Cache last 50 browsed listings for offline viewing
- Show "cached" indicator when offline

**Why this matters:**
- Location + species filters are table-stakes (observed on Haraj)
- Verification filter addresses buyer trust needs
- Offline caching handles rural connectivity issues

---

### 1.4 Chat & Negotiation
**Goal:** WhatsApp-style messaging with livestock-specific quick actions.

**Features:**
- **In-app chat:**
  - Real-time messaging (one-to-one, per listing)
  - Photo/video sharing
  - Voice message support (Arabic + English)
- **Quick message templates:**
  - "What's your final price?"
  - "Can you send more photos?"
  - "Is transport available?"
  - "When can I pick up?"
- **Offer system:**
  - Buyer sends formal offer (price + optional deposit)
  - Seller accepts/rejects/counters
  - Offer expiry timer (24h default)
- **Notification strategy:**
  - Push notifications for new messages/offers
  - SMS fallback if push fails (critical for rural areas)

**Why this matters:**
- Chat keeps negotiation on-platform (builds engagement, prevents WhatsApp exit)
- Quick templates reduce language/typing friction
- Offers formalize intent and reduce "time-wasting inquiries" (ICP #1 pain point)

---

### 1.5 Optional: Verification Tier (MVP-Ready, Full Rollout Phase 3)
**Goal:** Build the technical foundation; offer verification as "beta feature" to early sellers.

**MVP scope (Phase 2):**
- **Seller document upload:**
  - National ID / CR photo upload
  - Manual review by admin (no auto-verification yet)
  - Status: Pending / Approved / Rejected
- **Listing verification badges:**
  - "Camel passport attached" (if microchip + vaccination table uploaded)
  - "Vet certificate attached"
  - Display verification date and "verified by" label

**Phase 3 expansion (defer for now):**
- Partner vet network (book on-demand health checks)
- MEWA API integration (camel passport lookup via microchip)
- Automated ID verification (OCR + ABSHER API if available)

**Why start small:**
- Verification is a differentiator but requires operational overhead
- Manual review for Phase 2 validates demand before building automation

---

### 1.6 Optional: Deposit & Escrow (Foundation Only in Phase 2)
**Goal:** Lay technical groundwork; launch escrow in Phase 3 after payment compliance review.

**MVP scope (Phase 2):**
- **Deposit/reservation flow (UI only, no money handling):**
  - Buyer indicates "I want to reserve this animal"
  - Seller receives notification and can approve/reject
  - Status tracking: Reserved / Available / Sold
- **Payment methods (researched, not integrated yet):**
  - Mada (essential for KSA)
  - Visa/Mastercard
  - Apple Pay
  - Bank transfer instructions
- **Escrow logic design (backend schema):**
  - Transaction state machine: Pending → Paid → Delivered → Released / Refunded
  - Delivery confirmation: photo + GPS timestamp

**Phase 3 activation:**
- PSP integration (HyperPay recommended for Saudi local support)
- VAT invoice generation (ZATCA compliant)
- Dispute resolution workflow

**Why defer full escrow:**
- Escrow requires stronger KYC/AML compliance and dispute handling (Phase 1 regulatory checklist)
- Most livestock trades are still cash-on-pickup; escrow is premium feature for high-value deals
- Better to launch deposits/reservations first to prove demand

---

## 2. Mobile-First Design (iOS + Android)

### 2.1 Tech Stack Choice: React Native (Expo)

**Why React Native + Expo:**
- **Single codebase** for iOS + Android (faster iteration)
- **Expo managed workflow** = zero native config, OTA updates, faster onboarding for devs
- **Rich ecosystem:**
  - `expo-camera` for photo capture
  - `expo-location` for GPS
  - `expo-notifications` for push
  - `expo-file-system` for offline caching
- **Proven in MENA:** many Saudi apps use React Native (Careem, Jahez, etc.)

**Alternative considered (Flutter):**
- Faster rendering, better offline performance
- **Trade-off:** smaller talent pool in Saudi market; React Native has more devs available

**Decision:** React Native + Expo for Phase 2. Evaluate Flutter if performance becomes bottleneck.

---

### 2.2 Mobile UX Priorities

**Camera-first listing creation:**
- Launch camera directly from "Add Listing" button
- Capture multiple photos in sequence (no gallery navigation needed)
- Show photo count and "Done" CTA

**GPS location for listings:**
- Auto-detect city on listing creation
- Show "Use current location" vs "Select city manually"
- Privacy: show approximate location (neighborhood, not exact GPS) on public listings

**Push notifications:**
- New message: "Ahmed sent you a message about your listing: Sheep - Najdi"
- New offer: "Khalid offered SAR 1,200 for your listing"
- Listing boost: "Your listing expires in 3 days — renew now?"
- Critical: configure APNs (iOS) and FCM (Android) certificates

**Offline mode (listing caching):**
- Cache last browsed listings locally (React Native AsyncStorage or SQLite)
- Allow viewing cached listings when offline
- Show "cached" badge and hide chat/offer buttons until online
- Auto-sync when connection restored

**Localization:**
- Arabic (primary) + English
- RTL layout support (React Native has built-in RTL)
- Number formatting: Arabic-Indic numerals for Arabic locale

---

## 3. Backend Architecture

### 3.1 Core Stack: Supabase (Recommended)

**Why Supabase:**
- **All-in-one platform:** Postgres DB + Auth + Storage + Realtime + Edge Functions
- **Fast setup:** no infrastructure management, generous free tier
- **Built-in features we need:**
  - Row-level security (RLS) for data privacy
  - Realtime subscriptions (chat messages)
  - Storage with CDN (livestock photos)
  - Auth with phone/SMS (via Twilio integration)
- **Developer experience:** Auto-generated REST + GraphQL APIs, good docs, TypeScript support

**Alternative considered (Firebase):**
- More mature, larger ecosystem
- **Trade-offs:**
  - Firestore pricing can spike with livestock image traffic
  - Less SQL-friendly (harder to build complex filters/analytics)
  - No built-in Postgres (limits future integrations with analytics tools)

**Decision:** Supabase for Phase 2. Provides Postgres reliability with Firebase-like DX.

---

### 3.2 Database Schema (Core Tables)

**users**
- `id` (UUID, primary key)
- `phone` (string, unique, indexed)
- `phone_verified_at` (timestamp)
- `seller_type` (enum: individual / trader / farm)
- `display_name` (string)
- `city` (string)
- `national_id_verified` (boolean)
- `cr_number` (string, nullable)
- `created_at` (timestamp)

**listings**
- `id` (UUID, primary key)
- `seller_id` (UUID, foreign key → users)
- `species` (enum: sheep / goat / camel / horse)
- `breed` (string)
- `age_months` (integer)
- `sex` (enum: male / female / mixed)
- `count` (integer)
- `weight_kg` (decimal, nullable)
- `price_sar` (decimal)
- `negotiable` (boolean)
- `city` (string)
- `location_lat` (decimal, nullable)
- `location_lng` (decimal, nullable)
- `description` (text)
- `transport_status` (enum: available / buyer_arranges / need_help)
- `status` (enum: active / reserved / sold / expired)
- `verification_status` (enum: none / pending / verified)
- `camel_passport_microchip` (string, nullable)
- `views_count` (integer, default 0)
- `created_at` (timestamp)
- `expires_at` (timestamp)

**listing_photos**
- `id` (UUID, primary key)
- `listing_id` (UUID, foreign key → listings)
- `storage_path` (string)
- `display_order` (integer)
- `is_cover` (boolean)

**listing_documents**
- `id` (UUID, primary key)
- `listing_id` (UUID, foreign key → listings)
- `document_type` (enum: camel_passport / vet_certificate / pedigree / other)
- `storage_path` (string)
- `uploaded_at` (timestamp)

**chats**
- `id` (UUID, primary key)
- `listing_id` (UUID, foreign key → listings)
- `buyer_id` (UUID, foreign key → users)
- `seller_id` (UUID, foreign key → users)
- `last_message_at` (timestamp)
- `unread_count_buyer` (integer)
- `unread_count_seller` (integer)

**messages**
- `id` (UUID, primary key)
- `chat_id` (UUID, foreign key → chats)
- `sender_id` (UUID, foreign key → users)
- `message_type` (enum: text / photo / offer)
- `content` (text)
- `offer_price_sar` (decimal, nullable)
- `offer_status` (enum: pending / accepted / rejected / countered, nullable)
- `created_at` (timestamp)

**Indexes:**
- `listings.seller_id`, `listings.species`, `listings.city`, `listings.status`, `listings.created_at`
- `chats.buyer_id`, `chats.seller_id`, `chats.listing_id`
- `messages.chat_id`, `messages.created_at`

---

### 3.3 Image Storage (Supabase Storage + Cloudinary)

**Primary storage: Supabase Storage**
- Free 1GB, then $0.021/GB/month
- Built-in CDN (Cloudflare)
- Upload directly from React Native via signed URLs

**Image processing: Cloudinary (optional, Phase 3)**
- Auto-compress and resize livestock photos (mobile bandwidth optimization)
- Generate thumbnails for browse feed
- Pricing: free tier 25GB bandwidth/month

**Phase 2 approach:**
- Use Supabase Storage for simplicity
- Implement client-side compression in React Native (`expo-image-manipulator`)
- Monitor bandwidth; add Cloudinary if costs spike

---

### 3.4 SMS Verification (Twilio)

**Why Twilio:**
- Reliable delivery in Saudi Arabia
- Support for Arabic SMS
- Pricing: ~$0.04 per SMS (affordable at MVP scale)

**Flow:**
1. User enters phone number (Saudi +966 format)
2. Backend generates 6-digit OTP, stores in `phone_verifications` table with expiry (5 min)
3. Twilio sends SMS via Supabase Edge Function
4. User enters OTP; backend validates and marks `users.phone_verified_at`

**Fallback for Phase 3:**
- Voice OTP (if SMS delivery fails in rural areas)
- Integration with STC/Mobily direct APIs (cheaper than Twilio at scale)

---

### 3.5 Optional: MEWA API Integration (Camel Passport Verification)

**Status:** Research phase. MEWA has not publicly documented a camel passport API yet.

**Phase 2 approach:**
- Capture microchip number + vaccination table photo manually
- Display "Camel passport attached" badge
- Manual verification by admin if disputes arise

**Phase 3 exploration:**
- Contact MEWA to request API access (if available)
- Validate microchip number against MEWA registry
- Auto-populate breed, vaccination status, ownership history

---

## 4. Sprint Breakdown (3 Sprints × 2 Weeks = 6 Weeks)

### Sprint 1: Seller Onboarding + Listing Creation (Weeks 1–2)
**Goal:** Sellers can register, verify phone, and create structured livestock listings with photos.

**Deliverables:**
- [ ] **Backend (Supabase setup):**
  - Database schema (users, listings, listing_photos, listing_documents)
  - Row-level security (RLS) policies
  - Storage bucket for photos/documents
- [ ] **Mobile (React Native + Expo):**
  - Splash screen, onboarding flow
  - Phone verification (SMS OTP via Twilio)
  - Seller profile creation (type, name, city)
  - Listing creation form:
    - Camera + gallery photo upload
    - Species/breed selection
    - Structured fields (age, sex, count, price, location)
    - Transport toggle
    - Description + tags
  - Draft autosave (offline support)
  - Submit listing (photo upload → Supabase Storage)
- [ ] **Admin panel (basic):**
  - View all listings (Supabase Dashboard or simple React admin)
  - Manual listing approval/rejection

**Success criteria:**
- 5 test sellers can create 10+ listings each
- Photo upload works on 3G rural connection (<30s per photo)
- Listings display correctly in Supabase database

---

### Sprint 2: Browse + Search + Chat (Weeks 3–4)
**Goal:** Buyers can browse, filter, and negotiate with sellers via in-app chat.

**Deliverables:**
- [ ] **Browse & search:**
  - Home feed (location-sorted, category tabs)
  - Listing card UI (photo, price, species, location, seller badge)
  - Listing detail view (photo gallery, structured data, map snippet)
  - Search & filters (species, location, price range, seller type, verification)
  - Offline listing cache (last 50 listings)
- [ ] **Chat system:**
  - Supabase Realtime subscriptions for messages
  - Chat list view (per buyer/seller)
  - Message thread (text, photos)
  - Quick message templates
  - Push notifications (Expo Notifications + APNs/FCM setup)
  - SMS fallback for critical notifications (new offer)
- [ ] **Offer system:**
  - "Make Offer" button → offer modal (price input)
  - Seller receives offer notification
  - Accept/reject/counter actions
  - Offer expiry (24h timer)
- [ ] **Analytics (basic):**
  - Track listing views, chat initiations, offers sent

**Success criteria:**
- 10 test buyers can find listings via filters
- Chat works in real-time (message delivery <2s on WiFi)
- Push notifications delivered on iOS + Android
- Offline mode: cached listings viewable without internet

---

### Sprint 3: Optional Verification + Deposit Foundation (Weeks 5–6)
**Goal:** Build trust layer foundation (verification badges, deposit UI) and polish for soft launch.

**Deliverables:**
- [ ] **Verification tier (manual review):**
  - Seller document upload (ID/CR photo)
  - Admin review interface (approve/reject)
  - Verification badges on profiles and listings
  - Camel passport field (microchip number + vaccination table photo)
  - "Documents attached" badge on listings
- [ ] **Deposit/reservation (UI only, no payments):**
  - "Reserve this animal" button
  - Reservation request notification to seller
  - Status tracking: Reserved / Available
  - Backend schema for future payment integration
- [ ] **Compliance features:**
  - Report listing (animal welfare concern, fraud, stolen animal)
  - Moderation dashboard (admin can hide/delete listings)
  - Terms of Service + Privacy Policy screens
- [ ] **Polish & localization:**
  - Arabic translation (all UI strings)
  - RTL layout testing
  - Loading states, error handling, empty states
  - Onboarding tutorial (first-time user)
- [ ] **Soft launch prep:**
  - App Store + Google Play submissions (review takes 2–7 days)
  - Marketing landing page (simple Next.js site)
  - TestFlight beta invites to 20 early sellers

**Success criteria:**
- 5 sellers submit verification documents; admin can approve within 1 day
- Reservation flow works end-to-end (no money, just status change)
- App approved on iOS + Android stores
- Arabic UI tested by native speaker (no broken RTL)

---

## 5. Tech Stack Recommendation (Final)

### Mobile
- **Framework:** React Native (0.74+) + Expo SDK 51
- **State management:** Zustand (lightweight) or React Context (if simple)
- **Navigation:** React Navigation 6
- **UI library:** React Native Paper (Material Design) or custom components
- **Forms:** React Hook Form
- **Image handling:** expo-image-manipulator (compression), expo-camera, expo-image-picker
- **Location:** expo-location (GPS), react-native-maps (listing detail map)
- **Notifications:** expo-notifications (push) + Twilio (SMS fallback)
- **Offline:** AsyncStorage (small data) or WatermelonDB (if chat history grows large)

### Backend
- **BaaS:** Supabase (Postgres + Auth + Storage + Realtime)
- **SMS:** Twilio (OTP)
- **Image storage:** Supabase Storage (primary), Cloudinary (future optimization)
- **Payments (Phase 3):** HyperPay (Saudi local support) or Stripe (if HyperPay integration difficult)
- **Maps:** Google Maps API (geocoding, map snippets) — alternative: OpenStreetMap (free, no API key)

### Payments (Phase 3 Prep)
- **PSP:** HyperPay (Saudi-based, supports Mada + Visa/MC + Apple Pay)
- **Alternatives:** Moyasar (Saudi), Checkout.com (GCC coverage)
- **VAT invoicing:** Custom PDF generation via Edge Function + ZATCA template

### Analytics
- **Mobile:** Expo Analytics + Mixpanel (user behavior)
- **Backend:** Supabase Dashboard (SQL queries for business metrics)
- **Crash reporting:** Sentry

### Admin/Operations
- **Admin panel:** Refine.dev (React admin framework) or Supabase Dashboard (if minimal UI needs)
- **Customer support:** Intercom or Tawk.to (live chat widget)

---

## 6. Regulatory Compliance (Built Into MVP)

### 6.1 ZATCA VAT Compliance
**Phase 2 scope (no payments yet):**
- Display all prices as "VAT inclusive" (even though no payment processing)
- Terms clearly state: "Platform facilitates listings only; payments handled directly by buyer/seller"

**Phase 3 activation (when escrow launches):**
- VAT registration if commission revenue exceeds threshold (SAR 187,500/year mandatory; SAR 375,000/year voluntary)
- Generate VAT-compliant invoices (simplified invoices for <SAR 1,000 transactions)
- E-invoicing (FATOORA) integration timeline (ZATCA rolled out in waves; check current requirements)

**Reference:** ZATCA VAT guidance (Phase 1 artifact: Regulatory Checklist)

---

### 6.2 MEWA Animal Welfare (Moderation)
**Features built in Phase 2:**
- **Prohibited practices enforcement:**
  - Terms explicitly ban listings implying cruelty (e.g., cosmetic alterations, growth stimulants)
  - Report button on listings → "Animal welfare concern"
  - Moderation dashboard flags for admin review
- **Camel passport support:**
  - Microchip number field (optional)
  - Vaccination table photo upload
  - "Camel passport attached" badge

**Content moderation rules:**
- Auto-flag listings with keywords: "Botox," "filler," "dyeing," "tail docking" (if in description)
- Manual review of flagged listings within 24h
- Penalties: listing removal, seller warning, account suspension (repeat offenses)

**Reference:** MEWA prohibited practices list (Phase 1 artifact: Market Analysis, section 6.2)

---

### 6.3 Data Privacy & User Safety
- **Privacy Policy (required before app store approval):**
  - Data collected: phone, location, photos, chat history
  - Data usage: listing display, chat facilitation, analytics
  - Data sharing: none (except law enforcement requests)
  - User rights: delete account, export data
- **Safety Center (in-app):**
  - Tips for safe trading (meet in public, verify identity, inspect animals before payment)
  - Report fraud/scam
  - Emergency contact (MEWA hotline for animal welfare)

---

## 7. Phase 2 Success Metrics

### Primary Metrics (End of Week 6)
- **Supply:** 50+ active sellers (registered + phone verified + 1+ listing)
- **Liquidity:** 200+ livestock listings (any species)
- **Engagement:** 10+ transactions (chat → agreement; tracked via seller self-report or "mark as sold")
- **Retention:** 30% of sellers list again within 30 days

### Secondary Metrics (Quality/Health)
- **Listing quality:** 80%+ of listings have 3+ photos and all required fields
- **Chat response rate:** 60%+ of chats receive seller reply within 24h
- **Verification adoption:** 20%+ of sellers submit ID for verification badge
- **App performance:**
  - Crash rate: <1%
  - Avg listing creation time: <5 minutes
  - Photo upload success rate: >90% (even on 3G)

### Leading Indicators (Track Weekly)
- Weekly active users (WAU)
- New listings per week
- Chat initiation rate (% of listing views → chat)
- Offer conversion rate (% of offers → accepted)

---

## 8. Risk Mitigation & Practical Notes

### 8.1 Risks
| Risk | Mitigation |
|------|-----------|
| **Low seller supply** | Pre-launch: recruit 20 traders via WhatsApp groups; offer free promoted listings for first month |
| **Poor photo quality (rural users)** | Client-side compression; tutorial video on how to photograph animals |
| **Chat spam / fraud** | Rate limiting (max 10 chats initiated per day); report/block features |
| **Offline usage in rural areas** | Aggressive caching; allow listing creation fully offline (sync later) |
| **Language barrier (UI only in English initially)** | Arabic translation is Sprint 3 priority; hire native speaker for QA |
| **App store rejection** | Review Apple/Google policies on animal sales; ensure Terms prohibit illegal animal trade |

---

### 8.2 What We're NOT Building in Phase 2 (Scope Control)
- ❌ **Full escrow/payment processing** (UI only; defer to Phase 3)
- ❌ **Transport marketplace with live quotes** (just capture "need transport" flag)
- ❌ **Vet partner network** (manual verification only)
- ❌ **MEWA API integration** (await API availability)
- ❌ **Auction/bidding** (stick to negotiation; auction is Phase 3+ experiment)
- ❌ **Web app** (mobile-only for MVP)
- ❌ **Buyer profiles** (buyers remain anonymous until chat initiation)

---

### 8.3 Phase 3 Roadmap Preview (Post-Launch)
After achieving Phase 2 success metrics:
1. **Payments & escrow** (HyperPay integration, VAT invoicing)
2. **Transport marketplace** (vetted carriers, live quotes, booking)
3. **Vet partner network** (on-demand health checks, certification)
4. **Seller analytics dashboard** (listing views, offer trends, seasonal insights)
5. **Buyer features** (saved searches, listing alerts, purchase history)
6. **Auction experiment** (time-boxed bidding for premium animals)
7. **Web app** (desktop browsing, admin tools)

---

## Appendix A: Development Team & Timeline

### Recommended Team (Phase 2)
- **1× Mobile Developer** (React Native, Expo)
- **1× Backend Developer** (Supabase, Postgres, Edge Functions)
- **1× Product/Designer** (UX, Arabic localization, compliance review)
- **1× QA Tester** (iOS + Android, Arabic testing, rural connectivity simulation)
- **0.5× DevOps/Admin** (Supabase setup, monitoring, app store submissions)

**Total capacity:** ~2.5–3 FTE over 6 weeks

---

### Sprint Timeline (Gantt-Style)
```
Week 1: Backend setup + mobile scaffolding + onboarding flow
Week 2: Listing creation + photo upload + admin panel
Week 3: Browse + search + listing detail
Week 4: Chat + offers + push notifications
Week 5: Verification tier + deposit UI + compliance features
Week 6: Polish + Arabic translation + app store submission + beta launch
```

---

## Appendix B: Cost Estimates (Phase 2 MVP)

| Item | Provider | Monthly Cost (USD) |
|------|----------|-------------------|
| Supabase Pro | Supabase | $25 (includes 8GB DB, 100GB bandwidth, 50GB storage) |
| SMS (1,000 OTPs) | Twilio | $40 |
| Push notifications | Expo (free tier) | $0 (upgrade to $99/mo if >1M notifications) |
| Google Maps API (5,000 calls) | Google Cloud | ~$20 |
| Cloudinary (optional) | Cloudinary | $0 (free tier sufficient for MVP) |
| Domain + hosting (landing page) | Vercel + Namecheap | $15 |
| App Store Developer | Apple | $99/year |
| Play Store Developer | Google | $25 one-time |
| **Total (Phase 2 MVP)** | | **~$100/month + $124 one-time** |

**Scaling costs (if Phase 2 succeeds):**
- At 10,000 users: ~$300–500/month (Supabase bandwidth + SMS + maps)
- At 50,000 users: ~$1,000–1,500/month (upgrade Supabase to Team plan)

---

## Appendix C: Key Decision Log

| Decision | Rationale | Trade-Off Accepted |
|----------|-----------|-------------------|
| React Native over Flutter | Larger dev talent pool in Saudi; Expo speeds up MVP | Slightly slower rendering (negligible for MVP) |
| Supabase over Firebase | Postgres reliability; better filtering/analytics | Smaller ecosystem vs Firebase |
| Manual verification (Phase 2) over automated | Validate demand before building automation | Slower verification (1-2 days vs instant) |
| Defer escrow to Phase 3 | Avoid compliance complexity; most trades are cash | Miss early revenue from transaction fees |
| No web app in Phase 2 | Mobile-first for ICP (traders/farmers are mobile-native) | Desktop buyers must wait for Phase 3 |

---

## Sign-Off

**Phase 2 is ready to kick off when:**
- [ ] Phase 1 artifacts reviewed and approved by stakeholders
- [ ] Development team hired/allocated
- [ ] Supabase project created + Twilio account set up
- [ ] App store developer accounts registered
- [ ] Initial 20 beta testers (traders) recruited

**Next step:** Create Sprint 1 backlog in project management tool (Linear, Jira, or Notion) and begin development.

---

*Document version: 1.0*  
*Date: February 4, 2026*  
*Owner: Mawashi Product Team*
