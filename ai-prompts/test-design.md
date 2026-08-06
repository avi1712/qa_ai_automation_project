# AI Prompts – Test Design

Prompts used to generate or refine test scenarios and test cases for UI + API.

For each entry:

- **Prompt:**
- **AI Response Summary:**
- **Validation Notes** (how you checked coverage and correctness)

**Prerequisite:** Test plan and risk cut from `ai-prompts/requirements-and-planning.md` and `requirements-risk-analysis.md` were completed before these design prompts.

**Related outputs:** `FunctionalTestCase.csv`, `tests/ui/`, `tests/api/api.spec.js`, `pages/`, `test-data/`, `utils/payloadBuilder.js`.

---

## Entry 1 — Coverage matrix by type (functional, negative, edge, non-functional)

**Prompt:**  
For Toolshop Core AC1 and AC2, design a **coverage matrix**: which functional, negative, edge, and light non-functional cases are needed across **Manual**, **UI**, and **API** tiers? Cap 5–8 per tier. Map each idea to AC and risk ID. No full steps yet.

**AI Response Summary:**  
Functional: register/login/profile (AC1); COD checkout + invoice (AC2); product browse/search/filter (AC2 breadth). Negative: wrong password, invalid email, empty billing, login/API 401 without token. Edge: multi-item cart + qty update; product search/filter boundaries. Light NFR: clear login error message; meaningful HTTP status codes (201/200 vs 401/422). Spread across manual (exploratory steps), UI (E2E + catalog UX), API (contract speed).

**Validation Notes:**  
Checked matrix against `requirements-risk-analysis.md` R1–R5. Confirmed each P0 risk has at least one designed case. Dropped Stretch (admin APIs, PDF download matrix). Final count: 6 manual + 6 UI + 6 API in CSV.

---

## Entry 2 — Smoke vs regression scenario list (UI + API)

**Prompt:**  
Propose **smoke vs regression** scenarios for Toolshop AC1/AC2 on UI and API separately. Max 8 per tag per layer. Include `@Smoke` / `@Regression` and risk link. Do not write full step tables.

**AI Response Summary:**  
Smoke UI: TC-UI-01 register/login; TC-UI-04 search; TC-UI-05 Hammer category; TC-UI-06 eco filter. Regression UI: TC-UI-02 full COD checkout Confirm×2; TC-UI-03 price slider bounds. Smoke API: TC-API-01 auth+cart; TC-API-03 product list; TC-API-06 search. Regression API: TC-API-02 full cart→COD invoice; TC-API-04 bad login; TC-API-05 invoice without Bearer.

**Validation Notes:**  
Verified tag assignment with `npx playwright test --list` and grep on `tag: '@Smoke'|'@Regression'`. TC-UI-02 tagged `@Regression` because full checkout is longer than auth-only smoke. Planning duplicate logged in `requirements-and-planning.md` Entry 5 — this entry is the **design** artifact.

---

## Entry 3 — Manual test cases (step-level design)

**Prompt:**  
For AC1 login and AC2 checkout only, write **manual test case** titles and step outlines: functional, negative, edge, and light non-functional. Cap at 8. Include Confirm×2 and COD. Steps must be executable by a human in a browser without automation.

**AI Response Summary:**  
TC-M-01 smoke: register, login, profile verify. TC-M-02 regression negative: wrong password. TC-M-03 smoke: COD checkout, Confirm×2, My Invoices. TC-M-04 regression edge: multi-item + qty. TC-M-05 regression negative: invalid email on register. TC-M-06 regression negative: empty required billing fields. Optional NFR: error message clarity on TC-M-02.

**Validation Notes:**  
Walked live UI to align step labels (Sign in, Register, My Invoices, Confirm). Written to `FunctionalTestCase.csv` with Preconditions, TestData, Expected/Actual, Status=Passed after manual execution. TC-M-01…06 all Type=Manual, AutomationRef=Manual only.

---

## Entry 4 — UI automation: AC1 register and login (TC-UI-01)

**Prompt:**  
Design a **UI automation** scenario for AC1: register with unique email, login with same credentials, assert authenticated state. Use `test-data/user.json` for static fields. Tag `@Smoke`. One spec file pattern for home/catalog tests.

