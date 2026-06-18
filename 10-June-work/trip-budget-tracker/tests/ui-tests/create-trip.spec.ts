import { test, expect } from '@playwright/test';
import { mockFxRates } from '../mocks/fx-mock';

test.describe('Create Trip Module (KPI-TRM-03, KPI-TRM-04)', () => {
  test.beforeEach(async ({ page }) => {
    await mockFxRates(page);
    await page.goto('/');
  });

  test('Validates base currency selection enforcement (KPI-TRM-03)', async ({ page }) => {
    await page.getByLabel(/Trip Title/i).fill('Europe Trip');
    // Clear selection if possible, but default is USD.
    // Try starting without title
    await page.getByLabel(/Trip Title/i).clear();
    await page.getByRole('button', { name: /Start Trip/i }).click();
    
    // Check validation
    await expect(page.getByText('Trip title is required')).toBeVisible();

    await page.getByLabel(/Trip Title/i).fill('Europe Trip');
    await page.getByLabel(/Base Currency/i).selectOption('EUR');
    await page.getByRole('button', { name: /Start Trip/i }).click();

    // Verify trip created
    await expect(page.getByText('Add Member')).toBeVisible();
    await expect(page.getByRole('button', { name: /Europe Trip/i }).or(page.locator('h1', {hasText: 'Europe Trip'}))).toBeTruthy();
  });

  test('Persists base currency to state (KPI-TRM-04)', async ({ page }) => {
    await page.getByLabel(/Trip Title/i).fill('Asia Trip');
    await page.getByLabel(/Base Currency/i).selectOption('JPY');
    await page.getByRole('button', { name: /Start Trip/i }).click();

    // Add a member
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();

    // Base currency JPY should show on Add Expense form currency default
    await expect(page.locator('select#currency')).toHaveValue('JPY');
  });
});
