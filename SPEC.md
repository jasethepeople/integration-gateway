# SPEC — integration-gateway

Standalone, self-hosted Node.js/TypeScript middleware engine mirroring Pipedream's
`components/` modular structure, with first-class native plugins. No Pipedream
cloud dependencies. Runtime: Node 20+ (works with Bun too). Language: TypeScript (ESM).

## Directory layout (repo root)

```
integration-gateway/
├── package.json            # name: integration-gateway, type: module, scripts: dev/start/test/build
├── tsconfig.json           # ESM, NodeNext, strict, outDir dist
├── vitest.config.ts
├── README.md
├── .env.example
├── src/
│   ├── types.ts            # OWNED BY AGENT-CORE — interface contracts (below)
│   ├── loader.ts           # dynamic registry loader
│   ├── router.ts           # Dispatcher
│   ├── server.ts           # HTTP entry (no framework: node:http), /api/v1/execute
│   ├── event-bus.ts        # in-process async event bus
│   ├── retry.ts            # async retry w/ backoff
│   └── logger.ts           # payload logging (JSON lines, redaction hooks)
├── registry/
│   ├── external/           # AGENT-EXT: mirrored Pipedream components
│   │   └── <app>/
│   │       ├── manifest.json
│   │       └── components/<comp-name>/
│   │           ├── component.json      # {key,name,description,type:"action"|"source",version}
│   │           ├── index.ts            # implements IIntegrationComponent
│   │           └── original.mjs        # pristine upstream source (reference only)
│   └── native/             # AGENT-NATIVE: our own modules
│       └── <module>/       # same shape as external
├── schemas/                # AGENT-NATIVE: canonical event payloads (JSON Schema)
│   └── canonical-event.schema.json
└── tests/                  # AGENT-TEST
    ├── loader.test.ts
    ├── router.test.ts
    └── e2e.test.ts
```

## Interface contracts (sacred — src/types.ts)

```ts
export interface RuntimeContext {
  /** per-app auth/config; replaces Pipedream's `this.app.$auth` */
  auth: Record<string, string | undefined>;
  /** app-level config (env-resolved) */
  config: Record<string, unknown>;
  /** fetch-compatible HTTP client */
  http: typeof fetch;
  /** namespaced logger */
  log: (level: 'info'|'warn'|'error', msg: string, data?: unknown) => void;
  /** emit to the local event bus */
  emit: (topic: string, payload: CanonicalEvent) => Promise<void>;
  /** key-value store for source dedup/cursors (in-memory + optional file persistence) */
  store: { get<T=unknown>(k: string): Promise<T|undefined>; set(k: string, v: unknown): Promise<void> };
}

export interface ComponentDef {
  key: string;            // "app_component_key" unique
  name: string;
  description: string;
  version: string;
  type: 'action' | 'source';
  /** JSON Schema for props */
  propsSchema?: Record<string, unknown>;
}

export interface IIntegrationComponent {
  def: ComponentDef;
  run(ctx: RuntimeContext, event: unknown, steps: Steps): Promise<unknown>;
}

export interface Steps {
  [stepName: string]: { $return_value?: unknown; $summary?: string };
}

export interface CanonicalEvent {
  id: string;                 // uuid
  source: string;             // component key that produced it
  topic: string;              // e.g. "github.new_issue"
  timestamp: string;          // ISO8601
  data: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export interface ExecuteRequest {
  target: string;             // "external/<app>/<component>" or "native/<module>/<component>"
  event?: unknown;            // webhook body / trigger payload
  auth?: Record<string, string>;
  config?: Record<string, unknown>;
  retry?: { attempts?: number; backoffMs?: number };
}

export interface ExecuteResponse {
  ok: boolean;
  target: string;
  result?: unknown;
  error?: { message: string; stack?: string };
  durationMs: number;
  attempts: number;
}
```

## HTTP API (AGENT-CORE)

- `POST /api/v1/execute` — body: ExecuteRequest → ExecuteResponse. Dispatcher resolves
  `registry/<target>` dynamically via loader, builds RuntimeContext (auth from request merged
  over `.env`-derived config), runs with retry (default 3 attempts, exp backoff), returns result.
- `GET /api/v1/registry` — lists all discovered components (app, key, type, description).
- `GET /health` — `{ok:true}`.
- Component execution must never crash the server: try/catch around `run`, error captured
  in ExecuteResponse, full payload logged to `logs/executions.jsonl`.

## External mirroring rules (AGENT-EXT)

- Sparse-clone `PipedreamHQ/pipedream` `components/` (MIT licensed). If network/clone
  fails, fall back to fetching a curated set via raw.githubusercontent (github, slack, stripe — 2-3 components each, actions + at least one source per app).
- Extracted apps to cover: **github, slack, stripe** (minimum viable mirror; loader must
  scale to hundreds).
- For each mirrored component: keep pristine upstream file as `original.mjs`, write a thin
  `index.ts` adapter implementing `IIntegrationComponent` that maps Pipedream idioms to
  RuntimeContext: `this.github.$auth.oauth_access_token` → `ctx.auth.access_token`,
  `$.export`/`$emit` → `ctx.emit`, `$` interface → `ctx`.
- Strip all `@pipedream/platform` imports; replace `axios` with `ctx.http` (fetch).
- `manifest.json` per app: `{app, mirroredFrom: "PipedreamHQ/pipedream", commit?: string, components: [...keys]}`.

## Native bridge rules (AGENT-NATIVE)

- Provide `schemas/canonical-event.schema.json` (JSON Schema for CanonicalEvent).
- Implement 3 native modules under `registry/native/`:
  1. `echo` — passthrough action (smoke-test target).
  2. `transform` — maps an incoming external payload into a CanonicalEvent and emits to bus (proves external→native mapping).
  3. `dispatcher-log` — action that persists enriched events (append JSONL) — proves native I/O.
- Each native module: `component.json` + `index.ts` implementing IIntegrationComponent, with propsSchema.
- Document the mapping contract in `registry/native/README.md`: how an external component's
  raw output becomes a CanonicalEvent (source/topic/data/meta conventions).

## Tests (AGENT-TEST — after core+ext+native merged)

- Vitest. Must execute, not mock, the real pipeline:
  1. loader discovers ≥1 github or slack external action and ≥1 native module.
  2. POST /api/v1/execute against `native/echo` (real server on ephemeral port) → ok:true.
  3. External component execution with `auth` stubbed and `ctx.http` intercepted (inject a fake fetch via config) → proves an extracted GitHub/Slack action runs without Pipedream cloud.
  4. External → native chain: run mirrored github source against injected fixture HTTP, assert a CanonicalEvent lands on the bus and `transform` consumes it.
  5. Retry logic: a component that throws N-1 times succeeds on attempt N.
- `npm test` (or `bun test` only if it runs vitest-compatible) must pass; capture verbatim output.

## Merge order
1. AGENT-CORE (types/loader/router/server) → branch `core`
2. AGENT-NATIVE → branch `native`
3. AGENT-EXT → branch `external`
4. AGENT-TEST → branch `test` (runs after 1-3 merged to main)

## Definition of done
- `npm install && npm test` green; `npm run dev` starts server; registry lists ≥3 external apps + ≥3 native modules.
- README: quickstart, how to add an external mirror, how to add a native module, API examples (curl).
