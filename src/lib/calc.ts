/**
 * Maths for the calculators on /tools. Pure functions, unit-tested in tests/calc.test.ts.
 * Amounts are plain numbers (euros unless stated); rates are fractions (0.05 = 5%).
 * Educational estimates only: no taxes or fees beyond what the inputs describe.
 */

/** Austrian special tax rate on capital gains and dividends of shares and funds (KESt). */
export const KEST_RATE = 0.275;

// ---------------------------------------------------------------------------
// 1. Profit and loss
// ---------------------------------------------------------------------------

export interface TradeInput {
  shares: number;
  buyPrice: number;
  sellPrice: number;
  buyFee: number;
  sellFee: number;
  /** Dividends received while holding (total, before tax). */
  dividends?: number;
}

export interface TradeResult {
  invested: number;
  proceeds: number;
  /** Profit after fees, before tax. */
  profit: number;
  /** profit ÷ invested (invested includes the buying fee). */
  returnPct: number;
  /** Gain used for the Austrian KESt estimate: sale price minus purchase price, fees not deductible. */
  taxableGain: number;
  kest: number;
  profitAfterTax: number;
}

/**
 * Profit or loss of one round trip. The KESt estimate follows the Austrian rule for private investors
 * that purchase and sale costs cannot be deducted: the taxable gain is (sale − purchase) × shares,
 * plus dividends. A negative taxable gain gives no tax (losses can only be offset against other income).
 */
export function tradeResult(t: TradeInput, kestRate = KEST_RATE): TradeResult {
  const dividends = t.dividends ?? 0;
  const invested = t.shares * t.buyPrice + t.buyFee;
  const proceeds = t.shares * t.sellPrice - t.sellFee;
  const profit = proceeds - invested + dividends;
  const taxableGain = t.shares * (t.sellPrice - t.buyPrice) + dividends;
  const kest = Math.max(0, taxableGain) * kestRate;
  return {
    invested,
    proceeds,
    profit,
    returnPct: invested > 0 ? profit / invested : 0,
    taxableGain,
    kest,
    profitAfterTax: profit - kest,
  };
}

// ---------------------------------------------------------------------------
// 2. Dividends  ·  3. Valuation ratios
// ---------------------------------------------------------------------------

/** Dividend yield = dividend per share ÷ share price. */
export const dividendYield = (dps: number, price: number) => (price > 0 ? dps / price : NaN);
/** Payout ratio = dividend per share ÷ earnings per share. */
export const payoutRatio = (dps: number, eps: number) => (eps !== 0 ? dps / eps : NaN);

export interface Valuation {
  eps: number;
  pe: number;
  earningsYield: number;
  bookValuePerShare: number;
  pb: number;
  marketCap: number;
}

/** EPS = net profit ÷ shares; P/E = price ÷ EPS; book value per share = equity ÷ shares; P/B = price ÷ BVPS. */
export function valuation(price: number, netProfit: number, equity: number, shares: number): Valuation {
  const eps = shares > 0 ? netProfit / shares : NaN;
  const bvps = shares > 0 ? equity / shares : NaN;
  return {
    eps,
    pe: eps > 0 ? price / eps : NaN,
    earningsYield: price > 0 ? eps / price : NaN,
    bookValuePerShare: bvps,
    pb: bvps > 0 ? price / bvps : NaN,
    marketCap: price * shares,
  };
}

// ---------------------------------------------------------------------------
// 4. Compound growth  ·  5. Savings plan
// ---------------------------------------------------------------------------

export interface YearPoint {
  year: number;
  /** Value at the end of the year. */
  value: number;
  /** Total money paid in by then. */
  paidIn: number;
}

/**
 * Growth of a one-off amount plus an optional yearly contribution (paid at the start of each year),
 * with a given return per year. `returns` can override single years (e.g. a crash year).
 */
export function compoundPath(start: number, yearlyAdd: number, rate: number, years: number, returns: Record<number, number> = {}): YearPoint[] {
  const out: YearPoint[] = [{ year: 0, value: start, paidIn: start }];
  let value = start;
  let paidIn = start;
  for (let y = 1; y <= years; y++) {
    value += yearlyAdd;
    paidIn += yearlyAdd;
    value *= 1 + (returns[y] ?? rate);
    out.push({ year: y, value, paidIn });
  }
  return out;
}

/** Today's purchasing power of a future amount after `years` of inflation. */
export const realValue = (nominal: number, inflation: number, years: number) => nominal / (1 + inflation) ** years;

/** The rate that turns `start` into `end` over `years` (compound annual growth rate). */
export const cagr = (start: number, end: number, years: number) => (start > 0 && years > 0 ? (end / start) ** (1 / years) - 1 : NaN);

