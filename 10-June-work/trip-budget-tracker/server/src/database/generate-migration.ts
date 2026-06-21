import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

const pad = (n: number) => String(n).padStart(3, '0');

const nextMigrationNumber = (): number => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    return 1;
  }

  const nums = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .map((f) => parseInt(f.split('_')[0], 10))
    .filter((n) => !Number.isNaN(n));

  return nums.length === 0 ? 1 : Math.max(...nums) + 1;
};

const slug = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'change';

const nameArg = process.argv[2] ?? 'schema_change';
const migrationName = slug(nameArg);
const num = nextMigrationNumber();
const fileName = `${pad(num)}_${migrationName}.sql`;
const filePath = path.join(MIGRATIONS_DIR, fileName);

const template = `-- Migration: ${fileName}
-- Description: ${nameArg}

-- Write SQL changes below (ALTER TABLE, CREATE TABLE, etc.)

`;

if (fs.existsSync(filePath)) {
  console.error(`Migration file already exists: ${fileName}`);
  process.exit(1);
}

fs.writeFileSync(filePath, template, 'utf-8');
console.log(`Generated migration: migrations/${fileName}`);
console.log('Edit the file, then run: npm run migrate');
