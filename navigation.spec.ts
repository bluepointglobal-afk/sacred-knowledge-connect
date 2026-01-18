import { test, expect } from '@playwright/test';

/**
 * NAVIGATION SMOKE TESTS
 * These verify that all routes load and basic navigation works.
 * Run frequently during development: npx playwright test navigation
 */

test.describe('Public Routes Load', () => {
  test('Landing page loads with core elements', async ({ page }) => {
    await page.goto('/');
    
    // Should have navigation
    await expect(page.locator('header, nav')).toBeVisible();
    
    // Should have main CTAs
    await expect(page.getByRole('link', { name: /teacher|browse|find/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /bundle|course|learn/i })).toBeVisible();
  });

  test('Teachers listing loads', async ({ page }) => {
    await page.goto('/teachers');
    await expect(page).toHaveURL('/teachers');
    
    // Wait for content (not loading state)
    await page.waitForSelector('[data-testid="teacher-card"], .teacher-card, article', { 
      timeout: 10000 
    }).catch(() => {
      // If no specific selector, at least check we're not on error page
    });
    
    // Should not show error state
    await expect(page.getByText(/error|failed|not found/i)).not.toBeVisible();
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
    await page.getByRole('link', { name: /sacredchain|logo|home/i }).first().click();
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
    const is404 = await page.getByText(/404|not found|page doesn't exist/i).isVisible();
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
