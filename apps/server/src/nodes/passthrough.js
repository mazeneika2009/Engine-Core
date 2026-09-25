import { resolveParams } from 'shared';

/**
 * Fallback executor for notification-style nodes (email, whatsapp, …)
 * without a dedicated transport. Resolves expressions and returns the
 * materialised payload so executions stay observable; wire a real
 * provider by adding an executor and pointing the node definition at it.
 */
export async function executePassthrough(rawParams, context) {
  const params = resolveParams(rawParams, context);
  return { json: { queued: true, params } };
}
