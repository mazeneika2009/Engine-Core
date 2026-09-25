import nodemailer from 'nodemailer';
import { resolveParams } from 'shared';

async function loadCredential(params, services) {
  if (params.credential && services.getCredential) {
    return services.getCredential(params.credential);
  }
  return null;
}

async function sendSmtp({ credential, params }) {
  const data = credential?.data || {};
  const transporter = nodemailer.createTransport({
    host: data.host || params.smtpHost,
    port: Number(data.port || params.smtpPort || 587),
    secure: String(data.secure ?? params.smtpSecure ?? 'false') === 'true',
    auth: data.user ? { user: data.user, pass: data.pass || '' } : undefined,
  });
  const info = await transporter.sendMail({
    from: data.from || params.from,
    to: params.to,
    subject: params.subject || '',
    text: params.body || '',
    html: params.html || undefined,
  });
  return { messageId: info.messageId, via: 'smtp' };
}

async function sendSendgrid({ credential, params }) {
  const apiKey = credential?.data?.apiKey || params.apiKey;
  if (!apiKey) throw Object.assign(new Error('SendGrid requires an API key'), { code: 'NODE_MISSING_CREDENTIAL' });
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      personalizations: [{ to: String(params.to).split(',').map((address) => ({ email: address.trim() })) }],
      from: { email: credential?.data?.from || params.from },
      subject: params.subject || '',
      content: [{ type: 'text/plain', value: params.body || '' }],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw Object.assign(new Error(`SendGrid error (${response.status}): ${text.slice(0, 200)}`), { code: 'NODE_PROVIDER_ERROR' });
  }
  return { via: 'sendgrid' };
}

async function sendMailgun({ credential, params }) {
  const data = credential?.data || {};
  const apiKey = data.apiKey || params.apiKey;
  const domain = data.domain || params.domain;
  if (!apiKey || !domain) throw Object.assign(new Error('Mailgun requires apiKey + domain'), { code: 'NODE_MISSING_CREDENTIAL' });
  const form = new URLSearchParams({
    from: data.from || params.from,
    to: params.to,
    subject: params.subject || '',
    text: params.body || '',
  });
  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}` },
    body: form,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(`Mailgun error (${response.status})`), { code: 'NODE_PROVIDER_ERROR' });
  return { via: 'mailgun', id: result.id };
}

/**
 * engine.emailSend — params: { to, subject, body, html, from,
 * provider: smtp|sendgrid|mailgun, credential }.
 */
export async function executeEmail(rawParams, context, services = {}) {
  const params = resolveParams(rawParams, context);
  if (!params.to) throw Object.assign(new Error('Email node requires "to"'), { code: 'NODE_MISSING_PARAM' });
  const credential = await loadCredential(params, services);
  const provider = params.provider || credential?.data?.provider || 'smtp';

  if (provider === 'sendgrid') return { json: await sendSendgrid({ credential, params }) };
  if (provider === 'mailgun') return { json: await sendMailgun({ credential, params }) };
  return { json: await sendSmtp({ credential, params }) };
}
