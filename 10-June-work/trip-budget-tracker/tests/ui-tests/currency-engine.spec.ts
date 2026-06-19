import { test, expect } from '@playwright/test';
import { mockFxOffline } from '../mocks/fx-mock';
import {
  setupAuthenticatedSession,
  registerViaApi,
  loginViaApi,
  seedAuthToken,
  uniqueEmail,
} from '../utils/auth-helpers';

test.describe('Currency Engine Module (KPI-FX-02, KPI-FX-04)', () => {
  test('Validates FX conversion accuracy (KPI-FX-02)', async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    await page.getByLabel(/Trip Title/i).fill('FX Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('select#currency').selectOption('EUR');
    await page.locator('input#amount').fill('100');
    await page.locator('input#description').fill('Euro Expense');
    await page.getByRole('button', { name: /Save Expense/i }).click();

    await expect(page.getByText('Expense Log')).toBeVisible();
    await expect(page.getByText('USD 117.65').first()).toBeVisible();
  });

  test('Shows error when FX API unavailable (KPI-FX-04)', async ({ page, request }) => {
    await mockFxOffline(page);
    const email = uniqueEmail('fx-offline');
    await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);
    await seedAuthToken(page, token);
    await page.goto('/dashboard');

    await page.getByLabel(/Trip Title/i).fill('Offline Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();

    await expect(
      page.getByText(/Failed to fetch live FX rates|Exchange rates are unavailable/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
