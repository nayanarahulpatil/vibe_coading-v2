# Developer Handover & Workflow Document v3

**Project:** Trip Budget Tracker v3  
**Date:** 2026-06-18  
**References:** [trip_budget_tracker_prd_v3.md](../Agents-v3/trip_budget_tracker_prd_v3.md), [trip_budget_tracker_project_scope_v3.md](../Agents-v3/trip_budget_tracker_project_scope_v3.md), [implementation_plan_v3.md](../Agents-v3/implementation_plan_v3.md)

---

## 1. Project Overview

* **Project Name:** Trip Budget Tracker v3
* **Business Purpose:** Provide friend groups with an authenticated, durable web app to split trip expenses across currencies, attach receipt evidence, visualize spending categories, settle debts via UPI or PayPal deep-links, and export printable trip summaries — with data that survives logout, device changes, and browser cache clears.
* **Problem Statement:** v1/v2 stored all trip data in browser `localStorage` with no user accounts. Trips were device-bound, unprotected, and lost when cache was cleared. There was no credential recovery path and no ownership model for financial and receipt data.
* **Solution Summary:** A full-stack application: React SPA frontend with Redux UI cache, Express + TypeScript REST API, SQLite persistence, JWT session auth (register, login, forgot/reset password), server-side FX rate caching, filesystem receipt storage, and route guards on all trip/expense screens. All v2 trip workflows (multi-currency, receipts, balances, settle-up, pie chart, PDF export) are preserved against the new persistence layer.
* **Key Features:**
  * User registration, login, logout, forgot password, and reset password
  * JWT-protected dashboard with trip CRUD scoped to authenticated user
  * Trip setup with base currency and member roster (UPI/PayPal handles)
  * Multi-currency expense entry with live/cached FX conversion
  * Receipt upload (JPEG/PNG/HEIC ≤ 10MB) stored on server filesystem
  * Running balances, debt-minimised settle-up summary with payment deep-links
  * Category pie chart and print-optimised trip summary export
  * SQLite-backed durability across sessions and re-login

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Routing** | React Router DOM 7 |
| **State Management** | Redux Toolkit, React-Redux (UI cache only; not authoritative persistence) |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Forms & Validation** | Formik, Yup |
| **Backend Framework** | Node.js, Express 4, TypeScript (tsx) |
| **Database** | SQLite via better-sqlite3 (WAL mode, foreign keys enabled) |
| **Authentication** | bcrypt password hashing, JWT bearer tokens (jsonwebtoken) |
| **Security Middleware** | Helmet, CORS, express-rate-limit (auth routes) |
| **File Uploads** | Multer (receipt photos → `server/uploads/`) |
| **Testing** | Playwright (E2E + API integration) |
| **Integrations** | Open Exchange Rates keyless API (`open.er-api.com`), UPI/PayPal deep-links, browser print engine |

---

## 3. Architecture Overview

* **High-Level Architecture:** Client-server SPA. The React frontend proxies `/api` requests to the Express backend (port 3001). SQLite is the single source of truth for users, trips, members, expenses, FX cache, and password reset tokens. Redux holds in-memory UI state loaded from the API. Only the JWT auth token is stored in `localStorage` (`trip_budget_tracker_token`).

* **Request/Data Flow:**
  1. User visits app → `AppRouter` bootstraps auth via `GET /api/v1/auth/me` if token exists.
  2. Unauthenticated access to `/dashboard` → `ProtectedRoute` redirects to `/login`.
  3. Login/register → API returns JWT → token saved to `localStorage` → trips loaded via `GET /api/v1/trips`.
  4. Trip mutations (create trip, add member, add expense) → frontend calls REST API → server writes SQLite → Redux updated from response.
  5. FX rates → frontend calls `GET /api/v1/fx/rates/:baseCurrency` → server checks SQLite cache or fetches from Open Exchange Rates API.
  6. Receipt upload → multipart `POST /api/v1/trips/:tripId/expenses` → file saved to `uploads/` → path stored in `expenses.receipt_photo_path`.
  7. Receipt display → authenticated `GET /api/v1/receipts/:expenseId` → blob URL in UI.
  8. Balance/settle-up/chart/PDF → derived client-side from API-loaded trip data (same algorithms as v2).

