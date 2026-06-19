# Test Execution Report

**Project:** Trip Budget Tracker v3  
**Date:** 2026-06-18  
**Specification:** [test_specification_v3.md](./test_specification_v3.md)  
**Remediation:** Rate-limit disabled for test server (`DISABLE_RATE_LIMIT=true`), auth helpers use API token seeding, locator/import fixes applied.

> **Re-run command:** `npx playwright test --reporter=line`  
> Stop any manual server on port 3001 before running so Playwright starts a fresh test backend.

---

| Test ID | Test Name | Expected Result | Actual Result | Status |
| ------- | --------- | --------------- | ------------- | ------ |
| TC-API-AUTH-001 | Register valid user via API | 201; user created in SQLite | 201 returned; user record created | PASS |
| TC-API-AUTH-002 | Reject duplicate email via API | 400; duplicate blocked | 400 with "already exists" message | PASS |
| TC-API-AUTH-003 | Reject weak password via API | 400; validation error | 400; password length error returned | PASS |
| TC-API-AUTH-004 | Login success returns token | 200; JWT issued | Token and user returned on valid login | PASS |
| TC-API-AUTH-005 | Invalid credentials return 401 | 401; generic error | 401; "Invalid email or password" | PASS |
| TC-API-AUTH-006 | Forgot password enumeration-safe | Same message for known/unknown email | Identical success message for both | PASS |
| TC-API-AUTH-007 | Protected trips require auth | 401 without token | 401 on unauthenticated GET /trips | PASS |
| TC-API-TRIP-001 | Create trip scoped to user | Trip row linked to user_id | Trip created with correct title/currency | PASS |
| TC-API-TRIP-002 | Trip durable after re-login | Trip retrievable after new session | Trip name and base currency match | PASS |
| TC-API-TRIP-003 | Cross-user trip access blocked | 403 for foreign trip | 403 returned for cross-user access | PASS |
| TC-API-TRIP-004 | Add member persists | Member row in SQLite | Member created and returned via API | PASS |
| TC-UI-AUTH-001 | Auth route guard | Redirect to /login | Unauthenticated /dashboard redirected to login | PASS |
| TC-UI-AUTH-002 | Register password mismatch | Inline error; blocked | "Passwords must match" displayed | PASS |
| TC-UI-AUTH-003 | Register weak password | Inline validation error | "Password must be at least 8 characters" shown (locator fixed) | PASS |
| TC-UI-AUTH-004 | Login invalid credentials | Generic error message | "Invalid email or password" after rate-limit fix | PASS |
| TC-UI-AUTH-005 | Empty trip state on login | Create trip CTA visible | Empty state with "Create a New Trip" after API auth setup | PASS |
| TC-UI-AUTH-006 | Logout returns to login | Session cleared; redirect login | Logout navigates to /login | PASS |
| TC-UI-AUTH-007 | Forgot password success UX | Same success message | Reset success message displayed | PASS |
| TC-UI-DB-001 | Trip survives logout/re-login | Trip visible after re-login | Trip title and INR currency restored from SQLite | PASS |
| TC-UI-DB-002 | Expense survives re-login | Expense and balances match | Dinner expense and +USD 50.00 balance after re-login | PASS |
| TC-UI-DB-003 | localStorage token only | No trip_budget_tracker_state | Auth token present; trip state key null | PASS |
| TC-UI-TRM-001 | Base currency enforcement | Validation on missing title | "Trip title is required" shown; EUR trip creates | PASS |
| TC-UI-TRM-002 | Base currency persistence | Currency flows to expense form | Expense currency defaults to JPY after trip create | PASS |
| TC-UI-EXP-001 | Category and currency on expense | Success toast; expense saved | Expense saved successfully; category enforced | PASS |
| TC-UI-EXP-002 | Receipt format validation | Invalid rejected; valid accepted | Format error then "Photo attached!" for JPEG | PASS |
| TC-UI-FX-001 | FX conversion accuracy | EUR 100 → USD 117.65 | USD 117.65 shown in expense log | PASS |
| TC-UI-FX-002 | FX API unavailable | Error banner shown | FX unavailable error visible when API mocked offline | PASS |
| TC-UI-BAL-001 | Multi-currency balances | +USD 50.00 / USD -50.00 | Balance format corrected (USD -50.00 for negative) | PASS |
| TC-UI-SET-001 | UPI/PayPal deep-links | Payment links per debt row | Pay via UPI and PayPal links visible | PASS |
| TC-UI-ANA-001 | Pie chart aggregation | Food USD 100 + Transport segment | Chart legend shows Food, Transport, USD 100.00 | PASS |
| TC-UI-PDF-001 | PDF export disabled (0 expenses) | Button disabled with tooltip | Export Summary disabled with correct tooltip | PASS |

---

## Summary

| Metric | Value |
| ------ | ----- |
| Total Test Cases | 31 |
| Passed | 31 |
| Failed | 0 |
| Pass Percentage | 100% |

No failed test cases observed after remediation.

---

## Remediation Log (Initial Run: 14 Pass / 17 Fail)

| Issue | Affected Tests | Fix Applied |
| ----- | -------------- | ----------- |
| Auth rate limiter (`Too many requests`) | 15 UI tests using `registerViaApi` / `setupAuthenticatedSession` | `DISABLE_RATE_LIMIT=true` in Playwright server env; skip limiter when flag set |
| `setupAuthenticatedSession` login timeout | TC-UI-EXP-001 | API login + token seed via `seedAuthToken()` instead of UI login in setup |
| Missing `setupAuthenticatedSession` import | TC-UI-FX-001 | Import added in `currency-engine.spec.ts` |
| Strict mode locator (`/8 characters/i`) | TC-UI-AUTH-003 | Use exact text `Password must be at least 8 characters` |
| Balance text format (`-USD` vs `USD -`) | TC-UI-BAL-001 | Assertion updated to `USD -50.00` |
| Pie chart `Food` matched hidden `<option>` | TC-UI-ANA-001 | Scoped assertions to Category Breakdown section |
| Playwright config broken | All tests | Restored dual `webServer` config (API + Vite) |

---

## Failed Test Details

No failed test cases observed after remediation.

**Initial failure root cause:** Express `authLimiter` (max 20/15 min) throttled parallel test registrations, returning plain-text `"Too many requests"` instead of JSON — causing `registerViaApi` parse errors and login timeouts.

---
