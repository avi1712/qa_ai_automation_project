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

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} query
 */
async function searchProducts(request, query) {
  console.log('[productsApi] GET /products/search');
  const response = await request.get('/products/search', { params: { q: query } });
  console.log('[productsApi]  get products by search query status:', response.status());
  return response;
}


module.exports = { getProducts, searchProducts};
