import { randomUUID } from 'node:crypto';
import type { ExecuteRequest, ExecuteResponse } from '../types.js';
import type {
  A2aMessage,
  A2aTask,
  JsonRpcRequest,
  JsonRpcResponse,
  Part,
} from './types.js';

export interface A2aAgentDeps {
  /** The gateway's own executor (Router.execute). A2A adds a protocol
   *  front door; it does not re-implement execution. */
  execute: (req: ExecuteRequest) => Promise<ExecuteResponse>;
}

const now = (): string => new Date().toISOString();

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Pull an ExecuteRequest out of an A2A message: a data part whose
 *  data carries a string `target`, or message.metadata.target. */
export function executeRequestFromMessage(message: A2aMessage): ExecuteRequest | undefined {
  const parts: Part[] = Array.isArray(message.parts) ? message.parts : [];
  for (const part of parts) {
    if (part.kind === 'data' && isRecord((part as { data?: unknown }).data)) {
      const data = (part as { data: Record<string, unknown> }).data;
      if (typeof data.target === 'string') {
        return {
          target: data.target,
          event: data.event,
          auth: isRecord(data.auth) ? (data.auth as Record<string, string>) : undefined,
          config: isRecord(data.config) ? data.config : undefined,
        };
      }
    }
  }
  const metaTarget = message.metadata?.target;
  if (typeof metaTarget === 'string') {
    return { target: metaTarget, event: message.metadata?.event };
  }
  return undefined;
}

/**
 * A2aAgent: a minimal, honest A2A endpoint.
 *
 * - `message/send` executes synchronously to a final state (the card
 *   advertises streaming: false). The task is stored, so `tasks/get`
 *   and `tasks/cancel` behave per spec for anything addressed later.
 * - A message with no addressable target yields an `input-required`
 *   task explaining the expected data part — the protocol's own way
 *   of asking for the missing input.
 * - Tasks live in memory only; a restart forgets them. Documented in
 *   docs/A2A.md — persistence is future work, not a silent promise.
 */
export class A2aAgent {
  private tasks = new Map<string, A2aTask>();

  constructor(private deps: A2aAgentDeps) {}

  getTask(id: string): A2aTask | undefined {
    return this.tasks.get(id);
  }

  private store(task: A2aTask): A2aTask {
    this.tasks.set(task.id, task);
    return task;
  }

  private newTask(contextId: string, state: A2aTask['status']['state']): A2aTask {
    return {
      kind: 'task',
      id: randomUUID(),
      contextId,
      status: { state, timestamp: now() },
      artifacts: [],
    };
  }

  async handleMessageSend(params: Record<string, unknown>): Promise<A2aTask> {
    const message = params.message as A2aMessage | undefined;
    if (!isRecord(message) || !Array.isArray(message.parts)) {
      const task = this.newTask(randomUUID(), 'input-required');
      task.status.message = {
        kind: 'message',
        messageId: randomUUID(),
        role: 'agent',
        parts: [
          {
            kind: 'text',
            text: 'message/send requires params.message with a parts array. Include a data part: {"target": "external/<app>/<component>", "event": {...}, "auth": {...}}.',
          },
        ],
      };
      return this.store(task);
    }

    const contextId =
      typeof message.contextId === 'string' && message.contextId
        ? message.contextId
        : randomUUID();

    const req = executeRequestFromMessage(message);
    if (!req) {
      const task = this.newTask(contextId, 'input-required');
      task.status.message = {
        kind: 'message',
        messageId: randomUUID(),
        role: 'agent',
        parts: [
          {
            kind: 'text',
            text: 'No target found. Send a data part whose data is {"target": "external/<app>/<component>" or "native/<module>", "event": <payload>, "auth": {...}, "config": {...}}, or set message.metadata.target.',
          },
        ],
      };
      return this.store(task);
    }

    const task = this.newTask(contextId, 'working');
    this.store(task);
    const response = await this.deps.execute(req);
    task.artifacts = [
      {
        artifactId: randomUUID(),
        name: 'execute-response',
        parts: [
          {
            kind: 'data',
            data: {
              ok: response.ok,
              target: response.target,
              result: response.result ?? null,
              error: response.error ?? null,
              durationMs: response.durationMs,
              attempts: response.attempts,
            },
          },
        ],
      },
    ];
    task.status = { state: response.ok ? 'completed' : 'failed', timestamp: now() };
    return task;
  }

  handleTaskCancel(id: string): A2aTask | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    if (task.status.state === 'submitted' || task.status.state === 'working' || task.status.state === 'input-required') {
      task.status = { state: 'canceled', timestamp: now() };
    }
    return task;
  }

  /** JSON-RPC 2.0 dispatch. Always resolves; protocol errors are
   *  returned in the envelope, never thrown. */
  async handleRpc(body: unknown): Promise<JsonRpcResponse> {
    if (!isRecord(body) || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
      return {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Invalid Request: expected a JSON-RPC 2.0 object with a method.' },
      };
    }
    const req = body as unknown as JsonRpcRequest;
    const id = req.id ?? null;
    const params = isRecord(req.params) ? req.params : {};
    try {
      switch (req.method) {
        case 'message/send': {
          const task = await this.handleMessageSend(params);
          return { jsonrpc: '2.0', id, result: task };
        }
        case 'tasks/get': {
          const taskId = typeof params.id === 'string' ? params.id : '';
          const task = this.getTask(taskId);
          if (!task) {
            return { jsonrpc: '2.0', id, error: { code: -32001, message: `Task not found: ${taskId || '(missing id)'}` } };
          }
          return { jsonrpc: '2.0', id, result: task };
        }
        case 'tasks/cancel': {
          const taskId = typeof params.id === 'string' ? params.id : '';
          const task = this.handleTaskCancel(taskId);
          if (!task) {
            return { jsonrpc: '2.0', id, error: { code: -32001, message: `Task not found: ${taskId || '(missing id)'}` } };
          }
          return { jsonrpc: '2.0', id, result: task };
        }
        default:
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Method not found: ${req.method}. Supported: message/send, tasks/get, tasks/cancel.` },
          };
      }
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
      };
    }
  }
}
