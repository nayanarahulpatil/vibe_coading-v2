import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

const ensureDbDir = () => {
  const dbDir = path.dirname(env.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

const ensureMigrationsTable = (db: Database.Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
};

const listMigrationFiles = (): string[] => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
};

const getAppliedMigrations = (db: Database.Database): Set<string> => {
  const rows = db.prepare('SELECT name FROM schema_migrations').all() as { name: string }[];
  return new Set(rows.map((r) => r.name));
};

export const runMigrations = (db?: Database.Database): { applied: string[]; skipped: string[] } => {
  ensureDbDir();

  const ownsDb = !db;
  const database = db ?? new Database(env.dbPath);

  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');

  ensureMigrationsTable(database);

  const files = listMigrationFiles();
  const applied = getAppliedMigrations(database);
  const newlyApplied: string[] = [];
  const skipped: string[] = [];

  const applyMigration = database.transaction((fileName: string, sql: string) => {
    database.exec(sql);
    database
      .prepare('INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)')
      .run(fileName, new Date().toISOString());
  });

  for (const fileName of files) {
    if (applied.has(fileName)) {
      skipped.push(fileName);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, fileName), 'utf-8');
    applyMigration(fileName, sql);
    newlyApplied.push(fileName);
  }

  if (ownsDb) {
    database.close();
  }

  return { applied: newlyApplied, skipped };
};

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const { applied, skipped } = runMigrations();

  if (applied.length === 0 && skipped.length === 0) {
    console.log('No migration files found in server/migrations/');
    process.exit(0);
  }

  for (const name of applied) {
    console.log(`Applied: ${name}`);
  }
  for (const name of skipped) {
    console.log(`Skipped (already applied): ${name}`);
  }

  console.log(`Migration complete. DB: ${env.dbPath}`);
}
