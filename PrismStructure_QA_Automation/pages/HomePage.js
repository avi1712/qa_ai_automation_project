const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * HomePage — landing page navigation, search, and product browse
 */
class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.signInBtn = this.locator("//*[@routerlink='/auth/login']");
    this.menu = this.locator('[data-test="nav-menu"]');
    this.homeLink = this.locator('[data-test="nav-home"]');
    this.cartNav = this.locator('[data-test="nav-cart"]');
    this.searchInput = this.locator('[data-test="search-query"]');
    this.searchBtn = this.locator('[data-test="search-submit"]');
    // All product cards (ULID-keyed containers, excludes inner product-name/product-price elements)
    this.productCardItems = this.locator('[data-test^="product-0"]');
  }

  /** Open base URL, maximize window, wait for page load. */
  async goto() {
    console.log('[HomePage] Opening home page');
    await this.maximize();
    await super.goto('/');
    console.log('[HomePage] Home page loaded');
  }

  async verifyLoaded() {
    await this.page.waitForLoadState('load');
    await this.searchInput.waitFor({ state: 'visible' });
    await expect(this.searchInput).toBeVisible();
    await expect(this.productCardItems.first()).toBeVisible();
    console.log('[HomePage] Home page verified — search and products visible');
  }

  async openSignIn() {
    console.log('[HomePage] Opening sign in');
    await this.signInBtn.waitFor({ state: 'visible' });
    await this.signInBtn.click();
    console.log('[HomePage] Sign in clicked');
  }

  async clickHome() {
    console.log('[HomePage] Navigating to home');
    await this.homeLink.waitFor({ state: 'visible' });
    await this.homeLink.click();
    console.log('[HomePage] Home link clicked');
  }

  async openCart() {
    console.log('[HomePage] Opening cart via nav icon');
    await this.cartNav.waitFor({ state: 'attached', timeout: 10000 });
    await this.cartNav.click({ force: true });
    console.log('[HomePage] Cart nav clicked');
  }

  /** @param {string} query */
  async search(query) {
    console.log(`[HomePage] Searching for: ${query}`);
    await this.searchInput.fill(query);
    await this.searchBtn.click();
    console.log('[HomePage] Search submitted');
  }

  async openFirstProduct() {
    console.log('[HomePage] Clicking first product card');
    await this.productCardItems.first().waitFor({ state: 'visible' });
    await this.productCardItems.first().click();
    console.log('[HomePage] First product card clicked');
  }

  async openSecondProduct() {
    console.log('[HomePage] Clicking second product card');
    await this.productCardItems.nth(1).waitFor({ state: 'visible'});
    await this.productCardItems.nth(1).click();
    console.log('[HomePage] Second product card clicked');
  }
}

module.exports = { HomePage };
