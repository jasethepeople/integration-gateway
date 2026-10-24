// Shared interface contracts for native modules.
// These re-declare the shapes from src/types.ts (owned by AGENT-CORE) EXACTLY
// as defined in SPEC.md § "Interface contracts". Shapes are identical, so the
// real src/types.ts will reconcile structurally at merge time.

export interface RuntimeContext {
  /** per-app auth/config; replaces Pipedream's `this.app.$auth` */
  auth: Record<string, string | undefined>;
  /** app-level config (env-resolved) */
  config: Record<string, unknown>;
  /** fetch-compatible HTTP client */
  http: typeof fetch;
  /** namespaced logger */
  log: (level: 'info' | 'warn' | 'error', msg: string, data?: unknown) => void;
  /** emit to the local event bus */
  emit: (topic: string, payload: CanonicalEvent) => Promise<void>;
  /** key-value store for source dedup/cursors (in-memory + optional file persistence) */
  store: {
    get<T = unknown>(k: string): Promise<T | undefined>;
    set(k: string, v: unknown): Promise<void>;
  };
}

export interface ComponentDef {
  key: string; // "app_component_key" unique
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
  id: string; // uuid
  source: string; // component key that produced it
  topic: string; // e.g. "github.new_issue"
  timestamp: string; // ISO8601
  data: Record<string, unknown>;
  meta?: Record<string, unknown>;
}
