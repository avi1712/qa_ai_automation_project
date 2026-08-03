/**
 * Auth API helper — register / login → bearer token
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function registerUser(request, user) {
  const response = await request.post('/users/register', { data: user });
  return response;
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {{ email: string, password: string }} credentials
 */
async function loginUser(request, credentials) {
  const response = await request.post('/users/login', { data: credentials });
  const body = await response.json().catch(() => ({}));
  return { response, accessToken: body.access_token, body };
}

module.exports = { registerUser, loginUser };
