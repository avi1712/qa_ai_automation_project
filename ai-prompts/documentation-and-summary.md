# AI Prompts – Documentation and Summary

Prompts used for writing README, reports, `project-info.md`, risk analysis, and organizing prompt-history artifacts.

For each entry:

- **Prompt:**
- **AI Response Summary:**
- **Edits You Made:**
- **Reason for Edits** (clarity, correctness, tone)

**Related outputs:** `README.md`, `project-info.md`, `requirements-risk-analysis.md`, `ai-prompts/*.md`, `execution-report/`, `.cursor/rules/qa-toolshop.mdc`.

---

## Entry 1 — Draft Part A `project-info.md`

**Prompt:**  
Write `project-info.md` for Part A covering all foundation topics for Toolshop + Cursor + Playwright Prism. Practical workflow, not generic AI hype.

**AI Response Summary:**  
Draft with AC summary, primary tools, context block, requirement analysis, test strategy, manual/automation design, validation gate, test data, debugging protocol, data hygiene, workflow reuse, and related artifacts table.

**Edits You Made:**  
Restructured to match assessment **Expected Submission** template (Project Summary, Tools Used, Setup Summary §1–§10). Added checklist mapping all 11 brief points. Set submission date 2026-08-06. Linked Part B evidence (CSV, specs, `execution-report/`). Removed reference to missing `project-info.xlsx`.

**Reason for Edits:**  
**Clarity** for evaluators scanning against rubric. **Correctness** — Part B is delivered in same repo, not “future work”. **Tone** — professional, judgment-focused, not marketing.

---

## Entry 2 — Risk & traceability companion doc

**Prompt:**  
Create `requirements-risk-analysis.md` with requirement understanding, P0 risks, and traceability to planned TC IDs for manual/UI/API.

**AI Response Summary:**  
AC1/AC2 decomposition tables, ambiguities list, risk register R1–R8, traceability tables for TC-M / TC-UI / TC-API, smoke vs regression strategy §4.

**Edits You Made:**  
Limited scope to Core ACs only. Marked ambiguities “resolve live in Part B”. Adjusted final UI IDs (TC-UI-03…06 filters/search) after spec implementation. Added npm command reference in §4.

**Reason for Edits:**  
**Correctness** — traceability must match real suite, not draft-only IDs. **Tone** — honest about unresolved SUT questions before live runs.

---

## Entry 3 — README: project information and how to run

**Prompt:**  
Update `README.md` per assessment: what framework, how to run, where test data lives, smoke/regression commands, where final reports are generated. Include anything missing for manual + automation execution.

**AI Response Summary:**  
Added **Project information** section: framework table, SUT URLs, prerequisites, test data map, automation layout, smoke/regression command tables, manual CSV instructions, report paths (Playwright HTML, Allure working, `execution-report/`), Allure generate flow.

**Edits You Made:**  
Replaced thin “Run” section with full command tables (full suite, smoke, regression, by layer, direct `npx playwright` examples). Documented `test:api:smoke` / `test:api:regression`. Added gitignored vs committed report folders. Swapped `.github/workflows/` in tree for `.agents/skills/`.

**Reason for Edits:**  
**Clarity** — reviewer can run suite without asking author. **Correctness** — project names `UI Tests` / `Api Tests`, test data paths match repo. **Tone** — operational, not narrative.

---

## Entry 4 — README: Caveman (Cursor AI) usage

**Prompt:**  
Add steps to use Caveman skills in README for token-efficient Cursor prompting.

**AI Response Summary:**  
Section on `.agents/skills/caveman/`: activate with `use caveman` or `/caveman`, intensity levels, stop commands, `/caveman-help`, sibling skills list.

**Edits You Made:**  
Placed after Setup; linked GitHub caveman repo. Kept commands verbatim. Did not duplicate full skill docs.

**Reason for Edits:**  
**Clarity** — shows thoughtful AI tooling beyond test generation. **Tone** — concise instructions, matches assessment AI workflow story.

---

## Entry 5 — Remove GitHub Actions from repo and docs

**Prompt:**  
Remove GitHub Actions — do not run tests on every push; keep simple local-only repo.

**AI Response Summary:**  
Delete `.github/workflows/playwright.yml` and `.github/` folder. Update README layout and note local-only execution.

**Edits You Made:**  
Removed workflow file. Updated `automation-and-debugging.md` Entry 13 and `project-info.md` Tools table (“local runs only”). README no longer lists CI workflow.

**Reason for Edits:**  
**Correctness** — docs must not reference deleted CI. **Clarity** — avoids reviewer expecting Actions tab results.

---

## Entry 6 — Organize `ai-prompts/` per assessment template

**Prompt:**  
Organize all `ai-prompts` files per assessment template with consistent entry format and phase coverage.

**AI Response Summary:**  
Structured five files: requirements-and-planning, test-design, test-data, automation-and-debugging, documentation-and-summary. Each entry: Prompt, summary, validation/outcome/edits fields per file type.

**Edits You Made:**  
Expanded requirements-and-planning (9 entries), test-design (11 entries), automation-and-debugging (13 entries + failure template). Updated test-data and this file. Cross-linked related artifacts at top of each file.

**Reason for Edits:**  
**Clarity** — evaluators see iterative prompting, not one-shot dump. **Correctness** — entries reflect actual repo state post-Part B. **Tone** — evidence-style, short Caveman-friendly summaries.

---

