const { BasePage } = require('./BasePage');

/**
 * CartPage — multi-item / quantity updates
 */
class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.cartNav = this.locator('[data-test="nav-cart"]');
    this.quantityInput = this.locator('[data-test="product-quantity"]').first();
    this.proceedBtn = this.locator('[data-test="proceed-1"]');
  }

  async openCart() {
    await this.cartNav.click();
  }

  /** @param {string|number} qty */
  async updateQuantity(qty) {
    await this.quantityInput.fill(String(qty));
  }

  async proceedToCheckout() {
    await this.proceedBtn.click();
  }
}

module.exports = { CartPage };
