# Build Shared Trip Budget Tracker

This plan outlines the architecture and steps to build the shared trip budget tracker inside the `10-June-work` directory, strictly adhering to the React Developer persona (React, TypeScript, Formik + Yup, Material UI, Jest).

## User Review Required

> [!IMPORTANT]
> According to `project_boundry.md`, terminal commands require explicit confirmation. I will need your approval to run the React initialization commands (e.g., `npx -y create-vite@latest trip-budget-tracker --template react-ts`) once you approve this plan.

> [!WARNING]
> Please review the Open Questions below before approving the plan.

## Open Questions

> [!WARNING]
> 1. **Project Directory:** Should I create a new subfolder inside `10-June-work` named `trip-budget-tracker` for the React app, or initialize it directly inside the `10-June-work` folder? (Creating a subfolder is recommended to keep things clean).
> 2. **State Management:** The React persona has Redux Toolkit commented out. Since this is a simple tracker, should we use standard React Context API or install Redux Toolkit?

## Proposed Changes

### 1. Initialization
- Run `npx -y create-vite@latest trip-budget-tracker --template react-ts` (assuming subfolder).
- Install dependencies: `@emotion/react @emotion/styled formik yup`.

### 2. Folder Structure
- Create the enterprise structure defined in `react_js_persona.md`:
  - `src/features/trip/`
  - `src/features/expense/`
  - `src/features/settlement/`
  - `src/components/` (Shared UI)
  - `src/types/`
  - `src/hooks/`

### 3. Core Data Types (`src/types/index.ts`)
- `Member`: `{ id: string, name: string }`
- `Expense`: `{ id: string, payerId: string, amount: number, description: string }`
- `Trip`: `{ id: string, title: string, members: Member[], expenses: Expense[] }`

### 4. Features implementation
- **Trip & Member Management (`src/features/trip/`)**: Forms (Formik/Yup) to add members.
- **Expense Tracking (`src/features/expense/`)**: Forms to add expenses (who paid, for what, amount). Validation to prevent zero/negative amounts.
- **Settle Up Engine (`src/features/settlement/`)**: Algorithm to calculate who owes whom based on running balances.

## Verification Plan

### Automated Tests
- Write Jest / React Testing Library tests for the settlement calculation logic.
- Write tests for the Expense form validation.

### Manual Verification
- Start the development server (`npm run dev`).
- Run the 3-person, 3-expense test scenario to ensure accurate running balances and settle-up summary.
