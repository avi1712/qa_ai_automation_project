/**
 * Invoice API helper — POST /invoices (Bearer required)
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {object} payload
 * @param {string} [token]
 */
async function createInvoice(request, payload, token) {
  console.log('[invoiceApi] POST /invoices');
  console.log('[invoiceApi] Cart id:', payload.cart_id);
  console.log('[invoiceApi] Payment method:', payload.payment_method);
  console.log('[invoiceApi] Auth token used:', Boolean(token));
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await request.post('/invoices', {
    headers,
    data: payload,
  });
  console.log('[invoiceApi] Create invoice status:', response.status());
  return response;
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token
 */
async function listInvoices(request, token) {
  console.log('[invoiceApi] GET /invoices');
  console.log('[invoiceApi] Auth token used:', Boolean(token));
  const response = await request.get('/invoices', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[invoiceApi] List invoices status:', response.status());
  return response;
}

module.exports = { createInvoice, listInvoices };
