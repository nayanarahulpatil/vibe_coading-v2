import { test, expect } from '@playwright/test';
import { API_BASE } from '../config/api.config';
import { uniqueEmail, TEST_PASSWORD, WEAK_PASSWORD } from '../test-data/auth-data';
import { registerViaApi, loginViaApi } from '../utils/auth-helpers';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Helper to resolve and open the active SQLite DB containing the created user
const openActiveDb = (userId: string) => {
  const dbPaths = ['server/data/test_playwright.db', 'server/data/trip_budget.db'];
  for (const dbPath of dbPaths) {
    if (fs.existsSync(dbPath)) {
      try {
        const conn = new Database(dbPath);
        const row = conn.prepare('SELECT id FROM users WHERE id = ?').get(userId);
        if (row) return conn;
        conn.close();
      } catch {
        // ignore
      }
    }
  }
  return new Database('server/data/test_playwright.db');
};

test.describe('API Coverage Remediation (Reset Password, Receipts, FX error paths, Error Handler)', () => {

  test('TC-API-REMED-001: Reset password missing parameters validation error', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/reset-password`, {
      data: { token: '', password: '' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('required');
  });

  test('TC-API-REMED-002: Reset password weak password length check', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/reset-password`, {
      data: { token: 'valid-looking-token', password: WEAK_PASSWORD },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('at least 8 characters');
  });

  test('TC-API-REMED-003: Reset password invalid/unknown token hash error', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/reset-password`, {
      data: { token: 'invalidtokenhash999', password: TEST_PASSWORD },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('expired or invalid');
  });

  test('TC-API-REMED-004: Reset password expired token error path', async ({ request }) => {
    const email = uniqueEmail('expired-token');
    const user = await registerViaApi(request, email);

    // Insert an already expired token directly in the active database
    const fakeTokenHash = 'expiredtokenhash123';
    const expiredTimestamp = new Date(Date.now() - 10000).toISOString(); // 10s in the past
    
    const activeDb = openActiveDb(user.id);
    const fakeTokenId = `fake-id-${Math.random().toString(36).substring(2)}`;
    activeDb.prepare(
      'INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
    ).run(fakeTokenId, user.id, fakeTokenHash, expiredTimestamp);
    activeDb.close();

    const res = await request.post(`${API_BASE}/auth/reset-password`, {
      data: { token: 'expiredtokenhash123', password: TEST_PASSWORD },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('expired or invalid');
  });

  test('TC-API-REMED-005: Reset password successful flow execution', async ({ request }) => {
    const email = uniqueEmail('reset-success');
    await registerViaApi(request, email);

    // Call forgot-password to generate a reset link in the mock response
    const forgotRes = await request.post(`${API_BASE}/auth/forgot-password`, {
      data: { email },
      headers: { origin: 'http://localhost:5176' },
    });
    expect(forgotRes.ok()).toBeTruthy();
    const forgotBody = await forgotRes.json();
    expect(forgotBody.data.devResetUrl).toBeTruthy();

    const resetUrl = new URL(forgotBody.data.devResetUrl);
    const token = resetUrl.searchParams.get('token')!;
    expect(token).toBeTruthy();

    // Use token to reset password successfully
    const NEW_PASSWORD = 'NewBrandPassword99!';
    const resetRes = await request.post(`${API_BASE}/auth/reset-password`, {
      data: { token, password: NEW_PASSWORD },
    });
    expect(resetRes.status()).toBe(200);

    // Confirm that login with new password succeeds and old password fails
    const loginResNew = await request.post(`${API_BASE}/auth/login`, {
      data: { email, password: NEW_PASSWORD },
    });
    expect(loginResNew.status()).toBe(200);

    const loginResOld = await request.post(`${API_BASE}/auth/login`, {
      data: { email, password: TEST_PASSWORD },
    });
    expect(loginResOld.status()).toBe(401);
  });

  test('TC-API-REMED-006: Receipt retrieval validation error cases', async ({ request }) => {
    const email = uniqueEmail('receipt-val');
    await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);

    // Request non-existent expense
    const resNonExistent = await request.get(`${API_BASE}/receipts/non-existent-expense-id`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resNonExistent.status()).toBe(404);
    const bodyNonExistent = await resNonExistent.json();
    expect(bodyNonExistent.message).toContain('not found');

    // Create a trip and expense without receipt path
    const tripRes = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Trip with no receipt', baseCurrency: 'USD' },
    });
    const trip = (await tripRes.json()).data;

    const memberRes = await request.post(`${API_BASE}/trips/${trip.id}/members`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'Alice' },
    });
    const member = (await memberRes.json()).data;

    const expenseRes = await request.post(`${API_BASE}/trips/${trip.id}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        payerId: member.id,
        amountOriginal: 100,
        currency: 'USD',
        amountBase: 100,
        fxRate: 1,
        category: 'Food',
        description: 'Dinner',
      },
    });
    const expense = (await expenseRes.json()).data;

    // Fetch receipt for expense with no receipt attachment
    const resNoReceipt = await request.get(`${API_BASE}/receipts/${expense.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(resNoReceipt.status()).toBe(404);
    const bodyNoReceipt = await resNoReceipt.json();
    expect(bodyNoReceipt.message).toContain('not found');
  });

  test('TC-API-REMED-007: Cross-user receipt access blocked', async ({ request }) => {
    const userA = uniqueEmail('usera-receipt');
    const userB = uniqueEmail('userb-receipt');
    await registerViaApi(request, userA);
    await registerViaApi(request, userB);
    const tokenA = (await loginViaApi(request, userA)).token;
    const tokenB = (await loginViaApi(request, userB)).token;

    // User A creates a trip, member, and expense with receipt
    const tripRes = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${tokenA}` },
      data: { title: 'User A Trip', baseCurrency: 'USD' },
    });
    const trip = (await tripRes.json()).data;

    const memberRes = await request.post(`${API_BASE}/trips/${trip.id}/members`, {
      headers: { Authorization: `Bearer ${tokenA}` },
      data: { name: 'Alice' },
    });
    const member = (await memberRes.json()).data;

    const fileBuffer = Buffer.from('dummy image content');
    const expenseRes = await request.post(`${API_BASE}/trips/${trip.id}/expenses`, {
      headers: { Authorization: `Bearer ${tokenA}` },
      multipart: {
        payerId: member.id,
        amountOriginal: '100',
        currency: 'USD',
        amountBase: '100',
        fxRate: '1',
        category: 'Food',
        description: 'Dinner',
        isOfflineRate: 'false',
        expenseDate: new Date().toISOString(),
        receipt: {
          name: 'receipt.png',
          mimeType: 'image/png',
          buffer: fileBuffer,
        },
      },
    });
    const expense = (await expenseRes.json()).data;

    // User B tries to download User A's receipt
    const forbiddenRes = await request.get(`${API_BASE}/receipts/${expense.id}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    expect(forbiddenRes.status()).toBe(403);
    const bodyForbidden = await forbiddenRes.json();
    expect(bodyForbidden.message).toContain('Forbidden');
  });

  test('TC-API-REMED-008: Successful receipt download and file-on-disk missing error fallback', async ({ request }) => {
    const email = uniqueEmail('receipt-disk');
    const user = await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);

    const tripRes = await request.post(`${API_BASE}/trips`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Trip with receipt', baseCurrency: 'USD' },
    });
    const trip = (await tripRes.json()).data;

    const memberRes = await request.post(`${API_BASE}/trips/${trip.id}/members`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'Alice' },
    });
    const member = (await memberRes.json()).data;

    const fileContent = 'dummy upload text';
    const expenseRes = await request.post(`${API_BASE}/trips/${trip.id}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        payerId: member.id,
        amountOriginal: '50',
        currency: 'USD',
        amountBase: '50',
        fxRate: '1',
        category: 'Transport',
        description: 'Cab',
        isOfflineRate: 'false',
        expenseDate: new Date().toISOString(),
        receipt: {
          name: 'receipt.png',
          mimeType: 'image/png',
          buffer: Buffer.from(fileContent),
        },
      },
    });
    const expense = (await expenseRes.json()).data;

    // Verify 200 download works
    const downloadRes = await request.get(`${API_BASE}/receipts/${expense.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(downloadRes.status()).toBe(200);
    const downloadedText = await downloadRes.text();
    expect(downloadedText).toBe(fileContent);

    // Retrieve file path from DB, and rename/delete file from disk to force disk missing fallback
    const activeDb = openActiveDb(user.id);
    const row = activeDb.prepare('SELECT receipt_photo_path FROM expenses WHERE id = ?').get(expense.id) as { receipt_photo_path: string };
    expect(row.receipt_photo_path).toBeTruthy();
    activeDb.close();

    const fullFilePath = path.join('server', row.receipt_photo_path);
    const tempFilePath = fullFilePath + '.bak';
    fs.renameSync(fullFilePath, tempFilePath);

    // Verify receipt download returns 404 since file is missing from disk
    const diskMissingRes = await request.get(`${API_BASE}/receipts/${expense.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(diskMissingRes.status()).toBe(404);
    const diskMissingBody = await diskMissingRes.json();
    expect(diskMissingBody.message).toContain('file not found');

    // Restore file
    fs.renameSync(tempFilePath, fullFilePath);
  });

  test('TC-API-REMED-009: FX rates refresh parameters trigger', async ({ request }) => {
    const email = uniqueEmail('fx-refresh');
    await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);

    const res = await request.get(`${API_BASE}/fx/rates/USD?refresh=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.baseCurrency).toBe('USD');
  });

  test('TC-API-REMED-010: Error Handler generic fallback 500 mapping', async ({ request }) => {
    const email = uniqueEmail('fx-err500');
    await registerViaApi(request, email);
    const { token } = await loginViaApi(request, email);

    // Triggering a live refresh with an invalid currency will make the external API return an error
    // resulting in an unmapped error message, which falls back to status 500 in the global error handler
    const res = await request.get(`${API_BASE}/fx/rates/XYZ_INVALID_CURRENCY?refresh=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(500);
    const body = await res.json();
    expect(body.message).toContain('Failed to fetch');
  });
});
