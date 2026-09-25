import mysql from 'mysql2/promise';
import { env } from './env.js';

/** Shared connection pool. Connections open lazily on first query. */
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: env.db.poolSize,
  queueLimit: 0,
  namedPlaceholders: false,
});

/** Thin promise wrapper used by models. */
export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Lightweight connectivity probe used by /api/health. */
export async function pingDb(timeoutMs = 2000) {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}

export async function closePool() {
  await pool.end();
}
