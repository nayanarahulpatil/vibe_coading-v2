### STEP – MODULE CHANGE ANALYSIS

**Project Name:** Trip Budget Tracker
**Version:** 3.0
**Date:** 2026-06-18
**Author:** Senior Product Manager

---

**Module Change Classification (v2 → v3):**

| Module | Status | Change Summary |
| --- | --- | --- |
| Authentication — Register | New | Account creation page; email/password validation; user record in SQLite |
| Authentication — Login | New | Credential validation; session issuance; trip load from SQLite on success |
| Authentication — Forgot Password | New | Reset request, time-limited token, new password submission, token invalidation |
| Session Management | New | Auth tokens, route guards, logout, session expiry, API authorization by `user_id` |
| Data Persistence Layer (SQLite) | New | Backend API + SQLite as source of truth; replaces `localStorage` for trip data |
| Create Trip & Add Members | Modified | Trips persisted to SQLite with `user_id` owner; loaded on login — regression KPIs required |
| Add Expense | Modified | Expenses (incl. v2 fields) persisted via API to SQLite; receipt path in DB — regression KPIs required |
| Currency Engine | Modified | FX rate cache stored in SQLite instead of `localStorage` — regression KPIs required |
| Running Balance | Modified | Reads expense data from SQLite-backed API — regression KPIs required |
| Settle-Up Summary | Modified | Reads balance data from SQLite-backed API — regression KPIs required |
| Analytics / Pie Chart | Modified | Reads expense/category data from SQLite-backed API — regression KPIs required |
| PDF Export | Modified | Reads trip data from SQLite-backed API — regression KPIs required |
| localStorage Sync (v2) | Deprecated | No longer authoritative; auth token only — no new KPIs; covered by persistence module |

**PRD Reference:** [trip_budget_tracker_prd_v3.md](./trip_budget_tracker_prd_v3.md)
**Prior KPI Reference:** [trip_budget_tracker_kpi_v2.md](../Agents-v2/trip_budget_tracker_kpi_v2.md) — all v2 KPIs reproduced unchanged below as **Existing KPI**.

---

## Module: Authentication — Register (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-AUTH-REG-01 | Authentication — Register | Registration Success Rate | Measures successful account creation for valid registration submissions. | ≥ 95% of valid registration attempts succeed on first attempt without system error. |
| KPI-AUTH-REG-02 | Authentication — Register | Duplicate Email Rejection | Verifies that registration is blocked when the email already exists in SQLite. | 100% of duplicate-email registration attempts are rejected with inline error and no duplicate user record created. |
| KPI-AUTH-REG-03 | Authentication — Register | Password Confirmation Validation | Ensures mismatched password and confirm-password fields block submission. | 100% of password-mismatch submissions are rejected with inline error on confirm-password field. |
| KPI-AUTH-REG-04 | Authentication — Register | Password Strength Enforcement | Validates minimum password rules (e.g. ≥ 8 characters) before account creation. | 100% of submissions below minimum strength are rejected with visible password requirements. |
| KPI-AUTH-REG-05 | Authentication — Register | Password Hash Storage on Register | Ensures new user passwords are stored as hashes only in SQLite. | 0 plain-text passwords in `users` table or server logs during registration QA and security audit. |

---

## Module: Authentication — Login (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-AUTH-LOG-01 | Authentication — Login | Login Success Rate | Measures successful authentication for registered users with valid credentials. | ≥ 98% of valid credential submissions result in an authenticated session. |
| KPI-AUTH-LOG-02 | Authentication — Login | Login Latency | Measures time from credential submit to session issued (excluding cold network start). | Credential validation and session issuance complete in < 1 second under standard test conditions. |
| KPI-AUTH-LOG-03 | Authentication — Login | Invalid Credentials Error Handling | Ensures failed logins return a generic error without revealing whether email or password failed. | 100% of invalid login attempts show generic "Invalid email or password" message; 0 sessions issued. |
| KPI-AUTH-LOG-04 | Authentication — Login | Trip Load on Successful Login | Confirms user's trips are retrieved from SQLite immediately after successful login. | 100% of users with ≥ 1 trip see their trip list loaded within 2 seconds of successful login. |
| KPI-AUTH-LOG-05 | Authentication — Login | Empty Trip State on Login | Validates correct empty-state UX when authenticated user has zero trips. | 100% of users with 0 trips see empty state with CTA to create first trip after login. |

