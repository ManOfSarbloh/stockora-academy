/**
 * Generates Chart Reading Quiz questions from SIMULATED data. Deterministic for a seed,
 * so results can be tested and reproduced. Pure; no rendering here.
 */
import { aggregate, rng, simulate, type Candle, type Scenario } from './core';
import { exampleSeries, type PatternDef } from './examples';
import { rsi } from './indicators';

export type ChartQuestion =
  | { kind: 'candle'; candles: Candle[]; highlight: { from: number; to: number }; options: string[]; answer: number; patternId: string }
  | { kind: 'trend'; candles: Candle[]; answer: 'up' | 'down' | 'range'; scenario: Scenario }
  | { kind: 'rsi'; candles: Candle[]; value: number; answer: 'high' | 'low' | 'mid' }
  | { kind: 'support'; candles: Candle[]; zone: { lo: number; hi: number } }
  | { kind: 'highest'; candles: Candle[]; index: number }
  | { kind: 'timeframe'; candles: Candle[]; answer: '1h' | 'D' | 'W' };

const pick = <T>(xs: readonly T[], r: () => number) => xs[Math.floor(r() * xs.length)];
function shuffle<T>(xs: T[], r: () => number): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const lastN = (c: Candle[], n: number) => c.slice(Math.max(0, c.length - n));
const daily = (s: Scenario, days: number, seed: number) => aggregate(simulate(s, { days, seed }), 'D');

function candleQuestion(patterns: (PatternDef & { name: string })[], kind: 'single' | 'multi', r: () => number): ChartQuestion {
  const pool = patterns.filter((p) => p.kind === kind);
  const p = pick(pool, r);
  const others = shuffle(
    patterns.filter((x) => x.id !== p.id),
    r,
  )
    .filter((x) => x.kind === kind)
    .slice(0, 3)
    .map((x) => x.name);
  const options = shuffle([p.name, ...others], r);
  const { candles } = exampleSeries(p, 6);
  return { kind: 'candle', candles, highlight: { from: candles.length - p.candles.length, to: candles.length - 1 }, options, answer: options.indexOf(p.name), patternId: p.id };
}

/** Ten questions for one quiz round. */
export function generateChartQuiz(seed: number, patterns: (PatternDef & { name: string })[]): ChartQuestion[] {
  const r = rng(seed);
  const qs: ChartQuestion[] = [];
  qs.push(candleQuestion(patterns, 'single', r), candleQuestion(patterns, 'single', r), candleQuestion(patterns, 'single', r), candleQuestion(patterns, 'multi', r));

  for (let k = 0; k < 2; k++) {
    const scenario = pick(['uptrend', 'downtrend', 'range'] as const, r);
    qs.push({ kind: 'trend', candles: lastN(daily(scenario, 80, Math.floor(r() * 1e6)), 60), scenario, answer: scenario === 'uptrend' ? 'up' : scenario === 'downtrend' ? 'down' : 'range' });
  }

  // RSI: retry until the last value is clearly in one region.
  for (let tries = 0; tries < 40; tries++) {
    const scenario = pick(['uptrend', 'downtrend', 'range', 'news-spike'] as const, r);
    const c = lastN(daily(scenario, 90, Math.floor(r() * 1e6)), 70);
    const v = rsi(
      c.map((x) => x.c),
      14,
    )[c.length - 1];
    const answer = v >= 72 ? 'high' : v <= 28 ? 'low' : v >= 40 && v <= 60 ? 'mid' : null;
    if (answer) {
      qs.push({ kind: 'rsi', candles: c, value: v, answer });
      break;
    }
  }

  // Support: a range market; the zone spans the lowest lows.
  {
    const c = lastN(daily('range', 100, Math.floor(r() * 1e6)), 70);
    const lows = c.map((x) => x.l).sort((a, b) => a - b);
    qs.push({ kind: 'support', candles: c, zone: { lo: lows[0], hi: lows[Math.floor(lows.length * 0.2)] } });
  }

  // Highest close among visible candles.
  {
    const c = lastN(daily(pick(['range', 'crash', 'news-spike'] as const, r), 60, Math.floor(r() * 1e6)), 40);
    let index = 0;
    c.forEach((x, i) => {
      if (x.c > c[index].c) index = i;
    });
    qs.push({ kind: 'highest', candles: c, index });
  }

  // Timeframe recognition from the time axis.
  {
    const answer = pick(['1h', 'D', 'W'] as const, r);
    const days = answer === 'W' ? 220 : answer === 'D' ? 60 : 10;
    const c = aggregate(simulate('range', { days, seed: Math.floor(r() * 1e6) }), answer);
    qs.push({ kind: 'timeframe', candles: lastN(c, 40), answer });
  }

  return shuffle(qs, r).slice(0, 10);
}

/** Whether a click at `price` answers a support question correctly (with a little tolerance). */
export function isSupportClick(q: Extract<ChartQuestion, { kind: 'support' }>, price: number): boolean {
  const avgRange = q.candles.reduce((s, c) => s + (c.h - c.l), 0) / q.candles.length;
  return price >= q.zone.lo - avgRange * 0.5 && price <= q.zone.hi + avgRange * 0.5;
}

/** Whether a clicked candle has (practically) the highest close. */
export function isHighestClick(q: Extract<ChartQuestion, { kind: 'highest' }>, index: number): boolean {
  const best = q.candles[q.index].c;
  return index >= 0 && index < q.candles.length && q.candles[index].c >= best * 0.999;
}
