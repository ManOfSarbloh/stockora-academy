import { describe, expect, it } from 'vitest';
import { MAX_GOALS, crashCheck, emergencyTarget, emptyPlan, fallInEuros, mixTotal, mixValid, restorePlan, yearsUntil } from '../src/lib/investment-plan';

describe('investment plan helpers', () => {
  it('computes the emergency fund target', () => {
    expect(emergencyTarget(2000, 6)).toBe(12000);
    expect(emergencyTarget(null, 6)).toBeNull();
    expect(emergencyTarget(0, 6)).toBeNull();
  });
  it('turns the acceptable fall into euros', () => {
    expect(fallInEuros(50000, 30)).toBe(15000);
    expect(fallInEuros(null, 30)).toBeNull();
  });
  it('checks that the mix adds up to 100%', () => {
    expect(mixTotal({ shares: 60, bonds: 30, cash: 10 })).toBe(100);
    expect(mixValid({ shares: 60, bonds: 30, cash: 10 })).toBe(true);
    expect(mixValid({ shares: 60, bonds: 30, cash: 5 })).toBe(false);
    expect(mixValid({ shares: 110, bonds: -10, cash: 0 })).toBe(false);
  });
  it('reproduces the lesson example: 60% shares fall 30% → about 51%, beyond a 5-point limit', () => {
    const c = crashCheck({ shares: 60, bonds: 40, cash: 0, rebalanceDrift: 5 })!;
    expect(c.from).toBe(60);
    expect(c.to).toBeCloseTo(51.2, 1);
    expect(c.rebalance).toBe(true);
    expect(crashCheck({ shares: 20, bonds: 80, cash: 0, rebalanceDrift: 10 })!.rebalance).toBe(false);
    expect(crashCheck({ shares: 0, bonds: 100, cash: 0, rebalanceDrift: 5 })).toBeNull();
  });
  it('counts years until a goal', () => {
    expect(yearsUntil(2055, new Date('2026-11-11'))).toBe(29);
    expect(yearsUntil(2020, new Date('2026-11-11'))).toBe(0);
    expect(yearsUntil(null, new Date('2026-11-11'))).toBeNull();
  });
  it('restores saved plans and fills in missing fields', () => {
    expect(restorePlan(null, 'rule')).toBeNull();
    expect(restorePlan({ version: 2 }, 'rule')).toBeNull();
    const p = restorePlan({ version: 1, shares: 80, goals: Array.from({ length: 5 }, () => ({ what: 'x', amount: 1, year: 2030 })) }, 'rule')!;
    expect(p.shares).toBe(80);
    expect(p.bonds).toBe(emptyPlan('rule').bonds);
    expect(p.crashRule).toBe('rule');
    expect(p.goals).toHaveLength(MAX_GOALS);
  });
});
