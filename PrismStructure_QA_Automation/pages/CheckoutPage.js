const { BasePage } = require('./BasePage');

/**
 * CheckoutPage — COD checkout; Confirm must be pressed TWICE for invoice
 */
class CheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.proceedAddress = this.locator('[data-test="proceed-2"]');
    this.proceedPayment = this.locator('[data-test="proceed-3"]');
    this.paymentMethod = this.locator('[data-test="payment-method"]');
    this.confirmBtn = this.locator('[data-test="finish"]');
    this.successMessage = this.locator('[data-test="payment-success-message"]');
    this.orderConfirmation = this.getByText(/Thanks for your order|invoice/i);
  }

  async chooseCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');
  }

  /**
   * Toolshop quirk from assessment: press Confirm twice to generate invoice.
   */
  async confirmTwice() {
    await this.confirmBtn.click();
    await this.confirmBtn.click();
  }
}

module.exports = { CheckoutPage };
