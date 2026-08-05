const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * HomePage — landing page navigation, search, and product browse
 */
class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.signInBtn = this.locator("//*[@routerlink='/auth/login']");
    this.menu = this.locator('[data-test="nav-menu"]');
    this.homeLink = this.locator('[data-test="nav-home"]');
    this.cartNav = this.locator('[data-test="nav-cart"]');
    this.searchInput = this.locator('[data-test="search-query"]');
    this.searchBtn = this.locator('[data-test="search-submit"]');
    // All product cards (ULID-keyed containers, excludes inner product-name/product-price elements)
    this.productCardItems = this.locator('[data-test^="product-0"]');

    // New filter / listing elements (additive only)
    this.productPrices = this.locator('[data-test="product-price"]');
    this.productNames = this.locator('[data-test="product-name"]');
    this.priceSliderMinHandle = this.locator('span.ngx-slider-pointer-min');
    this.priceSliderMaxHandle = this.locator('span.ngx-slider-pointer-max');
    this.priceMinLabel = this.locator('.ngx-slider-model-low');
    this.priceMaxLabel = this.locator('.ngx-slider-model-high');
    this.categoryHammerCheckbox = this.page.getByRole('checkbox', { name: 'Hammer', exact: true });
    this.ecoFriendlyCheckbox = this.page.getByRole('checkbox', {
      name: 'Show only eco-friendly products',
    });
    this.ecoBadgeInCard = this.locator(
      '[data-test="eco-friendly"], [data-test="eco-badge"], .eco-friendly, .badge-success',
    );
  }

  /** Open base URL, maximize window, wait for page load. */
  async goto() {
    console.log('[HomePage] Opening home page');
    await this.maximize();
    await super.goto('/');
    console.log('[HomePage] Home page loaded');
  }

  async verifyLoaded() {
    await this.page.waitForLoadState('load');
    await this.searchInput.waitFor({ state: 'visible' });
    await expect(this.searchInput).toBeVisible();
    await expect(this.productCardItems.first()).toBeVisible();
    console.log('[HomePage] Home page verified — search and products visible');
  }

  async openSignIn() {
    console.log('[HomePage] Opening sign in');
    await this.page.goto('/auth/login', { waitUntil: 'networkidle' });
    console.log('[HomePage] Sign in page opened');
  }

  async clickHome() {
    console.log('[HomePage] Navigating to home');
    await this.homeLink.waitFor({ state: 'visible' });
    await this.homeLink.click();
    console.log('[HomePage] Home link clicked');
  }

  async openCart() {
    console.log('[HomePage] Opening cart via nav icon');
    await this.cartNav.waitFor({ state: 'attached', timeout: 10000 });
    await this.cartNav.click({ force: true });
    console.log('[HomePage] Cart nav clicked');
  }

  /** @param {string} query */
  async search(query) {
    console.log(`[HomePage] Searching for: ${query}`);
    await this.searchInput.fill(query);
    await this.searchBtn.click();
    console.log('[HomePage] Search submitted');
  }

  async openFirstProduct() {
    console.log('[HomePage] Clicking first product card');
    await this.productCardItems.first().waitFor({ state: 'visible' });
    await this.productCardItems.first().click();
    console.log('[HomePage] First product card clicked');
  }

  async openSecondProduct() {
    console.log('[HomePage] Clicking second product card');
    await this.productCardItems.nth(2).waitFor({ state: 'visible' });
    await this.productCardItems.nth(2).click();
    console.log('[HomePage] Second product card clicked');
  }

  // ── New methods only (existing methods above unchanged in behavior) ──

  async waitForProductList() {
    await this.productCardItems.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** @returns {Promise<number[]>} */
  async getVisibleProductPrices() {
    await this.waitForProductList();
    const texts = await this.productCardItems.locator('[data-test="product-price"]').allTextContents();
    return texts
      .map((t) => parseFloat(String(t).replace(/[^0-9.]/g, '')))
      .filter((n) => !Number.isNaN(n));
  }

  /** @returns {Promise<string[]>} */
  async getVisibleProductNames() {
    await this.waitForProductList();
    return this.productCardItems.locator('[data-test="product-name"]').allTextContents();
  }

  /**
   * Move ngx-slider handle with keyboard until aria-valuenow meets target.
   * @param {'min'|'max'} which
   * @param {number} target
   */
  async setPriceSliderTo(which, target) {
    const handle = which === 'max' ? this.priceSliderMaxHandle : this.priceSliderMinHandle;
    await handle.waitFor({ state: 'visible', timeout: 15000 });
    await handle.click();

    const key = which === 'max' ? 'ArrowLeft' : 'ArrowRight';
    for (let i = 0; i < 250; i++) {
      const current = parseFloat((await handle.getAttribute('aria-valuenow')) || 'NaN');
      if (Number.isNaN(current)) break;
      if (which === 'max' && current <= target) break;
      if (which === 'min' && current >= target) break;
      await handle.press(key);
    }

    const finalVal = await handle.getAttribute('aria-valuenow');
    console.log(`[HomePage] Price slider ${which} set near ${target}, aria-valuenow=${finalVal}`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async setPriceRangeMaxTo(maxPrice) {
    await this.setPriceSliderTo('max', maxPrice);
  }

  async setPriceRangeMinTo(minPrice) {
    await this.setPriceSliderTo('min', minPrice);
  }

  /**
   * Set both price slider handles to an exact range (e.g. 1–100 or 100–200).
   * Uses mouse drag so Angular ngx-slider fires value change / product reload.
   * @param {number} minPrice
   * @param {number} maxPrice
   */
  async setPriceRangeBetween(minPrice, maxPrice) {
    console.log(`[HomePage] Setting price range ${minPrice} – ${maxPrice}`);
    await this.dragPriceHandleToValue(this.priceSliderMaxHandle, maxPrice);
    await this.page.waitForTimeout(400);
    await this.dragPriceHandleToValue(this.priceSliderMinHandle, minPrice);
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);

    const minNow = await this.priceSliderMinHandle.getAttribute('aria-valuenow');
    const maxNow = await this.priceSliderMaxHandle.getAttribute('aria-valuenow');
    console.log(`[HomePage] Price range now: ${minNow} – ${maxNow}`);

    await expect
      .poll(
        async () => {
          const prices = await this.getVisibleProductPrices();
          if (!prices.length) return false;
          return prices.every((p) => p >= minPrice && p <= maxPrice);
        },
        { timeout: 25000, message: `Products not filtered to ${minPrice}-${maxPrice}` },
      )
      .toBeTruthy();
    console.log(`[HomePage] Product list updated for range ${minPrice} – ${maxPrice}`);
  }

  /**
   * Drag an ngx-slider pointer to the given value on the full bar.
   * @param {import('@playwright/test').Locator} handle
   * @param {number} target
   */
  async dragPriceHandleToValue(handle, target) {
    await handle.waitFor({ state: 'visible', timeout: 15000 });
    const fullBar = this.locator('.ngx-slider-full-bar').first();
    await fullBar.waitFor({ state: 'visible', timeout: 10000 });

    const min = parseFloat((await handle.getAttribute('aria-valuemin')) || '1');
    const max = parseFloat((await handle.getAttribute('aria-valuemax')) || '200');
    const clamped = Math.max(min, Math.min(max, target));
    const ratio = (clamped - min) / (max - min);

    const barBox = await fullBar.boundingBox();
    const handleBox = await handle.boundingBox();
    if (!barBox || !handleBox) {
      throw new Error('Price slider bar/handle not visible for drag');
    }

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;
    const endX = barBox.x + barBox.width * ratio;
    const endY = startY;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 25 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(200);

    // Fine-tune with keyboard if drag landed a few units off
    await handle.click();
    for (let i = 0; i < 30; i++) {
      const current = parseFloat((await handle.getAttribute('aria-valuenow')) || 'NaN');
      if (Number.isNaN(current) || Math.round(current) === Math.round(clamped)) break;
      await handle.press(current > clamped ? 'ArrowLeft' : 'ArrowRight');
    }
  }

  /**
   * @param {import('@playwright/test').Locator} handle
   * @param {number} target
   */
  async movePriceHandleToValue(handle, target) {
    await this.dragPriceHandleToValue(handle, target);
  }

  /** Assert every visible product price is <= maxPrice. */
  async verifyAllVisiblePricesAtMost(maxPrice) {
    const prices = await this.getVisibleProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) {
      expect(price).toBeLessThanOrEqual(maxPrice);
    }
    console.log(`[HomePage] All ${prices.length} products have price <= ${maxPrice}`);
  }

  /** Assert every visible product price is >= minPrice. */
  async verifyAllVisiblePricesAtLeast(minPrice) {
    const prices = await this.getVisibleProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(minPrice);
    }
    console.log(`[HomePage] All ${prices.length} products have price >= ${minPrice}`);
  }

  /** Search then assert every visible product name contains the query. */
  async searchAndVerifyProductNamesContain(query) {
    console.log(`[HomePage] Searching for: ${query}`);
    await this.searchInput.fill(query);
    await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes('/products') && res.ok(),
        { timeout: 15000 },
      ).catch(() => null),
      this.searchBtn.click(),
    ]);
    await this.page.waitForTimeout(1000);
    await this.waitForProductList();

    const names = await this.getVisibleProductNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain(query.toLowerCase());
    }
    console.log(`[HomePage] All ${names.length} search results contain "${query}"`);
  }

  async filterByHammerCategory() {
    console.log('[HomePage] Filtering by Hammer category');
    await this.categoryHammerCheckbox.waitFor({ state: 'visible', timeout: 15000 });
    await this.categoryHammerCheckbox.click({ force: true });
    await expect(this.categoryHammerCheckbox).toBeChecked({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
    // Wait until listing reflects Hammer filter
    await expect
      .poll(
        async () => {
          const names = await this.productCardItems.locator('[data-test="product-name"]').allTextContents();
          return names.length > 0 && names.every((n) => n.toLowerCase().includes('hammer'));
        },
        { timeout: 20000 },
      )
      .toBeTruthy();
    console.log('[HomePage] Hammer category applied');
  }

  async verifyVisibleProductsAreHammers() {
    const names = await this.getVisibleProductNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain('hammer');
    }
    console.log(`[HomePage] All ${names.length} products contain "hammer"`);
  }

  async filterEcoFriendlyOnly() {
    console.log('[HomePage] Enabling eco-friendly filter');
    await this.ecoFriendlyCheckbox.waitFor({ state: 'visible', timeout: 15000 });
    await this.ecoFriendlyCheckbox.check({ force: true });
    await expect(this.ecoFriendlyCheckbox).toBeChecked();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
    console.log('[HomePage] Eco-friendly filter applied');
  }

  async verifyVisibleProductsHaveEcoBadge() {
    await this.waitForProductList();
    const cards = this.productCardItems;
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      // Eco products show an ECO badge / eco-friendly marker on the card
      const ecoMarker = card.getByText(/\bECO\b|eco-friendly|Eco/i).or(
        card.locator('[data-test="eco-friendly"], [data-test="eco-badge"], .eco-friendly'),
      );
      await expect(ecoMarker.first()).toBeVisible({ timeout: 8000 });
    }
    console.log(`[HomePage] All ${count} visible products show eco badge/label`);
  }
}

module.exports = { HomePage };
