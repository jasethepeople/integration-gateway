import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Router } from './router.js';
import { Loader } from './loader.js';
import type { RegistryScan } from './loader.js';
import type { ExecuteRequest } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, '..');

async function readBody(req: http.IncomingMessage, limit = 5 * 1024 * 1024): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = chunk as Buffer;
    size += buf.length;
    if (size > limit) throw new Error('request body too large');
    chunks.push(buf);
  }
  if (chunks.length === 0) return undefined;
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : undefined;
}

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

export function createServer(rootDir: string = ROOT_DIR): http.Server {
  const router = new Router(rootDir);
  const loader = new Loader(rootDir);

  // Lazy singletons: the registry walk is expensive with ~14k components,
  // so each result is computed once per server and reused.
  let registryScan: Promise<RegistryScan> | undefined;
  const getRegistryScan = (): Promise<RegistryScan> => {
    registryScan ??= loader.list();
    registryScan.catch(() => {
      registryScan = undefined;
    });
    return registryScan;
  };

  const externalDir = path.join(rootDir, 'registry', 'external');
  const manifestFile = path.join(externalDir, 'index.json');

  const manifestStale = async (): Promise<boolean> => {
    let indexStat;
    try {
      indexStat = await stat(manifestFile);
    } catch {
      return true; // missing
    }
    try {
      const dirs = await readdir(externalDir, { withFileTypes: true });
      for (const d of dirs) {
        if (!d.isDirectory() || d.name.startsWith('_')) continue;
        try {
          const m = await stat(path.join(externalDir, d.name, 'manifest.json'));
          if (m.mtimeMs > indexStat.mtimeMs) return true;
        } catch {
          /* app without manifest.json */
        }
      }
    } catch {
      /* external dir unreadable — serve what we have */
    }
    return false;
  };

  const regenerateManifest = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      const child = spawn(process.execPath, [path.join(rootDir, 'scripts', 'registry-manifest.mjs')], {
        stdio: 'inherit',
      });
      child.on('error', reject);
      child.on('exit', (code) =>
        code === 0 ? resolve() : reject(new Error(`registry-manifest.mjs exited with code ${code}`)),
      );
    });

  let manifestJson: Promise<string> | undefined;
  const getManifest = (): Promise<string> => {
    manifestJson ??= (async () => {
      if (await manifestStale()) await regenerateManifest();
      return readFile(manifestFile, 'utf8');
    })();
    manifestJson.catch(() => {
      manifestJson = undefined;
    });
    return manifestJson;
  };

  return http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        return sendJson(res, 200, { ok: true });
      }

      if (req.method === 'GET' && url.pathname === '/api/v1/registry') {
        const scan = await getRegistryScan();
        return sendJson(res, 200, { ok: true, count: scan.components.length, components: scan.components });
      }

      if (req.method === 'GET' && url.pathname === '/api/v1/manifest') {
        const raw = await getManifest();
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'content-length': Buffer.byteLength(raw),
        });
        return res.end(raw);
      }

      if (req.method === 'POST' && url.pathname === '/api/v1/execute') {
        let body: unknown;
        try {
          body = await readBody(req);
        } catch (err) {
          return sendJson(res, 400, {
            ok: false,
            error: { message: `invalid JSON body: ${err instanceof Error ? err.message : err}` },
          });
        }
        const response = await router.execute((body ?? {}) as ExecuteRequest);
        return sendJson(res, response.ok ? 200 : 200, response);
      }

      return sendJson(res, 404, { ok: false, error: { message: 'not found' } });
    } catch (err) {
      // Last-resort guard: the server must never crash on a request.
      console.error('unhandled request error:', err);
      return sendJson(res, 500, {
        ok: false,
        error: { message: err instanceof Error ? err.message : String(err) },
      });
    }
  });
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const port = Number(process.env.PORT ?? 3000);
  const server = createServer();
  server.listen(port, () => {
    console.log(`integration-gateway listening on http://localhost:${port}`);
  });
}
