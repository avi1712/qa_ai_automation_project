# qa-ai-practical-assessment

AI-assisted QA mini project for Practice Software Testing (Toolshop).  
Playwright (Prism-style) UI + API automation lives at the **repository root**.

> ## Reviewer evidence — start here
>
> **Primary execution report (submission evidence):** [`execution-report/index.html`](execution-report/index.html)
>
> Open this Playwright HTML report first to see pass/fail status, test cases, and console output for all UI + API runs.  
> **Easiest in Cursor / VS Code:** go to `execution-report/index.html` → **right-click** → **Open in Browser**.  
> **No server or npm required** — also works via double-click in File Explorer, drag into Chrome/Edge/Firefox, or **File → Open** in the browser.  
> Optional CLI: `npm run report`

## Project information

| Item | Detail |
|------|--------|
| **Framework** | [Playwright](https://playwright.dev/) (`@playwright/test` v1.54+) with **Prism-style** layout (page objects, API helpers, fixtures) |
| **Reporting** | Playwright HTML reporter (`execution-report/`) |
| **Language** | JavaScript (Node.js) |
| **Application under test** | Practice Software Testing — **Toolshop** |
| **UI URL** | https://practicesoftwaretesting.com/ |
| **API URL** | https://api.practicesoftwaretesting.com |
| **API docs** | https://api.practicesoftwaretesting.com/api/documentation |
| **Manual test cases** | `FunctionalTestCase.csv` (6 manual + 6 UI + 6 API rows) |
| **Execution evidence (reviewers)** | **[`execution-report/index.html`](execution-report/index.html)** — Playwright HTML report; open manually in any browser (no install/run needed) |
| **Workflow / AI context** | `project-info.md`, `requirements-risk-analysis.md`, `ai-prompts/` |

### Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** | LTS recommended (v18+ or v20+) |
| **npm** | Comes with Node.js |
| **Network** | Public demo SUT — no local app or VPN required |
| **Browser** | Chromium (installed via Playwright CLI below) |
| **Secrets / `.env`** | **Not required** — URLs default in `playwright.config.js`; users are generated at runtime |

Optional environment variables (only if you need to override defaults):

| Variable | Purpose | Default |
|----------|---------|---------|
| `BASE_URL` or `UI_BASE_URL` | UI test base URL | `https://practicesoftwaretesting.com` |

No API keys or bearer tokens are stored in the repo. API tests register a new user per run.

### Test data

| Location | Used for | Contents |
|----------|----------|----------|
| `test-data/user.json` | UI registration defaults | Name, address, phone, password pattern (`email` left empty — filled at runtime) |
| `test-data/billing.json` | UI checkout billing address | COD billing fields for checkout flow |
| `test-data/billing-api.json` | API COD invoice payload | Billing fields for `POST` invoice (no `cart_id` — added dynamically) |
| `utils/payloadBuilder.js` | API + fixtures | `buildUniqueUser()`, `toRegisterPayload()`, `buildCodInvoicePayload()` — timestamped `qa.api+{stamp}@example.com` |
| `fixtures/testFixtures.js` | UI specs | Injects page objects + `uniqueUser` per test |

**Manual tests:** step-level data is in the `TestData` column of `FunctionalTestCase.csv` (e.g. `qa.test+{timestamp}@example.com`). Replace `{timestamp}` when executing by hand.

### Automation layout

| Path | Purpose |
|------|---------|
| `tests/ui/` | UI specs (`@Smoke` / `@Regression` tags) |
| `tests/api/api.spec.js` | API specs (6 cases) |
| `pages/` | UI page objects (Login, Register, Cart, Checkout, etc.) |
| `api/` | API helpers (`authApi.js`, `cartApi.js`, …) |
| `fixtures/testFixtures.js` | Extended Playwright `test` with POM fixtures |
| `utils/` | Payload builders and shared helpers |
| `playwright.config.js` | Projects: **UI Tests** (Chromium) and **Api Tests** (HTTP) |

### Known SUT behaviour

- **Payment (Core):** Cash on Delivery (`cash-on-delivery`)
- **UI invoice:** press **Confirm twice** on the payment step

---

## Repository layout

```text
qa-ai-practical-assessment/
├── FunctionalTestCase.csv    # Manual + UI + API case definitions (CSV)
├── project-info.md           # Part A AI workflow foundation
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
├── test-data/                # Static JSON test data
├── reports/                  # Transient test artifacts (gitignored)
├── execution-report/         # Playwright HTML report (submission evidence)
└── .agents/skills/           # Caveman + related Cursor skills
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Run automation

All commands run from the **repository root**.

### Full suite

| Command | What runs |
|---------|-----------|
| `npm test` | All UI + API tests (headless UI) |
| `npm run test:headed` | All tests, UI in headed Chromium |
| `npm run report` | Open last Playwright HTML report |

### Smoke (`@Smoke`)

| Command | What runs |
|---------|-----------|
| `npm run test:smoke` | All `@Smoke` tests (UI + API) |
| `npx playwright test tests/ui --grep @Smoke` | UI smoke only |
| `npm run test:api:smoke` | API smoke only |

### Regression (`@Regression`)

| Command | What runs |
|---------|-----------|
| `npm run test:regression` | All `@Regression` tests (UI + API) |
| `npx playwright test tests/ui --grep @Regression` | UI regression only |
| `npm run test:api:regression` | API regression only |

### By layer

| Command | What runs |
|---------|-----------|
| `npm run test:ui` | All UI specs (headed Chromium) |
| `npm run test:api` | All API specs (`api.spec.js`, Api Tests project) |
| `npm run test:home` | `homePage.spec.js` only (headed) |
| `npm run codegen` | Playwright recorder against Toolshop UI |

### Direct Playwright examples

```bash
# Single spec
npx playwright test tests/ui/homePageTest/homePage.spec.js --project="UI Tests"

# API project only
npx playwright test --project="Api Tests"

# Headed UI smoke
npx playwright test tests/ui --grep @Smoke --headed --project="UI Tests"
```

### Run manual test cases

Manual cases are **not** executed by npm. Use `FunctionalTestCase.csv`:

1. Open https://practicesoftwaretesting.com/ in a browser.
2. Find rows with `Type=Manual` (TC-M-01 … TC-M-06).
3. Follow `TestSteps`; use `TestData` (unique email per run).
4. Record results in `ActualResult` / `Status` if you maintain the CSV locally.

UI and API rows in the same CSV map to automated specs via the `AutomationRef` column.

---

## Reports — where output is generated

**For reviewers:** the committed submission evidence is **`execution-report/index.html`**.

Running `npm test` (or any `playwright test` command) produces artifacts as follows:

| Report / artifact | Path | When created | Committed? |
|-------------------|------|--------------|------------|
| **Playwright HTML (submission evidence)** | **`execution-report/index.html`** | Every test run | **Yes — open this for review** |
| **Traces / screenshots / video** | `reports/test-results/` | On failure / retry (UI) | No (gitignored) |

### Reviewer evidence — `execution-report/index.html`

This is the **primary report for assessment review**. It is a Playwright HTML report committed in the repo — reviewers can open it **manually in a browser** without running tests or starting a local server.

| How to open | Action |
|-------------|--------|
| **IDE (recommended)** | In the repo tree, open `execution-report/index.html` → **right-click** → **Open in Browser** |
| **Manual (any browser)** | Double-click `execution-report/index.html`, drag the file into Chrome/Edge/Firefox, or use **File → Open** in the browser |
| **CLI (optional)** | `npm run report` |
| **Windows file URL** | Paste in browser address bar: `file:///D:/Assignment/qa-ai-practical-assessment/execution-report/index.html` (adjust path to your clone) |

After a fresh local run, regenerate before sharing:

```bash
npm test
```

The HTML reporter writes directly to `execution-report/` (configured in `playwright.config.js`).

| Command | What it does |
|---------|----------------|
| `npm test` | Runs all tests and refreshes `execution-report/` |
| `npm run report` | Opens `execution-report/index.html` in the browser |

---

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
