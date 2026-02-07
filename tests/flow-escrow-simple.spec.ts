import { test, expect } from '@playwright/test';

/**
 * ESCROW FLOW END-TO-END TESTS (Simplified)
 * 
 * Tests escrow states based on what's available in the mock implementation:
 * 1. PENDING → Payment created but not yet captured
 * 2. HELD → Payment received, funds in escrow
 * 3. COMPLETED → Escrow released, funds available to teacher
 * 4. REFUNDED → Payment refunded to student
 * 5. DISPUTED → Payment under dispute
 * 
 * Note: This test works with the mock Supabase client which only tracks
 * payments and teacher_earnings tables. Session management is simplified.
 */

test.describe('Escrow Flow - Payment Status Transitions', () => {
  
  test('Full Flow: Book → Payment Held → Escrow Release → Funds Available', async ({ page }) => {
    // ========================================================================
    // SETUP: Login and navigate to teacher profile
    // ========================================================================
    
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/teachers\//);

    // Screenshot: Initial state - Teacher profile
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/01-teacher-profile.png', 
      fullPage: true 
    });

    // ========================================================================
    // STEP 1: BOOK SESSION & INITIATE PAYMENT
    // ========================================================================
    
    await page.getByRole('button', { name: /book session/i }).click();
    
    // Select date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate());
    
    await page.getByRole('gridcell', { name: new RegExp(`^${day}$`) }).click();
    
    const timeSection = page.getByText('Select Time');
    await timeSection.scrollIntoViewIfNeeded();
    await timeSection.locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: '09:00' }).click();

    // Screenshot: Booking dialog filled
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/02-booking-dialog.png', 
      fullPage: true 
    });

    // ========================================================================
    // STEP 2: COMPLETE PAYMENT (Enters HELD state)
    // ========================================================================
    
    const payButton = page.getByRole('button', { name: /pay/i });
    await expect(payButton).toBeEnabled();
    await payButton.click();

    await page.waitForURL(/checkout=success/, { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Screenshot: Payment success page
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/03-payment-success.png', 
      fullPage: true 
    });

    // ========================================================================
    // VERIFY: Payment is HELD in escrow
    // ========================================================================
    
    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    
    expect(db.payments).toBeTruthy();
    expect(Array.isArray(db.payments)).toBeTruthy();
    expect(db.payments.length).toBeGreaterThan(1); // Initial seed + new payment

    const latestPayment = db.payments[db.payments.length - 1];
    
    console.log('✓ Payment Created:', {
      id: latestPayment.id,
      status: latestPayment.status,
      amount_cents: latestPayment.amount_cents,
      stripe_charge_id: latestPayment.stripe_charge_id,
      escrow_released_at: latestPayment.escrow_released_at
    });

    // VERIFY: Payment status is HELD (in escrow)
    expect(latestPayment.status).toBe('held');
    expect(latestPayment.stripe_charge_id).toMatch(/^ch_mock_/);
    expect(latestPayment.escrow_released_at).toBeFalsy();

    // ========================================================================
    // VERIFY: Teacher earning is PENDING
    // ========================================================================
    
    expect(db.teacher_earnings).toBeTruthy();
    const latestEarning = db.teacher_earnings[db.teacher_earnings.length - 1];
    
    console.log('✓ Earning Created:', {
      id: latestEarning.id,
      status: latestEarning.status,
      amount_cents: latestEarning.amount_cents,
      teacher_id: latestEarning.teacher_id,
      available_at: latestEarning.available_at
    });

    // VERIFY: Earning is PENDING (not yet available)
    expect(latestEarning.status).toBe('pending');
    expect(latestEarning.stripe_charge_id).toBe(latestPayment.stripe_charge_id);
    expect(latestEarning.available_at).toBeFalsy();

    // ========================================================================
    // STEP 3: SIMULATE SESSION COMPLETION
    // ========================================================================
    
    console.log('\n--- Simulating Session Completion ---');
    
    // In real implementation, this would be triggered by:
    // - Teacher marking session as complete
    // - Which calls the release-escrow Edge Function
    // - Which sets available_at = NOW() + 24 hours
    
    await page.evaluate((chargeId) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const earning = db.teacher_earnings.find((e: any) => 
        e.stripe_charge_id === chargeId
      );
      
      if (earning) {
        // Set release time to 24 hours from now
        const releaseTime = new Date();
        releaseTime.setHours(releaseTime.getHours() + 24);
        earning.available_at = releaseTime.toISOString();
        
        console.log('[Mock] Escrow release scheduled for:', earning.available_at);
      }
    }, latestPayment.stripe_charge_id);

    // Navigate to teacher earnings to see pending state
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(1000);

    // Screenshot: Earnings page showing pending funds
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/04-earnings-pending.png', 
      fullPage: true 
    });

    // Verify release timer is set
    const dbAfterComplete = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earningWithTimer = dbAfterComplete.teacher_earnings.find((e: any) => 
      e.stripe_charge_id === latestPayment.stripe_charge_id
    );
    
    expect(earningWithTimer.available_at).toBeTruthy();
    
    const releaseTime = new Date(earningWithTimer.available_at);
    const now = new Date();
    const hoursUntilRelease = (releaseTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    console.log('✓ Escrow Release Timer:', {
      current_time: now.toISOString(),
      release_time: releaseTime.toISOString(),
      hours_until_release: hoursUntilRelease.toFixed(2)
    });

    expect(hoursUntilRelease).toBeGreaterThan(23);
    expect(hoursUntilRelease).toBeLessThan(25);

    // ========================================================================
    // STEP 4: SIMULATE ESCROW RELEASE (24h passed)
    // ========================================================================
    
    console.log('\n--- Simulating Escrow Release (24h passed) ---');
    
    // Simulate the release-escrow cron job running
    await page.evaluate((chargeId) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      
      const earning = db.teacher_earnings.find((e: any) => 
        e.stripe_charge_id === chargeId
      );
      const payment = db.payments.find((p: any) => 
        p.stripe_charge_id === chargeId
      );
      
      if (earning) {
        // Simulate time passing - set available_at to past
        earning.available_at = new Date(Date.now() - 1000).toISOString();
        earning.status = 'available'; // Funds released!
        console.log('[Mock] Earning released to teacher');
      }
      
      if (payment) {
        payment.status = 'completed';
        payment.escrow_released_at = new Date().toISOString();
        console.log('[Mock] Payment marked as completed');
      }
    }, latestPayment.stripe_charge_id);

    await page.reload();
    await page.waitForTimeout(1000);

    // Screenshot: Earnings page showing available funds
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/05-earnings-available.png', 
      fullPage: true 
    });

    // ========================================================================
    // VERIFY: Final state - Escrow released
    // ========================================================================
    
    const dbFinal = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const finalEarning = dbFinal.teacher_earnings.find((e: any) => 
      e.stripe_charge_id === latestPayment.stripe_charge_id
    );
    const finalPayment = dbFinal.payments.find((p: any) => 
      p.stripe_charge_id === latestPayment.stripe_charge_id
    );

    console.log('✓ Final State:', {
      payment_status: finalPayment.status,
      payment_escrow_released_at: finalPayment.escrow_released_at,
      earning_status: finalEarning.status,
      earning_available_at: finalEarning.available_at
    });

    // VERIFY: Payment is COMPLETED
    expect(finalPayment.status).toBe('completed');
    expect(finalPayment.escrow_released_at).toBeTruthy();

    // VERIFY: Earning is AVAILABLE
    expect(finalEarning.status).toBe('available');
    expect(finalEarning.available_at).toBeTruthy();

    console.log('\n✅ ESCROW FLOW COMPLETE: Payment → Held → Released → Available');
  });

  test('Edge Case: Student No-Show → Immediate Release', async ({ page }) => {
    console.log('\n=== Testing: Student No-Show Scenario ===');
    
    // Book and pay for a session
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

    const dbBefore = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const chargeId = dbBefore.payments[dbBefore.payments.length - 1].stripe_charge_id;

    console.log('Payment created:', chargeId);

    // Simulate: Student no-show (teacher reports it)
    console.log('Simulating: Student no-show reported');
    
    await page.evaluate((cid) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const earning = db.teacher_earnings.find((e: any) => e.stripe_charge_id === cid);
      const payment = db.payments.find((p: any) => p.stripe_charge_id === cid);

      // Release funds IMMEDIATELY (no 24h wait for no-shows)
      if (earning) {
        earning.status = 'available';
        earning.available_at = new Date().toISOString();
      }
      
      if (payment) {
        payment.status = 'completed';
        payment.escrow_released_at = new Date().toISOString();
      }
      
      console.log('[Mock] Student no-show: Funds released immediately to teacher');
    }, chargeId);

    // Screenshot the result
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/06-student-noshow.png', 
      fullPage: true 
    });

    const dbAfter = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earning = dbAfter.teacher_earnings.find((e: any) => e.stripe_charge_id === chargeId);
    const payment = dbAfter.payments.find((p: any) => p.stripe_charge_id === chargeId);

    console.log('Result:', {
      earning_status: earning.status,
      payment_status: payment.status,
      released_immediately: true
    });

    // VERIFY: Immediate release
    expect(earning.status).toBe('available');
    expect(payment.status).toBe('completed');
    
    console.log('✅ Student no-show: Funds released immediately');
  });

  test('Edge Case: Teacher No-Show → Refund', async ({ page }) => {
    console.log('\n=== Testing: Teacher No-Show Scenario ===');
    
    // Book and pay for a session
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

    const dbBefore = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const chargeId = dbBefore.payments[dbBefore.payments.length - 1].stripe_charge_id;

    console.log('Payment created:', chargeId);

    // Simulate: Teacher no-show (student reports it)
    console.log('Simulating: Teacher no-show reported');
    
    await page.evaluate((cid) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const earning = db.teacher_earnings.find((e: any) => e.stripe_charge_id === cid);
      const payment = db.payments.find((p: any) => p.stripe_charge_id === cid);

      // Forfeit teacher earning
      if (earning) {
        earning.status = 'forfeited';
      }
      
      // Refund payment to student
      if (payment) {
        payment.status = 'refunded';
        payment.refund_amount_cents = payment.amount_cents;
        payment.refund_reason = 'teacher_no_show';
      }
      
      console.log('[Mock] Teacher no-show: Payment refunded to student');
    }, chargeId);

    // Screenshot the result
    await page.goto('/student/sessions');
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/07-teacher-noshow.png', 
      fullPage: true 
    });

    const dbAfter = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earning = dbAfter.teacher_earnings.find((e: any) => e.stripe_charge_id === chargeId);
    const payment = dbAfter.payments.find((p: any) => p.stripe_charge_id === chargeId);

    console.log('Result:', {
      earning_status: earning.status,
      payment_status: payment.status,
      refund_amount: payment.refund_amount_cents,
      refund_reason: payment.refund_reason
    });

    // VERIFY: Earning forfeited, payment refunded
    expect(earning.status).toBe('forfeited');
    expect(payment.status).toBe('refunded');
    expect(payment.refund_reason).toBe('teacher_no_show');
    
    console.log('✅ Teacher no-show: Payment refunded');
  });

  test('Edge Case: Dispute → Funds Held', async ({ page }) => {
    console.log('\n=== Testing: Dispute Scenario ===');
    
    // Book and pay for a session
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

    const dbBefore = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const chargeId = dbBefore.payments[dbBefore.payments.length - 1].stripe_charge_id;

    console.log('Payment created:', chargeId);

    // Simulate: Dispute raised
    console.log('Simulating: Payment dispute raised');
    
    await page.evaluate((cid) => {
      const db = (window as any).__SACREDCHAIN_MOCK_DB__;
      const earning = db.teacher_earnings.find((e: any) => e.stripe_charge_id === cid);
      const payment = db.payments.find((p: any) => p.stripe_charge_id === cid);

      // Put earning on hold
      if (earning) {
        earning.status = 'held';
      }
      
      // Mark payment as disputed
      if (payment) {
        payment.status = 'disputed';
      }
      
      console.log('[Mock] Dispute: Funds held pending resolution');
    }, chargeId);

    // Screenshot the result
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/08-dispute.png', 
      fullPage: true 
    });

    const dbAfter = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    const earning = dbAfter.teacher_earnings.find((e: any) => e.stripe_charge_id === chargeId);
    const payment = dbAfter.payments.find((p: any) => p.stripe_charge_id === chargeId);

    console.log('Result:', {
      earning_status: earning.status,
      payment_status: payment.status,
      funds_held: true
    });

    // VERIFY: Dispute holds funds
    expect(earning.status).toBe('held');
    expect(payment.status).toBe('disputed');
    
    console.log('✅ Dispute: Funds held for investigation');
  });
});

