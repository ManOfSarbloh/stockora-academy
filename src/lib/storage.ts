/**
 * The only place that touches localStorage. Every key is prefixed with "stockora-".
 * Reads and writes never throw: private windows or blocked storage just fall back to defaults.
 */
export const STORAGE_PREFIX = 'stockora-';

function store(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = store()?.getItem(STORAGE_PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    const s = store();
    if (!s) return false;
    s.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string): void {
  try {
    store()?.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}
