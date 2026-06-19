import { test, expect } from '@playwright/test';
import { API_BASE } from '../config/api.config';
import { uniqueEmail } from '../test-data/auth-data';
import { registerViaApi, loginViaApi, TEST_PASSWORD } from '../utils/auth-helpers';

test.describe('Trips & Persistence API (KPI-DB, KPI-TRM, KPI-SEC)', () => {
  test('TC-API-TRIP-001: Create trip scoped to user (KPI-TRM-05)', async ({ request }) => {
    const email = uniqueEmail('trip');
    await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);

    const res = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'API Test Trip', baseCurrency: 'USD' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.data.title).toBe('API Test Trip');
    expect(body.data.baseCurrency).toBe('USD');
  });

  test('TC-API-TRIP-002: Trip retrievable after re-login (KPI-DB-01)', async ({ request }) => {
    const email = uniqueEmail('persist');
    await registerViaApi(request, email);
    const login1 = await loginViaApi(request, email);

    const createRes = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${login1.token}` },
      data: { title: 'Persist Trip', baseCurrency: 'EUR' },
    });
    const trip = (await createRes.json()).data;

    const login2 = await loginViaApi(request, email);
    const getRes = await request.get(`${API_BASE}/trips/${trip.id}`, {
      headers: { Authorization: `Bearer ${login2.token}` },
    });
    expect(getRes.ok()).toBeTruthy();
    const loaded = (await getRes.json()).data;
    expect(loaded.title).toBe('Persist Trip');
    expect(loaded.baseCurrency).toBe('EUR');
  });

  test('TC-API-TRIP-003: Cross-user trip access blocked (KPI-SEC-02)', async ({ request }) => {
    const userA = uniqueEmail('usera');
    const userB = uniqueEmail('userb');
    await registerViaApi(request, userA);
    await registerViaApi(request, userB);
    const tokenA = (await loginViaApi(request, userA)).token;
    const tokenB = (await loginViaApi(request, userB)).token;

    const createRes = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${tokenA}` },
      data: { title: 'User A Trip', baseCurrency: 'USD' },
    });
    const tripId = (await createRes.json()).data.id;

    const forbidden = await request.get(`${API_BASE}/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    expect(forbidden.status()).toBe(403);
  });

  test('TC-API-TRIP-004: Add member persists (KPI-TRM-06)', async ({ request }) => {
    const email = uniqueEmail('member');
    await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);

    const tripRes = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Member Trip', baseCurrency: 'USD' },
    });
    const tripId = (await tripRes.json()).data.id;

    const memberRes = await request.post(`${API_BASE}/trips/${tripId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'Alice', upiId: 'alice@upi' },
    });
    expect(memberRes.status()).toBe(201);
    const member = (await memberRes.json()).data;
    expect(member.name).toBe('Alice');
  });
});
