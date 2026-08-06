const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * ProfilePage — verify registered user details after login
 */
class ProfilePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.firstName = this.locator('[data-test="first-name"]');
    this.lastName = this.locator('[data-test="last-name"]');
    this.email = this.locator('[data-test="email"]');
  }

  async openProfile() {
    const profileLink = this.page.getByRole('link', { name: 'My profile' });

    if (!(await profileLink.isVisible())) {
      await this.page.getByRole('menuitem').last().getByRole('button').click();
    }

    await profileLink.waitFor({ state: 'visible'});
    await profileLink.click();
    await this.firstName.waitFor({ state: 'visible' });
    console.log('[ProfilePage] Profile page loaded:', await this.url());
  }

  /**
   * @param {{ firstName: string, lastName: string, email: string }} user
   */
  async verifyRegisteredUserDetails(user) {
    console.log('[ProfilePage] Verifying profile for:', user.email);
    await expect(this.firstName).toHaveValue(user.firstName);
    await expect(this.lastName).toHaveValue(user.lastName);
    await expect(this.email).toHaveValue(user.email);
    console.log('[ProfilePage] Profile name and email verified');
  }

  async openMyInvoices() {
    const invoicesLink = this.page.getByRole('link', { name: 'My invoices' });
    if (!(await invoicesLink.isVisible())) {
      await this.page.getByRole('menuitem').last().getByRole('button').click();
    }
    await invoicesLink.waitFor({ state: 'visible' });
    await invoicesLink.click();
  }
}

module.exports = { ProfilePage };
