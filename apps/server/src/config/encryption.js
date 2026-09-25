import crypto from 'node:crypto';
import { env } from './env.js';

/** Derive a stable 256-bit key from the configured secret. */
function key() {
  return crypto.createHash('sha256').update(env.encryptionKey, 'utf8').digest();
}

/**
 * Encrypt a JSON-serialisable value with AES-256-GCM.
 * Returns a JSON string envelope: { iv, tag, data } (hex encoded).
 */
export function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const plaintext = JSON.stringify(value);
  const data = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({ iv: iv.toString('hex'), tag: tag.toString('hex'), data: data.toString('hex') });
}

/** Decrypt an envelope produced by encryptJson(). Throws on tamper / wrong key. */
export function decryptJson(envelope) {
  const parsed = typeof envelope === 'string' ? JSON.parse(envelope) : envelope;
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(parsed.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(parsed.tag, 'hex'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(parsed.data, 'hex')),
    decipher.final(),
  ]).toString('utf8');
  return JSON.parse(plaintext);
}
