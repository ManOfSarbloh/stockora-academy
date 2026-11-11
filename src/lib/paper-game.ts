/**
 * Paper-trading game: play money, invented companies, SIMULATED daily prices.
 * Nothing here uses or copies real market data. Pure functions, deterministic for a given seed,
 * unit-tested in tests/paper-game.test.ts.
 *
 * How a day works: the player sees prices up to today's close and places orders. "Next day" builds
 * the next daily bar; orders are then checked against that bar in the order they were placed
 * (market orders at the open, limit and stop orders when the price reaches them), dividends are paid,
 * and the portfolio is valued at the close.
 */
import { rng } from './chart/core';

export type InstrumentId = 'world-etf' | 'alpenbyte' | 'donaustrom' | 'tirolbank';

export interface Instrument {
  id: InstrumentId;
  kind: 'etf' | 'stock';
  /** First price of the simulated history. */
  start: number;
  /** How strongly the share follows the whole market (1 = like the market). */
  beta: number;
  /** Daily volatility of company-specific moves. */
  idioVol: number;
  /** Bid-ask spread as a fraction of the price; a market order pays half of it. */
  spread: number;
  /** Chance per trading day of company news that moves the price. */
  newsChance: number;
  /** Dividend per share and the game day it goes ex-dividend (paid the same day). */
  dividend?: { perShare: number; day: number };
}

export const INSTRUMENTS: Instrument[] = [
  { id: 'world-etf', kind: 'etf', start: 100, beta: 1, idioVol: 0.0015, spread: 0.0005, newsChance: 0 },
  { id: 'alpenbyte', kind: 'stock', start: 42, beta: 1.4, idioVol: 0.021, spread: 0.002, newsChance: 0.014 },
  { id: 'donaustrom', kind: 'stock', start: 18, beta: 0.6, idioVol: 0.008, spread: 0.001, newsChance: 0.008, dividend: { perShare: 0.8, day: 45 } },
  { id: 'tirolbank', kind: 'stock', start: 27, beta: 1.2, idioVol: 0.013, spread: 0.0015, newsChance: 0.01 },
];

export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;

export const START_CASH = 10_000;
/** Flat broker fee per executed order (play money, similar to a low-cost online broker). */
export const ORDER_FEE = 5;
/** Austrian special tax rate on capital income (KESt), used for dividends and the tax estimate. */
export const KEST = 0.275;
export const GAME_LENGTHS = [60, 120, 250] as const;
/** Trading days of price history shown before the game starts. */
export const HISTORY_DAYS = 60;