export interface SavingsPlanInput {
  monthly: number;
  years: number;
  /** Expected yearly return before fund costs. */
  rate: number;
  /** Fee per purchase as a fraction of the amount (e.g. 0.015 = 1.5%). */
  feePct: number;
  /** Fixed fee per purchase in euros. */
  feeFixed: number;
  /** Yearly fund costs (TER), deducted from the return. */
  ter: number;
}

export interface SavingsPlanResult {
  paidIn: number;
  purchaseFees: number;
  /** End value with all costs. */
  value: number;
  /** End value of the same plan without any costs, for comparison. */
  valueNoCosts: number;
  /** Total cost of fees and fund costs: valueNoCosts − value. */
  costImpact: number;
  path: { year: number; value: number; paidIn: number; valueNoCosts: number }[];
}

/** Monthly savings plan: buy at the start of each month, monthly compounding of (rate − TER). */
export function savingsPlan(p: SavingsPlanInput): SavingsPlanResult {
  const months = Math.round(p.years * 12);
  const mNet = (1 + p.rate - p.ter) ** (1 / 12) - 1;
  const mGross = (1 + p.rate) ** (1 / 12) - 1;
  let value = 0;
  let valueNoCosts = 0;
  let paidIn = 0;
  let purchaseFees = 0;
  const path = [{ year: 0, value: 0, paidIn: 0, valueNoCosts: 0 }];
  for (let m = 1; m <= months; m++) {
    const fee = Math.min(p.monthly, p.monthly * p.feePct + p.feeFixed);
    purchaseFees += fee;
    paidIn += p.monthly;
    value = (value + p.monthly - fee) * (1 + mNet);
    valueNoCosts = (valueNoCosts + p.monthly) * (1 + mGross);
    if (m % 12 === 0) path.push({ year: m / 12, value, paidIn, valueNoCosts });
  }
  return { paidIn, purchaseFees, value, valueNoCosts, costImpact: valueNoCosts - value, path };
}

// ---------------------------------------------------------------------------
// 6. Position size  ·  7. Break-even
// ---------------------------------------------------------------------------

export interface PositionSize {
  riskAmount: number;
  riskPerShare: number;
  shares: number;
  positionValue: number;
  /** Position value as a share of the account. */
  positionPct: number;
  /** True when the position would need more money than the account holds. */
  needsLeverage: boolean;
}

/** Shares = (account × risk %) ÷ (entry − stop), rounded down. Works for short positions too (stop above entry). */
export function positionSize(account: number, riskPct: number, entry: number, stop: number): PositionSize {
  const riskAmount = account * riskPct;
  const riskPerShare = Math.abs(entry - stop);
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
  const positionValue = shares * entry;
  return { riskAmount, riskPerShare, shares, positionValue, positionPct: account > 0 ? positionValue / account : 0, needsLeverage: positionValue > account };
}

export interface BreakEven {
  totalPaid: number;
  /** Bid price at which selling returns exactly what was paid. */
  breakEvenPrice: number;
  /** Rise the bid needs from the current bid, as a fraction. */
  requiredRise: number;
}

/** Break-even = (shares × ask + buying fee + selling fee) ÷ shares; the bid must reach it. */
export function breakEven(shares: number, ask: number, bid: number, buyFee: number, sellFee: number): BreakEven {
  const totalPaid = shares * ask + buyFee;
  const breakEvenPrice = shares > 0 ? (totalPaid + sellFee) / shares : NaN;
  return { totalPaid, breakEvenPrice, requiredRise: bid > 0 ? breakEvenPrice / bid - 1 : NaN };
}

// ---------------------------------------------------------------------------
// 8. Leverage and margin
// ---------------------------------------------------------------------------

export interface LeverageResult {
  exposure: number;
  /** Profit or loss on the position for the given price move. */
  pnl: number;
  /** pnl ÷ own money. */
  returnOnEquity: number;
  equityAfter: number;
  /** Price move (fraction, negative for a long position) that wipes out the own money. */
  wipeOutMove: number;
  /** Price move at which the position is closed when equity falls to `closeOut` of the margin. */
  closeOutMove: number;
}

/**
 * A leveraged long (or short) position: own money × leverage = exposure. The margin is the own money;
 * with a margin close-out at 50% (the EU rule for retail CFDs), the position is closed once losses reach
 * half the margin, i.e. after a price move of 0.5 ÷ leverage.
 */
export function leverage(ownMoney: number, lev: number, priceMove: number, direction: 'long' | 'short' = 'long', closeOut = 0.5): LeverageResult {
  const exposure = ownMoney * lev;
  const sign = direction === 'long' ? 1 : -1;
  const pnl = exposure * priceMove * sign;
  return {
    exposure,
    pnl,
    returnOnEquity: ownMoney > 0 ? pnl / ownMoney : 0,
    equityAfter: ownMoney + pnl,
    wipeOutMove: (-1 / lev) * sign,
    closeOutMove: (-(1 - closeOut) / lev) * sign,
  };
}

