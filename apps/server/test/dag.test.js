import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { topologicalSort, normalizeEdges, findEntryNodes } from '../src/engine/dag.js';

const NODES = [
  { id: 'a', name: 'Webhook', type: 'engine.webhook' },
  { id: 'b', name: 'Set Fields', type: 'engine.set' },
  { id: 'c', name: 'IF', type: 'engine.if' },
  { id: 'd', name: 'HTTP Request', type: 'engine.httpRequest' },
  { id: 'e', name: 'Email', type: 'engine.email' },
];

describe('dag.topologicalSort', () => {
  it('orders dependencies before dependents', () => {
    const edges = normalizeEdges([
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'd', sourceHandle: 'true' },
      { source: 'c', target: 'e', sourceHandle: 'false' },
    ], NODES);
    const { order, hasCycle } = topologicalSort(NODES.map((n) => n.name), edges);
    assert.equal(hasCycle, false);
    const position = Object.fromEntries(order.map((name, index) => [name, index]));
    assert.ok(position.Webhook < position['Set Fields']);
    assert.ok(position['Set Fields'] < position.IF);
    assert.ok(position.IF < position['HTTP Request']);
    assert.ok(position.IF < position.Email);
  });

  it('resolves id-based endpoints to node names', () => {
    const edges = normalizeEdges([{ source: 'a', target: 'b' }], NODES);
    assert.deepEqual(edges, [{ source: 'Webhook', sourceHandle: 'main', target: 'Set Fields', targetHandle: 'main' }]);
  });

  it('detects cycles', () => {
    const edges = normalizeEdges([
      { source: 'a', target: 'b' },
      { source: 'b', target: 'a' },
    ], NODES);
    const { hasCycle } = topologicalSort(NODES.map((n) => n.name), edges);
    assert.equal(hasCycle, true);
  });

  it('finds entry nodes', () => {
    const edges = normalizeEdges([{ source: 'a', target: 'b' }], NODES);
    const entries = findEntryNodes(NODES.map((n) => n.name), edges);
    assert.ok(entries.includes('Webhook'));
    assert.ok(!entries.includes('Set Fields'));
  });
});
