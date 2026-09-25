import { executeTrigger } from './triggers.js';
import { executeHttpRequest } from './httpRequest.js';
import { executeMysql } from './mysql.js';
import { executePostgres } from './postgres.js';
import { executeRedis } from './redis.js';
import { executeSet } from './set.js';
import { executeIf } from './if.js';
import { executeSwitch, executeLoop, executeDelay } from './flow.js';
import { executeLlm, executeAgent } from './ai.js';
import { executeTranslate } from './translate.js';
import { executeSentiment, executeSummarize } from './analyze.js';
import { executeImage } from './image.js';
import { executeExec, executeCodeJs, executeCodePython, executeFile, executeSsh } from './system.js';
import { executeTelegram, executeSlack } from './comms.js';
import { executeEmail } from './email.js';
import { executeSheets } from './sheets.js';
import { executeStripe } from './stripe.js';
import { executePassthrough } from './passthrough.js';

/** Executor key → handler. Keys mirror shared EXECUTOR_KEYS. */
const REGISTRY = {
  trigger: executeTrigger,
  httpRequest: executeHttpRequest,
  mysql: executeMysql,
  postgres: executePostgres,
  redis: executeRedis,
  set: executeSet,
  if: executeIf,
  switch: executeSwitch,
  loop: executeLoop,
  delay: executeDelay,
  llm: executeLlm,
  agent: executeAgent,
  translate: executeTranslate,
  sentiment: executeSentiment,
  summarize: executeSummarize,
  image: executeImage,
  exec: executeExec,
  codeJs: executeCodeJs,
  codePython: executeCodePython,
  file: executeFile,
  ssh: executeSsh,
  telegram: executeTelegram,
  slack: executeSlack,
  email: executeEmail,
  sheets: executeSheets,
  stripe: executeStripe,
  passthrough: executePassthrough,
};

export function getExecutor(key) {
  const handler = REGISTRY[key];
  if (!handler) throw Object.assign(new Error(`Unknown executor "${key}"`), { code: 'NODE_UNKNOWN_EXECUTOR' });
  return handler;
}

export async function runExecutor(key, params, context, services = {}) {
  return getExecutor(key)(params, context, services);
}

export {
  executeTrigger,
  executeHttpRequest,
  executeMysql,
  executePostgres,
  executeRedis,
  executeSet,
  executeIf,
  executeSwitch,
  executeLoop,
  executeDelay,
  executeLlm,
  executeAgent,
  executeTranslate,
  executeSentiment,
  executeSummarize,
  executeImage,
  executeExec,
  executeCodeJs,
  executeCodePython,
  executeFile,
  executeSsh,
  executeTelegram,
  executeSlack,
  executeEmail,
  executeSheets,
  executeStripe,
  executePassthrough,
};
