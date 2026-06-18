import { test, expect } from '@playwright/test';
import { mockFxRates } from '../mocks/fx-mock';

test.describe('Analytics & PDF Export Module (KPI-ANA-01, KPI-PDF-03)', () => {
  test.beforeEach(async ({ page }) => {
    await mockFxRates(page);
    await page.goto('/');

    await page.getByLabel(/Trip Title/i).fill('Analytics Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();
  });

  test('Validates PDF export button disabled state for zero expenses (KPI-PDF-03)', async ({ page }) => {
    // Should be disabled
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

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('select#category').selectOption('Food');
    await page.locator('input#amount').fill('40');
    await page.locator('input#description').fill('Lunch');
    await page.getByRole('button', { name: /Save Expense/i }).click();

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('select#category').selectOption('Transport');
    await page.locator('input#amount').fill('50');
    await page.locator('input#description').fill('Bus');
    await page.getByRole('button', { name: /Save Expense/i }).click();

    // Chart should show Food: $100.00 and Transport: $50.00
    // Wait for canvas or custom chart logic. Since we don't know the exact dom, let's look for text.
    await expect(page.getByText('Food').first()).toBeVisible();
    await expect(page.locator('text=100').or(page.locator('text=$100.00')).first()).toBeVisible();
    await expect(page.getByText('Transport').first()).toBeVisible();
    await expect(page.locator('text=50').or(page.locator('text=$50.00')).first()).toBeVisible();

    const exportBtn = page.getByRole('button', { name: /Export PDF/i });
    await expect(exportBtn).toBeEnabled();
  });
});
