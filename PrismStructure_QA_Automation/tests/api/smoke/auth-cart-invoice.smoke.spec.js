// const { test, expect } = require('@playwright/test');
// const { registerUser, loginUser } = require('../../../api/authApi');
// const { getProducts } = require('../../../api/productsApi');
// const { createCart, addProductToCart } = require('../../../api/cartApi');
// const { createInvoice } = require('../../../api/invoiceApi');
// const { buildUniqueUser } = require('../../../utils/dataFactory');
// const { buildCodInvoicePayload } = require('../../../utils/payloadBuilder');

// /**
//  * API Smoke — Auth + Cart + Invoice
//  * TC-API-01 @Smoke — Register + Login → access_token
//  * TC-API-02 @Smoke — products → cart → COD invoice
//  */
// test.describe('API Smoke — Auth, Cart & Invoice @Smoke', () => {
//   test.skip(true, 'Skeleton — confirm payloads vs OpenAPI then remove skip');

//   test('TC-API-01 register and login returns bearer token @Smoke', async ({
//     request,
//   }) => {
//     const user = buildUniqueUser();
//     const registerRes = await registerUser(request, {
//       first_name: user.first_name,
//       last_name: user.last_name,
//       dob: user.dob,
//       address: user.address,
//       city: user.city,
//       state: user.state,
//       country: user.country,
//       postcode: user.postcode,
//       phone: user.phone,
//       email: user.email,
//       password: user.password,
//     });
//     expect(registerRes.ok()).toBeTruthy();

//     const { response, accessToken } = await loginUser(request, {
//       email: user.email,
//       password: user.password,
//     });
//     expect(response.ok()).toBeTruthy();
//     expect(accessToken).toBeTruthy();
//   });

//   test('TC-API-02 create cart, add product, create COD invoice @Smoke', async ({
//     request,
//   }) => {
//     const user = buildUniqueUser();
//     await registerUser(request, {
//       first_name: user.first_name,
//       last_name: user.last_name,
//       dob: user.dob,
//       address: user.address,
//       city: user.city,
//       state: user.state,
//       country: user.country,
//       postcode: user.postcode,
//       phone: user.phone,
//       email: user.email,
//       password: user.password,
//     });
//     const { accessToken } = await loginUser(request, {
//       email: user.email,
//       password: user.password,
//     });

//     const productsRes = await getProducts(request);
//     expect(productsRes.ok()).toBeTruthy();
//     const productsBody = await productsRes.json();
//     const productId =
//       productsBody.data?.[0]?.id || productsBody[0]?.id;
//     expect(productId).toBeTruthy();

//     const cartRes = await createCart(request, { token: accessToken });
//     expect(cartRes.ok()).toBeTruthy();
//     const cartBody = await cartRes.json();
//     const cartId = cartBody.id;
//     expect(cartId).toBeTruthy();

//     await addProductToCart(
//       request,
//       cartId,
//       { product_id: productId, quantity: 1 },
//       { token: accessToken },
//     );

//     const invoiceRes = await createInvoice(
//       request,
//       buildCodInvoicePayload(cartId),
//       accessToken,
//     );
//     expect(invoiceRes.ok()).toBeTruthy();
//   });
// });
