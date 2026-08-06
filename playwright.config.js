// @ts-check
import { defineConfig } from '@playwright/test';

/** Full HD desktop — used for headless and headed UI runs (avoids collapsed mobile nav). */
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

/**
 * PrismStructure — separate UI (Chrome) and API projects
 * API base: https://api.practicesoftwaretesting.com
 * UI base:  https://practicesoftwaretesting.com
 */
export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // Live Toolshop API can return intermittent 500/timeouts — retry locally and in CI
  retries: 2,
  workers: 1,
  // Assertions (expect) — max 30s per check
  expect: {
    timeout: 30000,
  },
  // Clicks, fills, waitFor, etc. — max 30s per action (test timeout stays higher for long flows)
  use: {
    actionTimeout: 30000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          framework: 'playwright',
          ui_base_url: 'https://practicesoftwaretesting.com',
          api_base_url: 'https://api.practicesoftwaretesting.com',
        },
      },
    ],
  ],
  outputDir: 'reports/test-results',
  projects: [
    {
      name: 'Api Tests',
      testDir: './tests/api',
      timeout: 120000,
      use: {
        baseURL: 'https://api.practicesoftwaretesting.com',
        ignoreHTTPSErrors: true,
        timeout: 60000,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'UI Tests',
      testDir: './tests/ui',
      timeout: 150000,
      use: {
        baseURL:
          process.env.BASE_URL ||
          process.env.UI_BASE_URL ||
          'https://practicesoftwaretesting.com',
        ignoreHTTPSErrors: true,
        browserName: 'chromium',
        storageState: undefined,
        viewport: DESKTOP_VIEWPORT,
        isMobile: false,
        hasTouch: false,
        launchOptions: {
          args: [
            `--window-size=${DESKTOP_VIEWPORT.width},${DESKTOP_VIEWPORT.height}`,
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
