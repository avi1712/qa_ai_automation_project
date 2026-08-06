# AI Prompts – Requirements and Planning

Record prompts and responses used for understanding the Toolshop flow, identifying risks, and drafting the test plan.

For each entry:

- **Prompt:**
- **AI Response (short summary):**

Validation notes are added where the human QA reviewed or changed AI output before accepting it into repo artifacts.

**Related outputs:** `requirements-risk-analysis.md`, `project-info.md` (Setup Summary §2–§3), `FunctionalTestCase.csv` (scenario IDs), `README.md` (run strategy).

---

## Entry 1 — Extract Part A / Part B deliverables from assessment PDF

**Prompt:**  
Read `QA Practical Assessment.pdf` and complete Part A: AI Workflow Foundation (QA). List exact deliverables for Part A and Part B (Common QA Requirements).

**AI Response (short summary):**  
Part A = `project-info.md` (AI workflow: context, requirement analysis, strategy, manual/automation design, validation, test data, debugging, data hygiene, reuse). Part B = manual `FunctionalTestCase.csv`, Playwright Prism UI + API automation, execution reports (Playwright HTML + Allure), prompt history in `ai-prompts/`, README with run commands. Core ACs = AC1 (register/login/profile) and AC2 (cart/checkout/COD invoice; UI Confirm×2). Cap 5–8 cases per type; tag `@Smoke` and `@Regression`.

**Validation Notes:**  
Matched PDF “Expected Submission” and Part B checklist. Scoped work to Toolshop public demo only. Did not start full automation until requirements and risk cut were documented.

---

## Entry 2 — Toolshop flow and AC decomposition (AC1 + AC2)

**Prompt:**  
From the assessment Core ACs, explain the Toolshop **application flow** for AC1 (register → login → profile) and AC2 (browse → multi-item cart → qty update → COD checkout → invoice / My Invoices). Include UI path and API path. Note the UI quirk: press **Confirm twice** for invoice. List what must be verified live before automation.

**AI Response (short summary):**  
AC1 UI: Register form → Sign in → Profile/My Account; API: `POST /users/register` → `POST /users/login` → authenticated user read. AC2 UI: product browse → add multiple items → cart qty → checkout address → COD payment → Confirm×2 → invoice in My Invoices. AC2 API: Bearer token → `GET /products` → create cart → add items → verify cart → `POST` invoice with billing + `cash-on-delivery`. Success = invoice id/number and profile/cart data match registration. Live checks needed: profile labels/URL, guest cart merge, Confirm button labels, cart auth rules, invoice endpoint/body vs OpenAPI.

**Validation Notes:**  
Accepted into `requirements-risk-analysis.md` §1 (AC tables + ambiguities). Confirmed COD is Core payment method; other payment types marked Stretch.

---

## Entry 3 — Risk identification (P0 first)

**Prompt:**  
From AC1/AC2, Toolshop URLs, and “Confirm twice for invoice”, produce a **risk register**: ambiguities, P0–P2 risks, impact/likelihood, layer (UI/API), and mitigation in the Core suite. Max 5–8 scenarios per tier later. No full test steps yet.

**AI Response (short summary):**  
Ambiguities: profile labels, cart merge after login, Confirm control names, whether `POST /carts` requires auth, invoice API body vs live OpenAPI. Risks: R1 auth broken; R2 token not on protected calls; R3 cart/qty wrong; R4 single Confirm → no invoice (high); R5 invoice payload gaps; R6 flaky locators; R7 email collision; R8 scope explosion. Mitigations: smoke happy paths, regression negatives/edges, timestamped emails, hard case cap, explicit double Confirm in UI E2E.

**Validation Notes:**  
Accepted into `requirements-risk-analysis.md` §2 (R1–R8). R4 elevated because Confirm×2 is a known SUT quirk. Items marked “verify live in Part B” before locking CSV/automation.

---

## Entry 4 — Draft test plan: traceability and scenario IDs

**Prompt:**  
Draft a **test plan traceability** section: map AC1/AC2 to planned manual, UI, and API scenario IDs (TC-M, TC-UI, TC-API). Budget 5–8 per tier. Assign `@Smoke` vs `@Regression` and positive/negative/edge type. Link each row to a risk ID where possible.

**AI Response (short summary):**  
Proposed six manual cases (TC-M-01…06): register/login/profile smoke; wrong password regression; COD Confirm×2 smoke; multi-item qty regression; invalid email regression; empty billing regression. UI plan: TC-UI-01 smoke auth; TC-UI-02 smoke checkout; regression for invalid login, multi-item, invoice list, empty cart. API plan: TC-API-01 smoke register/login/token; TC-API-02 smoke cart→COD invoice; regression for bad login, products/cart verify, 401 without token, missing `cart_id`. All within 5–8 cap per tier.

