import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type {
  CanonicalEvent,
  ExecuteRequest,
  ExecuteResponse,
  RuntimeContext,
} from './types.js';
import { Loader } from './loader.js';
import { EventBus } from './event-bus.js';
import { withRetry } from './retry.js';
import { ExecutionLogger, makeComponentLogger } from './logger.js';

export interface RouterOptions {
  loader?: Loader;
  bus?: EventBus;
  logger?: ExecutionLogger;
  /** injectable fetch override for tests (also per-request via config.httpOverride) */
  httpOverride?: typeof fetch;
}

/** In-memory key-value store with optional file persistence. */
class Store {
  private map = new Map<string, unknown>();
  private file?: string;
  private loaded = false;

  constructor(file?: string) {
    this.file = file;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded || !this.file) return;
    this.loaded = true;
    try {
      const raw = await readFile(this.file, 'utf8');
      for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, unknown>)) {
        this.map.set(k, v);
      }
    } catch {
      /* no persistence file yet */
    }
  }

  private async persist(): Promise<void> {
    if (!this.file) return;
    try {
      const { mkdir, writeFile } = await import('node:fs/promises');
      await mkdir(path.dirname(this.file), { recursive: true });
      await writeFile(this.file, JSON.stringify(Object.fromEntries(this.map)), 'utf8');
    } catch {
      /* persistence is best-effort */
    }
  }

  async get<T = unknown>(k: string): Promise<T | undefined> {
    await this.ensureLoaded();
    return this.map.get(k) as T | undefined;
  }

  async set(k: string, v: unknown): Promise<void> {
    await this.ensureLoaded();
    this.map.set(k, v);
    await this.persist();
  }
}

/** Derive env auth for an app: APP_<APPNAME>_* -> { <key-lowercased>: value } */
export function envAuthForApp(app: string, env: NodeJS.ProcessEnv = process.env): Record<string, string> {
  const prefix = `APP_${app.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_`;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(env)) {
    if (k.startsWith(prefix) && v !== undefined) {
      out[k.slice(prefix.length).toLowerCase()] = v;
    }
  }
  return out;
}

function appFromTarget(target: string): string {
  const parts = target.split('/').filter(Boolean);
  return parts[1] ?? '';
}

export class Router {
  private loader: Loader;
  private bus: EventBus;
  private logger: ExecutionLogger;
  private store: Store;
  private httpOverride?: typeof fetch;

  constructor(private rootDir: string, opts: RouterOptions = {}) {
    this.loader = opts.loader ?? new Loader(rootDir);
    this.bus = opts.bus ?? new EventBus();
    this.logger = opts.logger ?? new ExecutionLogger(rootDir);
    this.store = new Store(process.env.STORE_FILE ?? path.join(rootDir, '.data', 'store.json'));
    this.httpOverride = opts.httpOverride;
  }

  get eventBus(): EventBus {
    return this.bus;
  }

  buildContext(req: ExecuteRequest): RuntimeContext {
    const app = appFromTarget(req.target);
    const config: Record<string, unknown> = { ...(req.config ?? {}) };
    // request auth merged over env-derived auth
    const auth: Record<string, string | undefined> = {
      ...envAuthForApp(app),
      ...(req.auth ?? {}),
    };
    const http =
      (config.httpOverride as typeof fetch | undefined) ?? this.httpOverride ?? fetch;
    return {
      auth,
      config,
      http,
      log: makeComponentLogger(req.target),
      emit: async (topic: string, payload: CanonicalEvent) => {
        await this.bus.emit(topic, payload);
      },
      store: {
        get: <T = unknown>(k: string) => this.store.get<T>(`${app}:${k}`),
        set: (k: string, v: unknown) => this.store.set(`${app}:${k}`, v),
      },
    };
  }

  async execute(req: ExecuteRequest): Promise<ExecuteResponse> {
    const started = Date.now();
    const target = req.target;
    let response: ExecuteResponse;

    if (!target || typeof target !== 'string') {
      response = {
        ok: false,
        target: String(target ?? ''),
        error: { message: 'missing or invalid "target"' },
        durationMs: Date.now() - started,
        attempts: 0,
      };
    } else {
      let attempts = 0;
      try {
        const component = await this.loader.load(target);
        const ctx = this.buildContext(req);
        const { value, attempts: used } = await withRetry(
          () => component.run(ctx, req.event, {}),
          { attempts: req.retry?.attempts ?? 3, backoffMs: req.retry?.backoffMs ?? 250 },
        );
        attempts = used;
        response = {
          ok: true,
          target,
          result: value,
          durationMs: Date.now() - started,
          attempts,
        };
      } catch (err) {
        attempts = (err as { attempts?: number }).attempts ?? 1;
        response = {
          ok: false,
          target,
          error: {
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          },
          durationMs: Date.now() - started,
          attempts,
        };
      }
    }

    await this.logger.logExecution({
      ts: new Date().toISOString(),
      target: response.target,
      event: req.event,
      ok: response.ok,
      result: response.ok ? response.result : undefined,
      error: response.error,
      durationMs: response.durationMs,
      attempts: response.attempts,
    });

    return response;
  }
}
