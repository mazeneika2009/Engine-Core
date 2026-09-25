import { resolveParams } from 'shared';

function applyCredential(headers, credential) {
  if (!credential) return headers;
  const out = { ...headers };
  if (credential.type === 'httpBasic' && credential.data) {
    const token = Buffer.from(`${credential.data.username || ''}:${credential.data.password || ''}`).toString('base64');
    out.Authorization = `Basic ${token}`;
  } else if (credential.type === 'httpBearer' && credential.data) {
    out.Authorization = `Bearer ${credential.data.token || ''}`;
  } else if (credential.type === 'httpHeader' && credential.data) {
    out[credential.data.name || 'X-Api-Key'] = credential.data.value || '';
  }
  return out;
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

/**
 * engine.httpRequest — params: { method, url, headers(json|string), body(json|string),
 * timeout, credential (credential id, optional) }.
 */
export async function executeHttpRequest(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const method = String(params.method || 'GET').toUpperCase();
  const url = String(params.url || '');
  if (!url) throw Object.assign(new Error('HTTP Request requires a "url"'), { code: 'NODE_MISSING_PARAM' });

  let credential = null;
  if (params.credential && services.getCredential) {
    credential = await services.getCredential(params.credential);
  }

  let headers = {};
  if (params.headers !== undefined && params.headers !== null && params.headers !== '') {
    headers = typeof params.headers === 'object' ? params.headers : JSON.parse(String(params.headers));
  }
  headers = applyCredential(headers, credential);

  const timeoutMs = Number(params.timeout) > 0 ? Number(params.timeout) : 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const init = { method, headers, signal: controller.signal };
  if (params.body !== undefined && params.body !== null && params.body !== '' && method !== 'GET' && method !== 'HEAD') {
    init.body = typeof params.body === 'string' ? params.body : JSON.stringify(params.body);
    if (!init.headers['Content-Type'] && !init.headers['content-type']) {
      init.headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(url, init);
    const data = await parseBody(response);
    return {
      json: data,
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw Object.assign(new Error(`HTTP Request timed out after ${timeoutMs}ms`), { code: 'NODE_TIMEOUT' });
    }
    throw Object.assign(new Error(`HTTP Request failed: ${error.message}`), { code: 'NODE_REQUEST_FAILED' });
  } finally {
    clearTimeout(timer);
  }
}