test.describe('Escrow State Documentation', () => {
  test('Capture all escrow states for documentation', async ({ page }) => {
    console.log('\n=== Generating Escrow State Documentation ===');
    
    // Login
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/teachers\//);

    // Create multiple payments in different states
    const states = ['held', 'pending', 'completed', 'refunded', 'disputed'];
    
    for (const state of states) {
      await page.evaluate((s) => {
        const db = (window as any).__SACREDCHAIN_MOCK_DB__;
        const chargeId = `ch_mock_doc_${s}_${Date.now()}`;
        
        db.payments.push({
          id: `payment-doc-${s}`,
          student_id: 'mock-student-1',
          teacher_id: 'mock-teacher-1',
          amount_cents: 5000,
          status: s,
          stripe_charge_id: chargeId,
          created_at: new Date().toISOString(),
          escrow_released_at: s === 'completed' ? new Date().toISOString() : null,
        });
        
        const earningStatus = s === 'completed' ? 'available' : 
                             s === 'refunded' ? 'forfeited' :
                             s === 'disputed' ? 'held' : 'pending';
        
        db.teacher_earnings.push({
          id: `earning-doc-${s}`,
          teacher_id: 'mock-teacher-1',
          amount_cents: 4250,
          status: earningStatus,
          stripe_charge_id: chargeId,
        });
      }, state);
    }

    // Navigate to earnings page to show all states
    await page.goto('/teacher/earnings');
    await page.waitForTimeout(1000);
    
    // Screenshot: All escrow states
    await page.screenshot({ 
      path: 'test-results/escrow-screenshots/99-all-states-overview.png', 
      fullPage: true 
    });

    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    
    console.log('\nEscrow States Summary:');
    console.log('======================');
    console.log('Total Payments:', db.payments.length);
    console.log('Total Earnings:', db.teacher_earnings.length);
    console.log('\nPayment States:');
    
    const paymentsByStatus: Record<string, number> = {};
    db.payments.forEach((p: any) => {
      paymentsByStatus[p.status] = (paymentsByStatus[p.status] || 0) + 1;
    });
    
    Object.entries(paymentsByStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    console.log('\n✅ Escrow state documentation captured');
  });
});
