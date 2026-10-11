import { describe, expect, it } from 'vitest';
import {
  countDone,
  emptyProgress,
  nextUnfinished,
  normaliseBookmarks,
  normaliseProgress,
  percentDone,
  setDone,
  toggleBookmark,
} from '../src/lib/progress';

const now = new Date('2026-10-11T10:00:00Z');

describe('progress', () => {
  it('marks and unmarks lessons without mutating the old state', () => {
    const a = emptyProgress();
    const b = setDone(a, 'foundations/what-is-a-stock', true, now);
    expect(a.done).toEqual({});
    expect(b.done).toEqual({ 'foundations/what-is-a-stock': '2026-10-11T10:00:00.000Z' });
    expect(setDone(b, 'foundations/what-is-a-stock', false).done).toEqual({});
  });

  it('counts and computes percentages', () => {
    const s = setDone(setDone(emptyProgress(), 'a', true), 'b', true);
    expect(countDone(s, ['a', 'b', 'c'])).toBe(2);
    expect(percentDone(s, ['a', 'b', 'c'])).toBe(67);
    expect(percentDone(s, [])).toBe(0);
  });

  it('finds the next unfinished lesson in order', () => {
    const s = setDone(emptyProgress(), 'a', true);
    expect(nextUnfinished(s, ['a', 'b', 'c'])).toBe('b');
    expect(nextUnfinished(setDone(setDone(s, 'b', true), 'c', true), ['a', 'b', 'c'])).toBeUndefined();
  });

  it('ignores corrupt or old stored data', () => {
    expect(normaliseProgress(null)).toEqual(emptyProgress());
    expect(normaliseProgress('x')).toEqual(emptyProgress());
    expect(normaliseProgress({ version: 99, done: {} })).toEqual(emptyProgress());
    expect(normaliseProgress({ version: 1, done: { a: 'd' } }).done).toEqual({ a: 'd' });
  });
});

describe('bookmarks', () => {
  const item = { key: 'foundations/what-is-a-stock', title: 'What a stock is', href: '/learn/foundations/what-is-a-stock/' };

  it('adds to the front and removes on second toggle', () => {
    const one = toggleBookmark([], item, now);
    expect(one).toEqual([{ ...item, addedAt: '2026-10-11T10:00:00.000Z' }]);
    const two = toggleBookmark(one, { key: 'b', title: 'B', href: '/b/' }, now);
    expect(two.map((b) => b.key)).toEqual(['b', item.key]);
    expect(toggleBookmark(two, item).map((b) => b.key)).toEqual(['b']);
  });

  it('drops malformed entries', () => {
    expect(normaliseBookmarks([item, { key: 1 }, null, 'x'])).toEqual([item]);
    expect(normaliseBookmarks({})).toEqual([]);
  });
});
