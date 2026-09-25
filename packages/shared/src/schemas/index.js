/**
 * Schema validation for node definitions, properties and workflows.
 * Framework-free: usable in browser, Node, and tests.
 */
import { PROPERTY_TYPES, EXECUTOR_KEYS } from '../types/index.js';

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Validate a single NodeProperty. Returns an array of error strings (empty = valid). */
export function validateProperty(property, path = 'properties[]') {
  const errors = [];
  if (!isObject(property)) return [`${path} must be an object`];
  if (typeof property.name !== 'string' || property.name.length === 0) {
    errors.push(`${path} requires a non-empty string "name"`);
  }
  if (typeof property.displayName !== 'string' || property.displayName.length === 0) {
    errors.push(`${path}.${property.name || '?'} requires a non-empty string "displayName"`);
  }
  if (!PROPERTY_TYPES.includes(property.type)) {
    errors.push(`${path}.${property.name || '?'} has unsupported type "${property.type}" (expected one of ${PROPERTY_TYPES.join(', ')})`);
  }
  if (property.type === 'select') {
    if (!Array.isArray(property.options) || property.options.length === 0) {
      errors.push(`${path}.${property.name} of type "select" requires a non-empty "options" array`);
    }
  }
  if (property.type === 'credentials' && typeof property.credentialType !== 'string') {
    errors.push(`${path}.${property.name} of type "credentials" requires a string "credentialType"`);
  }
  if (property.displayOptions !== undefined) {
    if (!isObject(property.displayOptions)) {
      errors.push(`${path}.${property.name} "displayOptions" must be an object`);
    } else {
      for (const key of ['show', 'hide']) {
        const group = property.displayOptions[key];
        if (group !== undefined && (!isObject(group) || Object.keys(group).length === 0)) {
          errors.push(`${path}.${property.name} "displayOptions.${key}" must be a non-empty object`);
        }
      }
    }
  }
  return errors;
}

/** Validate a full NodeDefinition. Returns { valid, errors }. */
export function validateNodeDefinition(def) {
  const errors = [];
  if (!isObject(def)) return { valid: false, errors: ['Node definition must be an object'] };
  if (typeof def.type !== 'string' || def.type.length === 0) errors.push('Node definition requires a string "type"');
  if (typeof def.displayName !== 'string' || def.displayName.length === 0) errors.push(`Node "${def.type || '?'}" requires a string "displayName"`);
  if (!Array.isArray(def.properties)) {
    errors.push(`Node "${def.type}" requires a "properties" array`);
  } else {
    def.properties.forEach((property, index) => {
      errors.push(...validateProperty(property, `Node "${def.type}".properties[${index}]`));
    });
  }
  if (!EXECUTOR_KEYS.includes(def.execute)) {
    errors.push(`Node "${def.type}" has unknown executor "${def.execute}" (expected one of ${EXECUTOR_KEYS.join(', ')})`);
  }
  return { valid: errors.length === 0, errors };
}

/** Validate a workflow graph (nodes + connections). Returns { valid, errors }. */
export function validateWorkflow(workflow) {
  const errors = [];
  if (!isObject(workflow)) return { valid: false, errors: ['Workflow must be an object'] };
  if (typeof workflow.name !== 'string' || workflow.name.length === 0) errors.push('Workflow requires a non-empty string "name"');
  if (!Array.isArray(workflow.nodes)) errors.push('Workflow requires a "nodes" array');
  if (!Array.isArray(workflow.connections)) errors.push('Workflow requires a "connections" array');

  if (Array.isArray(workflow.nodes)) {
    const names = new Set();
    for (const [index, node] of workflow.nodes.entries()) {
      if (!isObject(node) || typeof node.name !== 'string' || typeof node.type !== 'string') {
        errors.push(`nodes[${index}] requires string "name" and "type"`);
        continue;
      }
      if (names.has(node.name)) errors.push(`Duplicate node name "${node.name}"`);
      names.add(node.name);
    }
  }
  if (Array.isArray(workflow.nodes) && Array.isArray(workflow.connections)) {
    const known = new Set(workflow.nodes.map((node) => node.name).concat(workflow.nodes.map((node) => node.id).filter(Boolean)));
    for (const [index, connection] of workflow.connections.entries()) {
      if (!isObject(connection) || !connection.source || !connection.target) {
        errors.push(`connections[${index}] requires "source" and "target"`);
        continue;
      }
      if (!known.has(connection.source)) errors.push(`connections[${index}] references unknown source "${connection.source}"`);
      if (!known.has(connection.target)) errors.push(`connections[${index}] references unknown target "${connection.target}"`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Coerce a raw value to a property type, falling back to the default.
 * Used by the PropertyPanel (client) and the executor (server).
 */
export function coerceValue(property, raw) {
  const value = raw === undefined ? property.default : raw;
  if (value === undefined || value === null) return value;
  switch (property.type) {
    case 'number': {
      const num = Number(value);
      return Number.isNaN(num) ? property.default : num;
    }
    case 'boolean':
      return value === true || value === 'true' || value === 1;
    case 'json':
      if (typeof value === 'object') return value;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    default:
      return value;
  }
}

/**
 * Evaluate displayOptions against current param values.
 * Returns true when the field should be rendered.
 */
export function isPropertyVisible(property, values) {
  const options = property.displayOptions;
  if (!options) return true;
  const matches = (group) =>
    Object.entries(group).every(([field, allowed]) => allowed.includes(values?.[field]));
  if (options.show && !matches(options.show)) return false;
  if (options.hide && matches(options.hide)) return false;
  return true;
}
