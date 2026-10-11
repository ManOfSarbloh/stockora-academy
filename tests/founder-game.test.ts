import { describe, expect, it } from 'vitest';
import { totalShares } from '../src/lib/captable';
import { IPO_OPTIONS, IPO_RAISE, SEED_OFFERS, SERIES_A_OFFERS, founders, playGame } from '../src/lib/founder-game';

const base = {
  yourPct: 0.6,
  seed: SEED_OFFERS[1],
  poolPct: 0.1,
  seriesA: SERIES_A_OFFERS[1],
  ipo: IPO_OPTIONS[1],
  sellPct: 0,
};

describe('founders', () => {
  it('splits the founding shares', () => {
    expect(founders(0.6).map((h) => h.shares)).toEqual([600_000, 400_000]);
    expect(founders(1)).toHaveLength(1);
  });
});

describe('playGame', () => {
  it('runs every stage and ends with public shareholders', () => {
    const r = playGame(base);
    expect(r.stages.map((s) => s.label)).toEqual(['founding', 'seed', 'pool', 'seriesA', 'ipo']);
    const last = r.stages[4].holders;
    expect(last.some((h) => h.id === 'public')).toBe(true);
    // Post-money = pre-money + new money, give or take whole-share rounding.
    expect(Math.abs(r.marketCap / (IPO_OPTIONS[1].preMoney + IPO_RAISE) - 1)).toBeLessThan(1e-6);
    expect(r.companyRaisedTotal).toBe(1_000_000 + 5_000_000 + IPO_RAISE);
  });

  it('skips the pool stage when no pool is chosen', () => {
    expect(playGame({ ...base, poolPct: 0 }).stages.map((s) => s.label)).not.toContain('pool');
  });

  it('turns sold shares into cash without changing the share count', () => {
    const keep = playGame(base);
    const sell = playGame({ ...base, sellPct: 0.25 });
    expect(totalShares(sell.stages[4].holders)).toBe(totalShares(keep.stages[4].holders));
    expect(sell.yourShares).toBe(keep.yourShares - Math.round(keep.yourShares * 0.25));
    expect(sell.yourCash).toBeCloseTo((keep.yourShares - sell.yourShares) * sell.ipoPrice, 2);
    expect(sell.yourPaperValue + sell.yourCash).toBeCloseTo(keep.yourPaperValue, 0);
  });

  it('flags an IPO priced above what the book covers', () => {
    expect(playGame({ ...base, ipo: IPO_OPTIONS[2] }).ipoCovered).toBe(false);
    expect(playGame({ ...base, ipo: IPO_OPTIONS[0] }).ipoCovered).toBe(true);
  });
});
