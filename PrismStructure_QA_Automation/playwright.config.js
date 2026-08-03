// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * PrismStructure — Chrome only, 1 worker, sequential, maximized window
 * Do NOT spread devices['Desktop Chrome'] with viewport: null —
 * that device sets deviceScaleFactor, which Playwright rejects with null viewport.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],
  outputDir: 'reports/test-results',
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
    // Do not use channel: 'chrome' — system Chrome may autofill saved passwords.
    // Bundled Chromium = clean profile every run.
    storageState: undefined,
    // null viewport = use real window size (needed for maximize)
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
  projects: [
    {
      name: 'chrome',
    },
  ],
});
