/**
 * A tiny request cache for the dashboard, so the server is only asked for the same data once:
 *  - data that was already loaded is served from memory (no request) until it is a few minutes old;
 *  - if the same request is already on its way, callers share it instead of sending a second one;
 *  - after a change the dashboard makes itself (e.g. confirming a booking) the affected entries are updated or dropped,
 *    so nothing needs to be re-fetched just to see our own change;
 *  - everything is cleared on sign-in / sign-out, so one session's data is never shown to another.
 * It lives in memory only (never saved to disk), so a page reload starts fresh.
 */

/** How long loaded data counts as fresh. New bookings from the website appear after this, or on "Refresh". */
export const FRESH_FOR_MS = 5 * 60_000;

interface Entry {
  value: unknown;
  at: number;
}

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

export function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < FRESH_FOR_MS) return Promise.resolve(hit.value as T);

  const running = inflight.get(key);
  if (running) return running as Promise<T>;

  const request = load()
    .then((value) => {
      // only keep it if nobody cleared the cache while it was loading (e.g. the user signed out)
      if (inflight.get(key) === request) store.set(key, { value, at: Date.now() });
      return value;
    })
    .finally(() => {
      if (inflight.get(key) === request) inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

/** Rewrites (or, when `fn` returns undefined, removes) every cached entry whose key starts with `prefix`. */
export function updateCached<T>(prefix: string, fn: (key: string, value: T) => T | undefined): void {
  for (const [key, entry] of store) {
    if (!key.startsWith(prefix)) continue;
    const next = fn(key, entry.value as T);
    if (next === undefined) store.delete(key);
    else store.set(key, { value: next, at: entry.at });
  }
}

/** Forgets entries so the next read asks the server again. No argument = everything that matches `match`. */
export function dropCached(match: (key: string) => boolean): void {
  for (const key of [...store.keys()]) if (match(key)) store.delete(key);
  for (const key of [...inflight.keys()]) if (match(key)) inflight.delete(key);
}

export function clearCache(): void {
  store.clear();
  inflight.clear();
}
