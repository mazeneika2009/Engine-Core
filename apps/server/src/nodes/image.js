import { resolveParams } from 'shared';

async function loadCredential(params, services) {
  if (params.credential && services.getCredential) {
    return services.getCredential(params.credential);
  }
  return null;
}

/**
 * engine.imageGenerator — params: { provider: openai|stability, prompt,
 * size (openai) | aspectRatio (stability), credential: openai|stability { apiKey } }.
 * Returns { images: [{ url }] } or { images: [{ b64 }] }.
 */
export async function executeImage(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.prompt) throw Object.assign(new Error('Image node requires a "prompt"'), { code: 'NODE_MISSING_PARAM' });
  const credential = await loadCredential(params, services);
  if (!credential?.data?.apiKey) {
    throw Object.assign(new Error('Image node requires a credential with an API key'), { code: 'NODE_MISSING_CREDENTIAL' });
  }

  if (params.provider === 'stability') {
    const form = new FormData();
    form.set('prompt', String(params.prompt));
    form.set('output_format', 'png');
    if (params.aspectRatio) form.set('aspect_ratio', String(params.aspectRatio));
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
      method: 'POST',
      headers: { Authorization: `Bearer ${credential.data.apiKey}`, Accept: 'application/json' },
      body: form,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data?.message || `Stability error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
    return { json: { images: [{ b64: data.image }], provider: 'stability' } };
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${credential.data.apiKey}` },
    body: JSON.stringify({
      model: params.model || 'dall-e-3',
      prompt: String(params.prompt),
      size: params.size || '1024x1024',
      n: 1,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data?.error?.message || `OpenAI error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
  }
  return { json: { images: (data.data || []).map((item) => ({ url: item.url })), provider: 'openai' } };
}
