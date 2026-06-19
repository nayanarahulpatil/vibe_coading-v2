# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** Trip Budget Tracker
**Version:** 3.0
**Date:** 2026-06-18
**Author:** Senior Product Manager

## 0. Change Summary

### Request Type

* Enhancement
* Phase Upgrade

### Summary

Product discovery against the v1 baseline ([trip_budget_tracker_prd.md](../Agents/trip_budget_tracker_prd.md)) and v2 enhancement scope ([trip_budget_tracker_prd_v2.md](../Agents-v2/trip_budget_tracker_prd_v2.md)) identified four structural gaps blocking production-grade multi-user, multi-session use. PRD v3 documents only these net-new and modified requirements; all v1 and v2 capabilities remain in scope unless explicitly modified below.

### Gap Analysis

| # | Area | v1 / v2 Current State | Gap | v3 Requirement |
| --- | --- | --- | --- | --- |
| G1 | User Identity | No accounts; anonymous in-browser session (v2 explicitly out of scope for auth) | Users cannot return to their trips across devices or browsers; no ownership model | **Register** and **Login** pages with authenticated sessions |
| G2 | Credential Recovery | Not applicable (no accounts) | Users who forget credentials have no recovery path | **Forgot Password** flow with secure reset |
| G3 | Data Persistence | Redux state persisted to browser `localStorage` only | Data is device-bound, not durable, not shareable across users, and lost on cache clear | Persist **all application data** in a **SQLite** database via a backend API |
| G4 | Trip Ownership & Access | Any visitor can create/view a trip in the current browser session | No linkage between a user account and their trips; no protected access | Trips, members, expenses, and related records are scoped to the authenticated user (creator/owner) and retrieved from SQLite on login |
| G5 | Session Security | No authentication or authorization layer | Sensitive trip and receipt data is unprotected | Password hashing, session/token management, and route guards for authenticated-only screens |

**Inheritance note:** Sections 1–9 below extend—not replace—the v1 problem statement (group trip cost splitting) and v2 enhancements (multi-currency, receipts, settlement deep-links, categories/pie chart, PDF export). Unlisted v1/v2 behaviour is assumed unchanged.

---

## 1. Existing Modules / Features

Documented baseline as implemented through v2. No changes to described behaviour until modified in Section 2.

| Module | Feature | Current Behavior |
| --- | --- | --- |
| Trip Management | Create Trip + Add Members | User creates a trip, sets base currency (v2), and adds participant names |
| Expense Entry | Add Expense | Records who paid, amount, currency (v2), category (v2), description, and optional receipt photo (v2) |
| Currency Engine | Multi-Currency + Live FX | Converts foreign-currency expenses to trip base currency using cached live FX rates (v2) |
| Balance Tracking | Running Balance per Person | Calculates and displays per-person balance in base currency in real time |
| Settlement | Settle-Up Summary | Shows who owes whom; UPI/PayPal deep-link per debt row (v2) |
| Analytics | Category Pie Chart | Visualises spend breakdown by category (v2) |
| Export | Trip Summary PDF | Downloadable PDF of trip expenses and balances (v2) |
| Persistence (v2) | localStorage Sync | Redux store serialised to `localStorage` on change; lost when cache cleared or on another device |

---

## 2. New / Modified Modules & Features

| Module | Type | Description |
| --- | --- | --- |
| Authentication — Register | New | Account creation page: email, password, confirm password; creates user record in SQLite |
| Authentication — Login | New | Credential entry page; validates against SQLite; establishes authenticated session |
| Authentication — Forgot Password | New | Request reset via registered email; issue time-limited reset token; allow new password submission |
| Session Management | New | Issue, validate, and expire auth tokens/sessions; protect trip and expense routes |
| Data Persistence Layer | Modified | Replace `localStorage` as source of truth with SQLite-backed API; client Redux becomes a cache of server state |
| Trip Management | Modified | Trips persisted to SQLite and associated with authenticated `user_id`; loaded on login |
| Expense Entry | Modified | Expenses (including v2 fields) persisted to SQLite; receipt photos stored via backend with DB reference |
| Currency Engine | Modified | FX rate cache stored in SQLite (replaces or supplements `localStorage` FX cache) |
| Balance / Settlement / Analytics / Export | Modified | Read trip data from SQLite via API instead of local-only state |

---

## 3. Problem Statement

* **The Issue:** v1/v2 stores all trip data in browser `localStorage` with no user accounts. Friends cannot reliably return to a trip after switching devices, clearing browser data, or sharing access with accountability. There is no secure identity layer or durable, queryable data store.
* **Target User:** Friend groups planning group trips who need persistent, account-bound trip records accessible after login from any supported browser.
* **Impact:** Trip data loss causes re-entry friction and disputes; lack of authentication prevents multi-session use and undermines trust for receipt and financial data stored in v2.

---

## 4. Solution Overview

### Existing Functionality Impact

