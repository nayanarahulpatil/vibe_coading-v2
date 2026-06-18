# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests/analytics-export.spec.ts >> Analytics & PDF Export Module (KPI-ANA-01, KPI-PDF-03) >> Validates category aggregation logic in chart (KPI-ANA-01)
- Location: tests/ui-tests/analytics-export.spec.ts:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText('Food').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Food').first()
    14 × locator resolved to <option value="Food" class="bg-white">Food</option>
       - unexpected value "hidden"

```

```yaml
- banner:
  - text: T
  - heading "Trip Budget Tracker v2" [level=1]
  - button "Leave Trip"
- main:
  - heading "Analytics Trip" [level=1]
  - paragraph: "Base Currency: USD"
  - button "Export Summary"
  - heading "Trip Members (1)" [level=3]
  - text: Alice
  - textbox "Name (e.g. Alice)"
  - textbox "UPI ID (e.g. name@upi)"
  - textbox "PayPal Me (e.g. name123)"
  - button "Add Member"
  - heading "Add an Expense" [level=2]
  - text: Who paid?
  - combobox:
    - option "Select a member" [disabled] [selected]
    - option "Alice"
  - text: Category
  - combobox:
    - option "Food" [selected]
    - option "Transport"
    - option "Accommodation"
    - option "Entertainment"
    - option "Other"
  - text: Currency
  - combobox:
    - option "USD" [selected]
    - option "EUR"
    - option "GBP"
    - option "INR"
    - option "JPY"
    - option "AUD"
    - option "CAD"
    - option "SGD"
    - option "CHF"
    - option "CNY"
  - text: Amount
  - textbox "0.00"
  - text: Description
  - textbox "e.g. Dinner, Taxi"
  - text: Attach Receipt Photo
  - button "Choose File"
  - text: Upload JPEG, PNG or HEIC (max 10MB)
  - button "Save Expense"
  - heading "Expense Log" [level=2]
  - text: Transport Jun 18 Bus Paid by Alice USD 50.00 Food Jun 18 Lunch Paid by Alice USD 40.00 Food Jun 18 Dinner Paid by Alice USD 60.00
  - heading "Running Balances" [level=2]
  - text: Alice USD 0.00
  - paragraph: "Positive balance: They are owed money."
  - paragraph: "Negative balance: They owe money."
  - heading "Category Breakdown" [level=2]
  - text: USD 150 Food 66.7% USD 100.00 Transport 33.3% USD 50.00
  - heading "Settle Up Summary" [level=2]
  - text: Everyone is settled up! No debts.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { mockFxRates } from '../mocks/fx-mock';
  3  | 
  4  | test.describe('Analytics & PDF Export Module (KPI-ANA-01, KPI-PDF-03)', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await mockFxRates(page);
  7  |     await page.goto('/');
  8  | 
  9  |     await page.getByLabel(/Trip Title/i).fill('Analytics Trip');
  10 |     await page.getByRole('button', { name: /Start Trip/i }).click();
  11 |     await page.locator('input#name').fill('Alice');
  12 |     await page.getByRole('button', { name: /Add Member/i }).click();
  13 |   });
  14 | 
  15 |   test('Validates PDF export button disabled state for zero expenses (KPI-PDF-03)', async ({ page }) => {
  16 |     // Should be disabled
  17 |     const exportBtn = page.getByRole('button', { name: /Export Summary/i });
  18 |     await expect(exportBtn).toBeDisabled();
  19 |     await expect(exportBtn).toHaveAttribute('title', 'Add at least one expense to export');
  20 |   });
  21 | 
  22 |   test('Validates category aggregation logic in chart (KPI-ANA-01)', async ({ page }) => {
  23 |     await page.locator('select#payerId').selectOption({ label: 'Alice' });
  24 |     await page.locator('select#category').selectOption('Food');
  25 |     await page.locator('input#amount').fill('60');
  26 |     await page.locator('input#description').fill('Dinner');
  27 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  28 | 
  29 |     await page.locator('select#payerId').selectOption({ label: 'Alice' });
  30 |     await page.locator('select#category').selectOption('Food');
  31 |     await page.locator('input#amount').fill('40');
  32 |     await page.locator('input#description').fill('Lunch');
  33 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  34 | 
  35 |     await page.locator('select#payerId').selectOption({ label: 'Alice' });
  36 |     await page.locator('select#category').selectOption('Transport');
  37 |     await page.locator('input#amount').fill('50');
  38 |     await page.locator('input#description').fill('Bus');
  39 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  40 | 
  41 |     // Chart should show Food: $100.00 and Transport: $50.00
  42 |     // Wait for canvas or custom chart logic. Since we don't know the exact dom, let's look for text.
> 43 |     await expect(page.getByText('Food').first()).toBeVisible();
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  44 |     await expect(page.locator('text=100').or(page.locator('text=$100.00')).first()).toBeVisible();
  45 |     await expect(page.getByText('Transport').first()).toBeVisible();
  46 |     await expect(page.locator('text=50').or(page.locator('text=$50.00')).first()).toBeVisible();
  47 | 
  48 |     const exportBtn = page.getByRole('button', { name: /Export PDF/i });
  49 |     await expect(exportBtn).toBeEnabled();
  50 |   });
  51 | });
  52 | 
```