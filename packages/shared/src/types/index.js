/**
 * Shared type definitions for Engine Core.
 *
 * A Workflow is a named graph of Nodes connected by Connections.
 * Node behaviour on the canvas is driven by a declarative NodeDefinition
 * (see schemas/nodeDefinition.js). Execution order is derived from the
 * graph at runtime by the DAG engine (apps/server/src/engine/dag.js).
 */

/**
 * @typedef {'string'|'number'|'boolean'|'select'|'json'|'credentials'} PropertyType
 * Property input types supported by the dynamic PropertyPanel renderer.
 */

/**
 * @typedef {Object} PropertyOption
 * @property {string} label  Human readable label shown in the select.
 * @property {string|number|boolean} value  Value written into node params.
 */

/**
 * @typedef {Object} DisplayConditions
 * @property {Record<string, Array<string|number|boolean>>} [show]  Show field only when current values match.
 * @property {Record<string, Array<string|number|boolean>>} [hide]  Hide field when current values match.
 */

/**
 * @typedef {Object} NodeProperty
 * @property {string} name            Param key stored in node params (e.g. "url").
 * @property {string} displayName     Label rendered in the PropertyPanel.
 * @property {PropertyType} type      Input renderer to use.
 * @property {*} [default]            Default value for new nodes.
 * @property {string} [placeholder]   Placeholder text for text inputs.
 * @property {boolean} [required]     Validation flag.
 * @property {Array<string|PropertyOption>} [options]            Allowed values for `select`.
 * @property {string} [credentialType] Credential family for `credentials` (e.g. "httpAuth", "mysql").
 * @property {DisplayConditions} [displayOptions]  Conditional visibility rules.
 */

/**
 * @typedef {Object} NodeDefinition
 * @property {string} type          Unique identifier (e.g. "engine.httpRequest").
 * @property {string} displayName   Human readable name shown on canvas and library.
 * @property {string} [category]    Library grouping ("Triggers" | "Actions" | "Data" | "Logic" | "Communication").
 * @property {string} [monogram]    Two-letter typographic mark (zero-icon policy).
 * @property {NodeProperty[]} properties  Declarative parameter schema.
 * @property {string} execute       Server executor key (see apps/server/src/nodes).
 * @property {boolean} [isTrigger]  True for entry-point nodes (webhook / manual / schedule).
 */

/**
 * @typedef {Object} GraphNode
 * @property {string} id      Unique node instance id.
 * @property {string} name    Unique node instance name (used by $node["Name"] references).
 * @property {string} type    NodeDefinition.type reference.
 * @property {Record<string, *>} [params]  Configured parameter values.
 * @property {{x:number,y:number}} [position]  Canvas position (client only).
 */

/**
 * @typedef {Object} GraphConnection
 * @property {string} source        Source node id or name.
 * @property {string} [sourceHandle]  Output branch ("main" | "true" | "false").
 * @property {string} target        Target node id or name.
 * @property {string} [targetHandle]  Input handle name.
 */

/**
 * @typedef {Object} WorkflowRecord
 * @property {string} id
 * @property {string} name
 * @property {boolean} active
 * @property {GraphNode[]} nodes
 * @property {GraphConnection[]} connections
 */

/**
 * @typedef {Object} ExecutionContext
 * @property {Record<string, *>} $node   Outputs keyed by node name ($node["HTTP Request"]).
 * @property {*} $input       Output of the active predecessor (first match).
 * @property {*} $json        Shortcut for ($input.json ?? $input).
 * @property {{id:string,name:string}} $workflow
 * @property {{id:string}} $execution
 * @property {string} $now    ISO timestamp of execution start.
 */

/**
 * @typedef {Object} NodeResult
 * @property {*} json   Primary output payload (n8n-style envelope).
 * @property {boolean} [branch]  For condition nodes: selected branch.
 * @property {*} [raw]  Optional unmodified upstream data.
 */

export const PROPERTY_TYPES = ['string', 'number', 'boolean', 'select', 'json', 'credentials'];

export const EXECUTOR_KEYS = [
  'trigger',
  'httpRequest',
  'mysql',
  'postgres',
  'redis',
  'set',
  'if',
  'switch',
  'loop',
  'delay',
  'llm',
  'agent',
  'translate',
  'sentiment',
  'summarize',
  'image',
  'exec',
  'codeJs',
  'codePython',
  'file',
  'ssh',
  'telegram',
  'slack',
  'email',
  'sheets',
  'stripe',
  'passthrough',
];
