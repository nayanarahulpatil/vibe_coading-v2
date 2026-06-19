# Trip Budget Tracker — Project Scope v3

**Version:** 3.0  
**Date:** 2026-06-18  
**Author:** Senior Product Manager  

**References:**  
- [trip_budget_tracker_prd_v3.md](./trip_budget_tracker_prd_v3.md)  
- [trip_budget_tracker_kpi_v3.md](./trip_budget_tracker_kpi_v3.md)

---

## 1. Goal & Problem Statement

* **The Problem:** v1/v2 stores all trip data in browser `localStorage` with no user accounts, so friends cannot return to their trips after switching devices, clearing cache, or starting a new session — and there is no secure identity or durable data store for financial and receipt data.
* **The Solution:** Introduce email/password authentication (register, login, forgot password), session management with route guards, and a backend API that persists all application data in SQLite — while preserving the full v1/v2 trip workflow (multi-currency, receipts, settlement deep-links, analytics, PDF export) against the new persistence layer.

---

## 2. Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit, Formik, Yup, Lucide React
* **Backend:** REST API service (Node.js per engineering architecture), password hashing (bcrypt/argon2), session/token middleware
* **Database & Storage:** SQLite (source of truth for users, trips, members, expenses, FX cache, sessions, reset tokens); filesystem or scoped object storage for receipt photos; `localStorage` limited to auth token only (optional client cache — not authoritative)
* **Integrations:** Open Exchange Rates API (v2 — server-side FX key/cache), pluggable email adapter for password reset (SMTP in production; console/log in dev)

---

## 3. Existing Features (Reference Only)

Documented v1/v2 functionality that remains in scope and is **not** being redefined in v3. v3 changes *how* data is stored and accessed, not the core behaviour of these features.

| Feature Number | Feature Name | Description |
| --- | --- | --- |
| EF-001 | Create Trip & Add Members | User creates a trip, selects base currency (ISO 4217), and adds participant names |
| EF-002 | Add Expense | Records payer, amount, expense currency, category, description, and optional receipt photo (JPEG/PNG/HEIC ≤ 10MB) |
| EF-003 | Multi-Currency + Live FX | Foreign-currency expenses converted to trip base currency using live/cached FX rates |
| EF-004 | Running Balance per Person | Real-time per-member balance display in base currency |
| EF-005 | Settle-Up Summary | Debt-minimised "who owes whom" list with UPI and PayPal deep-link per debt row |
| EF-006 | Category Pie Chart | Spend breakdown by category (Food, Transport, Accommodation, Entertainment, Other) |
| EF-007 | Trip Summary PDF Export | Downloadable/printable PDF of trip expenses, categories, and final balances |
| EF-008 | Balance & Settlement Algorithms | Rounding consistency, multi-currency aggregation, debt resolution logic (unchanged) |

---

## 4. New / Modified Features & Acceptance Criteria

Document only v3 functionality being added or changed. KPI IDs map to [trip_budget_tracker_kpi_v3.md](./trip_budget_tracker_kpi_v3.md).

