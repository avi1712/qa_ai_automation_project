const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * LoginPage — UI Page Object (POM layer inside Prism)
 */
class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.signinBtn = this.locator("//*[@routerlink='/auth/login']");
    this.signinText = this.page.getByText('Sign in');
    this.email = this.locator('[data-test="email"]');
    this.password = this.locator("//input[@id='password']");
    this.login = this.locator('[data-test="login-submit"]');
   
    this.home = this.locator(':text("Home")');
   
    this.menu = this.locator('[data-test="nav-menu"]');

    
    this.myAccount = this.getByText('My account');

  }

  /** Open base URL, maximize window, wait for page load. */
  async goto() {
    console.log('[LoginPage] Opening home page');
    await this.maximize();
    await super.goto('/');
    console.log('[LoginPage] Home page loaded');
  }

  /**
   * @param {string} email
   * @param {string} password
   */
  async verifyLoginAndNavigateToHomePage(email, password) {
    console.log(`[LoginPage] Starting login for: ${email}`);

    await this.email.waitFor({ state: 'visible' });
    await this.email.fill(email);
    console.log('[LoginPage] Email filled');

    await this.password.waitFor({ state: 'visible' });
    await this.password.fill(password);
    console.log('[LoginPage] Password filled');

    await this.login.waitFor({ state: 'visible' });
    await this.login.click();
    console.log('[LoginPage] Login button clicked');
    // await this.page.waitForTimeout(5000);
    // await this.myAccount.waitFor({ state: 'visible' });
    // await expect(this.myAccount).toBeVisible();
    // console.log('[LoginPage] Assert passed: My Account is visible');
    await this.menu.waitFor({ state: 'visible' });
    await expect(this.menu).toBeVisible();
    console.log('[LoginPage] Assert passed: Menu is visible');

    console.log('[LoginPage] Login successful');
    await this.home.waitFor({ state: 'visible' });
    await this.home.click();
    console.log('[LoginPage] Home page clicked');
  }
}

module.exports = { LoginPage };
