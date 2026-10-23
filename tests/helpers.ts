import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../src/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, '..');

export interface RunningServer {
  server: http.Server;
  port: number;
  baseUrl: string;
  close: () => Promise<void>;
}

/** Start the real HTTP server on an ephemeral port. */
export function startServer(rootDir: string = ROOT_DIR): Promise<RunningServer> {
  const server = createServer(rootDir);
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('no address'));
        return;
      }
      resolve({
        server,
        port: addr.port,
        baseUrl: `http://127.0.0.1:${addr.port}`,
        close: () => new Promise<void>((r) => server.close(() => r())),
      });
    });
  });
}

export async function postJson(url: string, body: unknown): Promise<{ status: number; json: any }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json() };
}

export interface RecordedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  rawBody?: string;
}

/** A fetch-compatible fake that records requests and replays canned responses. */
export function makeFakeFetch(
  handler: (req: RecordedRequest) => { status?: number; body: unknown },
): { fakeFetch: typeof fetch; requests: RecordedRequest[] } {
  const requests: RecordedRequest[] = [];
  const fakeFetch = (async (input: any, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = (init?.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET') ?? 'GET') as string;
    const headers: Record<string, string> = {};
    const rawHeaders = (init?.headers ?? (typeof input === 'object' && 'headers' in input ? input.headers : {})) as
      | Record<string, string>
      | string[][];
    if (Array.isArray(rawHeaders)) {
      for (const [k, v] of rawHeaders) headers[k.toLowerCase()] = v;
    } else {
      for (const [k, v] of Object.entries(rawHeaders ?? {})) headers[k.toLowerCase()] = String(v);
    }
    const rawBody = typeof init?.body === 'string' ? init.body : undefined;
    let body: unknown;
    try {
      body = rawBody ? JSON.parse(rawBody) : undefined;
    } catch {
      body = rawBody;
    }
    const rec: RecordedRequest = { url, method: method.toUpperCase(), headers, body, rawBody };
    requests.push(rec);
    const canned = handler(rec);
    return new Response(JSON.stringify(canned.body), {
      status: canned.status ?? 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { fakeFetch, requests };
}
