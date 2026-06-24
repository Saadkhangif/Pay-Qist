import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.development.local', override: true });
}
