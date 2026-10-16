import { describe, expect, it } from 'vitest';
import { formatUsd, marketSize } from '@/lib/market-size';
import data from '../content/world/market-size.json';

describe('market size', () => {
  it('formats US dollar amounts in billions and trillions', () => {
    expect(formatUsd(211_144_670_000)).toBe('$211 billion');
    expect(formatUsd(2_047_916_560_000)).toBe('$2.05 trillion');
  });

  it('hides figures older than the minimum year', () => {
    const old = Object.entries(data.countries).find(([, v]) => v.listedCompanies && v.listedCompanies.year < data.minYear);
    expect(old).toBeDefined();
    expect(marketSize(old![0]).listedCompanies).toBeUndefined();
  });

  it('returns recent figures with their year', () => {
    const at = marketSize('AT');
    expect(at.listedCompanies?.year).toBeGreaterThanOrEqual(data.minYear);
    expect(at.marketCapUsd?.value).toBeGreaterThan(0);
  });

  it('returns nothing for a country without data', () => {
    expect(marketSize('XX')).toEqual({ listedCompanies: undefined, marketCapUsd: undefined, marketCapPctGdp: undefined });
  });
});
