/**
 * Learning progress and bookmarks, stored only in the visitor's browser.
 * The pure functions (no storage access) are unit-tested; the load/save helpers wrap them.
 *
 * A lesson key is "<category-slug>/<lesson-slug>", e.g. "foundations/what-is-a-stock".
 */
import { readJSON, writeJSON } from './storage';

export const PROGRESS_KEY = 'progress';
export const BOOKMARKS_KEY = 'bookmarks';

export interface ProgressState {
  version: 1;
  /** lesson key -> ISO date when it was marked done */
  done: Record<string, string>;
}

export interface Bookmark {
  key: string;
  title: string;
  href: string;
  addedAt: string;
}

export const emptyProgress = (): ProgressState => ({ version: 1, done: {} });

export function setDone(state: ProgressState, key: string, done: boolean, now = new Date()): ProgressState {
  const next = { ...state.done };
  if (done) next[key] = now.toISOString();
  else delete next[key];
  return { ...state, done: next };
}

export function countDone(state: ProgressState, keys: string[]): number {
  return keys.reduce((n, k) => n + (k in state.done ? 1 : 0), 0);
}

/** Whole-number percentage, 0 when there are no lessons. */
export function percentDone(state: ProgressState, keys: string[]): number {
  return keys.length ? Math.round((countDone(state, keys) / keys.length) * 100) : 0;
}

/** First lesson in learning-path order that is not done yet (undefined when everything is done). */
export function nextUnfinished(state: ProgressState, orderedKeys: string[]): string | undefined {
  return orderedKeys.find((k) => !(k in state.done));
}

export function toggleBookmark(list: Bookmark[], item: Omit<Bookmark, 'addedAt'>, now = new Date()): Bookmark[] {
  return list.some((b) => b.key === item.key)
    ? list.filter((b) => b.key !== item.key)
    : [{ ...item, addedAt: now.toISOString() }, ...list];
}

/** Accepts anything from storage and returns a valid state (old or corrupt data is ignored). */
export function normaliseProgress(raw: unknown): ProgressState {
  if (raw && typeof raw === 'object' && (raw as ProgressState).version === 1 && typeof (raw as ProgressState).done === 'object') {
    return { version: 1, done: { ...(raw as ProgressState).done } };
  }
  return emptyProgress();
}

export function normaliseBookmarks(raw: unknown): Bookmark[] {
  return Array.isArray(raw)
    ? raw.filter((b): b is Bookmark => !!b && typeof b.key === 'string' && typeof b.href === 'string' && typeof b.title === 'string')
    : [];
}

// ---- Browser helpers ----

export const loadProgress = () => normaliseProgress(readJSON(PROGRESS_KEY, null));
export const saveProgress = (s: ProgressState) => writeJSON(PROGRESS_KEY, s);
export const loadBookmarks = () => normaliseBookmarks(readJSON(BOOKMARKS_KEY, []));
export const saveBookmarks = (b: Bookmark[]) => writeJSON(BOOKMARKS_KEY, b);

/** Fired on window after progress or bookmarks change, so other widgets on the page can update. */
export const CHANGE_EVENT = 'stockora:progress-change';
export const notifyChange = () => window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
