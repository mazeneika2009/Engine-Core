import { resolveParams } from 'shared';

function authHeaders(provider, credential) {
  if (!credential) return {};
  if (provider === 'anthropic') return { 'x-api-key': credential.data.apiKey || '', 'anthropic-version': '2023-06-01' };
  return { Authorization: `Bearer ${credential.data.apiKey || ''}` };
}

async function postJson(url, headers, body, timeoutMs = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || data?.error || `Provider error (${response.status})`;
      throw Object.assign(new Error(String(message)), { code: 'NODE_PROVIDER_ERROR' });
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function openaiChat({ credential, model, messages, temperature, maxTokens }) {
  const data = await postJson(
    'https://api.openai.com/v1/chat/completions',
    authHeaders('openai', credential),
    { model, messages, temperature, max_tokens: maxTokens }
  );
  return data.choices?.[0]?.message || {};
}

async function anthropicMessage({ credential, model, system, messages, temperature, maxTokens, tools }) {
  const body = { model, system, messages, temperature, max_tokens: maxTokens };
  if (tools && tools.length > 0) body.tools = tools;
  const data = await postJson('https://api.anthropic.com/v1/messages', authHeaders('anthropic', credential), body);
  return data;
}

async function geminiGenerate({ credential, model, systemPrompt, prompt, temperature, maxTokens }) {
  const key = credential?.data?.apiKey || '';
  const data = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {},
    {
      system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }
  );
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
}

async function loadCredential(params, services) {
  if (params.credential && services.getCredential) {
    return services.getCredential(params.credential);
  }
  return null;
}

function requireCredential(credential, label) {
  if (!credential) throw Object.assign(new Error(`${label} requires a credential with an API key`), { code: 'NODE_MISSING_CREDENTIAL' });
  return credential;
}

/**
 * engine.llmGenerate — single text generation.
 * params: { provider: openai|gemini|anthropic, model, prompt, systemPrompt,
 *           temperature, maxTokens, credential }
 */
export async function executeLlm(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.prompt) throw Object.assign(new Error('LLM node requires a "prompt"'), { code: 'NODE_MISSING_PARAM' });
  const credential = requireCredential(await loadCredential(params, services), 'LLM');
  const temperature = Number(params.temperature ?? 0.7);
  const maxTokens = Number(params.maxTokens ?? 1024);

  if (params.provider === 'gemini') {
    const text = await geminiGenerate({
      credential,
      model: params.model || 'gemini-1.5-flash',
      systemPrompt: params.systemPrompt,
      prompt: params.prompt,
      temperature,
      maxTokens,
    });
    return { json: { text, provider: 'gemini', model: params.model } };
  }
  if (params.provider === 'anthropic') {
    const data = await anthropicMessage({
      credential,
      model: params.model || 'claude-3-5-sonnet-20241022',
      system: params.systemPrompt,
      messages: [{ role: 'user', content: params.prompt }],
      temperature,
      maxTokens,
    });
    const text = (data.content || []).filter((block) => block.type === 'text').map((block) => block.text).join('');
    return { json: { text, provider: 'anthropic', model: params.model } };
  }
  const message = await openaiChat({
    credential,
    model: params.model || 'gpt-4o',
    messages: [
      ...(params.systemPrompt ? [{ role: 'system', content: params.systemPrompt }] : []),
      { role: 'user', content: params.prompt },
    ],
    temperature,
    maxTokens,
  });
  return { json: { text: message.content || '', provider: 'openai', model: params.model } };
}

/**
 * engine.aiAgent — system prompt + memory chain + one tool round-trip.
 * params: { provider: openai|anthropic, model, systemPrompt, userMessage,
 *           temperature, maxTokens, tools: [{name, description, url, method, headers}],
 *           credential }
 * Memory: when $input.messages exists it is extended (input → assistant → …).
 */
export async function executeAgent(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.userMessage) throw Object.assign(new Error('AI Agent requires a "userMessage"'), { code: 'NODE_MISSING_PARAM' });
  const credential = requireCredential(await loadCredential(params, services), 'AI Agent');
  const provider = params.provider || 'openai';
  const temperature = Number(params.temperature ?? 0.7);
  const maxTokens = Number(params.maxTokens ?? 1024);
  const tools = Array.isArray(params.tools) ? params.tools : [];

  const prior = Array.isArray(context.$input?.messages) ? context.$input.messages : [];
  const messages = [...prior, { role: 'user', content: params.userMessage }];
  const toolResults = [];

  if (provider === 'anthropic') {
    const declared = tools.map((tool) => ({
      name: tool.name,
      description: tool.description || '',
      input_schema: { type: 'object' },
    }));
    const data = await anthropicMessage({
      credential,
      model: params.model || 'claude-3-5-sonnet-20241022',
      system: params.systemPrompt,
      messages,
      temperature,
      maxTokens,
      tools: declared,
    });
    for (const block of data.content || []) {
      if (block.type === 'tool_use') {
        const tool = tools.find((item) => item.name === block.name);
        const output = await runToolHttp(tool, block.input);
        toolResults.push({ name: block.name, output });
      }
    }
    const text = (data.content || []).filter((block) => block.type === 'text').map((block) => block.text).join('');
    const full = [...messages, { role: 'assistant', content: text }];
    return { json: { text, messages: full, toolResults, provider } };
  }

  const declared = tools.map((tool) => ({
    type: 'function',
    function: { name: tool.name, description: tool.description || '', parameters: { type: 'object', properties: {} } },
  }));
  const first = await openaiChat({
    credential,
    model: params.model || 'gpt-4o',
    messages: [...(params.systemPrompt ? [{ role: 'system', content: params.systemPrompt }] : []), ...messages],
    temperature,
    maxTokens,
  });
  // openaiChat drops tool_calls — re-issue with tools when declared.
  let text = first.content || '';
  if (tools.length > 0) {
    const data = await postJson(
      'https://api.openai.com/v1/chat/completions',
      authHeaders('openai', credential),
      {
        model: params.model || 'gpt-4o',
        messages: [...(params.systemPrompt ? [{ role: 'system', content: params.systemPrompt }] : []), ...messages],
        tools: declared,
        temperature,
        max_tokens: maxTokens,
      }
    );
    const reply = data.choices?.[0]?.message || {};
    text = reply.content || text;
    for (const call of reply.tool_calls || []) {
      const tool = tools.find((item) => item.name === call.function?.name);
      let args = {};
      try {
        args = JSON.parse(call.function?.arguments || '{}');
      } catch {
        args = {};
      }
      const output = await runToolHttp(tool, args);
      toolResults.push({ name: call.function?.name, output });
    }
  }
  const full = [...messages, { role: 'assistant', content: text }];
  return { json: { text, messages: full, toolResults, provider } };
}

async function runToolHttp(tool, args) {
  if (!tool || !tool.url) return { error: 'Tool has no url configured' };
  try {
    const response = await fetch(tool.url, {
      method: (tool.method || 'POST').toUpperCase(),
      headers: { 'Content-Type': 'application/json', ...(tool.headers || {}) },
      body: JSON.stringify(args || {}),
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    return { error: error.message };
  }
}
