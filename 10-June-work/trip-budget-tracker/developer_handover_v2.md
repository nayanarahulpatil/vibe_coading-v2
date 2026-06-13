# Developer Handover & Workflow Document v2

## 1. Project Overview
* **Project Name:** Trip Budget Tracker v2
* **Business Purpose:** Provide friend groups with a frictionless, high-contrast, light-themed web app to split expenses across currencies, attach receipt evidence, visualize spending categories, and settle debts directly via UPI or PayPal.
* **Problem Statement:** Group trips frequently involve multiple currencies, manual calculation overhead, lack of receipt tracking, high payment friction, and no exportable log of overall balances.
* **Solution Summary:** A pure client-side React and Redux SPA redesigned in a modern fintech light-theme. Includes live currency translation (with offline caching), Base64 file attachment, SVG/CSS category charts, deep-link settlement triggers, and browser print-optimized report generation.
* **Key Features:** Trip setup (with base currency), multi-currency entry, optional receipt attachments (max 10MB JPEG/PNG/HEIC), category spend donuts, prefilled UPI/PayPal me deep-links, local storage persistence, and print summary exports.

---

## 2. Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **State Management** | Redux Toolkit, React-Redux, localStorage subscriber persistence |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Forms & Validation**| Formik, Yup |
| **Integrations** | Open Exchange Rates keyless API, native print engine |

---

## 3. Architecture Overview
* **High-Level Architecture:** Client-side Single Page Application (SPA). All state is kept in a global Redux store and synced to the browser's `localStorage` on change.
* **Request/Data Flow:** 
  1. Component mounts/triggers action → Senders hit keyless rate endpoint or fetch local cache.
  2. Payer fields captured via Formik → Validation verifies constraint limits using Yup.
  3. Form submits → Redux registers expense, auto-translating foreign amounts to base currency.
  4. Redux store subscribers stringify state changes back to `localStorage`.
  5. Derived hooks (`useCalculateBalances`, `useSettleUp`) recalculate debts.
  6. Settle Up layout maps UPI/PayPal me deep-link strings based on payee handles.
* **Major Components:** `CreateTripForm`, `AddMemberForm`, `TripDashboard`, `AddExpenseForm`, `RunningBalancesList`, `CategoryPieChart`, `SettleUpSummary`, `TripSummaryReport` (print overlay).
* **External Integrations:** Sourced FX rate data from keyless `https://open.er-api.com/v6/latest/` API endpoint.

---

## 4. Project Structure
```text
src/
├── features/               # Business feature modules
│   ├── balance/            # Calculation hooks, chart visuals, printable summary layout
│   │   ├── components/     # RunningBalancesList, CategoryPieChart, SettleUpSummary, TripSummaryReport
│   │   └── hooks/          # useCalculateBalances.ts, useSettleUp.ts
│   ├── expense/            # Expense logging forms and uploads
│   │   └── components/     # AddExpenseForm
│   └── trip/               # Trip initialization and member models
│       ├── components/     # CreateTripForm, AddMemberForm, TripDashboard
│       └── tripSlice.ts    # Redux Reducers (addTrip, addExpense, addMember)
├── hooks/                  # Typed React-Redux hooks (useAppSelector, useAppDispatch)
├── services/               # Currency Engine operations
│   └── currencyService.ts  # FX fetches, cache managers, convertToBaseCurrency utilities
├── store/                  # Store configurations and LocalStorage serialization subscribes
│   └── index.ts            
├── types/                  # Typescript interfaces (Member, Expense, Trip)
│   └── index.ts
├── App.tsx                 # Base layout mounting grids
└── index.css               # Google Outfit font, HSL color tokens, global reset
```

---

## 5. Module Summary
| Module | Purpose | Key Components | Dependencies |
| :--- | :--- | :--- | :--- |
| **Trip** | Setup trip records, base currencies, and member rosters. | `CreateTripForm`, `AddMemberForm`, `TripDashboard`, `tripSlice` | Redux, Formik, Yup |
| **Expense** | Log custom entries with original currencies, categories, and photos. | `AddExpenseForm` | Redux, Formik, Yup, Lucide Icons |
| **Balance** | Compute net balances and debt resolution paths. | `useCalculateBalances`, `useSettleUp`, `RunningBalancesList` | React Hooks, Redux |
| **Currency** | Handle currency fetches, local cache storage, and conversion math. | `currencyService` | localStorage, browser fetch API |
| **Settlement**| Route deep-links for pre-filled payment layouts. | `SettleUpSummary` | upi:// intent, paypal.me link generator |
| **Analytics** | Aggregate category distributions and draw donut graphs. | `CategoryPieChart` | CSS conic-gradients, SVGs |
| **Export** | Format printable PDF invoices of active logs. | `TripSummaryReport` | `@media print` CSS directives |

