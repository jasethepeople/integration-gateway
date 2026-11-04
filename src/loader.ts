import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ComponentDef, IIntegrationComponent } from './types.js';

export interface RegistryEntry {
  /** e.g. "external/github/create-issue" */
  target: string;
  kind: 'external' | 'native';
  app: string;
  key: string;
  name?: string;
  description?: string;
  type?: string;
  version?: string;
}

export interface RegistryScan {
  components: RegistryEntry[];
  scannedDirs: number;
}

/** Run `fn` over `items` with at most `limit` in flight at once. */
async function mapLimit<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

/**
 * Loader: resolves "external/<app>/<component>" / "native/<module>/<component>"
 * targets to modules under registry/ and dynamic-imports them (cached).
 *
 * Layout tolerance: a component directory is any directory containing an
 * index.ts (or index.js / index.mjs). External apps nest components under
 * registry/external/<app>/components/<comp>/; native modules may nest or not.
 */
export class Loader {
  private cache = new Map<string, Promise<IIntegrationComponent>>();

  constructor(private rootDir: string) {}

  private registryRoot(): string {
    return path.join(this.rootDir, 'registry');
  }

  /** Resolve a target to an absolute module file path. */
  async resolve(target: string): Promise<string> {
    const parts = target.split('/').filter(Boolean);
    // Accept "native/<module>" (module dir IS the component) and
    // "external/<app>/<component>" / "native/<module>/<component>".
    if (
      (parts.length === 2 && parts[0] === 'native') ||
      (parts.length === 3 && (parts[0] === 'external' || parts[0] === 'native'))
    ) {
      for (const seg of parts) {
        if (seg === '..' || seg.includes('..')) throw new Error(`invalid target "${target}"`);
      }
    } else {
      throw new Error(
        `invalid target "${target}": expected "external/<app>/<component>" or "native/<module>[/<component>]"`,
      );
    }
    const [kind, app, component] = parts;
    const base = path.join(this.registryRoot(), kind, app);
    const candidates = component
      ? [
          // flat: registry/<kind>/<app>/<component>/index.ts
          path.join(base, component),
          // nested: registry/<kind>/<app>/components/<component>/index.ts
          path.join(base, 'components', component),
        ]
      : [
          // module dir is the component: registry/native/<module>/index.ts
          base,
        ];
    for (const dir of candidates) {
      for (const file of ['index.ts', 'index.js', 'index.mjs']) {
        const p = path.join(dir, file);
        try {
          const s = await stat(p);
          if (s.isFile()) return p;
        } catch {
          /* not here */
        }
      }
    }
    throw new Error(`component not found for target "${target}"`);
  }

  /** Load (import) a component, with caching. */
  async load(target: string): Promise<IIntegrationComponent> {
    let cached = this.cache.get(target);
    if (!cached) {
      cached = this.resolve(target).then(async (file) => {
        const mod: unknown = await import(pathToFileURL(file).href);
        const comp = pickComponent(mod);
        if (!comp || typeof comp.run !== 'function') {
          throw new Error(`module at "${file}" does not export an IIntegrationComponent`);
        }
        return comp;
      });
      this.cache.set(target, cached);
      // On failure, don't poison the cache permanently.
      cached.catch(() => this.cache.delete(target));
    }
    return cached;
  }

  /** Read a component.json next to a module file, if present. */
  async readComponentJson(dir: string): Promise<Partial<ComponentDef> | undefined> {
    try {
      const raw = await readFile(path.join(dir, 'component.json'), 'utf8');
      return JSON.parse(raw) as Partial<ComponentDef>;
    } catch {
      return undefined;
    }
  }

  /**
   * Recursively walk registry/ and list every component (dirs with
   * component.json or index.ts). Filesystem-only — no imports — so it
   * scales to hundreds of apps.
   */
  async list(): Promise<RegistryScan> {
    const root = this.registryRoot();
    const components: RegistryEntry[] = [];
    let scannedDirs = 0;

    const walk = async (dir: string): Promise<void> => {
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      scannedDirs++;
      const files = new Set(entries.filter((e) => e.isFile()).map((e) => e.name));
      const isComponentDir =
        files.has('component.json') || files.has('index.ts') || files.has('index.js') || files.has('index.mjs');
      if (isComponentDir) {
        const rel = path.relative(root, dir).split(path.sep).filter(Boolean);
        // rel shapes:
        //   [kind, app]                      (native module dir IS the component)
        //   [kind, app, comp]                (flat)
        //   [kind, app, 'components', comp]  (nested)
        let kind: string, app: string, comp: string;
        if (rel.length === 2 && rel[0] === 'native') {
          [kind, app] = rel;
          comp = app;
        } else if (rel.length === 3) {
          [kind, app, comp] = rel;
        } else if (rel.length === 4 && rel[2] === 'components') {
          [kind, app, , comp] = rel;
        } else {
          return; // e.g. app dir itself has a component.json (manifest) — skip odd shapes
        }
        if (kind !== 'external' && kind !== 'native') return;
        const cj = await this.readComponentJson(dir);
        const target =
          kind === 'native' && rel.length === 2 ? `${kind}/${app}` : `${kind}/${app}/${comp}`;
        components.push({
          target,
          kind: kind as 'external' | 'native',
          app,
          key: cj?.key ?? comp,
          name: cj?.name,
          description: cj?.description,
          type: cj?.type,
          version: cj?.version,
        });
        return; // don't descend into a component dir
      }
      // Bounded fan-out: an unbounded Promise.all over ~15k component
      // dirs exhausts file descriptors, and readComponentJson's
      // catch-all would silently drop most component.json metadata
      // (entries fell back to bare keys with no name/type). 64 in
      // flight stays far under typical fd limits.
      await mapLimit(
        entries.filter((e) => e.isDirectory()),
        64,
        (e) => walk(path.join(dir, e.name)),
      );
    };

    await walk(root);
    components.sort((a, b) => a.target.localeCompare(b.target));
    return { components, scannedDirs };
  }
}

function pickComponent(mod: unknown): IIntegrationComponent | undefined {
  const m = mod as Record<string, unknown>;
  const candidates = [m.default, m.component, m];
  for (const c of candidates) {
    if (c && typeof c === 'object' && typeof (c as { run?: unknown }).run === 'function') {
      return c as IIntegrationComponent;
    }
  }
  return undefined;
}
