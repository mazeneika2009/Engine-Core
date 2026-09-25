import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { executeWorkflow } from '../src/engine/executor.js';

function modelsStub() {
  const calls = { created: 0, finished: [] };
  return {
    calls,
    executions: {
      createExecution: async (workflowId) => {
        calls.created += 1;
        return { id: 'exec-1', workflow_id: workflowId, status: 'running' };
      },
      finishExecution: async (id, patch) => {
        calls.finished.push({ id, ...patch });
        return { id, ...patch };
      },
    },
  };
}

const LINEAR = {
  id: 'wf-1',
  name: 'Linear',
  nodes: [
    { id: 'a', name: 'Manual', type: 'engine.manualTrigger', params: {} },
    { id: 'b', name: 'Set Fields', type: 'engine.setFields', params: { assignments: [{ name: 'userId', value: '{{ $json.id }}' }], includeInput: true } },
  ],
  connections: [{ source: 'a', target: 'b' }],
};

const BRANCH = {
  id: 'wf-2',
  name: 'Branch',
  nodes: [
    { id: 'a', name: 'Manual', type: 'engine.manualTrigger', params: {} },
    { id: 'b', name: 'IF', type: 'engine.ifCondition', params: { left: '{{ $json.total }}', operator: 'greaterThan', right: '100' } },
    { id: 'c', name: 'Big', type: 'engine.setFields', params: { assignments: [{ name: 'tier', value: 'big' }] } },
    { id: 'd', name: 'Small', type: 'engine.setFields', params: { assignments: [{ name: 'tier', value: 'small' }] } },
  ],
  connections: [
    { source: 'a', target: 'b' },
    { source: 'b', target: 'c', sourceHandle: 'true' },
    { source: 'b', target: 'd', sourceHandle: 'false' },
  ],
};

describe('executor', () => {
  it('runs a linear graph and resolves $json expressions', async () => {
    const models = modelsStub();
    const result = await executeWorkflow({ workflow: LINEAR, inputData: { id: 42 }, models });
    assert.equal(result.status, 'success');
    assert.deepEqual(result.outputs['Set Fields'].json, { id: 42, userId: 42 });
    assert.equal(models.calls.created, 1);
    assert.equal(models.calls.finished[0].status, 'success');
  });

  it('follows the true branch only', async () => {
    const result = await executeWorkflow({ workflow: BRANCH, inputData: { total: 250 }, models: modelsStub() });
    assert.equal(result.status, 'success');
    assert.deepEqual(result.outputs.Big.json, { tier: 'big' });
    assert.equal(result.outputs.Small, undefined);
    assert.deepEqual(result.final.json, { tier: 'big' });
  });

  it('follows the false branch only', async () => {
    const result = await executeWorkflow({ workflow: BRANCH, inputData: { total: 10 }, models: modelsStub() });
    assert.equal(result.status, 'success');
    assert.deepEqual(result.outputs.Small.json, { tier: 'small' });
    assert.equal(result.outputs.Big, undefined);
  });

  it('references upstream steps via $node["Name"]', async () => {
    const workflow = {
      id: 'wf-3',
      name: 'Refs',
      nodes: [
        { id: 'a', name: 'First', type: 'engine.setFields', params: { assignments: [{ name: 'id', value: '7' }] } },
        { id: 'b', name: 'Second', type: 'engine.setFields', params: { assignments: [{ name: 'copy', value: '{{ $node["First"].json.id }}' }] } },
      ],
      connections: [{ source: 'a', target: 'b' }],
    };
    const result = await executeWorkflow({ workflow, inputData: {}, models: modelsStub() });
    assert.equal(result.outputs.Second.json.copy, '7');
  });

  it('rejects cyclic graphs', async () => {
    const workflow = {
      id: 'wf-4',
      name: 'Cycle',
      nodes: [
        { id: 'a', name: 'A', type: 'engine.setFields', params: {} },
        { id: 'b', name: 'B', type: 'engine.setFields', params: {} },
      ],
      connections: [{ source: 'a', target: 'b' }, { source: 'b', target: 'a' }],
    };
    await assert.rejects(() => executeWorkflow({ workflow, inputData: {}, models: modelsStub() }), /cycle/);
  });

  it('records failures with node attribution', async () => {
    const models = modelsStub();
    const workflow = {
      id: 'wf-5',
      name: 'Broken',
      nodes: [{ id: 'a', name: 'Bad IF', type: 'engine.ifCondition', params: {} }],
      connections: [],
    };
    await assert.rejects(() => executeWorkflow({ workflow, inputData: {}, models }), /at least one condition/);
    assert.equal(models.calls.finished[0].status, 'failed');
    assert.equal(models.calls.finished[0].errorDetails.node, 'Bad IF');
  });
});
