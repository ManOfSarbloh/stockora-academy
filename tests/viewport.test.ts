import { describe, expect, it } from 'vitest';
import { fibLevels, measure, niceTicks, priceExtent, windowEndingAt, xScale, yScale } from '../src/lib/chart/viewport';

describe('visible window', () => {
  it('stays inside the data', () => {
    expect(windowEndingAt(100, 40, 120)).toEqual({ start: 60, end: 100 });
    expect(windowEndingAt(10, 40, 120)).toEqual({ start: 0, end: 40 });
    expect(windowEndingAt(500, 40, 120)).toEqual({ start: 80, end: 120 });
    expect(windowEndingAt(30, 400, 120)).toEqual({ start: 0, end: 120 });
  });
  it('finds the price range of visible bars and indicator lines', () => {
    const c = [
      { h: 10, l: 8 },
      { h: 12, l: 9 },
      { h: 30, l: 1 },
    ];
    const r = priceExtent(c, { start: 0, end: 2 }, [[NaN, 13]], 0);
    expect(r).toEqual({ lo: 8, hi: 13 });
  });
});

describe('scales', () => {
  it('maps prices linearly and back', () => {
    const s = yScale(100, 200, 0, 100);
    expect(s.y(200)).toBe(0);
    expect(s.y(150)).toBe(50);
    expect(s.price(25)).toBe(175);
  });
  it('gives equal space to equal percentage moves on a log scale', () => {
    const s = yScale(10, 1000, 0, 200, true);
    expect(s.y(10) - s.y(100)).toBeCloseTo(s.y(100) - s.y(1000), 6);
    expect(s.price(s.y(42))).toBeCloseTo(42, 6);
  });
  it('maps bar indexes to slots', () => {
    const x = xScale({ start: 10, end: 20 }, 0, 100);
    expect(x.slot).toBe(10);
    expect(x.x(10)).toBe(5);
    expect(x.index(57)).toBe(15);
  });
  it('produces round tick values', () => {
    expect(niceTicks(0, 100, 5)).toEqual([0, 20, 40, 60, 80, 100]);
    expect(niceTicks(97.3, 104.1, 5)).toEqual([98, 100, 102, 104]);
  });
});

describe('drawing tools', () => {
  it('computes Fibonacci retracement levels of a move', () => {
    const up = fibLevels(80, 100);
    expect(up.find((l) => l.ratio === 0.618)!.price).toBeCloseTo(87.64, 2);
    expect(up.find((l) => l.ratio === 0.5)!.price).toBe(90);
    expect(up[0].price).toBe(100);
    expect(up[up.length - 1].price).toBe(80);
  });
  it('measures distance in bars, price and percent', () => {
    expect(measure({ i: 5, p: 50 }, { i: 25, p: 60 })).toEqual({ bars: 20, change: 10, pct: 20 });
  });
});
