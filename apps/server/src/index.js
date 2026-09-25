import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { pingDb } from './config/db.js';
import workflowRoutes from './routes/workflows.js';
import executionRoutes from './routes/executions.js';
import credentialRoutes from './routes/credentials.js';
import webhookRoutes from './routes/webhook.js';

import { fileURLToPath } from 'node:url';

export function createApp() {
  const app = express();
  app.use(cors());
  // Keep the raw body for HMAC-verified webhook nodes (Stripe).
  app.use(express.json({
    limit: '1mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString('utf8');
    },
  }));

  app.get('/api/health', async (req, res) => {
    let database = 'up';
    try {
      await pingDb();
    } catch {
      database = 'down';
    }
    res.json({ data: { status: 'ok', database, time: new Date().toISOString() } });
  });

  app.use('/api/workflows', workflowRoutes);
  app.use('/api/executions', executionRoutes);
  app.use('/api/credentials', credentialRoutes);
  app.use('/api/v1/webhook', webhookRoutes);

  app.use('/api', (req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Unknown API route' } });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    console.error('[server]', error);
    // Never leak driver internals: database failures become a generic 503.
    const isDatabaseError = error && (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ENOTFOUND' || error.code === 'PROTOCOL_CONNECTION_LOST');
    const status = isDatabaseError ? 503 : error.status || 500;
    const code = isDatabaseError ? 'DATABASE_UNAVAILABLE' : error.code || 'INTERNAL_ERROR';
    const message = isDatabaseError ? 'Database unavailable' : error.message || 'Unexpected server error';
    res.status(status).json({ error: { code, message } });
  });

  return app;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] Engine Core listening on :${env.port} (db: ${env.db.host}:${env.db.port}/${env.db.database})`);
  });
}
