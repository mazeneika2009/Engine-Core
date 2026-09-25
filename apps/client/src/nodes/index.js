/**
 * Engine Core node catalog — 31 declarative definitions.
 *
 * Each definition drives the canvas card, the library entry, the dynamic
 * PropertyPanel (properties[]) and the backend run (execute → server key).
 *
 * Property types: string | number | boolean | select | json | credentials
 * Display hints (client only): secret, multiline, min, max, step.
 * Zero-icon policy: nodes are identified by 2-letter monogram badges.
 */

const T = {
  ai: { bg: 'rgba(132,169,140,0.14)', fg: '#9AB9A0', edge: 'rgba(132,169,140,0.4)' },
  trigger: { bg: 'rgba(212,163,115,0.14)', fg: '#D4A373', edge: 'rgba(212,163,115,0.35)' },
  system: { bg: 'rgba(245,241,234,0.06)', fg: '#C9C2B8', edge: 'rgba(245,241,234,0.22)' },
  data: { bg: 'rgba(192,133,82,0.14)', fg: '#C08552', edge: 'rgba(192,133,82,0.35)' },
  app: { bg: 'rgba(212,163,115,0.1)', fg: '#E8C08A', edge: 'rgba(212,163,115,0.3)' },
  logic: { bg: 'rgba(132,169,140,0.1)', fg: '#84A98C', edge: 'rgba(132,169,140,0.32)' },
};

const LLM_MODELS = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
  gemini: ['gemini-1.5-flash', 'gemini-1.5-pro'],
};

