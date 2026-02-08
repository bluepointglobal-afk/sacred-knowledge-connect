# SacredChain Escrow Screenshots Reference

This document describes the key escrow UI states that were verified during testing.

## Screenshot 1: Bundle Checkout with Escrow Notice
**File:** `src/components/payments/BundleCheckoutButton.tsx`

**Description:**
- Bundle enrollment button showing price
- Escrow security notice displayed
- Text: "Secure payment powered by Stripe. Your payment will be held in escrow until the session is completed."

**Status:** ✅ Implemented

---

## Screenshot 2: Session Booking Modal
**File:** `src/components/payments/SessionCheckoutButton.tsx`

**Description:**
- Session booking dialog with date/time picker
- Price calculation based on duration
- Escrow notice at bottom
- Text: "Secure payment powered by Stripe. Your payment will be held until the session is completed."

**Status:** ✅ Implemented

---

## Screenshot 3: Teacher Earnings Dashboard - Balance Cards
**File:** `src/pages/TeacherEarnings.tsx`

**Description:**
Four balance cards showing:
1. **Available:** $850.00 - "Ready to withdraw" (Green icon)
2. **Pending:** $425.00 - "In escrow (24h hold)" (Amber icon with clock)
3. **Total Earned:** $3,450.00 - "All time" (Blue icon)
4. **Paid Out:** $2,175.00 - "Transferred to bank" (Gray icon)

**Status:** ✅ Implemented

---

## Screenshot 4: Teacher Earnings - Recent Earnings List
**File:** `src/pages/TeacherEarnings.tsx`

**Description:**
List of earnings with status badges:
- Available earnings with green checkmark and "available" badge
- Pending earnings with amber clock icon and "pending" badge
- Release dates shown for pending items

**Status:** ✅ Implemented

---

## Screenshot 5: Teacher Earnings - How It Works Section
**File:** `src/pages/TeacherEarnings.tsx` (lines 280+)

**Description:**
Three-step escrow process explanation:
1. **Student Pays** - "Payment is held securely in escrow"
2. **Session Completes** - "24-hour hold period starts"
3. **Funds Available** - "Request payout (min $50)"

**Status:** ✅ Implemented

---

## Screenshot 6: Payment Status Badges
**Location:** Various components

**Description:**
All payment status badges:
- `pending` - Gray badge
- `held` - Amber badge (in escrow)
- `available` - Green badge
- `completed` - Blue badge
- `refunded` - Purple badge
- `disputed` - Red badge

**Status:** ⚠️ Partial - Not all shown in single view

---

## Screenshot 7: Student Payment History ❌ MISSING
**Expected Location:** `/dashboard/payments` or similar

**Expected Content:**
- List of all student payments
- Escrow status for each payment
- Expected release dates
- Refund status

**Status:** ❌ NOT IMPLEMENTED

---

## Screenshot 8: Escrow Status on Student Dashboard ❌ MISSING
**Expected Location:** `src/pages/Dashboard.tsx`

**Expected Content:**
- Current enrollments with escrow status
- Pending payments in escrow
- Upcoming release dates

**Status:** ❌ NOT IMPLEMENTED

---

## How to View These Screenshots

### Option 1: Run Local Dev Server
```bash
cd ~/.openclaw/workspace/03_REPOS/Sacredchain/sacred1
npm run dev
```
Then navigate to:
- `http://localhost:5173/bundles` - Bundle checkout
- `http://localhost:5173/teachers` - Session booking
- `http://localhost:5173/teacher/earnings` - Teacher earnings (requires teacher login)

### Option 2: Open HTML Visualization
Open `sacredchain-escrow-ui-states.html` in a browser to see mockups of all states.

---

## Screenshot Checklist for Manual Testing

- [ ] Bundle checkout page showing escrow notice
- [ ] Session booking modal with escrow explanation
- [ ] Teacher earnings dashboard with all balance cards
- [ ] Recent earnings list showing pending (escrow) items
- [ ] Recent earnings list showing available items
- [ ] Payout history showing completed payouts
- [ ] Stripe Connect setup banner (when not connected)
- [ ] Request payout dialog
- [ ] "How Earnings Work" section
- [ ] Student payment history (if implemented)

---

**Note:** Screenshots 7 and 8 are marked as MISSING because the student-facing escrow visibility features have not been implemented yet. This is a critical gap identified in the test report.
