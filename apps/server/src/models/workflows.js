import { randomUUID } from 'node:crypto';
import { query } from '../config/db.js';

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    active: Boolean(row.active),
    nodes: parseJson(row.nodes, []),
    connections: parseJson(row.connections, []),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listWorkflows() {
  const rows = await query(
    'SELECT * FROM workflows ORDER BY updated_at DESC'
  );
  return rows.map(toRecord);
}

export async function getWorkflow(id) {
  const rows = await query('SELECT * FROM workflows WHERE id = ? LIMIT 1', [id]);
  return toRecord(rows[0] || null);
}

export async function getActiveWorkflow(id) {
  const rows = await query('SELECT * FROM workflows WHERE id = ? AND active = 1 LIMIT 1', [id]);
  return toRecord(rows[0] || null);
}

export async function createWorkflow({ name, active = false, nodes = [], connections = [] }) {
  const id = randomUUID();
  await query(
    'INSERT INTO workflows (id, name, active, nodes, connections) VALUES (?, ?, ?, ?, ?)',
    [id, name, active ? 1 : 0, JSON.stringify(nodes), JSON.stringify(connections)]
  );
  return getWorkflow(id);
}

export async function updateWorkflow(id, patch) {
  const current = await getWorkflow(id);
  if (!current) return null;
  const next = {
    name: patch.name !== undefined ? patch.name : current.name,
    active: patch.active !== undefined ? (patch.active ? 1 : 0) : (current.active ? 1 : 0),
    nodes: patch.nodes !== undefined ? patch.nodes : current.nodes,
    connections: patch.connections !== undefined ? patch.connections : current.connections,
  };
  await query(
    'UPDATE workflows SET name = ?, active = ?, nodes = ?, connections = ? WHERE id = ?',
    [next.name, next.active, JSON.stringify(next.nodes), JSON.stringify(next.connections), id]
  );
  return getWorkflow(id);
}

export async function deleteWorkflow(id) {
  const result = await query('DELETE FROM workflows WHERE id = ? LIMIT 1', [id]);
  return result.affectedRows > 0;
}
