type Handler = (payload: unknown) => unknown | Promise<unknown>;

/**
 * In-process async event bus.
 * subscribe(topic, handler); emit awaits all handlers.
 * Handler errors are caught and logged without breaking the emitter.
 */
export class EventBus {
  private handlers = new Map<string, Set<Handler>>();

  subscribe(topic: string, handler: Handler): () => void {
    let set = this.handlers.get(topic);
    if (!set) {
      set = new Set();
      this.handlers.set(topic, set);
    }
    set.add(handler);
    return () => {
      set!.delete(handler);
      if (set!.size === 0) this.handlers.delete(topic);
    };
  }

  async emit(topic: string, payload: unknown): Promise<void> {
    const set = this.handlers.get(topic);
    if (!set || set.size === 0) return;
    await Promise.all(
      [...set].map(async (handler) => {
        try {
          await handler(payload);
        } catch (err) {
          // Never let a subscriber crash the emitter.
          console.error(
            JSON.stringify({
              level: 'error',
              msg: 'event-bus handler error',
              topic,
              error: err instanceof Error ? err.message : String(err),
            }),
          );
        }
      }),
    );
  }

  /** testing/introspection helper */
  listenerCount(topic: string): number {
    return this.handlers.get(topic)?.size ?? 0;
  }
}

export const bus = new EventBus();
