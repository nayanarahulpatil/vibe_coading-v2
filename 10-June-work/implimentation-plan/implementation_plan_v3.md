# Trip Budget Tracker v3 — Implementation Plan

**Date:** 2026-06-18  
**References:** [trip_budget_tracker_prd_v3.md](./trip_budget_tracker_prd_v3.md), [trip_budget_tracker_kpi_v3.md](./trip_budget_tracker_kpi_v3.md), [trip_budget_tracker_project_scope_v3.md](./trip_budget_tracker_project_scope_v3.md)

---

## 1. Current State Analysis

| Area | v2 Implementation | v3 Gap |
| --- | --- | --- |
| Persistence | Redux → `localStorage` (`trip_budget_tracker_state`) | No backend; data device-bound |
| Auth | None; open dashboard | No register/login/forgot-password |
| FX Cache | `localStorage` per base currency | Must move to SQLite |
| Receipts | Base64 in Redux/localStorage | Must store on server with DB path |
| Routing | Single `App.tsx` shell | No auth guards or auth routes |
| API | Client-only SPA | No REST API layer |

**v2 features to preserve (logic unchanged):** balance calculation, settle-up algorithm, multi-currency conversion, category pie chart, UPI/PayPal deep-links, PDF print export.

---

## 2. Implementation Phases

### Phase A — Backend Foundation (Sprint 9)
- Add `server/` package: Express + TypeScript + better-sqlite3
- SQLite schema: `users`, `password_reset_tokens`, `trips`, `members`, `expenses`, `fx_rate_cache`
- Centralized error handler; `{ status, data, message }` response format
- Helmet, CORS, rate limiting on auth routes
- Receipt file storage in `server/uploads/`

### Phase B — Authentication (Sprints 10–11)
- `POST /api/v1/auth/register`, `login`, `logout`, `forgot-password`, `reset-password`, `GET /me`
- bcrypt password hashing; JWT bearer tokens
- Frontend: Login, Register, ForgotPassword, ResetPassword pages (Formik + Yup)
- Auth slice + `ProtectedRoute`; token in `localStorage` only (`trip_budget_tracker_token`)

### Phase C — API Persistence (Sprint 12)
- Trip/member/expense CRUD endpoints scoped by `user_id`
- Remove `localStorage` trip state subscriber
- Redux becomes UI cache; mutations call API then update store
- `loadTrips` / `loadTrip` on login

### Phase D — v2 Integration on SQLite (Sprint 13)
- FX rates via `GET /api/v1/fx/rates/:baseCurrency` (server cache in SQLite)
- Receipt upload via multipart on expense create; serve via authenticated endpoint
- Regression: balances, settle-up, chart, PDF read from API-loaded trip

### Phase E — App Shell (Sprint 14 prep)
- Header: Logout + user email; version label v3
- Session expiry → redirect Login
- Vite proxy `/api` → `localhost:3001`

---

## 3. File Change Map

### New — Backend (`trip-budget-tracker/server/`)
```
server/
├── package.json
├── tsconfig.json
└── src/
    ├── app.ts
    ├── config/env.ts
    ├── database/db.ts
    ├── middlewares/auth.ts, errorHandler.ts
    ├── routes/index.ts, auth.routes.ts, trip.routes.ts, fx.routes.ts
    ├── services/auth.service.ts, trip.service.ts, fx.service.ts, email.service.ts
    ├── repositories/*.ts
    └── utils/response.ts, tokens.ts
```

### New — Frontend
```
src/
├── features/auth/
│   ├── authSlice.ts
│   ├── components/AuthLayout.tsx
│   └── pages/LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
├── features/trip/pages/DashboardPage.tsx
├── components/ProtectedRoute.tsx
├── services/apiClient.ts, authApi.ts, tripApi.ts
└── AppRouter.tsx
```

### Modified — Frontend
- `store/index.ts` — remove trip localStorage persistence; add auth reducer
- `tripSlice.ts` — add `setCurrentTrip`, `loadTripFromApi`, async-friendly actions
- `CreateTripForm`, `AddMemberForm`, `AddExpenseForm` — API calls
- `currencyService.ts` — fetch rates from backend API
- `App.tsx` → `AppRouter.tsx` with routes
- `main.tsx` — BrowserRouter
- `vite.config.ts` — API proxy

---

## 4. KPI Traceability (v3 new/modified)

| KPI | Implementation |
| --- | --- |
| KPI-AUTH-REG-01–05 | Register endpoint + RegisterPage validation |
| KPI-AUTH-LOG-01–05 | Login endpoint + trip load on success |
| KPI-AUTH-FP-01–06 | Forgot/reset endpoints + rate limit |
| KPI-SES-01–06 | JWT middleware + ProtectedRoute + logout |
| KPI-DB-01–09 | SQLite repositories; remove trip localStorage |
| KPI-TRM-05/06 | Trip/member INSERT with user_id |
| KPI-EXP-09–11 | Expense API + receipt auth |
| KPI-FX-07 | fx_rate_cache table |
| KPI-BAL-05, KPI-SET-08, KPI-ANA-05, KPI-PDF-05/06 | Load trip from API after re-login |

---

## 5. Run Instructions (post-implementation)

```bash
# Terminal 1 — Backend
cd trip-budget-tracker/server
npm install
npm run dev

# Terminal 2 — Frontend
cd trip-budget-tracker
npm install
npm run dev
```

Frontend: `http://localhost:5173` · API: `http://localhost:3001`

---
