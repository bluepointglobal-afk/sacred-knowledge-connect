# SCOPE.md

## Product Overview

**Product Name:** SacredChain (Sacred Knowledge Connect)
**Type:** B2C SaaS Platform - Islamic Education Marketplace
**Purpose:** Connect verified Islamic teachers with students for personalized learning bundles (courses)

---

## Target Users

### Primary: Students (Learners)
- Muslims seeking Islamic education (Quran, Tajweed, Arabic, Hadith, Fiqh)
- Parents enrolling children in Islamic studies
- Adults pursuing self-paced or instructor-led learning
- Converts seeking foundational Islamic knowledge

### Secondary: Teachers (Providers)
- Certified Quran/Islamic studies instructors
- Hafiz/Hafiza offering memorization coaching
- Arabic language teachers
- Islamic scholars offering specialized courses

---

## Core Value Proposition

1. **Verified Teachers** - All teachers undergo verification before listing
2. **Structured Learning** - Bundled courses with clear curricula
3. **Progress Tracking** - Real-time session and progress visibility
4. **Feedback System** - Ratings and reviews build trust
5. **Flexible Scheduling** - Students book sessions at convenient times

---

## Feature Matrix

### Student Features

| Feature | Status | Priority |
|---------|--------|----------|
| Email/Google Auth | COMPLETE | P0 |
| Learning Preferences Onboarding | COMPLETE | P0 |
| Browse Verified Teachers | COMPLETE | P0 |
| Browse Published Bundles | COMPLETE | P0 |
| Bundle Detail & Curriculum | COMPLETE | P0 |
| Enroll in Bundle | COMPLETE | P0 |
| Student Dashboard | COMPLETE | P0 |
| Schedule Sessions | COMPLETE | P0 |
| Join Zoom Sessions | COMPLETE | P0 |
| Leave Feedback/Ratings | COMPLETE | P0 |
| Progress Tracking | COMPLETE | P0 |
| Teacher Matching (Mock) | PARTIAL | P1 |
| Payment Processing | MISSING | P0 |
| Certificates | MISSING | P2 |
| Messaging with Teacher | MISSING | P1 |

### Teacher Features

| Feature | Status | Priority |
|---------|--------|----------|
| Public Profile Display | COMPLETE | P0 |
| Receive Session Bookings | COMPLETE | P0 |
| Add Zoom Links | COMPLETE | P0 |
| Mark Sessions Complete | COMPLETE | P0 |
| Receive Feedback | COMPLETE | P0 |
| Aggregate Ratings | COMPLETE | P0 |
| Teacher Dashboard | MISSING | P0 |
| Create/Edit Bundles | MISSING | P0 |
| Manage Bundle Items | MISSING | P0 |
| Earnings Dashboard | MISSING | P0 |
| Payout Management | MISSING | P0 |
| Availability Calendar | MISSING | P1 |
| Student Messaging | MISSING | P1 |

### Platform Features

| Feature | Status | Priority |
|---------|--------|----------|
| Landing Page | COMPLETE | P0 |
| Legal Pages (Privacy/Terms) | COMPLETE | P0 |
| Contact Page | COMPLETE | P0 |
| Business/Enterprise Page | COMPLETE | P2 |
| Admin Dashboard | MISSING | P1 |
| Teacher Verification Flow | MISSING | P1 |
| Email Notifications | MISSING | P1 |
| In-App Notifications | MISSING | P2 |
| Analytics Dashboard | MISSING | P2 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query + React Context |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL + Auth) |
| Security | Row-Level Security (RLS) |
| Testing | Playwright (E2E) |

---

## Database Schema Summary

| Table | Purpose | RLS |
|-------|---------|-----|
| profiles | User accounts (student/teacher/admin) | Public read, self update |
| teacher_profiles | Extended teacher info | Verified public, self manage |
| bundles | Courses/packages | Published visible, teacher manage |
| bundle_items | Lessons within bundles | Via bundle access |
| enrollments | Student registrations | Self + teacher view |
| sessions | Scheduled classes | Self + teacher view |
| feedback | Session reviews | Immutable after creation |
| onboarding_responses | Learning preferences | Private |

---

## Critical User Flows

### Student Journey (COMPLETE)
```
Landing → Browse Teachers/Bundles → View Detail → Login → Onboarding
→ Enroll → Dashboard → Schedule Session → Join Zoom → Complete → Rate
```

### Teacher Journey (INCOMPLETE)
```
Apply → Verification → [NO UI: Create Bundles] → Receive Bookings
→ Add Zoom → Conduct Session → Mark Complete → Receive Rating
```

### Payment Journey (MISSING)
```
Student → Enroll → [NO: Checkout] → [NO: Payment] → [NO: Receipt]
Teacher → [NO: Earnings View] → [NO: Payout Request]
```

---

## Highest-Value Incomplete Features (Ranked)

1. **Stripe Payment Integration** (P0) - No monetization without payments
2. **Teacher Dashboard** (P0) - Teachers can't manage bundles via UI
3. **Admin Dashboard** (P1) - No teacher verification/moderation UI
4. **Matching Algorithm** (P1) - Page exists but uses mock data
5. **Notification System** (P1) - No email/in-app notifications

---

## Out of Scope (Current Phase)

- Mobile native apps (iOS/Android)
- Group class video (only 1:1 via Zoom)
- Content hosting/streaming
- LMS features (quizzes, assignments)
- Multi-language UI (English only)
- Subscription model (course-based only)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Teacher Signup Conversion | 40% apply → verified |
| Student Enrollment Rate | 15% browse → enroll |
| Session Completion Rate | 85% scheduled → completed |
| Student Retention | 60% complete first bundle |
| Average Teacher Rating | 4.5+ stars |
| Monthly GMV | $10K within 6 months |

---

## Next Phase Recommendation

**PHASE: PAYMENTS** - Implement Stripe integration to:
1. Enable paid enrollments
2. Capture revenue at checkout
3. Track teacher earnings
4. Enable payouts to teachers

Without payments, the marketplace has no sustainable business model.
