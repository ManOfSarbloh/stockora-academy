import { describe, expect, it } from 'vitest';
import {
  breakEven,
  cagr,
  checkCandle,
  compoundPath,
  currencyEffect,
  dividendYield,
  leverage,
  payoutRatio,
  positionSize,
  realValue,
  rightsIssue,
  savingsPlan,
  split,
  tradeResult,
  valuation,
} from '../src/lib/calc';

const close = (a: number, b: number, d = 6) => expect(a).toBeCloseTo(b, d);

describe('profit and loss with KESt estimate', () => {
  it('computes profit after fees and tax on the gain without fees', () => {
    const r = tradeResult({ shares: 100, buyPrice: 50, sellPrice: 60, buyFee: 5, sellFee: 5 });
    expect(r.invested).toBe(5005);
    expect(r.proceeds).toBe(5995);
    expect(r.profit).toBe(990);
    close(r.returnPct, 990 / 5005);
    expect(r.taxableGain).toBe(1000); // fees are not deductible
    close(r.kest, 275);
    close(r.profitAfterTax, 715);
  });
  it('charges no tax on a loss and adds dividends', () => {
    const loss = tradeResult({ shares: 10, buyPrice: 100, sellPrice: 80, buyFee: 0, sellFee: 0 });
    expect(loss.kest).toBe(0);
    expect(loss.profit).toBe(-200);
    const div = tradeResult({ shares: 10, buyPrice: 100, sellPrice: 100, buyFee: 0, sellFee: 0, dividends: 40 });
    close(div.kest, 11);
  });
});

describe('dividends and valuation', () => {
  it('yield and payout ratio', () => {
    close(dividendYield(2, 50), 0.04);
    close(payoutRatio(2, 5), 0.4);
    expect(Number.isNaN(dividendYield(2, 0))).toBe(true);
  });
  it('EPS, P/E, P/B', () => {
    const v = valuation(30, 20_000_000, 100_000_000, 10_000_000);
    close(v.eps, 2);
    close(v.pe, 15);
    close(v.earningsYield, 2 / 30);
    close(v.bookValuePerShare, 10);
    close(v.pb, 3);
    expect(v.marketCap).toBe(300_000_000);
  });
  it('a loss-making company has no meaningful P/E', () => {
    expect(Number.isNaN(valuation(30, -5, 100, 10).pe)).toBe(true);
  });
});

describe('compound growth', () => {
  it('grows a one-off amount', () => {
    const p = compoundPath(10_000, 0, 0.05, 10);
    close(p[10].value, 10_000 * 1.05 ** 10, 4);
    expect(p).toHaveLength(11);
  });
  it('adds yearly contributions at the start of each year', () => {
    const p = compoundPath(0, 1000, 0.1, 2);
    close(p[2].value, (1000 * 1.1 + 1000) * 1.1);
    expect(p[2].paidIn).toBe(2000);
  });
  it('can replace a year with a crash', () => {
    const p = compoundPath(10_000, 0, 0.05, 3, { 3: -0.3 });
    close(p[3].value, 10_000 * 1.05 * 1.05 * 0.7);
  });
  it('inflation and CAGR', () => {
    close(realValue(12_100, 0.1, 2), 10_000);
    close(cagr(100, 121, 2), 0.1);
  });
});

describe('savings plan', () => {
  it('without costs equals a plain monthly compounding', () => {
    const r = savingsPlan({ monthly: 100, years: 1, rate: 0, feePct: 0, feeFixed: 0, ter: 0 });
    expect(r.paidIn).toBe(1200);
    close(r.value, 1200);
    close(r.costImpact, 0);
  });
  it('fees and TER reduce the end value', () => {
    const r = savingsPlan({ monthly: 100, years: 10, rate: 0.06, feePct: 0.015, feeFixed: 0, ter: 0.002 });
    close(r.purchaseFees, 120 * 1.5);
    expect(r.value).toBeLessThan(r.valueNoCosts);
    expect(r.path).toHaveLength(11);
    close(r.costImpact, r.valueNoCosts - r.value);
  });
  it('a fixed fee can never exceed the instalment', () => {
    const r = savingsPlan({ monthly: 1, years: 1, rate: 0, feePct: 0, feeFixed: 5, ter: 0 });
    expect(r.purchaseFees).toBe(12);
    close(r.value, 0);
  });
});

describe('position size and break-even', () => {
  it('sizes a position from the risk per trade', () => {
    const p = positionSize(10_000, 0.01, 50, 48);
    expect(p.riskAmount).toBe(100);
    expect(p.shares).toBe(50);
    expect(p.positionValue).toBe(2500);
    close(p.positionPct, 0.25);
    expect(p.needsLeverage).toBe(false);
  });
  it('flags positions larger than the account', () => {
    expect(positionSize(1000, 0.02, 100, 99.9).needsLeverage).toBe(true);
    expect(positionSize(1000, 0.02, 100, 100).shares).toBe(0);
  });
  it('break-even matches the lesson example', () => {
    const b = breakEven(100, 50.05, 50, 5, 5);
    close(b.totalPaid, 5010);
    close(b.breakEvenPrice, 50.15);
    close(b.requiredRise, 0.003);
  });
});

describe('leverage', () => {
  it('magnifies gains and losses', () => {
    const r = leverage(1000, 10, -0.05);
    expect(r.exposure).toBe(10_000);
    close(r.pnl, -500);
    close(r.returnOnEquity, -0.5);
    close(r.wipeOutMove, -0.1);
    close(r.closeOutMove, -0.05);
  });
  it('works for short positions', () => {
    const r = leverage(1000, 5, 0.04, 'short');
    close(r.pnl, -200);
    close(r.wipeOutMove, 0.2);
  });
});

describe('splits and rights issues', () => {
  it('a 2-for-1 split keeps the value', () => {
    const s = split(100, 80, 2, 1);
    expect(s.sharesAfter).toBe(200);
    close(s.priceAfter, 40);
    close(s.valueAfter, s.valueBefore);
  });
  it('a 1-for-10 reverse split leaves fractions', () => {
    const s = split(105, 0.5, 1, 10);
    expect(s.sharesAfter).toBe(10);
    close(s.priceAfter, 5);
    close(s.fractionalShares, 0.5);
  });
  it('rights issue matches the Alpenrad lesson example', () => {
    const r = rightsIssue(400, 20, 4, 16);
    close(r.terp, 19.2);
    close(r.rightValue, 0.8);
    expect(r.newSharesYouCanBuy).toBe(100);
    close(r.costToSubscribe, 1600);
    close(r.valueIfSubscribe, 9600);
    close(r.valueIfSell, 8000);
  });
});

describe('currency effect', () => {
  it('a weaker dollar reduces the euro return', () => {
    const r = currencyEffect(1000, 100, 110, 1.0, 1.1);
    close(r.localReturn, 0.1);
    close(r.currencyEffect, 1 / 1.1 - 1);
    close(r.eurReturn, 0);
    close(r.eurEnd, 1000);
  });
});

describe('candlestick builder', () => {
  it('measures a valid candle', () => {
    const c = checkCandle(10, 12, 9, 11);
    expect(c.valid).toBe(true);
    expect(c.direction).toBe('up');
    expect(c.body).toBe(1);
    expect(c.upperWick).toBe(1);
    expect(c.lowerWick).toBe(1);
    close(c.bodyShare, 1 / 3);
  });
  it('rejects impossible prices', () => {
    const c = checkCandle(10, 9, 8, 11);
    expect(c.valid).toBe(false);
    expect(c.problems.length).toBeGreaterThan(0);
  });
});
