const { BasePage } = require('./BasePage');

/**
 * CartPage — multi-item / quantity updates
 */
class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.cartNav = this.locator('[data-test="nav-cart"]');
    this.cartItems = this.locator('[data-test="cart-item"]');
    this.quantityInput = this.locator('[data-test="product-quantity"]').first();
    this.proceedBtn = this.locator('[data-test="proceed-1"]');
  }

  /** Click the cart icon in the top nav.
   * Uses dispatchEvent because the nav-cart link can be off-screen in headless viewports. */
  async openCart() {
    console.log('[CartPage] Clicking cart icon');
    await this.cartNav.waitFor({ state: 'attached', timeout: 10000 });
    await this.cartNav.dispatchEvent('click');
    console.log('[CartPage] Cart icon clicked');
  }

  /** @param {string|number} qty */
  async updateQuantity(qty) {
    await this.quantityInput.fill(String(qty));
  }

  async OpenCartAndProceedToCheckout() {
    await this.openCart();
    console.log('[CartPage] Opening cart and proceeding to checkout');
    await this.proceedBtn.waitFor({ state: 'visible'});
    await this.proceedBtn.click();
    console.log('[CartPage] Opened cart and proceeded to checkout');
  }
}

module.exports = { CartPage };
