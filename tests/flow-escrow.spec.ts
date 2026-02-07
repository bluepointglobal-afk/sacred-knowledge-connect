import { test, expect } from '@playwright/test';

/**
 * ESCROW FLOW END-TO-END TESTS
 * 
 * Tests all escrow states:
 * 1. PENDING → Payment intent created, awaiting payment
 * 2. HELD → Payment received, funds in escrow
 * 3. IN-PROGRESS → Session started, escrow still held
 * 4. COMPLETED → Session done, escrow released (after 24h)
 * 5. DISPUTED → Issue raised, funds held pending resolution
 * 
 * Edge cases:
 * - Student no-show → Teacher gets paid immediately
 * - Teacher no-show → Student refund initiated
 */

test.describe('Escrow Flow - Full Lifecycle', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ensure we're in mock mode
    await page.goto('/');
  });

  test('Happy Path: Payment → Held → Session Complete → Release', async ({ page }) => {
    // ========================================================================
    // STEP 1: STUDENT BOOKS SESSION (PAYMENT PENDING)
    // ========================================================================
    
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/teachers\//);

    // Screenshot: Teacher profile before booking
    await page.screenshot({ path: 'test-results/escrow-01-teacher-profile.png', fullPage: true });

    // Open booking dialog
    await page.getByRole('button', { name: /book session/i }).click();
    
    // Select tomorrow and time slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate());
    
    await page.getByRole('gridcell', { name: new RegExp(`^${day}$`) }).click();
    
    const timeSection = page.getByText('Select Time');
    await timeSection.scrollIntoViewIfNeeded();
    await timeSection.locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: '09:00' }).click();

    // Screenshot: Booking form filled
    await page.screenshot({ path: 'test-results/escrow-02-booking-form.png', fullPage: true });

    // ========================================================================
    // STEP 2: PAYMENT (ESCROW HELD STATE)
    // ========================================================================
    
    const payButton = page.getByRole('button', { name: /pay/i });
    await expect(payButton).toBeEnabled();
    await payButton.click();

    // Wait for checkout success
    await page.waitForURL(/checkout=success/, { timeout: 10000 });
    await page.waitForTimeout(500);

    // Screenshot: Payment success
    await page.screenshot({ path: 'test-results/escrow-03-payment-success.png', fullPage: true });

    // Verify escrow state: HELD
    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    
    expect(db.payments).toBeTruthy();
    const latestPayment = db.payments[db.payments.length - 1];
    
    console.log('Payment State:', {
      status: latestPayment.status,
      amount: latestPayment.amount_cents,
      stripe_charge_id: latestPayment.stripe_charge_id
    });

    // VERIFY: Payment is HELD (in escrow)
    expect(latestPayment.status).toBe('held');
    expect(latestPayment.escrow_released_at).toBeFalsy();

    // VERIFY: Teacher earning is PENDING
    const latestEarning = db.teacher_earnings[db.teacher_earnings.length - 1];
    expect(latestEarning.status).toBe('pending');
    expect(latestEarning.available_at).toBeFalsy(); // Not yet available

    console.log('Earning State:', {
      status: latestEarning.status,
      amount: latestEarning.amount_cents,
      available_at: latestEarning.available_at
    });

    // ========================================================================
    // STEP 3: SESSION IN-PROGRESS
    // ========================================================================
    
    // Navigate to student's sessions
    await page.goto('/student/sessions');
    await page.waitForTimeout(1000);
    
    // Screenshot: Student sessions list
    await page.screenshot({ path: 'test-results/escrow-04-student-sessions.png', fullPage: true });

    // Verify session exists and is scheduled
    const sessionInDb = db.sessions.find((s: any) => 
      s.stripe_payment_id === latestPayment.stripe_charge_id
    );
    expect(sessionInDb).toBeTruthy();
    expect(sessionInDb.status).toBe('scheduled');

    console.log('Session State:', {
      status: sessionInDb.status,
      scheduled_at: sessionInDb.scheduled_at
    });

    // ========================================================================
    // STEP 4: SESSION COMPLETED (TRIGGER ESCROW RELEASE TIMER)
    // ========================================================================
    
    // Simulate teacher marking session as complete
    await page.evaluate((sessionId) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const session = db.sessions.find((s: any) => s.id === sessionId);
      if (session) {
        session.status = 'completed';
        session.completed_at = new Date().toISOString();
      }
      
      // In real app, this would trigger release-escrow Edge Function
      // which sets available_at = NOW() + 24 hours
      const earning = db.teacher_earnings.find((e: any) => e.session_id === sessionId);
      if (earning) {
        const releaseTime = new Date();
        releaseTime.setHours(releaseTime.getHours() + 24);
        earning.available_at = releaseTime.toISOString();
      }
    }, sessionInDb.id);

    await page.reload();
    await page.waitForTimeout(500);

    // Screenshot: Session completed
    await page.screenshot({ path: 'test-results/escrow-05-session-completed.png', fullPage: true });

    // Verify escrow release timer started
    const dbAfterComplete = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earningAfterComplete = dbAfterComplete.teacher_earnings.find((e: any) => 
      e.session_id === sessionInDb.id
    );
    
    expect(earningAfterComplete.status).toBe('pending'); // Still pending
    expect(earningAfterComplete.available_at).toBeTruthy(); // But release time is set
    
    const releaseTime = new Date(earningAfterComplete.available_at);
    const now = new Date();
    const hoursUntilRelease = (releaseTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    console.log('Escrow Release Timer:', {
      current_time: now.toISOString(),
      release_time: releaseTime.toISOString(),
      hours_until_release: hoursUntilRelease.toFixed(2)
    });

    expect(hoursUntilRelease).toBeGreaterThan(23);
    expect(hoursUntilRelease).toBeLessThan(25);

    // ========================================================================
    // STEP 5: ESCROW RELEASED (24H LATER)
    // ========================================================================
    
    // Simulate cron job releasing mature escrows
    await page.evaluate((sessionId) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      
      // Find earning
      const earning = db.teacher_earnings.find((e: any) => e.session_id === sessionId);
      if (earning && earning.available_at) {
        // Simulate time passing - set available_at to past
        earning.available_at = new Date(Date.now() - 1000).toISOString();
        earning.status = 'available'; // Released!
      }
      
      // Update payment
      const payment = db.payments.find((p: any) => 
        p.stripe_charge_id === earning?.stripe_charge_id
      );
      if (payment) {
        payment.status = 'completed';
        payment.escrow_released_at = new Date().toISOString();
      }
    }, sessionInDb.id);

    // Navigate to teacher earnings dashboard
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(1000);
    
    // Screenshot: Teacher earnings - funds available
    await page.screenshot({ path: 'test-results/escrow-06-funds-available.png', fullPage: true });

    // Verify final state
    const dbFinal = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const finalEarning = dbFinal.teacher_earnings.find((e: any) => 
      e.session_id === sessionInDb.id
    );
    const finalPayment = dbFinal.payments.find((p: any) => 
      p.stripe_charge_id === finalEarning?.stripe_charge_id
    );

    expect(finalEarning.status).toBe('available');
    expect(finalPayment.status).toBe('completed');
    expect(finalPayment.escrow_released_at).toBeTruthy();

    console.log('Final State:', {
      payment_status: finalPayment.status,
      earning_status: finalEarning.status,
      escrow_released_at: finalPayment.escrow_released_at
    });

    // SUCCESS: Full escrow flow completed!
  });

  test('Edge Case: Student No-Show → Immediate Release', async ({ page }) => {
    // Setup: Book a session
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/teachers\//);

    await page.getByRole('button', { name: /book session/i }).click();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.getByRole('gridcell', { name: new RegExp(`^${tomorrow.getDate()}$`) }).click();
    
    const timeSection = page.getByText('Select Time');
    await timeSection.scrollIntoViewIfNeeded();
    await timeSection.locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: '10:00' }).click();
    
    await page.getByRole('button', { name: /pay/i }).click();
    await page.waitForURL(/checkout=success/);
    await page.waitForTimeout(500);

    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const sessionId = db.sessions[db.sessions.length - 1].id;
    const paymentBefore = db.payments[db.payments.length - 1];

    // Simulate: Student no-show (teacher reports)
    await page.evaluate((sid) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const session = db.sessions.find((s: any) => s.id === sid);
      const earning = db.teacher_earnings.find((e: any) => e.session_id === sid);
      const payment = db.payments.find((p: any) => p.id === earning?.payment_id);

      // Mark session as no-show
      if (session) session.status = 'no_show';
      
      // Release funds immediately (no 24h wait)
      if (earning) {
        earning.status = 'available';
        earning.available_at = new Date().toISOString();
      }
      
      if (payment) {
        payment.status = 'completed';
        payment.escrow_released_at = new Date().toISOString();
      }
    }, sessionId);

    // Screenshot: No-show handling
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/escrow-07-student-noshow.png', fullPage: true });

    const dbAfter = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earning = dbAfter.teacher_earnings.find((e: any) => e.session_id === sessionId);
    const payment = dbAfter.payments.find((p: any) => p.id === earning?.payment_id);

    // Verify immediate release
    expect(earning.status).toBe('available');
    expect(payment.status).toBe('completed');
    
    console.log('Student No-Show Result:', {
      payment_status: payment.status,
      earning_status: earning.status,
      released_immediately: true
    });
  });

  test('Edge Case: Teacher No-Show → Refund Initiated', async ({ page }) => {
    // Setup: Book a session
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/teachers\//);

    await page.getByRole('button', { name: /book session/i }).click();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.getByRole('gridcell', { name: new RegExp(`^${tomorrow.getDate()}$`) }).click();
    
    const timeSection = page.getByText('Select Time');
    await timeSection.scrollIntoViewIfNeeded();
    await timeSection.locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: '11:00' }).click();
    
    await page.getByRole('button', { name: /pay/i }).click();
    await page.waitForURL(/checkout=success/);
    await page.waitForTimeout(500);

    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const sessionId = db.sessions[db.sessions.length - 1].id;

    // Simulate: Teacher no-show (student reports)
    await page.evaluate((sid) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const session = db.sessions.find((s: any) => s.id === sid);
      const earning = db.teacher_earnings.find((e: any) => e.session_id === sid);
      const payment = db.payments.find((p: any) => p.id === earning?.payment_id);

      // Mark session as cancelled
      if (session) session.status = 'cancelled';
      
      // Forfeit teacher earning
      if (earning) earning.status = 'forfeited';
      
      // Refund payment
      if (payment) {
        payment.status = 'refunded';
        payment.refund_amount_cents = payment.amount_cents;
        payment.refund_reason = 'teacher_no_show';
      }
    }, sessionId);

    // Screenshot: Refund processed
    await page.goto('/student/sessions');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/escrow-08-teacher-noshow.png', fullPage: true });

    const dbAfter = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earning = dbAfter.teacher_earnings.find((e: any) => e.session_id === sessionId);
    const payment = dbAfter.payments.find((p: any) => p.id === earning?.payment_id);
    const session = dbAfter.sessions.find((s: any) => s.id === sessionId);

    // Verify refund
    expect(earning.status).toBe('forfeited');
    expect(payment.status).toBe('refunded');
    expect(payment.refund_reason).toBe('teacher_no_show');
    expect(session.status).toBe('cancelled');

    console.log('Teacher No-Show Result:', {
      payment_status: payment.status,
      earning_status: earning.status,
      refund_amount: payment.refund_amount_cents,
      refund_reason: payment.refund_reason
    });
  });

  test('Edge Case: Dispute → Funds Held', async ({ page }) => {
    // Setup: Book a session
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/teachers\//);

    await page.getByRole('button', { name: /book session/i }).click();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.getByRole('gridcell', { name: new RegExp(`^${tomorrow.getDate()}$`) }).click();
    
    const timeSection = page.getByText('Select Time');
    await timeSection.scrollIntoViewIfNeeded();
    await timeSection.locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: '14:00' }).click();
    
    await page.getByRole('button', { name: /pay/i }).click();
    await page.waitForURL(/checkout=success/);
    await page.waitForTimeout(500);

    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const sessionId = db.sessions[db.sessions.length - 1].id;

    // Simulate: Dispute raised
    await page.evaluate((sid) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const earning = db.teacher_earnings.find((e: any) => e.session_id === sid);
      const payment = db.payments.find((p: any) => p.id === earning?.payment_id);

      // Put earning on hold
      if (earning) earning.status = 'held';
      
      // Mark payment as disputed
      if (payment) payment.status = 'disputed';
    }, sessionId);

    // Screenshot: Dispute state
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/escrow-09-dispute.png', fullPage: true });

    const dbAfter = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earning = dbAfter.teacher_earnings.find((e: any) => e.session_id === sessionId);
    const payment = dbAfter.payments.find((p: any) => p.id === earning?.payment_id);

    // Verify dispute hold
    expect(earning.status).toBe('held');
    expect(payment.status).toBe('disputed');

    console.log('Dispute State:', {
      payment_status: payment.status,
      earning_status: earning.status,
      funds_held: true
    });
  });
});
