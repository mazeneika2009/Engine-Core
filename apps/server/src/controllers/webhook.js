import * as WorkflowModel from '../models/workflows.js';
import * as ExecutionModel from '../models/executions.js';
import { executeWorkflow } from '../engine/executor.js';
import { pool } from '../config/db.js';
import { getDecryptedCredential } from '../models/credentials.js';

/**
 * Webhook trigger server: GET/POST /api/v1/webhook/:workflowId
 * Executes the active workflow immediately and returns the final output.
 * Inactive or missing workflows answer 404 so scanners learn nothing.
 */
export async function handleWebhook(req, res, next) {
  try {
    const workflow = await WorkflowModel.getActiveWorkflow(req.params.workflowId);
    if (!workflow) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Workflow not found or inactive' } });
    }

    const inputData = {
      method: req.method,
      headers: req.headers,
      query: req.query || {},
      body: req.body !== undefined ? req.body : {},
      rawBody: typeof req.rawBody === 'string' ? req.rawBody : null,
    };

    const result = await executeWorkflow({
      workflow,
      inputData,
      models: { executions: ExecutionModel },
      services: { db: pool, getCredential: getDecryptedCredential },
    });
    res.json({ data: { executionId: result.executionId, status: result.status, output: result.final } });
  } catch (error) {
    if (error.code === 'WORKFLOW_INVALID' || error.code === 'WORKFLOW_CYCLE') {
      return res.status(400).json({ error: { code: error.code, message: error.message } });
    }
    next(error);
  }
}
