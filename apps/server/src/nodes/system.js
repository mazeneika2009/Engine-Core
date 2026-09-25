import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { Client as SshClient } from 'ssh2';
import { resolveParams } from 'shared';

/**
 * engine.execCommand — params: { command, args (array), cwd, timeout }.
 * Runs without a shell (no globbing / chaining). Returns stdout/stderr/exitCode.
 */
export async function executeExec(rawParams, context) {
  const params = resolveParams(rawParams, context);
  if (!params.command) throw Object.assign(new Error('Exec node requires a "command"'), { code: 'NODE_MISSING_PARAM' });
  const args = Array.isArray(params.args) ? params.args.map(String) : [];
  const timeout = Math.min(Math.max(Number(params.timeout ?? 15000) || 15000, 1000), 120000);

  return new Promise((resolve, reject) => {
    execFile(String(params.command), args, { cwd: params.cwd || process.cwd(), timeout }, (error, stdout, stderr) => {
      if (error && error.killed) {
        reject(Object.assign(new Error(`Command timed out after ${timeout}ms`), { code: 'NODE_TIMEOUT' }));
        return;
      }
      resolve({ json: { stdout: String(stdout || ''), stderr: String(stderr || ''), exitCode: error ? error.code || 1 : 0 } });
    });
  });
}

/**
 * engine.codeJs — params: { code }.
 * Sandboxed vm with $input / $json / $node in scope, 5s CPU timeout.
 * The script's completion value (or returned object) becomes the output.
 */
export async function executeCodeJs(rawParams, context) {
  const params = resolveParams(rawParams, context);
  if (!params.code) throw Object.assign(new Error('Code node requires "code"'), { code: 'NODE_MISSING_PARAM' });
  const sandbox = {
    $input: context.$input,
    $json: context.$json,
    $node: context.$node,
    $workflow: context.$workflow,
    $execution: context.$execution,
    Math,
    JSON,
    console: { log: () => {} },
  };
  try {
    const result = vm.runInNewContext(`(function(){ ${params.code} })()`, sandbox, { timeout: 5000 });
    const json = result !== null && typeof result === 'object' ? result : { result };
    // Rehydrate into the host realm (vm objects carry a foreign prototype).
    return { json: JSON.parse(JSON.stringify(json)) };
  } catch (error) {
    throw Object.assign(new Error(`Code error: ${error.message}`), { code: 'NODE_CODE_ERROR' });
  }
}

/**
 * engine.codePython — params: { code, args (array) }.
 * Spawns python3 (fallback python). Input JSON arrives on stdin;
 * whatever the script prints as JSON on stdout becomes the output.
 */
export async function executeCodePython(rawParams, context) {
  const params = resolveParams(rawParams, context);
  if (!params.code) throw Object.assign(new Error('Python node requires "code"'), { code: 'NODE_MISSING_PARAM' });
  const binary = process.env.ENGINE_PYTHON || 'python3';
  const args = Array.isArray(params.args) ? params.args.map(String) : ['-c', String(params.code)];
  const timeout = Math.min(Math.max(Number(params.timeout ?? 15000) || 15000, 1000), 120000);

  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { timeout });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => {
      reject(Object.assign(new Error(`Python failed to start (${binary}): ${error.message}`), { code: 'NODE_CODE_ERROR' }));
    });
    child.on('close', (exitCode) => {
      const trimmed = stdout.trim();
      let json = { stdout: trimmed, stderr: stderr.trim(), exitCode };
      if (trimmed) {
        try {
          const parsed = JSON.parse(trimmed);
          json = parsed !== null && typeof parsed === 'object' ? parsed : { result: parsed };
        } catch {
          json = { stdout: trimmed, stderr: stderr.trim(), exitCode };
        }
      }
      resolve({ json });
    });
    try {
      child.stdin.write(JSON.stringify({ input: context.$json }));
      child.stdin.end();
    } catch {
      // stdin unavailable — continue without input
    }
  });
}