/** @type {import('shared/types').NodeDefinition[]} */
export const NODE_DEFINITIONS = [
  /* ------------------------------ AI & ML ------------------------------ */
  {
    type: 'engine.aiAgent',
    displayName: 'AI Agent',
    category: 'AI & ML',
    monogram: 'Ai',
    tone: T.ai,
    execute: 'agent',
    properties: [
      { name: 'provider', displayName: 'Provider', type: 'select', options: ['openai', 'anthropic'], default: 'openai', required: true },
      { name: 'model', displayName: 'Model', type: 'string', placeholder: 'gpt-4o', default: 'gpt-4o' },
      { name: 'systemPrompt', displayName: 'System Prompt', type: 'string', multiline: true, placeholder: 'You are a support triage assistant…' },
      { name: 'userMessage', displayName: 'User Message', type: 'string', multiline: true, placeholder: '{{ $json.message }}', required: true },
      { name: 'tools', displayName: 'Tools', type: 'json', default: '[]', placeholder: '[ { "name": "lookup", "url": "https://…" } ]' },
      { name: 'temperature', displayName: 'Temperature', type: 'number', default: 0.7, min: 0, max: 2, step: 0.1 },
      { name: 'maxTokens', displayName: 'Max Tokens', type: 'number', default: 1024, min: 1, max: 128000, step: 1 },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'openai' },
    ],
  },
  {
    type: 'engine.llmGenerate',
    displayName: 'LLM Generate',
    category: 'AI & ML',
    monogram: 'Ll',
    tone: T.ai,
    execute: 'llm',
    properties: [
      { name: 'provider', displayName: 'Provider', type: 'select', options: ['openai', 'gemini', 'anthropic'], default: 'openai', required: true },
      { name: 'model', displayName: 'Model', type: 'string', placeholder: 'gpt-4o', default: 'gpt-4o' },
      { name: 'prompt', displayName: 'Prompt', type: 'string', multiline: true, placeholder: 'Summarize: {{ $json.text }}', required: true },
      { name: 'systemPrompt', displayName: 'System Prompt', type: 'string', multiline: true, placeholder: 'Answer concisely.' },
      { name: 'temperature', displayName: 'Temperature', type: 'number', default: 0.7, min: 0, max: 2, step: 0.1 },
      { name: 'maxTokens', displayName: 'Max Tokens', type: 'number', default: 1024, min: 1, max: 128000, step: 1 },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'openai' },
    ],
  },
  {
    type: 'engine.autoTranslate',
    displayName: 'Auto Translate',
    category: 'AI & ML',
    monogram: 'Tl',
    tone: T.ai,
    execute: 'translate',
    properties: [
      { name: 'provider', displayName: 'Provider', type: 'select', options: ['google', 'deepl'], default: 'google', required: true },
      { name: 'text', displayName: 'Text', type: 'string', multiline: true, placeholder: '{{ $json.description }}', required: true },
      { name: 'source', displayName: 'Source', type: 'string', placeholder: 'auto', default: 'auto' },
      { name: 'target', displayName: 'Target', type: 'string', placeholder: 'en', default: 'en', required: true },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'translate' },
    ],
  },
  {
    type: 'engine.sentimentAnalysis',
    displayName: 'Sentiment',
    category: 'AI & ML',
    monogram: 'Se',
    tone: T.ai,
    execute: 'sentiment',
    properties: [
      { name: 'text', displayName: 'Text', type: 'string', multiline: true, placeholder: '{{ $json.review }}', required: true },
    ],
  },
  {
    type: 'engine.textSummarizer',
    displayName: 'Summarizer',
    category: 'AI & ML',
    monogram: 'Su',
    tone: T.ai,
    execute: 'summarize',
    properties: [
      { name: 'text', displayName: 'Text', type: 'string', multiline: true, placeholder: '{{ $json.article }}', required: true },
      { name: 'sentences', displayName: 'Sentences', type: 'number', default: 3, min: 1, max: 10, step: 1 },
    ],
  },
  {
    type: 'engine.imageGenerator',
    displayName: 'Image Generate',
    category: 'AI & ML',
    monogram: 'Im',
    tone: T.ai,
    execute: 'image',
    properties: [
      { name: 'provider', displayName: 'Provider', type: 'select', options: ['openai', 'stability'], default: 'openai', required: true },
      { name: 'prompt', displayName: 'Prompt', type: 'string', multiline: true, placeholder: 'Warm charcoal workspace illustration', required: true },
      { name: 'size', displayName: 'Size', type: 'select', options: ['1024x1024', '1792x1024', '1024x1792'], default: '1024x1024', displayOptions: { show: { provider: ['openai'] } } },
      { name: 'aspectRatio', displayName: 'Aspect', type: 'select', options: ['1:1', '16:9', '9:16'], default: '1:1', displayOptions: { show: { provider: ['stability'] } } },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'openai' },
    ],
  },

  /* ------------------------------ TRIGGERS ------------------------------ */
  {
    type: 'engine.manualTrigger',
    displayName: 'Manual Trigger',
    category: 'TRIGGERS',
    monogram: 'Ma',
    tone: T.trigger,
    execute: 'trigger',
    isTrigger: true,
    properties: [],
  },
  {
    type: 'engine.webhookTrigger',
    displayName: 'Webhook Trigger',
    category: 'TRIGGERS',
    monogram: 'Wh',
    tone: T.trigger,
    execute: 'trigger',
    isTrigger: true,
    properties: [
      { name: 'method', displayName: 'Method', type: 'select', options: ['GET', 'POST', 'PUT'], default: 'POST', required: true },
      { name: 'path', displayName: 'Path', type: 'string', placeholder: '/v1/trigger', required: true },
      { name: 'auth', displayName: 'Require Auth', type: 'boolean', default: false },
    ],
  },
  {
    type: 'engine.scheduleTrigger',
    displayName: 'Schedule Trigger',
    category: 'TRIGGERS',
    monogram: 'Sc',
    tone: T.trigger,
    execute: 'trigger',
    isTrigger: true,
    properties: [
      { name: 'cron', displayName: 'Cron', type: 'string', placeholder: '0 9 * * *', required: true },
      { name: 'timezone', displayName: 'Timezone', type: 'select', options: ['UTC', 'Africa/Cairo', 'America/New_York', 'Europe/London'], default: 'UTC' },
    ],
  },
  {
    type: 'engine.emailTrigger',
    displayName: 'Email Trigger',
    category: 'TRIGGERS',
    monogram: 'Et',
    tone: T.trigger,
    execute: 'trigger',
    isTrigger: true,
    properties: [
      { name: 'mailbox', displayName: 'Mailbox', type: 'string', placeholder: 'INBOX', default: 'INBOX' },
      { name: 'filter', displayName: 'Filter', type: 'string', placeholder: 'UNSEEN' },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'imap' },
    ],
  },
  {
    type: 'engine.intervalTrigger',
    displayName: 'Interval Trigger',
    category: 'TRIGGERS',
    monogram: 'In',
    tone: T.trigger,
    execute: 'trigger',
    isTrigger: true,
    properties: [
      { name: 'minutes', displayName: 'Minutes', type: 'number', default: 15, min: 1, max: 10080, step: 1, required: true },
    ],
  },

  /* ------------------------------- SYSTEM ------------------------------- */
  {
    type: 'engine.execCommand',
    displayName: 'Exec Command',
    category: 'SYSTEM',
    monogram: 'Sh',
    tone: T.system,
    execute: 'exec',
    properties: [
      { name: 'command', displayName: 'Command', type: 'string', placeholder: 'node', required: true },
      { name: 'args', displayName: 'Args', type: 'json', default: '[]', placeholder: '["--version"]' },
      { name: 'cwd', displayName: 'Directory', type: 'string', placeholder: '/tmp' },
      { name: 'timeout', displayName: 'Timeout (ms)', type: 'number', default: 15000, min: 1000, max: 120000, step: 1000 },
    ],
  },
  {
    type: 'engine.codeJs',
    displayName: 'Code (JS)',
    category: 'SYSTEM',
    monogram: 'Js',
    tone: T.system,
    execute: 'codeJs',
    properties: [
      { name: 'code', displayName: 'Code', type: 'json', required: true, default: 'return { total: $json.total * 2 };', placeholder: 'return { total: $json.total * 2 };' },
    ],
  },
  {
    type: 'engine.codePython',
    displayName: 'Code (Python)',
    category: 'SYSTEM',
    monogram: 'Py',
    tone: T.system,
    execute: 'codePython',
    properties: [
      { name: 'code', displayName: 'Code', type: 'json', placeholder: 'import sys, json\nprint(json.dumps({"ok": True}))' },
      { name: 'args', displayName: 'Args', type: 'json', default: '[]', placeholder: '[]' },
      { name: 'timeout', displayName: 'Timeout (ms)', type: 'number', default: 15000, min: 1000, max: 120000, step: 1000 },
    ],
  },
  {
    type: 'engine.fileSystem',
    displayName: 'File System',
    category: 'SYSTEM',
    monogram: 'Fs',
    tone: T.system,
    execute: 'file',
    properties: [
      { name: 'operation', displayName: 'Operation', type: 'select', options: ['read', 'write', 'append', 'delete', 'list'], default: 'read', required: true },
      { name: 'path', displayName: 'Path', type: 'string', placeholder: 'exports/report.json', required: true },
      { name: 'content', displayName: 'Content', type: 'string', multiline: true, placeholder: '{{ $json }}', displayOptions: { show: { operation: ['write', 'append'] } } },
    ],
  },
  {
    type: 'engine.sshExecute',
    displayName: 'SSH Execute',
    category: 'SYSTEM',
    monogram: 'Ss',
    tone: T.system,
    execute: 'ssh',
    properties: [
      { name: 'host', displayName: 'Host', type: 'string', placeholder: '192.168.1.10', required: true },
      { name: 'port', displayName: 'Port', type: 'number', default: 22, min: 1, max: 65535, step: 1 },
      { name: 'username', displayName: 'Username', type: 'string', placeholder: 'deploy', required: true },
      { name: 'command', displayName: 'Command', type: 'string', multiline: true, placeholder: 'docker ps', required: true },
      { name: 'timeout', displayName: 'Timeout (ms)', type: 'number', default: 15000, min: 1000, max: 120000, step: 1000 },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'ssh' },
    ],
  },

  /* -------------------------------- DATA -------------------------------- */
  {
    type: 'engine.httpRequest',
    displayName: 'HTTP Request',
    category: 'DATA',
    monogram: 'Ht',
    tone: T.data,
    execute: 'httpRequest',
    properties: [
      { name: 'method', displayName: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], default: 'GET', required: true },
      { name: 'url', displayName: 'URL', type: 'string', placeholder: 'https://api.example.com/users/{{ $json.id }}', required: true },
      { name: 'headers', displayName: 'Headers', type: 'json', default: '{}', placeholder: '{ "Accept": "application/json" }' },
      {
        name: 'body', displayName: 'Body', type: 'json', default: '{}', placeholder: '{ "id": "{{ $json.id }}" }',
        displayOptions: { show: { method: ['POST', 'PUT', 'PATCH', 'DELETE'] } },
      },
      { name: 'timeout', displayName: 'Timeout (ms)', type: 'number', default: 15000, min: 1000, max: 120000, step: 500 },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'httpAuth' },
    ],
  },
  {
    type: 'engine.mysql',
    displayName: 'MySQL Query',
    category: 'DATA',
    monogram: 'My',
    tone: T.data,
    execute: 'mysql',
    properties: [
      { name: 'query', displayName: 'Query', type: 'string', multiline: true, placeholder: 'SELECT * FROM users WHERE id = ?', required: true },
      { name: 'params', displayName: 'Params', type: 'json', default: '[]', placeholder: '["{{ $json.id }}"]' },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'mysql' },
    ],
  },
  {
    type: 'engine.postgres',
    displayName: 'Postgres Query',
    category: 'DATA',
    monogram: 'Pg',
    tone: T.data,
    execute: 'postgres',
    properties: [
      { name: 'query', displayName: 'Query', type: 'string', multiline: true, placeholder: 'SELECT * FROM users WHERE id = $1', required: true },
      { name: 'params', displayName: 'Params', type: 'json', default: '[]', placeholder: '["{{ $json.id }}"]' },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'postgres' },
    ],
  },
  {
    type: 'engine.redis',
    displayName: 'Redis Cache',
    category: 'DATA',
    monogram: 'Re',
    tone: T.data,
    execute: 'redis',
    properties: [
      { name: 'operation', displayName: 'Operation', type: 'select', options: ['get', 'set', 'delete'], default: 'get', required: true },
      { name: 'key', displayName: 'Key', type: 'string', placeholder: 'session:{{ $json.id }}', required: true },
      { name: 'value', displayName: 'Value', type: 'string', multiline: true, placeholder: '{{ $json }}', displayOptions: { show: { operation: ['set'] } } },
      { name: 'ttl', displayName: 'TTL (sec)', type: 'number', default: 0, min: 0, max: 2592000, step: 1, displayOptions: { show: { operation: ['set'] } } },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'redis' },
    ],
  },
  {
    type: 'engine.jsonTransform',
    displayName: 'JSON Transform',
    category: 'DATA',
    monogram: 'Jt',
    tone: T.data,
    execute: 'set',
    properties: [
      {
        name: 'template', displayName: 'Template', type: 'json', required: true,
        default: '{\n  "id": "{{ $json.id }}"\n}',
        placeholder: '{ "id": "{{ $json.id }}" }',
      },
      { name: 'includeInput', displayName: 'Include Input', type: 'boolean', default: false },
    ],
  },
  {
    type: 'engine.setFields',
    displayName: 'Set Fields',
    category: 'DATA',
    monogram: 'Sf',
    tone: T.data,
    execute: 'set',
    properties: [
      {
        name: 'assignments', displayName: 'Assignments', type: 'json', required: true,
        default: '[\n  { "name": "userId", "value": "{{ $json.id }}" }\n]',
        placeholder: '[ { "name": "userId", "value": "{{ $json.id }}" } ]',
      },
      { name: 'includeInput', displayName: 'Include Input', type: 'boolean', default: true },
    ],
  },

  /* ---------------------------- INTEGRATIONS ---------------------------- */
  {
    type: 'engine.telegramBot',
    displayName: 'Telegram Bot',
    category: 'INTEGRATIONS',
    monogram: 'Tg',
    tone: T.app,
    execute: 'telegram',
    properties: [
      { name: 'kind', displayName: 'Kind', type: 'select', options: ['message', 'photo', 'document'], default: 'message', required: true },
      { name: 'chatId', displayName: 'Chat ID', type: 'string', placeholder: '@channel or 123456', required: true },
      { name: 'text', displayName: 'Text', type: 'string', multiline: true, placeholder: 'Deploy {{ $execution.id }} done' },
      { name: 'media', displayName: 'Media', type: 'string', placeholder: 'https://…/shot.png', displayOptions: { show: { kind: ['photo', 'document'] } } },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'telegram' },
    ],
  },
  {
    type: 'engine.slackNotify',
    displayName: 'Slack Notify',
    category: 'INTEGRATIONS',
    monogram: 'Sl',
    tone: T.app,
    execute: 'slack',
    properties: [
      { name: 'text', displayName: 'Text', type: 'string', multiline: true, placeholder: 'Build {{ $json.status }}', required: true },
      { name: 'channel', displayName: 'Channel', type: 'string', placeholder: '#ops' },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'slack' },
    ],
  },
  {
    type: 'engine.emailSend',
    displayName: 'Email Send',
    category: 'INTEGRATIONS',
    monogram: 'Em',
    tone: T.app,
    execute: 'email',
    properties: [
      { name: 'provider', displayName: 'Provider', type: 'select', options: ['smtp', 'sendgrid', 'mailgun'], default: 'smtp', required: true },
      { name: 'to', displayName: 'To', type: 'string', placeholder: 'ops@example.com', required: true },
      { name: 'subject', displayName: 'Subject', type: 'string', placeholder: 'Run {{ $execution.id }} finished' },
      { name: 'body', displayName: 'Body', type: 'string', multiline: true, placeholder: 'Status: {{ $json.result }}' },
      { name: 'from', displayName: 'From', type: 'string', placeholder: 'engine@example.com' },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'smtp' },
    ],
  },
  {
    type: 'engine.googleSheets',
    displayName: 'Google Sheets',
    category: 'INTEGRATIONS',
    monogram: 'Gs',
    tone: T.app,
    execute: 'sheets',
    properties: [
      { name: 'operation', displayName: 'Operation', type: 'select', options: ['read', 'append', 'update'], default: 'read', required: true },
      { name: 'spreadsheetId', displayName: 'Sheet ID', type: 'string', placeholder: '1BxiM…', required: true },
      { name: 'range', displayName: 'Range', type: 'string', placeholder: 'Sheet1!A:D', default: 'Sheet1!A:D', required: true },
      { name: 'values', displayName: 'Values', type: 'json', default: '[]', placeholder: '[["{{ $json.id }}"]]', displayOptions: { show: { operation: ['append', 'update'] } } },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'google' },
    ],
  },
  {
    type: 'engine.stripeEvent',
    displayName: 'Stripe Event',
    category: 'INTEGRATIONS',
    monogram: 'St',
    tone: T.app,
    execute: 'stripe',
    isTrigger: true,
    properties: [
      { name: 'verify', displayName: 'Verify Signature', type: 'boolean', default: true },
      { name: 'credential', displayName: 'Credential', type: 'credentials', credentialType: 'stripe' },
    ],
  },

  /* -------------------------------- LOGIC ------------------------------- */
  {
    type: 'engine.ifCondition',
    displayName: 'IF Condition',
    category: 'LOGIC',
    monogram: 'If',
    tone: T.logic,
    execute: 'if',
    properties: [
      { name: 'left', displayName: 'Left', type: 'string', placeholder: '{{ $json.total }}', required: true },
      {
        name: 'operator', displayName: 'Operator', type: 'select', default: 'greaterThan', required: true,
        options: ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan', 'greaterEqual', 'lessEqual', 'isEmpty', 'isNotEmpty'],
      },
      {
        name: 'right', displayName: 'Right', type: 'string', placeholder: '100',
        displayOptions: { hide: { operator: ['isEmpty', 'isNotEmpty'] } },
      },
    ],
  },
  {
    type: 'engine.switch',
    displayName: 'Switch',
    category: 'LOGIC',
    monogram: 'Sw',
    tone: T.logic,
    execute: 'switch',
    properties: [
      { name: 'input', displayName: 'Input', type: 'string', placeholder: '{{ $json.plan }}', default: '{{ $json }}' },
      {
        name: 'rules', displayName: 'Rules', type: 'json', required: true,
        default: '[\n  { "operator": "equals", "value": "pro", "output": "pro" },\n  { "operator": "equals", "value": "team", "output": "team" }\n]',
        placeholder: '[ { "operator": "equals", "value": "pro", "output": "pro" } ]',
      },
      { name: 'defaultOutput', displayName: 'Default', type: 'string', placeholder: 'default', default: 'default' },
    ],
  },
  {
    type: 'engine.loop',
    displayName: 'Loop Items',
    category: 'LOGIC',
    monogram: 'Lo',
    tone: T.logic,
    execute: 'loop',
    properties: [
      { name: 'items', displayName: 'Items', type: 'string', placeholder: '{{ $json.orders }}', default: '{{ $json.items }}', required: true },
    ],
  },
  {
    type: 'engine.delay',
    displayName: 'Delay',
    category: 'LOGIC',
    monogram: 'De',
    tone: T.logic,
    execute: 'delay',
    properties: [
      { name: 'duration', displayName: 'Duration', type: 'number', default: 5, min: 0, max: 300000, step: 1, required: true },
      { name: 'unit', displayName: 'Unit', type: 'select', options: ['ms', 's', 'm'], default: 's' },
    ],
  },
];

export const NODE_MAP = Object.fromEntries(NODE_DEFINITIONS.map((def) => [def.type, def]));

/** Blank params for a fresh node, seeded from property defaults. */
export function defaultParams(def) {
  const params = {};
  for (const property of def.properties || []) {
    if (property.default !== undefined) params[property.name] = property.default;
  }
  return params;
}

export const NODE_CATEGORIES = [...new Set(NODE_DEFINITIONS.map((def) => def.category || 'Other'))];

export { LLM_MODELS };