---

## Module: Authentication — Forgot Password (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-AUTH-FP-01 | Authentication — Forgot Password | Reset Request Processing | Measures successful initiation of password reset for registered emails. | 100% of reset requests for registered emails create a `password_reset_tokens` row and trigger reset delivery mechanism. |
| KPI-AUTH-FP-02 | Authentication — Forgot Password | Email Enumeration Prevention | Ensures unknown emails receive the same success response as known emails. | 100% of reset requests (known and unknown email) display identical success messaging; 0 email-existence leaks in response text. |
| KPI-AUTH-FP-03 | Authentication — Forgot Password | Reset Token Expiry Enforcement | Validates expired reset tokens are rejected. | 100% of reset attempts using tokens past `expires_at` are blocked with "Reset link expired or invalid" error. |
| KPI-AUTH-FP-04 | Authentication — Forgot Password | Reset Token Single-Use Invalidation | Ensures used reset tokens cannot be reused. | 100% of second attempts with the same used token are rejected; `used_at` is set after successful reset. |
| KPI-AUTH-FP-05 | Authentication — Forgot Password | Password Reset Completion Rate | Measures proportion of initiated resets completed within token TTL. | ≥ 90% of initiated resets completed successfully within token TTL in UAT scenarios. |
| KPI-AUTH-FP-06 | Authentication — Forgot Password | Reset Request Rate Limiting | Validates rate limiting on reset requests per email to prevent abuse. | 100% of excess reset requests beyond configured limit are throttled without revealing email existence. |

---

## Module: Session Management (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-SES-01 | Session Management | Auth Route Guard Enforcement | Verifies unauthenticated users cannot access protected trip/expense routes. | 100% of direct navigation attempts to dashboard URLs without valid session redirect to Login. |
| KPI-SES-02 | Session Management | Session Expiry Mid-Use Handling | Measures correct behaviour when session expires during active use. | 100% of expired-session API calls redirect user to Login with informative message; no silent data corruption. |
| KPI-SES-03 | Session Management | Logout Session Invalidation | Confirms logout destroys client session and invalidates server-side token/session record. | 100% of logout actions invalidate session; subsequent API calls with old token return 401 until re-login. |
| KPI-SES-04 | Session Management | Concurrent Tab Logout Sync | Validates all browser tabs detect logout or session invalidation. | 100% of secondary tabs redirect to Login on next API interaction after logout in primary tab. |
| KPI-SES-05 | Session Management | API Authorization by User Scope | Ensures trip/expense endpoints return only data owned by authenticated `user_id`. | 100% of cross-user trip/expense access attempts return 403/404; 0 data leaks in authorization audit. |
| KPI-SES-06 | Session Management | Session Token Client Security | Validates tokens are not stored in plain text in logs or exposed in insecure client storage patterns. | 0 session tokens or password hashes in client-accessible logs; HTTP-only cookie or secure bearer pattern per architecture sign-off. |

---

