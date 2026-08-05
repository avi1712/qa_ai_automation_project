/**
 * BasePage — shared superclass for all UI Page Objects (POM)
 */

/** Match playwright.config.js DESKTOP_VIEWPORT — full screen in headless + headed */
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate and wait until the page is fully loaded.
   * @param {string} path
   * @param {import('@playwright/test').PageGotoOptions} [options]
   */
  async goto(url, options = {}) {
    await this.page.goto(url, {
      timeout: 60000,
      waitUntil: 'networkidle',
      ...options,
    });
    await this.page.waitForLoadState('load');
  }

  /**
   * Ensure full desktop layout — setViewportSize works in headless; CDP maximize helps headed runs.
   */
  async maximize() {
    await this.page.setViewportSize(DESKTOP_VIEWPORT);

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
