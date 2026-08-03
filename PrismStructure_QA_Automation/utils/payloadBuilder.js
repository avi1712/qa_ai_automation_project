/**
 * COD invoice payload builder — field names must match live OpenAPI.
 * @param {string} cartId
 * @param {object} [overrides]
 */
function buildCodInvoicePayload(cartId, overrides = {}) {
  return {
    billing_street: 'Zoey Shore',
    billing_city: 'Hesselbury',
    billing_state: 'Florida',
    billing_country: 'TG',
    billing_postal_code: '1234AA',
    payment_method: 'cash-on-delivery',
    cart_id: cartId,
    payment_details: {},
    ...overrides,
  };
}

module.exports = { buildCodInvoicePayload };