export interface Bar {
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface NewsEvent {
  /** Game day the news hits (the price gaps at that day's open). */
  day: number;
  /** null = news for the whole market. */
  id: InstrumentId | null;
  /** Headline key, translated in the UI: pg.news.<key>. */
  key: string;
  /** Price move the news causes, as a fraction (−0.1 = −10%). */
  move: number;
}

export interface Market {
  seed: number;
  days: number;
  /** Daily bars per instrument: HISTORY_DAYS of history, then one bar per game day (index HISTORY_DAYS − 1 + day). */
  bars: Record<InstrumentId, Bar[]>;
  news: NewsEvent[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function gauss(rand: () => number): number {
  let u = 0;
  while (u === 0) u = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

const GOOD = ['beat', 'contract', 'outlook', 'product'];
const BAD = ['miss', 'recall', 'lawsuit', 'ceo'];

/** Index into the bar arrays for a game day (day 0 = the last day of history). */
export const barIndex = (day: number) => HISTORY_DAYS - 1 + day;

/** Builds the whole simulated market for a game: same seed, same market. */
export function simulateMarket(seed: number, days: number): Market {
  const rand = rng(seed);
  const total = HISTORY_DAYS + days;
  // Daily market return: small upward drift, plus (in most games) one slump of 8–20 days and later recovery.
  const market: number[] = [];
  const hasSlump = rand() < 0.7;
  const slumpStart = HISTORY_DAYS + Math.floor(days * (0.2 + rand() * 0.5));
  const slumpLen = 8 + Math.floor(rand() * 13);
  for (let i = 0; i < total; i++) {
    const inSlump = hasSlump && i >= slumpStart && i < slumpStart + slumpLen;
    const afterSlump = hasSlump && i >= slumpStart + slumpLen && i < slumpStart + slumpLen * 3;
    const drift = inSlump ? -0.009 : afterSlump ? 0.0035 : 0.0004;
    market.push(drift + 0.008 * gauss(rand));
  }
  const news: NewsEvent[] = [];
  if (hasSlump && slumpStart < total) news.push({ day: slumpStart - (HISTORY_DAYS - 1), id: null, key: 'market.rates', move: 0 });

  const bars = {} as Record<InstrumentId, Bar[]>;
  for (const ins of INSTRUMENTS) {
    const out: Bar[] = [];
    let prev = ins.start;
    for (let i = 0; i < total; i++) {
      const day = i - (HISTORY_DAYS - 1);
      let gap = 0.002 * gauss(rand);
      // Company news (only during the game, so the headlines are visible): the price gaps at the open.
      if (day >= 1 && rand() < ins.newsChance) {
        const good = rand() < 0.5;
        const size = 0.04 + rand() * 0.09;
        const move = good ? size : -size;
        gap += Math.log(1 + move);
        const list = good ? GOOD : BAD;
        news.push({ day, id: ins.id, key: `${good ? 'up' : 'down'}.${list[Math.floor(rand() * list.length)]}`, move });
      }
      let open = prev * Math.exp(gap);
      if (ins.dividend && day === ins.dividend.day) open = Math.max(0.5, open - ins.dividend.perShare);
      const ret = ins.beta * market[i] + ins.idioVol * gauss(rand);
      const close = Math.max(0.5, open * Math.exp(ret));
      const range = (Math.abs(ins.beta * 0.008) + ins.idioVol) * 0.6;
      const high = Math.max(open, close) * (1 + Math.abs(gauss(rand)) * range);
      const low = Math.min(open, close) * (1 - Math.abs(gauss(rand)) * range);
      const bar = { o: round2(open), h: round2(high), l: round2(Math.max(0.01, low)), c: round2(close) };
      bar.h = Math.max(bar.h, bar.o, bar.c);
      bar.l = Math.min(bar.l, bar.o, bar.c);
      out.push(bar);
      prev = bar.c;
    }
    bars[ins.id] = out;
  }
  news.sort((a, b) => a.day - b.day);
  return { seed, days, bars, news };
}

// ---------------------------------------------------------------------------------------------------
// Game state

export type Side = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop';

export interface Order {
  id: number;
  instrument: InstrumentId;
  side: Side;
  type: OrderType;
  qty: number;
  /** Limit price (limit orders) or trigger price (stop orders). */
  price?: number;
  placedDay: number;
}

export interface Position {
  qty: number;
  /** Total cost of the shares still held, fees included (for the average buy price). */
  cost: number;
}

export type LogEntry =
  | { day: number; kind: 'fill'; instrument: InstrumentId; side: Side; type: OrderType; qty: number; price: number; fee: number; gain?: number }
  | { day: number; kind: 'rejected'; instrument: InstrumentId; side: Side; qty: number; reason: 'cash' | 'shares' }
  | { day: number; kind: 'dividend'; instrument: InstrumentId; qty: number; gross: number; tax: number }
  | { day: number; kind: 'news'; instrument: InstrumentId | null; key: string; move: number };

export interface GameState {
  version: 1;
  seed: number;
  days: number;
  day: number;
  cash: number;
  positions: Partial<Record<InstrumentId, Position>>;
  orders: Order[];
  nextOrderId: number;
  log: LogEntry[];
  realized: number;
  fees: number;
  dividendTax: number;
  /** Portfolio value at each day's close, from day 0. */
  values: number[];
}

export function newGame(seed: number, days: number): GameState {
  return {
    version: 1,
    seed,
    days,
    day: 0,
    cash: START_CASH,
    positions: {},
    orders: [],
    nextOrderId: 1,
    log: [],
    realized: 0,
    fees: 0,
    dividendTax: 0,
    values: [START_CASH],
  };
}

export const priceAt = (m: Market, id: InstrumentId, day: number) => m.bars[id][barIndex(day)];

export function portfolioValue(g: GameState, m: Market, day = g.day): number {
  let v = g.cash;
  for (const [id, p] of Object.entries(g.positions) as [InstrumentId, Position][]) v += p.qty * priceAt(m, id, day).c;
  return round2(v);
}

/** Shares already promised to open sell orders, and cash reserved for open buy orders (at today's close). */
function reserved(g: GameState, m: Market) {
  const shares: Partial<Record<InstrumentId, number>> = {};
  let cash = 0;
  for (const o of g.orders) {
    if (o.side === 'sell') shares[o.instrument] = (shares[o.instrument] ?? 0) + o.qty;
    else cash += estimateCost(m, g.day, o.instrument, o.qty, o.type === 'limit' ? o.price : undefined);
  }
  return { shares, cash };
}

/** Estimated cost of a buy order: the limit price, or today's close plus half the spread, plus the fee. */
export function estimateCost(m: Market, day: number, id: InstrumentId, qty: number, limit?: number): number {
  const ins = instrument(id);
  const px = limit ?? priceAt(m, id, day).c * (1 + ins.spread / 2);
  return round2(qty * px + ORDER_FEE);
}

export type OrderError = 'qty' | 'price' | 'cash' | 'shares' | 'over';

/** Checks an order before it is accepted. Returns null when it can be placed. */
export function validateOrder(g: GameState, m: Market, o: Omit<Order, 'id' | 'placedDay'>): OrderError | null {
  if (g.day >= g.days) return 'over';
  if (!Number.isInteger(o.qty) || o.qty < 1) return 'qty';
  if (o.type !== 'market' && !(typeof o.price === 'number' && o.price > 0 && Number.isFinite(o.price))) return 'price';
  const r = reserved(g, m);
  if (o.side === 'buy') {
    if (o.type === 'stop') return 'price'; // stop orders are sell-only (stop-loss) in this game
    if (estimateCost(m, g.day, o.instrument, o.qty, o.type === 'limit' ? o.price : undefined) > g.cash - r.cash + 1e-9) return 'cash';
  } else {
    const held = g.positions[o.instrument]?.qty ?? 0;
    if (o.qty > held - (r.shares[o.instrument] ?? 0)) return 'shares';
  }
  return null;
}

export function placeOrder(g: GameState, m: Market, o: Omit<Order, 'id' | 'placedDay'>): { state: GameState; error: OrderError | null } {
  const error = validateOrder(g, m, o);
  if (error) return { state: g, error };
  const order: Order = { ...o, price: o.type === 'market' ? undefined : round2(o.price!), id: g.nextOrderId, placedDay: g.day };
  return { state: { ...g, orders: [...g.orders, order], nextOrderId: g.nextOrderId + 1 }, error: null };
}

export const cancelOrder = (g: GameState, id: number): GameState => ({ ...g, orders: g.orders.filter((o) => o.id !== id) });

/** The fill price for an order on a bar, or null if it does not execute that day. */
export function fillPrice(o: Order, bar: Bar, spread: number): number | null {
  const half = spread / 2;
  if (o.type === 'market') return round2(o.side === 'buy' ? bar.o * (1 + half) : bar.o * (1 - half));
  const p = o.price!;
  if (o.type === 'limit') {
    if (o.side === 'buy') return bar.l <= p ? round2(Math.min(bar.o, p)) : null;
    return bar.h >= p ? round2(Math.max(bar.o, p)) : null;
  }
  // Stop-loss (sell): triggers when the price falls to the stop, then sells like a market order.
  // If the share opens below the stop (a gap), the fill is at the lower open price.
  return bar.l <= p ? round2(Math.min(bar.o, p) * (1 - half)) : null;
}

/** Moves the game forward by one trading day. */
export function nextDay(g: GameState, m: Market): GameState {
  if (g.day >= g.days) return g;
  const day = g.day + 1;
  const s: GameState = { ...g, day, positions: { ...g.positions }, orders: [], log: [...g.log], values: [...g.values] };
  for (const n of m.news) if (n.day === day) s.log.push({ day, kind: 'news', instrument: n.id, key: n.key, move: n.move });

  for (const o of g.orders) {
    const ins = instrument(o.instrument);
    const px = fillPrice(o, priceAt(m, o.instrument, day), ins.spread);
    if (px == null) {
      s.orders.push(o);
      continue;
    }
    const pos = s.positions[o.instrument] ?? { qty: 0, cost: 0 };
    if (o.side === 'buy') {
      const total = round2(o.qty * px + ORDER_FEE);
      if (total > s.cash + 1e-9) {
        s.log.push({ day, kind: 'rejected', instrument: o.instrument, side: 'buy', qty: o.qty, reason: 'cash' });
        continue;
      }
      s.cash = round2(s.cash - total);
      s.positions[o.instrument] = { qty: pos.qty + o.qty, cost: round2(pos.cost + total) };
      s.fees += ORDER_FEE;
      s.log.push({ day, kind: 'fill', instrument: o.instrument, side: 'buy', type: o.type, qty: o.qty, price: px, fee: ORDER_FEE });
    } else {
      if (o.qty > pos.qty) {
        s.log.push({ day, kind: 'rejected', instrument: o.instrument, side: 'sell', qty: o.qty, reason: 'shares' });
        continue;
      }
      const proceeds = round2(o.qty * px - ORDER_FEE);
      const costPart = round2((pos.cost * o.qty) / pos.qty);
      const gain = round2(proceeds - costPart);
      s.cash = round2(s.cash + proceeds);
      s.realized = round2(s.realized + gain);
      s.fees += ORDER_FEE;
      const left = pos.qty - o.qty;
      if (left === 0) delete s.positions[o.instrument];
      else s.positions[o.instrument] = { qty: left, cost: round2(pos.cost - costPart) };
      s.log.push({ day, kind: 'fill', instrument: o.instrument, side: 'sell', type: o.type, qty: o.qty, price: px, fee: ORDER_FEE, gain });
    }
  }

  // Dividends: paid on the ex-day to shares held at the previous close; Austrian KESt is withheld.
  for (const ins of INSTRUMENTS) {
    const held = g.positions[ins.id]?.qty ?? 0;
    if (ins.dividend && ins.dividend.day === day && held > 0) {
      const gross = round2(held * ins.dividend.perShare);
      const tax = round2(gross * KEST);
      s.cash = round2(s.cash + gross - tax);
      s.dividendTax = round2(s.dividendTax + tax);
      s.log.push({ day, kind: 'dividend', instrument: ins.id, qty: held, gross, tax });
    }
  }
  s.values.push(portfolioValue(s, m, day));
  return s;
}

export function advance(g: GameState, m: Market, days: number): GameState {
  let s = g;
  for (let i = 0; i < days && s.day < s.days; i++) s = nextDay(s, m);
  return s;
}

/** Ends the game early: the remaining days pass with no new orders (open orders stay in the market). */
export const finish = (g: GameState, m: Market) => advance(g, m, g.days - g.day);

/** Largest fall from a previous high, as a negative fraction (−0.12 = −12%). */
export function maxDrawdown(values: number[]): number {
  let peak = values[0] ?? 0;
  let worst = 0;
  for (const v of values) {
    peak = Math.max(peak, v);
    if (peak > 0) worst = Math.min(worst, v / peak - 1);
  }
  return worst;
}

/** "Buy the index fund on day 1 and do nothing": whole shares at the day-1 open, one order fee. */
export function benchmarkValues(m: Market): number[] {
  const ins = instrument('world-etf');
  const first = priceAt(m, 'world-etf', 1);
  const px = round2(first.o * (1 + ins.spread / 2));
  const qty = Math.floor((START_CASH - ORDER_FEE) / px);
  const cash = round2(START_CASH - ORDER_FEE - qty * px);
  const values = [START_CASH];
  for (let d = 1; d <= m.days; d++) values.push(round2(cash + qty * priceAt(m, 'world-etf', d).c));
  return values;
}

export interface Summary {
  final: number;
  returnPct: number;
  benchmark: number;
  benchmarkPct: number;
  trades: number;
  fees: number;
  realized: number;
  /** Simplified KESt estimate on net realised gains (only if positive). */
  taxEstimate: number;
  dividendTax: number;
  drawdown: number;
  benchmarkDrawdown: number;
  news: number;
}

export function summarize(g: GameState, m: Market): Summary {
  const final = portfolioValue(g, m);
  const bench = benchmarkValues(m);
  const benchmark = bench[Math.min(g.day, bench.length - 1)];
  return {
    final,
    returnPct: final / START_CASH - 1,
    benchmark,
    benchmarkPct: benchmark / START_CASH - 1,
    trades: g.log.filter((e) => e.kind === 'fill').length,
    fees: g.fees,
    realized: g.realized,
    taxEstimate: round2(Math.max(0, g.realized) * KEST),
    dividendTax: g.dividendTax,
    drawdown: maxDrawdown(g.values),
    benchmarkDrawdown: maxDrawdown(bench.slice(0, g.day + 1)),
    news: g.log.filter((e) => e.kind === 'news').length,
  };
}

/** A random seed for a new game (5 digits, easy to share: "play market 48213 again"). */
export const randomSeed = () => 10_000 + Math.floor(Math.random() * 90_000);
