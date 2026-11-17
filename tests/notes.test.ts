import { describe, expect, it } from 'vitest';
import { deleteNote, emptyNotes, normaliseNotes, NOTE_MAX, setNote, sortedNotes } from '../src/lib/notes';

const lesson = { title: 'What a stock is', href: '/learn/foundations/what-is-a-stock/' };

describe('lesson notes', () => {
  it('saves a note with the time of the change', () => {
    const s = setNote(emptyNotes(), 'foundations/what-is-a-stock', { text: 'Shares = ownership', ...lesson }, new Date('2026-11-16T10:00:00Z'));
    expect(s.notes['foundations/what-is-a-stock']).toEqual({ text: 'Shares = ownership', ...lesson, updated: '2026-11-16T10:00:00.000Z' });
  });

  it('deletes the note when the text is emptied', () => {
    let s = setNote(emptyNotes(), 'a/b', { text: 'x', ...lesson });
    s = setNote(s, 'a/b', { text: '   \n ', ...lesson });
    expect(s.notes).toEqual({});
    expect(deleteNote(setNote(emptyNotes(), 'a/b', { text: 'x', ...lesson }), 'a/b').notes).toEqual({});
  });

  it('cuts notes at the maximum length', () => {
    const s = setNote(emptyNotes(), 'a/b', { text: 'x'.repeat(NOTE_MAX + 50), ...lesson });
    expect(s.notes['a/b'].text).toHaveLength(NOTE_MAX);
  });

  it('does not change the previous state', () => {
    const a = emptyNotes();
    setNote(a, 'a/b', { text: 'x', ...lesson });
    expect(a.notes).toEqual({});
  });

  it('lists notes newest first', () => {
    let s = setNote(emptyNotes(), 'a/old', { text: '1', ...lesson }, new Date('2026-11-01T00:00:00Z'));
    s = setNote(s, 'a/new', { text: '2', ...lesson }, new Date('2026-11-10T00:00:00Z'));
    expect(sortedNotes(s).map((n) => n.key)).toEqual(['a/new', 'a/old']);
  });

  it('keeps only well-formed notes from storage or backups', () => {
    const s = normaliseNotes({
      version: 1,
      notes: {
        'a/ok': { text: 'fine', title: 'T', href: '/x/', updated: '2026-11-16T10:00:00Z' },
        'a/empty': { text: '  ', updated: '2026-11-16T10:00:00Z' },
        'a/bad': { text: 42, updated: 'x' },
        'a/no-title': { text: 'y', updated: '2026-11-16T10:00:00Z' },
        'a/null': null,
      },
    });
    expect(Object.keys(s.notes).sort()).toEqual(['a/no-title', 'a/ok']);
    expect(s.notes['a/no-title']).toMatchObject({ title: 'a/no-title', href: '' });
    expect(normaliseNotes(null)).toEqual(emptyNotes());
    expect(normaliseNotes('nonsense')).toEqual(emptyNotes());
  });
});
