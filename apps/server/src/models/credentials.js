import { randomUUID } from 'node:crypto';
import { query } from '../config/db.js';
import { encryptJson, decryptJson } from '../config/encryption.js';

/**
 * Credential payloads are encrypted at rest. List/get endpoints return
 * redacted records ({ configured: true }) — plaintext is only decrypted
 * inside the execution engine, never over HTTP.
 */
function toPublicRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    configured: true,
    created_at: row.created_at,
  };
}

export async function listCredentials() {
  const rows = await query('SELECT id, name, type, created_at FROM credentials ORDER BY created_at DESC');
  return rows.map((row) => ({ ...toPublicRecord(row) }));
}

export async function getCredential(id) {
  const rows = await query('SELECT id, name, type, created_at FROM credentials WHERE id = ? LIMIT 1', [id]);
  return toPublicRecord(rows[0] || null);
}

export async function createCredential({ name, type, data }) {
  const id = randomUUID();
  await query('INSERT INTO credentials (id, name, type, data) VALUES (?, ?, ?, ?)', [
    id,
    name,
    type,
    encryptJson(data || {}),
  ]);
  return getCredential(id);
}

export async function updateCredential(id, { name, type, data }) {
  const rows = await query('SELECT * FROM credentials WHERE id = ? LIMIT 1', [id]);
  const current = rows[0];
  if (!current) return null;
  await query('UPDATE credentials SET name = ?, type = ?, data = ? WHERE id = ?', [
    name !== undefined ? name : current.name,
    type !== undefined ? type : current.type,
    data !== undefined ? encryptJson(data) : current.data,
    id,
  ]);
  return getCredential(id);
}

export async function deleteCredential(id) {
  const result = await query('DELETE FROM credentials WHERE id = ? LIMIT 1', [id]);
  return result.affectedRows > 0;
}

/** Engine-only: load and decrypt a credential payload by id. */
export async function getDecryptedCredential(id) {
  const rows = await query('SELECT * FROM credentials WHERE id = ? LIMIT 1', [id]);
  const row = rows[0];
  if (!row) return null;
  return { id: row.id, name: row.name, type: row.type, data: decryptJson(row.data) };
}