* **Major Components:**

  | Layer | Components |
  | :--- | :--- |
  | **Auth** | `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `ProtectedRoute`, `authSlice`, `PasswordInput` |
  | **Trip** | `CreateTripForm`, `AddMemberForm`, `TripDashboard`, `tripSlice`, `tripApi` |
  | **Expense** | `AddExpenseForm`, `ExpenseList`, `ReceiptImage` |
  | **Balance** | `useCalculateBalances`, `useSettleUp`, `RunningBalancesList`, `SettleUpSummary` |
  | **Analytics** | `CategoryPieChart` |
  | **Export** | `TripSummaryReport` (print overlay) |
  | **Backend** | `auth.service`, `trip.service`, `fx.service`, repositories, JWT middleware |

* **External Integrations:**
  * **FX API:** `https://open.er-api.com/v6/latest/{baseCurrency}` — fetched server-side, cached in `fx_rate_cache` table (24h TTL logic preserved from v2).
  * **Email (password reset):** Pluggable `email.service.ts` — logs to console in dev; no SMTP configured in MVP. Dev mode returns clickable `devResetUrl` in API response.
  * **Payments:** `upi://pay?...` and `paypal.me/{username}/{amount}` deep-links (client-side, unchanged from v2).

---

## 4. Project Structure

```text
trip-budget-tracker/
├── server/                          # Backend API (Express + SQLite)
│   ├── data/                        # SQLite DB file (gitignored; created at runtime)
│   ├── uploads/                     # Receipt photo storage (gitignored)
│   └── src/
│       ├── app.ts                   # Express app entry, route mounting, health check
│       ├── config/env.ts            # Environment variables and defaults
│       ├── database/db.ts           # SQLite connection + schema bootstrap
│       ├── middlewares/
│       │   ├── auth.ts              # JWT bearer validation
│       │   └── errorHandler.ts      # Centralised error responses
│       ├── routes/
│       │   ├── auth.routes.ts       # /api/v1/auth/*
│       │   ├── trip.routes.ts       # /api/v1/trips/* + receipt routes
│       │   └── fx.routes.ts         # /api/v1/fx/*
│       ├── services/
│       │   ├── auth.service.ts      # Register, login, forgot/reset password
│       │   ├── trip.service.ts      # Trip/member/expense business logic
│       │   ├── fx.service.ts        # FX fetch + SQLite cache
│       │   └── email.service.ts     # Password reset email adapter (console in dev)
│       ├── repositories/            # SQLite data access layer
│       └── utils/                   # Response helpers, token hashing
├── src/                             # Frontend React SPA
│   ├── AppRouter.tsx                # Route definitions + auth bootstrap
│   ├── pages/DashboardPage.tsx      # Authenticated app shell (header, logout, grids)
│   ├── features/
│   │   ├── auth/                    # Auth pages, slice, layout, PasswordInput
│   │   ├── trip/                    # Trip forms, dashboard, tripSlice
│   │   ├── expense/                 # AddExpenseForm, ExpenseList
│   │   └── balance/                 # Balances, settle-up, chart, PDF export
│   ├── components/
│   │   ├── ProtectedRoute.tsx       # Auth guard wrapper
│   │   └── ReceiptImage.tsx         # Authenticated receipt blob loader
│   ├── services/
│   │   ├── apiClient.ts             # Fetch wrapper, token management
│   │   ├── authApi.ts               # Auth endpoint calls
│   │   ├── tripApi.ts               # Trip/member/expense endpoint calls
│   │   └── currencyService.ts       # FX rates via backend API
│   ├── store/index.ts               # Redux store (trip + auth reducers)
│   ├── hooks/                       # Typed Redux hooks, useLoadTrips
│   └── types/index.ts               # Shared TypeScript interfaces
├── tests/                           # Playwright E2E + API tests
│   ├── test_specification_v3.md
│   └── test_execution_report.md
├── vite.config.ts                   # Dev server + /api proxy to :3001
└── playwright.config.ts             # Dual webServer (API + Vite on :5176)
```

