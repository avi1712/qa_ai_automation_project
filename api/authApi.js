/**
 * Auth API helper — register / login → bearer token
 * Verified: POST /users/register, POST /users/login
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function registerUser(request, user) {
  console.log('[authApi] POST /users/register');
  console.log('[authApi] Register email:', user.email);
  const response = await request.post('/users/register', {
    data: user,
    timeout: 60000,
  });
  console.log('[authApi] Register status:', response.status());
  return response;
}

/**
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {{ email: string, password: string }} credentials
 */
async function loginUser(request, credentials) {
  console.log('[authApi] POST /users/login');
  console.log('[authApi] Login email:', credentials.email);
  const response = await request.post('/users/login', {
    data: credentials,
    timeout: 60000,
  });
  const body = await response.json().catch(() => ({}));
  console.log('[authApi] Login status:', response.status());
  console.log('[authApi] Bearer token received:', Boolean(body.access_token));
  return { response, accessToken: body.access_token, body };
}

module.exports = { registerUser, loginUser };
