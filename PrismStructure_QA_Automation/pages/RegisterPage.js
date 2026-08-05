const { BasePage } = require('./BasePage');

/**
 * RegisterPage — UI Page Object (POM layer inside Prism)
 */
class RegisterPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.signinBtn = this.locator("//*[@routerlink='/auth/login']");
    this.signinText = this.page.getByText('Sign in');
    this.firstName = this.locator('[data-test="first-name"]');
    this.lastName = this.locator('[data-test="last-name"]');

    this.registerYourAccount = this.page.getByLabel('Register your account');

    this.dob = this.locator('[data-test="dob"]');
    this.country = this.locator('[data-test="country"]');
    this.countryList = this.country.locator('option');

    this.postalCode = this.locator('[data-test="postal_code"]');
    this.houseNumber = this.locator('[data-test="house_number"]');
    this.street = this.locator('[data-test="street"]');
    this.city = this.locator('[data-test="city"]');
    this.state = this.locator('[data-test="state"]');

    this.phone = this.locator('[data-test="phone"]');
    this.email = this.locator('[data-test="email"]');
    this.password = this.locator('[data-test="password"]');

    this.registerBtn = this.locator('[data-test="register-submit"]');
  }

  async goto() {
    console.log('[RegisterPage] Opening home page');
    await this.maximize();
    await super.goto('/');
    console.log('[RegisterPage] Home page loaded');
  }

  /**
   * @param {{ userDetails: object }} param0
   */
  async userRegistration({ userDetails }) {
    console.log(`[RegisterPage] Starting registration for: ${userDetails.email}`);

    await this.firstName.waitFor({ state: 'visible' });
    await this.firstName.fill(userDetails.firstName);
    console.log(`[RegisterPage] First name filled: ${userDetails.firstName}`);

    await this.lastName.waitFor({ state: 'visible' });
    await this.lastName.fill(userDetails.lastName);
    console.log(`[RegisterPage] Last name filled: ${userDetails.lastName}`);

    await this.dob.waitFor({ state: 'visible' });
    await this.dob.fill(userDetails.dob);
    console.log(`[RegisterPage] DOB filled: ${userDetails.dob}`);

    await this.country.waitFor({ state: 'visible' });
    await this.country.selectOption({ index: 1 });
    console.log('[RegisterPage] Country selected (index 1)');

    await this.postalCode.waitFor({ state: 'visible' });
    await this.postalCode.fill(userDetails.postalCode);
    console.log(`[RegisterPage] Postal code filled: ${userDetails.postalCode}`);

    await this.houseNumber.waitFor({ state: 'visible' });
    await this.houseNumber.fill(userDetails.houseNumber);
    console.log(`[RegisterPage] House number filled: ${userDetails.houseNumber}`);

    await this.street.waitFor({ state: 'visible' });
    await this.street.fill(userDetails.street);
    console.log(`[RegisterPage] Street filled: ${userDetails.street}`);

    await this.city.waitFor({ state: 'visible' });
    await this.city.fill(userDetails.city);
    console.log(`[RegisterPage] City filled: ${userDetails.city}`);

    await this.state.waitFor({ state: 'visible' });
    await this.state.fill(userDetails.state);
    console.log(`[RegisterPage] State filled: ${userDetails.state}`);

    await this.phone.waitFor({ state: 'visible' });
    await this.phone.fill(userDetails.phone);
    console.log(`[RegisterPage] Phone filled: ${userDetails.phone}`);

    await this.email.waitFor({ state: 'visible' });
    await this.email.fill(userDetails.email);
    console.log(`[RegisterPage] Email filled: ${userDetails.email}`);

    await this.password.waitFor({ state: 'visible' });
    await this.password.fill(userDetails.password);
    console.log('[RegisterPage] Password filled');

    await this.registerBtn.waitFor({ state: 'visible' });
    await this.registerBtn.click();
    console.log('[RegisterPage] Register button clicked');

    await this.page.waitForTimeout(5000);
    console.log('[RegisterPage] Registration completed');
  }

  async navigateToRegisterationPage() {
    console.log('[RegisterPage] Navigating to registration page');
    // Direct URL — Sign in is hidden in collapsed nav on headless/small viewports
    await this.page.goto('/auth/login', { waitUntil: 'networkidle' });

    await this.registerYourAccount.waitFor({ state: 'visible' });
    await this.registerYourAccount.click();
    console.log('[RegisterPage] Register your account clicked');
  }
}

module.exports = { RegisterPage };
