import { randomUUID } from 'node:crypto';
import { query } from '../config/db.js';

function parseJson(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    workflow_id: row.workflow_id,
    status: row.status,
    execution_data: parseJson(row.execution_data),
    error_details: parseJson(row.error_details),
    started_at: row.started_at,
    finished_at: row.finished_at,
  };
}

export async function createExecution(workflowId) {
  const id = randomUUID();
  await query("INSERT INTO executions (id, workflow_id, status) VALUES (?, ?, 'running')", [id, workflowId]);
  return { id, workflow_id: workflowId, status: 'running' };
}

export async function finishExecution(id, { status, executionData = null, errorDetails = null }) {
  await query(
    'UPDATE executions SET status = ?, execution_data = ?, error_details = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?',
    [
      status,
      executionData === null ? null : JSON.stringify(executionData),
      errorDetails === null ? null : JSON.stringify(errorDetails),
      id,
    ]
  );
  return getExecution(id);
}

export async function getExecution(id) {
  const rows = await query('SELECT * FROM executions WHERE id = ? LIMIT 1', [id]);
  return toRecord(rows[0] || null);
}

export async function listExecutions({ workflowId = null, limit = 50 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  if (workflowId) {
    const rows = await query(
      'SELECT * FROM executions WHERE workflow_id = ? ORDER BY started_at DESC LIMIT ' + safeLimit,
      [workflowId]
    );
    return rows.map(toRecord);
  }
  const rows = await query('SELECT * FROM executions ORDER BY started_at DESC LIMIT ' + safeLimit);
  return rows.map(toRecord);
}
