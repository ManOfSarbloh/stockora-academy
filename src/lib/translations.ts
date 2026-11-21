/**
 * Translated content data: content/i18n/<locale>/<name>.json holds only the translatable fields
 * (ids, links and numbers stay in the English originals). Build-time only: import from .astro pages
 * and server code, never from React islands (it would ship every translation to the browser).
 */
import { getLocale, type Locale } from '@/i18n';

const files = import.meta.glob<unknown>('../../content/i18n/*/*.json', { eager: true, import: 'default' });

export function translationFile<T>(name: string, locale: Locale = getLocale()): T | undefined {
  if (locale === 'en') return undefined;
  return files[`../../content/i18n/${locale}/${name}.json`] as T | undefined;
}

export interface CategoryText {
  title: string;
  summary: string;
}
export interface GlossaryText {
  term: string;
  definition: string;
  example?: string;
}

/** content/i18n/<locale>/candles.json: the reader-facing text of each candlestick pattern, keyed by id. */
export interface PatternText {
  name: string;
  aka?: string[];
  formation: string;
  reading: string;
  confirmation: string;
  failure: string;
  tested?: { theory: string; result: string };
}

/** The patterns with their text in the page's language (drawings, ids and numbers stay as in English). */
export function localizedPatterns<T extends { id: string; tested?: object }>(patterns: T[], locale: Locale = getLocale()): T[] {
  const tr = translationFile<Record<string, PatternText>>('candles', locale);
  if (!tr) return patterns;
  return patterns.map((p) => {
    const x = tr[p.id];
    if (!x) return p;
    const { tested, ...text } = x;
    return { ...p, ...text, ...(p.tested && tested ? { tested: { ...p.tested, ...tested } } : {}) };
  });
}

/** content/i18n/<locale>/history.json: the text of each timeline event, keyed by id; `links` are the link titles in order. */
export interface HistoryText {
  date: string;
  title: string;
  what: string;
  why: string;
  lesson: string;
  myth?: { myth: string; fact: string };
  links: string[];
}

export function localizedHistory<T extends { id: string; links: { title: string; href: string }[]; myth?: object }>(events: T[], locale: Locale = getLocale()): T[] {
  const tr = translationFile<Record<string, HistoryText>>('history', locale);
  if (!tr) return events;
  return events.map((e) => {
    const x = tr[e.id];
    if (!x) return e;
    const { links, myth, ...text } = x;
    return { ...e, ...text, ...(e.myth && myth ? { myth } : {}), links: e.links.map((l, i) => ({ ...l, title: links[i] ?? l.title })) };
  });
}
