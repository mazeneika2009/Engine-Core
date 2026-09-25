import pg from 'pg';
import { resolveParams } from 'shared';

/**
 * engine.postgres — params: { query, params (array), credential: postgres
 * { host, port, user, password, database, ssl } }. Opens a short-lived client.
 */
export async function executePostgres(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const sql = String(params.query || '').trim();
  if (!sql) throw Object.assign(new Error('Postgres node requires a "query"'), { code: 'NODE_MISSING_PARAM' });

  let credential = null;
  if (params.credential && services.getCredential) {
    credential = await services.getCredential(params.credential);
    if (credential && credential.type !== 'postgres') {
      throw Object.assign(new Error(`Credential "${params.credential}" is not a postgres credential`), { code: 'NODE_BAD_CREDENTIAL' });
    }
  }
  if (!credential) {
    throw Object.assign(new Error('Postgres node requires a postgres credential'), { code: 'NODE_MISSING_CREDENTIAL' });
  }

  const client = new pg.Client({
    host: credential.data.host || '127.0.0.1',
    port: Number(credential.data.port) || 5432,
    user: credential.data.user,
    password: credential.data.password,
    database: credential.data.database,
    ssl: credential.data.ssl ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 10000,
  });
  try {
    await client.connect();
    const result = await client.query(sql, Array.isArray(params.params) ? params.params : []);
    return {
      json: {
        rows: result.rows,
        columns: result.fields.map((field) => field.name),
        rowCount: result.rowCount,
      },
    };
  } catch (error) {
    throw Object.assign(new Error(`Postgres query failed: ${error.message}`), { code: 'NODE_QUERY_FAILED' });
  } finally {
    await client.end().catch(() => {});
  }
}
