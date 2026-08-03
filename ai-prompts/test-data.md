# AI Prompts – Test Data

---

## Entry 1 — Unique user strategy

**Prompt:**  
Suggest safe registration data for repeated Toolshop UI/API runs without colliding emails or using real PII.

**AI Response Summary:**  
Use `qa.cursor+<timestamp>@example.com` (or faker), fixed strong demo password pattern stored only in fixtures/env example, fake but schema-valid name/phone/address fields.

**Validation Notes:**  
Adopted in `project-info.md` §9 and risk R7 mitigation. Will implement generators in Part B fixtures — no secrets committed.

---

## Entry 2 — COD invoice payload

**Prompt:**  
Using the assessment sample invoice JSON, list required fields and 2 negative variants for API tests.

**AI Response Summary:**  
Required: billing_* fields, `payment_method: cash-on-delivery`, `cart_id`, `payment_details: {}`. Negatives: omit `cart_id`; invalid/missing Bearer token; optionally invalid postal format if API validates it.

**Validation Notes:**  
Aligned with brief sample body. Field names must be re-checked against live OpenAPI in Part B before coding. Positive payload kept as template in `project-info.md`.

---

## Entry 3 — Environment assumptions

**Prompt:**  
What environment assumptions should we document for Toolshop?

**AI Response Summary:**  
Public demo UI+API; no private staging; Cloudflare may affect headless access sometimes; data resets possible; do not rely on a single seeded product id without GET /products first.

**Validation Notes:**  
Documented for Part B README. Automation will discover `product_id` / `cart_id` dynamically rather than hardcoding stale IDs.
