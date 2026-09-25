import { resolveParams } from 'shared';
import { compare } from './if.js';

/**
 * engine.switch — multi-branch router.
 * params: { input (default {{ $json }}), rules: [{ operator, value, output }],
 *           defaultOutput (default "default") }.
 * Returns { json: { matched, value }, branch } — the executor activates the
 * edge whose sourceHandle equals the branch name ("main" always flows too).
 */
export async function executeSwitch(rawParams, context) {
  const params = resolveParams(rawParams, context);
  const rules = Array.isArray(params.rules) ? params.rules : [];
  if (rules.length === 0) {
    throw Object.assign(new Error('Switch requires at least one rule'), { code: 'NODE_MISSING_PARAM' });
  }
  const input = params.input !== undefined ? params.input : context.$json;

  for (const rule of rules) {
    if (!rule || typeof rule.output !== 'string') continue;
    let matched = false;
    try {
      matched = compare(rule.operator, input, rule.value);
    } catch {
      matched = false;
    }
    if (matched) {
      return { json: { matched: rule.output, value: input }, branch: rule.output };
    }
  }
  const fallback = params.defaultOutput || 'default';
  return { json: { matched: fallback, value: input }, branch: fallback };
}

/**
 * engine.loop — params: { items (array or {{ }} expression, default {{ $json.items }}) }.
 * Splits a list into an explicit items envelope for downstream steps.
 */
export async function executeLoop(rawParams, context) {
  const params = resolveParams(rawParams, context);
  let items = params.items !== undefined ? params.items : context.$json?.items;
  if (items !== null && typeof items === 'object' && !Array.isArray(items) && Array.isArray(items.items)) {
    items = items.items;
  }
  if (!Array.isArray(items)) {
    throw Object.assign(new Error('Loop requires an array in "items"'), { code: 'NODE_MISSING_PARAM' });
  }
  return {
    json: {
      items,
      count: items.length,
      first: items[0] !== undefined ? items[0] : null,
      last: items[items.length - 1] !== undefined ? items[items.length - 1] : null,
    },
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * engine.delay — params: { duration, unit: ms|s|m }. Capped at 5 minutes.
 * Passes the input straight through after the pause.
 */
export async function executeDelay(rawParams, context) {
  const params = resolveParams(rawParams, context);
  const unit = params.unit || 's';
  const factor = unit === 'ms' ? 1 : unit === 'm' ? 60000 : 1000;
  const ms = Math.min(Math.max(Number(params.duration ?? 1) * factor || 0, 0), 300000);
  if (ms > 0) await sleep(ms);
  return { json: context.$json !== undefined ? context.$json : {} };
}
