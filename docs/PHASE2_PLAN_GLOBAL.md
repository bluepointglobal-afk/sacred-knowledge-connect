# SacredChain - Phase 2 Dev Plan (Global Teacher Onboarding + Regional Course Strategies)

**Owner:** Product/Engineering  
**Version:** 2.0 (Global Positioning Update)  
**Updated:** 2026-02-05  

---

## Context (From Phase 1 Global Analysis)

Supply-side ICP: **Mid-class Muslim educators** in North Africa (Egypt, Tunisia), South Asia (Pakistan), and Middle East (Lebanon/Syria) seeking **USD/GBP-denominated income** and access to Western learners.

Key Phase 2 constraint: Teacher onboarding must collect **global payout details (IBAN/Wise/PayPal)** rather than region-specific bank requirements.

---

## Goal

Enable a **globally-positioned teacher** to self-serve:
1) Create account (email + password)
2) Complete teacher profile with **payout method** (Wise, PayPal, IBAN) and **timezone**
3) Create region-specific course offerings (e.g., Qurbani-focused vs. Beginner Arabic)
4) Set weekly availability with **timezone-aware scheduling**
5) Go live and appear in discovery (filtered by student timezone/language)

---

## MVP Scope (Global Teacher Acquisition Funnel)

### In-Scope
- Teacher entrypoint: `/become-teacher` landing + global onboarding form
- Teacher auth: email/password signup + login; email confirmation
- Global teacher profile creation with:
  - **Payout method** selection (Wise, PayPal, Bank IBAN)
  - **Timezone selector** (UTC storage, display in local time)
  - **Country of residence** (for compliance + payout routing)
  - **Teaching language** (Arabic, English, regional mix)
  - **Regional specialization** (North Africa, SE Asia, Middle East, Western diaspora focus)
- Course creation with **region-specific templates**:
  - Qurbani-focused (seasonal, high-value)
  - Beginner Arabic (year-round, recurring)
  - Islamic Fundamentals (seerah, aqeedah, fiqh basics)
  - Children's Learning (for parents seeking educational support)
- Schedule/availability with **timezone math** + regional pricing defaults
- Discovery filtering: students see teachers matching their timezone + language preference

### Out of Scope (Phase 3+)
- Complex multi-instructor organizations
- Advanced course authoring (modules, assignments)
- Full marketplace ranking/SEO
- Teacher certification workflows (deferred to Phase 3)

---

## Architecture & Payout Strategy

### Database Schema Updates (Phase 2)

**teacher_profiles** (add columns):
- `payout_method` (enum: 'wise' | 'paypal' | 'iban' | 'tbd')
- `iban_or_account_number` (text, nullable) — for IBAN / PayPal email / Wise ID
- `country_of_residence` (text, ISO-3166-2) — required for compliance
- `payout_account_holder_name` (text, nullable)
- `timezone` (text, default 'UTC') — teacher's local timezone
- `teaching_languages` (jsonb array: ['arabic', 'english'])
- `regional_specialization` (enum: 'north_africa' | 'south_asia' | 'middle_east' | 'western_diaspora')

**courses** (new table):
- `id` (uuid, pk)
- `teacher_id` (fk → teacher_profiles)
- `title` (text) — e.g., "Qurbani Preparation Course"
- `description` (text)
- `category` (enum: 'quran' | 'arabic' | 'fiqh' | 'seerah' | 'children')
- `region_type` (enum: 'qurbani' | 'beginner_arabic' | 'fundamentals' | 'children') — template used
- `price_per_session` (decimal, in USD)
- `max_students` (int, default 30)
- `published` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**schedules** (new table):
- `id` (uuid, pk)
- `teacher_id` (fk → teacher_profiles)
- `course_id` (fk → courses, nullable) — if null, applies to all courses
- `day_of_week` (int, 0-6: Sun-Sat)
- `start_time_utc` (time) — stored in UTC
- `end_time_utc` (time)
- `available_slots` (int)
- `timezone_display` (text) — for UI only (teacher sees their local time)

### Payment Flow (Phase 2 → Phase 3)

**Phase 2:** Collect payout details (no actual payouts yet).  
**Phase 3:** Wire payouts via Wise API (primary) + PayPal API (fallback) + IBAN direct deposit (enterprise).

