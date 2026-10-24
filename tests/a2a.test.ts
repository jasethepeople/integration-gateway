import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildAppCards, buildGatewayCard } from '../src/a2a/card.js';
import type { RegistryScan } from '../src/loader.js';
import { startServer, type RunningServer } from './helpers.js';

const fakeScan: RegistryScan = {
  scannedDirs: 3,
  components: [
    {
      target: 'external/envoy/list-visitors',
      kind: 'external',
      app: 'envoy',
      key: 'envoy_list-visitors',
      name: 'List Visitors',
      description: 'Lists visitors.',
      type: 'action',
      version: '1.0.0',
    },
    {
      target: 'native/echo',
      kind: 'native',
      app: 'echo',
      key: 'native_echo',
      name: 'Native Echo',
      description: 'Echoes.',
      type: 'action',
      version: '1.0.0',
    },
  ],
};

describe('a2a card building', () => {
  it('maps every registry component to a skill addressed by its target', () => {
    const card = buildGatewayCard(fakeScan, 'http://x/a2a');
    expect(card.protocolVersion).toBe('0.3.0');
    expect(card.capabilities.streaming).toBe(false);
    expect(card.skills.map((s) => s.id)).toEqual(['external/envoy/list-visitors', 'native/echo']);
    expect(card.skills[0].tags).toContain('envoy');
  });

  it('groups skills into per-app cards', () => {
    const cards = buildAppCards(fakeScan, () => 'http://x/a2a');
    expect([...cards.keys()].sort()).toEqual(['echo', 'envoy']);
    expect(cards.get('envoy')?.skills).toHaveLength(1);
  });
});

describe('a2a http endpoint', () => {
  let srv: RunningServer;

  beforeAll(async () => {
    srv = await startServer();
  });
  afterAll(async () => {
    await srv.close();
  });

  async function rpc(body: unknown): Promise<any> {
    const res = await fetch(`${srv.baseUrl}/a2a`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    expect(res.status).toBe(200);
    return res.json();
  }

  it('serves the gateway agent card at the well-known path', async () => {
    const res = await fetch(`${srv.baseUrl}/.well-known/agent-card.json`);
    expect(res.status).toBe(200);
    const card = (await res.json()) as any;
    expect(card.name).toBe('integration-gateway-a2a');
    expect(card.skills.length).toBeGreaterThan(1000);
    expect(card.skills.some((s: any) => s.id === 'native/echo')).toBe(true);
  }, 180_000);

  it('serves a per-app card', async () => {
    const res = await fetch(`${srv.baseUrl}/a2a/apps/echo/agent-card.json`);
    expect(res.status).toBe(200);
    const card = (await res.json()) as any;
    expect(card.skills.map((s: any) => s.id)).toContain('native/echo');
  }, 180_000);

  it('message/send executes a component and completes the task with an artifact', async () => {
    const reply = await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'message/send',
      params: {
        message: {
          kind: 'message',
          messageId: 'm1',
          role: 'user',
          parts: [
            {
              kind: 'data',
              data: { target: 'native/echo', event: { hello: 'a2a' } },
            },
          ],
        },
      },
    });
    const task = reply.result;
    expect(task.kind).toBe('task');
    expect(task.status.state).toBe('completed');
    const data = task.artifacts[0].parts[0].data;
    expect(data.ok).toBe(true);
    expect(data.result.echo).toEqual({ hello: 'a2a' });

    const got = await rpc({ jsonrpc: '2.0', id: 2, method: 'tasks/get', params: { id: task.id } });
    expect(got.result.id).toBe(task.id);
    expect(got.result.status.state).toBe('completed');
  });

  it('message/send without a target asks for input instead of failing', async () => {
    const reply = await rpc({
      jsonrpc: '2.0',
      id: 3,
      method: 'message/send',
      params: {
        message: {
          kind: 'message',
          messageId: 'm2',
          role: 'user',
          parts: [{ kind: 'text', text: 'do the thing' }],
        },
      },
    });
    expect(reply.result.status.state).toBe('input-required');
  });

  it('a failing component produces a failed task, not a crashed request', async () => {
    const reply = await rpc({
      jsonrpc: '2.0',
      id: 4,
      method: 'message/send',
      params: {
        message: {
          kind: 'message',
          messageId: 'm3',
          role: 'user',
          parts: [{ kind: 'data', data: { target: 'external/nope/nope' } }],
        },
      },
    });
    expect(reply.result.status.state).toBe('failed');
    expect(reply.result.artifacts[0].parts[0].data.ok).toBe(false);
  });

  it('unknown methods get a JSON-RPC method-not-found error', async () => {
    const reply = await rpc({ jsonrpc: '2.0', id: 5, method: 'tasks/list', params: {} });
    expect(reply.error.code).toBe(-32601);
  });
});