function sandboxRoot() {
  return process.env.ENGINE_DATA_DIR || path.join(os.tmpdir(), 'engine-core-data');
}

/** Resolve a user path inside the sandbox; throws on traversal attempts. */
async function sandboxedPath(userPath) {
  const root = sandboxRoot();
  await fs.mkdir(root, { recursive: true });
  const resolved = path.resolve(root, String(userPath || '').replace(/^[/\\]+/, ''));
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw Object.assign(new Error('Path escapes the file sandbox'), { code: 'NODE_BAD_PATH' });
  }
  return resolved;
}

/**
 * engine.fileSystem — params: { operation: read|write|append|delete|list, path, content }.
 * Confined to ENGINE_DATA_DIR (default OS tmp/engine-core-data).
 */
export async function executeFile(rawParams, context) {
  const params = resolveParams(rawParams, context);
  const operation = params.operation || 'read';
  const target = await sandboxedPath(params.path || '');

  if (operation === 'read') {
    const content = await fs.readFile(target, 'utf8').catch((error) => {
      throw Object.assign(new Error(`Read failed: ${error.message}`), { code: 'NODE_FS_ERROR' });
    });
    return { json: { path: params.path, content } };
  }
  if (operation === 'write') {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, String(params.content ?? ''));
    return { json: { path: params.path, written: true } };
  }
  if (operation === 'append') {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.appendFile(target, String(params.content ?? ''));
    return { json: { path: params.path, appended: true } };
  }
  if (operation === 'delete') {
    await fs.rm(target, { force: true });
    return { json: { path: params.path, deleted: true } };
  }
  if (operation === 'list') {
    const entries = await fs.readdir(target).catch((error) => {
      throw Object.assign(new Error(`List failed: ${error.message}`), { code: 'NODE_FS_ERROR' });
    });
    return { json: { path: params.path || '/', entries } };
  }
  throw Object.assign(new Error(`Unknown file operation "${operation}"`), { code: 'NODE_BAD_OPERATOR' });
}

/**
 * engine.sshExecute — params: { host, port, username, command, timeout,
 * credential: ssh { privateKey | password } }.
 */
export async function executeSsh(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.host || !params.username || !params.command) {
    throw Object.assign(new Error('SSH node requires "host", "username" and "command"'), { code: 'NODE_MISSING_PARAM' });
  }
  let credential = null;
  if (params.credential && services.getCredential) {
    credential = await services.getCredential(params.credential);
  }
  const timeout = Math.min(Math.max(Number(params.timeout ?? 15000) || 15000, 1000), 120000);

  return new Promise((resolve, reject) => {
    const connection = new SshClient();
    let stdout = '';
    let stderr = '';
    const config = {
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      readyTimeout: timeout,
    };
    if (credential?.data?.privateKey) config.privateKey = credential.data.privateKey;
    else if (credential?.data?.password) config.password = credential.data.password;
    else if (params.password) config.password = params.password;
    else {
      reject(Object.assign(new Error('SSH node requires an ssh credential (privateKey or password)'), { code: 'NODE_MISSING_CREDENTIAL' }));
      return;
    }

    connection
      .on('ready', () => {
        connection.exec(String(params.command), { timeout }, (error, stream) => {
          if (error) {
            connection.end();
            reject(Object.assign(new Error(`SSH exec failed: ${error.message}`), { code: 'NODE_SSH_ERROR' }));
            return;
          }
          stream.on('data', (chunk) => { stdout += chunk; });
          stream.stderr.on('data', (chunk) => { stderr += chunk; });
          stream.on('close', (exitCode) => {
            connection.end();
            resolve({ json: { stdout, stderr, exitCode } });
          });
        });
      })
      .on('error', (error) => {
        reject(Object.assign(new Error(`SSH connection failed: ${error.message}`), { code: 'NODE_SSH_ERROR' }));
      })
      .connect(config);
  });
}
