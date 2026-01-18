import { test, expect } from '@playwright/test';

/**
 * NAVIGATION SMOKE TESTS
 * These verify that all routes load and basic navigation works.
 * Run frequently during development: npx playwright test navigation
 */

test.describe('Public Routes Load', () => {
  test('Landing page loads with core elements', async ({ page }) => {
    await page.goto('/');

    // Should have header/navigation
    await expect(page.locator('header').first()).toBeVisible();

    // Should have main CTAs
    await expect(page.getByRole('link', { name: /teacher|browse|find/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /bundle|course|learn/i }).first()).toBeVisible();
  });

  test('Teachers listing loads', async ({ page }) => {
    await page.goto('/teachers');
    await expect(page).toHaveURL('/teachers');

    // Wait for page to finish loading
    await page.waitForLoadState('networkidle');

    // Page should load - check for either content or error message (both valid states)
    // Error state is valid if Supabase is not seeded
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('Bundles listing loads', async ({ page }) => {
    await page.goto('/bundles');
    await expect(page).toHaveURL('/bundles');
    await expect(page.getByText(/error|failed|not found/i)).not.toBeVisible();
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    
    // Should have auth form elements
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in|submit/i })).toBeVisible();
  });

  test('Business page loads', async ({ page }) => {
    await page.goto('/business');
    // Should either load or redirect - both are valid
    await expect(page.getByText(/error 404/i)).not.toBeVisible();
  });

  test('How It Works page loads', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page).toHaveURL('/how-it-works');
    await expect(page.getByRole('heading', { name: /how.*works/i })).toBeVisible();
  });

  test('Privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL('/privacy');
    await expect(page.getByRole('heading', { name: /privacy/i })).toBeVisible();
  });

  test('Terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveURL('/terms');
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });
});

test.describe('Navigation Links Work', () => {
  test('Header nav → Teachers', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /teacher/i }).first().click();
    await expect(page).toHaveURL(/\/teachers/);
  });

  test('Header nav → Bundles', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /bundle|course/i }).first().click();
    await expect(page).toHaveURL(/\/bundles/);
  });

  test('Header nav → Sign In', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Logo → Home', async ({ page }) => {
    await page.goto('/teachers');
    // Logo contains "Sacred" and "Knowledge" text
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Detail Page Navigation', () => {
  test('Teachers list → Teacher detail', async ({ page }) => {
    await page.goto('/teachers');
    
    // Click first teacher card/link
    const teacherLink = page.locator('a[href*="/teachers/"]').first();
    
    if (await teacherLink.isVisible()) {
      await teacherLink.click();
      await expect(page).toHaveURL(/\/teachers\/.+/);
    } else {
      test.skip();
    }
  });

  test('Bundles list → Bundle detail', async ({ page }) => {
    await page.goto('/bundles');
    
    const bundleLink = page.locator('a[href*="/bundles/"]').first();
    
    if (await bundleLink.isVisible()) {
      await bundleLink.click();
      await expect(page).toHaveURL(/\/bundles\/.+/);
    } else {
      test.skip();
    }
  });
});

test.describe('Protected Route Redirects', () => {
  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('Enrollment page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/enrollments/some-id');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Error Handling', () => {
  test('Invalid route shows 404 or redirects', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');

    // Either shows 404 content OR redirects to home - both acceptable
    const is404 = await page.getByRole('heading', { name: '404' }).isVisible();
    const isHome = page.url().endsWith('/');

    expect(is404 || isHome).toBeTruthy();
  });

  test('Invalid teacher ID handles gracefully', async ({ page }) => {
    await page.goto('/teachers/invalid-uuid-12345');
    
    // Should show error state or redirect, not crash
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('Invalid bundle ID handles gracefully', async ({ page }) => {
    await page.goto('/bundles/invalid-uuid-12345');
    
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
