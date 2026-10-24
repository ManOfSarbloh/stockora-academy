/**
 * Helpers for the World Markets section: country order, market size figures and formatting.
 * Country data lives in content/countries/<code>.json; market size figures in content/world/market-size.json.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getLocale, t, type Locale } from '@/i18n';
import type { UiKey } from '@/i18n/en';
import { localizeCountry } from './country-translations';

export type Country = CollectionEntry<'countries'>['data'];

export const REGION_ORDER = ['europe', 'americas', 'asia-pacific', 'middle-east-africa'] as const;

/** All countries in the page's language (where translated): home country first, then by region and name. */
export async function getCountries(locale: Locale = getLocale()): Promise<Country[]> {
  const all = (await getCollection('countries')).map((c) => localizeCountry(c.data, locale));
  return all.sort((a, b) => {
    if (a.home !== b.home) return a.home ? -1 : 1;
    const r = REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region);
    return r || a.name.localeCompare(b.name);
  });
}

/** "Developed" → the FTSE Russell group in the page's language. */
export const ftseLabel = (ftse: string) => t(`wm.ftse.${ftse.replace(/ (.)/g, (_, x: string) => x.toUpperCase()).replace(/^./, (x) => x.toLowerCase())}` as UiKey);

export const countryHref = (code: string) => `/world/${code.toLowerCase()}`;

export { countryLanguages, worldLanguages } from './country-translations';
export { marketSize, marketSizeSource, marketSizeAsOf, marketSizeNote, marketSizeMinYear, formatUsd, type MarketSize } from './market-size';
