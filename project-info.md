# project-info.md — Part A: AI Workflow Foundation (QA)

> **Excel twin (requested):** [`project-info.xlsx`](./project-info.xlsx) — same coverage, spreadsheet format.  
> **Objective:** Show practical, thoughtful AI use in the testing workflow — **not** a “generate some test cases” shortcut.

| Field | Value |
|-------|--------|
| Primary AI Tool(s) | **Cursor** (Auto/Composer for planning & docs; coding model for Playwright Prism) |
| Application Under Test | Practice Software Testing — Toolshop |
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com/api/documentation |
| Assessment Start Date | 2026-07-30 |
| Submission Date | TBD |

---

## Checklist — all expected points covered

| # (brief) | Topic | Covered |
|-----------|--------|---------|
| 1 | What is project all about | Yes — §1 |
| 2 | Primary AI tool(s) used | Yes — §2 |
| 2 (second) | How you provide project and SUT context | Yes — §3 |
| 3 | How you use AI for requirement analysis | Yes — §4 |
| 4 | How you use AI for test planning and strategy | Yes — §5 |
| 5 | How you use AI for manual test case design | Yes — §6 |
| 6 | How you use AI for automation design | Yes — §7 |
| 7 | How you validate and refine AI-generated tests/scripts | Yes — §8 |
| 8 | How you use AI for test data, env assumptions, API payloads | Yes — §9 |
| 9 | How you use AI for debugging failing tests / logs | Yes — §10 |
| 10 | What information you avoid sharing with AI tools | Yes — §11 |
| 11 | How you would reuse this QA workflow in a real project | Yes — §12 |

---

## 1. What is project all about

This assessment builds an **AI-assisted QA workflow** for the Toolshop ecommerce app (UI + API). It covers the testing lifecycle: requirement understanding, risk analysis, test planning, manual design, Playwright automation, test data, debugging, and documentation.

**Core flows:**

- **AC1:** Register → Login → verify profile (UI + API)  
- **AC2 UI:** Browse → multi-item cart (qty update) → COD checkout → My Invoices (**Confirm twice**)  
- **AC2 API:** Register/Login → bearer token → products → cart → invoice with billing payload  

**Constraint:** 5–8 cases per type (manual / UI / API), tagged `@Smoke` / `@Regression`.

What matters is **how AI is used thoughtfully** — analysis, strategy, review, debug — not dumping unreviewed generated cases.

---

## 2. Primary AI tool(s) used

| Tool | Role |
|------|------|
| **Cursor** | Primary AI IDE/agent for analysis, design, Prism/Playwright scaffolding, debugging, docs |
| **Model strategy** | ~70% Auto/Composer for planning & writing; coding model only for automation + hard debug |
| Browser DevTools / Swagger | Ground truth for selectors and API contracts |

Cursor is the system of record; prompt history lives in `ai-prompts/`.

---

## 3. How you provide project and SUT context to the tool

1. Reference the assessment brief / AC extract (not vague “test the shop”).  
2. Pin URLs every chat: UI + API documentation.  
3. `@` living artifacts (`project-info`, risk analysis, prior `ai-prompts`).  
4. **Caveman prompts** — one task per chat; summarize into markdown after.  
5. Paste only relevant OpenAPI/payload snippets — not entire swagger or secrets.

**Reusable context block:**

```text
SUT: Toolshop UI https://practicesoftwaretesting.com/
API: https://api.practicesoftwaretesting.com
Core: AC1 auth/profile; AC2 COD + invoice (Confirm x2); API register→login→cart→invoice
Stack: Playwright Prism | Max 5–8 cases each | Tags: @Smoke @Regression
Rule: Verify every endpoint/locator against live SUT before keeping AI output.
```

---

## 4. How you use AI for requirement analysis

| AI does | QA does |
|---------|---------|
| Decompose AC1/AC2 into actors, preconditions, paths | Confirm on live UI/API |
| List ambiguities | Resolve via exploration |
| Draft risk register | Rank P0–P2; cut Stretch |
| Req → scenario traceability | Keep only real SUT behavior |

**Example prompt:** *From AC1/AC2 and double-Confirm, list ambiguities and P0 risks. No test cases yet.*  
**Evidence:** `requirements-risk-analysis.md`, `ai-prompts/requirements-and-planning.md`.

---

## 5. How you use AI for test planning and strategy (UI vs API, smoke vs regression)

AI proposes; QA locks decisions:

| Dimension | Decision |
|-----------|----------|
| UI vs API | Both Core — UI for checkout/invoice UX; API for auth/cart/invoice speed |
| Smoke | Happy-path auth + COD checkout/invoice (or API token + cart + invoice) |
| Regression | Negatives, multi-item/qty, Confirm×2, unauthorized/missing `cart_id` |
| Volume | Cap **5–8** per tier |
| Out of Core | Admin APIs, deep PDF-download matrix |

**Example prompt:** *Propose smoke vs regression for UI and API. Max 8 each. Include why in/out.*

---

## 6. How you use AI for manual test case design (functional, edge, negative, non-functional)

Ask AI **by coverage type and by flow** (never “generate all site tests”):

- **Functional/positive** — register/login/profile; COD + invoice  
- **Negative** — wrong password; invalid email; empty required fields  
- **Edge** — multi-item cart; quantity update  
- **Non-functional (light)** — clear error messages; meaningful API status codes  

Review → remove duplicates → add Confirm×2 → write `FunctionalTestCase.csv`.  
Evidence: `ai-prompts/test-design.md`.

---

## 7. How you use AI for automation design (framework, structure, data, reusable utilities)

- **Framework choice:** Playwright (assignment) with **Prism-style** structure for UI + API.  
- **Structure:** `tests/ui`, `tests/api`, `pages/`, `api/`, `fixtures/`, `utils/`, `playwright.config.js`.  
- **Data:** unique email fixture; billing payload builder.  
- **Reusable utilities:** auth helper, tagged Smoke/Regression projects (`test:smoke` / `test:regression`).  

Ask for **one page object or helper at a time** — not the entire suite in one prompt.

---

## 8. How you validate and refine AI-generated test cases and scripts

1. Maps to AC/risk?  
2. Locator/endpoint exists on live SUT?  
3. Asserts business outcome (invoice/token), not only “page loaded”?  
4. Flake control; Confirm×2 as two explicit actions?  
5. Still ≤ 8 per type?  
6. Executed locally before claiming pass?  
7. Record what AI got wrong in `ai-prompts/automation-and-debugging.md`.

Blind copy-paste of AI output is not acceptable.

---

## 9. How you use AI for test data generation, environment assumptions, and API payloads

| Need | Approach |
|------|----------|
| Users | `qa.cursor+<timestamp>@example.com` — no real PII |
| Invoice payload | Start from brief sample; AI variants; QA checks OpenAPI field names |
| Negatives | Missing `cart_id`, bad Bearer — one clear assert each |
| Environment | Public demo only; discover `product_id`/`cart_id` dynamically; no secrets in repo |

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

Evidence: `ai-prompts/test-data.md`.

---

## 10. How you use AI for debugging failing tests and interpreting logs

1. Paste **one** failure (message + stack snippet / HTTP status + **redacted** body).  
2. Ask for **ranked hypotheses** (timing, locator, skipped Confirm, stale cart, expired token).  
3. Apply **smallest fix**; re-run **only that spec**.  
4. Reject “rewrite whole test” unless structure is wrong.  
5. Log helped vs misled in `ai-prompts/automation-and-debugging.md`.  
6. Keep Playwright HTML report / screenshots / trace as evidence.

---

## 11. What information you avoid sharing unnecessarily with AI tools

Do **not** share:

- Production credentials, private API keys, real customer PII  
- Full `.env` with secrets (use `<TOKEN>`, `<PASSWORD>`)  
- Internal-only URLs / VPN details  
- Proprietary client data unrelated to this public demo  

Demo Toolshop is public; the same hygiene applies so the habit transfers to real projects.

---

## 12. How you would reuse this QA workflow in a real project

1. **Kickoff** — epic/AC → Cursor → risk + smoke cut  
2. **Design** — iterative prompts → reviewed manual suite → tagged automation backlog  
3. **Build** — AI scaffolds Prism/POM/API clients; humans own locators & assertions  
4. **Evidence** — keep prompt history for reviewability  
5. **Debug** — failure-first, surgical fixes  
6. **Govern** — secret hygiene + model cost rules  
7. **Improve** — Cursor rules/skills (Caveman prompting, summarize-to-md)

This turns AI from a shortcut into a **repeatable, reviewable** testing workflow.

---

## Related artifacts

| Artifact | Purpose |
|----------|---------|
| `project-info.xlsx` | **Excel submission** — all points + checklist + strategy sheets |
| `requirements-risk-analysis.md` | Risks + traceability |
| `ai-prompts/*.md` | Prompt history evidence |
| `.cursor/rules/qa-toolshop.mdc` | Persistent SUT/workflow rules |

*Part A complete — all brief points covered in both Excel and Markdown.*