**AI Response Summary:**  
TC-UI-01 in `tests/ui/homePageTest/homePage.spec.js`: open home → register via RegisterPage → login via LoginPage → assert home/account state. Email `qa.test+{timestamp}@example.com`. Uses Playwright UI Tests project, Chromium 1920×1080 viewport.

**Validation Notes:**  
Ran `npx playwright test tests/ui/homePageTest/homePage.spec.js --grep "TC-UI-01" --project="UI Tests"`. CSV row TC-UI-01 AutomationRef points to same spec. Register/login locators verified on live SUT, not invented.

---

## Entry 5 — UI automation: AC2 COD checkout with Confirm×2 (TC-UI-02)

**Prompt:**  
Design UI E2E for AC2: logged-in user, add product to cart, checkout with **Cash on Delivery**, press **Confirm twice**, assert invoice/payment success. Avoid flake — model two explicit Confirm actions. Use `billing.json`.

**AI Response Summary:**  
TC-UI-02 in `addToCartAndPayment.spec.js`: register+login → second product → add to cart (toast) → cart → checkout → fill billing from `billing.json` → COD → `CheckoutPage.confirmPaymentTwice()` with separate expects after each Confirm. Tag `@Regression` (long flow).

**Validation Notes:**  
Checked `CheckoutPage.js`: `data-test="finish"` clicked twice; success message locator `payment-success-message`. Manual quirk R4 mitigated. CSV TC-UI-02 Steps include “Confirm x2”. Local run passed; Status=Passed in CSV.

---

## Entry 6 — UI automation: catalog search, filter, price (TC-UI-03…06)

**Prompt:**  
Design **UI regression/smoke** scenarios for product catalog: price range slider 1–100 and 100–200, search “hammer”, Hammer category filter, eco-friendly filter with badge assert. Keep each test independent. Tag mix smoke/regression.

**AI Response Summary:**  
TC-UI-03 `@Regression`: price slider min/max asserts on visible prices. TC-UI-04 `@Smoke`: search hammer, names contain hammer. TC-UI-05 `@Smoke`: Hammer category filter. TC-UI-06 `@Smoke`: eco-friendly filter, badge visible. All in `homePage.spec.js` using HomePage helpers.

**Validation Notes:**  
Coverage: AC2 browse/discover path beyond checkout. Each test opens home with `domcontentloaded` (not `networkidle`). Grep confirmed four tests in spec match CSV IDs and tags. Passed locally.

---

## Entry 7 — API automation: six scenarios (TC-API-01…06)

**Prompt:**  
Design **6 API test cases** for Toolshop AC1/AC2: register, login, cart, products, COD invoice, negatives (bad login, no Bearer). Use Playwright `request` fixture. Tags `@Smoke`/`@Regression`. Log each step to console for report readability.

**AI Response Summary:**  
TC-API-01 `@Smoke`: register 201 → login 200 + token → create cart 201. TC-API-02 `@Regression`: full flow products → add to cart → verify cart → COD invoice 201 + `invoice_number`. TC-API-03 `@Smoke`: GET products 200 non-empty. TC-API-04 `@Regression`: wrong password non-success. TC-API-05 `@Regression`: POST invoice without Bearer → 401. TC-API-06 `@Smoke`: GET search `q=hammer`. Helpers in `api/`; payloads from `payloadBuilder.js` + `billing-api.json`.

**Validation Notes:**  
Live verified before merge (`automation-and-debugging.md` Entry 5): register needs `address` object; cart add `POST /carts/{id}`; invoice field names match OpenAPI. All 6 in `tests/api/api.spec.js`. `npm run test:api` green. CSV rows TC-API-01…06 aligned.

---

## Entry 8 — FunctionalTestCase.csv (manual + UI + API single source)

**Prompt:**  
Read assessment PDF carefully; generate `FunctionalTestCase.csv` under Common QA Requirements: Core ACs, max 5–8 per type, `@Smoke`/`@Regression`, columns for traceability (MapsTo, Preconditions, Steps, Data, Expected, Actual, Status, AutomationRef). All automation rows Status=Passed only if specs pass.

