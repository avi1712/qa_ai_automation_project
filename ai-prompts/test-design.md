# AI Prompts – Test Design

Prompts for UI + API scenario design (Part A strategy → Part B CSV/specs).

---

## Entry 1 — Smoke vs regression matrix

**Prompt:**  
Propose smoke vs regression scenarios for Toolshop AC1/AC2 (UI + API). Max 8 per tier. Include tags and risk link. Do not write full step tables.

**AI Response Summary:**  
Smoke: register/login/profile; COD checkout with Confirm×2; API register/login+token; API cart→invoice. Regression: wrong password, invalid email, multi-item qty, missing cart_id, unauthorized invoice, invoice list check.

**Validation Notes:**  
Mapped into `requirements-risk-analysis.md` traceability tables (TC-M / TC-UI / TC-API). Dropped Stretch ideas (admin APIs, PDF download deep checks) to protect suite budget.

---

## Entry 2 — Manual case types coverage ask

**Prompt:**  
For AC1 login and AC2 checkout only, list functional, negative, edge, and light non-functional ideas. Cap total manual ideas at 8.

**AI Response Summary:**  
Positive auth+profile; wrong password; invalid email; multi-item+qty; COD+Confirm×2; required address empty; optional clear error-message check; optional blocked empty-cart checkout.

**Validation Notes:**  
Kept six strong manual IDs (TC-M-01…06) for Core. Full step/expected-result CSV deferred to Part B after UI walkthrough so steps match real labels.

---

## Entry 3 — What not to auto-generate

**Prompt:**  
Call out bad test-design prompts for this assessment.

**AI Response Summary:**  
Avoid “generate all tests for the website”, untagged mega-suites, and cases that ignore Confirm×2 or invent payment methods outside COD Core.

**Validation Notes:**  
Added as process rule in `project-info.md` §6–8. Future design chats stay flow-scoped.

---

## Entry 4 — FunctionalTestCase.csv (manual + UI + API)

**Prompt:**  
Read assessment PDF carefully; generate `FunctionalTestCase.csv` under Common QA Requirements, Core ACs, repo structure, execution reports with all statuses Passed, max 5–8 cases per type (manual+UI+API) with `@Smoke`/`@Regression`. SUT UI/API Toolshop.

**AI Response Summary:**  
Created root `FunctionalTestCase.csv` with **6 Manual + 6 UI + 6 API** cases (within 5–8 cap). Manual TC-M-01…06 cover AC1/AC2 (auth, wrong password, COD Confirm×2, multi-item qty, invalid email, empty billing). UI/API rows aligned to existing Playwright specs so Status=`Passed` matches Allure/Playwright evidence.

**Validation Notes:**  
- Cap enforced: 6 per type; tags mix `@Smoke` and `@Regression`.  
- UI IDs match live specs (TC-UI-01 register/login; TC-UI-02 COD Confirm×2; TC-UI-03…06 filters/search).  
- API IDs match `tests/api/api.spec.js` (auth+cart, COD invoice, products, bad login, 401 invoice, search).  
- Columns include MapsTo, Preconditions, Steps, Data, Expected/Actual, Status, AutomationRef for traceability.
