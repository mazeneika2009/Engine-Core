import 'dotenv/config';

function required(name, fallback) {
  if (process.env[name] !== undefined) return process.env[name];
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${name}`);
}

export const env = {
  port: Number(process.env.PORT || 5678),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5678',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'engine_core',
    poolSize: Number(process.env.DB_POOL_SIZE || 10),
  },
  encryptionKey: process.env.ENCRYPTION_KEY || 'dev-only-change-me-please-rotate-0000',
  isDevKey: !process.env.ENCRYPTION_KEY,
};

if (env.isDevKey) {
  console.warn('[server] ENCRYPTION_KEY is not set — using an insecure development fallback. Set it in production.');
}