---

## Teacher Personas (From Phase 1 ICP)

### Persona 1: Egypt — Imam / Qur'an Teacher
- **Profile:** 32–45, Cairo/Alexandria; teaches tajwīd and hifz locally.
- **Motivation:** Monetize expertise globally; build international student base.
- **Expected:** 10–20 paid sessions/week at $20–35/session.
- **Tech comfort:** Moderate (Zoom-literate, unfamiliar with platforms).
- **Payout preference:** **Wise** (familiar to diaspora, fast, low fees).

### Persona 2: Pakistan — Traditional Scholar
- **Profile:** 28–40, Lahore/Karachi; strong Arabic/fiqh foundations.
- **Motivation:** Earn in GBP/USD; teach Western diaspora with structured curriculum.
- **Expected:** Recurring students (subscription bundles), stable income.
- **Tech comfort:** Low-to-moderate (basic online familiarity).
- **Payout preference:** **IBAN** or **Wise** (needs compliance docs).

### Persona 3: Tunisia — Educator Expanding Online
- **Profile:** 26–38, Tunis/Sfax; teaches Arabic + Islamic studies.
- **Motivation:** Package lessons; reach international learners.
- **Expected:** Steady pipeline of Western students.
- **Tech comfort:** High (comfortable with Zoom, Airtable-like tools).
- **Payout preference:** **Wise** or **PayPal** (convenience first).

---

## Sprint Plan (2-Week Sprints)

### Sprint 1 (Weeks 1-2): Global Onboarding + Payout Setup

**Goal:** A teacher can sign up/login, complete "Become a teacher" form with global payout options and timezone, and `teacher_profiles` row is created with all required fields.

**Deliverables:**

1. **`/become-teacher` page + `TeacherOnboarding` component**
   - Step 1: Basic info (name, email, phone)
   - Step 2: **Payout method selection** (radio: Wise / PayPal / Bank IBAN)
     - Wise: text input for "Wise ID"
     - PayPal: email input
     - Bank IBAN: conditional fields (IBAN, account holder name, country of bank)
   - Step 3: **Timezone selector** (dropdown, e.g., "Africa/Cairo", "Asia/Karachi", "Africa/Tunis")
   - Step 4: **Regional specialization** (radio: North Africa / SE Asia / Middle East / Western diaspora focus)
   - Step 5: **Teaching languages** (checkboxes: Arabic, English, other)
   - Step 6: Review + submit

2. **Supabase RLS policies**
   - Teacher can only see/edit own profile
   - Only authenticated user can create teacher profile

3. **Error handling**
   - IBAN validation (basic: 15-34 chars, starts with country code)
   - Email confirmation (post-signup: "check your inbox")
   - Duplicate teacher profile prevention

**Definition of Done:**
- [ ] Logged-in user completes form without admin
- [ ] Teacher profile created with all payout fields (method, account details)
- [ ] Timezone stored in UTC-aware format
- [ ] Regional specialization selected and stored
- [ ] Redirect to course creation flow (Sprint 2)
- [ ] Email verification sends successfully
- [ ] **Global teacher persona test:** Egyptian teacher (Wise), Pakistani teacher (IBAN), Tunisian teacher (PayPal) all successfully create profiles with correct payout details

---

### Sprint 2 (Weeks 3-4): Region-Specific Course Creation

**Goal:** A teacher can create a course draft with regional-specific template (Qurbani, Beginner Arabic, etc.), set pricing, and publish.

**Deliverables:**

