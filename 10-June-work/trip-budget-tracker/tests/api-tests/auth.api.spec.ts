import { test, expect } from '@playwright/test';
import { API_BASE } from '../config/api.config';
import { uniqueEmail, TEST_PASSWORD, WEAK_PASSWORD } from '../test-data/auth-data';
import { registerViaApi, loginViaApi } from '../utils/auth-helpers';

test.describe('Authentication API (KPI-AUTH-REG, KPI-AUTH-LOG, KPI-AUTH-FP)', () => {
  test('TC-API-AUTH-001: Register valid user (KPI-AUTH-REG-01)', async ({ request }) => {
    const email = uniqueEmail('reg');
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { email, password: TEST_PASSWORD },
    });
    const body = await res.json();
    expect(res.status()).toBe(201);
    expect(body.data.email).toBe(email.toLowerCase());
  });

  test('TC-API-AUTH-002: Reject duplicate email (KPI-AUTH-REG-02)', async ({ request }) => {
    const email = uniqueEmail('dup');
    await registerViaApi(request, email);
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { email, password: TEST_PASSWORD },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('already exists');
  });

  test('TC-API-AUTH-003: Reject weak password (KPI-AUTH-REG-04)', async ({ request }) => {
    const email = uniqueEmail('weak');
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { email, password: WEAK_PASSWORD },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/8 characters/i);
  });

  test('TC-API-AUTH-004: Login success returns token (KPI-AUTH-LOG-01)', async ({ request }) => {
    const email = uniqueEmail('login');
    await registerViaApi(request, email);
    const { token, user } = await loginViaApi(request, email);
    expect(token).toBeTruthy();
    expect(user.email).toBe(email.toLowerCase());
  });

  test('TC-API-AUTH-005: Invalid credentials return 401 (KPI-AUTH-LOG-03)', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/login`, {
      data: { email: 'nobody@trip-test.local', password: 'wrongpass99' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toBe('Invalid email or password');
  });

  test('TC-API-AUTH-006: Forgot password same response for unknown email (KPI-AUTH-FP-02)', async ({ request }) => {
    const known = uniqueEmail('fp-known');
    await registerViaApi(request, known);

    const knownRes = await request.post(`${API_BASE}/auth/forgot-password`, {
      data: { email: known },
      headers: { origin: 'http://localhost:5176' },
    });
    const unknownRes = await request.post(`${API_BASE}/auth/forgot-password`, {
      data: { email: 'unknown@trip-test.local' },
      headers: { origin: 'http://localhost:5176' },
    });

    expect(knownRes.ok()).toBeTruthy();
    expect(unknownRes.ok()).toBeTruthy();
    const knownBody = await knownRes.json();
    const unknownBody = await unknownRes.json();
    expect(knownBody.message).toBe(unknownBody.message);
  });

  test('TC-API-AUTH-007: Protected trips endpoint requires auth (KPI-EXP-10)', async ({ request }) => {
    const res = await request.get(`${API_BASE}/trips`);
    expect(res.status()).toBe(401);
  });
});