* **Unchanged:** Core trip workflow (create trip → add members → add expenses → view balances → settle up); v2 multi-currency conversion logic; category pie chart; UPI/PayPal deep-links; PDF export content and format; balance calculation and debt-minimisation algorithms.
* **Modified:** All create/read/update/delete operations for trips, members, expenses, and FX cache flow through a backend API backed by SQLite. App entry requires login (or redirect to register). `localStorage` may retain auth token and optional client cache only—not as primary data store.
* **Deprecated:** `localStorage` as the authoritative persistence layer for trip/expense state (`trip_budget_tracker_state`).

### New Functionality

* **Register Page:** New users submit email and password; system validates input, hashes password, stores user in SQLite, and redirects to login (or auto-login per engineering decision documented at implementation).
* **Login Page:** Registered users authenticate; on success, system loads their trips from SQLite and navigates to the trip dashboard.
* **Forgot Password Page:** User submits registered email; system sends (or displays in dev) a reset link/token; user sets a new password; token invalidated after use or expiry.
* **SQLite Persistence:** Backend service uses SQLite for all entities: `users`, `trips`, `members`, `expenses`, `fx_rate_cache`, and receipt metadata/paths. All v2 entity fields are preserved in schema design.

### Out of Scope

* OAuth / social login (Google, Apple, etc.) — email/password only in v3.
* Multi-factor authentication (MFA).
* Real-time collaborative editing (multiple users editing the same trip simultaneously).
* Migration wizard importing existing `localStorage` trips into SQLite (may be a fast-follow; not required for v3 MVP).
* Replacing SQLite with PostgreSQL or other databases.
* Email delivery infrastructure beyond a pluggable adapter (SMTP config is a deployment concern; behaviour is specified, provider is not).

---

## 5. User Flow

### Existing Flow (v1/v2)

1. Open app → Create trip → Set base currency → Add members.
2. Add expenses (category, currency, receipt optional).
3. View balances, pie chart, settle-up summary, export PDF.
4. Data lives only in current browser `localStorage`.

### Updated Flow (v3)

1. **Open app** → If no valid session, redirect to **Login** page. *(new gate)*
2. **New user:** Tap **Register** → Enter email, password, confirm password → Submit → Account created in SQLite → Redirect to Login (or auto-login). *(new)*
3. **Returning user:** Enter email + password on **Login** → System validates credentials → Session token issued → Trips loaded from SQLite. *(new)*
4. **Forgot password:** From Login, tap **Forgot Password** → Enter email → Receive reset link/token → Set new password → Redirect to Login. *(new)*
5. **Authenticated session:** Create trip → Add members → Add expenses → View balances, pie chart, settle-up, export PDF. *(same as v2; data saved to SQLite on each mutation)*
6. **Logout:** User ends session; token cleared; redirect to Login. Trip data remains in SQLite for next login. *(new)*

---

## 6. Impact Analysis

### UI Impact

| Screen | Change Type | Description |
| --- | --- | --- |
| Login | New | Email and password fields, Submit, links to Register and Forgot Password |
| Register | New | Email, password, confirm password fields, validation messages, link to Login |
| Forgot Password | New | Email field for reset request; separate Reset Password view for new password entry via token |
| App Shell / Router | Modified | Auth guard wraps all trip features; unauthenticated users cannot access dashboard |
| Trip Dashboard & v2 screens | Modified | Data fetched from API on load; mutations trigger API persist to SQLite |
| Header | Modified | Replace or supplement "Leave Trip" with **Logout**; display logged-in user email (optional) |

### Database Impact

| Entity | Change Type | Description |
| --- | --- | --- |
| `users` | New | `id`, `email` (unique), `password_hash`, `created_at`, `updated_at` |
| `password_reset_tokens` | New | `id`, `user_id`, `token_hash`, `expires_at`, `used_at` |
| `sessions` | New | `id`, `user_id`, `token_hash`, `expires_at`, `created_at` (if server-side session table used) |
| `trips` | New | `id`, `user_id` (owner), `name`, `base_currency`, `created_at`, `updated_at` |
| `members` | New | `id`, `trip_id`, `name`, `created_at` |
| `expenses` | New | `id`, `trip_id`, `paid_by_member_id`, `amount_original`, `currency`, `amount_base`, `fx_rate`, `category`, `description`, `receipt_photo_path`, `created_at` |
| `fx_rate_cache` | New | `id`, `from_currency`, `to_currency`, `rate`, `fetched_at` |
| localStorage (`trip_budget_tracker_state`) | Deprecated | No longer authoritative; optional token-only key permitted |

### Security Impact

| Area | Impact |
| --- | --- |
| Password Storage | Passwords MUST be hashed (e.g. bcrypt/argon2); never stored or logged in plain text |
| Session Tokens | HTTP-only cookie or secure bearer token; short TTL with refresh or re-login policy |
| Forgot Password | Reset tokens single-use, time-limited (e.g. 1 hour), stored hashed; rate-limit reset requests per email |
| API Authorization | All trip/expense endpoints require valid session; users may only access their own `user_id`-scoped trips |
| Receipt Photos | File storage path in SQLite; files served only to authenticated owner of parent trip |
| SQLite File | Database file must not be web-accessible; backend-only access |

---

