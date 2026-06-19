import { APIRequestContext, Page, expect } from '@playwright/test';
import { API_BASE } from '../config/api.config';
import { uniqueEmail, TEST_PASSWORD } from '../test-data/auth-data';
import { mockFxRates } from '../mocks/fx-mock';

export { TEST_PASSWORD, uniqueEmail };

async function parseJsonResponse(res: Awaited<ReturnType<APIRequestContext['post']>>) {
  const text = await res.text();
  try {
    return JSON.parse(text) as { status: number; data: unknown; message: string };
  } catch {
    throw new Error(`Non-JSON response (${res.status()}): ${text}`);
  }
}

export async function registerViaApi(
  request: APIRequestContext,
  email: string,
  password: string = TEST_PASSWORD
) {
  const res = await request.post(`${API_BASE}/auth/register`, {
    data: { email, password },
  });
  const body = await parseJsonResponse(res);
  expect(res.ok(), body.message ?? `Register failed (${res.status()})`).toBeTruthy();
  return body.data as { id: string; email: string };
}

export async function loginViaApi(
  request: APIRequestContext,
  email: string,
  password: string = TEST_PASSWORD
) {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { email, password },
  });
  const body = await parseJsonResponse(res);
  expect(res.ok(), body.message ?? `Login failed (${res.status()})`).toBeTruthy();
  return body.data as { token: string; user: { id: string; email: string } };
}

export async function seedAuthToken(page: Page, token: string) {
  await page.goto('/login');
  await page.evaluate((t) => localStorage.setItem('trip_budget_tracker_token', t), token);
}

export async function loginViaUI(page: Page, email: string, password: string = TEST_PASSWORD) {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

export async function setupAuthenticatedSession(page: Page, request: APIRequestContext) {
  await mockFxRates(page);
  const email = uniqueEmail();
  await registerViaApi(request, email);
  const { token } = await loginViaApi(request, email);
  await seedAuthToken(page, token);
  await page.goto('/dashboard');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page.getByText('Trip Budget Tracker v3')).toBeVisible({ timeout: 10000 });
  return { email, password: TEST_PASSWORD, token };
}

export async function createTripWithMember(page: Page, title: string, baseCurrency = 'USD') {
  await page.getByLabel(/Trip Title/i).fill(title);
  await page.getByLabel(/Base Currency/i).selectOption(baseCurrency);
  await page.getByRole('button', { name: /Start Trip/i }).click();
  await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
  await page.locator('input#name').fill('Alice');
  await page.getByRole('button', { name: /Add Member/i }).click();
  await expect(page.getByText('Alice')).toBeVisible();
}
