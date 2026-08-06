# AI Prompts – Automation and Debugging

Prompts used for automation structure, assertions, and analyzing failures/logs.

For each entry:

- **Prompt:**
- **AI Response Summary:**
- **Debugging Outcome** (how it helped or misled you)

**Related outputs:** `playwright.config.js`, `pages/`, `api/`, `fixtures/testFixtures.js`, `tests/ui/`, `tests/api/api.spec.js`, `reports/`, `execution-report/`.

---

## Entry 1 — Prism + Playwright structure (planning)

**Prompt:**  
Outline a Prism-style Playwright layout for Toolshop UI + API with Smoke/Regression grep tags and separate UI/API projects. Do not generate full specs yet.

**AI Response Summary:**  
Suggested repo-root tree: `tests/ui`, `tests/api`, `pages/`, `api/` helpers, `fixtures/`, `utils/`, `test-data/`, `playwright.config.js`. npm scripts `test:smoke` / `test:regression`. Shared fixtures for page objects and unique user builder.

**Debugging Outcome:**  
**Helped** — gave a clear scaffold before coding. No runtime failure yet; avoided dumping placeholder specs. Final tree matches this layout at repository root (not a nested `PrismStructure/` folder).

---

## Entry 2 — Double Confirm automation design (R4)

**Prompt:**  
How should UI automation handle “press Confirm twice” for invoice without flake?

**AI Response Summary:**  
Model two explicit user actions on `data-test="finish"`: first Confirm → assert payment success toast; second Confirm → assert invoice/thank-you message. No single click + fixed sleep. Prefer `data-test` / role locators over brittle CSS.

**Debugging Outcome:**  
**Helped** for design — risk R4 documented. Angular Toolshop: Confirm #1 only runs payment check (`state=true` + “Payment was successful”); Confirm #2 calls `finishFunction` again and `POST /invoices`. Implemented in `CheckoutPage.completeCashOnDeliveryAndVerifyPaymentSuccess()`: hard-click Confirm #1 → payment success → hard-click Confirm #2 → assert “Thanks for your order” + `INV-` → return invoice number. Soft Playwright click often no-ops on Confirm #2 — use `click({ force: true })` + hide chat FAB. See Entries 14–15 for billing/postcode fixes that unblocked invoice 201.

---

## Entry 3 — Debug protocol template

**Prompt:**  
Define a reusable debug prompt template for failing Playwright tests.

**AI Response Summary:**  
Paste one failure (message + short stack + HTTP body with token redacted) → ask ranked hypotheses → smallest fix → re-run single spec → log whether AI helped or misled in this file.

**Debugging Outcome:**  
**Helped** — adopted in `project-info.md` Setup Summary §8. Used for Entries 6–9 below. Rejecting “rewrite whole suite” suggestions saved time.

---

## Entry 4 — Consolidate automation at repository root

**Prompt:**  
Align Playwright Prism tree at repo root: UI specs in `tests/ui/homePageTest/`, API in `tests/api/api.spec.js`, pages, api helpers, fixtures, reports folders. Remove duplicate nested framework folder if present.

**AI Response Summary:**  
Single root layout: `homePage.spec.js` (TC-UI-01, 03–06), `addToCartAndPayment.spec.js` (TC-UI-02), `api.spec.js` (TC-API-01…06). `reports/playwright-report/`, `reports/allure-results/`, `execution-report/` for evidence. `ProfilePage.js` retained.

**Debugging Outcome:**  
**Helped** — one `npm test` runs full suite. No path confusion between old nested folder and root. `fixtures/testFixtures.js` wires POMs for specs that adopt extended `test`.

---

## Entry 5 — `playwright.config.js`: projects, reporters, retries

**Prompt:**  
Configure Playwright with separate **UI Tests** (Chromium 1920×1080) and **Api Tests** (`baseURL` API host), Allure reporter, HTML report, trace on retry, `retries: 2` for flaky live API.

**AI Response Summary:**  
Projects: `UI Tests` → `tests/ui`, `Api Tests` → `tests/api`. Reporters: `list`, HTML → `reports/playwright-report`, Allure → `reports/allure-results`. UI: `trace: on-first-retry`, screenshot/video on failure. `outputDir: reports/test-results`. `workers: 1`, `fullyParallel: false` for stable E2E.

**Debugging Outcome:**  
**Helped** — environment info in Allure shows UI/API base URLs. Retries absorbed intermittent API 500/timeouts without masking real bugs. **Note:** package.json uses `--project=api` which matches `Api Tests` by partial name; full name is `--project="UI Tests"` / `--project="Api Tests"`.

---

