const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * CheckoutPage — COD checkout; Confirm #1 = payment success, Confirm #2 = invoice
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
    this.invoiceOrderMessage = this.page.getByText(/Thanks for your order/i);
    this.invoiceNumberText = this.page.getByText(/INV-\d+/i);

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
   * Match API invoice payload (billing-api.json): TG + 1234AA + A42.
   * UI differences vs API:
   * - Profile getDetails can overwrite address after we fill (race) — fill AFTER wait, house last
   * - Postcode-lookup can fail for TG+1234AA and clear/block — stub lookup like API bypass
   * @param {{ billing_street: string, billing_city: string, billing_state: string, billing_country: string, billing_postal_code: string, billing_house_number?: string }} billing
   */
  async fillBillingAddress(billing) {
    console.log('[CheckoutPage] Filling billing address (API-aligned)');

    const countryCode = String(billing.billing_country || 'TG');
    const countryLabel =
      { TG: 'Togo', NL: 'Netherlands (the)', US: 'United States of America (the)', IN: 'India', AL: 'Albania' }[
        countryCode
      ] || countryCode;
    const houseNo = String(billing.billing_house_number || 'A42');

    // Stub postcode-lookup — UI calls it; API invoice path does not
    await this.page.unroute('**/*postcode*').catch(() => {});
    await this.page.route(/postcode/i, async (route) => {
      const body = {
        street: billing.billing_street,
        house_number: houseNo,
        city: billing.billing_city,
        state: billing.billing_state,
        country: countryCode,
        postcode: billing.billing_postal_code,
      };
      console.log('[CheckoutPage] Stubbing postcode-lookup →', JSON.stringify(body));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });

    await this.billingCountry.first().waitFor({ state: 'visible', timeout: 15000 });

    // Wait for logged-in profile getDetails to finish patching (often Albania from register)
    await this.page.waitForTimeout(1500);

    const fillAndCommit = async (locator, value, label) => {
      const field = locator.first();
      await field.waitFor({ state: 'visible' });
      await field.click();
      await field.fill('');
      await field.fill(String(value));
      await field.dispatchEvent('input');
      await field.dispatchEvent('change');
      await field.blur();
      console.log(`[CheckoutPage] ${label} filled:`, value);
    };

    // Label select is reliable; option values may be name or code depending on Angular binding
    await this.billingCountry.first().selectOption({ label: countryLabel });
    console.log('[CheckoutPage] Country selected:', countryLabel, '(code target', countryCode + ')');

    // Log actual selected option value for debug (must be ISO for invoice API)
    const selectedValue = await this.billingCountry.first().inputValue();
    console.log('[CheckoutPage] Country control value:', selectedValue);

    await fillAndCommit(this.billingPostalCode, billing.billing_postal_code, 'Postal code');
    await fillAndCommit(this.billingHouseNumber, houseNo, 'House number');
    await this.page.waitForTimeout(700);
    await fillAndCommit(this.billingStreet, billing.billing_street, 'Street');
    await fillAndCommit(this.billingCity, billing.billing_city, 'City');
    await fillAndCommit(this.billingState, billing.billing_state, 'State');

    // Re-apply after any late profile/lookup patch — house was empty in failed runs
    await this.billingCountry.first().selectOption({ label: countryLabel });
    await fillAndCommit(this.billingPostalCode, billing.billing_postal_code, 'Postal code (final)');
    await fillAndCommit(this.billingHouseNumber, houseNo, 'House number (final)');
    await fillAndCommit(this.billingStreet, billing.billing_street, 'Street (final)');
    await fillAndCommit(this.billingCity, billing.billing_city, 'City (final)');
    await fillAndCommit(this.billingState, billing.billing_state, 'State (final)');

    await expect(this.billingHouseNumber.first()).toHaveValue(houseNo, { timeout: 5000 });
    await expect(this.billingPostalCode.first()).toHaveValue(String(billing.billing_postal_code));

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
    await expect
      .poll(async () => this.proceedPayment.isEnabled(), {
        timeout: 30000,
        message: 'proceed-3 not enabled before click',
      })
      .toBeTruthy();
    await this.proceedPayment.click({ force: true });
    console.log('[CheckoutPage] proceed-3 clicked');
  }

  /** Hide chat FAB — overlaps Confirm on desktop viewport and steals clicks. */
  async hideChatWidget() {
    await this.page
      .locator('button:has-text("Open chat"), [aria-label*="chat" i], #chat-widget')
      .first()
      .evaluate((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      })
      .catch(() => {});
  }

  /**
   * Hard-click Confirm — Toolshop Confirm #2 often ignores soft Playwright clicks.
   * Hides chat overlay, scrolls into view, force-clicks, then DOM click fallback.
   */
  async hardClickConfirm(label) {
    await this.hideChatWidget();
    const btn = this.page.locator('[data-test="finish"]');
    await btn.waitFor({ state: 'visible', timeout: 15000 });
    await expect(btn).toBeEnabled({ timeout: 15000 });
    await btn.scrollIntoViewIfNeeded();

    await btn.click({ force: true, timeout: 10000 });
    console.log(`[CheckoutPage] ${label} hard-clicked (force)`);
  }

  /**
   * COD: Confirm #1 → payment/check → payment success → Confirm #2 → POST /invoices → INV-.
   * Toolshop Angular: 1st Confirm only validates payment; 2nd Confirm creates invoice.
   * @returns {Promise<string>} invoice number e.g. INV-2026000010
   */
  async completeCashOnDeliveryAndVerifyPaymentSuccess() {
    console.log('[CheckoutPage] Waiting for payment method');
    await this.paymentMethod.waitFor({ state: 'visible' });
    await this.chooseCashOnDelivery();
    console.log('[CheckoutPage] Payment method: cash-on-delivery');

    const paymentCheck = this.page.waitForResponse(
      (res) => /\/payment\/check/i.test(res.url()) && res.request().method() === 'POST',
      { timeout: 30000 },
    );
    await this.hardClickConfirm('Confirm #1');
    const paymentRes = await paymentCheck;
    console.log('[CheckoutPage] Payment check status:', paymentRes.status());

    await expect(this.successMessage).toBeVisible({ timeout: 20000 });
    await expect(this.successMessage).toContainText(/Payment was successful/i);
    console.log('[CheckoutPage] Payment success verified after Confirm #1');

    // Confirm #2 must call finishFunction again while payment state === true
    await expect(this.confirmBtn).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(500);

    let lastInvoiceStatus = 'none';
    let lastInvoiceBody = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`[CheckoutPage] Confirm #2 attempt ${attempt}`);

      const invoiceWait = this.page
        .waitForResponse(
          (res) => /\/invoices\/?$/i.test(res.url()) && res.request().method() === 'POST',
          { timeout: 15000 },
        )
        .catch(() => null);

      if (attempt === 1) {
        await this.hardClickConfirm('Confirm #2 (force)');
      } else if (attempt === 2) {
        await this.hideChatWidget();
        await this.confirmBtn.evaluate((el) => el.click());
        console.log('[CheckoutPage] Confirm #2 native el.click()');
      } else {
        await this.hideChatWidget();
        await this.confirmBtn.focus();
        await this.page.keyboard.press('Enter');
        console.log('[CheckoutPage] Confirm #2 keyboard Enter');
      }

      const invoiceRes = await invoiceWait;
      if (invoiceRes) {
        lastInvoiceStatus = String(invoiceRes.status());
        const reqBody = invoiceRes.request().postData() || '';
        lastInvoiceBody = await invoiceRes.text().catch(() => '');
        console.log('[CheckoutPage] POST /invoices request:', reqBody.slice(0, 400));
        console.log('[CheckoutPage] POST /invoices status:', lastInvoiceStatus);
        console.log('[CheckoutPage] POST /invoices body:', lastInvoiceBody.slice(0, 300));

        if (invoiceRes.ok()) {
          await expect(this.invoiceOrderMessage).toBeVisible({ timeout: 15000 });
          const orderText = await this.invoiceOrderMessage.innerText();
          const match = orderText.match(/INV-\d+/i);
          expect(match).toBeTruthy();
          console.log('[CheckoutPage] Invoice confirmed after Confirm #2:', match[0]);
          return match[0];
        }
      } else {
        console.warn(`[CheckoutPage] Confirm #2 attempt ${attempt} — no POST /invoices observed`);
      }

      if (await this.invoiceOrderMessage.isVisible().catch(() => false)) {
        const orderText = await this.invoiceOrderMessage.innerText();
        const match = orderText.match(/INV-\d+/i);
        if (match) {
          console.log('[CheckoutPage] Invoice visible in UI:', match[0]);
          return match[0];
        }
      }

      await this.page.waitForTimeout(500);
    }

    throw new Error(
      `[CheckoutPage] Confirm #2 failed — no invoice. last POST status=${lastInvoiceStatus} body=${lastInvoiceBody.slice(0, 200)}`,
    );
  }
}

module.exports = { CheckoutPage };
