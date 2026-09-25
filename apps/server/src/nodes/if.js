import { resolveParams } from 'shared';

function isEmpty(value) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
}

export function compare(operator, left, right) {
  switch (operator) {
    case 'equals':
      // eslint-disable-next-line eqeqeq
      return left == right;
    case 'notEquals':
      // eslint-disable-next-line eqeqeq
      return left != right;
    case 'contains':
      if (typeof left === 'string') return left.includes(String(right));
      if (Array.isArray(left)) return left.includes(right);
      return false;
    case 'notContains':
      if (typeof left === 'string') return !left.includes(String(right));
      if (Array.isArray(left)) return !left.includes(right);
      return true;
    case 'greaterThan':
      return Number(left) > Number(right);
    case 'lessThan':
      return Number(left) < Number(right);
    case 'greaterEqual':
      return Number(left) >= Number(right);
    case 'lessEqual':
      return Number(left) <= Number(right);
    case 'isEmpty':
      return isEmpty(left);
    case 'isNotEmpty':
      return !isEmpty(left);
    default:
      throw Object.assign(new Error(`Unknown condition operator "${operator}"`), { code: 'NODE_BAD_OPERATOR' });
  }
}

/**
 * engine.if — params: { conditions: [{ left, operator, right }], combine: 'and'|'or' }
 * or the single-condition shorthand { left, operator, right }.
 * Returns { json: { result }, branch } so the executor can gate true/false edges.
 */
export async function executeIf(rawParams, context) {
  const params = resolveParams(rawParams, context);
  const conditions = Array.isArray(params.conditions)
    ? params.conditions
    : params.left !== undefined || params.operator !== undefined
      ? [{ left: params.left, operator: params.operator, right: params.right }]
      : [];
  if (conditions.length === 0) {
    throw Object.assign(new Error('IF node requires at least one condition'), { code: 'NODE_MISSING_PARAM' });
  }
  const results = conditions.map((condition) => compare(condition.operator, condition.left, condition.right));
  const result = params.combine === 'or' ? results.some(Boolean) : results.every(Boolean);
  return { json: { result }, branch: result };
}
