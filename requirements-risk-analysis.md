# Requirement & Risk Analysis — Toolshop

**SUT:** Practice Software Testing — Toolshop (Checkout & Application Flow)  
**UI:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com  
**API docs:** https://api.practicesoftwaretesting.com/api/documentation  

---

## Why this document is required (`QA Practical Assessment.pdf`)

This artifact is **mandatory content** for the assessment. The PDF does not always use the filename `requirements-risk-analysis.md`, but it requires this analysis as a separate deliverable:

| PDF section | What it says |
|-------------|----------------|
| **Common QA Requirements #1** (p. 7) | Submission must include **requirement and risk analysis** specific to the application under test. |
| **Common QA Requirements #2** (p. 7) | `project-info` document covers Project Info, UI, API, **positive/negative/edge**, **Smoke/Regression** — this file supplies the **analysis**; `project-info.md` explains the **AI workflow**. |
| **Core AC #1** (p. 7) | Derive **clear test objectives and scope** from the application. |
| **Core AC #2** (p. 7) | **Traceable mapping** from requirements to test scenarios and cases. |
| **Core AC #3** (p. 7) | Cover **valid and invalid** paths with tests (manual + automation). |
| **Part B SUT** (p. 5–6) | UI AC1/AC2 and API AC1/AC2 high-level flows; **Confirm twice** for invoice; COD; sample invoice JSON. |
| **Cap & tags** (p. 9) | 5–8 cases per type (manual + UI + API); `@Smoke` and `@Regression`. |
| **Quick Tips Phase 1** (p. 14) | “QA doc + requirements + **risk doc** → Auto” before automation. |

**Prompt evidence:** `ai-prompts/requirements-and-planning.md` (Entries 2, 3, 4, 10, 12).  
**Downstream artifacts:** `FunctionalTestCase.csv`, `tests/ui/`, `tests/api/api.spec.js`, `execution-report/`.

---

## 1. Test objectives and scope (Core AC #1)

| Objective | In scope (Core) | Out of scope (Stretch) |
|-----------|-----------------|------------------------|
| Validate AC1 auth/profile (UI + API) | Register, login, profile/token, wrong password | Admin user APIs |
| Validate AC2 purchase/invoice (UI + API) | Browse, cart, qty, COD checkout, invoice, Confirm×2 (UI) | Non-COD payment deep matrix |
| API lifecycle | Register → token → cart → products → invoice | PDF download exhaustive tests |
| Catalog UX (UI) | Search, category filter, price range, eco filter | Full site regression |
| Suite size | **6** manual + **6** UI + **6** API (within 5–8 cap) | >8 per tier |
| Execution | Local Playwright + Allure evidence | CI pipeline (not in this repo) |

**Payment (Core):** `cash-on-delivery` only.  
**Known UI quirk:** press **Confirm twice** to generate invoice (PDF p. 5).

---

## 2. Requirement understanding (PDF Part B ACs)

### AC1 — User Registration & Login (UI)

| Item | Detail |
|------|--------|
| **PDF intent** | Register with valid details → login with same credentials → verify profile (p. 5) |
| **Actors** | Guest → Registered Customer |
| **UI path** | Home → Sign in → Register → fill form → login → **My profile** (name + email) |
| **Preconditions** | Unique email; password meeting app rules |
| **Main success** | Registration succeeds; login succeeds; profile shows registered first/last name and email |
| **Failures of interest** | Wrong password, invalid email format, empty required fields |

### AC1 — User Authentication & Cart Creation (API)

| Item | Detail |
|------|--------|
| **PDF intent** | Register via API → login → valid bearer token → create cart (p. 6) |
| **API path** | `POST /users/register` → `POST /users/login` → `POST /carts` with Bearer |
| **Main success** | 201 register, 200 login + `access_token`, 201 cart with `id` |
| **Failures of interest** | Wrong password (401/422), missing/invalid token on protected calls |

### AC2 — End-to-End Purchase / Invoice (UI)

| Item | Detail |
|------|--------|
| **PDF intent** | Browse → multi-item cart + qty update → COD checkout → invoice in **My Invoices**; **Confirm twice** (p. 5) |
| **UI path** | Product browse → add to cart → checkout → billing address → COD → **Confirm #1** (payment success) → **Confirm #2** (invoice) → **My Invoices** |
| **Main success** | Payment success after Confirm #1; `INV-` thank-you after Confirm #2; invoice listed under My Invoices |
| **Failures of interest** | Empty required billing fields, checkout without items |

### AC2 — Product Selection & Invoice Generation (API)

| Item | Detail |
|------|--------|
| **PDF intent** | Bearer token → products → add to cart → verify cart → invoice with billing (p. 6) |
| **API path** | `GET /products` → `POST /carts` / `POST /carts/{id}` → `GET /carts/{id}` → `POST /invoices` |
| **Sample invoice body** | `billing_*`, `payment_method: cash-on-delivery`, `cart_id`, `payment_details: {}` (PDF p. 6) — live Core uses `TG` + `1234AA` + house `A42` (same as UI `billing.json`) |
| **Main success** | 201 invoice with `invoice_number` |
| **Failures of interest** | No Bearer (401), invalid payload |

