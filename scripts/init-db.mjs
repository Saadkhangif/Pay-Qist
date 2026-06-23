import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from '@neondatabase/serverless';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('Missing DATABASE_URL or POSTGRES_URL. Run: vercel integration add neon');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '../server/db/schema.sql');
const schema = readFileSync(schemaPath, 'utf8');
const pool = new Pool({ connectionString: databaseUrl });

async function main() {
  await pool.query(schema);
  await pool.end();
  console.log('Database schema applied successfully.');
}

main().catch((error) => {
  console.error('Failed to initialize database:', error.message);
  process.exit(1);
});
