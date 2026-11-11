import { describe, expect, it } from 'vitest';
import {
  HISTORY_DAYS,
  PLAN_EVERY,
  PLAN_FEE,
  addResult,
  bestResults,
  INSTRUMENTS,
  KEST,
  ORDER_FEE,
  START_CASH,
  advance,
  benchmarkValues,
  cancelOrder,
  fillPrice,
  finish,
  maxDrawdown,
  newGame,
  nextDay,
  placeOrder,
  portfolioValue,
  priceAt,
  simulateMarket,
  summarize,
  type Order,
} from '../src/lib/paper-game';

const m = simulateMarket(48213, 120);

describe('simulated market', () => {
  it('is deterministic for a seed and different for another', () => {
    expect(simulateMarket(48213, 120)).toEqual(m);
    expect(simulateMarket(48214, 120).bars.alpenbyte[100].c).not.toBe(m.bars.alpenbyte[100].c);
  });
  it('has history plus one bar per game day, with consistent OHLC', () => {
    for (const ins of INSTRUMENTS) {
      const bars = m.bars[ins.id];
      expect(bars).toHaveLength(HISTORY_DAYS + 120);
      for (const b of bars) {
        expect(b.h).toBeGreaterThanOrEqual(Math.max(b.o, b.c));
        expect(b.l).toBeLessThanOrEqual(Math.min(b.o, b.c));
        expect(b.l).toBeGreaterThan(0);
      }
    }
  });
  it('only puts news inside the game', () => {
    for (const n of m.news) {
      expect(n.day).toBeGreaterThanOrEqual(1);
      expect(n.day).toBeLessThanOrEqual(120);
    }
  });
});

describe('fills', () => {
  const bar = { o: 100, h: 104, l: 95, c: 98 };
  const order = (o: Partial<Order>): Order => ({ id: 1, instrument: 'alpenbyte', side: 'buy', type: 'market', qty: 1, placedDay: 0, ...o });
  it('fills market orders at the open plus or minus half the spread', () => {
    expect(fillPrice(order({}), bar, 0.002)).toBe(100.1);
    expect(fillPrice(order({ side: 'sell' }), bar, 0.002)).toBe(99.9);
  });
  it('fills limit orders only when the price reaches the limit, at the limit or better', () => {
    expect(fillPrice(order({ type: 'limit', price: 96 }), bar, 0)).toBe(96);
    expect(fillPrice(order({ type: 'limit', price: 94 }), bar, 0)).toBeNull();
    expect(fillPrice(order({ type: 'limit', price: 101 }), bar, 0)).toBe(100); // opens below the limit
    expect(fillPrice(order({ side: 'sell', type: 'limit', price: 103 }), bar, 0)).toBe(103);
    expect(fillPrice(order({ side: 'sell', type: 'limit', price: 105 }), bar, 0)).toBeNull();
  });
  it('sells a stop-loss below the stop when the price gaps down', () => {
    expect(fillPrice(order({ side: 'sell', type: 'stop', price: 97 }), bar, 0)).toBe(97);
    expect(fillPrice(order({ side: 'sell', type: 'stop', price: 102 }), bar, 0)).toBe(100); // gap: open is already below
    expect(fillPrice(order({ side: 'sell', type: 'stop', price: 90 }), bar, 0)).toBeNull();
  });
});

