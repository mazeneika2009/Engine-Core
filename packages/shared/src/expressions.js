/**
 * Dynamic expression engine (shared by client preview + server execution).
 *
 * Supported interpolation syntax inside string params:
 *   {{ $node["Node Name"].json.data.userId }}
 *   {{ $node['Node Name'].json.items[0].id }}
 *   {{ $input.json.total }}
 *   {{ $json.total }}
 *   {{ $workflow.id }}  {{ $workflow.name }}
 *   {{ $execution.id }}  {{ $now }}
 *
 * If a string consists of exactly one expression, the resolved raw value
 * (object / number / boolean) is preserved. Otherwise expressions are
 * interpolated into the surrounding string.
 */

export const EXPRESSION_RE = /\{\{\s*([\s\S]+?)\s*\}\}/g;

/** Split a dotted/bracket path into segments: a.b[0]["c d"] -> ['a','b',0,'c d'] */
export function parsePath(path) {
  const segments = [];
  const re = /([^.[\]]+)|\[(\d+|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\]/g;
  let match;
  while ((match = re.exec(path)) !== null) {
    if (match[1] !== undefined) {
      segments.push(match[1]);
    } else {
      const inner = match[2];
      if (/^\d+$/.test(inner)) segments.push(Number(inner));
      else segments.push(inner.slice(1, -1).replace(/\\(.)/g, '$1'));
    }
  }
  return segments;
}

/** Safe deep lookup. Returns undefined for missing paths (never throws). */
export function getPathValue(root, path) {
  if (root === null || root === undefined) return undefined;
  if (!path) return root;
  let current = root;
  for (const segment of parsePath(path)) {
    if (current === null || current === undefined) return undefined;
    current = current[segment];
  }
  return current;
}

/**
 * Resolve a single expression body (without {{ }}) against a context.
 * @param {string} body
 * @param {import('../types/index.js').ExecutionContext} context
 */
export function resolveExpressionBody(body, context) {
  const trimmed = body.trim();

  const nodeMatch = trimmed.match(/^\$node\[\s*("([^"]+)"|'([^']+)')\s*\](.*)$/);
  if (nodeMatch) {
    const name = nodeMatch[2] ?? nodeMatch[3];
    const rest = (nodeMatch[4] || '').replace(/^\./, '');
    const output = context.$node ? context.$node[name] : undefined;
    if (output === undefined) return undefined;
    return rest ? getPathValue(output, rest) : output;
  }

  if (trimmed === '$input') return context.$input;
  if (trimmed === '$json') return context.$json;
  if (trimmed.startsWith('$input.')) return getPathValue(context.$input, trimmed.slice('$input.'.length));
  if (trimmed.startsWith('$json.')) return getPathValue(context.$json, trimmed.slice('$json.'.length));
  if (trimmed === '$workflow') return context.$workflow;
  if (trimmed.startsWith('$workflow.')) return getPathValue(context.$workflow, trimmed.slice('$workflow.'.length));
  if (trimmed === '$execution') return context.$execution;
  if (trimmed.startsWith('$execution.')) return getPathValue(context.$execution, trimmed.slice('$execution.'.length));
  if (trimmed === '$now') return context.$now;

  return undefined;
}

function stringifyResolved(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Resolve any value (string / array / object) against a context.
 * Strings containing {{ }} are interpolated; whole-string single
 * expressions preserve their native type.
 */
export function resolveValue(value, context) {
  if (typeof value === 'string') {
    EXPRESSION_RE.lastIndex = 0;
    const matches = [...value.matchAll(EXPRESSION_RE)];
    if (matches.length === 0) return value;
    if (matches.length === 1 && matches[0][0] === value) {
      return resolveExpressionBody(matches[0][1], context);
    }
    return value.replace(EXPRESSION_RE, (_, body) => stringifyResolved(resolveExpressionBody(body, context)));
  }
  if (Array.isArray(value)) return value.map((item) => resolveValue(item, context));
  if (value !== null && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) out[key] = resolveValue(item, context);
    return out;
  }
  return value;
}

/** Resolve a full params object for one node execution. */
export function resolveParams(params, context) {
  return resolveValue(params || {}, context);
}

/** True when a value contains at least one {{ }} expression. */
export function hasExpressions(value) {
  if (typeof value !== 'string') return false;
  EXPRESSION_RE.lastIndex = 0;
  return EXPRESSION_RE.test(value);
}

/** Collect referenced node names from a params object (for dependency hints). */
export function collectNodeReferences(params) {
  const refs = new Set();
  const visit = (value) => {
    if (typeof value === 'string') {
      EXPRESSION_RE.lastIndex = 0;
      for (const match of value.matchAll(EXPRESSION_RE)) {
        const nodeMatch = match[1].trim().match(/^\$node\[\s*("([^"]+)"|'([^']+)')\s*\]/);
        if (nodeMatch) refs.add(nodeMatch[2] ?? nodeMatch[3]);
      }
    } else if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (value !== null && typeof value === 'object') {
      Object.values(value).forEach(visit);
    }
  };
  visit(params);
  return [...refs];
}
