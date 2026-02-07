import { test, expect } from '@playwright/test';

/**
 * PAYMENT GOLDEN PATH (offline)
 *
 * Requires the app to be running with:
 * - VITE_USE_MOCK_DATA=true
 *
 * The mock supabase client persists payment + earnings + transaction records
 * in an in-memory store exposed as window.__SACREDCHAIN_MOCK_DB__.
 */

test.describe('Payment Flow (offline mock)', () => {
  test('Book session → mock checkout → payment + earnings recorded', async ({ page }) => {
    // Login first (in offline mode this uses mock auth; in connected env it may fail)
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.getByLabel(/email/i).fill('student@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /^sign in$/i }).click();

    // Ensure we landed on teacher page after redirect
    await expect(page).toHaveURL(/\/teachers\//);

    // Open booking dialog
    await expect(page.getByRole('button', { name: /book session/i })).toBeVisible();
    await page.getByRole('button', { name: /book session/i }).click();

    // Select a date (tomorrow) and a time slot
    // Calendar uses day buttons; pick tomorrow if available.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate());

    await page.getByRole('gridcell', { name: new RegExp(`^${day}$`) }).click();

    const timeSection = page.getByText('Select Time');
    await timeSection.scrollIntoViewIfNeeded();
    await timeSection.locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: '09:00' }).click();

    // Pay (this triggers mock functions.invoke('create-checkout-session'))
    const payButton = page.getByRole('button', { name: /pay/i });
    await expect(payButton).toBeEnabled();
    await payButton.click();

    // Wait for redirect to success URL
    await page.waitForURL(/checkout=success/, { timeout: 10000 });

    // Wait a moment for the page to fully load and initialize
    await page.waitForTimeout(500);

    // Assert mock DB received records
    const db = await page.evaluate(() => (window as any).__SACREDCHAIN_MOCK_DB__);
    expect(db).toBeTruthy();
    expect(Array.isArray(db.payments)).toBeTruthy();
    expect(Array.isArray(db.teacher_earnings)).toBeTruthy();
    expect(Array.isArray(db.transactions)).toBeTruthy();

    // One new row added by mock checkout
    expect(db.payments.length).toBeGreaterThan(1);
    expect(db.teacher_earnings.length).toBeGreaterThan(1);
    expect(db.transactions.length).toBeGreaterThan(1);

    const newestPayment = db.payments[db.payments.length - 1];
    expect(newestPayment.stripe_charge_id).toMatch(/^ch_mock_/);
    expect(newestPayment.status).toBe('held');

    const newestEarning = db.teacher_earnings[db.teacher_earnings.length - 1];
    expect(newestEarning.stripe_charge_id).toBe(newestPayment.stripe_charge_id);
    expect(newestEarning.status).toBe('pending');
  });
});
