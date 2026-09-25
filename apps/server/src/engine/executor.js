import { validateWorkflow } from 'shared';
import {
  indexNodes,
  normalizeEdges,
  topologicalSort,
  findEntryNodes,
  incomingEdges,
  outgoingEdges,
} from './dag.js';
import { runExecutor } from '../nodes/index.js';

export { runExecutor };

/** Node types treated as entry points (manual runs, webhooks, schedules, …). */
export const TRIGGER_TYPES = new Set([
  'engine.manualTrigger',
  'engine.webhookTrigger',
  'engine.scheduleTrigger',
  'engine.emailTrigger',
  'engine.intervalTrigger',
  'engine.stripeEvent',
]);

/** Map a node definition type to a server executor key. Unknown types log through. */
export function executorKeyForType(type) {
  switch (type) {
    case 'engine.manualTrigger':
    case 'engine.webhookTrigger':
    case 'engine.scheduleTrigger':
    case 'engine.emailTrigger':
    case 'engine.intervalTrigger':
      return 'trigger';
    case 'engine.httpRequest':
      return 'httpRequest';
    case 'engine.mysql':
      return 'mysql';
    case 'engine.postgres':
      return 'postgres';
    case 'engine.redis':
      return 'redis';
    case 'engine.setFields':
    case 'engine.jsonTransform':
      return 'set';
    case 'engine.ifCondition':
      return 'if';
    case 'engine.switch':
      return 'switch';
    case 'engine.loop':
      return 'loop';
    case 'engine.delay':
      return 'delay';
    case 'engine.llmGenerate':
      return 'llm';
    case 'engine.aiAgent':
      return 'agent';
    case 'engine.autoTranslate':
      return 'translate';
    case 'engine.sentimentAnalysis':
      return 'sentiment';
    case 'engine.textSummarizer':
      return 'summarize';
    case 'engine.imageGenerator':
      return 'image';
    case 'engine.execCommand':
      return 'exec';
    case 'engine.codeJs':
      return 'codeJs';
    case 'engine.codePython':
      return 'codePython';
    case 'engine.fileSystem':
      return 'file';
    case 'engine.sshExecute':
      return 'ssh';
    case 'engine.telegramBot':
      return 'telegram';
    case 'engine.slackNotify':
      return 'slack';
    case 'engine.emailSend':
      return 'email';
    case 'engine.googleSheets':
      return 'sheets';
    case 'engine.stripeEvent':
      return 'stripe';
    default:
      return 'passthrough';
  }
}

export class WorkflowValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'WorkflowValidationError';
    this.code = 'WORKFLOW_INVALID';
    this.details = details;
  }
}

export class WorkflowCycleError extends Error {
  constructor() {
    super('Workflow contains a dependency cycle and cannot be executed');
    this.name = 'WorkflowCycleError';
    this.code = 'WORKFLOW_CYCLE';
  }
}

/**
 * Execute a workflow graph.
 *
 * @param {Object} args
 * @param {Object} args.workflow            { id, name, nodes, connections }
 * @param {*} [args.inputData]              Payload delivered to entry nodes.
 * @param {Object} [args.models]            { executions } persistence hooks (optional — enables DB-free tests).
 * @param {Object} [args.services]          { db, getCredential } injected node services.
 * @param {string} [args.triggerNodeName]   Force a specific entry node.
 * @returns {Promise<{executionId:string|null,status:string,outputs:Record<string,*>,final:*}>}
 */
export async function executeWorkflow({ workflow, inputData = {}, models = null, services = {}, triggerNodeName = null }) {
  const validation = validateWorkflow(workflow);
  if (!validation.valid) {
    throw new WorkflowValidationError('Workflow definition is invalid', validation.errors);
  }

  const { byName } = indexNodes(workflow.nodes);
  const nodeNames = [...byName.keys()];
  const edges = normalizeEdges(workflow.connections, workflow.nodes);
  const { order, hasCycle } = topologicalSort(nodeNames, edges);
  if (hasCycle) throw new WorkflowCycleError();

  let executionId = null;
  if (models?.executions?.createExecution) {
    const row = await models.executions.createExecution(workflow.id);
    executionId = row.id;
  }

  const startedAt = new Date().toISOString();
  const outputs = {};

  const baseContext = {
    $workflow: { id: workflow.id, name: workflow.name },
    $execution: { id: executionId },
    $now: startedAt,
  };

  // Seed the active set: explicit trigger > trigger-typed nodes > edgeless entries.
  const active = new Set();
  if (triggerNodeName && byName.has(triggerNodeName)) {
    active.add(triggerNodeName);
  } else {
    const triggerNodes = nodeNames.filter((name) => TRIGGER_TYPES.has(byName.get(name).type));
    const seeds = triggerNodes.length > 0 ? triggerNodes : findEntryNodes(nodeNames, edges);
    seeds.forEach((name) => active.add(name));
  }

  const fail = async (error) => {
    const errorDetails = { message: error.message, code: error.code || 'EXECUTION_FAILED', node: error.node || null };
    if (models?.executions?.finishExecution && executionId) {
      await models.executions.finishExecution(executionId, { status: 'failed', executionData: { outputs }, errorDetails });
    }
    throw error;
  };

  try {
    for (const name of order) {
      if (!active.has(name)) continue;
      const node = byName.get(name);
      const incoming = incomingEdges(edges, name).filter((edge) => active.has(edge.source) && outputs[edge.source] !== undefined);

      // $input = output of the first active predecessor, else the trigger payload.
      const predecessorOutput = incoming.length > 0 ? outputs[incoming[0].source] : undefined;
      const input = predecessorOutput !== undefined ? predecessorOutput : { json: inputData };

      const context = {
        ...baseContext,
        $node: { ...outputs },
        $input: input,
        $json: input && typeof input === 'object' && 'json' in input ? input.json : input,
      };

      const executorKey = executorKeyForType(node.type);
      let result;
      try {
        result = await runExecutor(executorKey, node.params || {}, context, services);
      } catch (error) {
        error.node = name;
        throw error;
      }
      outputs[name] = result;

      // Branch-aware activation: condition / switch nodes gate named edges.
      // "main" edges always flow; "true"/"false" and custom outputs only
      // fire when the node result selects that branch.
      for (const edge of outgoingEdges(edges, name)) {
        const handle = edge.sourceHandle || 'main';
        if (handle === 'true' || handle === 'false') {
          const want = handle === 'true' ? 'true' : 'false';
          if (result && result.branch !== undefined && String(result.branch) === want) {
            active.add(edge.target);
          }
        } else if (result && result.branch !== undefined) {
          if (handle === 'main' || handle === String(result.branch)) active.add(edge.target);
        } else {
          active.add(edge.target);
        }
      }
    }

    const sinks = nodeNames.filter((name) => outgoingEdges(edges, name).length === 0 && outputs[name] !== undefined);
    const executed = order.filter((name) => outputs[name] !== undefined);
    const finalName = sinks.length > 0 ? sinks[sinks.length - 1] : executed[executed.length - 1];
    const final = finalName ? outputs[finalName] : null;

    if (models?.executions?.finishExecution && executionId) {
      await models.executions.finishExecution(executionId, { status: 'success', executionData: { outputs } });
    }
    return { executionId, status: 'success', outputs, final };
  } catch (error) {
    return fail(error);
  }
}
