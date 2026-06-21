import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { runMigrations } from './migrate.js';

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

runMigrations(db);
