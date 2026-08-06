# project-info.md — Part A: AI Workflow Foundation (QA)

### Objective

Show that AI is used in a **practical testing workflow** — thoughtfully, not as a simple “generate some test cases” shortcut.

This document is the Part A foundation. Part B (manual CSV, Playwright UI + API automation, execution reports, prompt history) is implemented in the same repository and referenced as evidence below.

---

| Field | Value |
|-------|--------|
| **Primary AI Tool(s) Used** | **Cursor** (Auto/Composer for planning, docs, and review; coding model for Playwright automation and hard debugging) |
| **Application Under Test** | Practice Software Testing — **Toolshop** (Checkout & Application Flow) |
| **UI** | https://practicesoftwaretesting.com/ |
| **API** | https://api.practicesoftwaretesting.com (OpenAPI: `/api/documentation`) |
| **Assessment Start Date** | 2026-07-30 |
| **Submission Date** | 2026-08-07 |
| **Public repository** | https://github.com/avi1712/qa_ai_automation_project |

---

## Checklist — expected submission points

| # | Topic | Section |
|---|--------|---------|
| 1 | What is the project all about | Project Summary |
| 2 | Primary AI tool(s) used | Header + Tools Used |
| 3 | How you provide project and SUT context | Setup Summary §1 |
| 4 | How you use AI for requirement analysis | Setup Summary §2 |
| 5 | How you use AI for test planning and strategy | Setup Summary §3 |
| 6 | How you use AI for manual test case design | Setup Summary §4 |
| 7 | How you use AI for automation design | Setup Summary §5 |
| 8 | How you validate and refine AI output | Setup Summary §6 |
| 9 | How you use AI for test data and API payloads | Setup Summary §7 |
| 10 | How you use AI for debugging failing tests | Setup Summary §8 |
| 11 | What information you avoid sharing with AI | Setup Summary §9 |
| 12 | How you would reuse this QA workflow | Setup Summary §10 |

---

## Project Summary

This assessment builds an **AI-assisted QA workflow** for the public Toolshop ecommerce application. The focus is **Core acceptance criteria** from the QA Practical Assessment brief: **AC1** (register → login → verify profile) and **AC2** (browse → multi-item cart with quantity update → **Cash on Delivery** checkout → invoice under **My Invoices**, with **Confirm pressed twice** on the UI).

Deliverables span the full lifecycle: requirement and risk analysis, manual test design (`FunctionalTestCase.csv`), Playwright **Prism-style** UI and API automation at the repository root, Allure execution evidence (`execution-report/`), and iterative prompt history (`ai-prompts/`). Suite size is capped at **5–8 cases per type** (manual, UI, API), each tagged `@Smoke` or `@Regression`. The goal is not volume of generated tests but **reviewable, SUT-verified** quality work.

---

## Tools Used

| Category | Tools |
|----------|--------|
| **AI** | Cursor IDE (rules, agent chat, Caveman skills under `.agents/skills/`) |
| **UI automation** | Playwright (`@playwright/test`), Chromium |
| **API automation** | Playwright `request` fixture (separate `api` project in `playwright.config.js`) |
| **Reporting** | Playwright HTML report, Allure (`allure-playwright`, `allure-commandline`) |
| **Browser / inspection** | Chrome, DevTools, live UI walkthrough |
| **API inspection** | Swagger / OpenAPI at live API documentation URL |
| **Supporting utilities** | Node.js, npm; custom fixtures, page objects, API helpers, `utils/payloadBuilder.js` |
| **Version control** | Git (local runs only — no CI pipeline in this repo) |

---

## Setup Summary

### 1. How you provide project and SUT context to the tool

Context is **structured and repeatable**, not a one-off paste of the full assessment PDF.