**Validation Notes:**  
Written to `requirements-risk-analysis.md` §3. Final UI/API IDs adjusted in Part B after live spec implementation (e.g. TC-UI-03…06 cover filters/search aligned to `homePage.spec.js`). Manual IDs kept as planned.

---

## Entry 5 — Smoke vs regression strategy (test plan)

**Prompt:**  
Propose **smoke vs regression** strategy for Toolshop UI and API separately. What belongs in smoke (fast critical path) vs regression (depth/negatives)? Include npm command intent for Part B README. Max 8 per tag per layer.

**AI Response (short summary):**  
Smoke = fast confidence: auth happy path + COD checkout/invoice (UI Confirm×2); API register/login/token + cart create + COD invoice + product list. Regression = wrong password, invalid email, multi-item/qty, unauthorized/missing Bearer, missing `cart_id`, filter/search edge cases. Commands: `npm run test:smoke` / `npm run test:regression`; split API with `--project="Api Tests"` and `test:api:smoke` / `test:api:regression`. Stretch (admin APIs, deep PDF matrix) excluded from Core.

**Validation Notes:**  
Captured in `requirements-risk-analysis.md` §4 and `README.md` run tables. Overlap with `ai-prompts/test-design.md` Entry 1 — kept here as **planning** evidence; test-design file holds **design** prompts for CSV/specs.

---

## Entry 6 — Core vs Stretch scope cut

**Prompt:**  
From the assessment PDF, list what is **Core** vs **Stretch** for Toolshop so the test plan does not grow past the 5–8 case cap.

**AI Response (short summary):**  
Core: AC1 + AC2 only; COD payment; UI + API automation; manual CSV; public demo URLs; Smoke/Regression tags. Stretch: admin APIs, non-COD payment deep coverage, large negative matrices, PDF download exhaustive tests, CI beyond local runs. Process cap: stop at 8 cases per manual/UI/API tier; drop lowest-priority Stretch ideas first.

**Validation Notes:**  
Adopted in `project-info.md` and risk R8 mitigation. Prevented “generate all site tests” scope creep.

---

## Entry 7 — Reusable context block for every Cursor chat

**Prompt:**  
Define a short reusable **context block** so every new chat knows SUT, stack, caps, and validation rule without pasting the whole PDF.

**AI Response (short summary):**  
Block with UI/API URLs, Core ACs, Playwright Prism at repo root, 5–8 case cap, `@Smoke`/`@Regression`, rule “verify endpoint/locator live before keeping AI output”. Terse Caveman-style wording to save tokens.

**Validation Notes:**  
Copied into `project-info.md` Setup Summary §1 and `.cursor/rules/qa-toolshop.mdc`. Pasted at start of Part B chats.

---

## Entry 8 — Cursor model / token strategy for the assessment

**Prompt:**  
How should Cursor models be used to stay within monthly limits for this QA assessment?

**AI Response (short summary):**  
Auto/Composer for requirements, risk doc, CSV columns, README, `ai-prompts`; coding model only for page objects, API helpers, spec implementation, hard debug. One task per chat; summarize outcomes to `ai-prompts/*.md` after each phase. Caveman skills for terse prompts.

**Validation Notes:**  
Adopted as project rule in `project-info.md` and `.cursor/rules/qa-toolshop.mdc`. Part A planning docs completed before bulk automation.

---

## Entry 9 — Live SUT / OpenAPI verification before locking plan

**Prompt:**  
Before finalizing automation, what must be **verified live** on Toolshop UI and API to close the ambiguities from the risk register?

**AI Response (short summary):**  
UI walkthrough: profile page fields after login; cart after multi-item + qty; checkout address labels; payment step Confirm button (click twice); My Invoices list. API: register body needs `address` object; cart add path `POST /carts/{id}`; invoice `201` with COD + Bearer; `401` without token; product ids from `GET /products` not hardcoded. Document findings before merging specs.

**Validation Notes:**  
Resolved in Part B — API live verify (Entry 5); UI `domcontentloaded` (Entry 6); Confirm×2 + invoice (Entries 2, 14–15); profile fields via My profile link (Entry 16). Ambiguities closed by live runs, not blind AI assumptions. UI vs API billing: same `TG`+`1234AA`; UI stubs postcode-lookup.

---

## Summary — artifacts produced from this phase

| Artifact | Content from prompts above |
|----------|----------------------------|
| `requirements-risk-analysis.md` | AC decomposition, R1–R8, traceability TC IDs, smoke/regression §4 |
| `project-info.md` | Workflow narrative, context block, strategy, scope rules |
| `README.md` | Framework, test data paths, smoke/regression commands, report paths |
| `FunctionalTestCase.csv` | Scenario IDs aligned to plan (detail in `ai-prompts/test-design.md`) |
| `.cursor/rules/qa-toolshop.mdc` | Persistent SUT + cap + verification rules |

_Planning phase complete. Test case step detail and automation implementation prompts continue in `ai-prompts/test-design.md` and `ai-prompts/automation-and-debugging.md`._
