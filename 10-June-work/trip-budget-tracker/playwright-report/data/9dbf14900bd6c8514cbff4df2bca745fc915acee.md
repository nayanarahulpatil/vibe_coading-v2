# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-tests\auth.spec.ts >> Authentication UI (KPI-AUTH-REG, KPI-AUTH-LOG, KPI-SES) >> TC-UI-AUTH-004: Login invalid credentials show generic error (KPI-AUTH-LOG-03)
- Location: tests\ui-tests\auth.spec.ts:29:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Invalid email or password')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Invalid email or password')

```

```yaml
- text: T
- heading "Trip Budget Tracker v3" [level=1]
- heading "Welcome back" [level=2]
- paragraph: Sign in to access your trips
- text: Login failed Email
- textbox "Email"
- text: Password
- textbox "Password"
- button "Sign In"
- link "Forgot password?":
  - /url: /forgot-password
- link "Create account":
  - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { uniqueEmail, TEST_PASSWORD, WEAK_PASSWORD } from '../test-data/auth-data';
  3  | import { registerViaApi, setupAuthenticatedSession } from '../utils/auth-helpers';
  4  | 
  5  | test.describe('Authentication UI (KPI-AUTH-REG, KPI-AUTH-LOG, KPI-SES)', () => {
  6  |   test('TC-UI-AUTH-001: Route guard redirects unauthenticated user (KPI-SES-01)', async ({ page }) => {
  7  |     await page.goto('/dashboard');
  8  |     await expect(page).toHaveURL(/\/login/);
  9  |   });
  10 | 
  11 |   test('TC-UI-AUTH-002: Register with password mismatch blocked (KPI-AUTH-REG-03)', async ({ page }) => {
  12 |     await page.goto('/register');
  13 |     await page.locator('#email').fill(uniqueEmail('ui-reg'));
  14 |     await page.locator('#password').fill(TEST_PASSWORD);
  15 |     await page.locator('#confirmPassword').fill('DifferentPass99!');
  16 |     await page.getByRole('button', { name: /Register/i }).click();
  17 |     await expect(page.getByText('Passwords must match')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('TC-UI-AUTH-003: Register weak password blocked (KPI-AUTH-REG-04)', async ({ page }) => {
  21 |     await page.goto('/register');
  22 |     await page.locator('#email').fill(uniqueEmail('ui-weak'));
  23 |     await page.locator('#password').fill(WEAK_PASSWORD);
  24 |     await page.locator('#confirmPassword').fill(WEAK_PASSWORD);
  25 |     await page.getByRole('button', { name: /Register/i }).click();
  26 |     await expect(page.getByText(/8 characters/i)).toBeVisible();
  27 |   });
  28 | 
  29 |   test('TC-UI-AUTH-004: Login invalid credentials show generic error (KPI-AUTH-LOG-03)', async ({ page }) => {
  30 |     await page.goto('/login');
  31 |     await page.locator('#email').fill('ghost@trip-test.local');
  32 |     await page.locator('#password').fill('WrongPass999!');
  33 |     await page.getByRole('button', { name: /Sign In/i }).click();
> 34 |     await expect(page.getByText('Invalid email or password')).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  35 |   });
  36 | 
  37 |   test('TC-UI-AUTH-005: Empty trip state after first login (KPI-AUTH-LOG-05)', async ({ page, request }) => {
  38 |     await setupAuthenticatedSession(page, request);
  39 |     await expect(page.getByText('Create a New Trip')).toBeVisible();
  40 |     await expect(page.getByText(/Your first trip/i)).toBeVisible();
  41 |   });
  42 | 
  43 |   test('TC-UI-AUTH-006: Logout returns to login (KPI-SES-03)', async ({ page, request }) => {
  44 |     await setupAuthenticatedSession(page, request);
  45 |     await page.getByRole('button', { name: /Logout/i }).click();
  46 |     await expect(page).toHaveURL(/\/login/);
  47 |   });
  48 | 
  49 |   test('TC-UI-AUTH-007: Forgot password shows success message (KPI-AUTH-FP-02)', async ({ page }) => {
  50 |     await page.goto('/forgot-password');
  51 |     await page.locator('#email').fill('anyone@trip-test.local');
  52 |     await page.getByRole('button', { name: /Send Reset Link/i }).click();
  53 |     await expect(page.getByText(/reset link has been sent/i)).toBeVisible();
  54 |   });
  55 | });
  56 | 
```