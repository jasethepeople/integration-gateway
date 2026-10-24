// Small shared helpers for mirrored external components. No Pipedream imports.
import type { CanonicalEvent } from "./_types.ts";

export function uuid(): string {
  // crypto.randomUUID is available on Node 20+, fall back defensively.
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function canonicalEvent(
  sourceKey: string,
  topic: string,
  data: Record<string, unknown>,
  meta?: Record<string, unknown>,
): CanonicalEvent {
  return {
    id: uuid(),
    source: sourceKey,
    topic,
    timestamp: new Date().toISOString(),
    data,
    meta,
  };
}

/** Props passed to a component run are the event payload (a plain object). */
export function propsOf(event: unknown): Record<string, unknown> {
  if (event && typeof event === "object" && !Array.isArray(event)) {
    return event as Record<string, unknown>;
  }
  return {};
}

/** Assert a fetch response is 2xx, else throw with response body for context. */
export async function assertOk(res: Response, what: string): Promise<void> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${what} failed: HTTP ${res.status} ${res.statusText} — ${body.slice(0, 500)}`);
  }
}