## Entry 6 — API automation live verification (TC-API-01…05 initial)

**Prompt:**  
Implement API tests for Toolshop AC1/AC2 against **live** API; separate Api Tests project; console log per step; execute and fix until green.

**AI Response Summary:**  
Live checks: `POST /users/register` requires nested `address` object and non-leaked password; cart item add is `POST /carts/{id}` with `product_id` + `quantity`; COD invoice `POST /invoices` returns `201` with Bearer + `invoice_number`. Built `authApi.js`, `cartApi.js`, `productsApi.js`, `invoiceApi.js`, `utils/payloadBuilder.js`. Expanded to 6 cases in `api.spec.js`.

**Debugging Outcome:**  
**Helped strongly** — AI draft endpoints were close but wrong on cart add path and register body. Live OpenAPI + trial requests fixed payloads. `npm run test:api` all green (~10–30s). **Misled** if we had trusted first AI response without live verify.

---

## Entry 7 — UI `TimeoutError` on `page.goto` / `networkidle`

**Prompt:**  
UI failures: `TimeoutError: page.goto: Timeout 60000ms exceeded` waiting for `networkidle` on `https://practicesoftwaretesting.com/`. AI suggested `BASE_URL=localhost:3000`.

**AI Response Summary:**  
Root cause: Toolshop keeps background requests open — `networkidle` rarely settles. Fix: `BasePage.goto` use `waitUntil: 'domcontentloaded'`, default URL `https://practicesoftwaretesting.com` (never localhost fallback). Apply same wait strategy on Register/Home navigations.

**Debugging Outcome:**  
**Misled** on localhost suggestion — no local app in this project. **Helped** on waitUntil fix — UI specs passed after `domcontentloaded`. Logged in `BasePage.js` comments for future debug.

---

## Entry 8 — Checkout billing: `proceed-3` stayed disabled

**Prompt:**  
TC-UI-02 fails at payment step: `proceed-3` button disabled after filling billing fields; timeout on click.

**AI Response Summary:**  
Angular form may not enable Proceed until validation sees field values. Fill country first (label select), then street/city/state/postal/house with `fill` + `dispatchEvent('input')` + `blur`. Use `expect.poll` until `proceed-3` is enabled before click.

**Debugging Outcome:**  
**Helped** — `CheckoutPage.fillBillingAddress()` country label map (e.g. `TG` → `Togo`) and `fillAndCommit` helper fixed enablement. Without poll, test flaked on slow validation. Trace + screenshot in `reports/test-results/` confirmed disabled state.

---

## Entry 9 — Assertions: business outcomes not just navigation

**Prompt:**  
Review automation asserts — are we only checking URLs or also business outcomes (token, invoice, cart items, prices)?

**AI Response Summary:**  
Strengthen asserts: API — status codes + `access_token`, `cart id`, `cart_items`, `invoice_number`; UI — payment success message text, search/filter content, price bounds on visible products. Keep console logs per step for Playwright HTML report readability.

**Debugging Outcome:**  
**Helped** — caught weak “status 200 only” patterns early. API-02 asserts `invoice_number`; UI catalog tests assert product names/prices. Reports easier to read without opening trace for every step.

---

## Entry 10 — Allure + execution report pipeline

**Prompt:**  
Wire Allure for Playwright; generate static `execution-report/` for submission after local runs.

**AI Response Summary:**  
`allure-playwright` reporter → `reports/allure-results/`. npm scripts: `allure:generate` → `reports/allure-report/`, `allure:execution-report` → `execution-report/`, `allure:report` chain. README documents open `execution-report/index.html`.

**Debugging Outcome:**  
**Helped** — CSV Status=Passed aligned with Allure evidence. `allure:clean` script resets folders. Raw `allure-results` gitignored; static `execution-report/` committed for reviewers.

---

## Entry 11 — Page objects and locator strategy

**Prompt:**  
Design page objects with stable locators for Toolshop UI — prefer `data-test` and roles; avoid inventing selectors.

**AI Response Summary:**  
`BasePage`, `RegisterPage`, `LoginPage`, `HomePage`, `ProductPage`, `CartPage`, `CheckoutPage`, `ProfilePage`. Checkout uses `[data-test="proceed-2"]`, `[data-test="proceed-3"]`, `[data-test="finish"]`, `[data-test="payment-success-message"]` with label fallbacks for billing fields.

**Debugging Outcome:**  
**Helped** when locators verified on live UI. **Misled** when AI suggested generic CSS — rejected until `data-test` confirmed in DevTools. Reduced flake vs pure CSS (risk R6).

---

## Entry 12 — Fixtures and unique user per test

