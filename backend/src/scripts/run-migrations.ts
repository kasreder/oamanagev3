import path from 'path';
import fs from 'fs/promises';
import { ensureDatabase, getPool, closePool } from '@/config/database';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

const log = (message: string): void => {
  // eslint-disable-next-line no-console
  console.log(message);
};

const run = async (): Promise<void> => {
  await ensureDatabase();
  const pool = getPool();

  const entries = await fs.readdir(MIGRATIONS_DIR);
  const migrationFiles = entries
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  if (migrationFiles.length === 0) {
    log('No migrations found.');
    await closePool();
    return;
  }

  for (const file of migrationFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = await fs.readFile(filePath, 'utf8');
    const trimmed = sql.trim();

    if (!trimmed) {
      log(`Skipping empty migration: ${file}`);
      continue;
    }

    log(`Running migration: ${file}`);
    await pool.query(trimmed);
  }

  log('✅ All migrations executed successfully.');
  await closePool();
};

run().catch(async (error: unknown) => {
  console.error('❌ Migration failed:', error);
  await closePool();
  process.exit(1);
});
