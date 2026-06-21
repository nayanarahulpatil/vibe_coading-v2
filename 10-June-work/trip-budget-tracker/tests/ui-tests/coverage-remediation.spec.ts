import { test, expect } from '@playwright/test';
import { setupAuthenticatedSession, registerViaApi, loginViaApi } from '../utils/auth-helpers';
import { uniqueEmail, TEST_PASSWORD } from '../test-data/auth-data';
import { API_BASE } from '../config/api.config';

test.describe('UI Coverage Remediation (Reset Password UI, Receipt Rendering, Trip Summary Report empty states)', () => {
  test('TC-UI-REMED-001: Reset password page without token query parameter shows invalid link', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByText('Reset link expired or invalid.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Request a new link/i })).toBeVisible();
  });

  test('TC-UI-REMED-002: Reset password validation mismatch and weak passwords', async ({ page }) => {
    await page.goto('/reset-password?token=dummy-token-rem');
    
    // Test mismatched passwords validation
    await page.locator('#password').fill('NewPassword99!');
    await page.locator('#confirmPassword').fill('DifferentPassword99!');
    await page.getByRole('button', { name: /Update Password/i }).click();
    await expect(page.getByText('Passwords must match')).toBeVisible();

    // Test weak password length validation
    await page.locator('#password').fill('short');
    await page.locator('#confirmPassword').fill('short');
    await page.getByRole('button', { name: /Update Password/i }).click();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('TC-UI-REMED-003: Reset password page server error displays error message', async ({ page }) => {
    await page.goto('/reset-password?token=invalid-token-value-999');
    await page.locator('#password').fill('NewPassword99!');
    await page.locator('#confirmPassword').fill('NewPassword99!');
    await page.getByRole('button', { name: /Update Password/i }).click();
    await expect(page.getByText('Reset link expired or invalid')).toBeVisible();
  });

  test('TC-UI-REMED-004: Reset password successful execution path', async ({ page, request }) => {
    const email = uniqueEmail('ui-reset-success');
    await registerViaApi(request, email);

    // Call forgot-password to generate reset url
    const forgotRes = await request.post(`${API_BASE}/auth/forgot-password`, {
      data: { email },
      headers: { origin: 'http://localhost:5176' },
    });
    expect(forgotRes.ok()).toBeTruthy();
    const forgotBody = await forgotRes.json();
    const devResetUrl = forgotBody.data.devResetUrl;
    
    const resetUrlObj = new URL(devResetUrl);
    const token = resetUrlObj.searchParams.get('token')!;
    expect(token).toBeTruthy();

    // Reset password via UI form
    const NEW_PASSWORD = 'NewBrandPassword99!';
    await page.goto(`/reset-password?token=${token}`);
    await page.locator('#password').fill(NEW_PASSWORD);
    await page.locator('#confirmPassword').fill(NEW_PASSWORD);
    await page.getByRole('button', { name: /Update Password/i }).click();

    // Should redirect to login screen
    await expect(page).toHaveURL(/\/login/);

    // Verify login with new password works
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(NEW_PASSWORD);
    await page.getByRole('button', { name: /Sign In/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
  });

  test('TC-UI-REMED-005: Receipt image rendering and lightbox zoom toggles', async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);

    // Create a new trip
    await page.getByLabel(/Trip Title/i).fill('Receipt Test Trip');
    await page.getByRole('button', { name: /Start Trip/i }).click();
    
    // Add member
    await page.locator('input#name').fill('Alice');
    await page.getByRole('button', { name: /Add Member/i }).click();
    await expect(page.getByRole('heading', { name: 'Trip Members (1)' })).toBeVisible();
    
    // Fill expense form
    await page.locator('select#payerId').selectOption({ label: 'Alice' });
    await page.locator('input#amount').fill('100');
    await page.locator('input#description').fill('Dinner with Receipt');
    await page.locator('select#category').selectOption('Food');

    // Upload receipt image
    const base64jpeg = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    await page.locator('input[type="file"]').setInputFiles({
      name: 'receipt_image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from(base64jpeg, 'base64'),
    });
    
    await expect(page.getByText('Photo attached!')).toBeVisible();
    await page.getByRole('button', { name: /Save Expense/i }).click();
    await expect(page.getByText('Expense saved successfully!')).toBeVisible();

    // Verify receipt image thumbnail is rendered and clickable in log list
    const logSection = page.locator('h2', { hasText: 'Expense Log' }).locator('..').locator('..');
    const receiptThumb = logSection.locator('img[alt="Receipt"]').first();
    await expect(receiptThumb).toBeVisible();

    // Click receipt image thumbnail to launch lightbox modal zoom view
    await receiptThumb.click();
    const lightboxModal = page.locator('.fixed.inset-0.bg-slate-900\\/60');
    await expect(lightboxModal).toBeVisible();
    await expect(lightboxModal.locator('img[alt="Receipt"]')).toBeVisible();

    // Click close button on lightbox modal to verify toggling closes the modal
    await lightboxModal.getByRole('button').click();
    await expect(lightboxModal).not.toBeVisible();
  });
});