---

## 6. Environment & Setup
* **Required Environment Variables:** None (runs purely client-side; FX API is keyless).
* **Installation Steps:** Navigate to `trip-budget-tracker` and run `npm install`.
* **Local Setup:** Ensure Node.js (v18+) is installed.
* **Build Commands:** `npm run build` (transpiles typecheck and compiles output into `dist/`).
* **Run Commands:** `npm run dev` (spins local dev server at `http://localhost:5173`).

---

## 7. Business Workflows

### 1. Trip Setup
* **Purpose:** Create a trip workspace with a baseline currency.
* **Steps:** Input trip name → Select base currency from dropdown → Click 'Start Trip'.
* **Validation:** Title must be populated. Base currency is required.
* **Outcome:** Trip structure is initialized, and dashboard forms are enabled.

### 2. Member Enrollment
* **Purpose:** Add participants with their UPI or PayPal handles.
* **Steps:** Input member name → Optionally input UPI ID (VPA) and PayPal username → Click 'Add Member'.
* **Validation:** Name must be ≥ 2 characters. Payment handles are optional.
* **Outcome:** Member roster is updated; payment handles are saved for settlement.

### 3. Expense Logging
* **Purpose:** Record costs in any currency, assigning tags and attachment proof.
* **Steps:** Select Payer → Select Category → Select Currency → Input Amount → Input Description → Optionally choose receipt file → Save.
* **Validation:** Payer must be selected. Category required. Amount must be positive number. Description is required. Photo must be JPEG/PNG/HEIC and ≤ 10MB.
* **Outcome:** Original values are converted to base currency via the Currency Engine and saved. Balances update instantly.

### 4. Settlement Payments
* **Purpose:** Pay back members directly using mobile deep-links.
* **Steps:** View Settle Up Summary → Click "Pay via UPI" (opens mobile payment app pre-filled) or "PayPal Me" (opens browser/app checkout page).
* **Outcome:** Payer executes the transfer on their external platform.

---

## 8. Security & Error Handling
* **Authentication & Authorization:** Client-side in-memory session. Access limits depend on link sharing (unauthenticated).
* **Sensitive Data Handling:** Member VPAs, PayPal IDs, and base64 receipt images are stored exclusively inside the client's local storage.
* **Validation Strategy:** Enforced through Yup schema constraints. File format and size checks are run programmatically before encoding files.
* **Error Handling Strategy:** Inline input validations and warning banners highlight cache limits or missing inputs.

| Scenario | Expected Behavior |
| :--- | :--- |
| Uploading a text file as a receipt | Upload is blocked; inline validation displays "Invalid format. Accepts JPEG, PNG, HEIC." |
| Uploading a 15MB receipt image | Upload is blocked; inline validation displays "File size exceeds 10MB limit." |
| Attempting to add an expense offline with no cache | Save button alerts "Exchange rates are unavailable. Cannot compute conversion." |
| Adding foreign expense offline with cache older than 24h | Save is blocked; alert warning notifies that stale rates cannot be used offline. |
| Clicking UPI link on desktop | System attempts to launch registered protocol handler or fails silently; fallback browser PayPal option handles payments. |

---

## 9. Known Limitations & Future Enhancements
| Type | Description | Priority |
| :--- | :--- | :--- |
| **Limitation** | **Offline FX Limits:** If the user is offline and the local cache is older than 24 hours, new foreign-currency expenses are blocked. | **Medium** |
| **Limitation** | **Browser Memory Capacity:** Large base64 receipt attachments can exceed local storage quotas (usually 5MB) if too many are added. | **High** |
| **Enhancement** | **File Compression:** Automatically compress uploaded receipt photos in the browser before base64 stringification. | **High** |
| **Enhancement** | **Remote Cloud Syncing:** Migrate local storage syncing to Firebase Firestore and Firebase Storage for cross-device trips. | **High** |

---

## 10. Developer Quick Start

1. **Clone and Navigate:**
   ```bash
   cd trip-budget-tracker
   ```
2. **Install Packages:**
   ```bash
   npm install
   ```
3. **Run Dev Environment:**
   ```bash
   npm run dev
   ```
4. **Compile Production Bundle:**
   ```bash
   npm run build
   ```
