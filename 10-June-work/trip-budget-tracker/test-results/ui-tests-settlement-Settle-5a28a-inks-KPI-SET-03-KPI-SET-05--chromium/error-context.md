# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests\settlement.spec.ts >> Settlement Module (KPI-BAL-03, KPI-BAL-04, KPI-SET-03, KPI-SET-05) >> Generates UPI and PayPal deep-links (KPI-SET-03, KPI-SET-05)
- Location: tests\ui-tests\settlement.spec.ts:37:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /Pay via PayPal/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: /Pay via PayPal/i }).first()

```

```yaml
- banner:
  - text: T
  - heading "Trip Budget Tracker v3" [level=1]
  - paragraph: qa-1781801926838-gbqco@trip-test.local
  - button "Logout"
- main:
  - heading "Settlement Trip" [level=1]
  - paragraph: "Base Currency: USD"
  - button "Export Summary"
  - heading "Trip Members (2)" [level=3]
  - text: Alice (UPI/PayPal) Bob
  - textbox "Name (e.g. Alice)"
  - textbox "UPI ID (e.g. name@upi)"
  - textbox "PayPal Me (e.g. name123)"
  - button "Add Member"
  - heading "Add an Expense" [level=2]
  - text: Who paid?
  - combobox:
    - option "Select a member" [disabled] [selected]
    - option "Alice"
    - option "Bob"
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
  - text: Food Jun 18 Tickets Paid by Alice USD 100.00
  - heading "Running Balances" [level=2]
  - text: Alice +USD 50.00 Bob USD -50.00
  - paragraph: "Positive balance: They are owed money."
  - paragraph: "Negative balance: They owe money."
  - heading "Category Breakdown" [level=2]
  - text: USD 100 Food 100.0% USD 100.00
  - heading "Settle Up Summary" [level=2]
  - text: Bob Alice USD 50.00
  - link "Pay via UPI":
    - /url: upi://pay?pa=alice@upi&pn=Alice&am=50.00&cu=USD
  - button "Copy UPI ID to clipboard"
  - link "PayPal Me":
    - /url: https://www.paypal.me/alice_pp/50.00
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { setupAuthenticatedSession } from '../utils/auth-helpers';
  3  | 
  4  | test.describe('Settlement Module (KPI-BAL-03, KPI-BAL-04, KPI-SET-03, KPI-SET-05)', () => {
  5  |   test.beforeEach(async ({ page, request }) => {
  6  |     await setupAuthenticatedSession(page, request);
  7  |     await page.getByLabel(/Trip Title/i).fill('Settlement Trip');
  8  |     await page.getByRole('button', { name: /Start Trip/i }).click();
  9  | 
  10 |     await page.locator('input#name').fill('Alice');
  11 |     await page.locator('input#upiId').fill('alice@upi');
  12 |     await page.locator('input#paypalUsername').fill('alice_pp');
  13 |     await page.getByRole('button', { name: /Add Member/i }).click();
  14 | 
  15 |     await page.locator('input#name').fill('Bob');
  16 |     await page.getByRole('button', { name: /Add Member/i }).click();
  17 | 
  18 |     await page.locator('select#payerId').selectOption({ label: 'Alice' });
  19 |     await page.locator('input#amount').fill('100');
  20 |     await page.locator('input#description').fill('Tickets');
  21 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  22 |     await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('Validates multi-currency balance accuracy and base currency display (KPI-BAL-03, KPI-BAL-04)', async ({ page }) => {
  26 |     await expect(page.getByText('+USD 50.00')).toBeVisible();
  27 |     await expect(page.getByText('USD -50.00')).toBeVisible();
  28 | 
  29 |     await page.locator('select#payerId').selectOption({ label: 'Bob' });
  30 |     await page.locator('select#currency').selectOption('EUR');
  31 |     await page.locator('input#amount').fill('50');
  32 |     await page.locator('input#description').fill('Taxi');
  33 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  34 |     await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  35 |   });
  36 | 
  37 |   test('Generates UPI and PayPal deep-links (KPI-SET-03, KPI-SET-05)', async ({ page }) => {
  38 |     await expect(page.getByRole('link', { name: /Pay via UPI/i }).first()).toBeVisible();
> 39 |     await expect(page.getByRole('link', { name: /Pay via PayPal/i }).first()).toBeVisible();
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
  40 |   });
  41 | });
  42 | 
```