import mysql from 'mysql2/promise';
import { resolveParams } from 'shared';

/**
 * engine.mysql — params: { query, params (array, optional), credential (mysql credential id, optional) }.
 * Without a credential the engine database pool (services.db) is used.
 * A mysql-type credential ({ host, port, user, password, database }) opens
 * a short-lived connection to an external database instead.
 */
export async function executeMysql(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const sql = String(params.query || '').trim();
  if (!sql) throw Object.assign(new Error('MySQL node requires a "query"'), { code: 'NODE_MISSING_PARAM' });
  const values = Array.isArray(params.params) ? params.params : [];

  let credential = null;
  if (params.credential && services.getCredential) {
    credential = await services.getCredential(params.credential);
    if (credential && credential.type !== 'mysql') {
      throw Object.assign(new Error(`Credential "${params.credential}" is not a mysql credential`), { code: 'NODE_BAD_CREDENTIAL' });
    }
  }

  if (credential) {
    const connection = await mysql.createConnection({
      host: credential.data.host || '127.0.0.1',
      port: Number(credential.data.port) || 3306,
      user: credential.data.user,
      password: credential.data.password,
      database: credential.data.database,
    });
    try {
      const [rows, fields] = await connection.query(sql, values);
      return { json: { rows, columns: (fields || []).map((field) => field.name) } };
    } finally {
      await connection.end();
    }
  }

  if (!services.db) {
    throw Object.assign(new Error('MySQL node has no database service available'), { code: 'NODE_NO_DATABASE' });
  }
  const [rows, fields] = await services.db.query(sql, values);
  return { json: { rows, columns: (fields || []).map((field) => field.name) } };
}
