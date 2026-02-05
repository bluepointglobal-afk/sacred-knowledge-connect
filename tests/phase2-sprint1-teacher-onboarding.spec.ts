import { test, expect } from '@playwright/test';

/**
 * Phase 2 Sprint 1: Global Teacher Onboarding E2E Tests
 * Tests the 6-step wizard for 3 teacher personas:
 * 1. Egyptian teacher (Wise payout)
 * 2. Pakistani teacher (IBAN payout)
 * 3. Tunisian teacher (PayPal payout)
 */

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

// Helper function to generate unique email
const generateEmail = (prefix: string) => `${prefix}.${Date.now()}@test-sacred.com`;

test.describe('Phase 2 Sprint 1: Teacher Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/become-teacher`);
    await page.waitForLoadState('networkidle');
  });

  test('Persona 1: Egyptian Teacher with Wise Payout', async ({ page }) => {
    const email = generateEmail('ahmed.almasri');
    const password = 'TestPassword123!';

    // Check if already logged in, if not create account
    const loginVisible = await page.locator('text=Create an account').isVisible();
    if (loginVisible) {
      // Create account
      await page.fill('input[id="signupEmail"]', email);
      await page.fill('input[id="signupPassword"]', password);
      await page.click('button:has-text("Create account")');
      
      // Wait for account creation (may need email verification in production)
      await page.waitForTimeout(2000);
    }

    // Step 1: Basic Information
    await expect(page.locator('h2:has-text("Basic Information")')).toBeVisible();
    await page.fill('input[id="fullName"]', 'Ahmed Al-Masri');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="phone"]', '+20 100 123 4567');
    await page.click('button:has-text("Next")');

    // Step 2: Payout Method - Wise
    await expect(page.locator('h2:has-text("Payout Method")')).toBeVisible();
    await page.click('input[id="wise"]');
    await page.fill('input[id="wiseId"]', 'ahmed.almasri@wise.com');
    await page.click('button:has-text("Next")');

    // Step 3: Timezone
    await expect(page.locator('h2:has-text("Timezone")')).toBeVisible();
    await page.click('button[role="combobox"]');
    await page.click('text=Africa/Cairo');
    await page.click('button:has-text("Next")');

    // Step 4: Regional Specialization
    await expect(page.locator('h2:has-text("Regional Specialization")')).toBeVisible();
    await page.click('input[id="north_africa"]');
    await page.click('button[role="combobox"]');
    await page.click('text=Egypt');
    await page.click('button:has-text("Next")');

    // Step 5: Teaching Languages
    await expect(page.locator('h2:has-text("Teaching Languages")')).toBeVisible();
    await page.check('input[id="arabic"]');
    await page.check('input[id="english"]');
    await page.click('button:has-text("Next")');

    // Step 6: Review & Submit
    await expect(page.locator('h2:has-text("Review & Submit")')).toBeVisible();
    
    // Verify review data
    await expect(page.locator('text=Ahmed Al-Masri')).toBeVisible();
    await expect(page.locator('text=Wise')).toBeVisible();
    await expect(page.locator('text=ahmed.almasri@wise.com')).toBeVisible();
    await expect(page.locator('text=Africa/Cairo')).toBeVisible();
    await expect(page.locator('text=North Africa')).toBeVisible();

    // Submit
    await page.click('button:has-text("Submit & Continue")');

    // Wait for redirect to course creation
    await page.waitForURL(/\/teacher\/courses\/new/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/teacher\/courses\/new/);
  });

  test('Persona 2: Pakistani Teacher with IBAN Payout', async ({ page }) => {
    const email = generateEmail('fatima.khan');
    const password = 'TestPassword123!';

    // Check if already logged in, if not create account
    const loginVisible = await page.locator('text=Create an account').isVisible();
    if (loginVisible) {
      await page.fill('input[id="signupEmail"]', email);
      await page.fill('input[id="signupPassword"]', password);
      await page.click('button:has-text("Create account")');
      await page.waitForTimeout(2000);
    }

    // Step 1: Basic Information
    await page.fill('input[id="fullName"]', 'Fatima Khan');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="phone"]', '+92 300 1234567');
    await page.click('button:has-text("Next")');

    // Step 2: Payout Method - IBAN
    await page.click('input[id="iban"]');
    await page.fill('input[id="ibanNumber"]', 'PK36 SCBL 0000 0011 2345 6702');
    await page.fill('input[id="accountHolderName"]', 'Fatima Khan');
    await page.click('button[role="combobox"]');
    await page.click('text=Pakistan');
    await page.click('button:has-text("Next")');

    // Step 3: Timezone
    await page.click('button[role="combobox"]');
    await page.click('text=Asia/Karachi');
    await page.click('button:has-text("Next")');

    // Step 4: Regional Specialization
    await page.click('input[id="south_asia"]');
    await page.click('button[role="combobox"]');
    await page.click('text=Pakistan');
    await page.click('button:has-text("Next")');

    // Step 5: Teaching Languages
    await page.check('input[id="urdu"]');
    await page.check('input[id="arabic"]');
    await page.check('input[id="english"]');
    await page.click('button:has-text("Next")');

    // Step 6: Review & Submit
    await expect(page.locator('text=Fatima Khan')).toBeVisible();
    await expect(page.locator('text=Bank IBAN')).toBeVisible();
    await expect(page.locator('text=PK36 SCBL 0000 0011 2345 6702')).toBeVisible();
    await expect(page.locator('text=Asia/Karachi')).toBeVisible();
    await expect(page.locator('text=South Asia')).toBeVisible();

    await page.click('button:has-text("Submit & Continue")');
    await page.waitForURL(/\/teacher\/courses\/new/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/teacher\/courses\/new/);
  });

  test('Persona 3: Tunisian Teacher with PayPal Payout', async ({ page }) => {
    const email = generateEmail('youssef.benali');
    const password = 'TestPassword123!';

    // Check if already logged in, if not create account
    const loginVisible = await page.locator('text=Create an account').isVisible();
    if (loginVisible) {
      await page.fill('input[id="signupEmail"]', email);
      await page.fill('input[id="signupPassword"]', password);
      await page.click('button:has-text("Create account")');
      await page.waitForTimeout(2000);
    }

    // Step 1: Basic Information
    await page.fill('input[id="fullName"]', 'Youssef Ben Ali');
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="phone"]', '+216 98 123 456');
    await page.click('button:has-text("Next")');

    // Step 2: Payout Method - PayPal
    await page.click('input[id="paypal"]');
    await page.fill('input[id="paypalEmail"]', 'youssef.paypal@example.com');
    await page.click('button:has-text("Next")');

    // Step 3: Timezone
    await page.click('button[role="combobox"]');
    await page.click('text=Africa/Tunis');
    await page.click('button:has-text("Next")');

    // Step 4: Regional Specialization
    await page.click('input[id="north_africa"]');
    await page.click('button[role="combobox"]');
    await page.click('text=Tunisia');
    await page.click('button:has-text("Next")');

    // Step 5: Teaching Languages
    await page.check('input[id="arabic"]');
    await page.check('input[id="french"]');
    await page.check('input[id="english"]');
    await page.click('button:has-text("Next")');

    // Step 6: Review & Submit
    await expect(page.locator('text=Youssef Ben Ali')).toBeVisible();
    await expect(page.locator('text=PayPal')).toBeVisible();
    await expect(page.locator('text=youssef.paypal@example.com')).toBeVisible();
    await expect(page.locator('text=Africa/Tunis')).toBeVisible();

    await page.click('button:has-text("Submit & Continue")');
    await page.waitForURL(/\/teacher\/courses\/new/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/teacher\/courses\/new/);
  });

  test('Form Validation: IBAN Format', async ({ page }) => {
    // Assuming logged in
    await page.waitForTimeout(1000);

    // Navigate through to IBAN step
    await page.fill('input[id="fullName"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="phone"]', '+1234567890');
    await page.click('button:has-text("Next")');

    // Select IBAN but enter invalid format
    await page.click('input[id="iban"]');
    await page.fill('input[id="ibanNumber"]', 'INVALID');
    await page.fill('input[id="accountHolderName"]', 'Test User');
    await page.click('button[role="combobox"]');
    await page.click('text=Pakistan');
    
    // Try to proceed (should show error)
    await page.click('button:has-text("Next")');
    
    // Should show validation error toast
    await expect(page.locator('text=/Invalid IBAN format/')).toBeVisible({ timeout: 3000 });
  });

  test('Form Validation: Email Required', async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.fill('input[id="fullName"]', 'Test User');
    // Leave email empty
    await page.fill('input[id="phone"]', '+1234567890');
    await page.click('button:has-text("Next")');

    // Should show validation error
    await expect(page.locator('text=/email is required/')).toBeVisible({ timeout: 3000 });
  });

  test('Form Validation: At Least One Language Required', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Navigate through to language step
    await page.fill('input[id="fullName"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="phone"]', '+1234567890');
    await page.click('button:has-text("Next")');

    await page.click('input[id="wise"]');
    await page.fill('input[id="wiseId"]', 'test@wise.com');
    await page.click('button:has-text("Next")');

    await page.click('button[role="combobox"]');
    await page.click('text=UTC');
    await page.click('button:has-text("Next")');

    await page.click('input[id="north_africa"]');
    await page.click('button[role="combobox"]');
    await page.click('text=Egypt');
    await page.click('button:has-text("Next")');

    // Don't select any language
    await page.click('button:has-text("Next")');

    // Should show validation error
    await expect(page.locator('text=/at least one teaching language/')).toBeVisible({ timeout: 3000 });
  });

  test('Navigation: Back Button Works', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Step 1
    await page.fill('input[id="fullName"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="phone"]', '+1234567890');
    await page.click('button:has-text("Next")');

    // Step 2
    await expect(page.locator('h2:has-text("Payout Method")')).toBeVisible();
    
    // Click Back
    await page.click('button:has-text("Back")');

    // Should return to Step 1
    await expect(page.locator('h2:has-text("Basic Information")')).toBeVisible();
    
    // Form should retain data
    await expect(page.locator('input[id="fullName"]')).toHaveValue('Test User');
  });

  test('Duplicate Profile Prevention', async ({ page }) => {
    // This test would require:
    // 1. Creating a teacher profile
    // 2. Logging out
    // 3. Logging back in with same account
    // 4. Attempting to create profile again
    // 5. Expecting redirect or error message
    
    // Placeholder for implementation with actual auth flow
    test.skip();
  });
});
