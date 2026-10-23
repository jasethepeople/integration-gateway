#!/usr/bin/env node
// scripts/ingest.mjs — bulk-ingest PipedreamHQ/pipedream `components/` apps into
// the integration-gateway execution format (registry/external/<app>/...).
// Plain node builtins only (fs/path/crypto). Deterministic and re-runnable:
// each app's target dir is removed before being rewritten.
//
// Usage: node scripts/ingest.mjs [--src /tmp/pipedream-bulk/components] [--apps a,b,c]
import fs from "node:fs";
import path from "node:path";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const EXT = path.join(REPO, "registry", "external");
const SKIP_APPS = new Set(["github", "slack", "stripe"]); // hand-written v1 adapters
const args = process.argv.slice(2);
function argVal(name, dflt) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
}
const SRC = path.resolve(argVal("--src", "/tmp/pipedream-bulk/components"));
const ONLY = argVal("--apps", null)?.split(",").filter(Boolean) ?? null;
const POOL = 16;

const posix = (p) => p.split(path.sep).join("/");
function relSpec(fromFile, toFile) {
  let r = posix(path.relative(path.dirname(fromFile), toFile));
  if (!r.startsWith(".")) r = "./" + r;
  return r;
}

const PLATFORM_SHIM = path.join(EXT, "_platform-shim.mjs");

