const { test, expect } = require('@playwright/test');
const { registerUser, loginUser } = require('../../api/authApi');
const { getProducts, searchProducts } = require('../../api/productsApi');
const { createCart, getCart, addProductToCart } = require('../../api/cartApi');
const { createInvoice } = require('../../api/invoiceApi');
const { buildUniqueUser, toRegisterPayload, buildCodInvoicePayload } = require('../../utils/payloadBuilder');

/**
 * API suite — 6 cases tagged @Smoke / @Regression
 * Reporting via console.log only (shows in Playwright report).
 */
test.describe('API — Toolshop Auth, Cart & Invoice', () => {
  test('TC-API-01 register, login, create cart', { tag: '@Smoke' }, async ({ request }) => {
    
    const user = buildUniqueUser();
    console.log('Step 1: Register user — POST /users/register');
    const registerRes = await registerUser(request, toRegisterPayload(user));
    const registerBody = await registerRes.json();
    console.log('Register status:', registerRes.status());
    console.log('Register response:', registerBody);
    expect(registerRes.status()).toBe(201);
    expect(registerBody.email).toBe(user.email);
    console.log('Register passed. User id:', registerBody.id);

    console.log('Step 2: Login — POST /users/login');
    const { response: loginRes, accessToken, body: loginBody } = await loginUser(
      request,
      { email: user.email, password: user.password },
    );
    console.log('Login status:', loginRes.status());
    console.log('Token type:', loginBody.token_type);
    console.log('Bearer token received:', Boolean(accessToken));
    expect(loginRes.status()).toBe(200);
    expect(accessToken).toBeTruthy();
    console.log('Login passed and Bearer token received');

    console.log('Step 3: Create cart — POST /carts');
    const cartRes = await createCart(request, { token: accessToken });
    const cartBody = await cartRes.json();
    console.log('Create cart status:', cartRes.status());
    console.log('Create cart response:', cartBody);
    expect(cartRes.status()).toBe(201);
    expect(cartBody.id).toBeTruthy();
    console.log('Cart created successfully. Cart id:', cartBody.id);

  });

  test('TC-API-02 products, add to cart, verify cart, COD verify invoice created successfully', {
    tag: '@Smoke',
  }, async ({ request }) => {
 
    const user = buildUniqueUser();
    console.log('Step 1: Register — POST /users/register');
    const registerRes = await registerUser(request, toRegisterPayload(user));
    const registerBody = await registerRes.json();
    console.log('Register status:', registerRes.status());
    expect(registerRes.status()).toBe(201);
    console.log('Registered user successfully. User id:', registerBody.id);

    console.log('Step 2: Login — POST /users/login');
    const { response: loginRes, accessToken } = await loginUser(request, {
      email: user.email,
      password: user.password,
    });
    console.log('Login status:', loginRes.status());
    expect(loginRes.status()).toBe(200);
    expect(accessToken).toBeTruthy();
    console.log('Login passed and Bearer token received');

    console.log('Step 3: Get products — GET /products');
    const productsRes = await getProducts(request);
    const productsBody = await productsRes.json();
    console.log('Products status:', productsRes.status());
    expect(productsRes.status()).toBe(200);
    const productId = productsBody.data?.[0]?.id;
    expect(productId).toBeTruthy();
    console.log('Selected product id:', productId);
    console.log('Selected product name:', productsBody.data[0].name);

    console.log('Step 4: Create cart — POST /carts');
    const cartRes = await createCart(request, { token: accessToken });
    const cartBody = await cartRes.json();
    console.log('Create cart status:', cartRes.status());
    expect(cartRes.status()).toBe(201);
    const cartId = cartBody.id;
    expect(cartId).toBeTruthy();
    console.log('Cart created successfully. Cart id:', cartId);

    console.log('Step 5: Add product to cart — POST /carts/' + cartId);
    const addRes = await addProductToCart(
      request,
      cartId,
      { product_id: productId, quantity: 1 },
      { token: accessToken },
    );
    const addBody = await addRes.json();
    console.log('Add to cart status:', addRes.status());
    console.log('Add to cart response:', addBody);
    expect(addRes.status()).toBe(200);
    expect(addBody.result).toMatch(/added|updated/i);
    console.log('Product added successfully to cart');

    console.log('Step 6: Verify cart — GET /carts/' + cartId);
    const getCartRes = await getCart(request, cartId, { token: accessToken });
    const getCartBody = await getCartRes.json();
    console.log('Get cart status:', getCartRes.status());
    console.log('Cart items count:', getCartBody.cart_items?.length);
    expect(getCartRes.status()).toBe(200);
    expect(getCartBody.cart_items?.length).toBeGreaterThan(0);
    expect(getCartBody.cart_items[0].product_id).toBe(productId);
    console.log('Cart verified successfully. First product id:', getCartBody.cart_items[0].product_id);

    console.log('Step 7: Create invoice — POST /invoices (cash-on-delivery)');
    const invoicePayload = buildCodInvoicePayload(cartId);
    console.log('Invoice payment method:', invoicePayload.payment_method);
    console.log('Invoice cart id:', invoicePayload.cart_id);
    const invoiceRes = await createInvoice(request, invoicePayload, accessToken);
    const invoiceBody = await invoiceRes.json();
    console.log('Invoice status:', invoiceRes.status());
    console.log('Invoice response:', invoiceBody);
    expect(invoiceRes.status()).toBe(201);
    expect(invoiceBody.invoice_number).toBeTruthy();
    console.log('Invoice created successfully. Invoice number:', invoiceBody.invoice_number);
    console.log('Invoice total:', invoiceBody.total);

  });

  test('TC-API-03 get products list is available', { tag: '@Smoke' }, async ({ request }) => {
   
    console.log('Step 1: Get products — GET /products');
    const productsRes = await getProducts(request);
    const productsBody = await productsRes.json();
    console.log('Products status:', productsRes.status());
    console.log('Product count:', productsBody.data?.length);
    expect(productsRes.status()).toBe(200);
    expect(Array.isArray(productsBody.data)).toBeTruthy();
    expect(productsBody.data.length).toBeGreaterThan(0);
    console.log('First product successfully retrieved:', productsBody.data[0].name);

  });

  test('TC-API-04 login with wrong password fails', { tag: '@Regression' }, async ({
    request,
  }) => {
    

    console.log('Step 1: Login with wrong password — POST /users/login');
    const { response, accessToken, body } = await loginUser(request, {
      email: 'customer@practicesoftwaretesting.com',
      password: 'DefinitelyWrong!NotValid99',
    });
    console.log('Login status:', response.status());
    console.log('Error:', body.error || body.message);
    console.log('Bearer token received:', Boolean(accessToken));
    // Toolshop sometimes returns 500 instead of 401/422 for bad credentials
    expect(response.ok()).toBeFalsy();
    expect([401, 422, 423, 500]).toContain(response.status());
    expect(accessToken).toBeFalsy();
    console.log('Login with wrong password failed correctly');
  });

  test('TC-API-05 invoice without bearer token returns 401 or failed', { tag: '@Regression' }, async ({
    request,
  }) => {

    const payload = buildCodInvoicePayload('invalid-cart-id-for-negative');
    console.log('Step 1: Create invoice without token — POST /invoices');
    const response = await createInvoice(request, payload, '');
    const body = await response.json().catch(() => ({}));
    console.log('Invoice status:', response.status());
    console.log('Invoice response:', body);
    expect(response.status()).toBe(401);

    console.log('Invoice created without token failed correctly');
  });

  test('TC-API-06 get products by search query', { tag: '@Smoke' }, async ({ request }) => {
    const searchQuery = 'hammer';

    console.log('Step 1: Search products — GET /products/search?q=' + searchQuery);
    const searchRes = await searchProducts(request, searchQuery);
    const searchBody = await searchRes.json();
    console.log('Search status:', searchRes.status());
    console.log('Search result count:', searchBody.data?.length);
    expect(searchRes.status()).toBe(200);
    expect(Array.isArray(searchBody.data)).toBeTruthy();
    expect(searchBody.data.length).toBeGreaterThan(0);
    expect(searchBody.data[0].name.toLowerCase()).toContain(searchQuery);
    console.log('First matching product:', searchBody.data[0].name);
  });
});
