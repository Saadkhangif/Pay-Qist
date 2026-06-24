import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local'), override: true });

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(rootDir, '.env.development.local'), override: true });
}
