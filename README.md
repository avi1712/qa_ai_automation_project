# qa-ai-practical-assessment

AI-assisted QA mini project for Practice Software Testing (Toolshop).  
Playwright (Prism-style) UI + API automation lives at the **repository root**.

## Repository layout

```text
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── project-info.md
├── requirements-risk-analysis.md
├── README.md
├── ai-prompts/
├── package.json
├── playwright.config.js
├── pages/                    # UI Page Objects (POM)
├── api/                      # API helpers
├── tests/                    # UI + API specs
├── fixtures/
├── utils/
├── test-data/
├── reports/                  # Playwright + Allure working output
├── execution-report/         # Static Allure HTML (submission evidence)
└── .agents/skills/           # Caveman + related Cursor skills
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Use Caveman (Cursor AI)

This repo ships the [caveman](https://github.com/JuliusBrussee/caveman) skills under `.agents/skills/`. Caveman makes the agent reply in terse, token-efficient prose while keeping technical detail exact.

1. Open **Cursor** chat in this repository (project skills load from `.agents/skills/`).
2. Activate caveman — say **`use caveman`** in chat, or run **`/caveman`** (full mode, default).
3. Change intensity if needed:
   - `/caveman lite` — lighter compression
   - `/caveman ultra` — maximum compression
   - `/caveman wenyan-lite` / `/caveman wenyan-full` / `/caveman wenyan-ultra` — classical Chinese register
4. Turn off — say **`stop caveman`** or **`normal mode`**.
5. Quick reference — **`/caveman-help`**, or read `.agents/skills/caveman/README.md`.

Related skills (same folder): `caveman-commit` (commit messages), `caveman-review` (PR comments), `caveman-compress` (compress memory `.md` files), `caveman-stats` (session token usage).

## Run

```bash
npm run test:smoke        # @Smoke only
npm run test:regression   # @Regression only
npm run test:ui           # UI specs
npm run test:api          # API specs
npm test                  # all (UI + API)
npm run report            # open Playwright HTML report
```

## After running tests — generate Allure reports

`npm test` writes raw Allure results to `reports/allure-results/`.  
**After the tests finish**, generate the HTML reports:

```bash
# 1) Run tests (creates reports/allure-results)
npm test

# 2) Generate Allure HTML into reports/allure-report
npm run allure:generate

# 3) Generate static Allure into execution-report/ (submission folder)
npm run allure:execution-report

# Optional: generate both working + execution-report, then open working report
npm run allure:report
```

| Command | What it does |
|---------|----------------|
| `npm run allure:generate` | Builds Allure HTML → `reports/allure-report/` |
| `npm run allure:execution-report` | Builds static Allure → `execution-report/` (includes `index.html`) |
| `npm run allure:open` | Opens `reports/allure-report` in the browser |
| `npm run allure:open:execution` | Opens `execution-report` in the browser |
| `npm run allure:clean` | Clears Allure results/report folders |
| `npm run allure:report` | `allure:generate` + `allure:execution-report` + `allure:open` |

Typical flow:

```bash
npm test
npm run allure:generate
npm run allure:execution-report
```

Then open **`execution-report/index.html`** in a browser to view the execution report.

## Execution reports (committed evidence)

| Report | Path | How to generate |
|--------|------|-----------------|
| **Static Allure (submission)** | `execution-report/` | `npm run allure:execution-report` |
| Playwright HTML | `reports/playwright-report/` | produced by `npm test` |
| Allure results | `reports/allure-results/` | produced by `npm test` (**gitignored**) |
| Allure HTML (working) | `reports/allure-report/` | `npm run allure:generate` |

### View the execution report in a browser

Open the static Allure report file:

**`execution-report/index.html`**

Ways to open it:

1. **File Explorer** — go to the `execution-report` folder and double-click `index.html`
2. **From the IDE** — right-click `execution-report/index.html` → Open with Live Server / Open in Browser
3. **CLI (Allure server)** — `npm run allure:open:execution`
4. **Windows path example** — paste into the browser address bar:  
   `file:///D:/Assignment/qa-ai-practical-assessment/execution-report/index.html`  
   (adjust the drive/path to your clone)

This page shows pass/fail status, suites, and test details for the last generated run.

Only `reports/test-results/` and `reports/allure-results/` stay gitignored (raw run artifacts).

## Known SUT note

UI invoice generation: press **Confirm twice**.