1. **`CourseCreationWizard` (stepper)**
   - Step 1: Course type (radio: Qurbani Course / Beginner Arabic / Islamic Fundamentals / Children's Learning)
     - **Qurbani Course:** Seasonal template with description, max 50 students, $35/session default
     - **Beginner Arabic:** Year-round, max 30 students, $25/session default
     - **Islamic Fundamentals:** Seerah/Aqeedah basics, max 25 students, $20/session default
     - **Children's Learning:** Age-appropriate, max 20 students, $15/session default
   - Step 2: Customize (title, description, max students, price per session)
   - Step 3: Review + publish

2. **`courses` table creation**
   - Schema: title, description, category, region_type, price_per_session, max_students, published

3. **Discovery visibility rules**
   - Published courses appear in student discovery (filtered by timezone match + language)
   - Unpublished courses hidden from students, visible to teacher in dashboard

4. **RLS policies**
   - Teacher can only see/edit own courses
   - Students can see published courses only

**Definition of Done:**
- [ ] Teacher creates course without admin
- [ ] Region-specific template defaults applied (pricing, description, capacity)
- [ ] Course created and stored in `courses` table
- [ ] Published course appears in discovery listing
- [ ] Unpublished course hidden from students
- [ ] **Regional template test:** Egyptian teacher creates Qurbani course, Pakistani teacher creates Fundamentals course, Tunisian teacher creates Arabic course — each with correct defaults for their region

---

### Sprint 3 (Weeks 5-6): Timezone-Aware Availability + Regional Pricing

**Goal:** Teacher can set weekly availability with timezone math. Schedule displays in teacher's local time, students see sessions in their own timezone.

**Deliverables:**

1. **`AvailabilityCalendar` UI**
   - Weekly grid (Sun-Sat)
   - Add time blocks: "Select time in your timezone"
   - Display: "Your timezone: Africa/Cairo" (or user's selected timezone)
   - For each time block, input: start_time + end_time (in teacher's local time)
   - Internally: convert to UTC for storage

2. **Timezone conversion logic**
   ```
   Display to teacher: 2PM–3PM Egypt time (UTC+2)
   Storage: 12:00–13:00 UTC
   Display to student (US/Eastern, UTC-5): 7AM–8AM Eastern
   ```

3. **`schedules` table**
   - Fields: teacher_id, course_id (nullable), day_of_week, start_time_utc, end_time_utc, available_slots, timezone_display

4. **Regional pricing defaults**
   - North Africa teachers: default $20/session (may increase to $25-30 for Qurbani)
   - SE Asia teachers: default $15/session
   - Middle East teachers: default $25/session
   - Adjustable per course + teacher discretion

5. **RLS policies**
   - Teacher can only create/edit own schedules
   - Students see schedules displayed in their timezone

**Definition of Done:**
- [ ] Teacher sets availability in local timezone
- [ ] Availability stored correctly in UTC
- [ ] Student sees same session in their local timezone
- [ ] Multiple time zones tested (Cairo, Karachi, EST, GMT)
- [ ] Scheduling conflict detection (no overlaps per course)
- [ ] **Timezone test:** Cairo teacher sets 2PM–3PM Cairo time → Student in NYC sees 7AM–8AM EDT correctly

---

## Technical Stack

- **Frontend:** Vite + React + shadcn/ui
- **Backend:** Supabase Auth + database
- **Payout processing:** Wise API (Phase 3), PayPal API (Phase 3), IBAN direct (Phase 3)
- **Timezone library:** `date-fns-tz` or `Intl.DateTimeFormat`
- **Validation:** Zod (schema) + custom IBAN regex

---

## Deployment Notes

1. **Migrations:** `supabase db push` before Sprint 1
2. **RLS audit:** Verify policies on teacher_profiles, courses, schedules tables
3. **Email:** Configure Supabase email provider + template for "Confirm your email"
4. **Testing:** Use teacher personas (Egypt, Pakistan, Tunisia) to test each sprint

---

## Success Metrics (Phase 2)

- 20+ teachers onboarded from each region (Egypt, Pakistan, Tunisia)
- 100% of teachers successfully enter payout details (Wise/PayPal/IBAN)
- 80%+ of teachers publish at least one course
- Zero timezone display mismatches in testing
- Time-to-complete onboarding: <10 minutes per teacher

---

## Known Limitations

1. **Payout integration:** Phase 2 collects details; Phase 3 implements actual payouts.
2. **Course scheduling:** No conflict detection across courses (scope for Phase 3).
3. **Regional compliance:** Does not yet handle sanctions/jurisdiction-specific restrictions (Phase 3).
4. **Localization:** UI in English only (Phase 3 adds Arabic/regional languages).

---

## Next Phase (Phase 3)

- Payout integration (Wise API, PayPal API)
- Teacher verification workflow (ID + credentials)
- Course scheduling + booking flow (student side)
- Messaging platform (teacher ↔ student)
- Payment processing (Stripe student → teacher via Wise)

---

**Status:** Ready for dev sprint execution  
**Last Updated:** 2026-02-05