1. **Persistent rules** — `.cursor/rules/qa-toolshop.mdc` pins SUT URLs, AC scope, case cap, Confirm×2, COD payment, and “verify live before keeping AI output”.
2. **Living documents** — `@project-info.md`, `requirements-risk-analysis.md`, and prior `ai-prompts/*.md` are attached in new chats so the agent inherits decisions already made.
3. **Assessment brief** — Part A/Part B deliverables and Core ACs are extracted once from `QA Practical Assessment.pdf` and summarized (see `ai-prompts/requirements-and-planning.md`, Entry 1).
4. **One task per chat** — Each session targets a single phase (risk cut, CSV row, one page object, one debug failure). Outcomes are summarized back into markdown after the phase.
5. **Caveman prompting** — Terse, token-efficient prompts via Caveman skills (`use caveman` / `/caveman`) keep requests focused; technical terms and URLs stay exact.
6. **SUT snippets only** — Relevant OpenAPI fields or locator notes are pasted; not entire Swagger dumps or secrets.

**Reusable context block** (start of Part B chats):

```text
SUT UI: https://practicesoftwaretesting.com/
SUT API: https://api.practicesoftwaretesting.com
Core: AC1 auth/profile; AC2 COD + invoice (Confirm x2); API register→login→cart→invoice
Stack: Playwright Prism at repo root | Max 5–8 cases each | Tags: @Smoke @Regression
Rule: Verify every endpoint/locator against live SUT before keeping AI output.
```

---

### 2. How you use AI for requirement analysis

| AI contributes | Human QA owns |
|----------------|---------------|
| Decompose AC1/AC2 into actors, preconditions, success/failure paths | Confirm behavior on live UI and API |
| List ambiguities (profile labels, cart merge, Confirm controls, cart auth, invoice body) | Resolve via exploration before locking CSV/automation |
| Draft risk register with impact/likelihood | Rank P0–P2; cut Stretch scope |
| Map requirements → scenario IDs | Drop anything not observable on the SUT |

**Example prompt:** *From AC1/AC2 and double-Confirm invoice, list ambiguities and P0 risks. No test cases yet.*

**Evidence:** `requirements-risk-analysis.md` (AC tables, R1–R8 risks, traceability to TC-M / TC-UI / TC-API IDs); `ai-prompts/requirements-and-planning.md` (Entries 1–2).

Key risks captured: broken auth (R1), missing Bearer on API (R2), cart/qty integrity (R3), **single Confirm only → no invoice** (R4), invoice payload gaps (R5), flaky locators (R6), email collision (R7), scope creep (R8).

---

### 3. How you use AI for test planning and strategy (UI vs API, smoke vs regression)

AI proposes options; QA locks decisions against the brief and risk register.

| Dimension | Decision |
|-----------|----------|
| **UI vs API** | Both in Core — UI for checkout/invoice UX and Confirm×2; API for fast auth/cart/invoice contract checks |
| **Smoke** | Happy-path register/login/profile; COD checkout with Confirm×2; API register/login/token + cart create; API products → cart → COD invoice |
| **Regression** | Wrong password, invalid email, multi-item + qty update, empty billing fields, unauthorized/missing-token API calls, missing `cart_id`, product search |
| **Volume** | Hard cap **5–8** cases per tier (manual, UI, API) |
| **Out of Core** | Admin APIs, deep PDF-download matrix, non-COD payment methods (Stretch) |
| **Execution** | Local `npm test` / tagged scripts; static Allure in `execution-report/` for submission evidence |

**Example prompt:** *Propose smoke vs regression for UI and API. Max 8 each. State what is in/out of Core and link to risk IDs.*

**Evidence:** `requirements-risk-analysis.md` §3 traceability tables; `ai-prompts/test-design.md` (Entry 1).

**Implemented suite (Part B):** 6 manual + 6 UI + 6 API cases in `FunctionalTestCase.csv`, all `Passed` with automation refs aligned to `tests/ui/` and `tests/api/api.spec.js`.

---

### 4. How you use AI for manual test case design (functional, edge, negative, non-functional)

Manual design is **flow-scoped and typed**, never “generate all tests for the website”.

