// _pipedream-shim.ts — generic adapter that wraps a Pipedream-style component
// object ({ key, name, version, type, props, methods, hooks, run }) into the
// gateway's IIntegrationComponent. Generated once by scripts/ingest.mjs.
//
// Rewritten in full after a filesystem truncation; preserves the original
// contract:
//   - proxy `this`: props from the event payload, upstream.methods bound,
//     $auth / <app>$auth mapped from ctx.auth with token aliasing
//   - this.<appVar> -> app-module proxy whose methods see this.$auth
//     (Pipedream app modules nest API helpers under `.methods`)
//   - `$` bag: $.export -> steps.$exports, $emit -> ctx.emit CanonicalEvent,
//     $.db / $.service.db -> ctx.store, $.interface/$.respond/$.flow/$.send
//     -> warn-once no-ops
//   - sources: best-effort deploy hook before the live run
import { randomUUID } from "crypto";
import type {
  CanonicalEvent,
  ComponentDef,
  IIntegrationComponent,
  RuntimeContext,
  Steps,
} from "./_types.ts";

export interface IngestMeta {
  key: string;
  app: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  type: "action" | "source";
}

const warned = new Set<string>();
function warnOnce(ctx: RuntimeContext, k: string, msg: string): void {
  if (!warned.has(k)) {
    warned.add(k);
    ctx.log("warn", msg);
  }
}

/** Map gateway auth keys onto the names Pipedream components expect. */
function mapAuth(ctx: RuntimeContext): Record<string, string | undefined> {
  const a = ctx.auth || {};
  const out: Record<string, string | undefined> = { ...a };
  if (out.access_token && !out.oauth_access_token) out.oauth_access_token = out.access_token;
  if (out.oauth_access_token && !out.access_token) out.access_token = out.oauth_access_token;
  if (out.token && !out.access_token) out.access_token = out.token;
  if (out.token && !out.oauth_access_token) out.oauth_access_token = out.token;
  if (out.access_token && !out.token) out.token = out.access_token;
  if (out.api_key && !out.key) out.key = out.api_key;
  return out;
}

interface DollarBag {
  export: (k: string, v: unknown) => void;
  emit: (data: unknown, meta?: Record<string, unknown>) => Promise<void>;
  db: RuntimeContext["store"];
  service: { db: RuntimeContext["store"] };
  interface: Record<string, unknown>;
  respond: (r: unknown) => void;
  send: Record<string, unknown>;
  flow: Record<string, unknown>;
  [k: string]: unknown;
}

function buildDollar(ctx: RuntimeContext, meta: IngestMeta, steps: Steps): DollarBag {
  const topic = `${meta.app}.${meta.slug.replace(/-/g, "_")}`;
  const noop =
    (what: string) =>
    (..._args: unknown[]) => {
      warnOnce(ctx, `${meta.key}:${what}`, `[${meta.key}] $.${what} is not supported by the gateway shim; no-op`);
      return undefined;
    };
  const bag: Record<string, unknown> = {
    export: (k: string, v: unknown) => {
      const ex: Record<string, unknown> = ((steps as any).$exports ??= {});
      ex[k] = v;
      if (k === "$summary") ctx.log("info", `[${meta.key}] ${String(v)}`);
    },
    emit: async (data: unknown, eventMeta?: Record<string, unknown>) => {
      const d = (data ?? {}) as Record<string, unknown>;
      const evt: CanonicalEvent = {
        id: typeof d.id === "string" ? (d.id as string) : randomUUID(),
        source: meta.key,
        topic,
        timestamp: new Date().toISOString(),
        data: d,
        meta: eventMeta,
      };
      await ctx.emit(topic, evt);
    },
    db: ctx.store,
    service: { db: ctx.store },
    interface: new Proxy(
      {},
      {
        get: (_t, prop) => {
          warnOnce(ctx, `${meta.key}:$.interface.${String(prop)}`,
            `[${meta.key}] $.interface.${String(prop)} (timer/http) not supported; no-op`);
          if (prop === "http") return { respond: noop("interface.http.respond") };
          return undefined;
        },
      },
    ),
    respond: noop("respond"),
    send: new Proxy({}, { get: () => noop("send.*") }),
    flow: new Proxy({}, { get: () => noop("flow.*") }),
  };
  return new Proxy(bag, {
    get(t, prop, recv) {
      if (prop in t) return Reflect.get(t, prop, recv);
      const f = noop(String(prop));
      t[prop as string] = f;
      return f;
    },
  }) as DollarBag;
}