### Ambiguities — resolution status (live Part B)

| # | Ambiguity | Resolution |
|---|-----------|------------|
| 1 | Profile page URL/labels | **Resolved:** user menu → link **My profile**; fields `data-test="first-name"|"last-name"|"email"`. TC-UI-01 + TC-M-01 |
| 2 | Guest cart merge after login | TC-UI-02 registers before checkout — logged-in cart path |
| 3 | Confirm control names / ×2 behaviour | **Resolved:** `data-test="finish"`. Angular: Confirm #1 = payment check only; Confirm #2 = `POST /invoices`. Hard-click #2 in `CheckoutPage`; TC-UI-02 + TC-M-03 |
| 4 | `POST /carts` auth | Cart create uses Bearer in TC-API-01 |
| 5 | Invoice endpoint/body vs OpenAPI | Live verify: `POST /invoices`, nested `address` on register, cart add via `POST /carts/{id}` |
| 6 | UI billing vs API (postcode-lookup) | **Resolved:** UI address step calls `GET /postcode-lookup` (API does not). Stub lookup in TC-UI-02 so `TG`+`1234AA` matches API `billing-api.json`; wait out profile `getDetails` race |

---

## 3. Valid vs invalid paths (Core AC #3)

| Flow | Valid (positive) | Invalid (negative / edge) |
|------|------------------|---------------------------|
| **Auth UI** | TC-M-01, TC-UI-01 register + login + **profile** | TC-M-02 wrong password; TC-M-05 invalid email |
| **Auth API** | TC-API-01 register/login/cart | TC-API-04 wrong password |
| **Checkout UI** | TC-M-03 Confirm×2; TC-M-04 multi-item; **TC-UI-02 Confirm×2 + My Invoices** | TC-M-06 empty billing |
| **Checkout API** | TC-API-02 COD invoice 201 | TC-API-05 no Bearer 401 |
| **Catalog UI** | TC-UI-04–06 search/filter | TC-UI-03 price boundary asserts |
| **Catalog API** | TC-API-03 products; TC-API-06 search | — |

---

## 4. Risk analysis (P0 first)

| ID | Risk | Impact | Likelihood | Layer | Mitigation in Core suite |
|----|------|--------|------------|-------|---------------------------|
| R1 | Auth broken (register/login) | Blocks all purchase flows | Med | UI+API | Smoke: TC-M-01, TC-UI-01, TC-API-01 |
| R2 | Token not applied on protected calls | False pass / silent 401 | Med | API | TC-API-05 asserts 401 without Bearer |
| R3 | Cart contents wrong after qty / multi-item | Wrong order total | Med | UI+API | TC-M-04; TC-API-02 cart verify |
| R4 | Single Confirm only → no invoice | Lost order evidence | **High** | UI | TC-M-03; **TC-UI-02** hard-click Confirm #1+#2, assert `INV-`, verify under My Invoices |
| R5 | Invoice payload validation gaps | Bad orders / unclear 4xx | Med | UI+API | TC-API-02 (`TG`+`1234AA`); TC-UI-02 same billing + postcode stub; TC-API-05 401 |
| R6 | Flaky locators / timing / overlays | Unreliable runs | Med | UI | `data-test`; `domcontentloaded`; force Confirm #2; hide chat FAB; profile menu by role |
| R7 | Test data collision (same email) | Intermittent failures | Med | Both | Timestamped emails; `buildUniqueUser()` |
| R8 | Scope explosion | Weak artifacts | Med | Process | Hard cap 6 cases/type; Stretch cut |

---

## 5. Traceability — requirement → test cases (Core AC #2)

Target: **6** scenarios each for Manual, UI automation, API automation (PDF cap 5–8).  
**Status:** all **Passed** in `FunctionalTestCase.csv` after local runs.  
**Evidence:** `execution-report/index.html`, `reports/playwright-report/`.

### Coverage by type (positive / negative / edge)

| Type | Manual | UI | API |
|------|--------|-----|-----|
| **Positive** | M-01, M-03, M-04 | UI-01, UI-02, UI-03–06 | API-01, API-02, API-03, API-06 |
| **Negative** | M-02, M-05, M-06 | — (negatives in manual + API) | API-04, API-05 |
| **Edge** | M-04 multi-item qty | UI-03 price bounds | API-06 search |

### Manual / Functional

| ID | Maps to | Tag | Type | AutomationRef |
|----|---------|-----|------|----------------|
| TC-M-01 | AC1 | @Smoke | Positive auth + profile | Manual only |
| TC-M-02 | AC1 | @Regression | Negative wrong password | Manual only |
| TC-M-03 | AC2 | @Smoke | COD + Confirm×2 | Manual only |
| TC-M-04 | AC2 | @Regression | Multi-item + qty | Manual only |
| TC-M-05 | AC1 | @Regression | Invalid email | Manual only |
| TC-M-06 | AC2 | @Regression | Empty billing | Manual only |

