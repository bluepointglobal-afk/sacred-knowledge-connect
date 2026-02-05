import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Quick navigation smoke tests - run these frequently
    {
      name: 'navigation',
      testMatch: /navigation\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Full flow tests - run before deploy
    {
      name: 'flows',
      testMatch: /flow-.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Auth-specific tests
    {
      name: 'auth',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Phase 2 Sprint 1 E2E tests (teacher + student onboarding)
    {
      name: 'phase2-sprint1',
      testMatch: /phase2-sprint1-.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 120000, // 2 minutes per test (booking flow can be slow)
    },
  ],

  // Start dev server if not running
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
