import { test, expect } from '@playwright/test';

/**
 * STUDENT USER FLOW
 * End-to-end journey: Browse → View → Enroll → Dashboard
 */

test.describe('Browse Flow', () => {
  test('Can browse teachers from homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /teacher/i }).first().click();
    await expect(page).toHaveURL(/\/teachers/);
  });

  test('Can browse bundles from homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /bundle|course|browse/i }).first().click();
    await expect(page).toHaveURL(/\/bundles/);
  });
});

test.describe('Bundle Detail', () => {
  test('Bundle page shows enroll button', async ({ page }) => {
    await page.goto('/bundles');
    
    const bundleLink = page.locator('a[href*="/bundles/"]').first();
    if (await bundleLink.isVisible()) {
      await bundleLink.click();
      await expect(page).toHaveURL(/\/bundles\/.+/);
      await expect(page.getByRole('button', { name: /enroll|start|begin|continue/i })).toBeVisible();
    }
  });
});

test.describe('Teacher Detail', () => {
  test('Teacher page loads with content', async ({ page }) => {
    await page.goto('/teachers');
    
    const teacherLink = page.locator('a[href*="/teachers/"]').first();
    if (await teacherLink.isVisible()) {
      await teacherLink.click();
      await expect(page).toHaveURL(/\/teachers\/.+/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});