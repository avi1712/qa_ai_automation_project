/**
 * Cart API helper — verified against live Toolshop API
 * POST /carts → create
 * GET /carts/{id} → get
 * POST /carts/{id} { product_id, quantity } → add/update item
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function createCart(request, options = {}) {
  console.log('[cartApi] POST /carts');
  console.log('[cartApi] Auth token used:', Boolean(options.token));
  const response = await request.post('/carts', {
    headers: options.token
      ? { Authorization: `Bearer ${options.token}` }
      : undefined,
    data: options.data || {},
  });
  console.log('[cartApi] Create cart status:', response.status());
  return response;
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} cartId
 * @param {object} [options]
 */
async function getCart(request, cartId, options = {}) {
  console.log('[cartApi] GET /carts/' + cartId);
  const response = await request.get(`/carts/${cartId}`, {
    headers: options.token
      ? { Authorization: `Bearer ${options.token}` }
      : undefined,
  });
  console.log('[cartApi] Get cart status:', response.status());
  return response;
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} cartId
 * @param {{ product_id: string, quantity: number }} item
 * @param {object} [options]
 */
async function addProductToCart(request, cartId, item, options = {}) {
  console.log('[cartApi] POST /carts/' + cartId);
  console.log('[cartApi] Product id:', item.product_id);
  console.log('[cartApi] Quantity:', item.quantity);
  const response = await request.post(`/carts/${cartId}`, {
    headers: options.token
      ? { Authorization: `Bearer ${options.token}` }
      : undefined,
    data: item,
  });
  console.log('[cartApi] Add product status:', response.status());
  return response;
}

module.exports = { createCart, getCart, addProductToCart };
