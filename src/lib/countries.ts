/**
 * Helpers for the World Markets section: country order, market size figures and formatting.
 * Country data lives in content/countries/<code>.json; market size figures in content/world/market-size.json.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Country = CollectionEntry<'countries'>['data'];

export const REGION_ORDER = ['europe', 'americas', 'asia-pacific', 'middle-east-africa'] as const;

/** All countries: home country first, then by region and name. */
export async function getCountries(): Promise<Country[]> {
  const all = (await getCollection('countries')).map((c) => c.data);
  return all.sort((a, b) => {
    if (a.home !== b.home) return a.home ? -1 : 1;
    const r = REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region);
    return r || a.name.localeCompare(b.name);
  });
}

export const countryHref = (code: string) => `/world/${code.toLowerCase()}`;

export { marketSize, marketSizeSource, marketSizeAsOf, marketSizeNote, formatUsd, type MarketSize } from './market-size';
