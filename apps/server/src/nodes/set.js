import { resolveParams, getPathValue } from 'shared';

function setDeep(target, path, value) {
  const segments = String(path).split('.');
  let current = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (current[segment] === null || typeof current[segment] !== 'object') current[segment] = {};
    current = current[segment];
  }
  current[segments[segments.length - 1]] = value;
}

/**
 * engine.set / engine.transform.
 * - Set Fields:      { assignments: [{ name, value }], includeInput }
 * - JSON Transform:  { template: { key: "value with {{ }}" }, includeInput }
 * Values support {{ }} expressions; assignment names support dot paths (user.id).
 */
export async function executeSet(rawParams, context) {
  const params = resolveParams(rawParams, context);

  let base = {};
  if (params.includeInput) {
    const input = context.$json;
    base = input && typeof input === 'object' ? { ...input } : { value: input };
  }

  // JSON Transform shape: a template object whose values are expressions.
  if (params.template !== undefined && params.template !== null && typeof params.template === 'object' && !Array.isArray(params.template)) {
    return { json: { ...base, ...params.template } };
  }

  const assignments = Array.isArray(params.assignments) ? params.assignments : [];

  for (const assignment of assignments) {
    if (!assignment || typeof assignment.name !== 'string' || assignment.name.length === 0) continue;
    setDeep(base, assignment.name, assignment.value);
  }
  return { json: base };
}

/** Back-compat helper exported for tests. */
export { getPathValue };
