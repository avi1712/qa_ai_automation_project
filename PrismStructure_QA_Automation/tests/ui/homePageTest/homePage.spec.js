const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { RegisterPage } = require('../../../pages/RegisterPage');
const userData = require('../../../test-data/user.json');


test.describe('Register to the application', () => {
  test('TC-UI-01 register to the application @Smoke', async ({ page }) => {
    console.log('[TC-UI-02] Test started: Register then Login');

    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.navigateToRegisterationPage();

    const user = userData;
    const randomEmail = `qa.test+${Date.now()}@example.com`;
    console.log(`[TC-UI-01] Generated email: ${randomEmail}`);

    await registerPage.userRegistration({
      userDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: randomEmail,
        password: user.password,
        dob: user.dob,
        postalCode: user.postalCode,
        houseNumber: user.houseNumber,
        street: user.street,
        city: user.city,
        state: user.state,
        phone: user.phone,
      },
    });

    console.log('[TC-UI-01] Registration done — starting login with same email');
    const loginPage = new LoginPage(page);
    await loginPage.verifyLoginAndNavigateToHomePage(randomEmail, user.password);
    console.log('[TC-UI-01] Test completed successfully');
  });
});
