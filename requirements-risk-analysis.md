# Requirement & Risk Analysis — Toolshop (Part A foundation for Part B)

**SUT:** Practice Software Testing Toolshop  
**UI:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com  

---

## 1. Requirement understanding

### AC1 — User Registration & Login

| Item | Detail |
|------|--------|
| **Intent** | New user can register, log in with those credentials, and see correct profile data |
| **Actors** | Guest → Registered Customer |
| **UI path** | Register form → Sign in → Profile / account area |
| **API path** | `POST /users/register` → `POST /users/login` → authenticated profile/user read (as documented) |
| **Preconditions** | Unique email; valid password meeting app rules |
| **Main success** | Session/token established; profile fields match registration |
| **Failures of interest** | Duplicate email, invalid email format, wrong password, empty required fields |

### AC2 — End-to-End Purchase / Invoice

| Item | Detail |
|------|--------|
| **Intent (UI)** | Browse products, add **multiple** items, update quantity, checkout with **Cash on Delivery**, view invoice under **My Invoices** |
| **Intent (API)** | With bearer token: get products, add to cart, verify cart, generate invoice with billing + order details |
| **Critical quirk** | UI: press **Confirm twice** to generate invoice |
| **Payment** | `cash-on-delivery` (Core); other methods = Stretch |
| **Main success** | Invoice id/number available; cart converted to order |

### Ambiguities to resolve in Part B exploration

1. Exact profile page URL/labels after login.  
2. Whether guest cart merges after login.  
3. Exact UI control names for Confirm steps 1 and 2.  
4. Whether `POST /carts` requires auth in current API version.  
5. Invoice create endpoint path/body vs OpenAPI live version.

*Rule: resolve by live click-through / Swagger before finalizing automation.*

---

## 2. Risk analysis (P0 first)

| ID | Risk | Impact | Likelihood | Layer | Mitigation in Core suite |
|----|------|--------|------------|-------|---------------------------|
| R1 | Auth broken (register/login) | Blocks all purchase flows | Med | UI+API | Smoke: register+login happy path |
| R2 | Token not applied on protected calls | False pass / silent 401 | Med | API | Assert 401 without token; 2xx with Bearer |
| R3 | Cart contents wrong after qty update / multi-item | Wrong order total | Med | UI+API | Regression: multi-item + qty assert |
| R4 | Single Confirm only → no invoice | Lost order evidence | **High** (known quirk) | UI | Explicit double Confirm in E2E |
| R5 | Invoice payload validation gaps | Bad orders / 4xx unclear | Med | API | Negatives: missing `cart_id` / bad token |
| R6 | Flaky locators / timing | Unreliable CI | Med | UI | Role/text locators + Playwright expects |
| R7 | Test data collision (same email) | Intermittent failures | Med | Both | Timestamped emails |
| R8 | Scope explosion | Weak artifacts | Med | Process | Hard cap 5–8 cases/type |

---

## 3. Traceability — requirement → planned scenarios (budget)

Target: **5–8** scenarios each for Manual, UI automation, API automation.

### Manual / Functional (planned IDs)

| ID | Maps to | Tag | Type |
|----|---------|-----|------|
| TC-M-01 | AC1 | @Smoke | Positive register + login + profile |
| TC-M-02 | AC1 | @Regression | Negative login (wrong password) |
| TC-M-03 | AC2 | @Smoke | COD checkout + invoice (Confirm×2) |
| TC-M-04 | AC2 | @Regression | Multi-item cart + qty update |
| TC-M-05 | AC1/AC2 | @Regression | Register validation (invalid email) |
| TC-M-06 | AC2 | @Regression | Checkout required address fields |

### UI automation (planned)

| ID | Maps to | Tag | Notes |
|----|---------|-----|-------|
| TC-UI-01 | AC1 | @Smoke | Register → login → profile assert |
| TC-UI-02 | AC2 | @Smoke | Browse → cart → COD → Confirm×2 → invoice |
| TC-UI-03 | AC1 | @Regression | Invalid login error |
| TC-UI-04 | AC2 | @Regression | Multi-item + quantity change |
| TC-UI-05 | AC2 | @Regression | Invoice visible under My Invoices |
| TC-UI-06 | AC2 | @Regression | Optional: empty cart / blocked checkout |

### API automation (planned)

| ID | Maps to | Tag | Notes |
|----|---------|-----|-------|
| TC-API-01 | AC1 | @Smoke | Register + login → token present |
| TC-API-02 | AC2 | @Smoke | Create cart → add product → create invoice COD |
| TC-API-03 | AC1 | @Regression | Login failure / invalid credentials |
| TC-API-04 | AC2 | @Regression | Get products + verify cart contents |
| TC-API-05 | AC2 | @Regression | Invoice without/invalid token → 401 |
| TC-API-06 | AC2 | @Regression | Invoice missing `cart_id` → 4xx |

---

## 4. Smoke vs Regression strategy

| Suite | Goal | Include |
|-------|------|---------|
| **Smoke** | Fast confidence on critical path | TC-*-01 / TC-*-02 happy paths (auth + checkout/invoice) |
| **Regression** | Depth on known risks | Negatives, multi-item, Confirm/invoice, authz errors |

Commands (Part B README): `npm run test:smoke` / `npm run test:regression`.

---

## 5. AI usage on this artifact

- Cursor drafted the first risk and traceability tables from the participant guide ACs.  
- Human will adjust IDs/steps after live SUT validation in Part B.  
- Prompt evidence: `ai-prompts/requirements-and-planning.md`.
