/**
 * Turns a pattern from content/candles.json into a small candle series with the right context
 * (a short decline or rise before it), for the encyclopedia drawings, lessons and tests.
 */
import type { Candle } from './core';

export interface PatternDef {
  id: string;
  name: string;
  kind: 'single' | 'multi';
  traditionalBias: string;
  context: 'after-downtrend' | 'after-uptrend' | 'any';
  candles: [number, number, number, number][];
}

const mk = (i: number, [o, h, l, c]: number[], v = 1000): Candle => ({ t: i, day: i, o, h, l, c, v });

/** Context candles followed by the pattern candles. `contextCount` tells how many come first. */
export function exampleSeries(p: PatternDef, contextBars = 5): { candles: Candle[]; contextCount: number } {
  const first = p.candles[0];
  const ctx: number[][] = [];
  const step = 3.2;
  if (p.context === 'after-downtrend') {
    // falling candles that end just above the pattern's first open
    const end = Math.max(first[0], first[3]) + 1.2;
    for (let k = contextBars; k >= 1; k--) {
      const o = end + k * step;
      const c = o - step * 0.85;
      ctx.push([o, o + 0.7, c - 0.7, c]);
    }
  } else if (p.context === 'after-uptrend') {
    const end = Math.min(first[0], first[3]) - 1.2;
    for (let k = contextBars; k >= 1; k--) {
      const o = end - k * step;
      const c = o + step * 0.85;
      ctx.push([o, c + 0.7, o - 0.7, c]);
    }
  } else {
    // sideways: small alternating candles around the pattern's level
    const mid = (first[1] + first[2]) / 2;
    for (let k = 0; k < Math.min(3, contextBars); k++) {
      const up = k % 2 === 0;
      const o = mid + (up ? -1.2 : 1.2);
      const c = mid + (up ? 1.2 : -1.2);
      ctx.push([o, Math.max(o, c) + 0.8, Math.min(o, c) - 0.8, c]);
    }
  }
  const all = [...ctx, ...p.candles];
  return { candles: all.map((x, i) => mk(i, x)), contextCount: ctx.length };
}
