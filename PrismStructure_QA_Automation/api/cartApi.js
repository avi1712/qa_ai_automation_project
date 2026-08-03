/**
 * Cart API helper
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function createCart(request, options = {}) {
  return request.post('/carts', {
    headers: options.token
      ? { Authorization: `Bearer ${options.token}` }
      : undefined,
    data: options.data || {},
  });
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} cartId
 * @param {object} [options]
 */
async function getCart(request, cartId, options = {}) {
  return request.get(`/carts/${cartId}`, {
    headers: options.token
      ? { Authorization: `Bearer ${options.token}` }
      : undefined,
  });
}

/**
 * Add product to cart — verify path/body against live OpenAPI before enabling.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} cartId
 * @param {{ product_id: string, quantity: number }} item
 * @param {object} [options]
 */
async function addProductToCart(request, cartId, item, options = {}) {
  return request.post(`/carts/${cartId}`, {
    headers: options.token
      ? { Authorization: `Bearer ${options.token}` }
      : undefined,
    data: item,
  });
}

module.exports = { createCart, getCart, addProductToCart };
