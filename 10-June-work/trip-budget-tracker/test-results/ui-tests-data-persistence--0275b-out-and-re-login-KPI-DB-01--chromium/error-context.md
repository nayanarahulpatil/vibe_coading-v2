# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests\data-persistence.spec.ts >> Data Persistence UI (KPI-DB-01, KPI-DB-02, KPI-BAL-05) >> TC-UI-DB-001: Trip survives logout and re-login (KPI-DB-01)
- Location: tests\ui-tests\data-persistence.spec.ts:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Durability Trip')
Expected: visible
Error: strict mode violation: getByText('Durability Trip') resolved to 2 elements:
    1) <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Durability Trip</h1> aka getByRole('heading', { name: 'Durability Trip' })
    2) <h1 class="print:text-2xl print:font-extrabold print:text-slate-900">Durability Trip — Trip Budget Summary</h1> aka getByText('Durability Trip — Trip Budget')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Durability Trip')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]: T
        - generic [ref=e8]:
          - heading "Trip Budget Tracker v3" [level=1] [ref=e9]
          - paragraph [ref=e10]: durability-1781801914415-mdf98@trip-test.local
      - button "Logout" [ref=e11] [cursor=pointer]:
        - img [ref=e12]
        - generic [ref=e15]: Logout
  - main [ref=e16]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - heading "Durability Trip" [level=1] [ref=e22]
          - paragraph [ref=e23]: "Base Currency: INR"
        - button "Export Summary" [disabled] [ref=e24] [cursor=pointer]:
          - img [ref=e25]
          - generic [ref=e29]: Export Summary
      - generic [ref=e30]:
        - generic [ref=e31]:
          - img [ref=e32]
          - heading "Trip Members (0)" [level=3] [ref=e37]
        - paragraph [ref=e39]: No members added yet.
        - generic [ref=e41]:
          - generic [ref=e42]:
            - textbox "Name (e.g. Alice)" [ref=e44]
            - textbox "UPI ID (e.g. name@upi)" [ref=e46]
            - textbox "PayPal Me (e.g. name123)" [ref=e48]
          - button "Add Member" [ref=e49] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { setupAuthenticatedSession, loginViaUI, registerViaApi } from '../utils/auth-helpers';
  3  | import { uniqueEmail } from '../test-data/auth-data';
  4  | 
  5  | test.describe('Data Persistence UI (KPI-DB-01, KPI-DB-02, KPI-BAL-05)', () => {
  6  |   test('TC-UI-DB-001: Trip survives logout and re-login (KPI-DB-01)', async ({ page, request }) => {
  7  |     const email = uniqueEmail('durability');
  8  |     await registerViaApi(request, email);
  9  | 
  10 |     await loginViaUI(page, email);
  11 |     await page.getByLabel(/Trip Title/i).fill('Durability Trip');
  12 |     await page.getByLabel(/Base Currency/i).selectOption('INR');
  13 |     await page.getByRole('button', { name: /Start Trip/i }).click();
> 14 |     await expect(page.getByText('Durability Trip')).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  15 | 
  16 |     await page.getByRole('button', { name: /Logout/i }).click();
  17 |     await expect(page).toHaveURL(/\/login/);
  18 | 
  19 |     await loginViaUI(page, email);
  20 |     await expect(page.getByText('Durability Trip')).toBeVisible({ timeout: 15000 });
  21 |     await expect(page.getByText(/Base Currency: INR/i)).toBeVisible();
  22 |   });
  23 | 
  24 |   test('TC-UI-DB-002: Expense and balance survive re-login (KPI-DB-02, KPI-BAL-05)', async ({ page, request }) => {
  25 |     const { email } = await setupAuthenticatedSession(page, request);
  26 | 
  27 |     await page.getByLabel(/Trip Title/i).fill('Expense Persist Trip');
  28 |     await page.getByRole('button', { name: /Start Trip/i }).click();
  29 |     await page.locator('input#name').fill('Alice');
  30 |     await page.getByRole('button', { name: /Add Member/i }).click();
  31 |     await page.locator('input#name').fill('Bob');
  32 |     await page.getByRole('button', { name: /Add Member/i }).click();
  33 | 
  34 |     await page.locator('select#payerId').selectOption({ label: 'Alice' });
  35 |     await page.locator('input#amount').fill('100');
  36 |     await page.locator('input#description').fill('Dinner');
  37 |     await page.getByRole('button', { name: /Save Expense/i }).click();
  38 |     await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  39 |     await expect(page.getByText('+USD 50.00')).toBeVisible();
  40 | 
  41 |     await page.getByRole('button', { name: /Logout/i }).click();
  42 |     await loginViaUI(page, email);
  43 | 
  44 |     await expect(page.getByText('Expense Persist Trip')).toBeVisible({ timeout: 15000 });
  45 |     await expect(page.getByText('Dinner')).toBeVisible();
  46 |     await expect(page.getByText('+USD 50.00')).toBeVisible();
  47 |   });
  48 | 
  49 |   test('TC-UI-DB-003: Auth token only in localStorage (KPI-DB-09)', async ({ page, request }) => {
  50 |     await setupAuthenticatedSession(page, request);
  51 |     const storage = await page.evaluate(() => ({
  52 |       token: localStorage.getItem('trip_budget_tracker_token'),
  53 |       tripState: localStorage.getItem('trip_budget_tracker_state'),
  54 |     }));
  55 |     expect(storage.token).toBeTruthy();
  56 |     expect(storage.tripState).toBeNull();
  57 |   });
  58 | });
  59 | 
```