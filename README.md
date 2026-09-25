# Engine Core

n8n-style automation workflow builder: declarative node schemas on the canvas,
an Express + MySQL execution engine (DAG runner), and a shared expression language.

## Structure

```
engine-core/
├── apps/
│   ├── client/            # React canvas (Vite) — http://127.0.0.1:5173
│   │   └── src/
│   │       ├── components/  # shell, property/ (PropertyPanel, DynamicInputs)
│   │       ├── nodes/       # declarative node definitions (type, properties, execute)
│   │       ├── store/       # canvas graph store (React context)
│   │       ├── utils/       # expression helpers (re-export shared)
│   │       ├── pages/       # Dashboard, Workflows, Builder, Logs, Projects, Settings, Account
│   │       └── service/     # backend API client (graceful offline fallback)
│   └── server/            # Node.js + Express engine — http://127.0.0.1:5678
│       └── src/
│           ├── config/      # env, MySQL pool, AES-256-GCM encryption
│           ├── db/          # schema.sql + migrate runner
│           ├── models/      # workflows / executions / credentials queries
│           ├── engine/      # DAG topological sort + workflow executor
│           ├── nodes/       # trigger, httpRequest, mysql, set, if, passthrough
│           ├── controllers/ # workflows, executions, credentials, webhook
│           └── routes/      # /api/workflows, /api/executions, /api/credentials, /api/v1/webhook/:id
├── packages/
│   └── shared/            # types, JSON-schema validation, {{ }} expression engine
└── README.md
```

## Quick start

```bash
# 1. Install all workspaces
npm install

# 2. Configure the server
cp apps/server/.env.example apps/server/.env   # set DB_* + ENCRYPTION_KEY

# 3. Create tables (needs MySQL 8+ running)
npm run migrate

# 4. Run backend + frontend (two terminals, or one command)
npm run dev:server    # :5678
npm run dev:client    # :5173 (VITE_API_URL points at :5678 by default)
```

The UI works without the database: list endpoints fall back to empty local
state and show zero-data cards until the server is reachable.

## API

| Method | Route | Notes |
|---|---|---|
| GET/POST | `/api/workflows` | list / create `{name, active, nodes, connections}` |
| GET/PUT/DELETE | `/api/workflows/:id` | read / patch / delete |
| POST | `/api/workflows/:id/execute` | manual run, optional `{data, triggerNode}` |
| GET | `/api/executions?workflow_id=&limit=` | run history |
| GET | `/api/executions/:id` | run detail (outputs + errors) |
| GET/POST | `/api/credentials` | redacted list / create (encrypted at rest) |
| PUT/DELETE | `/api/credentials/:id` | update / delete |
| GET/POST | `/api/v1/webhook/:workflowId` | trigger active workflows, returns final output |
| GET | `/api/health` | `{status, database: up\|down}` |

## Node model

Each node definition exports `type` (`engine.*`), `displayName`, declarative
`properties` (`string | number | boolean | select | json | credentials` with
`displayOptions` conditions), and `execute` (server executor key).
Params accept `{{ $node["Step Name"].json.path }}` interpolations, resolved by
`packages/shared` on both client (preview) and server (execution).

## Design constraints

Zero icons (typography + hairlines only). Warm charcoal surfaces (`#1C1917` /
`#18181B`), sage (`#84A98C`) / clay (`#C08552`, `#D4A373`) accents,
`1px solid rgba(255,255,255,0.08)` borders. Minimal copy.
