import React from 'react';
import { 
  Webhook, Database, Mail, MessageSquare, Bot, Clock, Code, Split, Cloud, FileJson, Send, Share2, HardDrive, Zap 
} from 'lucide-react';

export const NODE_REGISTRY = {
  webhook: {
    label: 'Webhook Trigger',
    category: 'Triggers',
    icon: React.createElement(Webhook, { size: 18 }),
    color: 'bg-blue-50 text-blue-600',
    schema: [
      { name: 'method', label: 'HTTP Method', type: 'select', options: ['GET', 'POST', 'PUT'], default: 'POST' },
      { name: 'path', label: 'Webhook Path', type: 'text', placeholder: '/v1/trigger...', required: true },
      { name: 'auth', label: 'Require Authentication', type: 'toggle', default: false }
    ]
  },
  whatsapp: {
    label: 'WhatsApp',
    category: 'Communication',
    icon: React.createElement(MessageSquare, { size: 18 }),
    color: 'bg-emerald-50 text-emerald-600',
    schema: [
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+123456789', required: true },
      { name: 'message', label: 'Message Template', type: 'textarea', placeholder: 'Hello {{name}}...' },
      { name: 'token', label: 'API Token', type: 'password', required: true }
    ]
  },
  database: {
    label: 'Database',
    category: 'Data',
    icon: React.createElement(Database, { size: 18 }),
    color: 'bg-orange-50 text-orange-600',
    schema: [
      { name: 'type', label: 'DB Type', type: 'select', options: ['PostgreSQL', 'MySQL', 'MongoDB'], required: true },
      { name: 'host', label: 'Host', type: 'text', placeholder: 'localhost' },
      { name: 'port', label: 'Port', type: 'number', default: 5432 },
      { name: 'dbName', label: 'Database Name', type: 'text' },
      { name: 'credentials', label: 'Secret Key', type: 'password' }
    ]
  },
  ai_agent: {
    label: 'AI Agent',
    category: 'AI',
    icon: React.createElement(Bot, { size: 18 }),
    color: 'bg-cyan-50 text-cyan-600',
    schema: [
      { name: 'provider', label: 'Provider', type: 'select', options: ['OpenAI', 'Anthropic', 'Mistral'], default: 'OpenAI' },
      { name: 'model', label: 'Model', type: 'select', options: ['gpt-4o', 'gpt-3.5-turbo', 'claude-3-opus'] },
      { name: 'prompt', label: 'System Prompt', type: 'textarea', required: true },
      { name: 'temperature', label: 'Temperature', type: 'range', min: 0, max: 1, step: 0.1, default: 0.7 }
    ]
  },
  schedule: {
    label: 'Schedule Trigger',
    category: 'Triggers',
    icon: React.createElement(Clock, { size: 18 }),
    color: 'bg-purple-50 text-purple-600',
    schema: [
      { name: 'cron', label: 'Cron Expression', type: 'text', placeholder: '0 0 * * *', required: true },
      { name: 'timezone', label: 'Timezone', type: 'select', options: ['UTC','Egypt', 'America/New_York', 'Europe/London'], default: 'UTC' }
    ]
  },
  email: {
    label: 'Send Email',
    category: 'Communication',
    icon: React.createElement(Mail, { size: 18 }),
    color: 'bg-red-50 text-red-600',
    schema: [
      { name: 'to', label: 'To', type: 'text', placeholder: 'recipient@example.com', required: true },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Your Subject' },
      { name: 'body', label: 'Body', type: 'textarea', placeholder: 'Email content...' },
      { name: 'html', label: 'HTML Content', type: 'toggle', default: false }
    ]
  },
  httpRequest: {
    label: 'HTTP Request',
    category: 'Actions',
    icon: React.createElement(Code, { size: 18 }),
    color: 'bg-indigo-50 text-indigo-600',
    schema: [
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      { name: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com', required: true },
      { name: 'headers', label: 'Headers (JSON)', type: 'json', placeholder: '{ "Content-Type": "application/json" }' },
      { name: 'body', label: 'Body (JSON)', type: 'json', placeholder: '{ "key": "value" }' }
    ]
  },
  conditional: {
    label: 'Conditional Logic',
    category: 'Logic',
    icon: React.createElement(Split, { size: 18 }),
    color: 'bg-yellow-50 text-yellow-600',
    schema: [
      { name: 'condition', label: 'Condition (JS)', type: 'code', placeholder: 'input.value > 100', required: true },
      { name: 'onTrue', label: 'On True (Node ID)', type: 'text', placeholder: 'node_xyz' },
      { name: 'onFalse', label: 'On False (Node ID)', type: 'text', placeholder: 'node_abc' }
    ]
  },
  cloudStorage: {
    label: 'Cloud Storage',
    category: 'Data',
    icon: React.createElement(Cloud, { size: 18 }),
    color: 'bg-gray-50 text-gray-600',
    schema: [
      { name: 'provider', label: 'Provider', type: 'select', options: ['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage'], required: true },
      { name: 'bucket', label: 'Bucket Name', type: 'text', required: true },
      { name: 'operation', label: 'Operation', type: 'select', options: ['Upload', 'Download', 'Delete'], default: 'Upload' },
      { name: 'filePath', label: 'File Path', type: 'text', placeholder: '/path/to/file.txt', required: true }
    ]
  },
  jsonTransform: {
    label: 'JSON Transform',
    category: 'Data',
    icon: React.createElement(FileJson, { size: 18 }),
    color: 'bg-teal-50 text-teal-600',
    schema: [
      { name: 'inputPath', label: 'Input Path', type: 'text', placeholder: '$.data', required: true },
      { name: 'transformCode', label: 'Transform Code (JS)', type: 'code', placeholder: 'return value.map(item => item.id);', required: true }
    ]
  }
};
