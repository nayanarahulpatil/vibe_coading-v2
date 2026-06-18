# Tailwind CSS Modules Integration Plan

This plan outlines the steps to integrate Tailwind CSS directives via standard CSS Modules (`.module.css`) into the existing feature-based architecture of the `trip-budget-tracker` without disrupting the current user flow. This will decouple the styling logic from the component logic, adhering strictly to the updated `react_js_persona.md`.

## User Review Required

> [!IMPORTANT]
> Please review this refactoring strategy. We will migrate all inline `className="..."` utility strings into dedicated CSS Module files using Tailwind's `@apply` directive. 

## Proposed Changes

We will create a `.module.css` file adjacent to every React component and migrate the inline Tailwind classes.

### 1. `src/App.tsx`
- **[NEW]** `src/App.module.css`
  - `.container { @apply min-h-screen bg-slate-50 text-slate-800 font-sans pb-12; }`
  - `.header { @apply bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm; }`
  - (etc.)
- **[MODIFY]** `src/App.tsx` -> Import styles and update `className={styles.container}`.

### 2. Trip Feature (`src/features/trip/components/`)
- **[NEW]** `TripDashboard.module.css`
- **[MODIFY]** `TripDashboard.tsx`
- **[NEW]** `CreateTripForm.module.css`
- **[MODIFY]** `CreateTripForm.tsx`
- **[NEW]** `AddMemberForm.module.css`
- **[MODIFY]** `AddMemberForm.tsx`

### 3. Expense Feature (`src/features/expense/components/`)
- **[NEW]** `AddExpenseForm.module.css`
- **[MODIFY]** `AddExpenseForm.tsx`

### 4. Balance Feature (`src/features/balance/components/`)
- **[NEW]** `RunningBalancesList.module.css`
- **[MODIFY]** `RunningBalancesList.tsx`
- **[NEW]** `SettleUpSummary.module.css`
- **[MODIFY]** `SettleUpSummary.tsx`

## Verification Plan

### Automated Tests
- The Vite build (`npm run build`) will be executed to ensure CSS Modules are correctly resolved and parsed by Tailwind v4.

### Manual Verification
- We will view the running application in the browser. The visual design and responsive layout should remain exactly the same as before, confirming the CSS modules refactoring didn't break the existing flow.
