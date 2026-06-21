import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession } from '../utils/auth-helpers';

test.describe('Create Trip Module (KPI-TRM-03, KPI-TRM-04, KPI-TRM-05)', () => {
  test.beforeEach(async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
  });

  test('Validates base currency selection enforcement (KPI-TRM-03)', async ({ page }) => {
    await page.getByLabel(/Trip Title/i).fill('Europe Trip');
    await page.getByLabel(/Trip Title/i).clear();
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await expect(page.getByText('Trip title is required')).toBeVisible();

    await page.getByLabel(/Trip Title/i).fill('Europe Trip');
    await page.getByLabel(/Base Currency/i).selectOption('EUR');
    await page.getByRole('button', { name: /Start Trip/i }).click();

    await expect(page.getByRole('heading', { name: 'Europe Trip', exact: true })).toBeVisible();
    await expect(page.getByText('Base Currency: EUR', { exact: true })).toBeVisible();
  });

  test('Persists base currency to state (KPI-TRM-04)', async ({ page }) => {
    await page.getByLabel(/Trip Title/i).fill('Asia Trip');
    await page.getByLabel(/Base Currency/i).selectOption('JPY');
    await page.getByRole('button', { name: /Start Trip/i }).click();

    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();
    await expect(page.getByRole('heading', { name: 'Trip Members (1)' })).toBeVisible();

    await expect(page.locator('select#currency')).toHaveValue('JPY');
  });
});