**Prompt:**  
Add Playwright fixtures extending `test` with page objects and `uniqueUser` from `buildUniqueUser()` to avoid email collision (R7).

**AI Response Summary:**  
`fixtures/testFixtures.js` extends test with `loginPage`, `registerPage`, `productPage`, `cartPage`, `checkoutPage`, `profilePage`, `uniqueUser`. UI specs can import extended test or instantiate pages directly (current specs use direct `new XPage(page)` + timestamp email).

**Debugging Outcome:**  
**Helped** for API and future UI refactors. Timestamp emails in specs (`qa.test+${Date.now()}@example.com`) prevent R7 collisions. Fixture ready when specs migrate off inline page construction.

---

## Entry 13 — Local-only execution (no CI)

**Prompt:**  
Remove GitHub Actions workflow — tests should run locally only; update docs accordingly.

**AI Response Summary:**  
Delete `.github/workflows/playwright.yml`. README and `project-info.md` state local `npm test` + Allure generation. No `BASE_URL` override needed for CI.

**Debugging Outcome:**  
**Helped** — no failed pushes on CI noise. Entry 7 networkidle issue originally seen in CI; same fix applies locally. `forbidOnly: !!process.env.CI` in config harmless when CI absent.

---

## Summary — automation health (last verified)

| Layer | Spec file | Cases | Command | Outcome |
|-------|-----------|-------|---------|---------|
| API | `tests/api/api.spec.js` | TC-API-01…06 | `npm run test:api` | All passed after live payload fixes |
| UI | `tests/ui/homePageTest/*.spec.js` | TC-UI-01…06 | `npm run test:ui` | Passed after domcontentloaded + billing fill fix |
| Tags | grep `@Smoke` / `@Regression` | — | `npm run test:smoke` / `test:regression` | Tag filter works |
| Reports | Playwright HTML + Allure | — | `npm test` then `npm run allure:execution-report` | `execution-report/index.html` |

**Artifacts on failure:** `reports/test-results/` (trace, screenshot, video), Playwright HTML, Allure attachments in generated report.

---

## Failure entry template (append future runs)

```markdown
### Entry N — [short title]

**Prompt:**  
[paste failure context]

**AI Response Summary:**  
[AI hypotheses and suggested fix]

**Debugging Outcome:**  
[Applied fix / rejected bad advice / re-run result]
```

---

## Entry 14 — TC-UI-02 Confirm #2: click works, invoice POST 422 (billing)

**Prompt:**  
Confirm #2 hard-click runs but “Thanks for your order” never appears. Log network — what fails?

**AI Response Summary:**  
Wait for `POST /invoices` after Confirm #2. Live response was **422**: `billing_country` / postal format mismatch. Soft click was not the root cause once force-click worked.

**Debugging Outcome:**  
**Helped** — network wait showed real failure. API TC-API-02 still passes with same `TG` + `1234AA` in `billing-api.json`. Difference is UI-only: address step runs **postcode-lookup** and profile `getDetails` can overwrite fields. Align UI `billing.json` with API; stub lookup; fix fill race (Entry 15).

---

## Entry 15 — UI billing vs API: postcode-lookup stub + profile race

**Prompt:**  
API invoice with `TG`+`1234AA` returns 201. UI proceed-3 stays disabled or invoice 422. Fix using API payload as reference.

**AI Response Summary:**  
UI `AddressComponent` calls `GET /postcode-lookup` when country+postal+house set; failure blocks happy path. Logged-in `getDetails` can re-patch Albania / clear house number after fill. Select country by label **Togo** (control value `TG`); fill house last (`A42`); stub `/postcode*` to return API-aligned address JSON; wait for profile race then re-assert fields.

**Debugging Outcome:**  
**Helped** after live logs. `billing.json` matched `billing-api.json` (`TG`, `1234AA`, `A42`). Stub logged; country value `TG`; Confirm #2 → `POST /invoices` **201** → `INV-…`; My Invoices lists same number. TC-UI-02 passed (~33s).

---

## Entry 16 — TC-UI-01 profile assert after login

**Prompt:**  
Extend TC-UI-01: after login open My profile and assert first name, last name, email.

**AI Response Summary:**  
Use `ProfilePage`: user menu → link **My profile** (not invented `nav-profile`); assert `[data-test="first-name"|"last-name"|"email"]` values.

**Debugging Outcome:**  
**Helped** after fixing locator — live SUT uses role link “My profile” under last menuitem button. Spec + CSV updated; TC-UI-01 passed.

---

_Last verification: TC-UI-02 Confirm×2 + My Invoices green (2026-08-07). API TC-API-02 green with same TG billing. TC-UI-01 profile assert green._
