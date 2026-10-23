import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { postJson, startServer, type RunningServer, ROOT_DIR } from './helpers.js';

let srv: RunningServer;

beforeAll(async () => {
  // Keep the gateway store out of the repo during tests.
  const dir = await mkdtemp(path.join(tmpdir(), 'igw-router-'));
  process.env.STORE_FILE = path.join(dir, 'store.json');
  srv = await startServer();
});

afterAll(async () => {
  await srv.close();
});

describe('router / HTTP API (real server, ephemeral port)', () => {
  it('GET /health → {ok:true}', async () => {
    const res = await fetch(`${srv.baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('GET /api/v1/registry lists components with usable targets', async () => {
    const res = await fetch(`${srv.baseUrl}/api/v1/registry`);
    const body = (await res.json()) as any;
    expect(body.ok).toBe(true);
    expect(body.count).toBeGreaterThanOrEqual(11);
    const targets = body.components.map((c: any) => c.target);
    expect(targets).toContain('native/echo');
    expect(targets).toContain('external/github/get-repository');
  });

  it('POST /api/v1/execute native/echo → ok:true and echoes the event', async () => {
    const { status, json } = await postJson(`${srv.baseUrl}/api/v1/execute`, {
      target: 'native/echo',
      event: { hello: 'world', n: 42 },
    });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.target).toBe('native/echo');
    expect(json.result).toEqual({ echo: { hello: 'world', n: 42 } });
    expect(json.attempts).toBe(1);
    expect(typeof json.durationMs).toBe('number');
  });

  it('POST /api/v1/execute with unknown target → ok:false, server survives', async () => {
    const { status, json } = await postJson(`${srv.baseUrl}/api/v1/execute`, {
      target: 'external/github/does-not-exist',
    });
    expect(status).toBe(200);
    expect(json.ok).toBe(false);
    expect(json.error.message).toMatch(/not found/);

    // server is still healthy after the error
    const health = (await (await fetch(`${srv.baseUrl}/health`)).json()) as any;
    expect(health.ok).toBe(true);
  });

  it('POST /api/v1/execute with failing component → ok:false with error captured', async () => {
    // slack post-message without auth token throws before any HTTP call
    const { json } = await postJson(`${srv.baseUrl}/api/v1/execute`, {
      target: 'external/slack/post-message',
      event: { channel: 'C123', text: 'hi' },
      retry: { attempts: 1 },
    });
    expect(json.ok).toBe(false);
    expect(json.error.message).toMatch(/access_token is required/);
  });

  it('rejects malformed JSON body without crashing', async () => {
    const res = await fetch(`${srv.baseUrl}/api/v1/execute`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    });
    expect(res.status).toBe(400);
    expect(((await res.json()) as any).ok).toBe(false);
  });
});

describe('retry pipeline (real loader + router + withRetry)', () => {
  it('component throwing N-1 times succeeds on attempt N; attempts reflected in response', async () => {
    // Build a throwaway registry root with a flaky native component.
    const root = await mkdtemp(path.join(tmpdir(), 'igw-retry-'));
    const compDir = path.join(root, 'registry', 'native', 'flaky');
    await mkdir(compDir, { recursive: true });
    await writeFile(
      path.join(compDir, 'component.json'),
      JSON.stringify({
        key: 'native_flaky',
        name: 'Flaky',
        description: 'throws twice, succeeds on 3rd attempt',
        type: 'action',
        version: '1.0.0',
      }),
    );
    await writeFile(
      path.join(compDir, 'index.ts'),
      `export default {
  def: { key: 'native_flaky', name: 'Flaky', description: '', type: 'action', version: '1.0.0' },
  async run(ctx: any, event: any) {
    const key = 'calls:' + ((event && event.runId) || 'default');
    const calls = ((await ctx.store.get(key)) ?? 0) + 1;
    await ctx.store.set(key, calls);
    const succeedOn = (event && event.succeedOn) || 3;
    if (calls < succeedOn) throw new Error('boom attempt ' + calls);
    return { ok: true, calls };
  },
};
`,
    );

    const { Router } = await import('../src/router.js');
    const router = new Router(root);

    // N-1 = 2 failures, success on attempt 3
    const res = await router.execute({
      target: 'native/flaky',
      event: { succeedOn: 3 },
      retry: { attempts: 3, backoffMs: 1 },
    });
    expect(res.ok).toBe(true);
    expect(res.result).toEqual({ ok: true, calls: 3 });
    expect(res.attempts).toBe(3);

    // exhaust retries → failure response still reports attempts
    const res2 = await router.execute({
      target: 'native/flaky',
      event: { succeedOn: 99, runId: 'exhaust' },
      retry: { attempts: 2, backoffMs: 1 },
    });
    expect(res2.ok).toBe(false);
    expect(res2.attempts).toBe(2);
    expect(res2.error?.message).toMatch(/boom attempt 2/);
  });
});
