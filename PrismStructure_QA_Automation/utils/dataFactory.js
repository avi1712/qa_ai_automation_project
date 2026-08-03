/**
 * Builds unique registration data to avoid email collisions (risk R7).
 */
function buildUniqueUser(overrides = {}) {
  const stamp = Date.now();
  return {
    first_name: 'Qa',
    last_name: 'Cursor',
    firstName: 'Qa',
    lastName: 'Cursor',
    dob: '1990-01-01',
    address: 'Test Street 1',
    city: 'Testville',
    state: 'TS',
    country: 'US',
    postcode: '1234AA',
    phone: '1234567890',
    email: `qa.cursor+${stamp}@example.com`,
    password: 'Welcome01!',
    ...overrides,
  };
}

module.exports = { buildUniqueUser };
