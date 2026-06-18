import { test, expect } from '@playwright/test';
import { mockFxRates } from '../mocks/fx-mock';

test.describe('Settlement Module (KPI-BAL-03, KPI-BAL-04, KPI-SET-03, KPI-SET-05)', () => {
  test.beforeEach(async ({ page }) => {
    await mockFxRates(page);
    await page.goto('/');

    await page.getByLabel(/Trip Title/i).fill('Settlement Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    
    // Add Members with UPI / Paypal
    await page.locator('input#name').fill('Alice');
    await page.locator('input#upiId').fill('alice@upi');
    await page.locator('input#paypalUsername').fill('alice_pp');
    await page.getByRole('button', { name: /Add Member/i }).click();

    await page.locator('input#name').fill('Bob');
    await page.getByRole('button', { name: /Add Member/i }).click();

    // Bob owes Alice. Alice pays.
    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('input#amount').fill('100'); // 100 USD
    await page.locator('input#description').fill('Tickets');
    await page.getByRole('button', { name: /Save Expense/i }).click();
  });

  test('Validates multi-currency balance accuracy and base currency display (KPI-BAL-03, KPI-BAL-04)', async ({ page }) => {
    // Total is 100 USD. Each owes 50. Alice paid 100, so her balance is +50. Bob is -50.
    await expect(page.getByText('+USD 50.00')).toBeVisible();
    await expect(page.getByText('-USD 50.00')).toBeVisible();

    // Now Alice pays in EUR
    await page.locator('select#payerId').selectOption({ label: 'Bob' });
    await page.locator('select#currency').selectOption('EUR'); // EUR rate 0.85 -> 50 EUR = 58.82 USD
    await page.locator('input#amount').fill('50');
    await page.locator('input#description').fill('Taxi');
    await page.getByRole('button', { name: /Save Expense/i }).click();

    // Total expense: 100 USD + 58.8235 USD = 158.82 USD
    // Each share: 79.41 USD
    // Alice paid: 100 USD. Balance: +20.59 USD
    // Bob paid: 58.82 USD. Balance: -20.59 USD
    await expect(page.getByText('Alice: +$20.59')).toBeVisible();
    await expect(page.getByText('Bob: -$20.59')).toBeVisible();
  });

  test('Validates UPI and PayPal deep-link generation (KPI-SET-03, KPI-SET-05)', async ({ page }) => {
    // Navigate to Settlement (already visible usually in the bottom)
    // Bob owes Alice 50 USD
    // Click 'Settle Up' if it's a separate tab or just check the links
    const upiLink = page.locator('a[href*="upi://pay"]');
    await expect(upiLink).toBeVisible();
    await expect(upiLink).toHaveAttribute('href', /pa=alice@upi/);
    await expect(upiLink).toHaveAttribute('href', /am=50.00/);

    const paypalLink = page.locator('a[href*="paypal.me"]');
    await expect(paypalLink).toBeVisible();
    await expect(paypalLink).toHaveAttribute('href', /paypal\.me\/alice_pp\/50\.00/);
  });
});
