import * as ExecutionModel from '../models/executions.js';

export async function list(req, res, next) {
  try {
    const executions = await ExecutionModel.listExecutions({
      workflowId: req.query.workflow_id || null,
      limit: req.query.limit || 50,
    });
    res.json({ data: executions });
  } catch (error) {
    next(error);
  }
}

export async function get(req, res, next) {
  try {
    const execution = await ExecutionModel.getExecution(req.params.id);
    if (!execution) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Execution not found' } });
    res.json({ data: execution });
  } catch (error) {
    next(error);
  }
}
