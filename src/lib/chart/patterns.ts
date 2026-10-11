/**
 * Recognising candlestick shapes for the "click any candle" explainer and the chart quiz.
 * The rules follow common textbook definitions; they are deliberately simple and explained
 * in words, because patterns are probabilities, not promises.
 */
import type { Candle } from './core';

export type TrendContext = 'up' | 'down' | 'sideways';

export interface Anatomy {
  range: number;
  body: number;
  upper: number;
  lower: number;
  bullish: boolean;
  /** Shares of the full range (0–1). */
  bodyPct: number;
  upperPct: number;
  lowerPct: number;
}

export function anatomy(c: Candle | { o: number; h: number; l: number; c: number }): Anatomy {
  const range = Math.max(c.h - c.l, 1e-9);
  const body = Math.abs(c.c - c.o);
  const upper = c.h - Math.max(c.o, c.c);
  const lower = Math.min(c.o, c.c) - c.l;
  return { range, body, upper, lower, bullish: c.c >= c.o, bodyPct: body / range, upperPct: upper / range, lowerPct: lower / range };
}

/** Trend before bar `i`: compares the close `lookback` bars earlier with the close just before. */
export function trendBefore(candles: Candle[], i: number, lookback = 5): TrendContext {
  if (i - lookback < 0) return 'sideways';
  const from = candles[i - lookback].c;
  const to = candles[i - 1].c;
  const avgRange = candles.slice(i - lookback, i).reduce((s, c) => s + (c.h - c.l), 0) / lookback;
  const move = to - from;
  if (move > avgRange * 1.2) return 'up';
  if (move < -avgRange * 1.2) return 'down';
  return 'sideways';
}

export interface Match {
  /** Id matching content/candles.json. */
  id: string;
  /** Plain-language reasons, shown in the explainer. */
  reasons: string[];
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

/** Single-candle shapes at bar `i`, most specific first. */
export function singleCandle(candles: Candle[], i: number): Match | null {
  const c = candles[i];
  const a = anatomy(c);
  const trend = trendBefore(candles, i);
  const trendText = trend === 'up' ? 'it appears after a rise' : trend === 'down' ? 'it appears after a fall' : 'there is no clear trend before it';

  if (a.bodyPct <= 0.1) {
    if (a.lowerPct >= 0.65 && a.upperPct <= 0.1)
      return { id: 'dragonfly-doji', reasons: [`open and close are almost equal (body ${pct(a.bodyPct)} of the range)`, 'the long lower wick shows price was pushed back up', trendText] };
    if (a.upperPct >= 0.65 && a.lowerPct <= 0.1)
      return { id: 'gravestone-doji', reasons: [`open and close are almost equal (body ${pct(a.bodyPct)} of the range)`, 'the long upper wick shows price was pushed back down', trendText] };
    return { id: 'doji', reasons: [`open and close are almost equal (body only ${pct(a.bodyPct)} of the range)`, 'neither buyers nor sellers won the period'] };
  }
  if (a.bodyPct >= 0.9)
    return { id: 'marubozu', reasons: [`the body fills ${pct(a.bodyPct)} of the range, with almost no wicks`, a.bullish ? 'it opened near the low and closed near the high' : 'it opened near the high and closed near the low'] };
  if (a.lower >= 2 * a.body && a.upperPct <= 0.12) {
    const why = [`the lower wick is ${(a.lower / a.body).toFixed(1)} times the body`, 'the body sits near the top with little upper wick', trendText];
    if (trend === 'down') return { id: 'hammer', reasons: why };
    if (trend === 'up') return { id: 'hanging-man', reasons: why };
  }
  if (a.upper >= 2 * a.body && a.lowerPct <= 0.12) {
    const why = [`the upper wick is ${(a.upper / a.body).toFixed(1)} times the body`, 'the body sits near the bottom with little lower wick', trendText];
    if (trend === 'down') return { id: 'inverted-hammer', reasons: why };
    if (trend === 'up') return { id: 'shooting-star', reasons: why };
  }
  if (a.bodyPct <= 0.3 && a.upper > a.body && a.lower > a.body)
    return { id: 'spinning-top', reasons: [`a small body (${pct(a.bodyPct)} of the range) in the middle`, 'wicks on both sides are longer than the body'] };
  return null;
}

/** Two- and three-candle patterns ending at bar `i`. */
export function multiCandle(candles: Candle[], i: number): Match | null {
  if (i < 1) return null;
  const c1 = candles[i - 1];
  const c2 = candles[i];
  const a1 = anatomy(c1);
  const a2 = anatomy(c2);
  const trend = trendBefore(candles, i - 1);
  const top1 = Math.max(c1.o, c1.c);
  const bot1 = Math.min(c1.o, c1.c);
  const top2 = Math.max(c2.o, c2.c);
  const bot2 = Math.min(c2.o, c2.c);

  if (i >= 2) {
    const c0 = candles[i - 2];
    const a0 = anatomy(c0);
    const mid0 = (c0.o + c0.c) / 2;
    if (trend !== 'up' && !a0.bullish && a0.bodyPct > 0.5 && a1.bodyPct < 0.35 && Math.max(c1.o, c1.c) < c0.c + a0.body * 0.2 && a2.bullish && c2.c > mid0)
      return { id: 'morning-star', reasons: ['a long falling candle, then a small "star" candle lower down', 'then a rising candle that closes above the middle of the first body'] };
    if (trend !== 'down' && a0.bullish && a0.bodyPct > 0.5 && a1.bodyPct < 0.35 && Math.min(c1.o, c1.c) > c0.c - a0.body * 0.2 && !a2.bullish && c2.c < mid0)
      return { id: 'evening-star', reasons: ['a long rising candle, then a small "star" candle higher up', 'then a falling candle that closes below the middle of the first body'] };
  }
  if (!a1.bullish && a2.bullish && bot2 <= bot1 && top2 >= top1 && a2.body > a1.body)
    return { id: 'bullish-engulfing', reasons: ['a falling candle followed by a rising one', 'the second body completely covers the first', trend === 'down' ? 'it appears after a fall' : 'note: without a prior fall, this is not the classic setup'] };
  if (a1.bullish && !a2.bullish && bot2 <= bot1 && top2 >= top1 && a2.body > a1.body)
    return { id: 'bearish-engulfing', reasons: ['a rising candle followed by a falling one', 'the second body completely covers the first', trend === 'up' ? 'it appears after a rise' : 'note: without a prior rise, this is not the classic setup'] };
  if (a1.bodyPct > 0.6 && top2 < top1 && bot2 > bot1 && a2.body < a1.body * 0.5 && a2.bullish !== a1.bullish)
    return { id: a1.bullish ? 'bearish-harami' : 'bullish-harami', reasons: ['a long candle followed by a small one of the opposite colour', 'the second body sits inside the first body'] };
  if (c2.h < c1.h && c2.l > c1.l) return { id: 'inside-bar', reasons: ["the candle's high and low are both inside the previous candle's range"] };
  return null;
}

/** The most specific explanation for bar `i`: a multi-candle pattern first, then a single shape. */
export function explain(candles: Candle[], i: number): Match | null {
  return multiCandle(candles, i) ?? singleCandle(candles, i);
}