| Coverage type | Examples in Core suite |
|---------------|------------------------|
| **Functional / positive** | TC-M-01 register, login, profile; TC-M-03 COD checkout + invoice (Confirm×2) |
| **Negative** | TC-M-02 wrong password; TC-M-05 invalid email; TC-M-06 empty billing on checkout |
| **Edge** | TC-M-04 multi-item cart and quantity update |
| **Non-functional (light)** | Clear login error message; meaningful API status codes on auth/invoice failures |

Process: AI drafts scenario titles and steps → human walkthrough on live UI → edit steps to match real labels → write `FunctionalTestCase.csv` with MapsTo, Preconditions, Steps, Data, Expected/Actual, Status, AutomationRef.

**Example prompt:** *For AC1 login and AC2 checkout only, list functional, negative, edge, and light non-functional ideas. Cap at 8 manual cases.*

**Evidence:** `FunctionalTestCase.csv`; `ai-prompts/test-design.md` (Entries 2–4).

---

### 5. How you use AI for automation design (framework, structure, data, reusable utilities)

| Area | Choice |
|------|--------|
| **Framework** | Playwright (per assessment); **Prism-style** separation of UI pages, API helpers, fixtures, and specs |
| **Structure** | `tests/ui/`, `tests/api/`, `pages/`, `api/`, `fixtures/testFixtures.js`, `utils/`, `test-data/`, `playwright.config.js` at **repository root** |
| **Projects** | `chromium` (UI) and `api` (HTTP `baseURL` = API host); grep tags `@Smoke` / `@Regression` via npm scripts |
| **Page objects** | `LoginPage`, `RegisterPage`, `ProductPage`, `CartPage`, `CheckoutPage`, `ProfilePage` |
| **API helpers** | `authApi.js`, `cartApi.js`, `productsApi.js`, `invoiceApi.js` |
| **Fixtures** | Extended test with page objects + `uniqueUser` from `buildUniqueUser()` |
| **Data** | `utils/payloadBuilder.js` — unique email, register payload, COD invoice body |
| **Reporting** | Playwright HTML + Allure results → `reports/`; static submission copy → `execution-report/` |
| **Navigation** | `domcontentloaded` (not `networkidle`) — live SUT never settles networkidle reliably |

AI is asked for **one artifact at a time** (one page object, one API helper, one spec) after live verification — not an entire suite in a single prompt.

**Evidence:** repo tree; `ai-prompts/automation-and-debugging.md` (Entries 1, 4–5); `CheckoutPage.js` (explicit double Confirm).

---

### 6. How you validate and refine AI-generated test cases and scripts

Every AI output passes a **human gate** before merge:

1. **Traceability** — Maps to AC1/AC2 and a risk ID?
2. **Live SUT** — Locator or endpoint exists on https://practicesoftwaretesting.com/ or live API?
3. **Assertions** — Business outcome (profile email, invoice id, 201 + token), not only “page loaded”?
4. **Known quirks** — Confirm×2 modeled as two explicit actions with separate expects?
5. **Scope** — Still within 5–8 per type and correct `@Smoke` / `@Regression` tag?
6. **Execution** — Spec run locally and status recorded in CSV / Allure before claiming pass?
7. **Learning log** — Wrong AI suggestions recorded in `ai-prompts/automation-and-debugging.md`?

Blind copy-paste of generated steps or selectors is **not** acceptable. Example correction: AI suggested `networkidle` on `page.goto` and localhost `BASE_URL`; live debugging showed Toolshop needs `domcontentloaded` and the public demo URL (Entry 6).

---

### 7. How you use AI for test data generation, environment assumptions, and API payloads

| Need | Approach |
|------|----------|
| **Users** | `qa.test+{timestamp}@example.com` (or `qa.cursor+…`) — no real PII |
| **Password** | Strong demo pattern in fixtures only; never committed secrets |
| **Register payload** | AI drafts from brief; QA checks live API requires `address` object and field names |
| **COD invoice** | Start from assessment sample JSON; `payment_method: cash-on-delivery`, dynamic `cart_id` |
| **Negatives** | Missing `cart_id`, invalid Bearer — one clear assert per case |
| **Product/cart IDs** | Discovered via `GET /products` and `POST /carts` — not hardcoded stale IDs |
| **Environment** | Public demo UI + API only; no private staging; intermittent 500/timeouts → Playwright `retries: 2` |

