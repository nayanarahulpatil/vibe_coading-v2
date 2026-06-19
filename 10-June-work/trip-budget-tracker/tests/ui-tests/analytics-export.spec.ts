import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession } from '../utils/auth-helpers';

test.describe('Analytics & PDF Export Module (KPI-ANA-01, KPI-PDF-03)', () => {
  test.beforeEach(async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    await page.getByLabel(/Trip Title/i).fill('Analytics Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();
  });

  test('Validates PDF export button disabled state for zero expenses (KPI-PDF-03)', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /Export Summary/i });
    await expect(exportBtn).toBeDisabled();
    await expect(exportBtn).toHaveAttribute('title', 'Add at least one expense to export');
  });

  test('Validates category aggregation logic in chart (KPI-ANA-01)', async ({ page }) => {
    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('select#category').selectOption('Food');
    await page.locator('input#amount').fill('60');
    await page.locator('input#description').fill('Dinner');
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible({ timeout: 10000 });

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('select#category').selectOption('Food');
    await page.locator('input#amount').fill('40');
    await page.locator('input#description').fill('Lunch');
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible({ timeout: 10000 });

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('select#category').selectOption('Transport');
    await page.locator('input#amount').fill('50');
    await page.locator('input#description').fill('Bus');
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible({ timeout: 10000 });

    const chartSection = page.locator('h2', { hasText: 'Category Breakdown' }).locator('..').locator('..');
    await expect(chartSection.getByText('Food', { exact: true })).toBeVisible();
    await expect(chartSection.getByText('Transport', { exact: true })).toBeVisible();
    await expect(chartSection.getByText('USD 100.00')).toBeVisible();
  });
});
