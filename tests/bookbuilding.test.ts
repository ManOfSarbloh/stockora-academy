import { describe, expect, it } from 'vitest';
import { allocate, coverage, demandAt, highestCoveredPrice, priceSteps, summarise, type BookOrder } from '../src/lib/bookbuilding';

const book: BookOrder[] = [
  { investor: 'A', shares: 4_000_000, maxPrice: 22 },
  { investor: 'B', shares: 3_000_000, maxPrice: 20 },
  { investor: 'C', shares: 6_000_000, maxPrice: 19 },
  { investor: 'D', shares: 2_000_000, maxPrice: 18 },
];

describe('demand', () => {
  it('counts only orders at or above the price', () => {
    expect(demandAt(book, 18)).toBe(15_000_000);
    expect(demandAt(book, 19)).toBe(13_000_000);
    expect(demandAt(book, 20)).toBe(7_000_000);
    expect(demandAt(book, 22.5)).toBe(0);
  });
  it('computes coverage', () => {
    expect(coverage(book, 19, 10_000_000)).toBeCloseTo(1.3);
    expect(coverage(book, 19, 0)).toBe(0);
  });
});

describe('pricing', () => {
  it('lists price steps including both ends', () => {
    expect(priceSteps(18, 20, 0.5)).toEqual([18, 18.5, 19, 19.5, 20]);
    expect(priceSteps(20, 18, 0.5)).toEqual([]);
  });
  it('finds the highest price that still covers the offer', () => {
    expect(highestCoveredPrice(book, 10_000_000, 18, 22, 0.5)).toBe(19);
    expect(highestCoveredPrice(book, 50_000_000, 18, 22, 0.5)).toBeUndefined();
  });
});

describe('allocation and summary', () => {
  it('scales eligible orders down pro rata when oversubscribed', () => {
    const a = allocate(book, 19, 10_000_000);
    expect(a.find((x) => x.investor === 'D')!.allocated).toBe(0);
    const total = a.reduce((s, x) => s + x.allocated, 0);
    expect(total).toBeLessThanOrEqual(10_000_000);
    expect(total).toBeGreaterThan(9_999_990);
    expect(a.find((x) => x.investor === 'A')!.allocated).toBe(Math.floor(4_000_000 * (10 / 13)));
  });
  it('fills everything when demand is below the offer', () => {
    expect(allocate(book, 20, 10_000_000).find((x) => x.investor === 'A')!.allocated).toBe(4_000_000);
  });
  it('summarises proceeds, market cap and unfilled demand', () => {
    const s = summarise(book, 19, 10_000_000, 40_000_000);
    expect(s).toMatchObject({ demand: 13_000_000, sold: 10_000_000, proceeds: 190_000_000, marketCap: 760_000_000, unfilled: 3_000_000 });
    expect(summarise(book, 20, 10_000_000, 40_000_000).sold).toBe(7_000_000);
  });
});
