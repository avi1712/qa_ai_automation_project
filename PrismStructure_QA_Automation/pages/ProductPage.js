const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * ProductPage — browse / search / add to cart
 */
class ProductPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.searchInput = this.locator('[data-test="search-query"]');
    this.searchBtn = this.locator('[data-test="search-submit"]');
    this.productCards = this.locator('[data-test^="product-"]');
    this.addToCartBtn = this.locator('[data-test="add-to-cart"]');
    this.productName = this.locator('[data-test="product-name"]');
    this.toastMessage = this.locator('.toast-message');
  }

  async gotoHome() {
    await super.goto('/');
  }

  /** Wait for the product detail page to fully render (Angular SPA needs explicit wait). */
  async waitForPageLoad() {
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.productName).toBeVisible();
    console.log('[ProductPage] Product detail loaded:', await this.productName.textContent());
  }

  /** @param {string} query */
  async search(query) {
    await this.searchInput.fill(query);
    await this.searchBtn.click();
  }

  async openFirstProduct() {
    await this.productCards.first().click();
  }

  async addToCart() {
    console.log('[ProductPage] Clicking Add to cart');
    await this.addToCartBtn.click();
    console.log('[ProductPage] Add to cart clicked');
  }

  /** Verify the toast notification message after adding to cart. */
  async addToCartAndVerifyToastMessage() {
    await this.waitForPageLoad();
    await this.addToCart();
    await this.toastMessage.waitFor({ state: 'visible', timeout: 6000 });
    const text = await this.toastMessage.textContent();
    await expect(this.toastMessage).toContainText('Product added to shopping cart');
    console.log('[ProductPage] Toast verified:', text?.trim());
    await this.toastMessage.waitFor({ state: 'hidden', timeout: 10000 });
    console.log('[ProductPage] Toast dismissed');
  }
}

module.exports = { ProductPage };
