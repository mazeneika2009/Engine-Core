/**
 * DAG helpers: normalise workflow graphs and order them for execution.
 *
 * Identity: nodes are addressed by `name` (unique per workflow, n8n-style).
 * Connection endpoints may reference either node id or node name — both are
 * normalised to names. Handles: "main" (default) plus "true" / "false"
 * branches emitted by condition nodes.
 */

export function indexNodes(nodes) {
  const byName = new Map();
  const idToName = new Map();
  for (const node of nodes || []) {
    if (!node || typeof node.name !== 'string') continue;
    byName.set(node.name, node);
    if (node.id) idToName.set(String(node.id), node.name);
  }
  return { byName, idToName };
}

function toName(value, idToName) {
  const key = String(value);
  return idToName.get(key) || key;
}

/** Normalise connections to { source, sourceHandle, target, targetHandle }. */
export function normalizeEdges(connections, nodes) {
  const { byName, idToName } = indexNodes(nodes);
  const edges = [];
  for (const connection of connections || []) {
    if (!connection || connection.source === undefined || connection.target === undefined) continue;
    const source = toName(connection.source, idToName);
    const target = toName(connection.target, idToName);
    if (!byName.has(source) || !byName.has(target)) continue;
    edges.push({
      source,
      sourceHandle: connection.sourceHandle || connection.output || 'main',
      target,
      targetHandle: connection.targetHandle || connection.input || 'main',
    });
  }
  return edges;
}

/**
 * Kahn's topological sort. Branch labels are ignored for ordering —
 * branch pruning happens at execution time (see executor.js).
 * Returns { order, hasCycle }.
 */
export function topologicalSort(nodeNames, edges) {
  const indegree = new Map(nodeNames.map((name) => [name, 0]));
  const outgoing = new Map(nodeNames.map((name) => [name, []]));
  const seen = new Set();
  for (const edge of edges) {
    const key = `${edge.source}→${edge.target}#${edge.sourceHandle}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!indegree.has(edge.source) || !indegree.has(edge.target)) continue;
    outgoing.get(edge.source).push(edge);
    indegree.set(edge.target, indegree.get(edge.target) + 1);
  }

  const queue = nodeNames.filter((name) => indegree.get(name) === 0);
  const order = [];
  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);
    for (const edge of outgoing.get(current)) {
      const remaining = indegree.get(edge.target) - 1;
      indegree.set(edge.target, remaining);
      if (remaining === 0) queue.push(edge.target);
    }
  }
  return { order, hasCycle: order.length !== nodeNames.length };
}

/** Entry points: nodes with no incoming edges. */
export function findEntryNodes(nodeNames, edges) {
  const hasIncoming = new Set(edges.map((edge) => edge.target));
  return nodeNames.filter((name) => !hasIncoming.has(name));
}

export function incomingEdges(edges, target) {
  return edges.filter((edge) => edge.target === target);
}

export function outgoingEdges(edges, source) {
  return edges.filter((edge) => edge.source === source);
}
