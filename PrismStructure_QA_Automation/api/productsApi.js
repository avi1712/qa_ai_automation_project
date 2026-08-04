/**
 * Products API helper — GET /products
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function getProducts(request, params = {}) {
  console.log('[productsApi] GET /products');
  const response = await request.get('/products', { params });
  console.log('[productsApi] Get products status:', response.status());
  return response;
}

module.exports = { getProducts};