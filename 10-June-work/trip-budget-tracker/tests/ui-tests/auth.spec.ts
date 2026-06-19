import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD, WEAK_PASSWORD } from '../test-data/auth-data';
import { registerViaApi, setupAuthenticatedSession } from '../utils/auth-helpers';

test.describe('Authentication UI (KPI-AUTH-REG, KPI-AUTH-LOG, KPI-SES)', () => {
  test('TC-UI-AUTH-001: Route guard redirects unauthenticated user (KPI-SES-01)', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-UI-AUTH-002: Register with password mismatch blocked (KPI-AUTH-REG-03)', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#email').fill(uniqueEmail('ui-reg'));
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('#confirmPassword').fill('DifferentPass99!');
    await page.getByRole('button', { name: /Register/i }).click();
    await expect(page.getByText('Passwords must match')).toBeVisible();
  });

  test('TC-UI-AUTH-003: Register weak password blocked (KPI-AUTH-REG-04)', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#email').fill(uniqueEmail('ui-weak'));
    await page.locator('#password').fill(WEAK_PASSWORD);
    await page.locator('#confirmPassword').fill(WEAK_PASSWORD);
    await page.getByRole('button', { name: /Register/i }).click();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('TC-UI-AUTH-004: Login invalid credentials show generic error (KPI-AUTH-LOG-03)', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('ghost@trip-test.local');
    await page.locator('#password').fill('WrongPass999!');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('TC-UI-AUTH-005: Empty trip state after first login (KPI-AUTH-LOG-05)', async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    await expect(page.getByText('Create a New Trip')).toBeVisible();
    await expect(page.getByText(/Your first trip/i)).toBeVisible();
  });

  test('TC-UI-AUTH-006: Logout returns to login (KPI-SES-03)', async ({ page, request }) => {
    await setupAuthenticatedSession(page, request);
    await page.getByRole('button', { name: /Logout/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-UI-AUTH-007: Forgot password shows success message (KPI-AUTH-FP-02)', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.locator('#email').fill('anyone@trip-test.local');
    await page.getByRole('button', { name: /Send Reset Link/i }).click();
    await expect(page.getByText(/reset link has been sent/i)).toBeVisible();
  });
});
