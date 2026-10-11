import { afterEach, describe, expect, it, vi } from 'vitest';
import { t } from '../src/i18n';
import { readJSON, remove, STORAGE_PREFIX, writeJSON } from '../src/lib/storage';

describe('t()', () => {
  it('returns English strings', () => {
    expect(t('site.name')).toBe('Stockora Academy');
  });

  it('fills placeholders', () => {
    expect(t('learn.readingTime', { n: 7 })).toBe('7 min read');
  });
});

function fakeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

describe('storage', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('falls back safely when there is no window (build time)', () => {
    expect(readJSON('x', 42)).toBe(42);
    expect(writeJSON('x', 1)).toBe(false);
  });

  it('round-trips values under the stockora- prefix', () => {
    const ls = fakeStorage();
    vi.stubGlobal('window', { localStorage: ls });
    expect(writeJSON('progress', { A: 3 })).toBe(true);
    expect(ls.getItem(`${STORAGE_PREFIX}progress`)).toBe('{"A":3}');
    expect(readJSON('progress', {})).toEqual({ A: 3 });
    remove('progress');
    expect(readJSON('progress', null)).toBeNull();
  });

  it('returns the fallback for corrupt data and when storage throws', () => {
    const ls = fakeStorage();
    ls.setItem(`${STORAGE_PREFIX}bad`, '{not json');
    vi.stubGlobal('window', { localStorage: ls });
    expect(readJSON('bad', 'fallback')).toBe('fallback');

    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new Error('blocked');
      },
    });
    expect(readJSON('any', 'safe')).toBe('safe');
    expect(writeJSON('any', 1)).toBe(false);
  });
});
