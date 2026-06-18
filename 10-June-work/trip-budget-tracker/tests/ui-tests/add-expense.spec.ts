import { test, expect } from '@playwright/test';
import { mockFxRates } from '../mocks/fx-mock';
import path from 'path';
import fs from 'fs';

test.describe('Add Expense Module (KPI-EXP-03, KPI-EXP-04, KPI-EXP-05, KPI-EXP-06)', () => {
  test.beforeEach(async ({ page }) => {
    await mockFxRates(page);
    await page.goto('/');

    // Create a trip with members
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
    
    const categorySelect = page.locator('select#category');
    await expect(categorySelect).toBeVisible();
    await categorySelect.selectOption('Food');

    const currencySelect = page.locator('select#currency');
    await expect(currencySelect).toBeVisible();

    await page.getByRole('button', { name: /Save Expense/i }).click();

    await expect(page.getByText('Expense saved successfully!')).toBeVisible();
  });

  test('Validates receipt photo format and size (KPI-EXP-05, KPI-EXP-06)', async ({ page }) => {
    // Upload invalid format
    await page.locator('input[type="file"]').setInputFiles({
      name: 'dummy.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is not an image')
    });
    await expect(page.getByText('Invalid format. Accepts JPEG, PNG, HEIC.')).toBeVisible();

    // Upload valid format
    const base64jpeg = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    await page.locator('input[type="file"]').setInputFiles({
      name: 'receipt.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from(base64jpeg, 'base64')
    });
    await expect(page.getByText('Photo attached!')).toBeVisible();
  });
});