// ---------------------------------------------------------------------------
// 9. Splits and rights issues
// ---------------------------------------------------------------------------

export interface SplitResult {
  sharesAfter: number;
  priceAfter: number;
  valueBefore: number;
  valueAfter: number;
  /** Shares that do not divide evenly in a reverse split (usually paid out in cash). */
  fractionalShares: number;
}

/** A split of `newShares` for `oldShares` (2-for-1 → 2, 1; reverse 1-for-10 → 1, 10). Value does not change. */
export function split(shares: number, price: number, newShares: number, oldShares: number): SplitResult {
  const exact = (shares * newShares) / oldShares;
  const sharesAfter = Math.floor(exact + 1e-9);
  const priceAfter = (price * oldShares) / newShares;
  return {
    sharesAfter,
    priceAfter,
    valueBefore: shares * price,
    valueAfter: sharesAfter * priceAfter,
    fractionalShares: exact - sharesAfter,
  };
}

export interface RightsResult {
  /** Theoretical share price after the issue (ex-rights). */
  terp: number;
  /** Theoretical value of one subscription right. */
  rightValue: number;
  newSharesYouCanBuy: number;
  costToSubscribe: number;
  /** Your holding if you subscribe (old + new shares at TERP). */
  valueIfSubscribe: number;
  /** Your holding if you sell all rights: old shares at TERP plus the rights' value. */
  valueIfSell: number;
}

/**
 * Rights issue: `ratio` old shares entitle you to buy one new share at `subscriptionPrice`.
 * TERP = (ratio × price + subscriptionPrice) ÷ (ratio + 1); right value = (price − subscriptionPrice) ÷ (ratio + 1).
 */
export function rightsIssue(shares: number, price: number, ratio: number, subscriptionPrice: number): RightsResult {
  const terp = (ratio * price + subscriptionPrice) / (ratio + 1);
  const rightValue = (price - subscriptionPrice) / (ratio + 1);
  const newSharesYouCanBuy = Math.floor(shares / ratio + 1e-9);
  const costToSubscribe = newSharesYouCanBuy * subscriptionPrice;
  return {
    terp,
    rightValue,
    newSharesYouCanBuy,
    costToSubscribe,
    valueIfSubscribe: (shares + newSharesYouCanBuy) * terp,
    valueIfSell: shares * terp + shares * rightValue,
  };
}

// ---------------------------------------------------------------------------
// 12. Currency effect
// ---------------------------------------------------------------------------

export interface CurrencyResult {
  /** Return in the share's currency. */
  localReturn: number;
  /** Change of the foreign currency against the euro (positive = the foreign currency gained). */
  currencyEffect: number;
  /** Return in euros. */
  eurReturn: number;
  eurStart: number;
  eurEnd: number;
}

/**
 * A US share bought for euros. `eurUsdStart`/`eurUsdEnd` are quoted as US dollars per euro (EUR/USD 1.10).
 * Euro return = (1 + dollar return) × (EUR/USD at purchase ÷ EUR/USD at sale) − 1.
 */
export function currencyEffect(amountEur: number, priceStart: number, priceEnd: number, eurUsdStart: number, eurUsdEnd: number): CurrencyResult {
  const localReturn = priceEnd / priceStart - 1;
  const currencyEffect = eurUsdStart / eurUsdEnd - 1;
  const eurReturn = (1 + localReturn) * (1 + currencyEffect) - 1;
  return { localReturn, currencyEffect, eurReturn, eurStart: amountEur, eurEnd: amountEur * (1 + eurReturn) };
}

// ---------------------------------------------------------------------------
// 14. Candlestick builder
// ---------------------------------------------------------------------------

export interface CandleCheck {
  valid: boolean;
  /** Problems with the inputs, e.g. "high below open". */
  problems: string[];
  direction: 'up' | 'down' | 'flat';
  body: number;
  upperWick: number;
  lowerWick: number;
  range: number;
  /** Body as a share of the whole range. */
  bodyShare: number;
}

export function checkCandle(o: number, h: number, l: number, c: number): CandleCheck {
  const problems: string[] = [];
  if (h < Math.max(o, c)) problems.push('The high must be at least as high as the open and the close.');
  if (l > Math.min(o, c)) problems.push('The low must be at most as low as the open and the close.');
  if (h < l) problems.push('The high cannot be below the low.');
  const range = h - l;
  const body = Math.abs(c - o);
  return {
    valid: problems.length === 0,
    problems,
    direction: c > o ? 'up' : c < o ? 'down' : 'flat',
    body,
    upperWick: h - Math.max(o, c),
    lowerWick: Math.min(o, c) - l,
    range,
    bodyShare: range > 0 ? body / range : 0,
  };
}
