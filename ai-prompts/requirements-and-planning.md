# AI Prompts – Requirements and Planning

Iterative prompts for Toolshop Part A. Each entry: Prompt → AI Response Summary → Validation Notes.

---

## Entry 1 — Extract Part A requirements from assessment PDF

**Prompt:**  
Read `QA Practical Assessment.pdf` and complete Part A: AI Workflow Foundation (QA). List exact deliverables.

**AI Response Summary:**  
Part A = `project-info.md` covering project purpose, AI tools, context-setting, requirement analysis, strategy, manual design, automation design, validation of AI output, test data, debugging, data avoidance, and workflow reuse. Part B is separate (manual CSV, Playwright Prism UI+API, reports, prompt history).

**Validation Notes:**  
Matched PDF “Expected Submission” and template. Created repo folder `qa-ai-practical-assessment/`. Did not start full automation in Part A.

---

## Entry 2 — Practical SUT + AC decomposition

**Prompt:**  
From AC1/AC2, Toolshop URLs, and “Confirm twice for invoice”, produce ambiguities, P0 risks, and a smoke/regression cut. Max 5–8 scenarios per tier later. No full test steps yet.

**AI Response Summary:**  
Ambiguities: profile labels, cart merge, Confirm control names, cart auth rules, invoice API body vs live OpenAPI. Risks: auth, token handling, cart integrity, double Confirm, payload validation, flake, data collision, scope creep. Proposed smoke = happy auth + checkout/invoice; regression = negatives/edges.

**Validation Notes:**  
Accepted into `requirements-risk-analysis.md`. Marked items to verify live in Part B before locking CSV/automation. Kept known quirk (Confirm×2) as P0 mitigation.

---

## Entry 3 — Context-setting pattern for Cursor

**Prompt:**  
Define a short reusable context block so every new chat knows SUT, stack, caps, and validation rule without pasting the whole PDF.

**AI Response Summary:**  
Provided a Caveman-style block: UI/API URLs, Core ACs, Playwright Prism, 5–8 case cap, `@Smoke`/`@Regression`, “verify endpoint/locator live before keeping AI output”.

**Validation Notes:**  
Copied into `project-info.md` §3. Will paste/adapt at the start of Part B chats.

---

## Entry 4 — Token / model strategy for the assessment

**Prompt:**  
How should Cursor models be used to stay within monthly limits for this QA assessment?

**AI Response Summary:**  
Auto/Composer for requirements, CSV, README, ai-prompts; coding model only for page objects, API helpers, hard debug. One task per chat; summarize to `ai-prompts/*.md` after each phase.

**Validation Notes:**  
Adopted as project rule in `project-info.md`. Part A docs written with planning-focused prompting; automation reserved for Part B.