describe('orders and portfolio', () => {
  it('buys at the next open and charges the fee', () => {
    let g = newGame(48213, 120);
    const r = placeOrder(g, m, { instrument: 'world-etf', side: 'buy', type: 'market', qty: 10 });
    expect(r.error).toBeNull();
    g = nextDay(r.state, m);
    const fill = g.log.find((e) => e.kind === 'fill');
    expect(fill).toBeDefined();
    const px = priceAt(m, 'world-etf', 1).o;
    expect(g.positions['world-etf']?.qty).toBe(10);
    expect(g.cash).toBeCloseTo(START_CASH - 10 * px * 1.00025 - ORDER_FEE, 1);
    expect(g.fees).toBe(ORDER_FEE);
    expect(g.values).toHaveLength(2);
    expect(g.values[1]).toBe(portfolioValue(g, m));
  });
  it('refuses orders it cannot pay for or shares it does not hold', () => {
    const g = newGame(48213, 120);
    expect(placeOrder(g, m, { instrument: 'world-etf', side: 'buy', type: 'market', qty: 1000 }).error).toBe('cash');
    expect(placeOrder(g, m, { instrument: 'alpenbyte', side: 'sell', type: 'market', qty: 1 }).error).toBe('shares');
    expect(placeOrder(g, m, { instrument: 'alpenbyte', side: 'buy', type: 'market', qty: 0 }).error).toBe('qty');
    expect(placeOrder(g, m, { instrument: 'alpenbyte', side: 'buy', type: 'limit', qty: 1 }).error).toBe('price');
    expect(placeOrder(g, m, { instrument: 'alpenbyte', side: 'buy', type: 'stop', qty: 1, price: 40 }).error).toBe('price');
  });
  it('reserves cash for open buy orders', () => {
    let g = newGame(48213, 120);
    const half = Math.floor((START_CASH * 0.6) / priceAt(m, 'world-etf', 0).c);
    g = placeOrder(g, m, { instrument: 'world-etf', side: 'buy', type: 'market', qty: half }).state;
    expect(placeOrder(g, m, { instrument: 'world-etf', side: 'buy', type: 'market', qty: half }).error).toBe('cash');
  });
  it('keeps unfilled limit orders and can cancel them', () => {
    let g = newGame(48213, 120);
    g = placeOrder(g, m, { instrument: 'alpenbyte', side: 'buy', type: 'limit', qty: 5, price: 1 }).state;
    g = nextDay(g, m);
    expect(g.orders).toHaveLength(1);
    g = cancelOrder(g, g.orders[0].id);
    expect(g.orders).toHaveLength(0);
  });
  it('books realised gains net of fees and keeps the average cost', () => {
    let g = newGame(48213, 120);
    g = nextDay(placeOrder(g, m, { instrument: 'tirolbank', side: 'buy', type: 'market', qty: 100 }).state, m);
    const cost = g.positions.tirolbank!.cost;
    g = nextDay(placeOrder(g, m, { instrument: 'tirolbank', side: 'sell', type: 'market', qty: 40 }).state, m);
    const sell = g.log.filter((e) => e.kind === 'fill').at(-1)!;
    expect(sell.kind === 'fill' && sell.side).toBe('sell');
    const proceeds = 40 * (sell.kind === 'fill' ? sell.price : 0) - ORDER_FEE;
    expect(g.realized).toBeCloseTo(proceeds - cost * 0.4, 1);
    expect(g.positions.tirolbank!.qty).toBe(60);
    expect(g.positions.tirolbank!.cost).toBeCloseTo(cost * 0.6, 1);
  });
  it('pays the dividend on the ex-day with KESt withheld', () => {
    let g = newGame(48213, 120);
    g = nextDay(placeOrder(g, m, { instrument: 'donaustrom', side: 'buy', type: 'market', qty: 100 }).state, m);
    g = advance(g, m, 45);
    const div = g.log.find((e) => e.kind === 'dividend');
    expect(div).toMatchObject({ kind: 'dividend', day: 45, qty: 100, gross: 80, tax: 80 * KEST });
    expect(g.dividendTax).toBe(22);
  });
  it('finishes the game and stops there', () => {
    const g = finish(newGame(48213, 60), simulateMarket(48213, 60));
    expect(g.day).toBe(60);
    expect(g.values).toHaveLength(61);
    expect(nextDay(g, simulateMarket(48213, 60))).toBe(g);
    expect(placeOrder(g, m, { instrument: 'world-etf', side: 'buy', type: 'market', qty: 1 }).error).toBe('over');
  });
});

