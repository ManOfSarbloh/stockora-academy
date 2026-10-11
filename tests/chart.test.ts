import { describe, expect, it } from 'vitest';
import candlesData from '../content/candles.json';
import { SCENARIOS, SESSION_MINUTES, aggregate, heikinAshi, simulate, type Candle } from '../src/lib/chart/core';
import { atr, bollinger, ema, macd, rsi, sma, vwap } from '../src/lib/chart/indicators';
import { anatomy, explain, multiCandle, singleCandle } from '../src/lib/chart/patterns';
import { exampleSeries, type PatternDef } from '../src/lib/chart/examples';

const patterns = candlesData as unknown as PatternDef[];
const bar = (o: number, h: number, l: number, c: number, day = 0, v = 100, t = 0): Candle => ({ t, day, o, h, l, c, v });

describe('simulated markets', () => {
  it('is deterministic for a seed and internally consistent', () => {
    const a = simulate('uptrend', { days: 10, seed: 3 });
    const b = simulate('uptrend', { days: 10, seed: 3 });
    expect(a).toEqual(b);
    expect(a).toHaveLength(10 * SESSION_MINUTES);
    for (const c of a) {
      expect(c.h).toBeGreaterThanOrEqual(Math.max(c.o, c.c));
      expect(c.l).toBeLessThanOrEqual(Math.min(c.o, c.c));
      expect(c.v).toBeGreaterThan(0);
    }
  });
  it('produces each scenario with its expected character', () => {
    const daily = (s: (typeof SCENARIOS)[number]) => aggregate(simulate(s, { days: 120, seed: 11 }), 'D');
    const last = (d: Candle[]) => d[d.length - 1].c;
    expect(last(daily('uptrend'))).toBeGreaterThan(130);
    expect(last(daily('downtrend'))).toBeLessThan(80);
    const crash = daily('crash');
    const peak = Math.max(...crash.map((c) => c.h));
    expect(Math.min(...crash.slice(crash.findIndex((c) => c.h === peak)).map((c) => c.l)) / peak).toBeLessThan(0.75);
    const gap = daily('gap');
    expect(gap.some((c, i) => i > 0 && c.o / gap[i - 1].c > 1.05)).toBe(true);
    const range = daily('range');
    expect(Math.max(...range.map((c) => c.c)) / Math.min(...range.map((c) => c.c))).toBeLessThan(1.6);
    for (const s of SCENARIOS) expect(daily(s)).toHaveLength(120);
  });
});

describe('timeframes', () => {
  const base = simulate('range', { days: 6, seed: 5 });
  it('aggregates to daily candles that keep open, high, low, close and volume', () => {
    const d = aggregate(base, 'D');
    expect(d).toHaveLength(6);
    const day0 = base.filter((c) => c.day === 0);
    expect(d[0]).toMatchObject({ o: day0[0].o, c: day0[day0.length - 1].c, h: Math.max(...day0.map((c) => c.h)), l: Math.min(...day0.map((c) => c.l)) });
    expect(d[0].v).toBe(day0.reduce((s, c) => s + c.v, 0));
  });
  it('never lets intraday bars span two sessions', () => {
    const h = aggregate(base, '1h');
    expect(h).toHaveLength(6 * 7); // 6 full hours + a 30-minute bar per 390-minute session
    expect(new Set(aggregate(base, '5m').map((c) => c.day)).size).toBe(6);
    expect(aggregate(base, 'W')).toHaveLength(2);
  });
});

describe('Heikin Ashi', () => {
  it('averages prices instead of showing traded prices', () => {
    const ha = heikinAshi([bar(98, 104, 97, 103), bar(100, 110, 95, 105)]);
    expect(ha[1].c).toBe(102.5);
    expect(ha[1].o).toBe(100.5);
    expect([ha[1].h, ha[1].l]).toEqual([110, 95]);
  });
});

