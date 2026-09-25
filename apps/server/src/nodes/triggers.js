import { resolveParams } from 'shared';

/** Entry-point nodes (manual / webhook / schedule): forward the trigger payload. */
export async function executeTrigger(params, context) {
  const resolved = resolveParams(params, context);
  const input = context.$input && typeof context.$input === 'object' && 'json' in context.$input
    ? context.$input.json
    : context.$input;
  return { json: input !== undefined ? input : {}, params: resolved };
}
