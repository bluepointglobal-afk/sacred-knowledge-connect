# RLS Policy Audit - Sacred Knowledge Connect

**Last Updated:** December 2024
**Schema Version:** 1.0 (MVP) + Hardening Migration 002

---

## Overview

This document provides a comprehensive audit of all Row Level Security (RLS) policies implemented in the Sacred Knowledge Connect database. RLS ensures that users can only access data they are authorized to see.

---

## Table: `profiles`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Profiles are viewable by everyone | SELECT | `true` | Public read for teacher listings |
| Users can update own profile | UPDATE | `auth.uid() = id` | Self-update only |
| Profiles are created via trigger | INSERT | `auth.uid() = id` | Auto-created on signup |

**Security Notes:**
- Profiles are intentionally public for teacher discovery
- Email is exposed in profile - consider if this is desired
- No DELETE policy - profiles cascade from auth.users

---

## Table: `teacher_profiles`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Verified teachers are viewable by everyone | SELECT | `is_verified = true OR auth.uid() = user_id` | Public only if verified |
| Teachers can update own profile | UPDATE | `auth.uid() = user_id` | Self-update only |
| Teachers can create own profile | INSERT | `auth.uid() = user_id` | Self-insert only |

**Security Notes:**
- Unverified teachers can only see their own profile
- `is_verified` and `is_featured` can only be set by admin (not enforced in RLS - handle in application or use service role)
- No DELETE policy - consider if teachers should be able to delete their profile

**Recommendation:** Add server-side check to prevent users from self-setting `is_verified` or `is_featured`.

---

## Table: `bundles`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Published bundles are viewable by everyone | SELECT | `status = 'published' OR teacher owns bundle` | Draft bundles hidden |
| Teachers can insert own bundles | INSERT | `teacher_id belongs to user` | Via teacher_profiles |
| Teachers can update own bundles | UPDATE | `teacher_id belongs to user` | Ownership check |
| Teachers can delete own bundles | DELETE | `teacher_id belongs to user` | Ownership check |

**Security Notes:**
- Draft bundles are only visible to the owning teacher
- `is_featured` can be set by teacher (consider restricting to admin)
- Archived bundles follow same rules as draft

---

## Table: `bundle_items`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Bundle items viewable if bundle is viewable | SELECT | Published OR teacher owns OR student enrolled | Cascades from bundle visibility |
| Teachers can insert bundle items | INSERT | Bundle belongs to teacher | Ownership check |
| Teachers can update bundle items | UPDATE | Bundle belongs to teacher | Ownership check |
| Teachers can delete bundle items | DELETE | Bundle belongs to teacher | Ownership check |

**Security Notes:**
- Items properly cascade from bundle permissions
- Enrolled students can see all items (even if bundle unpublished)

---

## Table: `onboarding_responses`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Users can view own onboarding responses | SELECT | `auth.uid() = user_id` | Strict self-access |
| Users can insert own onboarding responses | INSERT | `auth.uid() = user_id` | Self-insert only |
| Users can update own onboarding responses | UPDATE | `auth.uid() = user_id` | Self-update only |
| Users can delete own onboarding responses | DELETE | `auth.uid() = user_id` | Added in 002_hardening |

**Security Notes:**
- Fully private data, properly restricted
- UNIQUE(user_id, step_key) prevents duplicate entries
- DELETE policy added for cleanup capability

---

## Table: `enrollments`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Students can view own enrollments | SELECT | `auth.uid() = student_id` | Self-access |
| Teachers can view enrollments in their bundles | SELECT | Bundle belongs to teacher | Teacher oversight |
| Students can create own enrollments | INSERT | `auth.uid() = student_id` | Self-enroll |
| Students can update own enrollments | UPDATE | Self + status restrictions | From 002_hardening |
| Teachers can complete enrollments | UPDATE | Bundle belongs to teacher | From 002_hardening |

**Security Notes:**
- UNIQUE(student_id, bundle_id) prevents duplicate enrollments
- Hardening migration restricts students from marking themselves as "completed"
- Students can only change status to: `paused`, `cancelled`, or keep current
- Teachers can mark enrollments as `completed`

**Constraints (from 002_hardening):**
- `progress_percent` must be 0-100
- `sessions_completed` must be >= 0

---

