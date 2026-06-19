# Trip Budget Tracker v3 — Test Specification

**Project:** Trip Budget Tracker  
**Version:** 3.0  
**Date:** 2026-06-18  
**Author:** Senior QA Automation Architect  
**KPI Reference:** [trip_budget_tracker_kpi_v3.md](../../Agents-v3/trip_budget_tracker_kpi_v3.md)

---

## 1. Authentication — Register

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-API-AUTH-001 | Register | Valid email/password via API | 201; user created in SQLite | KPI-AUTH-REG-01 | [ ] |
| TC-API-AUTH-002 | Register | Duplicate email via API | 400; error message; no duplicate row | KPI-AUTH-REG-02 | [ ] |
| TC-API-AUTH-003 | Register | Password &lt; 8 chars via API | 400; validation error | KPI-AUTH-REG-04 | [ ] |
| TC-UI-AUTH-002 | Register | Password mismatch on UI | Inline error; submit blocked | KPI-AUTH-REG-03 | [ ] |
| TC-UI-AUTH-003 | Register | Weak password on UI | Inline error; submit blocked | KPI-AUTH-REG-04 | [ ] |

## 2. Authentication — Login

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-API-AUTH-004 | Login | Valid credentials via API | 200; JWT token returned | KPI-AUTH-LOG-01 | [ ] |
| TC-API-AUTH-005 | Login | Invalid credentials via API | 401; generic error message | KPI-AUTH-LOG-03 | [ ] |
| TC-UI-AUTH-004 | Login | Invalid credentials on UI | "Invalid email or password" shown | KPI-AUTH-LOG-03 | [ ] |
| TC-UI-AUTH-005 | Login | New user with zero trips | Empty state with create trip CTA | KPI-AUTH-LOG-05 | [ ] |

## 3. Authentication — Forgot Password

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-API-AUTH-006 | Forgot Password | Known vs unknown email via API | Identical success message | KPI-AUTH-FP-02 | [ ] |
| TC-UI-AUTH-007 | Forgot Password | Submit email on UI | Same success message displayed | KPI-AUTH-FP-02 | [ ] |

## 4. Session Management

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-UI-AUTH-001 | Auth Guard | Navigate to /dashboard unauthenticated | Redirect to /login | KPI-SES-01 | [ ] |
| TC-UI-AUTH-006 | Logout | Click Logout | Redirect to login; session cleared | KPI-SES-03 | [ ] |
| TC-API-AUTH-007 | Authorization | GET /trips without token | 401 Unauthorized | KPI-EXP-10 | [ ] |

## 5. Data Persistence — SQLite

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-API-TRIP-001 | Trip Create | POST /trips with auth | Trip row with user_id | KPI-TRM-05 | [ ] |
| TC-API-TRIP-002 | Trip Durability | Logout/login via API | Trip name & currency match | KPI-DB-01 | [ ] |
| TC-UI-DB-001 | Trip Durability | Logout/login via UI | Trip visible after re-login | KPI-DB-01 | [ ] |
| TC-UI-DB-002 | Expense Durability | Add expense; logout/login | Expense & balances match | KPI-DB-02, KPI-BAL-05 | [ ] |
| TC-UI-DB-003 | localStorage | After authenticated session | Token only; no trip_budget_tracker_state | KPI-DB-09 | [ ] |

## 6. Trip & Member Management (v2 Regression)

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-UI-TRM-001 | Create Trip | Missing title | Validation error | KPI-TRM-03 | [ ] |
| TC-UI-TRM-002 | Create Trip | EUR base currency | Trip created; currency shown | KPI-TRM-04 | [ ] |
| TC-API-TRIP-004 | Add Member | POST member | Member persisted in SQLite | KPI-TRM-06 | [ ] |
| TC-API-TRIP-003 | Isolation | User B accesses User A trip | 403 Forbidden | KPI-SEC-02 | [ ] |

## 7. Expense Entry (v2 Regression)

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-UI-EXP-001 | Add Expense | Valid expense with category | Success toast; expense in log | KPI-EXP-03, KPI-EXP-09 | [ ] |
| TC-UI-EXP-002 | Receipt Upload | Invalid then valid format | Format error; then photo attached | KPI-EXP-05, KPI-EXP-06 | [ ] |

## 8. Currency Engine (v2 Regression)

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-UI-FX-001 | FX Conversion | 100 EUR expense on USD trip | USD 117.65 displayed | KPI-FX-02 | [ ] |
| TC-UI-FX-002 | FX Offline | API mocked unavailable | Error banner shown | KPI-FX-04 | [ ] |

## 9. Settlement & Analytics (v2 Regression)

| Test ID | Feature | Scenario | Expected Outcome | KPI | Status |
| --- | --- | --- | --- | --- | --- |
| TC-UI-BAL-001 | Balances | 2-person split | +USD 50 / -USD 50 shown | KPI-BAL-03, KPI-BAL-04 | [ ] |
| TC-UI-SET-001 | Deep Links | UPI/PayPal on settle-up | Links visible per debt | KPI-SET-03, KPI-SET-05 | [ ] |
| TC-UI-ANA-001 | Pie Chart | Food + Transport expenses | Category totals visible | KPI-ANA-01 | [ ] |
| TC-UI-PDF-001 | PDF Export | Zero expenses | Export button disabled | KPI-PDF-03 | [ ] |

---

## Test Assets

| Path | Purpose |
| --- | --- |
| `tests/test-data/auth-data.ts` | Mock users, passwords, trip fixtures |
| `tests/mocks/fx-mock.ts` | Mock FX API (`/api/v1/fx/rates/*`) |
| `tests/utils/auth-helpers.ts` | Register/login helpers for UI & API |
| `tests/api-tests/*.spec.ts` | API automation (Playwright request) |
| `tests/ui-tests/*.spec.ts` | UI automation (Playwright) |

## Execution

```bash
cd trip-budget-tracker
npm install
cd server && npm install && cd ..
npx playwright test
```

Playwright starts backend (`:3001`) with isolated test DB and frontend (`:5176`) automatically.

---