## Module: Data Persistence Layer — SQLite (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-DB-01 | Data Persistence Layer — SQLite | Trip Data Durability Across Sessions | Measures trip data retrievability after logout and re-login. | 100% of committed trips retrievable with identical name and base currency after logout → login cycle. |
| KPI-DB-02 | Data Persistence Layer — SQLite | Expense Data Durability Across Sessions | Measures expense and balance data retrievability after logout and re-login. | 100% of committed expenses (incl. v2 fields) and derived balances match pre-logout state after re-login. |
| KPI-DB-03 | Data Persistence Layer — SQLite | API Persist Latency — Expense Create | Measures round-trip time for a single expense create mutation to SQLite. | Expense create API completes in < 500 ms on standard connection in ≥ 95% of test runs. |
| KPI-DB-04 | Data Persistence Layer — SQLite | SQLite Write Failure Handling | Validates client state is not updated optimistically when server write fails. | 100% of simulated SQLite write failures return error to client; 0 phantom expenses in UI without DB commit. |
| KPI-DB-05 | Data Persistence Layer — SQLite | API Unavailability Handling | Measures UX when backend API is unreachable during mutation. | 100% of mutation attempts during API outage show retry/error banner; 0 silent data loss claims in UI. |
| KPI-DB-06 | Data Persistence Layer — SQLite | FX Cache SQLite Persistence | Confirms FX rate cache rows are stored in and read from SQLite `fx_rate_cache` table. | 100% of cache hits after server restart served from SQLite; 0 reliance on `localStorage` as primary FX cache store. |
| KPI-DB-07 | Data Persistence Layer — SQLite | Receipt Metadata SQLite Persistence | Validates receipt `receipt_photo_path` is stored in SQLite and linked to correct expense. | 100% of uploaded receipts have correct DB path reference retrievable after re-login. |
| KPI-DB-08 | Data Persistence Layer — SQLite | SQLite File Access Restriction | Ensures the SQLite database file is not directly web-accessible. | 0 successful unauthenticated HTTP requests returning raw `.sqlite` file during security audit. |
| KPI-DB-09 | Data Persistence Layer — SQLite | localStorage Deprecation Compliance | Confirms trip/expense state is not written to `trip_budget_tracker_state` as source of truth. | 0 instances of full trip state persisted to `localStorage` after v3 cutover; auth token key only permitted. |

---

## Module: Create Trip & Add Members

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-TRM-01 | Create Trip & Add Members | Trip Creation Success Rate | Measures the successful initialization of a new trip without system errors. | 100% success rate for valid trip creation attempts. |
| KPI-TRM-02 | Create Trip & Add Members | Member Validation Enforcement | Verifies that the system correctly processes valid member additions and rejects duplicates. | 0 defects in member addition functionality during QA testing. |
| KPI-SEC-01 | Create Trip & Add Members | Data Isolation | Ensures trip data and member lists are strictly isolated to authorized participants. | 100% of unauthorized data access attempts are blocked. |
| KPI-TRM-03 | Create Trip & Add Members | Base Currency Selection Enforcement | Verifies that a valid ISO 4217 base currency is required and stored on trip creation. | 100% of trip creation attempts without a base currency are rejected with a validation error. |
| KPI-TRM-04 | Create Trip & Add Members | Base Currency Persistence | Confirms the selected base currency is correctly persisted and propagated to all subsequent expense and balance calculations. | 0 discrepancies between stored base currency and currency used in balance calculations across all test scenarios. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-TRM-05 | Create Trip & Add Members | Trip SQLite Persist on Create | **[v3 — Regression]** Verifies new trips are written to SQLite with correct `user_id` owner on create. | 100% of authenticated trip creates produce a `trips` row linked to the session `user_id`. |
| KPI-TRM-06 | Create Trip & Add Members | Member SQLite Persist on Add | **[v3 — Regression]** Verifies members are persisted to SQLite `members` table linked to parent trip. | 100% of valid member additions create correct `members` rows retrievable via API after page refresh. |
| KPI-SEC-02 | Create Trip & Add Members | Authenticated User Trip Isolation | **[v3 — New]** Ensures trips are scoped to owning user; other users cannot read or mutate foreign trips. | 100% of cross-`user_id` trip access attempts blocked; extends KPI-SEC-01 for authenticated multi-user context. |

---

