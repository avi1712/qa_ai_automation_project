const billingApi = require('../test-data/billing-api.json');

/**
 * Payload builders for Toolshop API (register user + COD invoice).
 */

/**
 * Unique registration data matching live OpenAPI.
 * address must be an object; password must not be a known leaked password.
 */
function buildUniqueUser(overrides = {}) {
  const stamp = Date.now();
  return {
    first_name: 'Qa',
    last_name: 'Api',
    dob: '1990-01-01',
    address: {
      street: 'Test Street 1',
      city: 'Testville',
      state: 'TS',
      country: 'US',
      postal_code: '1234AA',
    },
    phone: '5551234567',
    email: `qa.api+${stamp}@example.com`,
    password: 'ToolshopQa#2026!',
    ...overrides,
  };
}

/** Flatten for register POST body (API shape). */
function toRegisterPayload(user) {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    dob: user.dob,
    address: user.address,
    phone: user.phone,
    email: user.email,
    password: user.password,
  };
}

/**
 * COD invoice payload — field names verified against live API.
 * @param {string} cartId
 * @param {object} [overrides]
 */
function buildCodInvoicePayload(cartId, overrides = {}) {
  return {
    ...billingApi,
    cart_id: cartId,
    payment_method: 'cash-on-delivery',
    payment_details: {},
    ...overrides,
  };
}

module.exports = {
  buildUniqueUser,
  toRegisterPayload,
  buildCodInvoicePayload,
};
