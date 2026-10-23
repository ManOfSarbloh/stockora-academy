/**
 * Progress backups: everything the site keeps in localStorage (keys starting with "stockora-") as one
 * JSON file the visitor downloads, and can restore in another browser or on another device. The file
 * never leaves the visitor's device unless they move it themselves. Pure functions; the My learning
 * page does the reading, writing and downloading.
 */
export const BACKUP_FORMAT = 'stockora-academy-backup';
export const BACKUP_VERSION = 1;
/** Keys that are never backed up or restored (internal checks). */
const SKIP = new Set(['stockora-storage-test']);
const KEY = /^stockora-[a-z0-9-]{1,60}$/;
const MAX_CHARS = 2_000_000;

export interface Backup {
  format: typeof BACKUP_FORMAT;
  version: number;
  exported: string;
  data: Record<string, string>;
}

/** Keep only the site's own keys, as stored (raw strings). */
export function pickEntries(entries: Iterable<[string, string]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of entries) if (KEY.test(k) && !SKIP.has(k) && typeof v === 'string') out[k] = v;
  return out;
}

export function makeBackup(data: Record<string, string>, now: Date): Backup {
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exported: now.toISOString(), data: pickEntries(Object.entries(data)) };
}

/** File name such as "stockora-progress-2026-10-23.json". */
export const backupFileName = (now: Date) => `stockora-progress-${now.toISOString().slice(0, 10)}.json`;

export type ParseResult = { ok: true; data: Record<string, string> } | { ok: false; error: 'invalid' | 'empty' };

/** Check a backup file's text before anything is overwritten. */
export function parseBackup(text: string): ParseResult {
  if (typeof text !== 'string' || text.length > MAX_CHARS) return { ok: false, error: 'invalid' };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'invalid' };
  }
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'invalid' };
  const b = raw as Partial<Backup>;
  if (b.format !== BACKUP_FORMAT || typeof b.version !== 'number' || b.version > BACKUP_VERSION) return { ok: false, error: 'invalid' };
  if (!b.data || typeof b.data !== 'object' || Array.isArray(b.data)) return { ok: false, error: 'invalid' };
  const values = Object.entries(b.data as Record<string, unknown>);
  if (values.some(([k, v]) => !KEY.test(k) || typeof v !== 'string')) return { ok: false, error: 'invalid' };
  const data = pickEntries(values as [string, string][]);
  return Object.keys(data).length ? { ok: true, data } : { ok: false, error: 'empty' };
}