**AI Response Summary:**  
Created root `FunctionalTestCase.csv` with **6 Manual + 6 UI + 6 API** rows. Columns: TestCaseID, Type, Title, MapsTo, Priority, Tags, TestType, Preconditions, TestSteps, TestData, ExpectedResult, ActualResult, Status, AutomationRef. Manual TC-M-01…06; UI TC-UI-01…06; API TC-API-01…06. TestType mix: Positive, Negative. Status=Passed for all after execution evidence.

**Validation Notes:**  
- Cap: 6 per type (within 5–8).  
- Every row MapsTo AC1 or AC2.  
- AutomationRef = `Manual only` or exact spec path.  
- Cross-checked CSV Tags vs spec `tag:` annotations.  
- No duplicate IDs; titles match assessment language (COD, Confirm×2).

---

## Entry 9 — Test data linkage for designed cases

**Prompt:**  
For each designed UI/API case, specify **test data source**: static JSON vs runtime-generated. Ensure no secrets or real PII. Document in CSV TestData column.

**AI Response Summary:**  
UI: `test-data/user.json` (names, password, address fields; email empty in JSON, filled `qa.test+{timestamp}@example.com` at runtime). Checkout: `test-data/billing.json`. API: `test-data/billing-api.json` via `buildCodInvoicePayload(cartId)`; users via `buildUniqueUser()` / `toRegisterPayload()`. Negatives: known demo email `customer@practicesoftwaretesting.com` + wrong password only for negative login cases.

**Validation Notes:**  
Opened `utils/payloadBuilder.js` and JSON files — field names match live API. CSV TestData column references same patterns. No bearer tokens stored in CSV or repo.

---

## Entry 10 — What not to auto-generate (design guardrails)

**Prompt:**  
Call out **bad test-design prompts** for this assessment so future AI sessions do not pollute the suite.

**AI Response Summary:**  
Avoid: “generate all tests for the website”; untagged mega-suites; cases ignoring Confirm×2; non-COD payment as Core; invented endpoints/selectors; more than 8 cases per tier; duplicating same assert in manual+UI+API without reason.

**Validation Notes:**  
Rules copied to `project-info.md` §6 and `.cursor/rules/qa-toolshop.mdc`. Used to reject AI suggestions that expanded scope during CSV and spec reviews.

---

## Entry 11 — Coverage and correctness review (final gate)

**Prompt:**  
Review the full designed suite (CSV + specs): is **coverage complete** for Core ACs and risks, and is every automated case **correct** against live SUT?

**AI Response Summary:**  
AC1 covered: manual profile (M-01), UI register/login (UI-01), API auth+cart (API-01), negatives M-02/M-05, API-04. AC2 covered: manual COD+qty (M-03/M-04/M-06), UI checkout (UI-02), catalog (UI-03…06), API cart+invoice (API-02), products/search (API-03/06), API-05 unauthorized. Risks R1–R5 mitigated. R6: role/data-test locators + `domcontentloaded`. R7: timestamp emails. R8: 6 cases/type cap held.

**Validation Notes:**  
- Ran `npm test` — all specs passed.  
- Generated Allure → `execution-report/` matches CSV Status=Passed.  
- Grep `FunctionalTestCase.csv` for AC1/AC2 MapsTo — no orphan rows.  
- Confirmed TC-UI-02 and TC-M-03 both document Confirm×2 (consistency check).

---

## Summary — designed artifacts

| Artifact | Cases | Smoke | Regression |
|----------|-------|-------|------------|
| Manual (`FunctionalTestCase.csv`) | TC-M-01…06 | M-01, M-03 | M-02, M-04, M-05, M-06 |
| UI (`tests/ui/`) | TC-UI-01…06 | UI-01, UI-04, UI-05, UI-06 | UI-02, UI-03 |
| API (`tests/api/api.spec.js`) | TC-API-01…06 | API-01, API-03, API-06 | API-02, API-04, API-05 |

**Run designed tags:** `npm run test:smoke` / `npm run test:regression` (see `README.md`).

_Test implementation and debug prompts continue in `ai-prompts/automation-and-debugging.md`. Test data detail in `ai-prompts/test-data.md`._
