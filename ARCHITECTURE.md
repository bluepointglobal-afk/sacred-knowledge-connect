# Sacredchain Architecture

> Gate 3 Output | Updated: 2025-01-20
> Complete system architecture for dual-portal marketplace

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Dual Portal Architecture](#dual-portal-architecture)
4. [Database Schema](#database-schema)
5. [Payments & Escrow System](#payments--escrow-system)
6. [Booking & Availability System](#booking--availability-system)
7. [Teacher Verification System](#teacher-verification-system)
8. [User Flows](#user-flows)
9. [Route Maps](#route-maps)
10. [Data Flow & Hooks](#data-flow--hooks)
11. [Security Model (RLS)](#security-model-rls)
12. [External Integrations](#external-integrations)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SACREDCHAIN PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│    ┌───────────────────────────────┐     ┌───────────────────────────────┐     │
│    │      B2C LEARNING PORTAL      │     │      B2B BUSINESS PORTAL      │     │
│    │      (sacredchain.com)        │     │   (business.sacredchain.com)  │     │
│    ├───────────────────────────────┤     ├───────────────────────────────┤     │
│    │ • Browse teachers & bundles   │     │ • Post consulting projects    │     │
│    │ • Book hourly sessions        │     │ • Hire Islamic experts        │     │
│    │ • Purchase course bundles     │     │ • Manage contracts            │     │
│    │ • Track learning progress     │     │ • Enterprise billing          │     │
│    │                               │     │                               │     │
│    │ Theme: Warm, spiritual        │     │ Theme: Professional, clean    │     │
│    │ Users: Students, Parents      │     │ Users: Companies, HR          │     │
│    └───────────────┬───────────────┘     └───────────────┬───────────────┘     │
│                    │                                     │                     │
│                    └──────────────┬──────────────────────┘                     │
│                                   │                                            │
│    ┌──────────────────────────────▼──────────────────────────────────────┐    │
│    │                        SHARED BACKEND                                │    │
│    ├─────────────────────────────────────────────────────────────────────┤    │
│    │                                                                      │    │
│    │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │    │
│    │  │  SUPABASE   │ │   STRIPE    │ │   STRIPE    │ │  SUPABASE   │   │    │
│    │  │    AUTH     │ │  CHECKOUT   │ │  CONNECT    │ │   STORAGE   │   │    │
│    │  ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤   │    │
│    │  │ Email/Pass  │ │ Session Pay │ │ Teacher     │ │ Avatars     │   │    │
│    │  │ Google OAuth│ │ Bundle Pay  │ │ Payouts     │ │ Documents   │   │    │
│    │  │ JWT Tokens  │ │ Escrow Hold │ │ Platform    │ │ Credentials │   │    │
│    │  └─────────────┘ └─────────────┘ │ Fee Split   │ └─────────────┘   │    │
│    │                                  └─────────────┘                    │    │
│    │  ┌─────────────────────────────────────────────────────────────┐   │    │
│    │  │                    SUPABASE POSTGRESQL                       │   │    │
│    │  ├─────────────────────────────────────────────────────────────┤   │    │
│    │  │ profiles │ teachers │ bundles │ sessions │ payments │ ...   │   │    │
│    │  └─────────────────────────────────────────────────────────────┘   │    │
│    │                                                                      │    │
│    │  ┌─────────────────────────────────────────────────────────────┐   │    │
│    │  │                    SUPABASE EDGE FUNCTIONS                   │   │    │
│    │  ├─────────────────────────────────────────────────────────────┤   │    │
│    │  │ stripe-webhook │ create-checkout │ create-connect-account   │   │    │
│    │  └─────────────────────────────────────────────────────────────┘   │    │
│    │                                                                      │    │
│    └─────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend (Maintain)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18 + TypeScript | UI components |
| Build | Vite 5 | Fast dev server, bundling |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Components | shadcn/ui (Radix) | Accessible UI primitives |
| State | TanStack Query 5 | Server state, caching |
| Forms | React Hook Form + Zod | Validation |
| Routing | React Router v6 | Client-side routing |
| Animation | Framer Motion | Micro-interactions |
| Testing | Playwright | E2E testing |

### Backend (Maintain)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Database | Supabase PostgreSQL | Primary data store |
| Auth | Supabase Auth | Email, OAuth, sessions |
| Storage | Supabase Storage | Files, images |
| Realtime | Supabase Realtime | Live updates |
| Functions | Supabase Edge Functions | Webhooks, server logic |
| Security | Row Level Security | Data access control |

### Additions (P0-P2)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Payments | Stripe Checkout | Session/bundle purchases |
| Payouts | Stripe Connect | Teacher earnings |
| Calendar | react-big-calendar | Availability UI |
| Date/Time | date-fns + date-fns-tz | Timezone handling |
| Video | External links (Zoom/Meet) | Session calls |

---

## Dual Portal Architecture

### Portal Structure

```
sacredchain/
├── src/
│   ├── portals/
│   │   ├── learning/              # B2C Portal
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── theme.ts           # Warm, spiritual theme
│   │   │
│   │   └── business/              # B2B Portal (P3 - Future)
│   │       ├── pages/
│   │       ├── components/
│   │       └── theme.ts           # Professional theme
│   │
│   ├── shared/                    # Shared between portals
│   │   ├── components/            # Common UI (Button, Card, etc.)
│   │   ├── hooks/                 # Data hooks (useTeachers, etc.)
│   │   ├── lib/                   # Supabase client, utils
│   │   └── types/                 # TypeScript types
│   │
│   └── App.tsx                    # Route splitting by portal
```

### Portal Routing

```typescript
// App.tsx - Portal-based routing
<Routes>
  {/* B2C Learning Portal */}
  <Route path="/" element={<LearningLayout />}>
    <Route index element={<Landing />} />
    <Route path="teachers" element={<Teachers />} />
    <Route path="teachers/:id" element={<TeacherProfile />} />
    <Route path="bundles" element={<Bundles />} />
    <Route path="bundles/:id" element={<BundleDetail />} />
    <Route path="book/:teacherId" element={<BookSession />} />
    <Route path="checkout/:type/:id" element={<Checkout />} />
    <Route path="dashboard" element={<StudentDashboard />} />
    <Route path="enrollments/:id" element={<EnrollmentDetail />} />
    <Route path="sessions/:id" element={<SessionDetail />} />
  </Route>

  {/* Teacher Portal */}
  <Route path="/teach" element={<TeacherLayout />}>
    <Route index element={<TeacherDashboard />} />
    <Route path="availability" element={<AvailabilitySettings />} />
    <Route path="bundles" element={<MyBundles />} />
    <Route path="sessions" element={<MySessions />} />
    <Route path="earnings" element={<Earnings />} />
    <Route path="verification" element={<Verification />} />
  </Route>

  {/* B2B Business Portal (P3 - Future) */}
  <Route path="/business" element={<BusinessLayout />}>
    <Route index element={<BusinessLanding />} />
    <Route path="projects" element={<Projects />} />
    <Route path="experts" element={<ExpertSearch />} />
    {/* ... */}
  </Route>

  {/* Auth (Shared) */}
  <Route path="/login" element={<Login />} />
  <Route path="/onboarding" element={<Onboarding />} />
</Routes>
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CORE ENTITIES                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│      profiles       │         │   teacher_profiles  │
├─────────────────────┤         ├─────────────────────┤
│ id (PK, FK auth)    │◄────────│ user_id (FK)        │
│ email               │         │ id (PK)             │
│ full_name           │         │ bio                 │
│ avatar_url          │         │ headline            │
│ role                │         │ specializations[]   │
│ timezone            │         │ qualifications[]    │
│ language            │         │ hourly_rate_cents   │
│ stripe_customer_id  │ NEW     │ session_duration    │ NEW (30/60/90)
│ created_at          │         │ is_verified         │
│ updated_at          │         │ verification_level  │ NEW (basic/full/scholar)
└─────────────────────┘         │ is_featured         │
                                │ average_rating      │
                                │ total_sessions      │
                                │ total_students      │
                                │ stripe_account_id   │ NEW (Connect)
                                │ stripe_onboarded    │ NEW
                                └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AVAILABILITY SYSTEM (P1)                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐         ┌─────────────────────────────┐
│    teacher_availability     │         │    availability_exceptions  │
├─────────────────────────────┤         ├─────────────────────────────┤
│ id (PK)                     │         │ id (PK)                     │
│ teacher_id (FK)             │         │ teacher_id (FK)             │
│ day_of_week (0-6)           │         │ date                        │
│ start_time (TIME)           │         │ is_available (bool)         │
│ end_time (TIME)             │         │ start_time (TIME, nullable) │
│ is_active (bool)            │         │ end_time (TIME, nullable)   │
│ timezone                    │         │ reason (vacation/busy/etc)  │
│ created_at                  │         │ created_at                  │
└─────────────────────────────┘         └─────────────────────────────┘

Example: Teacher available Mon-Fri 9am-5pm, except Dec 25 (holiday)

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BOOKING SYSTEM (P1)                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│      booking_slots          │  (Generated from availability)
├─────────────────────────────┤
│ id (PK)                     │
│ teacher_id (FK)             │
│ start_time (TIMESTAMPTZ)    │
│ end_time (TIMESTAMPTZ)      │
│ status (available/booked/   │
│         held/blocked)       │
│ session_id (FK, nullable)   │  → Links to booked session
│ held_until (TIMESTAMPTZ)    │  → Temporary hold during checkout
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│         sessions            │  (Enhanced)
├─────────────────────────────┤
│ id (PK)                     │
│ teacher_id (FK)             │
│ student_id (FK)             │
│ booking_slot_id (FK)        │ NEW
│ bundle_id (FK, nullable)    │  → If part of bundle
│ enrollment_id (FK, nullable)│
│ scheduled_at (TIMESTAMPTZ)  │
│ duration_minutes            │
│ status (enum)               │  → scheduled/confirmed/completed/
│                             │     cancelled/no_show/disputed
│ booking_type (enum)         │ NEW → hourly/bundle/trial
│ price_cents                 │ NEW
│ meeting_url                 │
│ notes_teacher               │
│ notes_student               │
│ completed_at                │
│ cancelled_at                │ NEW
│ cancellation_reason         │ NEW
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PAYMENTS SYSTEM (P0)                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│         payments            │
├─────────────────────────────┤
│ id (PK)                     │
│ student_id (FK)             │
│ teacher_id (FK)             │
│ session_id (FK, nullable)   │  → For hourly sessions
│ bundle_id (FK, nullable)    │  → For bundle purchases
│ enrollment_id (FK, nullable)│
│ amount_cents                │
│ platform_fee_cents          │  → 15% of amount
│ teacher_amount_cents        │  → 85% of amount
│ currency (default: 'usd')   │
│ status (enum)               │  → pending/held/completed/
│                             │     refunded/failed/disputed
│ stripe_payment_intent_id    │
│ stripe_checkout_session_id  │
│ payment_type (enum)         │  → session/bundle/tip
│ escrow_released_at          │ NEW → When funds released to teacher
│ refund_reason               │
│ metadata (JSONB)            │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│     teacher_earnings        │
├─────────────────────────────┤
│ id (PK)                     │
│ teacher_id (FK)             │
│ payment_id (FK)             │
│ session_id (FK, nullable)   │
│ bundle_id (FK, nullable)    │
│ amount_cents                │
│ status (enum)               │  → pending/available/paid_out/
│                             │     held/forfeited
│ available_at (TIMESTAMPTZ)  │  → When escrow releases
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│     teacher_payouts         │
├─────────────────────────────┤
│ id (PK)                     │
│ teacher_id (FK)             │
│ amount_cents                │
│ currency                    │
│ status (enum)               │  → pending/processing/completed/failed
│ stripe_transfer_id          │
│ stripe_payout_id            │
│ requested_at                │
│ processed_at                │
│ failure_reason              │
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                        VERIFICATION SYSTEM (P2)                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐
│   verification_documents    │
├─────────────────────────────┤
│ id (PK)                     │
│ teacher_id (FK)             │
│ document_type (enum)        │  → certificate/ijazah/degree/
│                             │     id_document/other
│ title                       │
│ description                 │
│ file_url                    │  → Supabase Storage
│ issuing_authority           │  → e.g., "Al-Azhar University"
│ issue_date                  │
│ expiry_date (nullable)      │
│ verification_status (enum)  │  → pending/reviewing/approved/
│                             │     rejected/expired
│ reviewed_by (FK, nullable)  │  → Admin user_id
│ reviewed_at                 │
│ rejection_reason            │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│   verification_specializations │
├─────────────────────────────┤
│ id (PK)                     │
│ teacher_id (FK)             │
│ specialization (enum)       │  → quran/hadith/fiqh/aqeedah/
│                             │     arabic/history/calligraphy/
│                             │     islamic_finance/halal_certification
│ proficiency_level (enum)    │  → beginner/intermediate/advanced/expert
│ verified (bool)             │
│ verified_by (FK, nullable)  │
│ verified_at                 │
│ supporting_doc_id (FK)      │  → Links to verification_documents
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXISTING TABLES (Keep)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

bundles              → Course packages (keep as-is)
bundle_items         → Lessons within bundles (keep as-is)
enrollments          → Student bundle enrollments (keep as-is)
feedback             → Session ratings (keep as-is)
journal_entries      → Student notes (keep as-is)
onboarding_responses → User preferences (keep as-is)
```

### New Enums

```sql
-- Payment status
CREATE TYPE payment_status AS ENUM (
  'pending',      -- Created, awaiting payment
  'held',         -- Payment received, in escrow
  'completed',    -- Session confirmed, funds released
  'refunded',     -- Fully or partially refunded
  'failed',       -- Payment failed
  'disputed'      -- Under dispute
);

-- Booking slot status
CREATE TYPE slot_status AS ENUM (
  'available',    -- Open for booking
  'held',         -- Temporarily held during checkout
  'booked',       -- Confirmed booking
  'blocked'       -- Manually blocked by teacher
);

-- Session booking type
CREATE TYPE booking_type AS ENUM (
  'hourly',       -- Single session purchase
  'bundle',       -- Part of bundle enrollment
  'trial'         -- Free trial session
);

-- Verification document type
CREATE TYPE document_type AS ENUM (
  'certificate',
  'ijazah',
  'degree',
  'id_document',
  'reference_letter',
  'other'
);

-- Verification level
CREATE TYPE verification_level AS ENUM (
  'none',         -- Not verified
  'basic',        -- ID verified
  'full',         -- ID + credentials verified
  'scholar'       -- Fully vetted, featured scholar
);

-- Teacher specialization
CREATE TYPE specialization AS ENUM (
  'quran',
  'tajweed',
  'hadith',
  'fiqh',
  'aqeedah',
  'arabic',
  'islamic_history',
  'calligraphy',
  'spirituality',
  'islamic_finance',
  'halal_certification',
  'islamic_law'
);
```

---

## Payments & Escrow System

### Payment Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PAYMENT FLOW                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  STUDENT                      PLATFORM                       TEACHER            │
│  ───────                      ────────                       ───────            │
│                                                                                 │
│  ┌─────────────┐                                                                │
│  │ Select slot │                                                                │
│  │ or bundle   │                                                                │
│  └──────┬──────┘                                                                │
│         │                                                                       │
│         ▼                                                                       │
│  ┌─────────────┐         ┌─────────────────┐                                   │
│  │ Click Book/ │────────►│ Create Payment  │                                   │
│  │ Checkout    │         │ Intent (Stripe) │                                   │
│  └─────────────┘         │ Hold slot temp  │                                   │
│                          └────────┬────────┘                                   │
│                                   │                                             │
│         ┌─────────────────────────┘                                             │
│         │                                                                       │
│         ▼                                                                       │
│  ┌─────────────┐         ┌─────────────────┐                                   │
│  │ Stripe      │────────►│ Webhook:        │                                   │
│  │ Checkout    │         │ payment_intent  │                                   │
│  │ Page        │         │ .succeeded      │                                   │
│  └─────────────┘         └────────┬────────┘                                   │
│                                   │                                             │
│                          ┌────────▼────────┐                                   │
│                          │ Create records: │                                   │
│                          │ • payment (held)│                                   │
│                          │ • session       │                                   │
│                          │ • earning (pend)│                                   │
│                          │ Confirm slot    │                                   │
│                          └────────┬────────┘                                   │
│                                   │                                             │
│  ┌─────────────┐                  │              ┌─────────────┐               │
│  │ Session     │◄─────────────────┼─────────────►│ Session     │               │
│  │ takes place │                  │              │ takes place │               │
│  └──────┬──────┘                  │              └──────┬──────┘               │
│         │                         │                     │                       │
│         │                ┌────────▼────────┐            │                       │
│         │                │ Teacher marks   │◄───────────┘                       │
│         │                │ complete        │                                    │
│         │                └────────┬────────┘                                    │
│         │                         │                                             │
│         │                ┌────────▼────────┐     ┌─────────────┐               │
│         │                │ Escrow release: │────►│ Earning now │               │
│         │                │ 24hr after      │     │ 'available' │               │
│         │                │ completion      │     │             │               │
│         │                │                 │     │ 85% of pay  │               │
│         │                │ Platform keeps  │     └─────────────┘               │
│         │                │ 15% fee         │                                    │
│         │                └─────────────────┘                                    │
│         │                                                                       │
│         ▼                                                                       │
│  ┌─────────────┐                                 ┌─────────────┐               │
│  │ Leave       │                                 │ Request     │               │
│  │ feedback    │                                 │ payout      │               │
│  └─────────────┘                                 │ (min $50)   │               │
│                                                  └──────┬──────┘               │
│                                                         │                       │
│                                        ┌────────────────▼────────────────┐     │
│                                        │ Stripe Connect Transfer         │     │
│                                        │ → Teacher's bank account        │     │
│                                        └─────────────────────────────────┘     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Escrow Rules

| Event | Payment Status | Earning Status | Notes |
|-------|---------------|----------------|-------|
| Checkout complete | `held` | `pending` | Funds captured, not released |
| Session completed | `held` | `pending` | 24hr review window starts |
| 24hr after completion | `completed` | `available` | Funds released to teacher |
| Dispute filed | `disputed` | `held` | Manual review required |
| Refund issued | `refunded` | `forfeited` | Student refunded |
| No-show (student) | `completed` | `available` | Teacher still paid |
| No-show (teacher) | `refunded` | `forfeited` | Auto-refund to student |

### Stripe Integration Points

```typescript
// Edge Functions needed:

// 1. create-checkout-session
// Creates Stripe Checkout for session or bundle purchase
POST /functions/v1/create-checkout-session
Body: { type: 'session' | 'bundle', id: string, studentId: string }
Returns: { checkoutUrl: string }

// 2. stripe-webhook
// Handles all Stripe events
POST /functions/v1/stripe-webhook
Events handled:
  - checkout.session.completed → Create payment, session, earning
  - payment_intent.payment_failed → Mark failed, release hold
  - charge.refunded → Update payment, forfeit earning
  - account.updated → Update teacher stripe_onboarded status

// 3. create-connect-account
// Creates Stripe Connect account for teacher
POST /functions/v1/create-connect-account
Body: { teacherId: string }
Returns: { accountLinkUrl: string }

// 4. create-payout
// Initiates payout to teacher
POST /functions/v1/create-payout
Body: { teacherId: string, amount: number }
Returns: { payoutId: string }
```

---

## Booking & Availability System

### Availability Configuration

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        TEACHER AVAILABILITY SETTINGS                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         Weekly Schedule                                  │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │  Monday    │ ██████████████░░░░░░░░░░ │ 9:00 AM - 2:00 PM               │   │
│  │  Tuesday   │ ██████████████░░░░░░░░░░ │ 9:00 AM - 2:00 PM               │   │
│  │  Wednesday │ ░░░░░░░░░░░░░░░░░░░░░░░░ │ Not available                   │   │
│  │  Thursday  │ ██████████████████████░░ │ 9:00 AM - 6:00 PM               │   │
│  │  Friday    │ ░░░░░░░░░░░░░░░░░░░░░░░░ │ Not available (Jummah)          │   │
│  │  Saturday  │ ████████████░░░░░░░░░░░░ │ 10:00 AM - 1:00 PM              │   │
│  │  Sunday    │ ████████████░░░░░░░░░░░░ │ 10:00 AM - 1:00 PM              │   │
│  │                                                                          │   │
│  │  Timezone: America/New_York                                              │   │
│  │  Session Duration: 60 minutes                                            │   │
│  │  Buffer Between Sessions: 15 minutes                                     │   │
│  │                                                                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         Exceptions                                       │   │
│  ├─────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                          │   │
│  │  Dec 25, 2025  │ Blocked │ Holiday                                      │   │
│  │  Jan 1-7, 2026 │ Blocked │ Vacation                                     │   │
│  │  Mar 15, 2026  │ Custom  │ 2:00 PM - 8:00 PM (special hours)            │   │
│  │                                                                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Slot Generation Logic

```typescript
// Generate available slots for next 4 weeks
function generateSlots(teacherId: string, weeks: number = 4): Slot[] {
  const teacher = getTeacher(teacherId);
  const availability = getWeeklyAvailability(teacherId);
  const exceptions = getExceptions(teacherId, startDate, endDate);
  const existingBookings = getBookedSlots(teacherId, startDate, endDate);

  const slots: Slot[] = [];

  for (let day = 0; day < weeks * 7; day++) {
    const date = addDays(today, day);
    const dayOfWeek = date.getDay();

    // Check for exceptions first
    const exception = exceptions.find(e => isSameDay(e.date, date));
    if (exception && !exception.is_available) continue;

    // Get availability for this day
    const dayAvailability = exception?.is_available
      ? { start: exception.start_time, end: exception.end_time }
      : availability.find(a => a.day_of_week === dayOfWeek);

    if (!dayAvailability) continue;

    // Generate slots within availability window
    let slotStart = combineDateAndTime(date, dayAvailability.start);
    const dayEnd = combineDateAndTime(date, dayAvailability.end);

    while (slotStart < dayEnd) {
      const slotEnd = addMinutes(slotStart, teacher.session_duration);

      // Check if slot conflicts with existing booking
      const isBooked = existingBookings.some(b =>
        isOverlapping(b.start, b.end, slotStart, slotEnd)
      );

      if (!isBooked && slotEnd <= dayEnd) {
        slots.push({
          teacher_id: teacherId,
          start_time: slotStart,
          end_time: slotEnd,
          status: 'available'
        });
      }

      // Add buffer between sessions
      slotStart = addMinutes(slotEnd, teacher.buffer_minutes || 15);
    }
  }

  return slots;
}
```

### Booking Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BOOKING FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ View Teacher │───►│ See Calendar │───►│ Select Slot  │───►│ Hold Slot    │  │
│  │ Profile      │    │ Availability │    │ (click)      │    │ (10 min)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘  │
│                                                                      │          │
│                      ┌───────────────────────────────────────────────┘          │
│                      │                                                          │
│                      ▼                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Booking      │───►│ Checkout     │───►│ Stripe       │───►│ Confirm      │  │
│  │ Confirmed    │    │ Success      │    │ Payment      │    │ Booking      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │
│        │                                                                        │
│        │ Creates:                                                               │
│        │ • Session (status: scheduled)                                          │
│        │ • Payment (status: held)                                               │
│        │ • Earning (status: pending)                                            │
│        │ • Updates slot (status: booked)                                        │
│        │                                                                        │
│        ▼                                                                        │
│  ┌──────────────┐                                                               │
│  │ Email        │                                                               │
│  │ confirmations│                                                               │
│  │ to both      │                                                               │
│  └──────────────┘                                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Teacher Verification System

### Verification Levels

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         VERIFICATION LEVELS                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  LEVEL 0: NONE                                                                  │
│  ├── Can create account                                                         │
│  ├── Cannot publish bundles                                                     │
│  ├── Cannot receive bookings                                                    │
│  └── Profile not visible in search                                              │
│                                                                                 │
│  LEVEL 1: BASIC                                                                 │
│  ├── Email verified                                                             │
│  ├── ID document uploaded & approved                                            │
│  ├── Can publish bundles (review required)                                      │
│  ├── Can receive bookings                                                       │
│  ├── Profile visible with "New Teacher" badge                                   │
│  └── Limited to 5 students initially                                            │
│                                                                                 │
│  LEVEL 2: FULL                                                                  │
│  ├── All of Level 1                                                             │
│  ├── At least 1 credential verified (certificate/degree/ijazah)                 │
│  ├── At least 1 specialization verified                                         │
│  ├── Profile visible with "Verified" badge                                      │
│  ├── No student limit                                                           │
│  └── Can be featured in categories                                              │
│                                                                                 │
│  LEVEL 3: SCHOLAR                                                               │
│  ├── All of Level 2                                                             │
│  ├── Multiple credentials verified                                              │
│  ├── Recognized institution or reference                                        │
│  ├── 10+ positive reviews                                                       │
│  ├── Profile with "Scholar" badge                                               │
│  ├── Featured on homepage                                                       │
│  ├── Can participate in B2B consulting                                          │
│  └── Higher visibility in search                                                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Verification Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         VERIFICATION FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  TEACHER                          ADMIN                                         │
│  ───────                          ─────                                         │
│                                                                                 │
│  ┌─────────────────┐                                                            │
│  │ Upload document │                                                            │
│  │ (certificate,   │                                                            │
│  │  ijazah, etc)   │                                                            │
│  └────────┬────────┘                                                            │
│           │                                                                     │
│           │ Creates verification_documents row                                  │
│           │ status: 'pending'                                                   │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐         ┌─────────────────┐                               │
│  │ Await review    │────────►│ Admin dashboard │                               │
│  │                 │         │ shows pending   │                               │
│  └─────────────────┘         └────────┬────────┘                               │
│                                       │                                         │
│                              ┌────────▼────────┐                               │
│                              │ Review document │                               │
│                              │ • View file     │                               │
│                              │ • Check issuer  │                               │
│                              │ • Verify dates  │                               │
│                              └────────┬────────┘                               │
│                                       │                                         │
│                      ┌────────────────┼────────────────┐                       │
│                      │                │                │                       │
│             ┌────────▼────────┐      │       ┌────────▼────────┐              │
│             │ APPROVE         │      │       │ REJECT          │              │
│             │ status:'approved│      │       │ status:'rejected│              │
│             │ verified_by: X  │      │       │ rejection_reason│              │
│             └────────┬────────┘      │       └────────┬────────┘              │
│                      │               │                │                        │
│  ┌───────────────────▼───────┐      │       ┌────────▼────────┐              │
│  │ Update teacher_profiles:  │      │       │ Email teacher   │              │
│  │ • verification_level++    │      │       │ with reason     │              │
│  │ • Add specialization      │      │       │ Can resubmit    │              │
│  │ • Update badges           │      │       └─────────────────┘              │
│  └───────────────────────────┘      │                                         │
│                                      │                                         │
│                              ┌───────▼───────┐                                │
│                              │ REQUEST INFO  │                                │
│                              │ status:'needs │                                │
│                              │ _more_info'   │                                │
│                              └───────────────┘                                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Verification Badges UI

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BADGE DISPLAY                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────┐                                       │
│  │  Sheikh Ahmad Al-Rashid              │                                       │
│  │  ───────────────────────             │                                       │
│  │  [🏆 Scholar] [✓ Quran] [✓ Tajweed]  │  ← Verification badges               │
│  │                                       │                                       │
│  │  📜 Al-Azhar University              │  ← Verified institution              │
│  │  📖 20 years teaching                │                                       │
│  │  ⭐ 4.9 (127 reviews)                │                                       │
│  │                                       │                                       │
│  │  $45/hour                            │                                       │
│  │  [Book Session]                      │                                       │
│  └──────────────────────────────────────┘                                       │
│                                                                                 │
│  Badge Types:                                                                   │
│  • 🆕 New Teacher      - Basic verification only                               │
│  • ✓ Verified          - Full verification                                      │
│  • 🏆 Scholar          - Scholar level                                          │
│  • ✓ [Specialization]  - Verified in specific area                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## User Flows

### Student: Browse → Book → Learn

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        STUDENT JOURNEY                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ Landing  │──►│ Browse   │──►│ Teacher  │──►│ View     │──►│ Sign up  │     │
│  │ Page     │   │ Teachers │   │ Profile  │   │ Calendar │   │ /Login   │     │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └────┬─────┘     │
│                                                                    │           │
│       ┌──────────────────────────────────────────────────────────┘           │
│       │                                                                        │
│       ▼                                                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ Complete │──►│ Select   │──►│ Checkout │──►│ Session  │──►│ Attend   │     │
│  │ Onboard  │   │ Time Slot│   │ (Stripe) │   │ Confirmed│   │ Session  │     │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └────┬─────┘     │
│                                                                    │           │
│       ┌──────────────────────────────────────────────────────────┘           │
│       │                                                                        │
│       ▼                                                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                                   │
│  │ Session  │──►│ Leave    │──►│ Book     │                                   │
│  │ Complete │   │ Feedback │   │ Again?   │──► (loop back to calendar)        │
│  └──────────┘   └──────────┘   └──────────┘                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Teacher: Onboard → Verify → Teach → Earn

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         TEACHER JOURNEY                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ Sign up  │──►│ Basic    │──►│ Upload   │──►│ Set      │──►│ Connect  │     │
│  │ as Teacher│  │ Profile  │   │ Docs     │   │ Avail-   │   │ Stripe   │     │
│  └──────────┘   └──────────┘   └──────────┘   │ ability  │   └────┬─────┘     │
│                                               └──────────┘        │           │
│       ┌──────────────────────────────────────────────────────────┘           │
│       │                                                                        │
│       ▼                                                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ Await    │──►│ Profile  │──►│ Receive  │──►│ Conduct  │──►│ Mark     │     │
│  │ Verify   │   │ Goes Live│   │ Booking  │   │ Session  │   │ Complete │     │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └────┬─────┘     │
│                                                                    │           │
│       ┌──────────────────────────────────────────────────────────┘           │
│       │                                                                        │
│       ▼                                                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                                   │
│  │ Earning  │──►│ Request  │──►│ Receive  │                                   │
│  │ Available│   │ Payout   │   │ Payment  │                                   │
│  │ (24hr)   │   │ (min $50)│   │ (bank)   │                                   │
│  └──────────┘   └──────────┘   └──────────┘                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Route Maps

### B2C Learning Portal

```
/                           → Landing Page
├── /teachers               → Teacher Listings (search, filter)
│   └── /teachers/:id       → Teacher Profile + Calendar
│       └── /book/:id       → Booking Flow (slot selection)
├── /bundles                → Bundle Listings
│   └── /bundles/:id        → Bundle Detail + Enroll CTA
├── /checkout/:type/:id     → Stripe Checkout (session/bundle)
├── /login                  → Authentication
├── /onboarding             → New User Setup
├── /dashboard              → Student Dashboard
│   ├── /enrollments/:id    → Enrollment Detail
│   ├── /sessions/:id       → Session Detail (join link)
│   └── /settings           → Profile Settings
└── /about                  → About Page
```

### Teacher Portal

```
/teach                      → Teacher Dashboard (overview)
├── /teach/profile          → Edit Teacher Profile
├── /teach/availability     → Set Weekly Schedule + Exceptions
├── /teach/sessions         → Upcoming & Past Sessions
│   └── /teach/sessions/:id → Session Detail (mark complete)
├── /teach/bundles          → My Bundles
│   ├── /teach/bundles/new  → Create Bundle
│   └── /teach/bundles/:id  → Edit Bundle
├── /teach/students         → My Students
├── /teach/earnings         → Earnings Dashboard
│   └── /teach/payouts      → Payout History & Request
├── /teach/verification     → Upload Credentials
└── /teach/settings         → Account Settings
```

### B2B Business Portal (P3 - Future)

```
/business                   → Business Landing
├── /business/signup        → Company Registration
├── /business/dashboard     → Company Dashboard
├── /business/projects      → My Projects
│   ├── /business/projects/new    → Post Project
│   └── /business/projects/:id    → Project Detail
├── /business/experts       → Expert Search
│   └── /business/experts/:id     → Expert Profile
├── /business/contracts     → Active Contracts
│   └── /business/contracts/:id   → Contract Detail
└── /business/billing       → Invoices & Payments
```

---

## Data Flow & Hooks

### Hook Structure

```typescript
// Existing hooks (keep)
useTeachers()              → teacher_profiles (public, verified)
useTeacher(id)             → teacher_profiles + availability
useBundles()               → bundles (published)
useBundle(id)              → bundles + bundle_items
useEnrollments()           → enrollments (own)
useEnrollmentById(id)      → enrollment + sessions + progress
useSessions()              → sessions (own as student or teacher)
useProfile()               → profiles (own)
useOnboardingResponses()   → onboarding_responses (own)

// New hooks (P0 - Payments)
usePayments()              → payments (own as student)
usePayment(id)             → payment details
useTeacherEarnings()       → teacher_earnings (own as teacher)
useTeacherPayouts()        → teacher_payouts (own)
useCreateCheckout()        → mutation: create Stripe checkout
useRequestPayout()         → mutation: request payout

// New hooks (P1 - Booking)
useTeacherAvailability(id) → teacher_availability + exceptions
useAvailableSlots(id)      → booking_slots (available only)
useBookSlot()              → mutation: hold slot + create checkout
useMyAvailability()        → teacher_availability (own)
useUpdateAvailability()    → mutation: update weekly schedule
useAddException()          → mutation: add date exception

// New hooks (P2 - Verification)
useMyVerificationDocs()    → verification_documents (own)
useUploadDocument()        → mutation: upload + create record
useMySpecializations()     → verification_specializations (own)

// Admin hooks (verification review)
usePendingVerifications()  → verification_documents (pending)
useReviewDocument()        → mutation: approve/reject
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   User Action              Hook                      Tables Affected            │
│   ───────────              ────                      ───────────────            │
│                                                                                 │
│   PAYMENTS (P0)                                                                 │
│   ───────────────────────────────────────────────────────────────────────────  │
│   Buy session          →   useCreateCheckout()   →   booking_slots (hold)      │
│                                                       ↓ (webhook)               │
│                                                      payments                   │
│                                                      sessions                   │
│                                                      teacher_earnings           │
│                                                                                 │
│   View earnings        →   useTeacherEarnings()  →   teacher_earnings          │
│   Request payout       →   useRequestPayout()    →   teacher_payouts           │
│                                                                                 │
│   BOOKING (P1)                                                                  │
│   ───────────────────────────────────────────────────────────────────────────  │
│   View availability    →   useAvailableSlots()   →   booking_slots             │
│   Set availability     →   useUpdateAvailability()→  teacher_availability      │
│   Add exception        →   useAddException()     →   availability_exceptions   │
│   Book slot            →   useBookSlot()         →   booking_slots, sessions   │
│                                                                                 │
│   VERIFICATION (P2)                                                             │
│   ───────────────────────────────────────────────────────────────────────────  │
│   Upload document      →   useUploadDocument()   →   verification_documents    │
│                                                      (storage: credentials/)    │
│   Admin approves       →   useReviewDocument()   →   verification_documents    │
│                                                      teacher_profiles           │
│                                                      verification_specializations│
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Security Model (RLS)

### Row Level Security Policies

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Anyone can view profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TEACHER PROFILES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Only verified teachers are publicly visible
CREATE POLICY "teacher_profiles_select" ON teacher_profiles FOR SELECT
  USING (is_verified = true OR user_id = auth.uid());

-- Teachers can only update their own profile
CREATE POLICY "teacher_profiles_update" ON teacher_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- PAYMENTS (NEW)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Students see their own payments, teachers see payments to them
CREATE POLICY "payments_select" ON payments FOR SELECT
  USING (student_id = auth.uid() OR teacher_id = auth.uid());

-- Only system (service role) can insert/update payments
-- Handled via Edge Functions with service role key

-- ═══════════════════════════════════════════════════════════════════════════════
-- TEACHER EARNINGS (NEW)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Teachers see only their own earnings
CREATE POLICY "teacher_earnings_select" ON teacher_earnings FOR SELECT
  USING (teacher_id = auth.uid());

-- Only system can insert/update earnings

-- ═══════════════════════════════════════════════════════════════════════════════
-- TEACHER PAYOUTS (NEW)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Teachers see only their own payouts
CREATE POLICY "teacher_payouts_select" ON teacher_payouts FOR SELECT
  USING (teacher_id = auth.uid());

-- Teachers can request payouts (insert)
CREATE POLICY "teacher_payouts_insert" ON teacher_payouts FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- BOOKING SLOTS (NEW)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Anyone can view available slots
CREATE POLICY "booking_slots_select" ON booking_slots FOR SELECT
  USING (status = 'available' OR teacher_id = auth.uid());

-- Only teachers can manage their slots
CREATE POLICY "booking_slots_update" ON booking_slots FOR UPDATE
  USING (teacher_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- AVAILABILITY (NEW)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Public can view teacher availability
CREATE POLICY "teacher_availability_select" ON teacher_availability FOR SELECT
  USING (true);

-- Teachers manage their own availability
CREATE POLICY "teacher_availability_all" ON teacher_availability FOR ALL
  USING (teacher_id = auth.uid());

-- Same for exceptions
CREATE POLICY "availability_exceptions_select" ON availability_exceptions FOR SELECT
  USING (true);

CREATE POLICY "availability_exceptions_all" ON availability_exceptions FOR ALL
  USING (teacher_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION DOCUMENTS (NEW)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Teachers see their own documents
CREATE POLICY "verification_documents_select" ON verification_documents FOR SELECT
  USING (teacher_id = auth.uid() OR is_admin(auth.uid()));

-- Teachers can upload documents
CREATE POLICY "verification_documents_insert" ON verification_documents FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

-- Only admins can update (approve/reject)
CREATE POLICY "verification_documents_update" ON verification_documents FOR UPDATE
  USING (is_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════════════════════════
-- SESSIONS (Enhanced)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Students and teachers see their sessions
CREATE POLICY "sessions_select" ON sessions FOR SELECT
  USING (student_id = auth.uid() OR teacher_id = auth.uid());

-- Students can create sessions (via booking)
CREATE POLICY "sessions_insert" ON sessions FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Teachers can update session status (complete, add notes)
CREATE POLICY "sessions_update_teacher" ON sessions FOR UPDATE
  USING (teacher_id = auth.uid())
  WITH CHECK (
    -- Teachers can only set certain statuses
    status IN ('confirmed', 'completed', 'no_show')
  );

-- Students can update their notes only
CREATE POLICY "sessions_update_student" ON sessions FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (
    -- Students can only update notes and cancel
    status IN ('cancelled')
  );
```

### Helper Functions

```sql
-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is verified teacher
CREATE OR REPLACE FUNCTION is_verified_teacher(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teacher_profiles
    WHERE user_id = user_id AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## External Integrations

### Stripe Integration

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Stripe Checkout | Session/bundle payments | Edge Function: `create-checkout-session` |
| Stripe Connect | Teacher onboarding | Edge Function: `create-connect-account` |
| Stripe Transfers | Teacher payouts | Edge Function: `create-payout` |
| Stripe Webhooks | Payment events | Edge Function: `stripe-webhook` |

### Environment Variables

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
PUBLIC_APP_URL=https://sacredchain.com
```

### Webhook Events Handled

```typescript
// stripe-webhook Edge Function
switch (event.type) {
  case 'checkout.session.completed':
    // Create payment, session, earning records
    // Update booking slot to 'booked'
    // Send confirmation emails
    break;

  case 'payment_intent.payment_failed':
    // Release held slot
    // Mark payment as failed
    break;

  case 'charge.refunded':
    // Update payment status
    // Forfeit teacher earning
    // Update session status
    break;

  case 'account.updated':
    // Update teacher stripe_onboarded status
    break;

  case 'transfer.created':
  case 'transfer.failed':
    // Update payout status
    break;
}
```

---

## Status

- [x] Gate 0: IDEA - Complete
- [x] Gate 1: MARKET - Complete
- [x] Gate 2: SCOPE - Locked
- [x] Gate 3: ARCHITECTURE - **COMPLETE**
- [ ] Gate 4: EXECUTION
- [ ] Gate 5: VALIDATION
