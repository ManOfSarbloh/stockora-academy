/**
 * Chart data basics for the Chart School: candles, simulated markets, timeframe aggregation and
 * Heikin Ashi. Pure functions with no imports outside this folder, so build scripts can use them too.
 *
 * All prices here are SIMULATED for teaching. Nothing in this module uses or copies real market data.
 */

export interface Candle {
  /** Bar index in the base series (minutes since the start of the simulation). */
  t: number;
  /** Trading day number (0, 1, 2, …) the bar belongs to. */
  day: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

/** Seeded random numbers (mulberry32), so a scenario always produces the same chart. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal random number (Box–Muller). */
function gauss(rand: () => number): number {
  let u = 0;
  while (u === 0) u = rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export type Scenario = 'uptrend' | 'downtrend' | 'range' | 'crash' | 'gap' | 'news-spike' | 'slow-bleed';
export const SCENARIOS: Scenario[] = ['uptrend', 'downtrend', 'range', 'crash', 'gap', 'news-spike', 'slow-bleed'];

/** Minutes in one simulated trading session (like 9:30–16:00). */
export const SESSION_MINUTES = 390;

interface DayPlan {
  drift: number; // expected daily return
  vol: number; // daily volatility
  gap: number; // overnight gap applied to the open
  volume: number; // volume multiplier
  pull?: number; // mean reversion strength towards `anchor`
}

function planFor(s: Scenario, days: number, rand: () => number): DayPlan[] {
  const base = (d: Partial<DayPlan>): DayPlan => ({ drift: 0, vol: 0.012, gap: 0, volume: 1, ...d });
  const plans: DayPlan[] = [];
  for (let i = 0; i < days; i++) {
    const x = i / days;
    switch (s) {
      case 'uptrend':
        plans.push(base({ drift: 0.0028, vol: 0.011 }));
        break;
      case 'downtrend':
        plans.push(base({ drift: -0.0036, vol: 0.012 }));
        break;
      case 'range':
        plans.push(base({ drift: 0, vol: 0.011, pull: 0.12 }));
        break;
      case 'crash':
        if (x < 0.55) plans.push(base({ drift: 0.0012, vol: 0.009 }));
        else if (x < 0.65) plans.push(base({ drift: -0.035, vol: 0.03, volume: 3, gap: i % 2 ? -0.015 : 0 }));
        else plans.push(base({ drift: 0.002, vol: 0.02, volume: 1.6 }));
        break;
      case 'gap': {
        const gapDay = Math.floor(days * 0.6);
        plans.push(base({ drift: 0.0005, vol: 0.01, gap: i === gapDay ? 0.08 : 0, volume: i === gapDay ? 3.5 : 1 }));
        break;
      }
      case 'news-spike': {
        const d = Math.floor(days * 0.55);
        if (i === d) plans.push(base({ drift: 0.1, vol: 0.03, gap: 0.03, volume: 6 }));
        else if (i > d && i < d + 6) plans.push(base({ drift: -0.012, vol: 0.02, volume: 2 }));
        else plans.push(base({ drift: 0.0004, vol: 0.01 }));
        break;
      }
      case 'slow-bleed':
        plans.push(base({ drift: -0.0016, vol: 0.006, volume: 0.7 }));
        break;
    }
    // a little day-to-day randomness in volume
    plans[i].volume *= 0.8 + 0.4 * rand();
  }
  return plans;
}

/**
 * Simulate `days` trading sessions of one-minute candles for a scenario.
 * The result is deterministic for a given seed.
 */
export function simulate(scenario: Scenario, opts: { days?: number; seed?: number; start?: number } = {}): Candle[] {
  const days = opts.days ?? 120;
  const rand = rng(opts.seed ?? 7);
  const plans = planFor(scenario, days, rand);
  const out: Candle[] = [];
  let price = opts.start ?? 100;
  const anchor = price;
  for (let d = 0; d < days; d++) {
    const p = plans[d];
    // overnight move: the scenario's gap plus a small random gap
    price *= 1 + p.gap + gauss(rand) * p.vol * 0.15;
    const reversion = p.pull ? -p.pull * Math.log(price / anchor) : 0;
    const muMin = (p.drift + reversion) / SESSION_MINUTES;
    const sdMin = p.vol / Math.sqrt(SESSION_MINUTES);
    for (let m = 0; m < SESSION_MINUTES; m++) {
      const o = price;
      // four sub-steps per minute give each candle a realistic high and low
      let hi = o;
      let lo = o;
      let c = o;
      for (let k = 0; k < 4; k++) {
        c *= Math.exp(muMin / 4 + (sdMin / 2) * gauss(rand));
        hi = Math.max(hi, c);
        lo = Math.min(lo, c);
      }
      // U-shaped intraday volume: busier near the open and the close
      const u = m / (SESSION_MINUTES - 1);
      const shape = 0.6 + 2.2 * (u - 0.5) ** 2 * 4;
      const v = Math.round(1000 * p.volume * shape * (0.6 + 0.8 * rand()));
      out.push({ t: d * SESSION_MINUTES + m, day: d, o: round(o), h: round(hi), l: round(lo), c: round(c), v });
      price = c;
    }
  }
  return out;
}

const round = (x: number) => Math.round(x * 100) / 100;

/** Timeframes the Chart Lab offers, in base (one-minute) bars. 'D' is one whole session. */
export type Timeframe = '1m' | '5m' | '15m' | '1h' | 'D' | 'W';
export const TIMEFRAME_MINUTES: Record<Timeframe, number> = { '1m': 1, '5m': 5, '15m': 15, '1h': 60, D: SESSION_MINUTES, W: SESSION_MINUTES * 5 };

/**
 * Combine base candles into a longer timeframe. Intraday bars never span two sessions
 * (the last bar of a day may be shorter, like a real 15:30–16:00 hourly bar).
 */
export function aggregate(base: Candle[], tf: Timeframe): Candle[] {
  const size = TIMEFRAME_MINUTES[tf];
  if (size === 1) return base.slice();
  const out: Candle[] = [];
  let cur: Candle | null = null;
  let key = '';
  for (const b of base) {
    const minuteOfDay = b.t - b.day * SESSION_MINUTES;
    const k = tf === 'W' ? `w${Math.floor(b.day / 5)}` : tf === 'D' ? `d${b.day}` : `d${b.day}-${Math.floor(minuteOfDay / size)}`;
    if (k !== key || !cur) {
      if (cur) out.push(cur);
      cur = { ...b };
      key = k;
    } else {
      cur.h = Math.max(cur.h, b.h);
      cur.l = Math.min(cur.l, b.l);
      cur.c = b.c;
      cur.v += b.v;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/**
 * Heikin Ashi candles: smoothed candles built from averages.
 * HA close = (o + h + l + c) / 4; HA open = midpoint of the previous HA candle's open and close;
 * HA high/low = the extremes of the real high/low and the HA open/close.
 * They do NOT show prices that actually traded.
 */
export function heikinAshi(candles: Candle[]): Candle[] {
  const out: Candle[] = [];
  candles.forEach((x, i) => {
    const c = (x.o + x.h + x.l + x.c) / 4;
    const o = i === 0 ? (x.o + x.c) / 2 : (out[i - 1].o + out[i - 1].c) / 2;
    out.push({ ...x, o: round(o), c: round(c), h: round(Math.max(x.h, o, c)), l: round(Math.min(x.l, o, c)) });
  });
  return out;
}