## Module: Add Expense

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-EXP-01 | Add Expense | Expense Entry Completion | Tracks the successful recording of an expense containing payer, amount, and description. | 100% of valid expense entries are successfully stored in the database. |
| KPI-EXP-02 | Add Expense | Input Validation | Ensures negative amounts, zero amounts, or missing required fields are rejected. | 100% of invalid expense submissions trigger correct validation error messages. |
| KPI-OP-01 | Add Expense | Concurrent Write Handling | Measures the system's ability to maintain data consistency when multiple users add expenses simultaneously. | 0 instances of data loss or conflicts during concurrent expense additions. |
| KPI-EXP-03 | Add Expense | Category Tag Enforcement | Verifies that a category is required for every expense and stored correctly. | 100% of expense submissions without a category are rejected; 100% of valid category values are stored accurately. |
| KPI-EXP-04 | Add Expense | Currency Picker Availability | Validates that the currency picker lists only supported ISO 4217 currencies sourced from the FX provider. | 100% of displayed currencies match the FX provider's supported currency list; 0 unsupported currencies selectable. |
| KPI-EXP-05 | Add Expense | Receipt Photo Upload — Format Validation | Ensures only JPEG, PNG, and HEIC files are accepted; all other formats are rejected. | 100% of invalid format uploads are blocked with an inline error; 100% of valid formats are accepted. |
| KPI-EXP-06 | Add Expense | Receipt Photo Upload — Size Validation | Ensures files exceeding 10MB are rejected with an inline error. | 100% of files > 10MB are blocked; 100% of files ≤ 10MB within valid format are accepted. |
| KPI-EXP-07 | Add Expense | Receipt Photo Secure Storage | Validates that uploaded receipt photos are stored in scoped/private storage with no publicly accessible direct URLs. | 0 receipt photos accessible via unauthenticated public URL during security audit. |
| KPI-EXP-08 | Add Expense | Receipt Thumbnail Display | Confirms that a thumbnail of the attached receipt is visible on the expense detail view after upload. | 100% of successfully uploaded receipts render a thumbnail on the expense detail view within 3 seconds. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-EXP-09 | Add Expense | Expense SQLite Persist on Create | **[v3 — Regression]** Verifies expense records (incl. v2 fields) are committed to SQLite `expenses` table via API. | 100% of valid expense submissions produce retrievable SQLite rows with correct `trip_id` and field values. |
| KPI-EXP-10 | Add Expense | Expense Persist Requires Authentication | **[v3 — New]** Ensures unauthenticated expense create requests are rejected at API layer. | 100% of expense create API calls without valid session return 401; 0 expenses created without auth. |
| KPI-EXP-11 | Add Expense | Receipt Access Requires Trip Ownership | **[v3 — New]** Validates receipt download/serve endpoints require authenticated owner of parent trip. | 100% of unauthenticated or cross-user receipt access attempts blocked during security audit. |

---

## Module: Currency Engine

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-FX-01 | Currency Engine | Live FX Rate Fetch Latency | Measures the time taken to retrieve a live FX rate from the external API. | FX rate fetched and available in < 2 seconds on a standard mobile connection. |
| KPI-FX-02 | Currency Engine | FX Conversion Accuracy | Validates that converted amounts match the fetched live mid-market rate within tolerance. | Converted amounts within ±0.01% of the live mid-market rate for all tested currency pairs. |
| KPI-FX-03 | Currency Engine | FX Cache Hit Rate | Measures the proportion of FX lookups served from cache to reduce API call volume. | ≥ 80% of FX lookups served from cache during normal usage within cache TTL window. |
| KPI-FX-04 | Currency Engine | FX API Unavailability Fallback | Verifies that the system degrades gracefully when the FX API is unreachable. | When FX API is unreachable: cached rate is used with a visible timestamp warning; expense save is blocked if cache age > 24 hours. |
| KPI-FX-05 | Currency Engine | Stale Rate Indicator Display | Confirms that expenses converted using a cached (not live) rate display a "Rate from [date]" indicator in the UI. | 100% of expenses using a cached FX rate display the rate date indicator on both the expense detail and balance screens. |
| KPI-FX-06 | Currency Engine | FX API Key Security | Ensures the FX provider API key is never exposed to the client-side application. | 0 instances of API key present in client-side source, network responses, or browser storage during security audit. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-FX-07 | Currency Engine | FX Cache Survives Server Restart | **[v3 — Regression]** Validates cached FX rates in SQLite are available after backend restart without re-fetch. | 100% of in-TTL cache entries readable from SQLite after server restart; KPI-FX-04 fallback behaviour unchanged. |