describe('summary', () => {
  it('measures the largest drawdown', () => {
    expect(maxDrawdown([100, 120, 90, 130, 117])).toBeCloseTo(-0.25);
    expect(maxDrawdown([100, 101, 102])).toBe(0);
  });
  it('compares with buying the index fund on day 1 and holding it', () => {
    const bench = benchmarkValues(m);
    expect(bench).toHaveLength(121);
    expect(bench[0]).toBe(START_CASH);
    let g = newGame(48213, 120);
    g = finish(g, m);
    const s = summarize(g, m);
    expect(s.final).toBe(START_CASH); // did nothing: cash only
    expect(s.returnPct).toBe(0);
    expect(s.benchmark).toBe(bench[120]);
    expect(s.trades).toBe(0);
    expect(s.taxEstimate).toBe(0);
  });
});

describe('market types', () => {
  const etfMove = (sc: 'mixed' | 'calm' | 'crash' | 'sideways', seed: number) => {
    const mk = simulateMarket(seed, 120, sc);
    const b = mk.bars['world-etf'];
    let peak = 0;
    let dd = 0;
    for (let i = HISTORY_DAYS - 1; i < b.length; i++) {
      peak = Math.max(peak, b[i].c);
      dd = Math.min(dd, b[i].c / peak - 1);
    }
    return { end: b.at(-1)!.c / b[HISTORY_DAYS - 1].c - 1, dd };
  };
  it('keeps "mixed" identical to the original market for old market numbers', () => {
    expect(simulateMarket(48213, 120, 'mixed')).toEqual(m);
  });
  it('crashes in a crash year and stays quieter in a calm one', () => {
    for (const seed of [11111, 22222, 33333]) {
      expect(etfMove('crash', seed).dd).toBeLessThan(-0.2);
      expect(etfMove('calm', seed).dd).toBeGreaterThan(-0.1);
      expect(Math.abs(etfMove('sideways', seed).end)).toBeLessThan(0.15);
    }
    expect(simulateMarket(11111, 120, 'crash').news.some((n) => n.key === 'market.crash')).toBe(true);
  });
});

describe('savings plan', () => {
  it('buys the index fund for the plan amount on day 1 and then every month', () => {
    let g = newGame(48213, 120, { plan: 500 });
    g = advance(g, m, 120);
    const buys = g.log.filter((e) => e.kind === 'fill' && e.plan);
    expect(buys.map((b) => b.day)).toEqual([1, 1 + PLAN_EVERY, 1 + 2 * PLAN_EVERY, 1 + 3 * PLAN_EVERY, 1 + 4 * PLAN_EVERY, 1 + 5 * PLAN_EVERY]);
    for (const b of buys) if (b.kind === 'fill') expect(b.qty * b.price + PLAN_FEE).toBeLessThanOrEqual(500 + 1e-9);
    expect(summarize(g, m).planBuys).toBe(6);
    expect(summarize(g, m).trades).toBe(0);
    expect(g.fees).toBeCloseTo(6 * PLAN_FEE);
  });
  it('skips a plan purchase when the cash has run out', () => {
    const g = nextDay({ ...newGame(48213, 120, { plan: 1000 }), cash: 50 }, m);
    expect(g.log).toContainEqual({ day: 1, kind: 'plan-skipped', amount: 1000 });
    expect(g.cash).toBe(50);
  });
});

describe('results history', () => {
  const e = (seed: number, returnPct: number, date: string) => ({ seed, days: 120, scenario: 'mixed' as const, plan: 0, returnPct, benchmarkPct: 0.05, date });
  it('keeps the best result per market and counts plays', () => {
    let list = addResult([], e(1, 0.02, '2026-11-01'));
    list = addResult(list, e(2, -0.1, '2026-11-02'));
    list = addResult(list, e(1, 0.08, '2026-11-03'));
    list = addResult(list, e(1, -0.03, '2026-11-04'));
    const best = bestResults(list);
    expect(best.map((b) => [b.seed, b.returnPct, b.plays])).toEqual([
      [1, 0.08, 3],
      [2, -0.1, 1],
    ]);
  });
});
