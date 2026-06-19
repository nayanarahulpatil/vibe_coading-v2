import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession } from '../utils/auth-helpers';
import path from 'path';

test.describe('Add Expense Module (KPI-EXP-03, KPI-EXP-04, KPI-EXP-05, KPI-EXP-09)', () => {
  test.beforeEach(async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    await page.getByLabel(/Trip Title/i).fill('Test Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();
    await page.locator('input#name').fill('Bob');
    await page.getByRole('button', { name: /Add Member/i }).click();
  });

  test('Validates category enforcement and currency picker (KPI-EXP-03, KPI-EXP-04)', async ({ page }) => {
    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('input#amount').fill('100');
    await page.locator('input#description').fill('Dinner');
    await page.locator('select#category').selectOption('Food');
    await expect(page.locator('select#currency')).toBeVisible();
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  });

  test('Validates receipt photo format (KPI-EXP-05, KPI-EXP-06)', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles({
      name: 'dummy.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is not an image'),
    });
    await expect(page.getByText('Invalid format. Accepts JPEG, PNG, HEIC.')).toBeVisible();

    const base64jpeg =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    await page.locator('input[type="file"]').setInputFiles({
      name: 'receipt.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from(base64jpeg, 'base64'),
    });
    await expect(page.getByText('Photo attached!')).toBeVisible();
  });
});
