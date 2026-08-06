const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../../pages/HomePage');
const { ProductPage } = require('../../../pages/ProductPage');
const { CartPage } = require('../../../pages/CartPage');
const { RegisterPage } = require('../../../pages/RegisterPage');
const { LoginPage } = require('../../../pages/LoginPage');
const { CheckoutPage } = require('../../../pages/CheckoutPage');
const userData = require('../../../test-data/user.json');
const billingData = require('../../../test-data/billing.json');


test.describe('Add to cart and proceed to checkout', () => {

  test('TC-UI-02 browse second product, add to cart and proceed to checkout and pay with COD', { tag: '@Regression' }, async ({ page }) => {
    console.log(' Test started: Register then Login');

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

    console.log('[TC-UI-02] Step 1Registration done — starting login with same email');
    const loginPage = new LoginPage(page);
    await loginPage.verifyLoginAndNavigateToHomePage(randomEmail, user.password);
    
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
   
    await homePage.verifyLoaded();

    // Step 2: Click the second product card
    console.log('[TC-UI-02] Step 2: Click second product');
    await homePage.openTheProduct();

    // Step 3: Add to cart and verify toast message
    console.log('[TC-UI-02] Step 5: Verify toast message');
    await productPage.addToCartAndVerifyToastMessage();

    //Step 4: Open cart and proceed to checkout
    console.log('[TC-UI-02] Cart page URL:', page.url());
    await cartPage.OpenCartAndProceedToCheckout();

    // Step 5: Proceed to address step (proceed-2)
    const checkoutPage = new CheckoutPage(page);
    console.log('[TC-UI-02] Step 5: Click proceed-2');
    await checkoutPage.clickProceedToAddress();

    // Step 6: Choose country and fill billing address
    console.log('[TC-UI-02] Step 6: Fill billing address');
    await checkoutPage.fillBillingAddress(billingData);

    // Step 7: Proceed to payment (proceed-3)
    console.log('[TC-UI-02] Step 7: Click proceed-3');
    await checkoutPage.clickProceedToPayment();

    // Step 8: COD → Confirm → toast → Confirm again → invoice message
    console.log('[TC-UI-02] Step 8: COD payment, confirm, toast, confirm again, invoice');
    await checkoutPage.completeCashOnDeliveryAndVerifyToast();
    console.log('[TC-UI-02] Test completed successfully');
  });

});
