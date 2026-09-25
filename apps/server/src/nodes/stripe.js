import crypto from 'node:crypto';
import { resolveParams } from 'shared';

/**
 * engine.stripeEvent — webhook entry for payment events.
 * params: { verify (bool, default true), credential: stripe { webhookSecret } }.
 *
 * The webhook controller forwards the raw request body, so a configured
 * secret enables real HMAC signature verification. Without a secret the
 * event passes through with verified:false.
 */
export async function executeStripe(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const input = context.$json && typeof context.$json === 'object' ? context.$json : {};
  const headers = input.headers || {};
  const signature = headers['stripe-signature'] || headers['Stripe-Signature'];

  let credential = null;
  if (params.credential && services.getCredential) {
    credential = await services.getCredential(params.credential);
  }
  const secret = credential?.data?.webhookSecret;
  const shouldVerify = params.verify !== false;

  if (shouldVerify && secret && signature && typeof input.rawBody === 'string') {
    const parts = Object.fromEntries(
      signature.split(',').map((part) => part.split('=').map((item) => item.trim()))
    );
    const signedPayload = `${parts.t}.${input.rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');
    const verified = parts.v1
      && expected.length === parts.v1.length
      && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
    if (!verified) {
      throw Object.assign(new Error('Stripe signature verification failed'), { code: 'NODE_SIGNATURE_INVALID' });
    }
    return { json: { verified: true, event: input.body, type: input.body?.type } };
  }

  return { json: { verified: false, event: input.body !== undefined ? input.body : input, query: input.query || {} } };
}
