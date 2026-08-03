const { BasePage } = require('./BasePage');

/**
 * ProfilePage — verify registered user details after login
 */
class ProfilePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.menu = this.locator('[data-test="nav-menu"]');
    this.profileLink = this.locator('[data-test="nav-profile"]');
    this.myInvoices = this.locator('[data-test="nav-my-invoices"]');
  }

  async openProfile() {
    await this.menu.click();
    await this.profileLink.click();
  }

  async openMyInvoices() {
    await this.menu.click();
    await this.myInvoices.click();
  }
}

module.exports = { ProfilePage };