---

## Module: Running Balance

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-BAL-01 | Running Balance | Balance Calculation Accuracy | Validates that running balances mathematically match the sum of all submitted expenses for each member. | 100% calculation accuracy in a 3-person trip scenario with multiple expenses. |
| KPI-BAL-02 | Running Balance | Calculation Latency | Measures the time taken to update all member balances after an expense is added. | Balances update and reflect in the system within < 500ms of an expense entry. |
| KPI-AUD-01 | Running Balance | Rounding Consistency | Ensures proper handling of indivisible amounts (e.g., $10 split 3 ways) to prevent fractional cent loss. | 0 discrepancies found in rounding logic over comprehensive automated testing. |
| KPI-BAL-03 | Running Balance | Multi-Currency Balance Accuracy | Validates that balances correctly aggregate amounts from multiple currencies after FX conversion to base currency. | 100% calculation accuracy in a mixed-currency trip scenario (≥ 3 currencies, ≥ 5 expenses) verified against manually computed expected values. |
| KPI-BAL-04 | Running Balance | Base Currency Display Consistency | Confirms all balance values on the balance screen are displayed in the trip's base currency regardless of the original expense currency. | 0 instances of non-base-currency amounts displayed on the Running Balance screen across all tested scenarios. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-BAL-05 | Running Balance | Balance Accuracy After SQLite Round-Trip | **[v3 — Regression]** Validates balances computed from SQLite-loaded expenses match pre-logout in-app balances. | 0 balance discrepancies after logout → login → trip reload in all v2 mixed-currency test scenarios. |

---

## Module: Settle-Up Summary

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-SET-01 | Settle-Up Summary | Settlement Algorithm Accuracy | Verifies the generated settle-up summary provides the most efficient debt resolution paths (who owes whom). | 100% accurate debt resolution summaries generated based on running balances. |
| KPI-SET-02 | Settle-Up Summary | UI Rendering and Visibility | Measures the correct and consistent display of the settle-up summary to all trip members. | Settle-up summary correctly rendered on all supported views without data truncation. |
| KPI-SET-03 | Settle-Up Summary | UPI Deep-Link Generation Accuracy | Validates that the UPI deep-link is correctly constructed with the payee VPA and debt amount for each debt row. | 100% of generated UPI deep-links contain the correct payee and amount; 0 mismatches across all test debt scenarios. |
| KPI-SET-04 | Settle-Up Summary | UPI App Launch Success | Measures successful launch of the UPI payment app via deep-link on supported devices. | UPI app opens pre-filled within 3 seconds on ≥ 95% of tested supported devices; fallback browser URL activates when app is not installed. |
| KPI-SET-05 | Settle-Up Summary | PayPal Deep-Link Generation Accuracy | Validates that the PayPal deep-link is correctly constructed with the payee and debt amount for each debt row. | 100% of generated PayPal deep-links contain the correct payee and amount; 0 mismatches across all test debt scenarios. |
| KPI-SET-06 | Settle-Up Summary | PayPal App Launch Success | Measures successful launch of the PayPal app or browser fallback via deep-link on supported devices. | PayPal app or PayPal.me browser URL opens within 3 seconds on ≥ 95% of tested supported devices. |
| KPI-SET-07 | Settle-Up Summary | Deep-Link Parameter Isolation | Ensures deep-link parameters (amount, payee) are read-only and cannot be intercepted or modified within the app. | 0 instances of deep-link parameter tampering possible via app-layer interception during security audit. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-SET-08 | Settle-Up Summary | Settlement Data Consistency Post SQLite Reload | **[v3 — Regression]** Confirms settle-up debts match after trip data is reloaded from SQLite post re-login. | 100% debt-row parity between pre-logout and post-login settle-up summary for identical trip state. |

---