## Entry 7 — `requirements-and-planning.md` template alignment

**Prompt:**  
Check `ai-prompts/requirements-and-planning.md` against brief; add missing planning prompts (flow, risks, test plan, live verify).

**AI Response Summary:**  
Reheadered to brief text. Split flow vs risks vs traceability entries. Added Core vs Stretch, smoke strategy, live OpenAPI verification entry, summary artifact table.

**Edits You Made:**  
Renamed “AI Response Summary” → “AI Response (short summary)” per that file’s template. Kept Validation Notes as human review gate.

**Reason for Edits:**  
**Clarity** — matches assessment wording. **Correctness** — planning evidence complete before test-design file.

---

## Entry 8 — `test-design.md` template alignment

**Prompt:**  
Check `ai-prompts/test-design.md` — coverage matrix, UI/API scenario design, CSV alignment, validation notes.

**AI Response Summary:**  
11 entries: coverage types, smoke/regression design, manual steps, each UI/API spec group, CSV structure, test data linkage, guardrails, final coverage gate. Summary table of 18 cases.

**Edits You Made:**  
Added per-spec entries (TC-UI-01…06, TC-API-01…06). Validation Notes document grep tags, `npm test`, CSV cross-check.

**Reason for Edits:**  
**Correctness** — design doc matches `FunctionalTestCase.csv` and spec files. **Clarity** — separates design from automation/debug files.

---

## Entry 9 — `automation-and-debugging.md` template alignment

**Prompt:**  
Check `ai-prompts/automation-and-debugging.md` — structure, failures, Debugging Outcome field.

**AI Response Summary:**  
16 entries (through 2026-08-07): Prism layout, Confirm×2 (full hard-click + invoice), debug protocol, config, API live verify, networkidle fix, billing proceed-3, assertions, Allure, POM, fixtures, local-only, invoice 422 diagnosis, postcode stub + profile race, TC-UI-01 profile. Summary health table + failure template.

**Edits You Made:**  
Replaced Validation Notes with **Debugging Outcome**. Updated Entry 2 — Confirm×2 no longer partial; Entries 14–16 document invoice 422 / postcode stub / profile assert. Removed outdated “Confirm #2 gap” claim.

**Reason for Edits:**  
**Correctness** — prompt history matches shipping code. **Tone** — credits network logging for finding 422 vs click myth.

---

## Entry 10 — Execution reports documentation

**Prompt:**  
Document where final reports are generated and how reviewers open submission evidence.

**AI Response Summary:**  
README tables: Playwright HTML → `reports/playwright-report/`; Allure raw → `reports/allure-results/` (gitignored); working Allure → `reports/allure-report/`; submission static Allure → `execution-report/index.html`. Flow: `npm test` → `allure:generate` → `allure:execution-report`.

**Edits You Made:**  
Top callout + project-info row: primary evidence = `execution-report/index.html`. How to open: IDE **right-click → Open in Browser**, File Explorer double-click, optional `npm run allure:open:execution`. Clarified no server/npm required for reviewers.

**Reason for Edits:**  
**Clarity** — Part B requires execution evidence; path must be obvious for assessors. **Correctness** — static Allure is committed for review without re-running tests.

---

## Entry 11 — `.cursor/rules` persistent context

**Prompt:**  
Add persistent Cursor rules so every session knows SUT, caps, and verification rule without re-pasting PDF.

**AI Response Summary:**  
`.cursor/rules/qa-toolshop.mdc`: UI/API URLs, Playwright Prism, 5–8 cap, Confirm×2, COD, verify live, one task per chat, summarize to `ai-prompts/`, no secrets, model usage hint.

**Edits You Made:**  
`alwaysApply: true`. Mirrors context block in `project-info.md`. No duplicate of full README.

**Reason for Edits:**  
**Correctness** — rules match live workflow. **Tone** — imperative rules, not prose. Supports **clarity** across all doc-writing chats.

---

## Entry 12 — `FunctionalTestCase.csv` as documentation cross-reference

**Prompt:**  
Ensure documentation references manual CSV columns and links to automation for traceability.

**AI Response Summary:**  
README lists CSV as manual test source + 6+6+6 rows. `project-info.md` and test-design entries document columns (MapsTo, Steps, AutomationRef, Status). CSV Status=Passed aligned to spec runs.

**Edits You Made:**  
README manual run instructions (Type=Manual rows, `{timestamp}` in TestData). No duplicate CSV content inside markdown.

**Reason for Edits:**  
**Clarity** — single source of truth stays CSV. **Correctness** — AutomationRef paths match `tests/ui/` and `tests/api/api.spec.js`.

---

## Summary — documentation artifacts

| Document | Role | Last major update |
|----------|------|-------------------|
| `README.md` | Runbook: framework, data, commands, reports, Caveman | Reviewer evidence callout + Open in Browser |
| `project-info.md` | Part A AI workflow foundation (assessment rubric) | Start 2026-08-03 / Submit 2026-08-07 |
| `requirements-risk-analysis.md` | AC, risks, traceability | Core scope + live-verify notes |
| `ai-prompts/*.md` | Prompt history evidence | Confirm×2 + profile + billing/postcode updates 2026-08-07 |
| `execution-report/` | Static Allure submission HTML | Regenerate after full suite before final push |
| `.cursor/rules/qa-toolshop.mdc` | Persistent AI context | SUT + cap + hygiene rules |

_Documentation phase supports submission review without requiring author walkthrough._
