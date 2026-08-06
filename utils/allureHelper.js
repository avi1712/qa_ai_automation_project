const { allure } = require('allure-playwright');

/**
 * Wrap a test action in an Allure step for clearer report hierarchy.
 * @param {string} name
 * @param {() => Promise<void>} fn
 */
async function allureStep(name, fn) {
  return allure.step(name, fn);
}

/**
 * Attach plain text to the current test (e.g. API response summary).
 * @param {string} name
 * @param {string} content
 */
async function attachText(name, content) {
  await allure.attachment(name, content, 'text/plain');
}

/**
 * Attach JSON payload/response to the current test.
 * @param {string} name
 * @param {unknown} data
 */
async function attachJson(name, data) {
  await allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
}

module.exports = { allureStep, attachText, attachJson, allure };