## Module: Analytics / Pie Chart

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-ANA-01 | Analytics / Pie Chart | Category Aggregation Accuracy | Validates that the total spend per category on the pie chart matches the sum of all base-currency expense amounts for that category. | 100% accuracy between pie chart segment values and manually computed category totals across all test scenarios. |
| KPI-ANA-02 | Analytics / Pie Chart | Pie Chart Render Completeness | Confirms all defined categories with at least one expense are represented as segments in the pie chart. | 0 missing segments for categories with ≥ 1 expense; 0 phantom segments for categories with 0 expenses. |
| KPI-ANA-03 | Analytics / Pie Chart | Single-Category Edge Case Rendering | Validates that a pie chart with a single category renders correctly as a full circle with label. | 100% correct rendering (full circle + category label + amount) when only 1 category has expenses. |
| KPI-ANA-04 | Analytics / Pie Chart | Chart Render Latency | Measures time to render the pie chart after the analytics screen is opened. | Pie chart visible and interactive within < 1.5 seconds for trips with up to 100 expenses. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-ANA-05 | Analytics / Pie Chart | Chart Data Consistency Post SQLite Reload | **[v3 — Regression]** Validates pie chart segment values after trip reload from SQLite match pre-logout values. | 0 category total discrepancies between pre-logout and post-login analytics view for identical trip state. |

---

## Module: PDF Export

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-PDF-01 | PDF Export | Export Content Completeness | Validates that the generated PDF contains all required sections: trip name, dates, member list, all expenses (with category and base-currency amount), and final settle-up balances. | 100% of required content sections present in the generated PDF across all test scenarios. |
| KPI-PDF-02 | PDF Export | Export Generation Time | Measures the time from tapping "Export PDF" to the PDF being available for download. | PDF generated and available for download within < 5 seconds for trips with up to 100 expenses. |
| KPI-PDF-03 | PDF Export | Export Disabled State — Zero Expenses | Verifies that the Export PDF button is disabled and shows the correct tooltip when a trip has 0 expenses. | 100% of trips with 0 expenses render the Export PDF button in a disabled state with tooltip "Add at least one expense to export". |
| KPI-PDF-04 | PDF Export | Amount Accuracy in PDF | Validates that all expense amounts and balance figures in the PDF match the in-app displayed values in the base currency. | 0 discrepancies between PDF amounts and in-app amounts across all tested export scenarios. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-PDF-05 | PDF Export | Export Data Consistency Post SQLite Reload | **[v3 — Regression]** Confirms PDF amounts match in-app values when trip data is loaded from SQLite after re-login. | 0 discrepancies between PDF export and in-app display after logout → login → export for identical trip state. |
| KPI-PDF-06 | PDF Export | Export Requires Authentication | **[v3 — New]** Ensures PDF export API/route is inaccessible without valid session. | 100% of unauthenticated export attempts blocked; 0 PDFs generated for foreign-user trip IDs. |

---

# Development Timeline

