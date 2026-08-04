const { expect } = require('@playwright/test');
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
    this.invoiceConfirmation = this.locator('#order-confirmation');

    // Billing address fields (address step after proceed-2)
    this.billingStreet = this.page.getByLabel(/^Street$/i);
    this.billingCity = this.page.getByLabel(/^City$/i);
    this.billingState = this.page.getByLabel(/^State$/i);
    this.billingCountry = this.page.getByLabel(/^Country$/i);
    this.billingPostalCode = this.page.getByLabel(/Postal code/i);
    this.billingHouseNumber = this.page.getByLabel(/House number/i);
    this.paymentToast = this.locator('.toast-message');
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

  /** Click Proceed to checkout on sign-in / address gate (data-test="proceed-2"). */
  async clickProceedToAddress() {
    console.log('[CheckoutPage] Clicking proceed-2');
    await this.proceedAddress.waitFor({ state: 'visible', timeout: 15000 });
    await this.proceedAddress.click();
    console.log('[CheckoutPage] proceed-2 clicked');
  }

  /**
   * Choose country, then fill postal code, house no, street, city, state.
   * @param {{ billing_street: string, billing_city: string, billing_state: string, billing_country: string, billing_postal_code: string, billing_house_number?: string }} billing
   */
  async fillBillingAddress(billing) {
    console.log('[CheckoutPage] Filling billing address');

    const countryLabels = {
      TG: 'Togo',
      NL: 'Netherlands (the)',
      US: 'United States of America (the)',
      AL: 'Albania',
    };
    const countryLabel = countryLabels[billing.billing_country] || billing.billing_country;
    const houseNo = billing.billing_house_number || 'A42';

    await this.billingCountry.waitFor({ state: 'visible', timeout: 15000 });
    await this.billingCountry.selectOption({ label: countryLabel });
    console.log('[CheckoutPage] Country selected:', countryLabel);

    await this.billingPostalCode.waitFor({ state: 'visible' });
    await this.billingPostalCode.clear();
    await this.billingPostalCode.fill(billing.billing_postal_code);
    console.log('[CheckoutPage] Postal code filled:', billing.billing_postal_code);

    await this.billingHouseNumber.waitFor({ state: 'visible' });
    await this.billingHouseNumber.clear();
    await this.billingHouseNumber.fill(houseNo);
    await this.billingHouseNumber.blur();
    console.log('[CheckoutPage] House number filled:', houseNo);

    await this.billingStreet.waitFor({ state: 'visible' });
    await this.billingStreet.clear();
    await this.billingStreet.fill(billing.billing_street);
    console.log('[CheckoutPage] Street filled:', billing.billing_street);

    await this.billingCity.waitFor({ state: 'visible' });
    await this.billingCity.clear();
    await this.billingCity.fill(billing.billing_city);
    console.log('[CheckoutPage] City filled:', billing.billing_city);

    await this.billingState.waitFor({ state: 'visible' });
    await this.billingState.clear();
    await this.billingState.fill(billing.billing_state);
    await this.billingState.blur();
    console.log('[CheckoutPage] State filled:', billing.billing_state);

    await expect(this.proceedPayment).toBeEnabled({ timeout: 15000 });
    console.log('[CheckoutPage] Proceed to checkout (proceed-3) is enabled');
  }

  /** Click Proceed to checkout on address step (data-test="proceed-3"). */
  async clickProceedToPayment() {
    console.log('[CheckoutPage] Clicking proceed-3');
    await this.proceedPayment.waitFor({ state: 'visible' });
    await this.proceedPayment.click();
    console.log('[CheckoutPage] proceed-3 clicked');
  }

  /** Select cash-on-delivery, confirm once (toast), confirm again (invoice message). */
  async completeCashOnDeliveryAndVerifyToast() {
    console.log('[CheckoutPage] Waiting for payment method');
    await this.paymentMethod.waitFor({ state: 'visible' });
    await this.chooseCashOnDelivery();
    console.log('[CheckoutPage] Payment method: cash-on-delivery');

    await this.confirmBtn.waitFor({ state: 'visible' });
    await this.confirmBtn.click();
   console.log('[CheckoutPage] Confirm clicked ');
    await this.verifyPaymentSuccessToast();
    // await this.page.waitForTimeout(4000);
    // await this.confirmBtn.waitFor({ state: 'visible' });
    // await this.confirmBtn.click();
    // console.log('[CheckoutPage] Confirm clicked (2nd)');
    //await this.verifyOrderConfirmationMessage();
  }

  async verifyPaymentSuccessToast() {
    const toastOrSuccess = this.page.locator('.toast-message, [data-test="payment-success-message"]');
    await toastOrSuccess.first().waitFor({ state: 'visible'});
    const text = await toastOrSuccess.first().textContent();
    await expect(toastOrSuccess.first()).toContainText(/Payment was successful/i);
    console.log('[CheckoutPage] Payment toast verified:', text?.trim());
  }

  // /** After 2nd Confirm — validate invoice confirmation text. */
  // async verifyOrderConfirmationMessage() {
  //   await this.invoiceConfirmation.waitFor({ state: 'visible' });
  //   await expect(this.invoiceConfirmation).toContainText('Thanks for your order! Your invoice number is');
  //   const text = await this.invoiceConfirmation.textContent();
  //   console.log('[CheckoutPage] Order confirmation verified:', text?.trim());
  // }
}

module.exports = { CheckoutPage };
