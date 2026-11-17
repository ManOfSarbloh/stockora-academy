/**
 * Lesson notes: a private note per lesson, stored only in the visitor's browser (stockora-notes).
 * The pure functions are unit-tested; loadNotes/saveNotes wrap them with storage.
 *
 * Notes are keyed by lesson key ("<category-slug>/<lesson-slug>"), so the same note shows in every
 * language version of the lesson.
 */
import { readJSON, writeJSON } from './storage';

export const NOTES_KEY = 'notes';
/** Longest note kept (characters); the text box has the same limit. */
export const NOTE_MAX = 5000;

export interface Note {
  text: string;
  /** Lesson title and link when the note was last saved (fallback when the lesson list does not know the key). */
  title: string;
  href: string;
  /** ISO date and time of the last change. */
  updated: string;
}

export interface NotesState {
  version: 1;
  notes: Record<string, Note>;
}

export const emptyNotes = (): NotesState => ({ version: 1, notes: {} });

const isStr = (v: unknown): v is string => typeof v === 'string';

/** Accept only well-formed notes from storage or a restored backup; anything else is dropped. */
export function normaliseNotes(raw: unknown): NotesState {
  const out = emptyNotes();
  if (!raw || typeof raw !== 'object') return out;
  const notes = (raw as { notes?: unknown }).notes;
  if (!notes || typeof notes !== 'object') return out;
  for (const [key, n] of Object.entries(notes as Record<string, unknown>)) {
    if (!n || typeof n !== 'object') continue;
    const { text, title, href, updated } = n as Record<string, unknown>;
    if (!isStr(text) || !text.trim() || !isStr(updated)) continue;
    out.notes[key] = {
      text: text.slice(0, NOTE_MAX),
      title: isStr(title) ? title : key,
      href: isStr(href) ? href : '',
      updated,
    };
  }
  return out;
}

/** Save (or, for empty text, delete) the note of one lesson. Returns a new state. */
export function setNote(
  state: NotesState,
  key: string,
  note: { text: string; title: string; href: string },
  now = new Date(),
): NotesState {
  const notes = { ...state.notes };
  const text = note.text.slice(0, NOTE_MAX);
  if (!text.trim()) delete notes[key];
  else notes[key] = { text, title: note.title, href: note.href, updated: now.toISOString() };
  return { ...state, notes };
}

export function deleteNote(state: NotesState, key: string): NotesState {
  const notes = { ...state.notes };
  delete notes[key];
  return { ...state, notes };
}

/** Notes as a list, most recently changed first. */
export function sortedNotes(state: NotesState): (Note & { key: string })[] {
  return Object.entries(state.notes)
    .map(([key, n]) => ({ key, ...n }))
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.key.localeCompare(b.key));
}

export const loadNotes = (): NotesState => normaliseNotes(readJSON<unknown>(NOTES_KEY, null));
export const saveNotes = (state: NotesState): boolean => writeJSON(NOTES_KEY, state);
