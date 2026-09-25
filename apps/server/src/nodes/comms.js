import { resolveParams } from 'shared';

async function loadCredential(params, services) {
  if (params.credential && services.getCredential) {
    return services.getCredential(params.credential);
  }
  return null;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data?.description || data?.error || `Request failed (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
  }
  return data;
}

/**
 * engine.telegramBot — params: { kind: message|photo|document, chatId, text,
 * media (url or file_id), parseMode, credential: telegram { botToken } }.
 */
export async function executeTelegram(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  const credential = await loadCredential(params, services);
  const botToken = credential?.data?.botToken || params.botToken;
  if (!botToken) throw Object.assign(new Error('Telegram node requires a telegram credential (botToken)'), { code: 'NODE_MISSING_CREDENTIAL' });
  if (!params.chatId) throw Object.assign(new Error('Telegram node requires a "chatId"'), { code: 'NODE_MISSING_PARAM' });

  const base = `https://api.telegram.org/bot${botToken}`;
  const kind = params.kind || 'message';
  if (kind === 'photo') {
    const data = await postJson(`${base}/sendPhoto`, {
      chat_id: params.chatId,
      photo: params.media,
      caption: params.text,
      parse_mode: params.parseMode,
    });
    return { json: { messageId: data.result?.message_id, kind } };
  }
  if (kind === 'document') {
    const data = await postJson(`${base}/sendDocument`, {
      chat_id: params.chatId,
      document: params.media,
      caption: params.text,
      parse_mode: params.parseMode,
    });
    return { json: { messageId: data.result?.message_id, kind } };
  }
  const data = await postJson(`${base}/sendMessage`, {
    chat_id: params.chatId,
    text: params.text || '',
    parse_mode: params.parseMode,
  });
  return { json: { messageId: data.result?.message_id, kind: 'message' } };
}

/**
 * engine.slackNotify — params: { text, channel, username,
 * credential: slack { webhookUrl } or slack { token } }.
 * Webhook credentials post directly; token credentials use chat.postMessage.
 */
export async function executeSlack(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.text) throw Object.assign(new Error('Slack node requires "text"'), { code: 'NODE_MISSING_PARAM' });
  const credential = await loadCredential(params, services);

  const webhookUrl = credential?.data?.webhookUrl || params.webhookUrl;
  if (webhookUrl) {
    await postJson(webhookUrl, { text: params.text, username: params.username, channel: params.channel });
    return { json: { sent: true, via: 'webhook' } };
  }

  const token = credential?.data?.token;
  if (!token) {
    throw Object.assign(new Error('Slack node requires a slack credential (webhookUrl or token)'), { code: 'NODE_MISSING_CREDENTIAL' });
  }
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ channel: params.channel, text: params.text, username: params.username }),
  });
  const data = await response.json().catch(() => ({}));
  if (!data.ok) throw Object.assign(new Error(`Slack error: ${data.error || response.status}`), { code: 'NODE_PROVIDER_ERROR' });
  return { json: { sent: true, via: 'api', ts: data.ts, channel: data.channel } };
}
