/**
 * The calculators on /tools/<slug>. Each one is a small React island built on the pure functions in
 * src/lib/calc.ts and the shared pieces in ./ui. Every calculator shows its formula.
 */
import { useMemo, useState } from 'react';
import { t } from '@/i18n';
import { eur, eurCents, int, pct } from '@/lib/format';
import { url } from '@/lib/url';
import { COLORS } from '@/lib/chart/svg';
import {
  KEST_RATE,
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
} from '@/lib/calc';
import { CalcLayout, Formula, LineChart, Note, NumField, Results, Row, Select } from './ui';

const signedEur = (n: number) => `${n > 0 ? '+' : ''}${eurCents(n)}`;
const signedPct = (n: number, d = 1) => (Number.isFinite(n) ? `${n > 0 ? '+' : ''}${pct(n, d)}` : '–');
const num = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString('en', { maximumFractionDigits: d, minimumFractionDigits: d }) : '–');
const tone = (n: number) => (n > 0 ? 'good' : n < 0 ? 'bad' : undefined);

// ---------------------------------------------------------------------------
// 1. Profit and loss
// ---------------------------------------------------------------------------
export function ProfitLossCalculator() {
  const [shares, setShares] = useState(100);
  const [buy, setBuy] = useState(50);
  const [sell, setSell] = useState(60);
  const [buyFee, setBuyFee] = useState(5);
  const [sellFee, setSellFee] = useState(5);
  const [div, setDiv] = useState(0);
  const r = tradeResult({ shares, buyPrice: buy, sellPrice: sell, buyFee, sellFee, dividends: div });
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.shares')} value={shares} onChange={setShares} step={1} min={0} />
          <NumField label={t('calc.buyPrice')} value={buy} onChange={setBuy} unit="€" min={0} />
          <NumField label={t('calc.sellPrice')} value={sell} onChange={setSell} unit="€" min={0} />
          <NumField label={t('calc.buyFee')} value={buyFee} onChange={setBuyFee} unit="€" min={0} />
          <NumField label={t('calc.sellFee')} value={sellFee} onChange={setSellFee} unit="€" min={0} />
          <NumField label={t('calc.dividends')} value={div} onChange={setDiv} unit="€" min={0} help={t('calc.dividendsHelp')} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.invested')} value={eurCents(r.invested)} />
            <Row label={t('calc.proceeds')} value={eurCents(r.proceeds)} />
            <Row label={t('calc.profitBeforeTax')} value={signedEur(r.profit)} tone={tone(r.profit)} strong />
            <Row label={t('calc.return')} value={signedPct(r.returnPct, 2)} tone={tone(r.profit)} />
            <Row label={t('calc.taxableGain')} value={signedEur(r.taxableGain)} />
            <Row label={t('calc.kest', { rate: pct(KEST_RATE) })} value={eurCents(r.kest)} />
            <Row label={t('calc.profitAfterTax')} value={signedEur(r.profitAfterTax)} tone={tone(r.profitAfterTax)} strong />
          </Results>
          <Note kind="warning">{t('calc.kestNote')}</Note>
          <Formula>
            <p>{t('calc.f.pl1')}</p>
            <p>{t('calc.f.pl2')}</p>
            <p>{t('calc.f.pl3')}</p>
          </Formula>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 2. Dividend yield and payout ratio
// ---------------------------------------------------------------------------
export function DividendCalculator() {
  const [price, setPrice] = useState(50);
  const [dps, setDps] = useState(2);
  const [eps, setEps] = useState(4);
  const [shares, setShares] = useState(100);
  const y = dividendYield(dps, price);
  const p = payoutRatio(dps, eps);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.price')} value={price} onChange={setPrice} unit="€" min={0} />
          <NumField label={t('calc.dps')} value={dps} onChange={setDps} unit="€" min={0} />
          <NumField label={t('calc.eps')} value={eps} onChange={setEps} unit="€" />
          <NumField label={t('calc.sharesYouOwn')} value={shares} onChange={setShares} step={1} min={0} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.dividendYield')} value={Number.isFinite(y) ? pct(y, 2) : '–'} strong />
            <Row label={t('calc.payoutRatio')} value={Number.isFinite(p) ? pct(p, 1) : '–'} strong />
            <Row label={t('calc.yourDividend')} value={eurCents(shares * dps)} />
            <Row label={t('calc.yourDividendAfterKest')} value={eurCents(shares * dps * (1 - KEST_RATE))} />
          </Results>
          {Number.isFinite(p) && p > 1 && <Note kind="warning">{t('calc.payoutOver100')}</Note>}
          <Formula>
            <p>{t('calc.f.yield')}</p>
            <p>{t('calc.f.payout')}</p>
          </Formula>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 3. P/E, EPS, P/B
// ---------------------------------------------------------------------------
export function ValuationCalculator() {
  const [price, setPrice] = useState(30);
  const [profit, setProfit] = useState(20);
  const [equity, setEquity] = useState(100);
  const [shares, setShares] = useState(10);
  const v = valuation(price, profit * 1e6, equity * 1e6, shares * 1e6);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.price')} value={price} onChange={setPrice} unit="€" min={0} />
          <NumField label={t('calc.netProfit')} value={profit} onChange={setProfit} unit={t('calc.millionEur')} />
          <NumField label={t('calc.equity')} value={equity} onChange={setEquity} unit={t('calc.millionEur')} />
          <NumField label={t('calc.sharesOutstanding')} value={shares} onChange={setShares} unit={t('calc.million')} min={0} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.eps')} value={Number.isFinite(v.eps) ? eurCents(v.eps) : '–'} />
            <Row label={t('calc.pe')} value={num(v.pe, 1)} strong />
            <Row label={t('calc.earningsYield')} value={Number.isFinite(v.earningsYield) ? pct(v.earningsYield, 2) : '–'} />
            <Row label={t('calc.bvps')} value={Number.isFinite(v.bookValuePerShare) ? eurCents(v.bookValuePerShare) : '–'} />
            <Row label={t('calc.pb')} value={num(v.pb, 2)} strong />
            <Row label={t('calc.marketCap')} value={eur(v.marketCap)} />
          </Results>
          {!(v.eps > 0) && <Note kind="warning">{t('calc.noPe')}</Note>}
          <Formula>
            <p>{t('calc.f.eps')}</p>
            <p>{t('calc.f.pe')}</p>
            <p>{t('calc.f.pb')}</p>
          </Formula>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 4. Compound growth
// ---------------------------------------------------------------------------
export function CompoundCalculator() {
  const [start, setStart] = useState(10_000);
  const [yearly, setYearly] = useState(1_200);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);
  const [inflation, setInflation] = useState(2);
  const [crash, setCrash] = useState(30);
  const [crashYear, setCrashYear] = useState(20);
  const Y = Math.max(1, Math.min(60, Math.round(years)));
  const cy = Math.max(1, Math.min(Y, Math.round(crashYear)));
  const base = compoundPath(start, yearly, rate / 100, Y);
  const crashPath = compoundPath(start, yearly, rate / 100, Y, { [cy]: -crash / 100 });
  const end = base[Y].value;
  const realEnd = realValue(end, inflation / 100, Y);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.startAmount')} value={start} onChange={setStart} unit="€" min={0} />
          <NumField label={t('calc.yearlyAdd')} value={yearly} onChange={setYearly} unit="€" min={0} />
          <NumField label={t('calc.yearlyReturn')} value={rate} onChange={setRate} unit="%" />
          <NumField label={t('calc.years')} value={years} onChange={setYears} step={1} min={1} max={60} />
          <NumField label={t('calc.inflation')} value={inflation} onChange={setInflation} unit="%" />
          <NumField label={t('calc.crash')} value={crash} onChange={setCrash} unit="%" min={0} max={100} help={t('calc.crashHelp')} />
          <NumField label={t('calc.crashYear')} value={crashYear} onChange={setCrashYear} step={1} min={1} max={Y} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.paidIn')} value={eur(base[Y].paidIn)} />
            <Row label={t('calc.endValue')} value={eur(end)} strong />
            <Row label={t('calc.growth')} value={eur(end - base[Y].paidIn)} tone="good" />
            <Row label={t('calc.realEndValue', { rate: inflation })} value={eur(realEnd)} />
            <Row label={t('calc.endWithCrash', { pct: crash, year: cy })} value={eur(crashPath[Y].value)} tone="bad" />
          </Results>
          <Note kind="warning">{t('calc.notGuaranteed')}</Note>
          <Formula>
            <p>{t('calc.f.compound')}</p>
            <p>{t('calc.f.real')}</p>
          </Formula>
        </>
      }
      wide={
        <LineChart
          ariaLabel={t('calc.compoundChart')}
          xTitle={t('calc.year')}
          xLabels={base.map((p) => p.year)}
          format={(v) => eur(v)}
          series={[
            { key: 'base', name: t('calc.s.expected', { rate }), color: 'var(--series-1)', values: base.map((p) => p.value) },
            { key: 'crash', name: t('calc.s.crash', { pct: crash, year: cy }), color: 'var(--series-2)', values: crashPath.map((p) => p.value) },
            { key: 'real', name: t('calc.s.real'), color: 'var(--series-3)', values: base.map((p) => realValue(p.value, inflation / 100, p.year)), dashed: true },
            { key: 'paid', name: t('calc.s.paidIn'), color: 'var(--muted)', values: base.map((p) => p.paidIn), dashed: true },
          ]}
        />
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 5. Savings plan
// ---------------------------------------------------------------------------
export function SavingsPlanCalculator() {
  const [monthly, setMonthly] = useState(100);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(6);
  const [feePct, setFeePct] = useState(1.5);
  const [feeFixed, setFeeFixed] = useState(0);
  const [ter, setTer] = useState(0.2);
  const Y = Math.max(1, Math.min(50, Math.round(years)));
  const r = useMemo(
    () => savingsPlan({ monthly, years: Y, rate: rate / 100, feePct: feePct / 100, feeFixed, ter: ter / 100 }),
    [monthly, Y, rate, feePct, feeFixed, ter],
  );
  const effective = cagr(r.paidIn, r.value, Y);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.monthly')} value={monthly} onChange={setMonthly} unit="€" min={0} />
          <NumField label={t('calc.years')} value={years} onChange={setYears} step={1} min={1} max={50} />
          <NumField label={t('calc.yearlyReturnBeforeCosts')} value={rate} onChange={setRate} unit="%" />
          <NumField label={t('calc.feePct')} value={feePct} onChange={setFeePct} unit="%" min={0} />
          <NumField label={t('calc.feeFixed')} value={feeFixed} onChange={setFeeFixed} unit="€" min={0} />
          <NumField label={t('calc.ter')} value={ter} onChange={setTer} unit="%" min={0} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.paidIn')} value={eur(r.paidIn)} />
            <Row label={t('calc.purchaseFees')} value={eur(r.purchaseFees)} />
            <Row label={t('calc.endValue')} value={eur(r.value)} strong />
            <Row label={t('calc.endValueNoCosts')} value={eur(r.valueNoCosts)} />
            <Row label={t('calc.costImpact')} value={eur(r.costImpact)} tone="bad" strong />
          </Results>
          {Number.isFinite(effective) && <p className="mt-3 text-sm text-muted">{t('calc.costShare', { pct: pct(r.costImpact / r.valueNoCosts) })}</p>}
          <Note kind="warning">{t('calc.notGuaranteed')}</Note>
          <Formula>
            <p>{t('calc.f.plan1')}</p>
            <p>{t('calc.f.plan2')}</p>
          </Formula>
        </>
      }
      wide={
        <LineChart
          ariaLabel={t('calc.planChart')}
          xTitle={t('calc.year')}
          xLabels={r.path.map((p) => p.year)}
          format={(v) => eur(v)}
          series={[
            { key: 'nc', name: t('calc.s.noCosts'), color: 'var(--series-1)', values: r.path.map((p) => p.valueNoCosts) },
            { key: 'v', name: t('calc.s.withCosts'), color: 'var(--series-2)', values: r.path.map((p) => p.value) },
            { key: 'p', name: t('calc.s.paidIn'), color: 'var(--muted)', values: r.path.map((p) => p.paidIn), dashed: true },
          ]}
        />
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 6. Position size
// ---------------------------------------------------------------------------
export function PositionSizeCalculator() {
  const [account, setAccount] = useState(10_000);
  const [risk, setRisk] = useState(1);
  const [entry, setEntry] = useState(50);
  const [stop, setStop] = useState(47.5);
  const p = positionSize(account, risk / 100, entry, stop);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.account')} value={account} onChange={setAccount} unit="€" min={0} />
          <NumField label={t('calc.riskPct')} value={risk} onChange={setRisk} unit="%" min={0} max={100} />
          <NumField label={t('calc.entry')} value={entry} onChange={setEntry} unit="€" min={0} />
          <NumField label={t('calc.stop')} value={stop} onChange={setStop} unit="€" min={0} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.riskAmount')} value={eurCents(p.riskAmount)} />
            <Row label={t('calc.riskPerShare')} value={eurCents(p.riskPerShare)} />
            <Row label={t('calc.shares')} value={int(p.shares)} strong />
            <Row label={t('calc.positionValue')} value={eurCents(p.positionValue)} />
            <Row label={t('calc.positionPct')} value={pct(p.positionPct)} />
          </Results>
          {p.needsLeverage && <Note kind="warning">{t('calc.needsLeverage')}</Note>}
          <Note>{t('calc.stopNote')}</Note>
          <Formula>
            <p>{t('calc.f.position')}</p>
          </Formula>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 7. Break-even
// ---------------------------------------------------------------------------
export function BreakEvenCalculator() {
  const [shares, setShares] = useState(100);
  const [ask, setAsk] = useState(50.05);
  const [bid, setBid] = useState(50);
  const [buyFee, setBuyFee] = useState(5);
  const [sellFee, setSellFee] = useState(5);
  const b = breakEven(shares, ask, bid, buyFee, sellFee);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.shares')} value={shares} onChange={setShares} step={1} min={1} />
          <NumField label={t('calc.ask')} value={ask} onChange={setAsk} unit="€" min={0} />
          <NumField label={t('calc.bid')} value={bid} onChange={setBid} unit="€" min={0} />
          <NumField label={t('calc.buyFee')} value={buyFee} onChange={setBuyFee} unit="€" min={0} />
          <NumField label={t('calc.sellFee')} value={sellFee} onChange={setSellFee} unit="€" min={0} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.totalPaid')} value={eurCents(b.totalPaid)} />
            <Row label={t('calc.breakEvenPrice')} value={Number.isFinite(b.breakEvenPrice) ? eurCents(b.breakEvenPrice) : '–'} strong />
            <Row label={t('calc.requiredRise')} value={signedPct(b.requiredRise, 2)} strong />
          </Results>
          <Note>{t('calc.breakEvenNote')}</Note>
          <Formula>
            <p>{t('calc.f.breakEven')}</p>
          </Formula>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 8. Leverage and margin
// ---------------------------------------------------------------------------
export function LeverageCalculator() {
  const [own, setOwn] = useState(1_000);
  const [lev, setLev] = useState(5);
  const [move, setMove] = useState(-5);
  const [dir, setDir] = useState<'long' | 'short'>('long');
  const L = Math.max(1, lev);
  const r = leverage(own, L, move / 100, dir);
  const moves = [-20, -15, -10, -5, -2, 0, 2, 5, 10, 15, 20];
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.ownMoney')} value={own} onChange={setOwn} unit="€" min={0} />
          <NumField label={t('calc.leverage')} value={lev} onChange={setLev} unit=": 1" min={1} max={100} />
          <Select
            label={t('calc.direction')}
            value={dir}
            onChange={setDir}
            options={[
              { v: 'long', label: t('calc.long') },
              { v: 'short', label: t('calc.short') },
            ]}
          />
          <NumField label={t('calc.priceMove')} value={move} onChange={setMove} unit="%" />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.exposure')} value={eur(r.exposure)} />
            <Row label={t('calc.pnl')} value={signedEur(r.pnl)} tone={tone(r.pnl)} strong />
            <Row label={t('calc.returnOnOwn')} value={signedPct(r.returnOnEquity)} tone={tone(r.pnl)} strong />
            <Row label={t('calc.equityAfter')} value={eurCents(r.equityAfter)} />
            <Row label={t('calc.closeOutAt')} value={signedPct(r.closeOutMove, 2)} />
            <Row label={t('calc.wipeOutAt')} value={signedPct(r.wipeOutMove, 2)} />
          </Results>
          {r.equityAfter < 0 && <Note kind="warning">{t('calc.negativeEquity')}</Note>}
          <Note>{t('calc.closeOutNote')}</Note>
          <Formula>
            <p>{t('calc.f.leverage1')}</p>
            <p>{t('calc.f.leverage2')}</p>
          </Formula>
        </>
      }
      wide={
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm tabular-nums">
            <caption className="mb-2 text-left font-semibold">{t('calc.leverageTable', { lev: L })}</caption>
            <thead>
              <tr className="text-muted">
                <th className="px-2 py-1 text-left">{t('calc.priceMove')}</th>
                <th className="px-2 py-1">{t('calc.withoutLeverage')}</th>
                <th className="px-2 py-1">{t('calc.withLeverage', { lev: L })}</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((m) => {
                const x = leverage(own, L, m / 100, dir);
                const plain = leverage(own, 1, m / 100, dir);
                return (
                  <tr key={m} className="border-t border-border">
                    <td className="px-2 py-1 text-left">{signedPct(m / 100, 0)}</td>
                    <td className="px-2 py-1">{signedPct(plain.returnOnEquity, 0)}</td>
                    <td className={`px-2 py-1 font-semibold ${x.returnOnEquity <= -1 ? 'text-[#c2410c] dark:text-[#fb923c]' : ''}`}>
                      {x.returnOnEquity <= -1 ? t('calc.wipedOut') : signedPct(x.returnOnEquity, 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 9. Splits and rights issues
// ---------------------------------------------------------------------------
export function SplitRightsCalculator() {
  const [mode, setMode] = useState<'split' | 'rights'>('split');
  const [shares, setShares] = useState(100);
  const [price, setPrice] = useState(80);
  const [newS, setNewS] = useState(2);
  const [oldS, setOldS] = useState(1);
  const [ratio, setRatio] = useState(4);
  const [sub, setSub] = useState(16);
  const [rPrice, setRPrice] = useState(20);
  const s = split(shares, price, Math.max(1, newS), Math.max(1, oldS));
  const r = rightsIssue(shares, rPrice, Math.max(1, ratio), sub);
  return (
    <CalcLayout
      inputs={
        <>
          <Select
            label={t('calc.action')}
            value={mode}
            onChange={setMode}
            options={[
              { v: 'split', label: t('calc.splitMode') },
              { v: 'rights', label: t('calc.rightsMode') },
            ]}
          />
          <NumField label={t('calc.sharesYouOwn')} value={shares} onChange={setShares} step={1} min={0} />
          {mode === 'split' ? (
            <>
              <NumField label={t('calc.price')} value={price} onChange={setPrice} unit="€" min={0} />
              <div className="grid grid-cols-2 gap-3">
                <NumField label={t('calc.newShares')} value={newS} onChange={setNewS} step={1} min={1} />
                <NumField label={t('calc.forOld')} value={oldS} onChange={setOldS} step={1} min={1} />
              </div>
              <p className="text-xs text-muted">{t('calc.splitHelp')}</p>
            </>
          ) : (
            <>
              <NumField label={t('calc.priceBefore')} value={rPrice} onChange={setRPrice} unit="€" min={0} />
              <NumField label={t('calc.rightsRatio')} value={ratio} onChange={setRatio} step={1} min={1} help={t('calc.rightsRatioHelp')} />
              <NumField label={t('calc.subscriptionPrice')} value={sub} onChange={setSub} unit="€" min={0} />
            </>
          )}
        </>
      }
      results={
        mode === 'split' ? (
          <>
            <Results>
              <Row label={t('calc.sharesAfter')} value={int(s.sharesAfter)} strong />
              <Row label={t('calc.priceAfter')} value={eurCents(s.priceAfter)} strong />
              <Row label={t('calc.valueBefore')} value={eurCents(s.valueBefore)} />
              <Row label={t('calc.valueAfter')} value={eurCents(s.valueAfter)} />
              {s.fractionalShares > 1e-9 && <Row label={t('calc.fractions')} value={num(s.fractionalShares, 3)} />}
            </Results>
            <Note>{t('calc.splitNote')}</Note>
            <Formula>
              <p>{t('calc.f.split')}</p>
            </Formula>
          </>
        ) : (
          <>
            <Results>
              <Row label={t('calc.terp')} value={eurCents(r.terp)} strong />
              <Row label={t('calc.rightValue')} value={eurCents(r.rightValue)} strong />
              <Row label={t('calc.newSharesYouCanBuy')} value={int(r.newSharesYouCanBuy)} />
              <Row label={t('calc.costToSubscribe')} value={eurCents(r.costToSubscribe)} />
              <Row label={t('calc.valueIfSubscribe')} value={eurCents(r.valueIfSubscribe)} />
              <Row label={t('calc.valueIfSell')} value={eurCents(r.valueIfSell)} />
              <Row label={t('calc.valueIfNothing')} value={eurCents(shares * r.terp)} tone="bad" />
            </Results>
            <Note kind="warning">{t('calc.rightsNote')}</Note>
            <Formula>
              <p>{t('calc.f.terp')}</p>
              <p>{t('calc.f.right')}</p>
            </Formula>
          </>
        )
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 12. Currency effect
// ---------------------------------------------------------------------------
export function CurrencyCalculator() {
  const [amount, setAmount] = useState(1_000);
  const [p0, setP0] = useState(100);
  const [p1, setP1] = useState(110);
  const [fx0, setFx0] = useState(1.1);
  const [fx1, setFx1] = useState(1.2);
  const r = currencyEffect(amount, p0, p1, fx0, fx1);
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.amountEur')} value={amount} onChange={setAmount} unit="€" min={0} />
          <NumField label={t('calc.usdPriceBuy')} value={p0} onChange={setP0} unit="$" min={0} />
          <NumField label={t('calc.usdPriceSell')} value={p1} onChange={setP1} unit="$" min={0} />
          <NumField label={t('calc.eurUsdBuy')} value={fx0} onChange={setFx0} min={0} help={t('calc.eurUsdHelp')} />
          <NumField label={t('calc.eurUsdSell')} value={fx1} onChange={setFx1} min={0} />
        </>
      }
      results={
        <>
          <Results>
            <Row label={t('calc.returnInUsd')} value={signedPct(r.localReturn)} tone={tone(r.localReturn)} />
            <Row label={t('calc.currencyEffect')} value={signedPct(r.currencyEffect)} tone={tone(r.currencyEffect)} />
            <Row label={t('calc.returnInEur')} value={signedPct(r.eurReturn)} tone={tone(r.eurReturn)} strong />
            <Row label={t('calc.valueInEur')} value={eurCents(r.eurEnd)} strong />
          </Results>
          <Note>{t('calc.currencyNote')}</Note>
          <Formula>
            <p>{t('calc.f.currency1')}</p>
            <p>{t('calc.f.currency2')}</p>
          </Formula>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// 14. Candlestick builder
// ---------------------------------------------------------------------------
export function CandleBuilder() {
  const [o, setO] = useState(100);
  const [h, setH] = useState(108);
  const [l, setL] = useState(97);
  const [c, setC] = useState(105);
  const k = checkCandle(o, h, l, c);
  const lo = Math.min(o, h, l, c);
  const hi = Math.max(o, h, l, c);
  const span = hi - lo || 1;
  const Y = (v: number) => 20 + (1 - (v - lo) / span) * 220;
  const up = c >= o;
  const color = k.direction === 'up' ? COLORS.up : k.direction === 'down' ? COLORS.down : 'var(--muted)';
  const describe =
    k.bodyShare < 0.1
      ? t('calc.candle.doji')
      : k.lowerWick >= 2 * k.body && k.upperWick <= k.body
        ? t('calc.candle.longLower')
        : k.upperWick >= 2 * k.body && k.lowerWick <= k.body
          ? t('calc.candle.longUpper')
          : k.bodyShare > 0.8
            ? t('calc.candle.bigBody')
            : t('calc.candle.normal');
  return (
    <CalcLayout
      inputs={
        <>
          <NumField label={t('calc.open')} value={o} onChange={setO} />
          <NumField label={t('calc.high')} value={h} onChange={setH} />
          <NumField label={t('calc.low')} value={l} onChange={setL} />
          <NumField label={t('calc.close')} value={c} onChange={setC} />
        </>
      }
      results={
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <svg viewBox="0 0 160 260" className="mx-auto h-64 w-40" role="img" aria-label={t('calc.candleChart', { o, h, l, c })}>
            {k.valid && (
              <>
                <line x1={80} x2={80} y1={Y(h)} y2={Y(l)} stroke={color} strokeWidth={3} />
                <rect x={55} width={50} y={Y(Math.max(o, c))} height={Math.max(2, Math.abs(Y(o) - Y(c)))} rx={3} fill={up ? 'var(--surface)' : color} stroke={color} strokeWidth={3} />
                {(
                  [
                    ['H', h],
                    ['L', l],
                    ['O', o],
                    ['C', c],
                  ] as const
                ).map(([lab, v]) => (
                  <text key={lab} x={lab === 'O' || lab === 'L' ? 10 : 150} y={Y(v) + 4} fontSize={12} textAnchor={lab === 'O' || lab === 'L' ? 'start' : 'end'} fill="var(--muted)">
                    {lab} {v}
                  </text>
                ))}
              </>
            )}
          </svg>
          <div>
            {!k.valid ? (
              <ul className="callout callout-warning space-y-1 text-sm">
                {k.problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : (
              <>
                <Results>
                  <Row label={t('calc.direction')} value={k.direction === 'up' ? t('calc.dirUp') : k.direction === 'down' ? t('calc.dirDown') : t('calc.dirFlat')} />
                  <Row label={t('calc.body')} value={num(k.body)} />
                  <Row label={t('calc.upperWick')} value={num(k.upperWick)} />
                  <Row label={t('calc.lowerWick')} value={num(k.lowerWick)} />
                  <Row label={t('calc.bodyShare')} value={pct(k.bodyShare, 0)} />
                </Results>
                <p className="mt-3 text-sm">{describe}</p>
              </>
            )}
            <p className="mt-3 text-sm">
              <a href={url('/charts/candles')}>{t('calc.toEncyclopedia')} →</a>
            </p>
          </div>
        </div>
      }
    />
  );
}
