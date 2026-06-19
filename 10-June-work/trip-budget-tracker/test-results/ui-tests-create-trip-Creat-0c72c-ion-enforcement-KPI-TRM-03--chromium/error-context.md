# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests\create-trip.spec.ts >> Create Trip Module (KPI-TRM-03, KPI-TRM-04, KPI-TRM-05) >> Validates base currency selection enforcement (KPI-TRM-03)
- Location: tests\ui-tests\create-trip.spec.ts:9:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Europe Trip')
Expected: visible
Error: strict mode violation: getByText('Europe Trip') resolved to 2 elements:
    1) <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Europe Trip</h1> aka getByRole('heading', { name: 'Europe Trip' })
    2) <h1 class="print:text-2xl print:font-extrabold print:text-slate-900">Europe Trip — Trip Budget Summary</h1> aka getByText('Europe Trip — Trip Budget')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Europe Trip')

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
          - paragraph [ref=e10]: qa-1781801904566-euyhc@trip-test.local
      - button "Logout" [ref=e11] [cursor=pointer]:
        - img [ref=e12]
        - generic [ref=e15]: Logout
  - main [ref=e16]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - heading "Europe Trip" [level=1] [ref=e22]
          - paragraph [ref=e23]: "Base Currency: EUR"
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
  2  | import { setupAuthenticatedSession } from '../utils/auth-helpers';
  3  | 
  4  | test.describe('Create Trip Module (KPI-TRM-03, KPI-TRM-04, KPI-TRM-05)', () => {
  5  |   test.beforeEach(async ({ page, request }) => {
  6  |     await setupAuthenticatedSession(page, request);
  7  |   });
  8  | 
  9  |   test('Validates base currency selection enforcement (KPI-TRM-03)', async ({ page }) => {
  10 |     await page.getByLabel(/Trip Title/i).fill('Europe Trip');
  11 |     await page.getByLabel(/Trip Title/i).clear();
  12 |     await page.getByRole('button', { name: /Start Trip/i }).click();
  13 |     await expect(page.getByText('Trip title is required')).toBeVisible();
  14 | 
  15 |     await page.getByLabel(/Trip Title/i).fill('Europe Trip');
  16 |     await page.getByLabel(/Base Currency/i).selectOption('EUR');
  17 |     await page.getByRole('button', { name: /Start Trip/i }).click();
  18 | 
> 19 |     await expect(page.getByText('Europe Trip')).toBeVisible();
     |                                                 ^ Error: expect(locator).toBeVisible() failed
  20 |     await expect(page.getByText(/Base Currency: EUR/i)).toBeVisible();
  21 |   });
  22 | 
  23 |   test('Persists base currency to state (KPI-TRM-04)', async ({ page }) => {
  24 |     await page.getByLabel(/Trip Title/i).fill('Asia Trip');
  25 |     await page.getByLabel(/Base Currency/i).selectOption('JPY');
  26 |     await page.getByRole('button', { name: /Start Trip/i }).click();
  27 | 
  28 |     await page.locator('input#name').fill('Alice');
  29 |     await page.getByRole('button', { name: /Add Member/i }).click();
  30 | 
  31 |     await expect(page.locator('select#currency')).toHaveValue('JPY');
  32 |   });
  33 | });
  34 | 
```