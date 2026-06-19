import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession, loginViaUI, registerViaApi } from '../utils/auth-helpers';
import { uniqueEmail } from '../test-data/auth-data';

test.describe('Data Persistence UI (KPI-DB-01, KPI-DB-02, KPI-BAL-05)', () => {
  test('TC-UI-DB-001: Trip survives logout and re-login (KPI-DB-01)', async ({ page, request }) => {
    const email = uniqueEmail('durability');
    await registerViaApi(request, email);

    await loginViaUI(page, email);
    await page.getByLabel(/Trip Title/i).fill('Durability Trip');
    await page.getByLabel(/Base Currency/i).selectOption('INR');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await expect(page.getByText('Durability Trip')).toBeVisible();

    await page.getByRole('button', { name: /Logout/i }).click();
    await expect(page).toHaveURL(/\/login/);

    await loginViaUI(page, email);
    await expect(page.getByText('Durability Trip')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Base Currency: INR/i)).toBeVisible();
  });

  test('TC-UI-DB-002: Expense and balance survive re-login (KPI-DB-02, KPI-BAL-05)', async ({ page, request }) => {
    const { email } = await setupAuthenticatedSession(page, request);

    await page.getByLabel(/Trip Title/i).fill('Expense Persist Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();
    await page.locator('input#name').fill('Bob');
    await page.getByRole('button', { name: /Add Member/i }).click();

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('input#amount').fill('100');
    await page.locator('input#description').fill('Dinner');
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible();
    await expect(page.getByText('+USD 50.00')).toBeVisible();

    await page.getByRole('button', { name: /Logout/i }).click();
    await loginViaUI(page, email);

    await expect(page.getByText('Expense Persist Trip')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Dinner')).toBeVisible();
    await expect(page.getByText('+USD 50.00')).toBeVisible();
  });

  test('TC-UI-DB-003: Auth token only in localStorage (KPI-DB-09)', async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    const storage = await page.evaluate(() => ({
      token: localStorage.getItem('trip_budget_tracker_token'),
      tripState: localStorage.getItem('trip_budget_tracker_state'),
    }));
    expect(storage.token).toBeTruthy();
    expect(storage.tripState).toBeNull();
  });
});
