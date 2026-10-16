/**
 * Market size figures (World Bank, data from the World Federation of Exchanges) and formatting.
 * Kept free of Astro imports so it can be unit-tested.
 */
import marketSizeData from '../../content/world/market-size.json';

interface Figure {
  value: number;
  year: number;
}

export interface MarketSize {
  listedCompanies?: Figure;
  marketCapUsd?: Figure;
  marketCapPctGdp?: Figure;
}

const ms = marketSizeData as {
  source: { title: string; url: string };
  asOf: string;
  note: string;
  minYear: number;
  countries: Record<string, MarketSize>;
};

export const marketSizeSource = ms.source;
export const marketSizeAsOf = ms.asOf;
export const marketSizeNote = ms.note;

/** World Bank figures for a country, leaving out values older than `minYear` (too old to compare). */
export function marketSize(code: string): MarketSize {
  const raw = ms.countries[code] ?? {};
  const fresh = (f?: Figure) => (f && f.year >= ms.minYear ? f : undefined);
  return {
    listedCompanies: fresh(raw.listedCompanies),
    marketCapUsd: fresh(raw.marketCapUsd),
    marketCapPctGdp: fresh(raw.marketCapPctGdp),
  };
}

/** "$2.05 trillion" / "$824 billion" */
export function formatUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} trillion`;
  return `$${Math.round(value / 1e9).toLocaleString('en-GB')} billion`;
}
