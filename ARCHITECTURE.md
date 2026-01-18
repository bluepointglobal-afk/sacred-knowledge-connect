# SacredChain Architecture & User Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Pages     │  │ Components  │  │   Hooks     │  │  Contexts   │        │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤        │
│  │ Index       │  │ Header      │  │ useTeachers │  │ AuthContext │        │
│  │ Teachers    │  │ Footer      │  │ useBundles  │  │             │        │
│  │ TeacherProf │  │ Badge       │  │ useEnroll   │  │             │        │
│  │ Bundles     │  │ Button      │  │ useSessions │  │             │        │
│  │ BundleDetail│  │ Dialog      │  │ useProfile  │  │             │        │
│  │ Onboarding  │  │ Input       │  │ useOnboard  │  │             │        │
│  │ Dashboard   │  │ Card        │  │             │  │             │        │
│  │ EnrollDetail│  │             │  │             │  │             │        │
│  │ Login       │  │             │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React Query (TanStack Query)                      │   │
│  │         Caching • Invalidation • Background Refetch                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     │ HTTPS
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE (Backend)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   Auth Service   │  │   Database       │  │   Storage        │          │
│  ├──────────────────┤  │   (PostgreSQL)   │  │   (S3-compat)    │          │
│  │ Email/Password   │  ├──────────────────┤  ├──────────────────┤          │
│  │ Google OAuth     │  │ profiles         │  │ avatars          │          │
│  │ JWT Tokens       │  │ teacher_profiles │  │ bundle_covers    │          │
│  │ Session Mgmt     │  │ bundles          │  │ documents        │          │
│  └──────────────────┘  │ bundle_items     │  └──────────────────┘          │
│                        │ enrollments      │                                 │
│  ┌──────────────────┐  │ sessions         │  ┌──────────────────┐          │
│  │   RLS Policies   │  │ feedback         │  │   Edge Functions │          │
│  ├──────────────────┤  │ onboarding_resp  │  ├──────────────────┤          │
│  │ Row-level access │  │ journal_entries  │  │ (Future: Email,  │          │
│  │ per user/role    │  └──────────────────┘  │  Payments, etc)  │          │
│  └──────────────────┘                        └──────────────────┘          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Triggers & Functions                         │   │
│  │  • Auto-create profile on signup                                     │   │
│  │  • Update timestamps on changes                                      │   │
│  │  • Increment enrollment counts                                       │   │
│  │  • Update progress on session completion                             │   │
│  │  • Recalculate teacher ratings on feedback                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
┌─────────────────────┐       ┌─────────────────────┐
│      profiles       │       │   teacher_profiles  │
├─────────────────────┤       ├─────────────────────┤
│ id (PK, FK auth)    │◄──────│ user_id (FK)        │
│ email               │       │ id (PK)             │
│ full_name           │       │ bio                 │
│ avatar_url          │       │ headline            │
│ role                │       │ specializations[]   │
│ timezone            │       │ qualifications[]    │
│ language            │       │ hourly_rate_cents   │
│ created_at          │       │ is_verified         │
│ updated_at          │       │ is_featured         │
└─────────────────────┘       │ average_rating      │
         │                    │ total_sessions      │
         │                    │ total_students      │
         │                    └─────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐
│ onboarding_responses│       │      bundles        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ teacher_id (FK)     │
│ step_key            │       │ title               │
│ response (JSONB)    │       │ description         │
│ created_at          │       │ price_cents         │
│ updated_at          │       │ duration_weeks      │
└─────────────────────┘       │ total_sessions      │
                              │ category            │
                              │ level               │
                              │ status (enum)       │
                              │ is_featured         │
                              │ total_enrollments   │
                              └─────────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
         ▼                              ▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│    bundle_items     │       │    enrollments      │       │      sessions       │
├─────────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │       │ id (PK)             │
│ bundle_id (FK)      │       │ student_id (FK)     │       │ teacher_id (FK)     │
│ title               │       │ bundle_id (FK)      │       │ student_id (FK)     │
│ description         │       │ status (enum)       │       │ bundle_id (FK)      │
│ item_type           │       │ progress_percent    │       │ enrollment_id (FK)  │
│ content_url         │       │ sessions_completed  │       │ scheduled_at        │
│ duration_minutes    │       │ started_at          │       │ duration_minutes    │
│ sort_order          │       │ completed_at        │       │ status (enum)       │
│ is_preview          │       │ created_at          │       │ meeting_url (Zoom)  │
└─────────────────────┘       └─────────────────────┘       │ notes_teacher       │
                                        │                   │ notes_student       │
                                        │                   │ completed_at        │
                                        │                   └─────────────────────┘
                                        │                             │
                                        │                             │
                                        │                             ▼
                                        │                   ┌─────────────────────┐
                                        │                   │      feedback       │
                                        │                   ├─────────────────────┤
                                        │                   │ id (PK)             │
                                        │                   │ session_id (FK, UQ) │
                                        │                   │ student_id (FK)     │
                                        │                   │ teacher_id (FK)     │
                                        │                   │ rating (1-5)        │
                                        │                   │ review_text         │
                                        │                   │ created_at          │
                                        │                   └─────────────────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │   journal_entries   │
                              ├─────────────────────┤
                              │ id (PK)             │
                              │ user_id (FK)        │
                              │ bundle_id (FK)      │
                              │ session_id (FK)     │
                              │ title               │
                              │ content             │
                              │ mood                │
                              │ tags[]              │
                              │ is_private          │
                              └─────────────────────┘
