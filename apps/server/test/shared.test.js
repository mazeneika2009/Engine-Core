import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveValue, hasExpressions, collectNodeReferences } from 'shared';
import { validateNodeDefinition, validateWorkflow, isPropertyVisible, coerceValue } from 'shared';

const context = {
  $node: { 'HTTP Request': { json: { data: { userId: 9 } } } },
  $input: { json: { id: 9 } },
  $json: { id: 9 },
  $workflow: { id: 'wf-1', name: 'Demo' },
  $execution: { id: 'exec-1' },
  $now: '2026-01-01T00:00:00.000Z',
};

describe('shared expressions', () => {
  it('resolves $node["Name"].json paths with raw types preserved', () => {
    assert.equal(resolveValue('{{ $node["HTTP Request"].json.data.userId }}', context), 9);
    assert.equal(resolveValue('user-{{ $json.id }}', context), 'user-9');
  });

  it('interpolates $workflow / $execution / $now', () => {
    assert.equal(resolveValue('{{ $workflow.name }}-{{ $execution.id }}', context), 'Demo-exec-1');
    assert.equal(resolveValue('{{ $now }}', context), '2026-01-01T00:00:00.000Z');
  });

  it('resolves nested objects and arrays', () => {
    assert.deepEqual(
      resolveValue({ a: '{{ $json.id }}', b: ['x-{{ $json.id }}'] }, context),
      { a: 9, b: ['x-9'] }
    );
  });

  it('returns empty string for missing paths inside text', () => {
    assert.equal(resolveValue('hi {{ $node["Nope"].json.x }}!', context), 'hi !');
  });

  it('detects expressions and collects node references', () => {
    assert.equal(hasExpressions('{{ $json.id }}'), true);
    assert.equal(hasExpressions('plain'), false);
    assert.deepEqual(collectNodeReferences({ v: '{{ $node["HTTP Request"].json }}' }), ['HTTP Request']);
  });
});

describe('shared schemas', () => {
  it('accepts a well-formed node definition', () => {
    const { valid, errors } = validateNodeDefinition({
      type: 'engine.httpRequest',
      displayName: 'HTTP Request',
      properties: [
        { name: 'method', displayName: 'Method', type: 'select', options: ['GET', 'POST'] },
        { name: 'url', displayName: 'URL', type: 'string', required: true },
      ],
      execute: 'httpRequest',
    });
    assert.equal(valid, true);
    assert.deepEqual(errors, []);
  });

  it('rejects unknown property types and executors', () => {
    const { valid, errors } = validateNodeDefinition({
      type: 'engine.broken',
      displayName: 'Broken',
      properties: [{ name: 'x', displayName: 'X', type: 'slider' }],
      execute: 'teleport',
    });
    assert.equal(valid, false);
    assert.ok(errors.length >= 2);
  });

  it('validates workflows and flags unknown endpoints', () => {
    const { valid, errors } = validateWorkflow({
      name: 'W',
      nodes: [{ name: 'A', type: 'engine.manual' }],
      connections: [{ source: 'A', target: 'Ghost' }],
    });
    assert.equal(valid, false);
    assert.ok(errors.some((message) => message.includes('Ghost')));
  });

  it('evaluates displayOptions show/hide', () => {
    const property = { name: 'body', displayName: 'Body', type: 'json', displayOptions: { show: { method: ['POST'] } } };
    assert.equal(isPropertyVisible(property, { method: 'POST' }), true);
    assert.equal(isPropertyVisible(property, { method: 'GET' }), false);
  });

  it('coerces numbers and booleans', () => {
    assert.equal(coerceValue({ name: 'n', type: 'number' }, '12'), 12);
    assert.equal(coerceValue({ name: 'b', type: 'boolean' }, 'true'), true);
  });
});
