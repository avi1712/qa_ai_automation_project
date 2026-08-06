# AI Prompts – Automation and Debugging

Part A: design principles recorded. Part B: append concrete failure entries after first runs.

---

## Entry 1 — Prism + Playwright structure ask (planning only)

**Prompt:**  
Outline a Prism-style Playwright layout for Toolshop UI + API with Smoke/Regression projects. Do not generate full specs yet.

**AI Response Summary:**  
Suggested `tests/ui`, `tests/api`, `pages`, `api` helpers, `fixtures`, `utils`, tag-based scripts `test:smoke` / `test:regression`, shared auth fixture and billing payload builder.

**Validation Notes:**  
Accepted as target structure in `project-info.md` §7. Implementation waits for Part B to avoid empty placeholder code and wasted tokens.

---

## Entry 2 — Double Confirm automation caution

**Prompt:**  
How should UI automation handle “press Confirm twice” without flake?

**AI Response Summary:**  
Model as two explicit user actions with separate expects (payment success message, then thank-you/invoice number). Avoid single click + blind wait. Prefer getByRole/text over brittle CSS.

**Validation Notes:**  
Captured under risk R4. Will encode in TC-UI smoke E2E during Part B.

---

## Entry 3 — Debug protocol (template for Part B)

**Prompt:**  
Define a reusable debug prompt template for failing Playwright tests.

**AI Response Summary:**  
Paste one failure (message + stack snippet + HTTP body with token redacted) → ask ranked hypotheses → surgical fix → re-run single spec → log helped/misled.

**Validation Notes:**  
Adopted in `project-info.md` §10. Real failures will be appended below after execution.

---

## Entry 4 — Align PrismStructure folder tree

**Prompt:**  
Add / align `PrismStructure/` to the canonical tree (smoke/regression specs, pages, api, fixtures, utils, test-data, reports/playwright-report).

**AI Response Summary:**  
Consolidated UI smoke into `auth-checkout.smoke.spec.js`, UI regression into `cart-invoice.regression.spec.js`, API smoke into `auth-cart-invoice.smoke.spec.js`; kept `negatives.regression.spec.js`. Added `reports/playwright-report/.gitkeep` (+ test-results) so empty report dirs stay in git while run artifacts remain ignored. Specs still `test.skip` until live SUT/OpenAPI verification.

**Validation Notes:**  
Tree matches assessment layout; `ProfilePage.js` retained (used by auth/checkout smoke). No live runs yet.

---

## Entry 5 — API AC1/AC2 five tests (live verified)

**Prompt:**  
Implement 5 API tests (Smoke + Regression) for Toolshop AC1/AC2 against live API; separate API project; logs per action; execute.

**AI Response Summary:**  
Verified live: register needs `address` object + non-leaked password; add item via `POST /carts/{id}`; invoice COD `201` with Bearer. Added `api` Playwright project (`baseURL` api host), helpers + `apiLogger`, 3 smoke + 2 regression. All 5 passed (~10s).

**Validation Notes:**  
Folder: repo root (Playwright Prism layout). Run: `npx playwright test --project=api`.

---

## Entry 6 — CI TimeoutError on page.goto networkidle

**Prompt:**  
GitHub Actions UI failures: `TimeoutError: page.goto: Timeout 60000ms exceeded` navigating to `https://practicesoftwaretesting.com/` waiting until `networkidle`. Suggested BASE_URL localhost:3000 / maximize guards.

**AI Response Summary:**  
Real cause was **not** missing base URL (CI already hit Toolshop). `waitUntil: 'networkidle'` never settles on this SUT in CI. Fixed `BasePage.goto` to `domcontentloaded`, guarded maximize, clearer logs; same for Register/Home login navigations. Workflow `BASE_URL` set to Toolshop (not localhost).

**Debugging Outcome:**  
localhost:3000 would have broken CI (no local app). networkidle → domcontentloaded is the correct fix.

---

## Part B log (append after runs)

_API suite green (2026-08-03). UI CI networkidle fix applied (2026-08-06)._

<!--
### Failure entry template
**Prompt:** ...
**AI Response Summary:** ...
**Debugging Outcome:** ...
-->
