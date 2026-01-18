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
    baseURL: process.env.BASE_URL || 'http://localhost:8081',
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
  ],

  // Start dev server if not running
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8081',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
