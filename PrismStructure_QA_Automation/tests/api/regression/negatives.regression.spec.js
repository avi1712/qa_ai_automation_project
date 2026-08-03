// const { test, expect } = require('@playwright/test');
// const { loginUser } = require('../../../api/authApi');
// const { createInvoice } = require('../../../api/invoiceApi');
// const { buildCodInvoicePayload } = require('../../../utils/payloadBuilder');

/**
 * TC-API-03 / TC-API-05 @Regression — negatives
 */
// test.describe('API Regression — Negatives @Regression', () => {
//   test.skip(true, 'Skeleton — enable after confirming expected status codes');

//   test('TC-API-03 login with wrong password fails @Regression', async ({
//     request,
//   }) => {
//     const { response } = await loginUser(request, {
//       email: 'customer@practicesoftwaretesting.com',
//       password: 'DefinitelyWrong!',
//     });
//     expect(response.ok()).toBeFalsy();
//   });

//   test('TC-API-05 invoice without token returns 401 @Regression', async ({
//     request,
//   }) => {
//     const response = await createInvoice(
//       request,
//       buildCodInvoicePayload('invalid-cart-id'),
//       '',
//     );
//     expect(response.status()).toBe(401);
//   });
// });
