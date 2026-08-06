# AI Prompts – Test Data

Prompts used to generate test data for UI + API.

For each entry:

- **Prompt:**
- **AI Response Summary:**
- **Validation Notes** (how you checked coverage and correctness)

**Related outputs:** `test-data/`, `utils/payloadBuilder.js`, `fixtures/testFixtures.js`, `FunctionalTestCase.csv` (TestData column), `tests/ui/`, `tests/api/api.spec.js`.

---

## Entry 1 — Unique user strategy (no PII collision)

**Prompt:**  
Suggest safe registration data for repeated Toolshop UI/API runs without colliding emails or using real PII.

**AI Response Summary:**  
Timestamped emails: UI `qa.test+{Date.now()}@example.com`; API `qa.api+{stamp}@example.com` via `buildUniqueUser()`. Strong demo password in `user.json` / `payloadBuilder` only — not production secrets. Fake but schema-valid name, phone, address. Never reuse same email across parallel runs.

**Validation Notes:**  
Checked risk R7 mitigation in `requirements-risk-analysis.md`. Grep specs — every UI register path uses `Date.now()` email. API uses `buildUniqueUser()` per test. No real customer emails for positive flows. **Coverage:** all positive register/login cases. **Correctness:** no duplicate-email 422 in repeated local runs.

---

## Entry 2 — UI static user file (`test-data/user.json`)

**Prompt:**  
Design static UI registration defaults in JSON for `RegisterPage` — fields the form expects, email empty at rest.

**AI Response Summary:**  
`user.json`: `firstName`, `lastName`, `dob`, `postalCode`, `houseNumber`, `street`, `city`, `state`, `phone`, empty `email`, `password`. Specs merge with runtime email. Used in `homePage.spec.js` and `addToCartAndPayment.spec.js`.

**Validation Notes:**  
Opened `RegisterPage.userRegistration()` — field names match JSON keys passed as `userDetails`. CSV TC-UI-01 Preconditions cite `user.json`. **Correctness:** registration succeeds on live UI with these values. **Coverage:** TC-UI-01, TC-UI-02 positive auth paths.

---

## Entry 3 — UI checkout billing (`test-data/billing.json`)

**Prompt:**  
Align UI billing with API `billing-api.json` so TC-UI-02 invoice matches TC-API-02. Handle UI postcode-lookup vs API direct POST.

**AI Response Summary:**  
`billing.json` same fields as API: `Zoey Shore` / `Hesselbury` / `Florida` / **`TG`** / **`1234AA`** / house **`A42`** / COD. `CheckoutPage.fillBillingAddress()` selects country label Togo (control value `TG`), stubs `**/postcode*` lookup (UI-only), waits out profile `getDetails` race, fills house last.

**Validation Notes:**  
API TC-API-02: `TG`+`1234AA` → invoice **201**. UI without stub: proceed disabled or invoice **422**. With stub + fill order: Confirm #2 → same payload → **201**. Country `inputValue()` logged as `TG`. **Correctness:** UI billing file kept in sync with `billing-api.json`.

---

## Entry 4 — API invoice template (`test-data/billing-api.json`)

**Prompt:**  
Using the assessment sample invoice JSON, create API billing template without dynamic `cart_id` — list required fields and negative variants.

**AI Response Summary:**  
`billing-api.json`: billing_* fields + COD + `payment_details: {}`. No `cart_id` in file — injected by `buildCodInvoicePayload(cartId)`. Negatives: missing Bearer (TC-API-05); wrong password uses separate credentials (TC-API-04).

**Validation Notes:**  
Live `POST /invoices` returns 201 + `invoice_number` (TC-API-02). Reference for UI billing — same `TG` / `1234AA` / `A42`. **Correctness:** OpenAPI field names verified.

---

## Entry 5 — `utils/payloadBuilder.js` (API register + invoice builders)

**Prompt:**  
Implement payload builders: unique API user with nested `address` object, register body flattening, COD invoice from `billing-api.json` + dynamic `cart_id`.

**AI Response Summary:**  
`buildUniqueUser()`: nested `address` (street, city, state, country, postal_code), `ToolshopQa#2026!` password, timestamp email. `toRegisterPayload()` strips to API register shape. `buildCodInvoicePayload(cartId)` spreads `billing-api.json`, sets `cart_id`, COD, empty `payment_details`.

**Validation Notes:**  
**Critical live fix:** register without `address` object failed before builder update (`automation-and-debugging.md` Entry 6). `npm run test:api` green. `fixtures/testFixtures.js` exposes `uniqueUser` fixture using same builder. **Coverage:** TC-API-01, TC-API-02 positive API flows.

---

## Entry 6 — Dynamic IDs (product, cart) — no hardcoded seeds

**Prompt:**  
What test data rules apply for `product_id` and `cart_id` on a public demo that may reset?

**AI Response Summary:**  
Never hardcode stale product IDs. Flow: `GET /products` → pick first `id`; `POST /carts` → use returned `id`; add item via `POST /carts/{id}`. Invoice uses cart id from create response. Search uses query string only (`hammer`) — no id dependency.

**Validation Notes:**  
Read `api.spec.js` TC-API-02 — product id from live products response. TC-API-03/06 need no cart. **Correctness:** suite survives catalog changes better than fixed id. Documented in README environment assumptions.

---

## Entry 7 — Negative and edge test data

**Prompt:**  
Define negative test data for wrong login, unauthorized invoice, and manual negative cases — minimal, safe, no secrets in chat logs.

