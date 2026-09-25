import { validateWorkflow } from 'shared';
import * as WorkflowModel from '../models/workflows.js';
import * as ExecutionModel from '../models/executions.js';
import { executeWorkflow } from '../engine/executor.js';
import { pool } from '../config/db.js';
import { getDecryptedCredential } from '../models/credentials.js';
import { env } from '../config/env.js';

function services() {
  return { db: pool, getCredential: getDecryptedCredential };
}

function webhookUrl(id) {
  return `${env.apiBaseUrl}/api/v1/webhook/${id}`;
}

export async function list(req, res, next) {
  try {
    const workflows = await WorkflowModel.listWorkflows();
    res.json({ data: workflows.map((workflow) => ({ ...workflow, webhookUrl: webhookUrl(workflow.id) })) });
  } catch (error) {
    next(error);
  }
}

export async function get(req, res, next) {
  try {
    const workflow = await WorkflowModel.getWorkflow(req.params.id);
    if (!workflow) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workflow not found' } });
    res.json({ data: { ...workflow, webhookUrl: webhookUrl(workflow.id) } });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { name, active = false, nodes = [], connections = [] } = req.body || {};
    const validation = validateWorkflow({ name, nodes, connections });
    if (!validation.valid) {
      return res.status(400).json({ error: { code: 'WORKFLOW_INVALID', message: 'Workflow definition is invalid', details: validation.errors } });
    }
    const workflow = await WorkflowModel.createWorkflow({ name, active, nodes, connections });
    res.status(201).json({ data: { ...workflow, webhookUrl: webhookUrl(workflow.id) } });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const workflow = await WorkflowModel.updateWorkflow(req.params.id, req.body || {});
    if (!workflow) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workflow not found' } });
    res.json({ data: { ...workflow, webhookUrl: webhookUrl(workflow.id) } });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await WorkflowModel.deleteWorkflow(req.params.id);
    if (!deleted) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workflow not found' } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

/** POST /api/workflows/:id/execute — manual run with optional { data } payload. */
export async function execute(req, res, next) {
  try {
    const workflow = await WorkflowModel.getWorkflow(req.params.id);
    if (!workflow) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workflow not found' } });
    const triggerNodeName = typeof req.body?.triggerNode === 'string' ? req.body.triggerNode : null;
    const result = await executeWorkflow({
      workflow,
      inputData: req.body?.data !== undefined ? req.body.data : {},
      models: { executions: ExecutionModel },
      services: services(),
      triggerNodeName,
    });
    res.json({ data: result });
  } catch (error) {
    if (error.code === 'WORKFLOW_INVALID' || error.code === 'WORKFLOW_CYCLE') {
      return res.status(400).json({ error: { code: error.code, message: error.message, details: error.details || [] } });
    }
    next(error);
  }
}
