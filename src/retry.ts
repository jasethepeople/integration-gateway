export interface RetryOptions {
  /** total attempts including the first try (default 3) */
  attempts?: number;
  /** initial backoff in ms; doubled after each failure (default 250) */
  backoffMs?: number;
}

export interface RetryResult<T> {
  value: T;
  attempts: number;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Run `fn` with exponential backoff. Throws the last error after all
 * attempts are exhausted. `attempts` in the result counts actual tries made.
 */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<RetryResult<T>> {
  const maxAttempts = Math.max(1, opts.attempts ?? 3);
  const baseBackoff = Math.max(0, opts.backoffMs ?? 250);
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await fn();
      return { value, attempts: attempt };
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await sleep(baseBackoff * 2 ** (attempt - 1));
      }
    }
  }
  const err = lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  (err as Error & { attempts?: number }).attempts = maxAttempts;
  throw err;
}
