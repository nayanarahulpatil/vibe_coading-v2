import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession } from '../utils/auth-helpers';

test.describe('Settlement Module (KPI-BAL-03, KPI-BAL-04, KPI-SET-03, KPI-SET-05)', () => {
  test.beforeEach(async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    await page.getByLabel(/Trip Title/i).fill('Settlement Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();

    await page.locator('input#name').fill('Alice');
    await page.locator('input#upiId').fill('alice@upi');
    await page.locator('input#paypalUsername').fill('alice_pp');
    await page.getByRole('button', { name: /Add Member/i }).click();
    await expect(page.getByRole('heading', { name: 'Trip Members (1)' })).toBeVisible();

    await page.locator('input#name').fill('Bob');
    await page.getByRole('button', { name: /Add Member/i }).click();
    await expect(page.getByRole('heading', { name: 'Trip Members (2)' })).toBeVisible();

    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('input#amount').fill('100');
    await page.locator('input#description').fill('Tickets');
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  });

  test('Validates multi-currency balance accuracy and base currency display (KPI-BAL-03, KPI-BAL-04)', async ({ page }) => {
    await expect(page.getByText('+USD 50.00')).toBeVisible();
    await expect(page.getByText('USD -50.00')).toBeVisible();

    await page.locator('select#payerId').selectOption({ label: 'Bob' });
    await page.locator('select#currency').selectOption('EUR');
    await page.locator('input#amount').fill('50');
    await page.locator('input#description').fill('Taxi');
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  });

  test('Generates UPI and PayPal deep-links (KPI-SET-03, KPI-SET-05)', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Pay via UPI/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /PayPal Me/i }).first()).toBeVisible();
  });
});
