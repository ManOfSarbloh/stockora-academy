/**
 * Bookbuilding maths for the IPO pricing simulator. Investors place orders: how many shares
 * they want and the highest price they will pay. Pure functions, unit-tested.
 */

export interface BookOrder {
  investor: string;
  shares: number;
  /** Highest price per share the investor will pay. */
  maxPrice: number;
}

/** Total shares wanted by investors willing to pay at least `price`. */
export function demandAt(orders: BookOrder[], price: number): number {
  return orders.reduce((s, o) => (o.maxPrice >= price - 1e-9 ? s + o.shares : s), 0);
}

/** Demand divided by the number of shares offered (2 = "covered twice"). */
export function coverage(orders: BookOrder[], price: number, offered: number): number {
  return offered > 0 ? demandAt(orders, price) / offered : 0;
}

/** Prices from `low` to `high` in steps of `step` (inclusive, rounded to cents). */
export function priceSteps(low: number, high: number, step: number): number[] {
  const out: number[] = [];
  if (!(step > 0) || high < low) return out;
  for (let p = low; p <= high + 1e-9; p += step) out.push(Math.round(p * 100) / 100);
  return out;
}

/** The highest price in the range at which demand still covers all shares offered, or undefined. */
export function highestCoveredPrice(orders: BookOrder[], offered: number, low: number, high: number, step: number): number | undefined {
  const covered = priceSteps(low, high, step).filter((p) => demandAt(orders, p) >= offered);
  return covered.length ? covered[covered.length - 1] : undefined;
}

export interface Allocation {
  investor: string;
  ordered: number;
  allocated: number;
}

/**
 * Pro-rata allocation at `price`: orders below the price get nothing; if the book is
 * oversubscribed, every remaining order is filled in the same proportion (rounded down).
 * Real allocations are decided by the company and its banks and are often not pro rata.
 */
export function allocate(orders: BookOrder[], price: number, offered: number): Allocation[] {
  const demand = demandAt(orders, price);
  const ratio = demand > offered ? offered / demand : 1;
  return orders.map((o) => ({
    investor: o.investor,
    ordered: o.shares,
    allocated: o.maxPrice >= price - 1e-9 ? Math.floor(o.shares * ratio) : 0,
  }));
}

export interface OfferSummary {
  demand: number;
  coverage: number;
  sold: number;
  /** Money paid by investors: price × shares sold. */
  proceeds: number;
  /** Price × all shares of the company (not just those sold). */
  marketCap: number;
  /** Shares wanted at this price but not allocated. */
  unfilled: number;
  /** Fraction of each eligible order that is filled (0–1). */
  fillRate: number;
}

export function summarise(orders: BookOrder[], price: number, offered: number, totalSharesAfter: number): OfferSummary {
  const demand = demandAt(orders, price);
  const sold = Math.min(demand, offered);
  return {
    demand,
    coverage: coverage(orders, price, offered),
    sold,
    proceeds: sold * price,
    marketCap: price * totalSharesAfter,
    unfilled: Math.max(0, demand - offered),
    fillRate: demand > 0 ? sold / demand : 0,
  };
}
