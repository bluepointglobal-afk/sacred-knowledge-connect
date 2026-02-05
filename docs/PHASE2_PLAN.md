# SacredChain — Phase 2 Dev Plan (Teacher Funnel + Course Setup)

Owner: Product/Engineering

Context (from Phase 4 SME evaluation):
- Critical: No teacher onboarding flow
- Critical: No course/bundle creation UI
- Blocker: No Arabic/RTL support
- Risk: Stripe Connect may have regional issues in Saudi/UAE

## Goal
Enable a teacher to self-serve:
1) create an account,
2) declare/complete a teacher profile,
3) create at least one course/bundle with pricing,
4) publish (“go live”),
5) appear in discovery so students can book.

## MVP Scope (Teacher acquisition funnel)
### In-scope
- Teacher entrypoint: **/become-teacher** landing + onboarding form
- Teacher auth: email/password signup + login; email confirmation supported
- Teacher profile creation in Supabase (RLS-protected)
- Course creation MVP (single course object with price and capacity)
- Schedule/availability MVP (weekly availability entries per course)
- Basic teacher dashboard links: “Create course”, “Manage availability”, “Publish”

### Out of scope (Phase 2)
- Complex multi-instructor organizations
- Advanced course authoring (modules, assignments)
- Full marketplace ranking/SEO
- Full payouts coverage (regional Stripe Connect constraints handled as risk/mitigation)

## Architecture / Dependencies
- Supabase schema + RLS
  - `teacher_profiles` (exists) — Phase 2 adds a few columns needed by onboarding
  - New tables: `courses`, `schedules`
- Supabase Auth: email confirmation enabled in production
- Frontend: Vite + React + shadcn/ui components

## Sprint plan (2-week sprints)

### Sprint 1 (Weeks 1–2): Teacher auth + profile creation
**Outcome:** A teacher can sign up/login, complete “Become a teacher” form, and a `teacher_profiles` row is created.

Deliverables:
- `/become-teacher` page
- `TeacherOnboarding` component
- Create/Upsert teacher profile in Supabase
- Email verification UX (post-signup “check your inbox”)
- Redirect after completion → course creation flow

Definition of Done:
- Logged-in user can create teacher profile without admin
- Teacher profile row created with required fields
- Basic error states + loading states


### Sprint 2 (Weeks 3–4): Course/bundle template + pricing setup
**Outcome:** A teacher can create a course (or bundle) draft with pricing and publish it.

Deliverables:
- `CourseCreationWizard` (stepper)
  - Step 1: basics (title, description, category)
  - Step 2: pricing (price per session, max students)
  - Step 3: review + publish
- New `courses` table (if not using `bundles`) OR bundle creation UI (if aligning to existing `bundles`)
- Publish toggle and discovery visibility rules

Definition of Done:
- Teacher can create a course draft and publish
- Published course appears in discovery listing


### Sprint 3 (Weeks 5–6): Availability calendar + schedule management
**Outcome:** Teacher can set weekly availability and manage schedules per course.

Deliverables:
- `AvailabilityCalendar` UI
  - Weekly grid (Sun–Sat)
  - Add time blocks (start/end) + timezone
- New `schedules` table
- RLS policies to ensure only owning teacher can modify schedules

Definition of Done:
- Teacher can create/update/delete availability blocks
- Student booking flow can read availability


### Sprint 4 (Weeks 7–8, if time permits): Arabic + RTL localization
**Outcome:** Arabic UI baseline and RTL support for critical teacher funnel screens.

Deliverables:
- i18n framework (e.g., i18next)
- Arabic translations for onboarding + course creation + discovery
- RTL styling pass (layout, inputs, typography)

Definition of Done:
- Language switcher
- RTL rendering is correct on key pages

## Design mockups (wireframe descriptions)

### 1) Teacher signup flow (Become a teacher)
**Screen:** /become-teacher
- Header: “Become a Teacher”
- Section A: Account
  - If logged out: Email + Password + “Create account”
  - If logged in: Show current email + “Continue”
- Section B: Teacher profile
  - Full name
  - Phone
  - Bio
  - Specialization (free text + optional tags)
  - Experience level (Beginner / Intermediate / Expert)
  - Credentials URL (optional)
  - Availability preference (days + time window)
- Primary CTA: “Submit & Continue”
- Success: “Profile submitted — next create your first course”


### 2) Course creation wizard
**Screen:** /teacher/courses/new
- Stepper: Basics → Pricing → Review
- Basics
  - Title, Description, Category
- Pricing
  - Price per session, Max students
- Review
  - Summary + “Publish” (or “Save draft”)


### 3) Availability calendar
**Screen:** /teacher/courses/:id/availability
- Week view grid with time blocks
- Add block: Day of week, start time, end time, timezone
- List of upcoming blocks with delete/edit

## Success criteria (Phase 2)
- Teacher can: signup/login → become teacher → create course → set price → publish → appear in discovery
- Student can: find course in marketplace → request/book session → payment flow works end-to-end (existing payment rails)

## Risks / mitigations
- **Stripe Connect availability (Saudi/UAE):**
  - Mitigation: support “manual payout” fallback in MVP; or restrict payouts to supported regions while allowing teaching (disclose clearly)
- **Arabic/RTL not ready:**
  - Mitigation: Phase 2 ships English-first; Sprint 4 reserved for Arabic; ensure content supports Arabic input now