**Folder notes:**
* `server/` is a separate npm package — install and run independently from the frontend root.
* `features/` follows domain-driven layout: each feature owns components, and trip/auth also own Redux slices.
* `services/` on the frontend is the API client layer; `server/src/services/` is backend business logic.
* Trip state is **not** persisted to `localStorage` — only the JWT token key is permitted client-side.

---

## 5. Module Summary

| Module | Purpose | Key Components | Dependencies |
| :--- | :--- | :--- | :--- |
| **Authentication** | Register, login, logout, password reset; JWT session management. | `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `authSlice`, `auth.service`, `auth.routes` | bcrypt, JWT, Formik, Yup, rate limiter |
| **Session Guards** | Protect dashboard and API routes from unauthenticated access. | `ProtectedRoute`, `authMiddleware`, `bootstrapAuth` | React Router, JWT |
| **Trip Management** | Create trips, add members; persist to SQLite scoped by `user_id`. | `CreateTripForm`, `AddMemberForm`, `TripDashboard`, `tripSlice`, `trip.service` | Redux, tripApi, SQLite |
| **Expense Entry** | Log expenses with multi-currency, category, receipt; persist via API. | `AddExpenseForm`, `ExpenseList`, multer upload | Formik, Yup, tripApi |
| **Receipt Storage** | Store photos on filesystem; serve via authenticated endpoint. | `ReceiptImage`, `receiptRoutes`, multer | Filesystem, JWT |
| **Currency Engine** | Fetch/cache FX rates server-side; convert expenses to base currency. | `currencyService`, `fx.service`, `fx_rate_cache` table | Open Exchange Rates API, SQLite |
| **Balance Tracking** | Compute per-member net balances from API-loaded expenses. | `useCalculateBalances`, `RunningBalancesList` | React hooks, Redux |
| **Settlement** | Debt-minimised "who owes whom" with UPI/PayPal deep-links. | `useSettleUp`, `SettleUpSummary` | upi:// intent, paypal.me |
| **Analytics** | Category spend breakdown visualisation. | `CategoryPieChart` | CSS conic-gradients |
| **Export** | Printable trip summary (expenses, categories, balances). | `TripSummaryReport` | `@media print` CSS |
| **API Client** | Unified fetch layer with JWT injection and error handling. | `apiClient.ts`, `authApi.ts`, `tripApi.ts` | fetch API, localStorage token |

---

## 6. Environment & Setup

### Required Environment Variables (Backend — `server/`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3001` | API server port |
| `JWT_SECRET` | `dev-trip-budget-tracker-secret-change-in-production` | JWT signing secret — **must change in production** |
| `JWT_EXPIRES_IN` | `24h` | Token expiry (jsonwebtoken format) |
| `RESET_TOKEN_TTL_MS` | `3600000` (1 hour) | Password reset token lifetime |
| `DB_PATH` | `data/trip_budget.db` | SQLite database file path |
| `UPLOADS_DIR` | `uploads` | Receipt photo storage directory |
| `FX_API_URL` | `https://open.er-api.com/v6/latest` | Exchange rates API base URL |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin |
| `DISABLE_RATE_LIMIT` | unset (rate limit **on**) | Set to `true` to skip auth rate limiting (tests/dev only) |
| `NODE_ENV` | unset | When not `production`, forgot-password returns `devResetUrl` in API response |

Frontend requires no environment variables — API calls proxy through Vite dev server.

### Installation Steps

```powershell
# Backend
cd 10-June-work/trip-budget-tracker/server
npm install

# Frontend
cd ../
npm install
```

### Local Setup

* Node.js v18+ required.
* Two terminals needed — backend must be running before frontend API calls succeed.
* SQLite DB and `uploads/` directory are created automatically on first server start.

### Build Commands

| Command | Location | Output |
| :--- | :--- | :--- |
| `npm run build` | `trip-budget-tracker/` | TypeScript check + Vite production bundle in `dist/` |
| `npm run start` | `trip-budget-tracker/server/` | Run compiled API via tsx (no separate build step) |

### Run Commands

