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

/** Every stored entry of this site, as raw strings (for progress backups). */
export function readAllRaw(): [string, string][] {
  const s = store();
  if (!s) return [];
  const out: [string, string][] = [];
  try {
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) out.push([k, s.getItem(k) ?? '']);
    }
  } catch {
    /* ignore */
  }
  return out;
}

/** Replace all of this site's stored entries with `data` (full keys, raw strings). False if storage is blocked. */
export function replaceAllRaw(data: Record<string, string>): boolean {
  const s = store();
  if (!s) return false;
  try {
    for (const [k] of readAllRaw()) s.removeItem(k);
    for (const [k, v] of Object.entries(data)) if (k.startsWith(STORAGE_PREFIX)) s.setItem(k, v);
    return true;
  } catch {
    return false;
  }
}
