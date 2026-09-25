/**
 * Client-side expression helpers. Resolution semantics live in the shared
 * package (single source of truth with the server executor); this module
 * adds canvas preview conveniences.
 */
export {
  EXPRESSION_RE,
  parsePath,
  getPathValue,
  resolveExpressionBody,
  resolveValue,
  resolveParams,
  hasExpressions,
  collectNodeReferences,
} from 'shared';

/**
 * Live preview: resolve params against the outputs recorded so far.
 * Unresolvable expressions render as empty strings (never throw).
 */
import { resolveParams } from 'shared';

export function previewParams(params, outputs, meta = {}) {
  const context = {
    $node: outputs || {},
    $input: {},
    $json: {},
    $workflow: { id: meta.workflowId || '', name: meta.workflowName || '' },
    $execution: { id: 'preview' },
    $now: new Date().toISOString(),
  };
  try {
    return resolveParams(params || {}, context);
  } catch {
    return params || {};
  }
}
