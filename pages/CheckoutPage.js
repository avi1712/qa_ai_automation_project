const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * CheckoutPage — COD checkout; TC-UI-02 validates payment success after Confirm #1
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

    // Prefer data-test when present; fall back to label
    this.billingStreet = this.page.locator('[data-test="street"], [formcontrolname="street"]').or(
      this.page.getByLabel(/^Street$/i),
    );
    this.billingCity = this.page.locator('[data-test="city"], [formcontrolname="city"]').or(
      this.page.getByLabel(/^City$/i),
    );
    this.billingState = this.page.locator('[data-test="state"], [formcontrolname="state"]').or(
      this.page.getByLabel(/^State$/i),
    );
    this.billingCountry = this.page.locator('[data-test="country"], [formcontrolname="country"]').or(
      this.page.getByLabel(/^Country$/i),
    );
    this.billingPostalCode = this.page
      .locator('[data-test="postal_code"], [formcontrolname="postal_code"]')
      .or(this.page.getByLabel(/Postal code/i));
    this.billingHouseNumber = this.page
      .locator('[data-test="house_number"], [formcontrolname="house_number"]')
      .or(this.page.getByLabel(/House number/i));
  }

  async chooseCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');
  }

  /** Click Proceed to checkout on sign-in / address gate (data-test="proceed-2"). */
  async clickProceedToAddress() {
    console.log('[CheckoutPage] Clicking proceed-2');
    await this.proceedAddress.waitFor({ state: 'visible', timeout: 15000 });
    await this.proceedAddress.click();
    console.log('[CheckoutPage] proceed-2 clicked');
  }

  /**
   * @param {{ billing_street: string, billing_city: string, billing_state: string, billing_country: string, billing_postal_code: string, billing_house_number?: string }} billing
   */
  async fillBillingAddress(billing) {
    console.log('[CheckoutPage] Filling billing address');

    const countryLabels = {
      IN: 'India',
      TG: 'Togo',
      NL: 'Netherlands (the)',
      US: 'United States of America (the)',
      AL: 'Albania',
    };
    const countryLabel = countryLabels[billing.billing_country] || billing.billing_country;
    const houseNo = String(billing.billing_house_number || '42');

    await this.billingCountry.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.billingCountry.first().selectOption({ label: countryLabel });
    console.log('[CheckoutPage] Country selected:', countryLabel);

    const fillAndCommit = async (locator, value, label) => {
      const field = locator.first();
      await field.waitFor({ state: 'visible' });
      await field.click();
      await field.fill(String(value));
      await field.dispatchEvent('input');
      await field.dispatchEvent('change');
      await field.blur();
      console.log(`[CheckoutPage] ${label} filled:`, value);
    };

    await fillAndCommit(this.billingStreet, billing.billing_street, 'Street');
    await fillAndCommit(this.billingCity, billing.billing_city, 'City');
    await fillAndCommit(this.billingState, billing.billing_state, 'State');
    await fillAndCommit(this.billingPostalCode, billing.billing_postal_code, 'Postal code');
    await fillAndCommit(this.billingHouseNumber, houseNo, 'House number');

    await expect
      .poll(async () => this.proceedPayment.isEnabled(), {
        timeout: 30000,
        message: 'proceed-3 stayed disabled after billing fill',
      })
      .toBeTruthy();
    console.log('[CheckoutPage] Proceed to checkout (proceed-3) is enabled');
  }

  /** Click Proceed to checkout on address step (data-test="proceed-3"). */
  async clickProceedToPayment() {
    console.log('[CheckoutPage] Clicking proceed-3');
    await this.proceedPayment.waitFor({ state: 'visible' });
    await expect(this.proceedPayment).toBeEnabled({ timeout: 15000 });
    await this.proceedPayment.click();
    console.log('[CheckoutPage] proceed-3 clicked');
  }

  /**
   * COD payment: select cash-on-delivery, Confirm once, assert "Payment was successful".
   */
  async completeCashOnDeliveryAndVerifyPaymentSuccess() {
    console.log('[CheckoutPage] Waiting for payment method');
    await this.paymentMethod.waitFor({ state: 'visible' });
    await this.chooseCashOnDelivery();
    console.log('[CheckoutPage] Payment method: cash-on-delivery');

    await this.confirmBtn.waitFor({ state: 'visible' });
    await expect(this.confirmBtn).toBeEnabled();
    await this.confirmBtn.click();
    console.log('[CheckoutPage] Confirm clicked');

    await expect(this.successMessage).toBeVisible({ timeout: 20000 });
    await expect(this.successMessage).toContainText(/Payment was successful/i);
    console.log('[CheckoutPage] Payment success verified');
  }
}

module.exports = { CheckoutPage };