## Table: `sessions`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Students can view own sessions | SELECT | `auth.uid() = student_id` | Self-access |
| Teachers can view own sessions | SELECT | Teacher owns via teacher_profiles | Teacher oversight |
| Teachers can create sessions | INSERT | Teacher owns via teacher_profiles | Only teachers create |
| Teachers can update own sessions | UPDATE | Teacher owns via teacher_profiles | Full update rights |
| Students can update session feedback | UPDATE | `auth.uid() = student_id` | Rating/feedback only |

**Security Notes:**
- Both teacher and student can update sessions (overlapping policies)
- Consider restricting student updates to only `notes_student`, `rating`, `feedback`
- Rating CHECK constraint (1-5) is in schema

---

## Table: `journal_entries`

**RLS Enabled:** Yes

| Policy Name | Operation | Rule | Notes |
|------------|-----------|------|-------|
| Users can view own journal entries | SELECT | `auth.uid() = user_id` | Strict self-access |
| Users can insert own journal entries | INSERT | `auth.uid() = user_id` | Self-insert only |
| Users can update own journal entries | UPDATE | `auth.uid() = user_id` | Self-update only |
| Users can delete own journal entries | DELETE | `auth.uid() = user_id` | Full control |

**Security Notes:**
- Completely private data, properly restricted
- `is_private` flag exists but not used in RLS (application-level sharing)

---

## Database Triggers & Functions

### From schema.sql:

| Trigger | Table | Function | Purpose |
|---------|-------|----------|---------|
| on_auth_user_created | auth.users | handle_new_user() | Auto-create profile on signup |
| set_updated_at | All tables | handle_updated_at() | Auto-update timestamps |

### From 002_hardening.sql:

| Trigger | Table | Function | Purpose |
|---------|-------|----------|---------|
| on_enrollment_created | enrollments | handle_enrollment_created() | Increment bundle.total_enrollments |
| on_enrollment_status_change | enrollments | handle_enrollment_status_change() | Track active enrollment counts |

---

## Performance Indexes (from 002_hardening)

| Index | Table | Columns | Condition |
|-------|-------|---------|-----------|
| idx_enrollments_student_status | enrollments | (student_id, status) | None |
| idx_bundles_teacher_published | bundles | (teacher_id, status) | WHERE status = 'published' |
| idx_bundles_published_featured | bundles | (status, is_featured) | WHERE status = 'published' |
| idx_teacher_profiles_verified_featured | teacher_profiles | (is_verified, is_featured) | WHERE is_verified = true |
| idx_onboarding_user_step | onboarding_responses | (user_id, step_key) | None |

---

## CHECK Constraints (from 002_hardening)

| Table | Constraint | Rule |
|-------|------------|------|
| enrollments | chk_enrollments_progress | 0 <= progress_percent <= 100 |
| enrollments | chk_enrollments_sessions | sessions_completed >= 0 |
| bundles | chk_bundles_price | price_cents >= 0 |
| bundles | chk_bundles_duration | duration_weeks > 0 |
| bundles | chk_bundles_sessions | total_sessions > 0 |
| teacher_profiles | chk_teacher_profiles_rate | hourly_rate_cents >= 0 |
| teacher_profiles | chk_teacher_profiles_experience | years_experience >= 0 |
| teacher_profiles | chk_teacher_profiles_rating | 0 <= average_rating <= 5 |

---

## Recommendations for Future

1. **Admin Role**: Consider implementing admin-specific RLS policies using custom claims or a separate admin check function.

2. **Audit Logging**: Consider adding an audit log table for sensitive operations (enrollment changes, profile updates).

3. **Soft Deletes**: Consider adding `deleted_at` columns instead of hard deletes for data recovery.

4. **Session Restrictions**: Tighten student update policy on sessions to only allow updating specific columns.

5. **Rate Limiting**: Consider implementing rate limiting at the application layer for enrollment creation.

---

## Testing Checklist

- [ ] Unauthenticated user cannot access private data
- [ ] Student can only see own enrollments
- [ ] Teacher can see enrollments in their bundles
- [ ] Student cannot mark enrollment as "completed"
- [ ] Teacher can mark enrollment as "completed"
- [ ] Draft bundles are hidden from non-owners
- [ ] Unverified teacher profiles are hidden from public
- [ ] Journal entries are fully private
- [ ] Onboarding responses are fully private
