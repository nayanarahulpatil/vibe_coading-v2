# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests\data-persistence.spec.ts >> Data Persistence UI (KPI-DB-01, KPI-DB-02, KPI-BAL-05) >> TC-UI-DB-002: Expense and balance survive re-login (KPI-DB-02, KPI-BAL-05)
- Location: tests\ui-tests\data-persistence.spec.ts:24:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Expense Persist Trip')
Expected: visible
Error: strict mode violation: getByText('Expense Persist Trip') resolved to 2 elements:
    1) <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Expense Persist Trip</h1> aka getByRole('heading', { name: 'Expense Persist Trip' })
    2) <h1 class="print:text-2xl print:font-extrabold print:text-slate-900">Expense Persist Trip — Trip Budget Summary</h1> aka getByText('Expense Persist Trip — Trip')

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Expense Persist Trip')

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
          - paragraph [ref=e10]: qa-1781801917581-s00oa@trip-test.local
      - button "Logout" [ref=e11] [cursor=pointer]:
        - img [ref=e12]
        - generic [ref=e15]: Logout
  - main [ref=e16]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]:
              - heading "Expense Persist Trip" [level=1] [ref=e22]
              - paragraph [ref=e23]: "Base Currency: USD"
            - button "Export Summary" [ref=e24] [cursor=pointer]:
              - img [ref=e25]
              - generic [ref=e29]: Export Summary
          - generic [ref=e30]:
            - generic [ref=e31]:
              - img [ref=e32]
              - heading "Trip Members (2)" [level=3] [ref=e37]
            - generic [ref=e38]:
              - generic "Alice" [ref=e39]:
                - generic [ref=e40]: Alice
              - generic "Bob" [ref=e41]:
                - generic [ref=e42]: Bob
            - generic [ref=e44]:
              - generic [ref=e45]:
                - textbox "Name (e.g. Alice)" [ref=e47]
                - textbox "UPI ID (e.g. name@upi)" [ref=e49]
                - textbox "PayPal Me (e.g. name123)" [ref=e51]
              - button "Add Member" [ref=e52] [cursor=pointer]
        - generic [ref=e53]:
          - generic [ref=e54]:
            - img [ref=e55]
            - heading "Add an Expense" [level=2] [ref=e58]
          - generic [ref=e59]: Fetching exchange rates...
          - generic [ref=e60]:
            - generic [ref=e61]:
              - generic [ref=e62]:
                - generic [ref=e63]: Who paid?
                - combobox [ref=e64] [cursor=pointer]:
                  - option "Select a member" [disabled] [selected]
                  - option "Alice"
                  - option "Bob"
              - generic [ref=e65]:
                - generic [ref=e66]: Category
                - combobox [ref=e67] [cursor=pointer]:
                  - option "Food" [selected]
                  - option "Transport"
                  - option "Accommodation"
                  - option "Entertainment"
                  - option "Other"
            - generic [ref=e68]:
              - generic [ref=e69]:
                - generic [ref=e70]: Currency
                - combobox [ref=e71] [cursor=pointer]:
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
              - generic [ref=e72]:
                - generic [ref=e73]: Amount
                - textbox "0.00" [ref=e74]
              - generic [ref=e75]:
                - generic [ref=e76]: Description
                - textbox "e.g. Dinner, Taxi" [ref=e77]
            - generic [ref=e78]:
              - generic [ref=e79]: Attach Receipt Photo
              - generic [ref=e80] [cursor=pointer]:
                - img [ref=e81]
                - button "Choose File" [ref=e84]
                - generic [ref=e85]: Upload JPEG, PNG or HEIC (max 10MB)
            - button "Save Expense" [ref=e86] [cursor=pointer]
        - generic [ref=e87]:
          - generic [ref=e88]:
            - img [ref=e89]
            - heading "Expense Log" [level=2] [ref=e92]
          - generic [ref=e94]:
            - generic [ref=e96]:
              - generic [ref=e97]:
                - generic [ref=e98]: Food
                - generic [ref=e99]: Jun 18
              - generic "Dinner" [ref=e100]
              - generic [ref=e101]: Paid by Alice
            - generic [ref=e104]: USD 100.00
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]:
            - img [ref=e109]
            - heading "Running Balances" [level=2] [ref=e112]
          - generic [ref=e113]:
            - generic [ref=e114]:
              - generic [ref=e116]: Alice
              - generic [ref=e117]: +USD 50.00
            - generic [ref=e118]:
              - generic [ref=e120]: Bob
              - generic [ref=e121]: USD -50.00
          - generic [ref=e122]:
            - paragraph [ref=e123]: "Positive balance: They are owed money."
            - paragraph [ref=e124]: "Negative balance: They owe money."
        - generic [ref=e125]:
          - generic [ref=e126]:
            - img [ref=e127]
            - heading "Category Breakdown" [level=2] [ref=e130]
          - generic [ref=e131]:
            - generic [ref=e135]:
              - generic [ref=e136]: USD
              - generic [ref=e137]: "100"
            - generic [ref=e139]:
              - generic [ref=e142]: Food
              - generic [ref=e143]:
                - generic [ref=e144]: 100.0%
                - generic [ref=e145]: USD 100.00
        - generic [ref=e146]:
          - generic [ref=e147]:
            - img [ref=e148]
            - heading "Settle Up Summary" [level=2] [ref=e151]
          - generic [ref=e154]:
            - generic [ref=e155]:
              - generic [ref=e156]: Bob
              - img [ref=e157]
              - generic [ref=e159]: Alice
            - generic [ref=e160]: USD 50.00
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
  14 |     await expect(page.getByText('Durability Trip')).toBeVisible();
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
> 44 |     await expect(page.getByText('Expense Persist Trip')).toBeVisible({ timeout: 15000 });
     |                                                          ^ Error: expect(locator).toBeVisible() failed
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