describe('indicators', () => {
  it('computes moving averages', () => {
    expect(sma([45.5, 45.25, 46.1], 3)[2]).toBeCloseTo(45.617, 3);
    expect(sma([1, 2, 3, 4], 2)).toEqual([NaN, 1.5, 2.5, 3.5]);
    // EMA step from CME's example: multiplier 2/15, previous 46.60, price 46.75.
    const e = ema([46.6, 46.75], 1); // period 1 is the price itself
    expect(e[1]).toBe(46.75);
    const k = 2 / 15;
    expect(46.75 * k + 46.6 * (1 - k)).toBeCloseTo(46.62, 2);
    expect(ema([2, 4, 6, 8], 3)[2]).toBe(4);
    expect(ema([2, 4, 6, 8], 3)[3]).toBe(6);
  });
  it('keeps RSI between 0 and 100', () => {
    const up = Array.from({ length: 30 }, (_, i) => 100 + i);
    const down = up.slice().reverse();
    const flat = Array.from({ length: 30 }, (_, i) => (i % 2 ? 101 : 100));
    expect(rsi(up)[29]).toBe(100);
    expect(rsi(down)[29]).toBe(0);
    expect(rsi(flat)[29]).toBeGreaterThan(45);
    expect(rsi(flat)[29]).toBeLessThan(55);
    expect(rsi(up)[13]).toBeNaN();
  });
  it('gives a flat MACD and collapsed Bollinger Bands for a constant price', () => {
    const flat = Array(60).fill(50);
    expect(macd(flat).macd[59]).toBe(0);
    expect(macd(flat).hist[59]).toBe(0);
    const b = bollinger(flat);
    expect([b.upper[59], b.mid[59], b.lower[59]]).toEqual([50, 50, 50]);
  });
  it('restarts VWAP every session and includes gaps in ATR', () => {
    const v = vwap([bar(10, 12, 8, 10, 0, 100), bar(10, 12, 8, 10, 0, 100), bar(20, 22, 18, 20, 1, 50)]);
    expect(v[1]).toBe(10);
    expect(v[2]).toBe(20);
    const a = atr([bar(10, 11, 9, 10), bar(10, 11, 9, 10), bar(20, 21, 19, 20)], 2);
    expect(a[1]).toBe(2);
    expect(a[2]).toBe((2 + 11) / 2); // gap: high 21 − previous close 10
  });
});

describe('pattern recognition', () => {
  it('measures a candle', () => {
    const a = anatomy({ o: 100, h: 106, l: 98, c: 104 });
    expect(a).toMatchObject({ range: 8, body: 4, upper: 2, lower: 2, bullish: true });
  });
  const expectedSingle = ['doji', 'dragonfly-doji', 'gravestone-doji', 'spinning-top', 'marubozu', 'hammer', 'hanging-man', 'inverted-hammer', 'shooting-star'];
  it.each(expectedSingle)('recognises the %s example', (id) => {
    const p = patterns.find((x) => x.id === id)!;
    const { candles } = exampleSeries(p);
    expect(singleCandle(candles, candles.length - 1)?.id).toBe(id);
  });
  const expectedMulti = ['bullish-engulfing', 'bearish-engulfing', 'bullish-harami', 'bearish-harami', 'morning-star', 'evening-star', 'inside-bar'];
  it.each(expectedMulti)('recognises the %s example', (id) => {
    const p = patterns.find((x) => x.id === id)!;
    const { candles } = exampleSeries(p);
    expect(multiCandle(candles, candles.length - 1)?.id).toBe(id);
  });
  it('reads the same shape differently depending on the trend before it', () => {
    const hammerShape = patterns.find((x) => x.id === 'hammer')!;
    const asHanging = { ...hammerShape, context: 'after-uptrend' as const };
    const { candles } = exampleSeries(asHanging);
    expect(explain(candles, candles.length - 1)?.id).toBe('hanging-man');
  });
  it('explains in words', () => {
    const p = patterns.find((x) => x.id === 'hammer')!;
    const { candles } = exampleSeries(p);
    const m = singleCandle(candles, candles.length - 1)!;
    expect(m.reasons.join(' ')).toMatch(/lower wick/);
    expect(m.reasons.join(' ')).toMatch(/after a fall/);
  });
  it('has valid OHLC data for every encyclopedia pattern', () => {
    for (const p of patterns)
      for (const [o, h, l, c] of p.candles) {
        expect(h).toBeGreaterThanOrEqual(Math.max(o, c));
        expect(l).toBeLessThanOrEqual(Math.min(o, c));
      }
  });
});