```

---

## User Flows

### 1. New User Journey (Student)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Landing    │───►│   Browse     │───►│   View       │───►│   Sign Up    │
│   Page (/)   │    │   Teachers   │    │   Teacher    │    │   /Login     │
└──────────────┘    │   /Bundles   │    │   /Bundle    │    └──────┬───────┘
                    └──────────────┘    └──────────────┘           │
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Onboarding  │───►│   Complete   │───►│   Dashboard  │───►│   Enroll in  │
│  (Prefs)     │    │   Profile    │    │   /dashboard │    │   Bundle     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Enrollment  │───►│  Schedule    │───►│   Join Zoom  │───►│   Leave      │
│  Detail Page │    │  Session     │    │   Session    │    │   Feedback   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### 2. Authentication Flow

```
                    ┌─────────────────────┐
                    │   User clicks       │
                    │   "Sign In"         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   /login page       │
                    │   (Email or Google) │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼─────────┐     │     ┌──────────▼──────────┐
    │   Email/Password  │     │     │   Google OAuth      │
    │   Sign In         │     │     │   Redirect          │
    └─────────┬─────────┘     │     └──────────┬──────────┘
              │               │                │
              └───────────────┼────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Supabase Auth   │
                    │   Creates Session │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Auto-create     │
                    │   Profile (trigger)│
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼─────────┐    │    ┌──────────▼──────────┐
    │   Has redirect?   │    │    │   No redirect       │
    │   → Go to URL     │    │    │   → /dashboard      │
    └───────────────────┘    │    └─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Onboarding    │
                    │   Complete?     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐        ┌──────────▼──────────┐
    │   No → Prompt     │        │   Yes → Show        │
    │   /onboarding     │        │   Full Dashboard    │
    └───────────────────┘        └─────────────────────┘
