/**
 * BasePage — shared superclass for all UI Page Objects (POM)
 */
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

  /** Maximize the browser window (requires viewport: null + --start-maximized). */
  async maximize() {
    const session = await this.page.context().newCDPSession(this.page);
    const { windowId } = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'maximized' },
    });
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
