# SCOPE: Sacredchain

> Gate 2 Output | Locked: 2025-01-20

---

## Product Overview

**Product Name:** Sacredchain
**Type:** Two-Sided Marketplace (SaaS)
**Architecture:** Dual Portal (B2C + B2B with shared backend)

### B2C Portal - Sacredchain Learning
Modern Preply-like platform for Islamic education, connecting learners with qualified scholars globally.

### B2B Portal - Sacredchain for Business
Upwork-style consultancy platform for Islamic expertise, targeting Western companies.

---

## Target Users

| User Type | Portal | Description |
|-----------|--------|-------------|
| **Students/Learners** | B2C | Muslims seeking sacred knowledge (Quran, Hadith, Aqeeda, Spirituality) |
| **Parents** | B2C | Finding trusted teachers for children's Islamic education |
| **Knowledge Seekers** | B2C | Non-Muslims/reverts exploring Islamic history, arts, sciences in a welcoming space |
| **Teachers/Scholars** | Both | Experts monetizing teaching AND consulting |
| **Businesses** | B2B | Western companies needing Islamic consultants (halal, legal, education) |

---

## Core Value Proposition

### B2C Learning Portal
- **Global Access** - Learn from renowned scholars anywhere in the world
- **Trusted Teachers** - Verified credentials and qualifications
- **Flexible Booking** - Hourly sessions or course bundles
- **Secure Payments** - Escrow system for session confirmation
- **Welcoming Space** - Neutral, non-intimidating for seekers and reverts

### B2B Business Portal
- **Vetted Experts** - Pre-qualified Islamic consultants
- **Fast Hiring** - Days not months to find the right expert
- **Compliance Ready** - Halal certification, legal advice, education consulting
- **Enterprise Grade** - Professional interface, contracts, invoicing

---

## Market

| Channel | Target | Revenue Model |
|---------|--------|---------------|
| **B2C** | Students, parents, seekers | Platform fee on session/bundle purchases |
| **B2B** | Western companies | Platform fee on consulting engagements |

**Platform Fee:** 15% (teacher/consultant receives 85%)

---

## Outcomes

| Portal | Outcome |
|--------|---------|
| **B2C** | "User can find, book, and pay trusted teachers for sacred knowledge in one platform" |
| **B2B** | "Businesses can hire vetted Islamic experts for consulting in days not months" |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED BACKEND                              │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│    │ Scholars│ │  Auth   │ │Payments │ │ Escrow  │             │
│    │  Pool   │ │Supabase │ │ Stripe  │ │ System  │             │
│    └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
└─────────────────────┬───────────────────────┬───────────────────┘
                      │                       │
           ┌──────────▼──────────┐ ┌──────────▼──────────┐
           │   SACREDCHAIN B2C   │ │  SACREDCHAIN B2B    │
           │   (Learning Portal) │ │  (Business Portal)  │
           │                     │ │                     │
           │ • Browse teachers   │ │ • Post projects     │
           │ • Book sessions     │ │ • Hire consultants  │
           │ • Buy bundles       │ │ • Manage contracts  │
           │ • Track progress    │ │ • Enterprise billing│
           │                     │ │                     │
           │ Theme: Warm,        │ │ Theme: Professional,│
           │ spiritual, inviting │ │ corporate, clean    │
           └─────────────────────┘ └─────────────────────┘