```

### 3. Enrollment & Session Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENROLLMENT FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ View Bundle │───►│ Click       │───►│ Check Auth  │───►│ Check       │  │
│  │ Detail      │    │ "Enroll"    │    │ (logged in?)│    │ Onboarding  │  │
│  └─────────────┘    └─────────────┘    └──────┬──────┘    └──────┬──────┘  │
│                                               │                   │         │
│                            No ◄───────────────┤                   │         │
│                             │                 │ Yes               │         │
│                    ┌────────▼────────┐       │          ┌────────▼────────┐│
│                    │ Redirect to     │       │          │ Complete?       ││
│                    │ /login?redirect │       │          └────────┬────────┘│
│                    └─────────────────┘       │      No ◄─────────┤         │
│                                              │       │           │ Yes     │
│                                     ┌────────▼───────▼───┐       │         │
│                                     │ Store redirect in  │       │         │
│                                     │ sessionStorage     │       │         │
│                                     │ → /onboarding      │       │         │
│                                     └────────────────────┘       │         │
│                                                                  │         │
│                                              ┌───────────────────┘         │
│                                              │                             │
│                                     ┌────────▼────────┐                    │
│                                     │ Create          │                    │
│                                     │ Enrollment Row  │                    │
│                                     └────────┬────────┘                    │
│                                              │                             │
│                                     ┌────────▼────────┐                    │
│                                     │ Redirect to     │                    │
│                                     │ /enrollments/:id│                    │
│                                     └─────────────────┘                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           SESSION LIFECYCLE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STUDENT                              TEACHER                              │
│   ───────                              ───────                              │
│                                                                             │
│   ┌─────────────┐                                                          │
│   │ Schedule    │                                                          │
│   │ Session     │──────────────────────────────────────┐                   │
│   │ (date/time) │                                      │                   │
│   └─────────────┘                                      │                   │
│         │                                              │                   │
│         │ Creates session                              │                   │
│         │ status='scheduled'                           │                   │
│         │                                              ▼                   │
│         │                                    ┌─────────────────┐           │
│         │                                    │ Add Zoom Link   │           │
│         │                                    │ (meeting_url)   │           │
│         │                                    └────────┬────────┘           │
│         │                                             │                   │
│         ▼                                             │                   │
│   ┌─────────────┐                                     │                   │
│   │ See "Join   │◄────────────────────────────────────┘                   │
│   │ Session"    │                                                          │
│   │ button      │                                                          │
│   └──────┬──────┘                                                          │
│          │                                                                 │
│          │ Clicks link → Opens Zoom                                        │
│          │                                                                 │
│          ▼                                                                 │
│   ┌─────────────┐                           ┌─────────────────┐           │
│   │ Session     │                           │ Mark Complete   │           │
│   │ Takes Place │──────────────────────────►│ status=         │           │
│   │ (Zoom call) │                           │ 'completed'     │           │
│   └─────────────┘                           └────────┬────────┘           │
│                                                      │                    │
│                                    Triggers:         │                    │
│                                    • Update progress │                    │
│                                    • Increment count │                    │
│                                                      │                    │
│   ┌─────────────┐                                    │                    │
│   │ Leave       │◄───────────────────────────────────┘                    │
│   │ Feedback    │                                                          │
│   │ (1-5 stars) │                                                          │
│   └──────┬──────┘                                                          │
│          │                                                                 │
│          │ Creates feedback row                                            │
│          │ Triggers: Update teacher rating                                 │
│          ▼                                                                 │
│   ┌─────────────┐                                                          │
│   │ Dashboard   │                                                          │
│   │ Updated     │                                                          │
│   └─────────────┘                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Route Map

```
/                       → Landing Page (Index)
/teachers               → Teacher Listings
/teachers/:id           → Teacher Profile Detail
/bundles                → Bundle Listings
/bundles/:id            → Bundle Detail (+ Enroll CTA)
/login                  → Authentication (Email/Google)
/onboarding             → Learning Preferences Setup
/dashboard              → Student Dashboard
/enrollments/:id        → Enrollment Detail (Sessions, Feedback)
/business               → Business/Enterprise Page
*                       → 404 Not Found
```

---

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Action          Hook                    Supabase Table    │
│  ───────────          ────                    ──────────────    │
│                                                                 │
│  Browse Teachers  →   useTeachers()       →   teacher_profiles  │
│  View Teacher     →   useTeacher(id)      →   teacher_profiles  │
│  Browse Bundles   →   useBundles()        →   bundles           │
│  View Bundle      →   useBundle(id)       →   bundles           │
│  Teacher Bundles  →   useBundlesByTeacher →   bundles           │
│                                                                 │
│  Sign In          →   AuthContext         →   auth.users        │
│  Get Profile      →   useProfile()        →   profiles          │
│  Save Onboarding  →   useSaveOnboarding() →   onboarding_resp   │
│  Get Onboarding   →   useOnboardingResp() →   onboarding_resp   │
│                                                                 │
│  Enroll           →   useCreateEnrollment →   enrollments       │
│  My Enrollments   →   useEnrollments()    →   enrollments       │
│  Enrollment Detail→   useEnrollmentById() →   enrollments       │
│                                                                 │
│  Schedule Session →   useCreateSession()  →   sessions          │
│  Get Sessions     →   useSessionsByEnroll →   sessions          │
│  Upcoming Sessions→   useUpcomingSessions →   sessions          │
│  Update Session   →   useUpdateSession()  →   sessions          │
│                                                                 │
│  Leave Feedback   →   useCreateFeedback() →   feedback          │
│  Get Feedback     →   useFeedbackBySession→   feedback          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Model (RLS)

```
┌─────────────────────────────────────────────────────────────────┐
│                     ROW LEVEL SECURITY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Table               SELECT              INSERT/UPDATE          │
│  ─────               ──────              ─────────────          │
│                                                                 │
│  profiles            Anyone              Own profile only       │
│  teacher_profiles    Verified=public     Own profile only       │
│  bundles             Published=public    Teacher owns bundle    │
│  bundle_items        Follow bundle       Teacher owns bundle    │
│  onboarding_resp     Own only            Own only               │
│  enrollments         Own + teacher       Own (create)           │
│  sessions            Own + teacher       Student schedules      │
│                                          Teacher updates        │
│  feedback            Own + teacher       Student for completed  │
│  journal_entries     Own only            Own only               │
│                                                                 │
│  Key Restrictions:                                              │
│  • Students cannot mark sessions as 'completed'                 │
│  • Students cannot set enrollment status to 'completed'         │
│  • Only verified teachers are publicly visible                  │
│  • Only published bundles are publicly visible                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | React Query (TanStack) |
| Routing | React Router v6 |
| Animation | Framer Motion |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + OAuth) |
| Storage | Supabase Storage |
| Video | External Zoom links (manual) |
