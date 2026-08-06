/**
 * BasePage — shared superclass for all UI Page Objects (POM)
 */

/** Match playwright.config.js DESKTOP_VIEWPORT — full screen in headless + headed */
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

/** Default SUT — never fall back to localhost (remote Toolshop). */
const DEFAULT_UI_BASE = 'https://practicesoftwaretesting.com';

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * Resolve path against Playwright baseURL / env / Toolshop default.
   * @param {string} pathOrUrl
   * @returns {string}
   */
  resolveUrl(pathOrUrl) {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }
    const base =
      process.env.BASE_URL ||
      process.env.UI_BASE_URL ||
      process.env.PLAYWRIGHT_BASE_URL ||
      DEFAULT_UI_BASE;
    return new URL(pathOrUrl || '/', base.endsWith('/') ? base : `${base}/`).toString();
  }

  /**
   * Navigate and wait until DOM is ready.
   * Prefer domcontentloaded over networkidle — Toolshop keeps background
   * requests open, so networkidle often times out in CI (60s).
   * @param {string} pathOrUrl
   * @param {import('@playwright/test').PageGotoOptions} [options]
   */
  async goto(pathOrUrl, options = {}) {
    const url = this.resolveUrl(pathOrUrl);
    const { waitUntil = 'domcontentloaded', timeout = 60000, ...rest } = options;

    console.log(`[BasePage] Navigating to ${url} (waitUntil=${waitUntil})`);
    try {
      await this.page.goto(url, {
        timeout,
        waitUntil,
        ...rest,
      });
      await this.page.waitForLoadState('load').catch(() => {
        console.warn('[BasePage] load state not reached — continuing after DOM ready');
      });
      console.log(`[BasePage] Navigation OK: ${this.page.url()}`);
    } catch (err) {
      console.error(`[BasePage] Failed to navigate to ${url}:`, err.message);
      throw new Error(`[BasePage] Navigation failure to ${url}: ${err.message}`);
    }
  }

  /**
   * Ensure full desktop layout — setViewportSize works in headless; CDP maximize helps headed runs.
   * Never throws in CI/headless.
   */
  async maximize() {
    try {
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
    } catch (err) {
      console.warn('[BasePage] setViewportSize failed — continuing:', err.message);
    }

    try {
      const session = await this.page.context().newCDPSession(this.page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'maximized' },
      });
    } catch {
      // Headless has no real window — viewport size above is sufficient
    }
  }

  /**
   * Open Sign in from navbar — expands mobile menu when link is collapsed (headless/small viewport).
   */
  async openSignInFromNav() {
    const signIn = this.locator('[data-test="nav-sign-in"]');
    const menu = this.locator('[data-test="nav-menu"]');

    if (!(await signIn.isVisible())) {
      await menu.waitFor({ state: 'visible' });
      await menu.click();
    }

    await signIn.waitFor({ state: 'visible' });
    await signIn.click();
  }

  /** @param {string} selector */
  locator(selector) {
    return this.page.locator(selector);
  }

  /** @param {string|RegExp} text @param {import('@playwright/test').PageGetByTextOptions} [options] */
  getByText(text, options) {
    return this.page.getByText(text, options);
  }

  /** @returns {Promise<string>} */
  async url() {
    return this.page.url();
  }
}

module.exports = { BasePage };
