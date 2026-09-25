import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from '../src/engine/executor.js';
import { validateNodeDefinition } from 'shared';
import { NODE_DEFINITIONS } from '../../client/src/nodes/index.js';

const ctx = {
  $node: {},
  $input: { json: {} },
  $json: {},
  $workflow: { id: 'wf-t', name: 'Tests' },
  $execution: { id: 'exec-t' },
  $now: new Date().toISOString(),
};

describe('catalog integrity', () => {
  it('ships 31 valid definitions across 6 categories', () => {
    assert.equal(NODE_DEFINITIONS.length, 31);
    const categories = [...new Set(NODE_DEFINITIONS.map((def) => def.category))].sort();
    assert.deepEqual(categories, ['AI & ML', 'DATA', 'INTEGRATIONS', 'LOGIC', 'SYSTEM', 'TRIGGERS']);
    for (const def of NODE_DEFINITIONS) {
      const { valid, errors } = validateNodeDefinition(def);
      assert.equal(valid, true, `${def.type}: ${errors.join('; ')}`);
    }
  });

  it('uses unique types and two-letter monograms', () => {
    const types = NODE_DEFINITIONS.map((def) => def.type);
    assert.equal(new Set(types).size, types.length);
    for (const def of NODE_DEFINITIONS) {
      assert.match(def.monogram, /^[A-Za-z]{2}$/, def.type);
    }
  });
});

describe('new executors', () => {
  it('sentiment classifies tone', async () => {
    const positive = await runExecutor('sentiment', { text: 'I love this amazing product, thank you!' }, ctx);
    assert.equal(positive.json.sentiment, 'positive');
    const negative = await runExecutor('sentiment', { text: 'Terrible broken crash, I hate it, refund now' }, ctx);
    assert.equal(negative.json.sentiment, 'negative');
  });

  it('summarizer compresses long text', async () => {
    const text = 'The engine runs every hour. It pulls fresh orders from the API. ' +
      'Each order is validated against the schema. Failures are logged to the database. ' +
      'A summary email goes out at midnight. Operators review the dashboard daily.';
    const result = await runExecutor('summarize', { text, sentences: 2 }, ctx);
    assert.equal(result.json.sentences, 2);
    assert.ok(result.json.summary.length < text.length);
  });

  it('switch selects a named branch', async () => {
    const result = await runExecutor('switch', {
      input: 'pro',
      rules: [{ operator: 'equals', value: 'pro', output: 'pro' }],
      defaultOutput: 'default',
    }, ctx);
    assert.equal(result.branch, 'pro');
    assert.deepEqual(result.json, { matched: 'pro', value: 'pro' });
  });

  it('switch falls back to the default output', async () => {
    const result = await runExecutor('switch', {
      input: 'free',
      rules: [{ operator: 'equals', value: 'pro', output: 'pro' }],
      defaultOutput: 'default',
    }, ctx);
    assert.equal(result.branch, 'default');
  });

  it('loop splits arrays with head/tail metadata', async () => {
    const result = await runExecutor('loop', { items: [1, 2, 3] }, ctx);
    assert.deepEqual(result.json, { items: [1, 2, 3], count: 3, first: 1, last: 3 });
  });

  it('delay passes input through', async () => {
    const withInput = { ...ctx, $json: { a: 1 } };
    const result = await runExecutor('delay', { duration: 5, unit: 'ms' }, withInput);
    assert.deepEqual(result.json, { a: 1 });
  });

  it('codeJs runs sandboxed with $json in scope', async () => {
    const withInput = { ...ctx, $json: { total: 21 } };
    const result = await runExecutor('codeJs', { code: 'return { total: $json.total * 2 };' }, withInput);
    assert.deepEqual(result.json, { total: 42 });
  });

  it('exec runs commands and captures output', async () => {
    const result = await runExecutor('exec', { command: 'node', args: ['--version'] }, ctx);
    assert.equal(result.json.exitCode, 0);
    assert.match(result.json.stdout.trim(), /^v\d+/);
  });

  it('fileSystem round-trips inside the sandbox', async () => {
    const name = `catalog-test-${Date.now()}.txt`;
    await runExecutor('file', { operation: 'write', path: name, content: 'hello' }, ctx);
    const read = await runExecutor('file', { operation: 'read', path: name }, ctx);
    assert.equal(read.json.content, 'hello');
    await runExecutor('file', { operation: 'delete', path: name }, ctx);
  });

  it('fileSystem rejects path traversal', async () => {
    await assert.rejects(
      runExecutor('file', { operation: 'read', path: '../../evil.txt' }, ctx),
      /sandbox/
    );
  });
});
