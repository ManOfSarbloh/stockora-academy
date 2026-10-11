/**
 * Geometry for the Chart Lab: visible window, price and time scales (linear or logarithmic),
 * and the maths behind the Fibonacci and measuring tools. Pure and unit-tested.
 */
import type { Candle } from './core';

export interface Window {
  /** First visible bar (inclusive). */
  start: number;
  /** Last visible bar + 1 (exclusive). */
  end: number;
}

/** A window of `size` bars ending at `end`, kept inside [0, count]. */
export function windowEndingAt(end: number, size: number, count: number): Window {
  const e = Math.max(Math.min(count, Math.round(end)), Math.min(count, Math.max(1, size)));
  const s = Math.max(0, e - Math.max(1, size));
  return { start: s, end: e };
}

/** Lowest low and highest high in the window, widened by any extra series (indicators) and padded. */
export function priceExtent(candles: Pick<Candle, 'h' | 'l'>[], w: Window, extras: number[][] = [], pad = 0.06): { lo: number; hi: number } {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = w.start; i < w.end; i++) {
    lo = Math.min(lo, candles[i].l);
    hi = Math.max(hi, candles[i].h);
    for (const s of extras) {
      const v = s[i];
      if (Number.isFinite(v)) {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
    }
  }
  if (!Number.isFinite(lo)) return { lo: 0, hi: 1 };
  if (hi === lo) return { lo: lo - 1, hi: hi + 1 };
  const span = hi - lo;
  return { lo: Math.max(lo - span * pad, lo > 0 ? lo * 0.5 : lo - span), hi: hi + span * pad };
}

export interface YScale {
  y: (price: number) => number;
  price: (y: number) => number;
  ticks: number[];
}

/** Price scale for a pane. With `log`, equal distances mean equal percentage moves. */
export function yScale(lo: number, hi: number, top: number, height: number, log = false): YScale {
  if (log && lo > 0) {
    const a = Math.log(lo);
    const b = Math.log(hi);
    return {
      y: (p) => top + ((b - Math.log(p)) / (b - a)) * height,
      price: (y) => Math.exp(b - ((y - top) / height) * (b - a)),
      ticks: niceTicks(lo, hi, 5),
    };
  }
  return {
    y: (p) => top + ((hi - p) / (hi - lo)) * height,
    price: (y) => hi - ((y - top) / height) * (hi - lo),
    ticks: niceTicks(lo, hi, 5),
  };
}

/** Round tick values (1, 2, 2.5 or 5 × 10^n) covering [lo, hi]. */
export function niceTicks(lo: number, hi: number, count = 5): number[] {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count + 1) ?? 10 * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Math.round(v / step) * step);
  return out;
}

export interface XScale {
  x: (index: number) => number;
  index: (x: number) => number;
  slot: number;
}

/** Bar index ↔ horizontal position; each bar gets an equal slot. */
export function xScale(w: Window, left: number, width: number): XScale {
  const slot = width / Math.max(1, w.end - w.start);
  return {
    slot,
    x: (i) => left + (i - w.start + 0.5) * slot,
    index: (x) => Math.floor((x - left) / slot) + w.start,
  };
}

export const FIB_RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

/**
 * Fibonacci retracement levels for a move from price `a` to price `b`: 0% sits at b (the end of
 * the move), 100% at a (its start), so 61.8% is how far a pullback would retrace the move.
 */
export function fibLevels(a: number, b: number): { ratio: number; price: number }[] {
  return FIB_RATIOS.map((ratio) => ({ ratio, price: b - (b - a) * ratio }));
}

/** What the measuring tool reports between two points on the chart. */
export function measure(a: { i: number; p: number }, b: { i: number; p: number }): { bars: number; change: number; pct: number } {
  const change = b.p - a.p;
  return { bars: b.i - a.i, change, pct: a.p ? (change / a.p) * 100 : 0 };
}
