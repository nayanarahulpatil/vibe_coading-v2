# QA Automation Implementation Plan: Trip Budget Tracker V2

This plan outlines the approach to generate and execute test cases for the implemented `trip-budget-tracker` based on the provided QA Persona and KPI v2 document.

## Goal Description
The objective is to establish an automated testing suite using Playwright (as per the QA persona preference) to validate the new features introduced in the V2 codebase (Currency Engine, Analytics, PDF Export, Enhanced Expense Entry, Settlement Deep-links). We will generate test cases in `trip-budget-tracker/tests` and execute them using mock data to ensure system reliability, functionality, and accurate calculations.

## User Review Required
> [!IMPORTANT]
> - Playwright will be installed as a devDependency in the `trip-budget-tracker` directory.
> - The tests will run against the local Vite development server (`npm run dev`), which we'll need to spin up via Playwright's `webServer` configuration.
> - Please approve the use of Playwright for End-to-End UI testing before proceeding.

## Open Questions
> [!WARNING]
> 1. Do you want to include unit tests (e.g., via Vitest for calculating balances and FX rate parsing) or purely focus on E2E Playwright tests as implied by the QA persona?
> 2. Should we mock the ER-API responses globally inside Playwright to ensure the tests are deterministic and don't rely on live internet connections?

## Proposed Changes

### Configuration & Tooling
#### [NEW] playwright.config.ts
Setup Playwright configuration to run tests against `http://localhost:5173`, automatically starting the vite server. Add package dependencies via `npm install -D @playwright/test`.

### Test Cases
We will structure the features under `tests/` based on the KPI modules:

#### [NEW] tests/ui-tests/create-trip.spec.ts
- Validate base currency selection enforcement (KPI-TRM-03).
- Validate base currency persistence (KPI-TRM-04).

#### [NEW] tests/ui-tests/add-expense.spec.ts
- Validate category enforcement (KPI-EXP-03) and currency picker (KPI-EXP-04).
- Validate receipt photo format/size (KPI-EXP-05, KPI-EXP-06).

#### [NEW] tests/ui-tests/currency-engine.spec.ts
- Validate FX conversion accuracy using mocked API routes (KPI-FX-02).
- Validate offline degradation when API fails (KPI-FX-04).

#### [NEW] tests/ui-tests/settlement.spec.ts
- Validate accurate UI balances (KPI-BAL-03, KPI-BAL-04).
- Validate UPI and PayPal deep-link generation logic based on DOM attributes (KPI-SET-03, KPI-SET-05).

#### [NEW] tests/ui-tests/analytics-export.spec.ts
- Validate category aggregation logic visible on UI (KPI-ANA-01).
- Validate PDF export button disabled states (KPI-PDF-03).

### Mock Data & Fixtures
#### [NEW] tests/mocks/fx-mock.ts
Mock responses for `open.er-api.com` to ensure consistent FX calculations.

#### [NEW] tests/test-data/trip-data.ts
Sample users, expenses, and receipt photos to inject into the test flows.

## Verification Plan

### Automated Tests
- Run `npx playwright install`
- Run `npx playwright test` to execute all test cases.
- Generate and review Playwright HTML reports for test execution details and coverage.