**AI Response Summary:**  
API TC-API-04: `customer@practicesoftwaretesting.com` + `DefinitelyWrong!NotValid99` (public demo account pattern). TC-API-05: `buildCodInvoicePayload('invalid-cart-id-for-negative')` + empty Bearer. Manual TC-M-02 same wrong-password pattern; TC-M-05 `not-an-email`; TC-M-06 empty billing fields. UI/API negatives do not log tokens.

**Validation Notes:**  
Cross-checked `FunctionalTestCase.csv` TestData column. API-04 accepts 401/422/423/500 — data triggers failure without token leak. API-05 asserts 401. **Coverage:** all regression negative API rows + manual negative rows have explicit data. **Correctness:** no raw bearer tokens in repo or console logs.

---

## Entry 8 — Manual CSV `TestData` column patterns

**Prompt:**  
Align manual test case TestData in `FunctionalTestCase.csv` with automation data patterns for traceability.

**AI Response Summary:**  
Manual rows use human-readable patterns: `qa.test+{timestamp}@example.com`, `ValidPass@123`, COD + Confirm×2, `customer@practicesoftwaretesting.com` for wrong password, `not-an-email`, blank billing fields, slider ranges `1-100` / `100-200`, `searchQuery=hammer`, `category=Hammer`, `filter=eco-friendly`.

**Validation Notes:**  
Opened CSV — every Manual/UI/API row has TestData or “None” where appropriate. AutomationRef links to specs using same patterns. **Clarity:** manual tester replaces `{timestamp}` at execution. **Coverage:** all 18 CSV rows have data or explicit none.

---

## Entry 9 — Environment and data assumptions

**Prompt:**  
What environment assumptions should we document for Toolshop test data?

**AI Response Summary:**  
Public demo UI + API only; no `.env` required; optional `BASE_URL` / `UI_BASE_URL` override. Intermittent API 500/timeouts — Playwright `retries: 2`. Cloudflare/headless occasional variance. Demo data may reset — dynamic ids preferred. Passwords in JSON are **demo patterns only** — rotate if repo is public and policy requires.

**Validation Notes:**  
Matches README Prerequisites and `playwright.config.js`. No committed `.env` or tokens. **Correctness:** docs do not claim private staging or seeded DB.

---

## Entry 10 — Fixtures vs inline data in specs

**Prompt:**  
Should UI tests use `fixtures/testFixtures.js` `uniqueUser` or inline `user.json` + timestamp email?

**AI Response Summary:**  
Both supported: fixture provides `uniqueUser` from `buildUniqueUser()` for future specs; current UI specs import `user.json` + `qa.test+${Date.now()}@example.com` inline. API specs always use `payloadBuilder`. Prefer one pattern per file for maintainability.

**Validation Notes:**  
`testFixtures.js` wired but `homePage.spec.js` / `addToCartAndPayment.spec.js` use inline pattern — documented as intentional. **Coverage:** fixture ready for migration; no collision either way due to timestamps.

---

## Entry 11 — Search and filter test inputs (UI)

**Prompt:**  
What static search/filter inputs for TC-UI-03…06 need no external JSON files?

**AI Response Summary:**  
TC-UI-03: price bounds 1–100 and 100–200 (assert on visible prices). TC-UI-04: search `hammer`. TC-UI-05: category `Hammer`. TC-UI-06: eco-friendly filter toggle. Data lives in spec constants / page object calls — no extra JSON.

**Validation Notes:**  
Grep `homePage.spec.js` — inputs match CSV TestData. Live catalog contains hammer products — tests pass. **Coverage:** catalog UI cases without polluting `test-data/` folder.

---

## Entry 12 — Data hygiene (what not to put in test data)

**Prompt:**  
What must never be stored in test data files or AI prompts for this project?

**AI Response Summary:**  
No production credentials, API keys, OAuth secrets, real customer PII, or raw bearer tokens. No full `.env` in repo. Invoice/register logs redact tokens in debug prompts. Demo passwords in JSON acceptable for public SUT only.

**Validation Notes:**  
Grep repo — no `access_token` literals in `test-data/`. `authApi` logs `Boolean(accessToken)` not value. **Correctness:** aligns `project-info.md` §9 and `.cursor/rules/qa-toolshop.mdc`. **Tone:** habit transferable to real projects.

---

## Summary — test data map

| Source | Path / function | Used by | Dynamic? |
|--------|-----------------|---------|----------|
| UI user defaults | `test-data/user.json` | TC-UI-01, TC-UI-02 | Email at runtime |
| UI billing | `test-data/billing.json` | TC-UI-02 | Static — synced with `billing-api.json` (`TG`/`1234AA`/`A42`); UI stubs postcode-lookup |
| API billing template | `test-data/billing-api.json` | `buildCodInvoicePayload()` | `cart_id` at runtime |
| API user builder | `buildUniqueUser()` | TC-API-01, TC-API-02, fixture | Email per call |
| Negative login | Inline in spec / CSV | TC-API-04, TC-M-02 | Static demo email |
| No-token invoice | `invalid-cart-id-for-negative` | TC-API-05 | Static placeholder |
| Product/cart ids | From API responses | TC-API-02 | Fully dynamic |
| Search `hammer` | Inline in spec | TC-UI-04, TC-API-06 | Static query |
| Manual patterns | `FunctionalTestCase.csv` | TC-M-01…06 | `{timestamp}` manual |

**Verify data after changes:** `npm run test:api` and `npm run test:ui` from repo root.

_Test data design prompts for scenarios are in `ai-prompts/test-design.md` Entry 9. Implementation debug in `ai-prompts/automation-and-debugging.md`._
