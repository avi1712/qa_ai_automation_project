const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { RegisterPage } = require('../../../pages/RegisterPage');
const { ProfilePage } = require('../../../pages/ProfilePage');
const { HomePage } = require('../../../pages/HomePage');
const userData = require('../../../test-data/user.json');


test.describe('Register to the application', () => {
  test('TC-UI-01 register login and verify profile @Smoke', { tag: '@Smoke' }, async ({ page }) => {
    console.log('[TC-UI-01] Test started: Register, login, verify profile');

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

    console.log('[TC-UI-01] Opening profile and verifying registered details');
    const profilePage = new ProfilePage(page);
    await profilePage.openProfile();
    await profilePage.verifyRegisteredUserDetails({
      firstName: user.firstName,
      lastName: user.lastName,
      email: randomEmail,
    });
    console.log('[TC-UI-01] Test completed successfully');
  });

  
});

test.describe('Home page filters and search', () => {
  test('TC-UI-03 price range 1-100 and 100-200 validates product prices', { tag: '@Regression' }, async ({ page }) => {
    const homePage = new HomePage(page);

    console.log('[TC-UI-03] Open home page');
    await homePage.goto();
    await homePage.verifyLoaded();

    // Range 1 – 100 → no product price more than 100
    console.log('[TC-UI-03] Set price slider 1 to 100 — expect prices <= 100');
    await homePage.setPriceRangeBetween(1, 100);
    await homePage.verifyAllVisiblePricesAtMost(100);

    // Range 100 – 200 → no product price less than 100
    console.log('[TC-UI-03] Set price slider 100 to 200 — expect prices >= 100');
    await homePage.goto();
    await homePage.verifyLoaded();
    await homePage.setPriceRangeBetween(100, 200);
    await homePage.verifyAllVisiblePricesAtLeast(100);

    console.log('[TC-UI-03] Passed');
  });

  test('TC-UI-04 search hammer shows hammer products', { tag: '@Smoke' }, async ({ page }) => {
    const homePage = new HomePage(page);

    console.log('[TC-UI-04] Open home and search hammer');
    await homePage.goto();
    await homePage.verifyLoaded();
    await homePage.searchAndVerifyProductNamesContain('hammer');

    console.log('[TC-UI-04] Passed');
  });

  test('TC-UI-05 filter by Hammer category shows hammers', { tag: '@Smoke' }, async ({ page }) => {
    const homePage = new HomePage(page);

    console.log('[TC-UI-05] Open home and filter Hammer category');
    await homePage.goto();
    await homePage.verifyLoaded();
    await homePage.filterByHammerCategory();
    await homePage.verifyVisibleProductsAreHammers();

    console.log('[TC-UI-05] Passed');
  });

  test('TC-UI-06 eco-friendly filter shows products with eco badge', { tag: '@Regression' }, async ({ page }) => {
    const homePage = new HomePage(page);

    console.log('[TC-UI-06] Open home and enable eco-friendly filter');
    await homePage.goto();
    await homePage.verifyLoaded();
    await homePage.filterEcoFriendlyOnly();
    await homePage.verifyVisibleProductsHaveEcoBadge();

    console.log('[TC-UI-06] Passed');
  });
});
