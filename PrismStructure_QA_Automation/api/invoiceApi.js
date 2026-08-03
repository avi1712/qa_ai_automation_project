/**
 * Invoice API helper — COD payload from assessment sample
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {object} payload
 * @param {string} token
 */
async function createInvoice(request, payload, token) {
  return request.post('/invoices', {
    headers: { Authorization: `Bearer ${token}` },
    data: payload,
  });
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token
 */
async function listInvoices(request, token) {
  return request.get('/invoices', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

module.exports = { createInvoice, listInvoices };
