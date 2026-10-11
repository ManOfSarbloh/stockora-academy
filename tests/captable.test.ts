import { describe, expect, it } from 'vitest';
import { ownership, priceRound, runSteps, topUpPool, totalShares, type Holder } from '../src/lib/captable';

const founders: Holder[] = [
  { id: 'anna', name: 'Anna', kind: 'founder', shares: 600_000 },
  { id: 'ben', name: 'Ben', kind: 'founder', shares: 400_000 },
];

describe('priceRound', () => {
  it('matches the lesson example: €1m at €4m pre-money buys 20%', () => {
    const r = priceRound(founders, 1_000_000, 4_000_000, 'seed', 'Seed investor');
    expect(r.pricePerShare).toBe(4);
    expect(r.newShares).toBe(250_000);
    expect(r.postMoney).toBe(5_000_000);
    expect(totalShares(r.holders)).toBe(1_250_000);
    expect(ownership(r.holders)).toEqual([0.48, 0.32, 0.2]);
  });
  it('leaves the table unchanged for invalid input', () => {
    expect(priceRound(founders, 0, 4_000_000, 'x', 'X').holders).toBe(founders);
    expect(priceRound(founders, 1, -5, 'x', 'X').newShares).toBe(0);
  });
  it('adds to an existing investor instead of duplicating them', () => {
    const a = priceRound(founders, 1_000_000, 4_000_000, 'vc', 'VC').holders;
    const b = priceRound(a, 1_000_000, 10_000_000, 'vc', 'VC').holders;
    expect(b.filter((h) => h.id === 'vc')).toHaveLength(1);
    expect(b.find((h) => h.id === 'vc')!.shares).toBe(250_000 + 125_000);
  });
});

describe('topUpPool', () => {
  it('creates a pool of the target size', () => {
    const r = topUpPool(founders, 0.1);
    expect(r.newShares).toBe(111_111);
    const pct = ownership(r.holders);
    expect(pct[2]).toBeCloseTo(0.1, 5);
  });
  it('tops up an existing pool and never shrinks it', () => {
    const once = topUpPool(founders, 0.1).holders;
    const diluted = priceRound(once, 1_000_000, 4_000_000, 'seed', 'Seed').holders;
    const again = topUpPool(diluted, 0.1);
    expect(ownership(again.holders)[2]).toBeCloseTo(0.1, 5);
    expect(topUpPool(once, 0.05).newShares).toBe(0);
  });
  it('ignores impossible targets', () => {
    expect(topUpPool(founders, 0).newShares).toBe(0);
    expect(topUpPool(founders, 1).newShares).toBe(0);
  });
});

describe('runSteps', () => {
  it('applies steps in order and keeps ownership summing to 100%', () => {
    const res = runSteps(founders, [
      { type: 'round', id: 'seed', name: 'Seed', investment: 1_000_000, preMoney: 4_000_000 },
      { type: 'pool', id: 'p', name: 'Pool', targetPct: 0.1 },
      { type: 'round', id: 'a', name: 'Series A', investment: 5_000_000, preMoney: 20_000_000 },
    ]);
    expect(res).toHaveLength(3);
    for (const r of res) expect(ownership(r.holders).reduce((s, x) => s + x, 0)).toBeCloseTo(1, 9);
    const last = res[2];
    expect(last.postMoney).toBe(25_000_000);
    // Series A buys investment ÷ post-money = 20% of the company.
    expect(ownership(last.holders)[last.holders.findIndex((h) => h.id === 'a')]).toBeCloseTo(0.2, 4);
  });
});
