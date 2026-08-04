// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * PrismStructure — separate UI (Chrome) and API projects
 * API base: https://api.practicesoftwaretesting.com
 * UI base:  https://practicesoftwaretesting.com
 */
export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],
  outputDir: 'reports/test-results',
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://api.practicesoftwaretesting.com',
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'chrome',
      testDir: './tests/ui',
      use: {
        baseURL: 'https://practicesoftwaretesting.com',
        ignoreHTTPSErrors: true,
        browserName: 'chromium',
        storageState: undefined,
        viewport: null,
        launchOptions: {
          args: [
            '--start-maximized',
            '--disable-save-password-bubble',
            '--disable-password-manager-reauthentication',
            '--disable-features=PasswordManagerOnboarding,PasswordCheck,AutofillServerCommunication',
            '--password-store=basic',
          ],
        },
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
