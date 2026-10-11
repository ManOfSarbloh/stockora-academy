/**
 * Technical indicators for the Chart School. Every function returns an array aligned with the
 * input (NaN where there is not yet enough data). Pure and unit-tested.
 */
import type { Candle } from './core';

const nan = (n: number) => Array.from({ length: n }, () => NaN);

/** Simple moving average of closing prices. */
export function sma(values: number[], period: number): number[] {
  const out = nan(values.length);
  let sum = 0;
  values.forEach((v, i) => {
    sum += v;
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  });
  return out;
}

/** Exponential moving average; seeded with the SMA of the first `period` values. Multiplier 2 / (period + 1). */
export function ema(values: number[], period: number): number[] {
  const out = nan(values.length);
  const k = 2 / (period + 1);
  let prev = NaN;
  values.forEach((v, i) => {
    if (i < period - 1) return;
    if (i === period - 1) prev = values.slice(0, period).reduce((s, x) => s + x, 0) / period;
    else prev = v * k + prev * (1 - k);
    out[i] = prev;
  });
  return out;
}

/**
 * Relative Strength Index (0–100) with Wilder's smoothing: compares average gains with average
 * losses over `period` bars. 100 means only gains, 0 only losses.
 */
export function rsi(values: number[], period = 14): number[] {
  const out = nan(values.length);
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < values.length; i++) {
    const ch = values[i] - values[i - 1];
    const g = Math.max(ch, 0);
    const l = Math.max(-ch, 0);
    if (i <= period) {
      gain += g / period;
      loss += l / period;
      if (i < period) continue;
    } else {
      gain = (gain * (period - 1) + g) / period;
      loss = (loss * (period - 1) + l) / period;
    }
    out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  }
  return out;
}

/** MACD: fast EMA − slow EMA, its signal line (EMA of MACD) and the histogram (MACD − signal). */
export function macd(values: number[], fast = 12, slow = 26, signal = 9): { macd: number[]; signal: number[]; hist: number[] } {
  const f = ema(values, fast);
  const s = ema(values, slow);
  const line = values.map((_, i) => f[i] - s[i]);
  const firstValid = line.findIndex((x) => !Number.isNaN(x));
  const sig = nan(values.length);
  if (firstValid >= 0) {
    const tail = ema(line.slice(firstValid), signal);
    tail.forEach((x, i) => (sig[firstValid + i] = x));
  }
  return { macd: line, signal: sig, hist: line.map((x, i) => x - sig[i]) };
}

/** Bollinger Bands: SMA(period) ± mult × standard deviation of the same closes (population SD). */
export function bollinger(values: number[], period = 20, mult = 2): { mid: number[]; upper: number[]; lower: number[] } {
  const mid = sma(values, period);
  const upper = nan(values.length);
  const lower = nan(values.length);
  for (let i = period - 1; i < values.length; i++) {
    const w = values.slice(i - period + 1, i + 1);
    const sd = Math.sqrt(w.reduce((s, x) => s + (x - mid[i]) ** 2, 0) / period);
    upper[i] = mid[i] + mult * sd;
    lower[i] = mid[i] - mult * sd;
  }
  return { mid, upper, lower };
}

/** Volume-weighted average price, restarting every session (typical price × volume). */
export function vwap(candles: Candle[]): number[] {
  let pv = 0;
  let vol = 0;
  let day = -1;
  return candles.map((c) => {
    if (c.day !== day) {
      day = c.day;
      pv = 0;
      vol = 0;
    }
    const tp = (c.h + c.l + c.c) / 3;
    pv += tp * c.v;
    vol += c.v;
    return vol ? pv / vol : NaN;
  });
}

/** Average True Range with Wilder's smoothing; the true range includes gaps from the previous close. */
export function atr(candles: Candle[], period = 14): number[] {
  const out = nan(candles.length);
  let avg = 0;
  candles.forEach((c, i) => {
    const tr = i === 0 ? c.h - c.l : Math.max(c.h - c.l, Math.abs(c.h - candles[i - 1].c), Math.abs(c.l - candles[i - 1].c));
    if (i < period) {
      avg += tr / period;
      if (i === period - 1) out[i] = avg;
    } else {
      avg = (avg * (period - 1) + tr) / period;
      out[i] = avg;
    }
  });
  return out;
}
