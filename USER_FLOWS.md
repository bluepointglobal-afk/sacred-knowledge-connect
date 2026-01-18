# SacredChain User Flows - Navigation Test Specification

## Flow 1: Public Browsing (No Auth Required)

### 1.1 Landing → Teachers
- `/` → click "Find Teachers" or nav link → `/teachers`
- `/teachers` → should see teacher cards with name, headline, rating
- `/teachers` → click teacher card → `/teachers/:id`
- `/teachers/:id` → should see bio, qualifications, bundles list

### 1.2 Landing → Bundles
- `/` → click "Browse Bundles" or nav link → `/bundles`
- `/bundles` → should see bundle cards with title, price, teacher name
- `/bundles` → click bundle card → `/bundles/:id`
- `/bundles/:id` → should see description, curriculum, enroll CTA

### 1.3 Cross Navigation
- `/teachers/:id` → click bundle card → `/bundles/:id`
- `/bundles/:id` → click teacher name → `/teachers/:id`

---

## Flow 2: Authentication

### 2.1 Direct Login
- Any page → click "Sign In" in header → `/login`
- `/login` → should see email/password form AND Google OAuth button
- `/login` → submit valid creds → `/dashboard` (if onboarded) OR `/onboarding`
- `/login` → submit invalid creds → stay on `/login` with error message

### 2.2 Login with Redirect
- `/bundles/:id` → click "Enroll" (not logged in) → `/login?redirect=/bundles/:id`
- `/login` → complete auth → redirect back to `/bundles/:id`

### 2.3 OAuth Flow
- `/login` → click Google → external redirect → callback → `/dashboard` or `/onboarding`

---

## Flow 3: Onboarding (New User)

### 3.1 Fresh Signup
- Complete signup → auto-redirect → `/onboarding`
- `/onboarding` → should see step 1 (learning preferences)
- `/onboarding` → complete all steps → `/dashboard`
- `/onboarding` → try to skip → should enforce completion OR allow skip with prompt

### 3.2 Incomplete Onboarding Detection
- User with incomplete onboarding → visits `/dashboard` → redirect to `/onboarding`
- User with incomplete onboarding → visits `/bundles/:id` → click enroll → redirect to `/onboarding` with return URL stored

---

## Flow 4: Student Dashboard

### 4.1 Dashboard Access
- Logged in user → `/dashboard` → should see:
  - Active enrollments (if any)
  - Upcoming sessions (if any)
  - Recommended bundles
  - Quick actions

### 4.2 Dashboard → Enrollment Detail
- `/dashboard` → click enrollment card → `/enrollments/:id`
- `/enrollments/:id` → should see:
  - Bundle info
  - Progress bar
  - Session list
  - Schedule button

---

## Flow 5: Enrollment Flow

### 5.1 Enroll in Bundle
- `/bundles/:id` → click "Enroll" (logged in + onboarded) → create enrollment → `/enrollments/:id`
- `/enrollments/:id` → should show new enrollment with 0% progress

### 5.2 Already Enrolled
- `/bundles/:id` → (already enrolled) → should show "Continue Learning" instead of "Enroll"
- `/bundles/:id` → click "Continue Learning" → `/enrollments/:id`

---

## Flow 6: Session Lifecycle

### 6.1 Schedule Session
- `/enrollments/:id` → click "Schedule Session" → open date/time picker
- Select date/time → confirm → session appears in list with status "scheduled"

### 6.2 Join Session
- `/enrollments/:id` → session with Zoom link → click "Join" → opens Zoom (external)

### 6.3 Post-Session
- Session marked complete by teacher → student sees "Leave Feedback" button
- Click "Leave Feedback" → rating modal → submit → feedback saved
- After feedback → progress updated

---

## Flow 7: Navigation Guards

### 7.1 Protected Routes
- Not logged in → `/dashboard` → redirect to `/login?redirect=/dashboard`
- Not logged in → `/enrollments/:id` → redirect to `/login?redirect=/enrollments/:id`

### 7.2 Invalid Routes
- Any invalid route → `/404` or redirect to `/`

### 7.3 Invalid IDs
- `/teachers/invalid-uuid` → show error state or redirect
- `/bundles/invalid-uuid` → show error state or redirect
- `/enrollments/invalid-uuid` → show error state or redirect

---

## Critical State Transitions

```
AUTH STATES:
- anonymous → can view: /, /teachers, /teachers/:id, /bundles, /bundles/:id, /login, /business
- authenticated + !onboarded → forced to /onboarding, then original destination
- authenticated + onboarded → full access

ENROLLMENT STATES:
- not_enrolled → can enroll
- enrolled + active → can schedule, view sessions
- enrolled + completed → can view history, leave final feedback

SESSION STATES:
- scheduled → can cancel, can join (if link exists)
- in_progress → can join
- completed → can leave feedback (once)
- cancelled → read-only
```

---

## Expected Elements Per Page

| Route | Must Have Elements |
|-------|-------------------|
| `/` | hero section, CTA buttons, featured teachers/bundles |
| `/teachers` | teacher cards, filters/search, pagination |
| `/teachers/:id` | teacher name, bio, bundle list, contact CTA |
| `/bundles` | bundle cards, category filters, price display |
| `/bundles/:id` | title, description, curriculum, enroll/continue button |
| `/login` | email input, password input, submit button, Google button |
| `/onboarding` | progress indicator, form fields, next/back buttons |
| `/dashboard` | welcome message, enrollments section, upcoming sessions |
| `/enrollments/:id` | bundle title, progress bar, session list, schedule button |
