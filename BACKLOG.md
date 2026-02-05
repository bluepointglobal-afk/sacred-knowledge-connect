# BACKLOG: Sacredchain

> Gate 4 Output | Generated: 2025-01-20
> Full feature backlog for Sacredchain marketplace

---

## Priority Legend

| Priority | Meaning | Status |
|----------|---------|--------|
| **P0** | Critical - Ship first | 🔄 Active |
| **P1** | High - Ship next | ⏳ Pending |
| **P2** | Medium - Ship after P1 | ⏳ Pending |
| **P3** | Low - Future phase | 📋 Planned |

---

## P0: Complete Stripe Payments

**Status:** 🔄 In Progress
**Task File:** `tasks/tasks-stripe-payments.md`
**Branch:** `feat/stripe-payments`

### Completed Stories (SP-01 to SP-06)

| ID | Title | Status |
|----|-------|--------|
| SP-01 | Stripe Setup & Configuration | ✅ Done |
| SP-02 | Database Schema (payments, earnings, payouts) | ✅ Done |
| SP-03 | Payment Hooks | ✅ Done |
| SP-04 | Checkout UI Components | ✅ Done |
| SP-05 | BundleDetail Payment Flow | ✅ Done |
| SP-06 | Teacher Earnings Hook & Page | ✅ Done |

### Remaining Stories (SP-07 to SP-13)

| ID | Title | Status | Description |
|----|-------|--------|-------------|
| SP-07 | Session Purchase Checkout | ⏳ Pending | Stripe Checkout for hourly session booking |
| SP-08 | Escrow Hold System | ⏳ Pending | Hold payment on checkout, don't release immediately |
| SP-09 | Escrow Release Logic | ⏳ Pending | Release funds 24hr after session completion |
| SP-10 | Stripe Connect Onboarding | ⏳ Pending | Teacher onboarding to receive payouts |
| SP-11 | Payout Request System | ⏳ Pending | Teachers request payouts ($50 min) |
| SP-12 | Complete Webhook Handler | ⏳ Pending | Handle all Stripe events (refunds, disputes, etc.) |
| SP-13 | Edge Functions Deployment | ⏳ Pending | Deploy all Supabase Edge Functions |

---

## P1: Session Booking Flow

**Status:** ⏳ Pending
**Task File:** `tasks/tasks-session-booking.md`
**Branch:** `feat/session-booking`
**Depends On:** P0 Complete

| ID | Title | Description |
|----|-------|-------------|
| SB-01 | Availability Schema | teacher_availability, availability_exceptions tables |
| SB-02 | Weekly Schedule UI | Teacher sets Mon-Sun availability |
| SB-03 | Availability Exceptions | Block dates, custom hours |
| SB-04 | Slot Generation | Generate bookable slots from availability |
| SB-05 | Booking Calendar UI | Student sees available slots |
| SB-06 | Slot Hold System | 10-min temporary hold during checkout |
| SB-07 | Booking Confirmation | Create session on payment success |
| SB-08 | Reschedule Flow | Student/teacher reschedule |
| SB-09 | Cancel Flow | Cancellation with refund rules |
| SB-10 | Session Reminders | Email/notification before session |
| SB-11 | Timezone Handling | Proper timezone conversion |

---

## P2: Teacher Verification System

**Status:** ⏳ Pending
**Task File:** `tasks/tasks-teacher-verification.md`
**Branch:** `feat/teacher-verification`
**Depends On:** Core platform stable

| ID | Title | Description |
|----|-------|-------------|
| TV-01 | Verification Schema | verification_documents, specializations tables |
| TV-02 | Document Upload | Teacher uploads certificates, ijazah, degrees |
| TV-03 | Verification Levels | none → basic → full → scholar |
| TV-04 | Admin Dashboard | Review pending verifications |
| TV-05 | Approval Workflow | Approve/reject with reason |
| TV-06 | Verification Badges | Display badges on teacher profile |
| TV-07 | Specialization Verify | Verify specific specializations |
| TV-08 | Visibility Rules | Unverified teachers hidden from search |

---

## P3: B2B Business Portal

**Status:** 📋 Planned (Future)
**Task File:** `tasks/tasks-b2b-portal.md`
**Branch:** `feat/b2b-portal`
**Depends On:** P0, P1, P2 complete

| ID | Title | Description |
|----|-------|-------------|
| B2B-01 | Portal Layout | Separate professional theme |
| B2B-02 | Company Registration | Business account signup |
| B2B-03 | Project Posting | Post consulting projects |
| B2B-04 | Expert Search | Search verified scholars |
| B2B-05 | Proposal System | Experts bid on projects |
| B2B-06 | Contract Management | Agreements, milestones |
| B2B-07 | Milestone Payments | Pay per milestone |
| B2B-08 | Enterprise Invoicing | Invoices for accounting |

---

## Completed Features (Existing)

### Authentication & Profiles
- [x] Email/password authentication (Supabase)
- [x] Google OAuth
- [x] User roles (student, teacher, admin)
- [x] Auto-create profile on signup
- [x] Profile editing
- [x] Timezone & language preferences

### Teacher Marketplace
- [x] Teacher profiles (bio, headline, qualifications)
- [x] Teacher discovery & search
- [x] Specialization filtering
- [x] Featured teachers
- [x] Hourly rate display
- [x] Teacher ratings

### Bundle System
- [x] Bundle creation by teachers
- [x] Bundle listing & detail pages
- [x] Bundle items/lessons
- [x] Categories & tags
- [x] Bundle status (draft/published/archived)
- [x] Bundle pricing

### Enrollment & Progress
- [x] Student enrollment
- [x] Progress tracking
- [x] Enrollment status management
- [x] Sessions per enrollment

### Sessions (Basic)
- [x] Session scheduling
- [x] Session status (scheduled/completed/cancelled)
- [x] Session notes
- [x] Meeting URL support

### Feedback & Reviews
- [x] Session ratings (1-5 stars)
- [x] Review text
- [x] Teacher rating aggregation

### Other
- [x] Student onboarding flow
- [x] Student dashboard
- [x] Journal entries

---

## Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| Comprehensive error handling | Medium | Especially payment errors |
| Loading skeletons | Low | Better UX during loads |
| Email notifications | Medium | Session reminders, payment receipts |
| Mobile responsiveness | Medium | Full mobile audit |
| Accessibility (WCAG) | Medium | Screen reader support |

---

## Shipping Order

```
NOW
 │
 ├─► P0: Stripe Payments (SP-07 to SP-13)
 │    └── Session checkout, escrow, Connect, payouts
 │
 ▼
NEXT
 │
 ├─► P1: Session Booking
 │    └── Availability, calendar, slot booking
 │
 ▼
THEN
 │
 ├─► P2: Teacher Verification
 │    └── Credentials, badges, admin review
 │
 ▼
FUTURE
 │
 └─► P3: B2B Portal
      └── Business consulting marketplace
```

---

## Current Sprint: P0 Completion

**Stories to complete:** SP-07 to SP-13
**Run:** `make ship`
