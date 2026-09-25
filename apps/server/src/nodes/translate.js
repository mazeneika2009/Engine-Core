import { resolveParams } from 'shared';

async function loadCredential(params, services) {
  if (params.credential && services.getCredential) {
    return services.getCredential(params.credential);
  }
  return null;
}

/**
 * engine.autoTranslate — params: { provider: google|deepl, text, source (default auto),
 * target (default en), credential: translate { apiKey } }.
 */
export async function executeTranslate(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const text = String(params.text ?? '');
  if (!text.trim()) throw Object.assign(new Error('Translate node requires "text"'), { code: 'NODE_MISSING_PARAM' });
  const credential = await loadCredential(params, services);
  if (!credential?.data?.apiKey) {
    throw Object.assign(new Error('Translate node requires a translate credential with an API key'), { code: 'NODE_MISSING_CREDENTIAL' });
  }
  const target = params.target || 'en';
  const source = params.source || 'auto';

  if (params.provider === 'deepl') {
    const body = new URLSearchParams({ text, target_lang: target.toUpperCase() });
    if (source !== 'auto') body.set('source_lang', source.toUpperCase());
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${credential.data.apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data?.message || `DeepL error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
    const first = data.translations?.[0] || {};
    return { json: { translatedText: first.text || '', detectedSource: first.detected_source_language || source, target, provider: 'deepl' } };
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(credential.data.apiKey)}`;
  const payload = { q: text, target };
  if (source !== 'auto') payload.source = source;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data?.error?.message || `Google Translate error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
  }
  const first = data.data?.translations?.[0] || {};
  return {
    json: {
      translatedText: first.translatedText || '',
      detectedSource: first.detectedSourceLanguage || source,
      target,
      provider: 'google',
    },
  };
}