```powershell
# Terminal 1 — Backend API
cd 10-June-work/trip-budget-tracker/server
npm run dev
# → http://localhost:3001  (health: GET /health)

# Terminal 2 — Frontend dev server
cd 10-June-work/trip-budget-tracker
npm run dev
# → http://localhost:5173  (proxies /api → :3001)
```

**Common startup issue:** A `502 Bad Gateway` on `/api/v1/auth/register` means the backend is not running on port 3001. Start the server terminal first.

---

## 7. Business Workflows

### 1. User Registration

* **Purpose:** Create a new account with hashed password stored in SQLite.
* **Steps:** Navigate to `/register` → Enter email, password, confirm password → Submit.
* **Validation:** Email required and unique. Password ≥ 8 characters. Confirm password must match. Browser autofill mitigated via placeholders and `autoComplete="off"`.
* **Outcome:** User record created in `users` table → redirect to Login (or auto-login depending on flow). Duplicate email returns 400.

### 2. User Login

* **Purpose:** Authenticate credentials and establish JWT session.
* **Steps:** Navigate to `/login` → Enter email and password → Submit.
* **Validation:** Both fields required. Invalid credentials return generic "Invalid email or password" (401).
* **Outcome:** JWT stored in `localStorage` → trips loaded from API → redirect to `/dashboard`. Empty state shows "Create a New Trip" CTA.

### 3. Forgot Password & Reset

* **Purpose:** Allow credential recovery via time-limited reset token.
* **Steps (Request):** Navigate to `/forgot-password` → Enter registered email → Submit.
* **Steps (Reset):** Click reset link (dev: link shown on success screen as `devResetUrl`) → Navigate to `/reset-password?token=...` → Enter new password → Submit.
* **Validation:** Unknown emails receive identical success message (enumeration-safe). Token must be valid, unused, and within TTL. New password ≥ 8 characters.
* **Outcome:** Password hash updated in SQLite; token marked used. **MVP note:** No real email delivery — dev mode displays clickable reset link in UI; production requires SMTP adapter configuration.

### 4. Trip Setup

* **Purpose:** Create a trip workspace with baseline currency, owned by authenticated user.
* **Steps:** On dashboard → Enter trip title → Select base currency → Click "Start Trip".
* **Validation:** Title required. Base currency required (ISO 4217 dropdown).
* **Outcome:** Trip row created in SQLite with `user_id` → dashboard forms enabled → Redux `currentTrip` populated.

### 5. Member Enrollment

* **Purpose:** Add participants with optional payment handles for settlement.
* **Steps:** Input member name → Optionally input UPI ID and PayPal username → Click "Add Member".
* **Validation:** Name ≥ 2 characters. Payment handles optional.
* **Outcome:** Member row persisted in SQLite → roster updated in Redux.

### 6. Expense Logging

* **Purpose:** Record costs in any currency with category, description, and optional receipt.
* **Steps:** Select payer → Select category → Select currency → Input amount → Input description → Optionally attach receipt → Save.
* **Validation:** Payer, category, amount (> 0), and description required. Receipt: JPEG/PNG/HEIC, ≤ 10MB.
* **Outcome:** FX conversion applied (live or cached) → expense row in SQLite with `amount_base`, `fx_rate`, optional `receipt_photo_path` → balances update instantly.

### 7. Settlement Payments

* **Purpose:** Pay back members using mobile/browser payment deep-links.
* **Steps:** View Settle Up Summary → Click "Pay via UPI" or "PayPal Me" on a debt row.
* **Outcome:** External payment app/page opens with pre-filled amount and payee handle.

### 8. Session Logout

* **Purpose:** End authenticated session; trip data remains in SQLite.
* **Steps:** Click Logout in dashboard header.
* **Outcome:** JWT cleared from `localStorage` → Redux trip state cleared → redirect to `/login`. Re-login restores all trips from SQLite.

---

## 8. Security & Error Handling

* **Authentication & Authorization:** JWT bearer tokens issued on login (`Authorization: Bearer <token>`). All `/api/v1/trips/*`, `/api/v1/receipts/*`, and protected auth routes require valid token. Cross-user trip access returns 403. Expired/invalid tokens return 401 → frontend redirects to Login.

