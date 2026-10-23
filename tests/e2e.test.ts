import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import Ajv2020Module from 'ajv/dist/2020.js';
import addFormatsModule from 'ajv-formats';
import type { ValidateFunction } from 'ajv';

// CJS interop under NodeNext: default export may be double-wrapped.
const Ajv2020 = ((Ajv2020Module as any).default ?? Ajv2020Module) as any;
const addFormats = ((addFormatsModule as any).default ?? addFormatsModule) as any;
import { beforeAll, describe, expect, it } from 'vitest';
import { Router } from '../src/router.js';
import type { CanonicalEvent } from '../src/types.js';
import { makeFakeFetch, ROOT_DIR, startServer, postJson, type RunningServer } from './helpers.js';

let storeDir: string;
let validateCanonical: ValidateFunction;

beforeAll(async () => {
  storeDir = await mkdtemp(path.join(tmpdir(), 'igw-e2e-'));
  process.env.STORE_FILE = path.join(storeDir, 'store.json');

  const schema = JSON.parse(
    await readFile(path.join(ROOT_DIR, 'schemas', 'canonical-event.schema.json'), 'utf8'),
  );
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  validateCanonical = ajv.compile(schema);
});

const ISSUES_FIXTURE = [
  {
    id: 1001,
    number: 7,
    title: 'Bug: loader crashes on empty registry',
    state: 'open',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 1002,
    number: 8,
    title: 'Feature: add stripe source',
    state: 'open',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
  {
    id: 1003,
    number: 9,
    title: 'PR that must be filtered out',
    state: 'open',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-06T00:00:00Z',
    pull_request: { url: 'https://api.github.com/pr/9' },
  },
];

describe('e2e: external github source → event bus → native transform chain', () => {
  it('github new-or-updated-issue emits CanonicalEvents on the bus (httpOverride fixture)', async () => {
    const router = new Router(ROOT_DIR);
    const { fakeFetch, requests } = makeFakeFetch(() => ({ body: ISSUES_FIXTURE }));

    const received: CanonicalEvent[] = [];
    router.eventBus.subscribe('github.new_or_updated_issue', (p) => {
      received.push(p as CanonicalEvent);
    });

    const res = await router.execute({
      target: 'external/github/new-or-updated-issue',
      event: { repoFullname: 'octocat/Hello-World' },
      config: { httpOverride: fakeFetch },
      retry: { attempts: 1 },
    });

    expect(res.ok).toBe(true);
    expect((res.result as any).emitted).toBe(2); // PR filtered out
    expect((res.result as any).total).toBe(2);

    // source hit the real GitHub REST shape
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toMatch(
      /^https:\/\/api\.github\.com\/repos\/octocat\/Hello-World\/issues\?/,
    );
    expect(requests[0].headers['accept']).toBe('application/vnd.github+json');

    // CanonicalEvents landed on the bus, oldest first
    expect(received).toHaveLength(2);
    expect(received[0].data.title).toBe('Bug: loader crashes on empty registry');
    expect(received[1].data.title).toBe('Feature: add stripe source');

    // each emitted event validates against the canonical-event JSON schema
    for (const evt of received) {
      expect(validateCanonical(evt), JSON.stringify(validateCanonical.errors)).toBe(true);
      expect(evt.source).toBe('github-new-or-updated-issue');
      expect(evt.topic).toBe('github.new_or_updated_issue');
    }

    // native/transform consumes one emitted event: map its raw payload to a
    // new CanonicalEvent and assert transform re-emits on the bus.
    const transformed: CanonicalEvent[] = [];
    router.eventBus.subscribe('github.issue_transformed', (p) => {
      transformed.push(p as CanonicalEvent);
    });

    const tRes = await router.execute({
      target: 'native/transform',
      event: {
        payload: received[0].data,
        mapping: { source: received[0].source, topic: 'github.issue_transformed' },
      },
    });
    expect(tRes.ok).toBe(true);
    const canonical = tRes.result as CanonicalEvent;
    expect(canonical.topic).toBe('github.issue_transformed');
    expect(canonical.data.title).toBe('Bug: loader crashes on empty registry');
    expect(validateCanonical(canonical)).toBe(true);
    expect(transformed).toHaveLength(1);
    expect(transformed[0].id).toBe(canonical.id);

    // dedupe cursor: second poll with same fixture emits nothing new
    const res2 = await router.execute({
      target: 'external/github/new-or-updated-issue',
      event: { repoFullname: 'octocat/Hello-World' },
      config: { httpOverride: fakeFetch },
      retry: { attempts: 1 },
    });
    expect(res2.ok).toBe(true);
    expect((res2.result as any).emitted).toBe(0);
    expect(received).toHaveLength(2);
  });
});

describe('e2e: github get-repository action (real network, fixture fallback)', () => {
  it('runs without Pipedream cloud', async () => {
    const router = new Router(ROOT_DIR);

    // Try the real public API first (no auth).
    let res = await router.execute({
      target: 'external/github/get-repository',
      event: { repoFullname: 'PipedreamHQ/pipedream' },
      retry: { attempts: 1 },
    });
    let via = 'live';

    if (!res.ok) {
      // No/limited network → fall back to httpOverride fixture.
      via = 'fixture';
      const { fakeFetch, requests } = makeFakeFetch(() => ({
        body: {
          full_name: 'PipedreamHQ/pipedream',
          description: 'fixture repo',
          stargazers_count: 1,
          default_branch: 'master',
        },
      }));
      res = await router.execute({
        target: 'external/github/get-repository',
        event: { repoFullname: 'PipedreamHQ/pipedream' },
        config: { httpOverride: fakeFetch },
        retry: { attempts: 1 },
      });
      expect(requests[0].url).toBe('https://api.github.com/repos/PipedreamHQ/pipedream');
      expect(requests[0].method).toBe('GET');
    }

    expect(res.ok).toBe(true);
    const repo = res.result as any;
    expect(repo.full_name).toBe('PipedreamHQ/pipedream');
    console.log(`[e2e] get-repository via ${via} API`);
  });
});

describe('e2e: slack post-message action with httpOverride (request shape)', () => {
  it('posts to chat.postMessage with bearer auth and JSON body', async () => {
    const router = new Router(ROOT_DIR);
    const { fakeFetch, requests } = makeFakeFetch(() => ({
      body: { ok: true, channel: 'C1234567890', ts: '1700000000.000001' },
    }));

    const res = await router.execute({
      target: 'external/slack/post-message',
      auth: { access_token: 'xoxb-test-token' },
      event: { channel: '#general', text: 'hello from *tests*' },
      config: { httpOverride: fakeFetch },
      retry: { attempts: 1 },
    });

    expect(res.ok).toBe(true);
    expect((res.result as any).ok).toBe(true);
    expect((res.result as any).ts).toBe('1700000000.000001');

    expect(requests).toHaveLength(1);
    const req = requests[0];
    expect(req.url).toBe('https://slack.com/api/chat.postMessage');
    expect(req.method).toBe('POST');
    expect(req.headers['authorization']).toBe('Bearer xoxb-test-token');
    expect(req.headers['content-type']).toBe('application/json; charset=utf-8');
    // '#' stripped by normalizeChannel; mrkdwn/unfurl defaults applied
    expect(req.body).toMatchObject({
      channel: 'general',
      text: 'hello from *tests*',
      mrkdwn: true,
      unfurl_links: true,
      unfurl_media: true,
    });
  });

  it('stripe list-customers sends bearer auth and hits /v1/customers', async () => {
    const router = new Router(ROOT_DIR);
    const { fakeFetch, requests } = makeFakeFetch(() => ({
      body: { object: 'list', data: [{ id: 'cus_123', email: 'a@b.c' }], has_more: false },
    }));

    const res = await router.execute({
      target: 'external/stripe/list-customers',
      auth: { api_key: 'sk_test_123', access_token: 'sk_test_123' },
      event: { limit: 1 },
      config: { httpOverride: fakeFetch },
      retry: { attempts: 1 },
    });

    expect(res.ok).toBe(true);
    const customers = res.result as any[];
    expect(customers[0].id).toBe('cus_123');
    expect(requests[0].url).toMatch(/^https:\/\/api\.stripe\.com\/v1\/customers/);
    expect(requests[0].headers['authorization']).toBe('Bearer sk_test_123');
  });
});

describe('e2e: full HTTP round-trip through the real server', () => {
  it('execute native/transform over HTTP emits a CanonicalEvent result', async () => {
    const srv: RunningServer = await startServer();
    try {
      const { json } = await postJson(`${srv.baseUrl}/api/v1/execute`, {
        target: 'native/transform',
        event: {
          payload: { number: 7, title: 'over http' },
          mapping: { source: 'github-new-or-updated-issue', topic: 'github.http_test' },
        },
      });
      expect(json.ok).toBe(true);
      expect(validateCanonical(json.result)).toBe(true);
      expect(json.result.topic).toBe('github.http_test');
      expect(json.result.data.title).toBe('over http');
    } finally {
      await srv.close();
    }
  });
});