**Sample COD invoice payload** (field names verified against live OpenAPI):

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<from create cart>",
  "payment_details": {}
}
```

**Evidence:** `ai-prompts/test-data.md`; `utils/payloadBuilder.js`; `test-data/billing.json` if present.

---

### 8. How you use AI for debugging failing tests and interpreting logs

**Protocol** (one failure per chat):

1. Paste **one** failure — Playwright message + short stack, or HTTP status + **redacted** response body.
2. Ask for **ranked hypotheses** (timing, wrong locator, skipped second Confirm, stale cart, expired token, wrong waitUntil).
3. Apply the **smallest fix**; re-run **only that spec** (`npx playwright test <path> --project=…`).
4. Reject “rewrite entire test” unless structure is fundamentally wrong.
5. Log whether AI helped or misled in `ai-prompts/automation-and-debugging.md`.
6. Keep Playwright trace, screenshot, and Allure attachments as evidence.

**Real examples logged:**

- **API suite** — register payload missing `address`; cart add path `POST /carts/{id}`; all 5 API tests green after live verification (Entry 5).
- **UI navigation** — `TimeoutError` on `networkidle`; fix = `domcontentloaded` in `BasePage.goto` (Entry 6).

Console logs in API specs (`console.log` per step) make Playwright HTML report readable for reviewers without opening trace files.

---

### 9. What information you avoid sharing unnecessarily with AI tools

Do **not** share:

- Production credentials, private API keys, OAuth secrets
- Full `.env` files — use placeholders (`<TOKEN>`, `<PASSWORD>`) in prompts
- Raw bearer tokens in chat or committed logs
- Real customer PII (names, emails, phones from production)
- Internal-only URLs, VPN endpoints, or proprietary client data unrelated to this public demo
- Entire OpenAPI dumps when only one endpoint body is needed

Toolshop is a **public demo**, but the same hygiene is practiced so habits transfer to real projects with sensitive data.

---

### 10. How you would reuse this QA workflow in a real project

| Phase | Action |
|-------|--------|
| **Kickoff** | Epic/AC → Cursor with rules file + context block → risk register + smoke cut |
| **Design** | Iterative typed prompts → reviewed manual suite → tagged automation backlog |
| **Build** | AI scaffolds POM/API clients; humans own locators, waits, and assertions after live check |
| **Evidence** | Prompt history in `ai-prompts/` for audit and onboarding |
| **Debug** | Failure-first, surgical fixes; log AI accuracy |
| **Govern** | Secret hygiene, model cost rules (planning model vs coding model), case caps per sprint |
| **Improve** | Cursor rules/skills (Caveman, summarize-to-md), reusable fixtures and payload builders |
| **Report** | Local or org CI → Allure/HTML; static report folder for release sign-off |

This turns AI from a shortcut into a **repeatable, reviewable** testing workflow that scales to larger products without uncontrolled test sprawl.

---

## Related artifacts (Part A + Part B evidence)

| Artifact | Purpose |
|----------|---------|
| `requirements-risk-analysis.md` | AC decomposition, risks R1–R8, traceability to TC IDs |
| `FunctionalTestCase.csv` | 6 manual + 6 UI + 6 API cases, Status = Passed |
| `ai-prompts/*.md` | Iterative prompt history (requirements, design, data, automation, docs) |
| `tests/ui/`, `tests/api/` | Playwright UI + API automation |
| `execution-report/` | Static Allure HTML submission evidence |
| `reports/playwright-report/` | Playwright HTML from last local run |
| `.cursor/rules/qa-toolshop.mdc` | Persistent SUT and workflow rules |
| `.agents/skills/caveman/` | Token-efficient prompting for Cursor sessions |
| `README.md` | Setup, run commands, Allure generation, Caveman usage |

---

*Part A complete — all assessment foundation points covered. Part B automation, CSV, reports, and prompt history delivered in this repository.*
