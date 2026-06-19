import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

const dbDir = path.dirname(env.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

if (!fs.existsSync(env.uploadsDir)) {
  fs.mkdirSync(env.uploadsDir, { recursive: true });
}

export const db = new Database(env.dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    base_currency TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL,
    name TEXT NOT NULL,
    upi_id TEXT,
    paypal_username TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL,
    paid_by_member_id TEXT NOT NULL,
    amount_original REAL NOT NULL,
    currency TEXT NOT NULL,
    amount_base REAL NOT NULL,
    fx_rate REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    receipt_photo_path TEXT,
    is_offline_rate INTEGER DEFAULT 0,
    rate_fetched_at TEXT,
    expense_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (paid_by_member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS fx_rate_cache (
    base_currency TEXT PRIMARY KEY,
    rates_json TEXT NOT NULL,
    fetched_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
  CREATE INDEX IF NOT EXISTS idx_members_trip_id ON members(trip_id);
  CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
  CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);
`);