/**
 * Wrap an upstream Pipedream component into an IIntegrationComponent.
 * `kind` is "action" | "source".
 */
export function adaptComponent(
  upstream: any,
  meta: IngestMeta,
  kind: "action" | "source",
  appModule?: any,
): IIntegrationComponent {
  const def: ComponentDef = {
    key: meta.key,
    name: meta.name || upstream?.name || meta.key,
    description: meta.description || upstream?.description || "",
    version: meta.version || upstream?.version || "0.0.1",
    type: kind,
  };

  async function run(ctx: RuntimeContext, event: unknown, steps: Steps): Promise<unknown> {
    if (typeof upstream?.run !== "function") {
      throw new Error(`[${meta.key}] upstream component has no run() method`);
    }
    const auth = mapAuth(ctx);
    // Consumed by _platform-shim.__pdBindAuth getters on app modules.
    (globalThis as any).__PD_AUTH__ = auth;
    // Route the axios-over-fetch shim through the RuntimeContext HTTP client
    // when one is provided (gateway injects ctx.http).
    if (typeof ctx?.http === "function") {
      try {
        // @ts-expect-error plain-JS module, no type declarations
        const shim = await import("./_platform-shim.mjs");
        (shim as any).__pdSetFetch?.(ctx.http);
      } catch { /* platform shim optional at runtime */ }
    }

    const $ = buildDollar(ctx, meta, steps);
    const propsBag: Record<string, unknown> =
      (event && typeof event === "object" &&
        ((event as any).props && typeof (event as any).props === "object"
          ? (event as any).props
          : (event as Record<string, unknown>))) || {};

    // App-module context: exposes the app file's methods with `this` bound so
    // this.$auth inside them resolves to the gateway auth.
    const appCtx: any = new Proxy({}, {
      get(_t, k) {
        const ks = String(k);
        if (ks === "$auth" || ks.endsWith("$auth")) return auth;
        // Pipedream app modules nest callable API helpers under `.methods`.
        const v = appModule?.[k] !== undefined ? appModule[k] : appModule?.methods?.[k];
        if (typeof v === "function") return v.bind(appCtx);
        if (v !== undefined) return v;
        return undefined;
      },
      has(_t, k) {
        return k === "$auth" || (appModule ? k in appModule : false) ||
          (appModule?.methods ? k in appModule.methods : false);
      },
    });
    const appLikeCache = new Map<string, unknown>();
    const self = new Proxy(
      {},
      {
        get(_t, prop: string | symbol) {
          const p = String(prop);
          if (p === "$") return $;
          if (p === "$auth" || p.endsWith("$auth")) return auth;
          if (p === "steps") return steps;
          if (upstream.methods && prop in upstream.methods) {
            const fn = upstream.methods[prop];
            return typeof fn === "function" ? fn.bind(self) : fn;
          }
          if (p in propsBag) return propsBag[p];
          const pd = upstream.props?.[p];
          if (pd && typeof pd === "object" && "default" in pd) return pd.default;
          // this.<appVar> style access (e.g. this.app.method(), this.notion.$auth)
          if (appModule) return appCtx;
          if (!appLikeCache.has(p)) {
            appLikeCache.set(p, new Proxy({ $auth: auth }, {
              get(t, k) {
                if (k in t) return (t as any)[k];
                if (String(k).endsWith("$auth")) return auth;
                return undefined;
              },
            }));
          }
          return appLikeCache.get(p);
        },
        has(_t, prop) {
          return (
            prop === "$" ||
            (upstream.methods && prop in upstream.methods) ||
            prop in propsBag
          );
        },
      },
    );

    // Sources with a deploy hook and no live event run their backfill first.
    if (kind === "source" && (event === undefined || event === null) &&
        typeof upstream.hooks?.deploy === "function") {
      try {
        await upstream.hooks.deploy.call(self, { $ });
      } catch (e) {
        ctx.log("warn", `[${meta.key}] deploy hook failed (best-effort): ${(e as Error)?.message ?? e}`);
      }
    }

    // Invoke the upstream component. Pipedream signature: run({ $, steps, ... }).
    const args = { $, steps };
    return await upstream.run.call(self, args);
  }

  return { def, run };
}

export default adaptComponent;
