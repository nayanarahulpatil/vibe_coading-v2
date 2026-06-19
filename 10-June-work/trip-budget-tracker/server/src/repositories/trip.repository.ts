import { db } from '../database/db.js';

export interface TripRow {
  id: string;
  user_id: string;
  name: string;
  base_currency: string;
  created_at: string;
  updated_at: string;
}

export interface MemberRow {
  id: string;
  trip_id: string;
  name: string;
  upi_id: string | null;
  paypal_username: string | null;
  created_at: string;
}

export interface ExpenseRow {
  id: string;
  trip_id: string;
  paid_by_member_id: string;
  amount_original: number;
  currency: string;
  amount_base: number;
  fx_rate: number;
  category: string;
  description: string;
  receipt_photo_path: string | null;
  is_offline_rate: number;
  rate_fetched_at: string | null;
  expense_date: string;
  created_at: string;
}

export const tripRepository = {
  listByUser(userId: string): TripRow[] {
    return db
      .prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY updated_at DESC')
      .all(userId) as TripRow[];
  },

  findById(tripId: string): TripRow | undefined {
    return db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId) as TripRow | undefined;
  },

  create(id: string, userId: string, name: string, baseCurrency: string, now: string) {
    db.prepare(
      'INSERT INTO trips (id, user_id, name, base_currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, userId, name, baseCurrency, now, now);
  },

  touch(tripId: string, now: string) {
    db.prepare('UPDATE trips SET updated_at = ? WHERE id = ?').run(now, tripId);
  },

  getMembers(tripId: string): MemberRow[] {
    return db.prepare('SELECT * FROM members WHERE trip_id = ? ORDER BY created_at').all(tripId) as MemberRow[];
  },

  getMemberById(memberId: string): MemberRow | undefined {
    return db.prepare('SELECT * FROM members WHERE id = ?').get(memberId) as MemberRow | undefined;
  },

  addMember(
    id: string,
    tripId: string,
    name: string,
    upiId: string | null,
    paypalUsername: string | null,
    now: string
  ) {
    db.prepare(
      'INSERT INTO members (id, trip_id, name, upi_id, paypal_username, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, tripId, name, upiId, paypalUsername, now);
  },

  memberNameExists(tripId: string, name: string): boolean {
    const row = db
      .prepare('SELECT id FROM members WHERE trip_id = ? AND LOWER(name) = LOWER(?)')
      .get(tripId, name);
    return !!row;
  },

  getExpenses(tripId: string): ExpenseRow[] {
    return db
      .prepare('SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date DESC')
      .all(tripId) as ExpenseRow[];
  },

  addExpense(
    id: string,
    tripId: string,
    paidByMemberId: string,
    payload: {
      amountOriginal: number;
      currency: string;
      amountBase: number;
      fxRate: number;
      category: string;
      description: string;
      receiptPhotoPath: string | null;
      isOfflineRate: boolean;
      rateFetchedAt: string | null;
      expenseDate: string;
    },
    now: string
  ) {
    db.prepare(
      `INSERT INTO expenses (
        id, trip_id, paid_by_member_id, amount_original, currency, amount_base, fx_rate,
        category, description, receipt_photo_path, is_offline_rate, rate_fetched_at, expense_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      tripId,
      paidByMemberId,
      payload.amountOriginal,
      payload.currency,
      payload.amountBase,
      payload.fxRate,
      payload.category,
      payload.description,
      payload.receiptPhotoPath,
      payload.isOfflineRate ? 1 : 0,
      payload.rateFetchedAt,
      payload.expenseDate,
      now
    );
  },

  getExpenseById(expenseId: string): ExpenseRow | undefined {
    return db.prepare('SELECT * FROM expenses WHERE id = ?').get(expenseId) as ExpenseRow | undefined;
  },
};
