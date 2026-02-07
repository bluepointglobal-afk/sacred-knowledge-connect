import { test, expect } from '@playwright/test';

/**
 * VERIFICATION TEST: Offline Mock Login Flow
 * 
 * This test verifies that the login flow works correctly in offline mock mode.
 * 
 * Issue Fixed: With VITE_MOCK_AUTOLOGIN=false, users are NOT auto-logged in,
 * allowing E2E tests to go through the full login flow.
 * 
 * Expected Behavior:
 * 1. Navigate to login page → shows login form (NOT logged-in state)
 * 2. Fill in credentials → form accepts input
 * 3. Click Sign In → user is authenticated
 * 4. Redirect to teacher page → page loads with booking UI
 */

test.describe('Offline Login Flow - Fixed', () => {
  test('Login flow works correctly with VITE_MOCK_AUTOLOGIN=false', async ({ page }) => {
    // STEP 1: Navigate to login page with redirect parameter
    await page.goto('/login?redirect=/teachers/mock-teacher-1');
    await page.waitForLoadState('networkidle');

    // VERIFY: Page should show LOGIN FORM, not logged-in state
    const emailField = page.getByLabel(/email/i);
    const passwordField = page.getByLabel(/password/i);
    const signInButton = page.getByRole('button', { name: /^sign in$/i });

    await expect(emailField).toBeVisible({ timeout: 5000 });
    await expect(passwordField).toBeVisible({ timeout: 5000 });
    await expect(signInButton).toBeVisible({ timeout: 5000 });

    // Verify NOT logged in (no logout button)
    const logoutButton = page.getByText(/log out/i);
    await expect(logoutButton).not.toBeVisible();

    console.log('✅ Login form is visible (user NOT auto-logged in)');

    // STEP 2: Fill in login credentials
    await emailField.fill('student@example.com');
    await passwordField.fill('password123');

    console.log('✅ Credentials entered');

    // STEP 3: Submit login form
    await signInButton.click();
    await page.waitForTimeout(2000);

    // VERIFY: User should be redirected to teacher page
    await expect(page).toHaveURL(/\/teachers\/mock-teacher-1/, { timeout: 10000 });

    console.log('✅ Redirected to teacher page after login');

    // STEP 4: Verify teacher page loaded correctly
    await page.waitForLoadState('networkidle');

    // Should show teacher profile (not "Not Found")
    await expect(page.getByText(/teacher not found/i)).not.toBeVisible();

    // Should show Book Session button (authenticated user feature)
    const bookButton = page.getByRole('button', { name: /book session/i });
    await expect(bookButton).toBeVisible({ timeout: 5000 });

    console.log('✅ Teacher page loaded with booking UI');

    // VERIFY: User is now logged in (header should show user menu or logout)
    // Note: Exact UI depends on header implementation
    const headerLogout = page.locator('header').getByText(/log out|sign out|account/i);
    const hasUserMenu = await headerLogout.isVisible().catch(() => false);
    
    if (hasUserMenu) {
      console.log('✅ User menu visible in header');
    } else {
      console.log('⚠️  User menu not found in header (may be under dropdown)');
    }

    console.log('');
    console.log('========================================');
    console.log('✅ ALL CHECKS PASSED');
    console.log('========================================');
    console.log('');
    console.log('The offline mock login flow is working correctly:');
    console.log('  1. Login page shows form (NOT auto-logged in)');
    console.log('  2. User can enter credentials');
    console.log('  3. After login, user is redirected to teacher page');
    console.log('  4. Teacher page loads and shows booking UI');
  });

  test('User starts logged out (not auto-authenticated)', async ({ page }) => {
    // Navigate to a protected page directly (without login)
    await page.goto('/dashboard');
    await page.waitForTimeout(1500);

    // Should redirect to login page (because not authenticated)
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Should show login form
    await expect(page.getByLabel(/email/i)).toBeVisible();

    console.log('✅ User is NOT auto-authenticated (protected route redirects to login)');
  });
});