## 7. Edge Cases & Error Handling

| Scenario | Expected Behavior |
| --- | --- |
| Register — email already exists | Inline error: "An account with this email already exists"; link to Login |
| Register — password mismatch | Inline error on confirm password field; block submit |
| Register — weak password | Enforce minimum rules (e.g. ≥ 8 chars); display requirements before submit |
| Login — invalid credentials | Generic error: "Invalid email or password" (do not reveal which field failed) |
| Login — unverified account | Out of scope for v3 unless email verification added later |
| Forgot password — unknown email | Show same success message as known email (prevent email enumeration) |
| Forgot password — expired/used token | Error: "Reset link expired or invalid"; offer to request new link |
| Session expired mid-use | Redirect to Login with message; unsaved in-flight form data lost (client should debounce saves) |
| API unavailable | Show retry banner; read-only cache optional; block mutations with clear error |
| SQLite write failure | Return 500; do not update client state; show "Could not save; try again" |
| Concurrent tab logout | All tabs detect invalid session on next API call; redirect to Login |
| User with zero trips on login | Show empty state with CTA to create first trip |
| v2 edge cases (FX, receipts, PDF, deep-links) | Unchanged — see PRD v2 Section 7; now backed by SQLite reads/writes |

---

## 8. KPIs & Acceptance Criteria

### KPIs

| KPI | Target |
| --- | --- |
| Registration success rate | ≥ 95% for valid inputs on first attempt |
| Login latency | < 1 second for credential validation + session issue (excl. network cold start) |
| Data durability | 100% of committed trip/expense mutations retrievable after logout and re-login |
| Password reset completion | ≥ 90% of initiated resets completed within token TTL |
| API persist latency | < 500 ms for single expense create on standard connection |
| Auth security | Zero plain-text passwords in SQLite or logs (verified in QA) |

### Acceptance Criteria

| Feature | Acceptance Criteria |
| --- | --- |
| Register | GIVEN a new user on the Register page, WHEN they submit a unique email and matching valid passwords, THEN a user record is created in SQLite and they are directed to Login (or logged in) |
| Register — duplicate | GIVEN an email already in SQLite, WHEN Register is submitted, THEN registration is blocked with an appropriate error |
| Login | GIVEN a registered user, WHEN they submit correct email and password, THEN a session is created and their trips are loaded from SQLite |
| Login — failure | GIVEN invalid credentials, WHEN Login is submitted, THEN access is denied with a generic error and no session is issued |
| Forgot Password — request | GIVEN a registered email, WHEN Forgot Password is submitted, THEN a reset token is stored in SQLite and a reset mechanism is triggered |
| Forgot Password — reset | GIVEN a valid unused reset token, WHEN the user sets a new password, THEN the password hash is updated in SQLite and the token is invalidated |
| SQLite — trip persist | GIVEN an authenticated user creates a trip, WHEN they log out and log back in, THEN the trip appears with the same name and base currency |
| SQLite — expense persist | GIVEN an authenticated user adds an expense (including v2 fields), WHEN they log out and log back in, THEN the expense and balances match pre-logout state |
| Auth guard | GIVEN an unauthenticated user, WHEN they navigate to the trip dashboard URL directly, THEN they are redirected to Login |
| Logout | GIVEN an authenticated session, WHEN the user logs out, THEN the session is invalidated and trip data remains in SQLite |
| v2 regression | GIVEN authenticated user with a trip, WHEN they use multi-currency, receipt upload, pie chart, deep-links, and PDF export, THEN all v2 acceptance criteria from PRD v2 Section 8 still pass against SQLite-backed data |

---

## 9. Limitations & Risks

### Technical Risks

* Introducing a backend and SQLite adds deployment complexity (DB file backup, migrations, connection pooling) versus the current client-only SPA.
* `localStorage` migration is out of scope; existing browser-only users lose local trips unless a future import is built.
* Receipt photo storage requires filesystem or object storage alongside SQLite paths; disk quota must be monitored.
* Session/token design must be agreed before frontend integration to avoid rework.

### Business Risks

* Email-based password reset depends on deliverability; failed emails block account recovery.
* Users may expect Google/social login; email-only v3 may increase registration drop-off.
* SQLite suits moderate scale; high concurrency write loads may require architectural review in a future phase.

### Dependencies

* **New:** Backend API service (Node.js, Python, or equivalent per engineering architecture) with SQLite driver.
* **New:** Password hashing library and secure session/token strategy.
* **New:** Email or token-delivery mechanism for forgot-password flow (even if dev-mode console/log in non-production).
* **Existing Modules:** v1 balance engine and v2 currency/receipt/chart/export features — consumed with API persistence layer substituted for `localStorage`.
* **External:** Live FX rate API (v2 dependency) — unchanged; cache row stored in SQLite instead of `localStorage`.
* **PRD References:** [trip_budget_tracker_prd.md](../Agents/trip_budget_tracker_prd.md) (v1 baseline), [trip_budget_tracker_prd_v2.md](../Agents-v2/trip_budget_tracker_prd_v2.md) (v2 enhancements).

---