| Feature Number | Type | Feature Name | Description | Acceptance Criteria | KPI Ref |
| --- | --- | --- | --- | --- | --- |
| NF-001 | New | Register Page | Account creation with email, password, and confirm password; user stored in SQLite with hashed password | GIVEN a new user on Register, WHEN they submit a unique email and matching valid passwords (≥ 8 chars), THEN a user record is created in SQLite and they are directed to Login (or auto-logged in) | KPI-AUTH-REG-01–05 |
| NF-002 | New | Login Page | Credential validation against SQLite; session issuance; trip list loaded on success | GIVEN a registered user, WHEN they submit correct email and password, THEN a session is created, trips load from SQLite, and user reaches dashboard or empty-state CTA | KPI-AUTH-LOG-01–05 |
| NF-003 | New | Forgot Password — Request | User submits email; system creates time-limited reset token in SQLite and triggers delivery | GIVEN a registered email, WHEN Forgot Password is submitted, THEN a `password_reset_tokens` row is created and reset mechanism fires; unknown emails receive identical success messaging | KPI-AUTH-FP-01, 02, 06 |
| NF-004 | New | Forgot Password — Reset | User sets new password via valid token; token invalidated after use | GIVEN a valid unused token within TTL, WHEN user sets a new password, THEN password hash updates in SQLite and token is marked used; expired/used tokens are rejected | KPI-AUTH-FP-03–05 |
| NF-005 | New | Session Management & Auth Guards | Issue, validate, expire sessions; protect all trip/expense routes; logout invalidates token | GIVEN no valid session, WHEN user navigates to dashboard URL, THEN redirect to Login; GIVEN logout, WHEN subsequent API call uses old token, THEN 401 returned | KPI-SES-01–06 |
| NF-006 | New | SQLite Backend & Schema | Backend API with SQLite tables: `users`, `sessions`, `password_reset_tokens`, `trips`, `members`, `expenses`, `fx_rate_cache`; DB file not web-accessible | GIVEN backend is running, WHEN schema is applied, THEN all v3 entities exist with v2 field parity on expenses/trips; 0 unauthenticated access to raw `.sqlite` file | KPI-DB-08 |
| NF-007 | New | API Persistence Layer | All trip/member/expense/FX mutations persist via REST API to SQLite; client Redux is cache of server state | GIVEN authenticated user creates trip and expense, WHEN they logout and login, THEN trip name, base currency, expenses (incl. v2 fields), and balances match pre-logout state | KPI-DB-01, 02, 03 |
| MF-001 | Modified | Trip Management | Trips created with `user_id` owner; loaded from API on login; CRUD via SQLite | GIVEN authenticated user creates trip, WHEN trip is saved, THEN `trips` row links to session `user_id` and members persist in `members` table | KPI-TRM-05, 06, KPI-SEC-02 |
| MF-002 | Modified | Add Expense | Expenses committed to SQLite via API; receipt path stored in DB; auth required on create/serve | GIVEN valid authenticated expense submit, WHEN API succeeds, THEN expense row exists in SQLite with correct `trip_id` and v2 fields; unauthenticated create returns 401 | KPI-EXP-09–11 |
| MF-003 | Modified | Currency Engine Cache | FX rate cache stored in and read from SQLite `fx_rate_cache` (not `localStorage` as primary) | GIVEN in-TTL cache entry in SQLite, WHEN server restarts, THEN cache is served from DB without mandatory re-fetch; KPI-FX-04 fallback unchanged | KPI-FX-07, KPI-DB-06 |
| MF-004 | Modified | Running Balance | Balances computed from API-loaded expense data | GIVEN mixed-currency trip persisted in SQLite, WHEN user logout → login → reload, THEN balances match pre-logout values with 0 discrepancies | KPI-BAL-05 |
| MF-005 | Modified | Settle-Up Summary | Debt summary derived from SQLite-backed balances | GIVEN trip with debts, WHEN reloaded from SQLite after re-login, THEN settle-up rows match pre-logout debt list | KPI-SET-08 |
| MF-006 | Modified | Category Pie Chart | Chart aggregates expenses loaded from SQLite | GIVEN trip with categorized expenses, WHEN reloaded after re-login, THEN pie chart segment totals match pre-logout values | KPI-ANA-05 |
| MF-007 | Modified | PDF Export | Export reads SQLite-backed trip data; requires authentication | GIVEN authenticated user with expenses, WHEN Export PDF is tapped after re-login, THEN PDF amounts match in-app display; unauthenticated export blocked | KPI-PDF-05, 06 |
| MF-008 | Modified | App Shell & Header | Auth gate on app entry; Logout replaces/supplements Leave Trip; optional logged-in email display | GIVEN authenticated session, WHEN user taps Logout, THEN session cleared, redirect to Login, trip data remains in SQLite | KPI-SES-03 |
| DF-001 | Deprecated | localStorage Trip State (`trip_budget_tracker_state`) | No longer authoritative persistence for trip/expense data | GIVEN v3 cutover, WHEN user performs trip mutations, THEN 0 full trip state writes to `localStorage`; auth token key only permitted | KPI-DB-09 |

### Feature Types

* **New** → Completely new functionality (NF-001–NF-007)
* **Modified** → Existing v1/v2 functionality enhanced for SQLite/API/auth (MF-001–MF-008)
* **Deprecated** → Functionality planned for removal (DF-001)
* **Removed** → None in v3

### v3 Delivery Phases (from KPI v3 timeline)

| Sprint | Focus | Scope Features |
| --- | --- | --- |
| Sprint 9 | Backend & SQLite schema | NF-006 |
| Sprint 10 | Register & Login | NF-001, NF-002, NF-005 (guards) |
| Sprint 11 | Forgot password & session hardening | NF-003, NF-004, NF-005 |
| Sprint 12 | API persistence — trips & expenses | NF-007, MF-001, MF-002, DF-001 |
| Sprint 13 | v2 feature SQLite integration | MF-003–MF-007 |
| Sprint 14 | Security audit & E2E UAT | All NF/MF; full v1/v2/v3 regression |

---

## 5. UI/UX Standards

* **Theme & Style:** Retain v2 fintech light theme — slate palette, primary/secondary HSL gradient accents, Google Outfit font, glassmorphism header (`bg-white/80 backdrop-blur-md`).
* **Layout:** Mobile-first responsive grid (`max-w-4xl`); sticky header; card-based forms consistent with existing `TripDashboard` and `AddExpenseForm` patterns.
* **Auth Screens:** Register, Login, and Forgot Password use the same visual language as v2 (rounded inputs, full-width primary CTA, inline validation errors, link navigation between auth pages).
* **Auth UX:** Generic error on failed login; password requirements visible on Register; empty trip state with CTA after first login; session-expired banner with redirect to Login.
* **Feedback:** Inline Formik/Yup validation on auth and trip forms; API error toasts/banners for persist failures and outage; loading states on login and trip fetch.
* **Accessibility:** Form labels, focus states, and error announcements consistent with existing v2 form components.

---

## 6. Out of Scope

* OAuth / social login (Google, Apple, etc.) — email/password only
* Multi-factor authentication (MFA)
* Email verification on register
* Real-time collaborative editing (multiple users editing the same trip simultaneously)
* Migration wizard importing existing `localStorage` trips into SQLite
* Replacing SQLite with PostgreSQL or other databases
* In-app payment processing (deep-links only — unchanged from v2)
* Push notifications for settlement reminders
* Prescribing specific SMTP provider (pluggable adapter only)

---
