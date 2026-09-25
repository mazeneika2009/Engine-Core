import * as CredentialModel from '../models/credentials.js';

export async function list(req, res, next) {
  try {
    res.json({ data: await CredentialModel.listCredentials() });
  } catch (error) {
    next(error);
  }
}

export async function get(req, res, next) {
  try {
    const credential = await CredentialModel.getCredential(req.params.id);
    if (!credential) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Credential not found' } });
    res.json({ data: credential });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { name, type, data } = req.body || {};
    if (!name || !type) {
      return res.status(400).json({ error: { code: 'CREDENTIAL_INVALID', message: 'Credential requires "name" and "type"' } });
    }
    const credential = await CredentialModel.createCredential({ name, type, data: data || {} });
    res.status(201).json({ data: credential });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const credential = await CredentialModel.updateCredential(req.params.id, req.body || {});
    if (!credential) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Credential not found' } });
    res.json({ data: credential });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await CredentialModel.deleteCredential(req.params.id);
    if (!deleted) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Credential not found' } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
