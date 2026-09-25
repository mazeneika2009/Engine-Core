import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Apply schema.sql (idempotent — safe to re-run). */
export async function runMigration() {
  const sql = fs.readFileSync(path.join(here, 'schema.sql'), 'utf8');
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });
  try {
    await connection.query(sql);
    const [tables] = await connection.query(
      'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?',
      [env.db.database]
    );
    return tables.map((row) => row.TABLE_NAME);
  } finally {
    await connection.end();
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  runMigration()
    .then((tables) => {
      console.log(`[migrate] ok — tables in ${env.db.database}: ${tables.join(', ')}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`[migrate] failed: ${error.message}`);
      process.exit(1);
    });
}
