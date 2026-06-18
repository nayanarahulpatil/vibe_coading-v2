# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests/settlement.spec.ts >> Settlement Module (KPI-BAL-03, KPI-BAL-04, KPI-SET-03, KPI-SET-05) >> Validates multi-currency balance accuracy and base currency display (KPI-BAL-03, KPI-BAL-04)
- Location: tests/ui-tests/settlement.spec.ts:28:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('-USD 50.00')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('-USD 50.00')

```

```yaml
- banner:
  - text: T
  - heading "Trip Budget Tracker v2" [level=1]
  - button "Leave Trip"
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
  2  | import { mockFxRates } from '../mocks/fx-mock';
  3  | 
  4  | test.describe('Settlement Module (KPI-BAL-03, KPI-BAL-04, KPI-SET-03, KPI-SET-05)', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await mockFxRates(page);
  7  |     await page.goto('/');
  8  | 
  9  |     await page.getByLabel(/Trip Title/i).fill('Settlement Trip');
  10 |     await page.getByRole('button', { name: /Start Trip/i }).click();
  11 |     
  12 |     // Add Members with UPI / Paypal
  13 |     await page.locator('input#name').fill('Alice');
  14 |     await page.locator('input#upiId').fill('alice@upi');
  15 |     await page.locator('input#paypalUsername').fill('alice_pp');
  16 |     await page.getByRole('button', { name: /Add Member/i }).click();
  17 | 
  18 |     await page.locator('input#name').fill('Bob');
  19 |     await page.getByRole('button', { name: /Add Member/i }).click();
  20 | 
  21 |     // Bob owes Alice. Alice pays.
  22 |     await page.locator('select#payerId').selectOption({ label: 'Alice' });
  23 |     await page.locator('input#amount').fill('100'); // 100 USD
  24 |     await page.locator('input#description').fill('Tickets');
  25 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  26 |   });
  27 | 
  28 |   test('Validates multi-currency balance accuracy and base currency display (KPI-BAL-03, KPI-BAL-04)', async ({ page }) => {
  29 |     // Total is 100 USD. Each owes 50. Alice paid 100, so her balance is +50. Bob is -50.
  30 |     await expect(page.getByText('+USD 50.00')).toBeVisible();
> 31 |     await expect(page.getByText('-USD 50.00')).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  32 | 
  33 |     // Now Alice pays in EUR
  34 |     await page.locator('select#payerId').selectOption({ label: 'Bob' });
  35 |     await page.locator('select#currency').selectOption('EUR'); // EUR rate 0.85 -> 50 EUR = 58.82 USD
  36 |     await page.locator('input#amount').fill('50');
  37 |     await page.locator('input#description').fill('Taxi');
  38 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  39 | 
  40 |     // Total expense: 100 USD + 58.8235 USD = 158.82 USD
  41 |     // Each share: 79.41 USD
  42 |     // Alice paid: 100 USD. Balance: +20.59 USD
  43 |     // Bob paid: 58.82 USD. Balance: -20.59 USD
  44 |     await expect(page.getByText('Alice: +$20.59')).toBeVisible();
  45 |     await expect(page.getByText('Bob: -$20.59')).toBeVisible();
  46 |   });
  47 | 
  48 |   test('Validates UPI and PayPal deep-link generation (KPI-SET-03, KPI-SET-05)', async ({ page }) => {
  49 |     // Navigate to Settlement (already visible usually in the bottom)
  50 |     // Bob owes Alice 50 USD
  51 |     // Click 'Settle Up' if it's a separate tab or just check the links
  52 |     const upiLink = page.locator('a[href*="upi://pay"]');
  53 |     await expect(upiLink).toBeVisible();
  54 |     await expect(upiLink).toHaveAttribute('href', /pa=alice@upi/);
  55 |     await expect(upiLink).toHaveAttribute('href', /am=50.00/);
  56 | 
  57 |     const paypalLink = page.locator('a[href*="paypal.me"]');
  58 |     await expect(paypalLink).toBeVisible();
  59 |     await expect(paypalLink).toHaveAttribute('href', /paypal\.me\/alice_pp\/50\.00/);
  60 |   });
  61 | });
  62 | 
```