import { test, expect } from '@playwright/test';

/**
 * AUTHENTICATION FLOW TESTS
 * Tests login, signup, and auth state transitions
 */

test.describe('Login Flow', () => {
  test('Can navigate to login and see form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in|submit/i })).toBeVisible();
  });

  test('Shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|log in|submit/i }).click();
    
    // Should show error message and stay on login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid|error|incorrect|failed/i)).toBeVisible({ timeout: 5000 });
  });

  test('Google OAuth button exists and is clickable', async ({ page }) => {
    await page.goto('/login');
    
    const googleButton = page.getByRole('button', { name: /google|continue with google/i });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });
});

test.describe('Auth State Transitions', () => {
  test('Unauthenticated user redirected from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});