# Developer Handover & Workflow Document

## 1. Project Overview
* **Project Name:** Trip Budget Tracker
* **Business Purpose:** Provide a seamless and straightforward way for groups of friends to track shared expenses during trips.
* **Problem Statement:** Friends planning a group trip often argue about splitting costs and face challenges manually calculating who owes whom.
* **Solution Summary:** A client-side React application that allows users to initialize a trip, add members, record expenses, and automatically compute running balances alongside an optimal "settle up" payment summary.
* **Key Features:** Trip initialization, Member management, Expense tracking, Real-time running balance calculation, Debt resolution (Settle Up) summary.

---

## 2. Technology Stack
| Layer          | Technologies |
| -------------- | ------------ |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **State Management** | Redux Toolkit, React-Redux |
| **Styling & UI** | Tailwind CSS v4, Lucide React (Icons) |
| **Forms & Validation**| Formik, Yup |
| **Package Manager** | npm |

---

## 3. Architecture Overview
* **High-Level Architecture:** The application is a Single-Page Application (SPA) built purely on the client side using Vite and React.
* **Request/Data Flow:** User inputs data via Formik-managed forms -> Yup validates inputs -> React components dispatch Redux actions -> Redux `tripSlice` updates the centralized global state -> React hooks (`useCalculateBalances`, `useSettleUp`) recalculate derived data -> UI re-renders automatically to reflect new balances.
* **Major Components:** `TripDashboard`, `AddExpenseForm`, `RunningBalancesList`, `SettleUpSummary`.
* **External Integrations:** None. All logic and state are handled in-memory in the browser.

---

## 4. Project Structure
The frontend follows a scalable feature-based architecture (Enterprise standard):

```text
src/
├── features/               # Core business features
│   ├── balance/            # Custom hooks and UI for mathematical debt resolution
│   ├── expense/            # Forms and UI for recording expenses
│   └── trip/               # Redux slice, member forms, and main dashboard UI
├── hooks/                  # Typed Redux hooks (`useAppDispatch`, `useAppSelector`)
├── store/                  # Redux root configuration
├── types/                  # Global TypeScript interfaces (`Trip`, `Member`, `Expense`)
├── App.tsx                 # Main application assembly and layout
└── index.css               # Global Tailwind CSS imports and theme variables
```

---

## 5. Module Summary
| Module | Purpose | Key Components / Files | Dependencies |
| ------ | ------- | -------------- | ------------ |
| **Trip** | Manages the core trip entity and member roster | `tripSlice.ts`, `CreateTripForm.tsx`, `AddMemberForm.tsx`, `TripDashboard.tsx` | Redux, Formik, Yup |
| **Expense** | Records individual transaction data | `AddExpenseForm.tsx` | Redux, Formik, Yup |
| **Balance** | Computes running balances and optimal settlement paths | `useCalculateBalances.ts`, `useSettleUp.ts`, `RunningBalancesList.tsx`, `SettleUpSummary.tsx` | React (Hooks), Redux |

---

## 6. Environment & Setup
* **Required Environment Variables:** None required for the current phase.
* **Installation Steps:** Navigate to the project root (`trip-budget-tracker`) and run package installation.
* **Local Setup:** Ensure Node.js (v18+) is installed.
* **Build Commands:** `npm run build` (Runs `tsc -b` and `vite build`).
* **Run Commands:** `npm run dev` (Starts the Vite local development server).

---

## 7. Business Workflows

### 1. Initialize Trip & Members
* **Purpose:** Setup a new trip space.
* **Steps:** Enter a trip title -> Submit -> Enter member names -> Submit.
* **Validation Rules:** Trip title is required. Member name is required and > 2 characters.
* **Expected Outcome:** Trip is stored in Redux; dashboard displays the active trip and its member roster.

### 2. Record an Expense
* **Purpose:** Log a shared cost.
* **Steps:** Select the payer from a dropdown -> Enter amount -> Enter description -> Submit.
* **Validation Rules:** Payer must be selected. Amount must be a positive number (>0). Description is required.
* **Expected Outcome:** Expense is appended to the `currentTrip.expenses` array in Redux. Balances instantly recalculate.

### 3. Settle Up Generation
* **Purpose:** Calculate exactly who owes whom to resolve all debts.
* **Steps:** Automatically triggered when state changes.
* **Validation Rules:** Compares net paid vs. fair share per member.
* **Expected Outcome:** Displays a list of direct transactions (e.g., "Alice -> Bob $15.00") that efficiently balances the accounts.

---

## 8. Security & Error Handling
* **Authentication & Authorization:** Not applicable; currently runs locally in-browser without persistent user accounts.
* **Sensitive Data Handling:** Financial data resides purely in client memory and is lost on refresh. No external tracking.
* **Validation Strategy:** All user inputs are sanitized and strictly validated client-side using Yup schemas before reaching the Redux dispatcher.
* **Error Handling Strategy:** Inline field-level error messages highlight validation failures instantly.

| Scenario | Expected Behavior |
| -------- | ----------------- |
| User inputs a negative expense amount | Yup blocks submission; displays "Amount must be greater than 0" text in red under the input. |
| User attempts to save an expense without a description | Formik blocks submission; displays "Description is required". |
| Floating point arithmetic generates fractional cents (e.g., $10 / 3) | Settlement algorithm utilizes specific precision boundaries (e.g., `> 0.01`) and rounds to 2 decimal places to prevent infinite trailing errors. |

---

## 9. Known Limitations & Future Enhancements
| Type | Description | Priority |
| ---- | ----------- | -------- |
| **Limitation** | **Volatile State:** Because data is held in Redux without persistence, refreshing the page wipes all trip data. | **High** |
| **Enhancement** | **Persistence Layer:** Implement `redux-persist` using `localStorage` or integrate a Node.js backend/database. | **High** |
| **Limitation** | **Equal Splits Only:** Currently, expenses are implicitly split equally among all members. | **Medium** |
| **Enhancement** | **Custom Splits:** Add UI and logic to assign specific portions of an expense to specific members. | **Medium** |
| **Enhancement** | **Multiple Currencies:** Allow expenses in different currencies with an FX conversion rate. | **Low** |

---

## 10. Developer Quick Start

To begin contributing to the codebase immediately:

1. **Navigate to project directory:**
   ```bash
   cd trip-budget-tracker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:** 
   *(No configuration required for current phase).*
4. **Run the application:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*
5. **Execute tests:** 
   *(Unit testing frameworks like Jest can be set up in future sprints; core business logic resides entirely in custom hooks under `src/features/balance/hooks`).*
6. **Build project:**
   ```bash
   npm run build
   ```
   *Output will be generated in the `/dist` directory.*