| Sprint | Focus Area | Deliverables |
| --- | --- | --- |
| Sprint 1 | Core Data Models & Trip Setup *(v1 — unchanged)* | Trip creation logic, member addition, basic data isolation rules. |
| Sprint 2 | Expense Recording & Validation *(v1 — unchanged)* | Add expense module, input validation, concurrent write handling. |
| Sprint 3 | Balances & Settlement Logic *(v1 — unchanged)* | Running balance engine, rounding consistency, settle-up algorithm, UAT sign-off. |
| Sprint 4 | Currency Engine & Modified Expense Entry *(v2)* | Base currency field on trip, currency picker on expense, live FX fetch, cache layer, stale-rate indicator, FX security controls. |
| Sprint 5 | Receipt Attachment & Storage *(v2)* | Photo upload (format + size validation), secure storage, thumbnail display. |
| Sprint 6 | Settlement Deep-Links *(v2)* | UPI and PayPal deep-link generation, app-launch validation, browser fallback, parameter security audit. |
| Sprint 7 | Analytics & PDF Export *(v2)* | Category pie chart, category aggregation, PDF generation, export content validation, disabled-state handling. |
| Sprint 8 | Regression, Integration & UAT *(v2)* | Full regression across v1 modules, end-to-end multi-currency trip scenario, UAT sign-off. |
| Sprint 9 | Backend Foundation & SQLite Schema *(v3)* | SQLite schema (`users`, `trips`, `members`, `expenses`, `fx_rate_cache`, `sessions`, `password_reset_tokens`); migration tooling; DB access restriction. |
| Sprint 10 | Authentication — Register & Login *(v3)* | Register/Login UI, password hashing, session issuance, auth route guards (KPI-AUTH-REG-*, KPI-AUTH-LOG-*, KPI-SES-01). |
| Sprint 11 | Forgot Password & Session Hardening *(v3)* | Reset token flow, rate limiting, logout, session expiry, concurrent tab handling (KPI-AUTH-FP-*, KPI-SES-02–06). |
| Sprint 12 | API Persistence & Trip/Expense Migration *(v3)* | CRUD APIs for trips/members/expenses; replace `localStorage` source of truth; durability KPIs (KPI-DB-*, KPI-TRM-05/06, KPI-EXP-09–11). |
| Sprint 13 | v2 Feature SQLite Integration & Regression *(v3)* | FX cache in SQLite, receipt paths, balance/settle/chart/PDF reload regression (KPI-FX-07, KPI-BAL-05, KPI-SET-08, KPI-ANA-05, KPI-PDF-05/06). |
| Sprint 14 | Security Audit & End-to-End UAT *(v3)* | Cross-user isolation audit, auth security sign-off, full v1/v2/v3 regression, UAT sign-off. |

---

# Success Criteria

| Category | Success Metric | Target |
| --- | --- | --- |
| Accuracy (v1) | Calculation Errors | 0 calculation errors reported during QA and UAT phases. |
| Reliability (v1) | Concurrent Processing | 100% data consistency maintained during simultaneous expense entry testing. |
| Usability (v1) | Scenario Completion | System successfully handles the baseline 3-person, 3-expense test scenario with accurate output. |
| Accuracy (v2) | Multi-Currency Balance | 100% balance accuracy in mixed-currency (≥ 3 currencies) trip scenario. |
| Accuracy (v2) | FX Conversion Precision | Converted amounts within ±0.01% of live mid-market rate for all tested currency pairs. |
| Performance (v2) | FX Rate Fetch | Live FX rate fetched within < 2 seconds on standard mobile connection. |
| Performance (v2) | PDF Export | Trip summary PDF generated within < 5 seconds for trips with up to 100 expenses. |
| Reliability (v2) | FX Offline Degradation | System blocks expense save and displays cached rate warning when FX API is unreachable and cache > 24 hours old. |
| Security (v2) | Receipt Storage | 0 receipt photos accessible via unauthenticated public URL. |
| Security (v2) | FX API Key | 0 instances of API key exposed in client-side code, network responses, or browser storage. |
| Security (v2) | Deep-Link Integrity | 0 instances of deep-link parameter tampering possible at the app layer. |
| Usability (v2) | Settlement Deep-Link Launch | UPI/PayPal app opens within 3 seconds on ≥ 95% of supported test devices. |
| Usability (v2) | Analytics Render | Pie chart visible and interactive within < 1.5 seconds for trips with up to 100 expenses. |
| Usability (v3) | Registration Success | ≥ 95% of valid registration attempts succeed on first attempt. |
| Performance (v3) | Login Latency | Session issued within < 1 second after valid credential submit (excl. cold start). |
| Reliability (v3) | Data Durability | 100% of committed trip/expense mutations retrievable after logout and re-login. |
| Reliability (v3) | Password Reset Completion | ≥ 90% of initiated resets completed within token TTL. |
| Performance (v3) | API Persist Latency | Single expense create completes in < 500 ms on standard connection (≥ 95% of runs). |
| Security (v3) | Password & Token Storage | 0 plain-text passwords in SQLite or server logs; 0 cross-user data leaks in auth audit. |
| Security (v3) | Auth Route Protection | 100% of unauthenticated dashboard access attempts redirect to Login. |
| Regression (v3) | v2 Feature Parity on SQLite | All v2 Success Criteria rows above pass when data is loaded from SQLite-backed API. |

---
