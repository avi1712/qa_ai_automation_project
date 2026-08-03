/**
 * Products API helper
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function getProducts(request, params = {}) {
  return request.get('/products', { params });
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} query
 */
async function searchProducts(request, query) {
  return request.get('/products/search', { params: { q: query } });
}

module.exports = { getProducts, searchProducts };