```

---

## Feature Roadmap

### Current State (Already Built)
| Feature | Status |
|---------|--------|
| Auth (email/password via Supabase) | ✅ Done |
| User roles (student, teacher, admin) | ✅ Done |
| Teacher profiles & discovery | ✅ Done |
| Bundle/course creation | ✅ Done |
| Student enrollment & progress | ✅ Done |
| Session scheduling | ✅ Done |
| Ratings & feedback | ✅ Done |
| Stripe integration (partial) | 🔄 In Progress |

### Priority Shipping Order

| Priority | Feature | Description | Status |
|----------|---------|-------------|--------|
| **P0** | Stripe Payments | Complete checkout, escrow, teacher payouts | 🔄 In Progress |
| **P1** | Session Booking Flow | Hourly booking (Preply-style) vs bundles only | ⏳ Pending |
| **P2** | Teacher Verification | Vetting system for scholar credentials | ⏳ Pending |
| **P3** | B2B Portal | Business consulting marketplace | ⏳ Future |

---

## P0: Stripe Payments (Complete)

### Requirements
- [ ] Bundle checkout flow (Stripe Checkout)
- [ ] Session purchase flow
- [ ] Escrow hold until session confirmed
- [ ] Teacher payout via Stripe Connect
- [ ] Platform fee calculation (15%)
- [ ] Webhook handlers for payment events
- [ ] Earnings dashboard for teachers
- [ ] Payout request system

### Current Progress (SP Series)
- [x] SP-01: Stripe Setup & Configuration
- [x] SP-02: Database Schema (payments, earnings, payouts)
- [x] SP-03: Payment Hooks
- [x] SP-04: Checkout UI Components
- [x] SP-05: BundleDetail Payment Flow
- [x] SP-06: Teacher Earnings Hook & Page

---

## P1: Session Booking Flow

### Requirements
- [ ] Teacher availability calendar
- [ ] Hourly rate setting for teachers
- [ ] Time slot selection UI
- [ ] Instant booking vs request booking
- [ ] Session reminders (email/notification)
- [ ] Reschedule/cancel flow
- [ ] Video call integration (or external link)

---

## P2: Teacher Verification

### Requirements
- [ ] Credential submission (certificates, ijazah, degrees)
- [ ] Verification review workflow (admin)
- [ ] Verification badges on profiles
- [ ] Specialization verification
- [ ] Background check integration (optional)
- [ ] Ongoing review system

---

## P3: B2B Portal (Future)

### Requirements
- [ ] Separate portal/subdomain
- [ ] Business account registration
- [ ] Project posting system
- [ ] Expert bidding/proposal flow
- [ ] Contract management
- [ ] Enterprise invoicing
- [ ] Milestone-based payments

---

## Tech Stack

### Maintain (Current)
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query + React Context |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Payments | Stripe + Stripe Connect |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Testing | Playwright |

### Add Only If Necessary
- Video: Daily.co or Whereby embed (for sessions)
- Calendar: react-big-calendar or similar
- Email: Resend or Supabase Edge Functions

---

## Constraints

### Technical
- Maintain current stack (React, Vite, Supabase, Tailwind, shadcn/ui)
- No new frameworks unless absolutely necessary
- Preserve existing patterns and architecture
- Use Supabase RLS for all data access

### Compliance (Islamic Content)
- Scholar credentials must be verified
- Content must align with Islamic values
- Accurate Quran/Hadith references
- Proper Arabic text rendering (RTL)
- No depiction of prophets/angels in imagery
- Age-appropriate content filtering
- Sensitive topics handled respectfully

---

## Success Metrics

| Metric | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|
| Registered Teachers | 50 | 200 |
| Registered Students | 500 | 2,000 |
| Sessions Completed | 200 | 2,000 |
| Bundles Sold | 100 | 500 |
| Teacher Payout Volume | $5,000 | $25,000 |
| Platform Revenue | $750 | $3,750 |
| Teacher Verification Rate | 80% | 95% |

---

## Out of Scope (MVP)

- Mobile native apps (web responsive only)
- Real-time video built-in (use external links initially)
- Multi-language UI (English first)
- Physical product shipping
- Marketplace for digital products
- AI-powered matching
- B2B portal (P3 - future phase)

---

## Status

- [x] Gate 0: IDEA - Complete
- [x] Gate 1: MARKET - Complete
- [x] Gate 2: SCOPE - **LOCKED**
- [ ] Gate 3: ARCHITECTURE
- [ ] Gate 4: EXECUTION
- [ ] Gate 5: VALIDATION
