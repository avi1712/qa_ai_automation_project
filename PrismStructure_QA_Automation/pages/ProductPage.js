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
  }

  async gotoHome() {
    await super.goto('/');
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
    await this.addToCartBtn.click();
  }
}

module.exports = { ProductPage };