* **Sensitive Data Handling:**
  * Passwords hashed with bcrypt (10 salt rounds) — never stored in plaintext.
  * Reset tokens stored as SHA-256 hashes in `password_reset_tokens`.
  * Receipt files stored on server filesystem — served only via authenticated endpoint scoped to trip owner.
  * JWT secret must be rotated for production deployment.
  * `localStorage` holds auth token only — no trip/expense/receipt data client-side.

* **Validation Strategy:**
  * Frontend: Formik + Yup on all forms (auth and trip).
  * Backend: Service-layer validation with descriptive error messages; multer file type/size checks on receipt upload.
  * Rate limiting on auth routes: 20 requests/15 min (register/login), 5 requests/hour (forgot/reset). Skippable via `DISABLE_RATE_LIMIT=true`.

* **Error Handling Strategy:**
  * API responses follow `{ status, data, message }` format.
  * Centralised `errorHandler` middleware on backend.
  * Frontend `ApiError` class surfaces API messages to UI banners/toasts.
  * Generic login error prevents email enumeration.

| Scenario | Expected Behavior |
| :--- | :--- |
| Access `/dashboard` without token | Redirect to `/login` |
| API call with expired JWT | 401 response; frontend clears session and redirects to Login |
| Register with duplicate email | 400 — "An account with this email already exists" |
| Register/login rate limit exceeded | 429 — "Too many requests" (plain text from rate limiter) |
| Access another user's trip by ID | 403 — forbidden |
| Upload invalid receipt format | 400 — "Invalid file format. Accepts JPEG, PNG, HEIC." |
| Upload receipt > 10MB | Multer error; upload rejected |
| Forgot password with unknown email | 200 — same success message as known email (no enumeration) |
| Reset with expired/used token | 400 — "Reset link expired or invalid" |
| Backend not running (502 on /api) | Frontend shows network/API error; start server on port 3001 |
| FX API unavailable with no cache | Expense save blocked; error banner "Exchange rates unavailable" |
| Offline expense with stale cache (> 24h) | Save blocked; stale rate warning displayed |

---

## 9. Known Limitations & Future Enhancements

| Type | Description | Priority |
| :--- | :--- | :--- |
| **Limitation** | **No SMTP email delivery:** Forgot password creates reset token but does not send real email in MVP. Dev mode shows `devResetUrl` in UI only. | **High** |
| **Limitation** | **Single-user trip ownership:** Trips belong to one account; no shared/collaborative editing across users. | **Medium** |
| **Limitation** | **No localStorage migration:** Existing v2 trips in `trip_budget_tracker_state` are not imported into SQLite. | **Medium** |
| **Limitation** | **JWT in localStorage:** Token stored client-side (XSS surface). HttpOnly cookie sessions not implemented. | **Medium** |
| **Limitation** | **SQLite single-file DB:** Not suitable for high-concurrency multi-instance deployment without migration. | **Low** |
| **Limitation** | **Offline FX limits:** Same as v2 — stale cache (> 24h) blocks new foreign-currency expenses when FX API is down. | **Medium** |
| **Enhancement** | **SMTP integration:** Wire `email.service.ts` to SendGrid/SES for production password reset emails. | **High** |
| **Enhancement** | **HttpOnly cookie sessions:** Replace localStorage JWT with secure cookie-based auth. | **High** |
| **Enhancement** | **v2 data migration wizard:** Import `localStorage` trips into SQLite on first login. | **Medium** |
| **Enhancement** | **Shared trip access:** Invite links or multi-user trip membership. | **Medium** |
| **Enhancement** | **Receipt compression:** Compress uploads server-side before storage. | **Low** |
| **Enhancement** | **PostgreSQL migration:** Replace SQLite for production multi-instance deployments. | **Low** |

---

## 10. Developer Quick Start

A new developer should be able to start contributing using only this section.

### 1. Clone and Navigate

```powershell
cd "d:\vibe code\vibe_coading-v2\10-June-work\trip-budget-tracker"
```

### 2. Install Dependencies

