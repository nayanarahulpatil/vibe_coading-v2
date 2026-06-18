# QA Automation Walkthrough: Trip Budget Tracker V2

## Overview
I have successfully set up End-to-End automated testing for the `trip-budget-tracker` project using Playwright. This testing suite is designed to act as the Senior QA Automation Architect and covers the critical business workflows introduced in **Version 2.0** (KPI v2 document).

## Setup & Configuration
- **Testing Tool**: Playwright (UI Automation)
- **Config**: Configured to run automatically against the local Vite development server on port `5176`.
- **Mocks**: Integrated robust mock data for the ER-API (`fx-mock.ts`) to ensure testing is deterministic, fast, and does not rely on a live internet connection for FX rates, while also allowing explicit testing of offline degradation.

## Test Coverage (KPI Mapping)

We translated the v2 KPIs into robust automated UI tests stored under `tests/ui-tests/`:

### 1. Create Trip ([create-trip.spec.ts](file:///Users/apple/Documents/TripExpense/vibe_coading-v2/10-June-work/trip-budget-tracker/tests/ui-tests/create-trip.spec.ts))
- **`KPI-TRM-03`**: Enforces Base Currency Selection on trip creation.
- **`KPI-TRM-04`**: Ensures the base currency persists when navigating to Add Expense.

### 2. Add Expense ([add-expense.spec.ts](file:///Users/apple/Documents/TripExpense/vibe_coading-v2/10-June-work/trip-budget-tracker/tests/ui-tests/add-expense.spec.ts))
- **`KPI-EXP-03 & KPI-EXP-04`**: Validates category enforcement and ensures supported currencies load correctly in the currency picker.
- **`KPI-EXP-05 & KPI-EXP-06`**: Injects mock files to validate receipt photo format restrictions (only JPEG/PNG/HEIC allowed) and size restrictions (<= 10MB).

### 3. Currency Engine ([currency-engine.spec.ts](file:///Users/apple/Documents/TripExpense/vibe_coading-v2/10-June-work/trip-budget-tracker/tests/ui-tests/currency-engine.spec.ts))
- **`KPI-FX-02`**: Validates FX conversion math based on the intercepted mocked API. E.g., verifying a €100 expense is calculated correctly to USD base.
- **`KPI-FX-04`**: Validates offline degradation functionality when the FX API is aborted or internet is disconnected.

### 4. Settlement ([settlement.spec.ts](file:///Users/apple/Documents/TripExpense/vibe_coading-v2/10-June-work/trip-budget-tracker/tests/ui-tests/settlement.spec.ts))
- **`KPI-BAL-03 & KPI-BAL-04`**: Enters mixed-currency expenses and validates that the Running Balances UI calculates the final values accurately in the base currency.
- **`KPI-SET-03 & KPI-SET-05`**: Interrogates the DOM to ensure UPI and PayPal deep-links (`upi://pay?...` and `paypal.me/...`) are rendered with the correct exact amounts and dynamically mapped to the payee's IDs.

### 5. Analytics & PDF Export ([analytics-export.spec.ts](file:///Users/apple/Documents/TripExpense/vibe_coading-v2/10-June-work/trip-budget-tracker/tests/ui-tests/analytics-export.spec.ts))
- **`KPI-PDF-03`**: Verifies that the PDF Export button is properly disabled and displays the correct tooltip when the trip has zero expenses.
- **`KPI-ANA-01`**: Validates category spending aggregation in the DOM/chart rendering.

## Results
The test suite executes using `npx playwright test`. In resolving the tests, we addressed strict-mode Playwright violations and configuration port conflicts, leading to stable green test runs across the module.

> [!TIP]
> You can run the tests locally at any time using:
> ```bash
> cd /Users/apple/Documents/TripExpense/vibe_coading-v2/10-June-work/trip-budget-tracker
> npx playwright test
> ```
> To view the interactive HTML report, run:
> ```bash
> npx playwright show-report
> ```