// ---------------------------------------------------------------------------
// Import sanitization
// ---------------------------------------------------------------------------
// Matches `import ... from "x"`, `export ... from "x"` (multiline-safe) and
// side-effect `import "x"`.
const RE_FROM =
  /((?:^|\n)\s*(?:import|export)\s+(?:[^'";\\]|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\\[\s\S])*?\sfrom\s*)("([^"]+)"|'([^']+)')/g;
const RE_SIDE = /((?:^|\n)\s*import\s*)("([^"]+)"|'([^']+)')(?=\s*;?\s*(?:\n|$))/g;

function makeSanitizer(opts) {
  const { appName, appDir, appFile, appOutDir, stats, fileLabel } = opts;
  const sharedOut = path.join(appOutDir, "shared");
  const appMjsOut = path.join(appOutDir, "app.mjs");

  function mapSpecifier(spec, importerUpstream, importerOut) {
    if (spec === "@pipedream/platform") {
      return { spec: relSpec(importerOut, PLATFORM_SHIM) };
    }
    if (spec === "@pipedream/types") return { drop: true };
    if (spec.startsWith("@pipedream/")) {
      stats.pipedreamImports.add(spec);
      return { comment: true };
    }
    if (spec.startsWith("./") || spec.startsWith("../")) {
      const resolved = path.resolve(path.dirname(importerUpstream), spec);
      if (appFile && resolved === appFile) {
        return { spec: relSpec(importerOut, appMjsOut) };
      }
      let target = null;
      let usedExt = "";
      for (const cand of [resolved, resolved + ".mjs", resolved + ".js", resolved + ".json",
                          path.join(resolved, "index.mjs")]) {
        if (fs.existsSync(cand) && fs.statSync(cand).isFile()) { target = cand; break; }
        if (!fs.existsSync(cand) && !usedExt) usedExt = cand;
      }
      if (target && target.startsWith(appDir + path.sep)) {
        // Import of a sibling component file (which ingest relocates to
        // components/<slug>/original.mjs, not shared/) — retarget there.
        if (opts.compSlug?.has(target)) {
          return { spec: relSpec(importerOut,
            path.join(appOutDir, "components", opts.compSlug.get(target), "original.mjs")) };
        }
        const rel = path.relative(appDir, target);
        return { spec: relSpec(importerOut, path.join(sharedOut, rel)) };
      }
      if (target && target.startsWith(SRC + path.sep)) {
        // Cross-app import — copy the other app's file is out of scope; record.
        stats.crossApp.add(`${fileLabel}: ${spec}`);
        return { comment: true };
      }
      if (!target) {
        stats.unresolved.add(`${fileLabel}: ${spec}`);
        return { comment: true };
      }
      return null; // leave as-is
    }
    // bare npm import — leave, record
    stats.npmImports.add(spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/"));
    return null;
  }

  return function sanitize(text, importerUpstream, importerOut) {
    const repl = (match, pre, quoted, dq, sq) => {
      const spec = dq ?? sq;
      const m = mapSpecifier(spec, importerUpstream, importerOut);
      if (!m) return match;
      const lead = pre.match(/^\r?\n/)?.[0] ?? "";
      if (m.drop) return `${lead}// removed by ingest: import ... from "${spec}";`;
      if (m.comment) {
        // If the commented import bound a default/namespace identifier that
        // the file still references (e.g. `...app` from "@pipedream/base"),
        // leave an empty-object stub so the module still evaluates.
        const ident =
          pre.match(/import\s+(\w+)\s*(?:,\s*\{[\s\S]*?\})?\s*from\s*$/)?.[1] ??
          pre.match(/import\s*\*\s*as\s*(\w+)\s*from\s*$/)?.[1];
        const stub = ident
          ? `\nconst ${ident} = {}; // stubbed by ingest: base module unavailable`
          : "";
        return `${lead}// commented by ingest: import ... from "${spec}";${stub}`;
      }
      return `${lead}${pre.trimStart()}"${m.spec}"`;
    };
    let out = text.replace(RE_FROM, repl).replace(RE_SIDE, repl);
    return out;
  };
}

// ---------------------------------------------------------------------------
// Field extraction helpers
// ---------------------------------------------------------------------------
function fieldStr(text, name) {
  const m = text.match(new RegExp(`^\\s*${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "m")) ||
            text.match(new RegExp(`^\\s*${name}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, "m"));
  return m ? m[1].replace(/\\(["'\\])/g, "$1") : null;
}
function isComponentFile(text) {
  return /^\s*key\s*:/m.test(text) && /export\s+default/.test(text) &&
    /^\s*type\s*:\s*["'](action|source)["']/m.test(text);
}

// The component's Pipedream `type` is the top-level `"action"|"source"` field
// of the default-exported object (the one near `key:`). Never use fieldStr
// here: an unconstrained match can pick up a nested prop's `type: "string"`.
function extractType(text) {
  const m = text.match(/^\s*type\s*:\s*["'](action|source)["']/m);
  return m ? m[1] : null;
}

function extractAuth(appText) {
  const auth = {};
  // propDefinitions: { name: { type: "...", ... } }
  const pd = appText.match(/propDefinitions\s*:\s*\{/);
  if (pd) {
    // scan forward for top-level keys with a following type
    const re = /^\s{4}(\w+)\s*:\s*\{\s*\n\s*type\s*:\s*"([^"]+)"/gm;
    let m;
    while ((m = re.exec(appText))) auth[m[1]] = { kind: "propDefinition", type: m[2] };
  }
  // this.$auth.<name> usage
  for (const m of appText.matchAll(/\$auth\.(\w+)/g)) {
    if (!auth[m[1]]) auth[m[1]] = { kind: "authKey", type: "string" };
  }
  return auth;
}

// ---------------------------------------------------------------------------
// Per-app ingestion
// ---------------------------------------------------------------------------
function ingestApp(appName) {
  const appDir = path.join(SRC, appName);
  const report = { status: "ok", components: 0, errors: [] };
  const stats = {
    npmImports: new Set(),
    pipedreamImports: new Set(),
    unresolved: new Set(),
    crossApp: new Set(),
  };
  try {
    const appOutDir = path.join(EXT, appName);
    fs.rmSync(appOutDir, { recursive: true, force: true });
    fs.mkdirSync(path.join(appOutDir, "components"), { recursive: true });

    const entries = fs.readdirSync(appDir, { withFileTypes: true });
    const appFileEntry = entries.find((e) => e.isFile() && e.name.endsWith(".app.mjs"));
    const appFile = appFileEntry ? path.join(appDir, appFileEntry.name) : null;

    // Walk all files; classify components vs shared support files.
    const allFiles = [];
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) {
          if (e.name === "node_modules" || e.name.startsWith(".")) continue;
          walk(p);
        } else if (e.isFile() && /\.(mjs|js|json)$/.test(e.name)) {
          allFiles.push(p);
        }
      }
    })(appDir);

    const isCompPath = (p) =>
      /\.mjs$/.test(p) &&
      !p.endsWith(".app.mjs") &&
      /[/\\](actions|sources)[/\\]/.test(p) &&
      path.basename(p, ".mjs") !== "test-event";

    const components = [];
    const shared = [];
    for (const p of allFiles) {
      if (p === appFile) continue;
      if (isCompPath(p)) {
        let text;
        try { text = fs.readFileSync(p, "utf8"); } catch { continue; }
        if (isComponentFile(text)) components.push({ p, text });
        else shared.push(p);
      } else {
        shared.push(p);
      }
    }

    // Pre-assign component slugs (sorted, deduped) so that imports of sibling
    // component files can be retargeted to components/<slug>/original.mjs.
    const compSlug = new Map();
    {
      const used = new Set();
      for (const { p } of [...components].sort((a, b) => a.p.localeCompare(b.p))) {
        let slug = path.basename(p, ".mjs").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
        let n = 2;
        const base = slug;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        compSlug.set(p, slug);
      }
    }

    const sanitize = makeSanitizer({
      appName, appDir, appFile, appOutDir, stats, fileLabel: appName, compSlug,
    });

    // Copy shared support files (sanitized), preserving app-relative paths.
    const sharedOut = path.join(appOutDir, "shared");
    for (const p of shared) {
      const rel = path.relative(appDir, p);
      const out = path.join(sharedOut, rel);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      try {
        if (/\.json$/.test(p)) {
          fs.copyFileSync(p, out);
        } else {
          const text = fs.readFileSync(p, "utf8");
          fs.writeFileSync(out, sanitize(text, p, out));
        }
      } catch (e) {
        report.errors.push(`shared ${rel}: ${e.message}`);
      }
    }

    // App file -> app.mjs (sanitized + $auth binding on default export).
    let authDefs = {};
    if (appFile) {
      const appText = fs.readFileSync(appFile, "utf8");
      authDefs = extractAuth(appText);
      const out = path.join(appOutDir, "app.mjs");
      let text = sanitize(appText, appFile, out);
      if (/export\s+default\s*\{/.test(text)) {
        text = text.replace(/export\s+default\s*\{/, "const __pdApp = {");
        text += `\nexport default __pdApp;\n` +
          `import { __pdBindAuth as __pdBind } from ` +
          `"${relSpec(out, PLATFORM_SHIM)}";\n` +
          `__pdBind(__pdApp, ${JSON.stringify(appName)});\n`;
      } else {
        report.errors.push("app.mjs: no `export default {` found; $auth binding skipped");
        report.status = "partial";
      }
      fs.writeFileSync(out, text);
    }

    // Components.
    const keys = [];
    for (const { p, text } of components.sort((a, b) => a.p.localeCompare(b.p))) {
      try {
        const slug = compSlug.get(p);
        const key = `${appName}-${slug}`;
        const type = extractType(text) ||
          (/[/\\]sources[/\\]/.test(p) ? "source" : "action");
        const meta = {
          key,
          app: appName,
          slug,
          name: fieldStr(text, "name") || slug,
          description: fieldStr(text, "description") || "",
          version: fieldStr(text, "version") || "0.0.1",
          type,
        };
        const compDir = path.join(appOutDir, "components", slug);
        fs.mkdirSync(compDir, { recursive: true });
        const origOut = path.join(compDir, "original.mjs");
        fs.writeFileSync(origOut, sanitize(text, p, origOut));
        fs.writeFileSync(
          path.join(compDir, "component.json"),
          JSON.stringify(
            { key, name: meta.name, description: meta.description, type, version: meta.version },
            null, 2) + "\n");
        const relUpstream = posix(path.relative(path.join(SRC, ".."), p));
        const hasAppMjs = fs.existsSync(path.join(appOutDir, "app.mjs"));
        const indexTs =
`// AUTO-GENERATED by scripts/ingest.mjs — do not edit by hand.
// Mirrored from PipedreamHQ/pipedream ${relUpstream}
import type { IIntegrationComponent } from "../../../_types.ts";
import { adaptComponent, type IngestMeta } from "../../../_pipedream-shim.ts";
// @ts-expect-error upstream plain ESM, no type declarations
import upstream from "./original.mjs";
${hasAppMjs ? `// @ts-expect-error upstream plain ESM, no type declarations
import appModule from "../../app.mjs";
` : ""}
const meta: IngestMeta = ${JSON.stringify(meta, null, 2)};

export default adaptComponent(upstream, meta, ${JSON.stringify(type)}${hasAppMjs ? ", appModule" : ""}) as IIntegrationComponent;
`;
        fs.writeFileSync(path.join(compDir, "index.ts"), indexTs);
        keys.push(key);
        report.components++;
      } catch (e) {
        report.errors.push(`component ${p}: ${e.message}`);
        report.status = "partial";
      }
    }

    if (report.errors.length && report.status === "ok") report.status = "partial";
    const manifest = {
      app: appName,
      mirroredFrom: "PipedreamHQ/pipedream",
      auth: authDefs,
      categories: [],
      components: keys,
    };
    if (stats.npmImports.size) manifest.npmImports = [...stats.npmImports].sort();
    fs.writeFileSync(
      path.join(appOutDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

    return {
      report,
      stats: {
        npmImports: stats.npmImports.size,
        pipedreamImports: [...stats.pipedreamImports],
        unresolved: [...stats.unresolved],
        crossApp: [...stats.crossApp],
      },
    };
  } catch (e) {
    report.status = "failed";
    report.errors.push(String(e.stack || e));
    return { report, stats: {} };
  }
}

// ---------------------------------------------------------------------------
// Main: 16-way async pool
// ---------------------------------------------------------------------------
const apps = fs.readdirSync(SRC, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !SKIP_APPS.has(e.name) &&
    (!ONLY || ONLY.includes(e.name)))
  .map((e) => e.name)
  .sort();

const totals = {
  apps: apps.length,
  ok: 0, partial: 0, failed: 0,
  components: 0,
  appsWithNpmImports: 0,
};
const perApp = {};
let idx = 0;
async function worker() {
  while (idx < apps.length) {
    const app = apps[idx++];
    const { report, stats } = ingestApp(app);
    perApp[app] = {
      status: report.status,
      components: report.components,
      errors: report.errors.slice(0, 20),
      ...(stats.pipedreamImports?.length ? { pipedreamImports: stats.pipedreamImports } : {}),
      ...(stats.unresolved?.length ? { unresolved: stats.unresolved.slice(0, 10) } : {}),
      ...(stats.crossApp?.length ? { crossApp: stats.crossApp.slice(0, 10) } : {}),
    };
    totals[report.status]++;
    totals.components += report.components;
    if (stats.npmImports) totals.appsWithNpmImports++;
  }
}
await Promise.all(Array.from({ length: POOL }, worker));

const reportOut = {
  generatedAt: new Date().toISOString(),
  source: posix(SRC),
  skippedApps: [...SKIP_APPS],
  totals,
  perApp,
};
fs.writeFileSync(path.join(REPO, "ingestion-report.json"),
  JSON.stringify(reportOut, null, 2) + "\n");
console.log(JSON.stringify(totals, null, 2));
