import { createClient } from 'redis';
import { resolveParams } from 'shared';

/**
 * engine.redis — params: { operation: get|set|delete, key, value, ttl (seconds),
 * credential: redis { url } or { host, port, password, db } }.
 */
export async function executeRedis(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const operation = params.operation || 'get';
  if (!params.key) throw Object.assign(new Error('Redis node requires a "key"'), { code: 'NODE_MISSING_PARAM' });

  let credential = null;
  if (params.credential && services.getCredential) {
    credential = await services.getCredential(params.credential);
    if (credential && credential.type !== 'redis') {
      throw Object.assign(new Error(`Credential "${params.credential}" is not a redis credential`), { code: 'NODE_BAD_CREDENTIAL' });
    }
  }

  const url = credential?.data?.url
    || (credential?.data?.host
      ? `redis://${credential.data.password ? `:${encodeURIComponent(credential.data.password)}@` : ''}${credential.data.host}:${credential.data.port || 6379}/${credential.data.db || 0}`
      : 'redis://127.0.0.1:6379');

  const client = createClient({ url, socket: { connectTimeout: 8000 } });
  client.on('error', () => {});
  try {
    await client.connect();
    if (operation === 'get') {
      const value = await client.get(String(params.key));
      return { json: { key: params.key, value } };
    }
    if (operation === 'set') {
      const value = typeof params.value === 'string' ? params.value : JSON.stringify(params.value ?? null);
      if (Number(params.ttl) > 0) {
        await client.set(String(params.key), value, { EX: Number(params.ttl) });
      } else {
        await client.set(String(params.key), value);
      }
      return { json: { key: params.key, stored: true } };
    }
    if (operation === 'delete') {
      const removed = await client.del(String(params.key));
      return { json: { key: params.key, removed } };
    }
    throw Object.assign(new Error(`Unknown redis operation "${operation}"`), { code: 'NODE_BAD_OPERATOR' });
  } catch (error) {
    if (error.code === 'NODE_BAD_OPERATOR') throw error;
    throw Object.assign(new Error(`Redis failed: ${error.message}`), { code: 'NODE_REDIS_ERROR' });
  } finally {
    await client.disconnect().catch(() => {});
  }
}
