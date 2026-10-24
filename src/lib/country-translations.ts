/**
 * Translated country pages: content/i18n/<locale>/countries/<code>.json holds the country's texts in the
 * same shape as content/countries/<code>.json, without the fields that are not text (codes, dates, links,
 * sources). Arrays must keep the English length and order; an empty object or a missing field keeps the
 * English value. `translatedFrom` is the English lastReviewed date the translation was made from.
 */
import type { Locale } from '@/i18n/locales';
import { ACTIVE_LOCALES } from '@/i18n/pages';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const files = import.meta.glob<Record<string, Json>>('../../content/i18n/*/countries/*.json', { eager: true, import: 'default' });
const english = import.meta.glob<{ code: string }>('../../content/countries/*.json', { eager: true, import: 'default' });
const byLocale = new Map<string, Map<string, Record<string, Json>>>();
for (const [path, data] of Object.entries(files)) {
  const parts = path.split('/');
  const loc = parts[4];
  const code = parts[6].replace(/\.json$/, '').toUpperCase();
  const map = byLocale.get(loc) ?? new Map<string, Record<string, Json>>();
  map.set(code, data);
  byLocale.set(loc, map);
}
const allCodes = Object.values(english).map((c) => c.code);

/** Texts from `over` laid over `base`: strings replace strings, objects and same-length arrays merge field by field. */
function merge<T>(base: T, over: Json | undefined): T {
  if (over === undefined || over === null) return base;
  if (typeof base === 'string') return (typeof over === 'string' && over ? over : base) as T;
  if (Array.isArray(base)) return (Array.isArray(over) && over.length === base.length ? base.map((b, i) => merge(b, over[i])) : base) as T;
  if (base && typeof base === 'object' && typeof over === 'object' && !Array.isArray(over)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const k of Object.keys(out)) out[k] = merge(out[k], over[k]);
    return out as T;
  }
  return base;
}

/** The country's data in `locale` where a translation exists. */
export function localizeCountry<C extends { code: string }>(c: C, locale: Locale): C {
  const o = locale === 'en' ? undefined : byLocale.get(locale)?.get(c.code);
  return o ? merge(c, o) : c;
}

/** Languages a country page can be read in: English plus every translation. */
export const countryLanguages = (code: string): Locale[] => ACTIVE_LOCALES.filter((l) => l === 'en' || byLocale.get(l)?.has(code));

/** Languages in which every country is translated (the World Markets overview and comparison pages). */
export const worldLanguages = (): Locale[] => ACTIVE_LOCALES.filter((l) => l === 'en' || allCodes.every((c) => byLocale.get(l)?.has(c)));