```powershell
npm install
npm install --prefix server
```

### 3. Configure Environment (Optional)

Create `server/.env` for local overrides (not required for dev defaults):

```env
PORT=3001
JWT_SECRET=your-local-dev-secret
CLIENT_ORIGIN=http://localhost:5173
DISABLE_RATE_LIMIT=true
```

### 4. Run Application

```powershell
# Terminal 1 — start API first
npm run dev --prefix server

# Terminal 2 — start frontend
npm run dev
```

Open `http://localhost:5173` → Register a new account → Create a trip.

Verify API health: `http://localhost:3001/health` → `{ "status": 200, "data": { "ok": true } }`.

### 5. Execute Tests

```powershell
# Stop any manual server on port 3001 first (Playwright starts its own test backend)
npx playwright test --reporter=line

# View HTML report
npm run test:e2e:report
```

Playwright config (`playwright.config.ts`):
* Starts test API on port 3001 with `DB_PATH=data/test_playwright.db` and `DISABLE_RATE_LIMIT=true`.
* Starts Vite on port **5176** (not 5173) to avoid conflicts.
* 31 test cases — 100% pass rate as of 2026-06-18 ([test_execution_report.md](../trip-budget-tracker/tests/test_execution_report.md)).

### 6. Build Project

```powershell
npm run build
npm run preview
```

Backend has no separate build step — `npm run start --prefix server` runs via tsx.

### 7. Deploy Application (Guidance)

| Component | Recommendation |
| :--- | :--- |
| **Frontend** | Build with `npm run build` → serve `dist/` via static host (Netlify, Vercel, nginx). Configure reverse proxy for `/api` → backend URL. |
| **Backend** | Run `npm run start --prefix server` on Node.js host. Set `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_ORIGIN` to production frontend URL. |
| **Database** | Mount persistent volume for `DB_PATH` (default `data/trip_budget.db`). |
| **Uploads** | Mount persistent volume for `UPLOADS_DIR` (default `uploads/`). |
| **Security** | Change `JWT_SECRET`. Enable SMTP for password reset. Do **not** set `DISABLE_RATE_LIMIT=true` or rely on `devReturnResetLink` in production. |

### API Endpoint Reference

| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| GET | `/health` | No | Health check |
| POST | `/api/v1/auth/register` | No | Create account |
| POST | `/api/v1/auth/login` | No | Login → JWT |
| GET | `/api/v1/auth/me` | Yes | Current user profile |
| POST | `/api/v1/auth/logout` | Yes | Logout (client clears token) |
| POST | `/api/v1/auth/forgot-password` | No | Request reset token |
| POST | `/api/v1/auth/reset-password` | No | Set new password via token |
| GET | `/api/v1/trips` | Yes | List user's trips |
| GET | `/api/v1/trips/:tripId` | Yes | Get trip with members + expenses |
| POST | `/api/v1/trips` | Yes | Create trip |
| POST | `/api/v1/trips/:tripId/members` | Yes | Add member |
| POST | `/api/v1/trips/:tripId/expenses` | Yes | Add expense (multipart if receipt) |
| GET | `/api/v1/fx/rates/:baseCurrency` | Yes | FX rates (cached) |
| GET | `/api/v1/receipts/:expenseId` | Yes | Serve receipt image |

### Troubleshooting Checklist

| Symptom | Likely Cause | Fix |
| :--- | :--- | :--- |
| 502 on `/api/*` | Backend not running | Start `npm run dev --prefix server` |
| "Too many requests" during tests | Rate limiter active | Set `DISABLE_RATE_LIMIT=true` in test env |
| Forgot password — no email | SMTP not configured (MVP) | Use `devResetUrl` shown on success screen in dev |
| Register fields prefilled | Browser autofill | Fields use autofill guards; clear browser saved data |
| Trips missing after refresh | Not logged in or wrong account | Login with same email used to create trips |
| Playwright port conflict | Manual server on 3001 | Stop manual server before `npx playwright test` |

---

*Document generated from v3 implementation in `10-June-work/trip-budget-tracker/` and product docs in `10-June-work/Agents-v3/`.*
