import { resolveParams } from 'shared';

async function loadCredential(params, services) {
  if (params.credential && services.getCredential) {
    return services.getCredential(params.credential);
  }
  return null;
}

/**
 * engine.googleSheets — params: { operation: read|append|update,
 * spreadsheetId, range (e.g. Sheet1!A:D), values (2D array for writes),
 * credential: google { apiKey } (read) or { accessToken } (write) }.
 */
export async function executeSheets(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.spreadsheetId || !params.range) {
    throw Object.assign(new Error('Sheets node requires "spreadsheetId" and "range"'), { code: 'NODE_MISSING_PARAM' });
  }
  const credential = await loadCredential(params, services);
  const operation = params.operation || 'read';
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(params.spreadsheetId)}/values/${encodeURIComponent(params.range)}`;

  if (operation === 'read') {
    const apiKey = credential?.data?.apiKey || params.apiKey;
    if (!apiKey) throw Object.assign(new Error('Sheets read requires a google credential with an API key'), { code: 'NODE_MISSING_CREDENTIAL' });
    const response = await fetch(`${base}?key=${encodeURIComponent(apiKey)}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data?.error?.message || `Sheets error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
    return { json: { range: data.range, values: data.values || [] } };
  }

  const accessToken = credential?.data?.accessToken;
  if (!accessToken) {
    throw Object.assign(new Error('Sheets write requires a google credential with an OAuth accessToken'), { code: 'NODE_MISSING_CREDENTIAL' });
  }
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
  if (operation === 'append') {
    const response = await fetch(`${base}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ values: params.values || [] }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data?.error?.message || `Sheets error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
    return { json: { updatedRange: data.updates?.updatedRange, updatedRows: data.updates?.updatedRows } };
  }
  if (operation === 'update') {
    const response = await fetch(`${base}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ values: params.values || [] }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data?.error?.message || `Sheets error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
    return { json: { updatedRange: data.updatedRange, updatedRows: data.updatedRows } };
  }
  throw Object.assign(new Error(`Unknown sheets operation "${operation}"`), { code: 'NODE_BAD_OPERATOR' });
}