### UI automation (as implemented)

| ID | Maps to | Tag | Spec / notes |
|----|---------|-----|--------------|
| TC-UI-01 | AC1 | @Smoke | `homePage.spec.js` — register + login + **My profile** (name/email) |
| TC-UI-02 | AC2 | @Regression | `addToCartAndPayment.spec.js` — COD, **Confirm×2**, invoice `INV-`, **My Invoices** |
| TC-UI-03 | AC2 | @Regression | `homePage.spec.js` — price slider 1–100 / 100–200 |
| TC-UI-04 | AC2 | @Smoke | `homePage.spec.js` — search hammer |
| TC-UI-05 | AC2 | @Smoke | `homePage.spec.js` — Hammer category |
| TC-UI-06 | AC2 | @Smoke | `homePage.spec.js` — eco-friendly filter |

### API automation (as implemented)

| ID | Maps to | Tag | Spec / notes |
|----|---------|-----|--------------|
| TC-API-01 | AC1 | @Smoke | Register + login + create cart |
| TC-API-02 | AC2 | @Regression | Products → cart → verify → COD invoice 201 |
| TC-API-03 | AC2 | @Smoke | `GET /products` list |
| TC-API-04 | AC1 | @Regression | Wrong password |
| TC-API-05 | AC2 | @Regression | Invoice without Bearer → 401 |
| TC-API-06 | AC2 | @Smoke | `GET /products/search?q=hammer` |

### Risk → test mapping

| Risk | Mitigating test IDs |
|------|---------------------|
| R1 | TC-M-01, TC-UI-01, TC-API-01 |
| R2 | TC-API-05 |
| R3 | TC-M-04, TC-API-02 |
| R4 | TC-M-03, TC-UI-02 |
| R5 | TC-API-02, TC-API-05 |
| R6 | All UI specs (locator/wait strategy) |
| R7 | All positive register flows |
| R8 | 6 cases/type enforced |

---

## 6. Smoke vs Regression strategy

| Suite | Goal | Include (this project) |
|-------|------|------------------------|
| **Smoke** | Fast critical-path confidence | UI: UI-01, UI-04, UI-05, UI-06. API: API-01, API-03, API-06. Manual: M-01, M-03 |
| **Regression** | Depth, negatives, longer flows | UI: UI-02, UI-03. API: API-02, API-04, API-05. Manual: M-02, M-04, M-05, M-06 |

**Commands:** `npm run test:smoke` / `npm run test:regression` (see `README.md`).  
**Layer split:** `npm run test:api:smoke`, `test:api:regression`, `npx playwright test tests/ui --grep @Smoke`.

---

## 7. Test data strategy (pointer)

Detailed AI prompts and file map: `ai-prompts/test-data.md`.  

| Source | Notes |
|--------|--------|
| `test-data/user.json` | UI register defaults; email at runtime |
| `test-data/billing.json` | UI COD — **synced with** `billing-api.json` (`TG`, `1234AA`, house `A42`) |
| `test-data/billing-api.json` | API COD invoice template; `cart_id` at runtime |
| `utils/payloadBuilder.js` | Unique API users + COD invoice builder |
| UI-only | Stub `GET /postcode-lookup` in TC-UI-02 (API never uses it) |

Timestamp emails; dynamic `product_id` / `cart_id` from live responses.

---

## 8. Execution evidence (Common QA Req #8)

| Evidence | Path |
|----------|------|
| Static Allure (submission — **primary for reviewers**) | `execution-report/index.html` (right-click → Open in Browser) |
| Playwright HTML | `reports/playwright-report/` |
| CSV status | `FunctionalTestCase.csv` — all rows `Passed` |
| Generate Allure | `npm test` → `npm run allure:execution-report` |

---

## 9. AI usage on this artifact

- Cursor drafted AC tables, risks, and traceability from PDF Part B flows (`ai-prompts/requirements-and-planning.md`).  
- Human adjusted after live SUT validation: catalog TC-UI-03…06; API-02 regression; **TC-UI-01 profile**; **TC-UI-02 Confirm×2 + My Invoices**; UI/API billing + postcode stub (`ai-prompts/automation-and-debugging.md` Entries 14–16).  
- This file = **analysis artifact** (Common QA #1); prompt history = `ai-prompts/requirements-and-planning.md`.

---

## Checklist — PDF Common QA Requirements covered here

| PDF req (p. 7) | Section |
|----------------|---------|
| #1 Requirement and risk analysis | Whole document |
| #2 project-info (analysis inputs) | §1 scope, §6 smoke/regression, §3 valid/invalid |
| Traceable mapping (Core AC #2) | §5 |
| Valid + invalid paths (Core AC #3) | §3 |
| 5–8 cases per type + tags | §5 tables |
| Execution evidence pointer | §8 |

*Last aligned to implemented suite and `FunctionalTestCase.csv` — 2026-08-07.*
