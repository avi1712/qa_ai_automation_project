# PrismStructure — Playwright (Prism Framework) for Toolshop
  
UI: https://practicesoftwaretesting.com/
API: https://api.practicesoftwaretesting.com  

This folder is a **Prism-style** Playwright project: full framework layout (tests + pages + api + fixtures + utils + reports).  
**POM** lives only under `pages/` — it is one layer inside Prism, not the whole framework.

## Folder map

```text
PrismStructure/
├── package.json
├── playwright.config.js          # browsers, tags, reporters, baseURL
├── .env.example                  # no secrets committed
│
├── tests/                        # WHAT to verify (assertions live here)
│   ├── ui/
│   │   ├── smoke/
│   │   │   └── auth-checkout.smoke.spec.js
│   │   └── regression/
│   │       └── cart-invoice.regression.spec.js
│   └── api/
│       ├── smoke/
│       │   └── auth-cart-invoice.smoke.spec.js
│       └── regression/
│           └── negatives.regression.spec.js
│
├── pages/                        # UI Page Objects (POM layer)
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── ProfilePage.js            # account / invoices navigation
│
├── api/                          # API clients / helpers
│   ├── authApi.js
│   ├── productsApi.js
│   ├── cartApi.js
│   └── invoiceApi.js
│
├── fixtures/                     # Playwright fixtures
│   └── testFixtures.js
│
├── utils/                        # shared helpers
│   ├── dataFactory.js
│   └── payloadBuilder.js
│
├── test-data/                    # static/sample data
│   └── billing.json
│
└── reports/                      # execution evidence
    └── playwright-report/
```

## Setup

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

## Run

```bash
npm run test:smoke        # @Smoke only
npm run test:regression   # @Regression only
npm run test:ui           # UI specs
npm run test:api          # API specs
npm test                  # all
npm run report            # open HTML report
```

Reports: `reports/playwright-report/`

## Status

Specs are **scaffolded and skipped** (`test.skip`) until locators/OpenAPI are verified on the live SUT in Part B.  
Remove `test.skip(...)` after you confirm selectors and payloads.

## Known SUT note

UI invoice generation: press **Confirm twice** (`CheckoutPage.confirmTwice()`).
