/**
 * A2A (Agent2Agent) protocol types — the subset this gateway speaks.
 *
 * Shapes follow the A2A specification (v0.3): AgentCard, AgentSkill,
 * Task, Message, Part, Artifact, and JSON-RPC 2.0 envelopes. The
 * gateway is deliberately honest in its card: no streaming, no push
 * notifications — tasks execute to completion inside `message/send`.
 */

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples?: string[];
  inputModes?: string[];
  outputModes?: string[];
  /** Gateway extension: JSON Schema for the skill's input (the
   *  component's propsSchema), when known. Not part of the strict
   *  A2A AgentSkill, but cards are descriptive documents and
   *  consumers that don't know the field may ignore it. */
  inputSchema?: Record<string, unknown>;
}

export interface AgentCard {
  protocolVersion: string;
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
    stateTransitionHistory: boolean;
  };
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: AgentSkill[];
}

export type TaskState =
  | 'submitted'
  | 'working'
  | 'input-required'
  | 'completed'
  | 'failed'
  | 'canceled';

export interface TaskStatus {
  state: TaskState;
  timestamp: string;
  message?: A2aMessage;
}

export interface DataPart {
  kind: 'data';
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface TextPart {
  kind: 'text';
  text: string;
}

export type Part = DataPart | TextPart | { kind: string; [k: string]: unknown };

export interface A2aMessage {
  kind: 'message';
  messageId: string;
  role: 'user' | 'agent';
  parts: Part[];
  contextId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
}

export interface Artifact {
  artifactId: string;
  name?: string;
  parts: Part[];
}

export interface A2aTask {
  kind: 'task';
  id: string;
  contextId: string;
  status: TaskStatus;
  artifacts: Artifact[];
  metadata?: Record<string, unknown>;
}

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcSuccess {
  jsonrpc: '2.0';
  id: string | number | null;
  result: unknown;
}

export interface JsonRpcFailure {
  jsonrpc: '2.0';
  id: string | number | null;
  error: { code: number; message: string; data?: unknown };
}

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcFailure;
