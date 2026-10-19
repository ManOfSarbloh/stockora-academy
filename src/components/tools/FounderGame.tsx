/**
 * "Build your own company": a short, clearly fictional play-money game that walks through the
 * journey: legal form, share capital, seed round, option pool, Series A and the IPO.
 * Finishing it is remembered in localStorage ("stockora-founder-game") for the badges in Phase 9.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '@/i18n';
import { ownership, priceRound, totalShares } from '@/lib/captable';
import {
  FOUNDING_SHARES,
  IPO_OPTIONS,
  IPO_RAISE,
  MIN_CAPITAL,
  POOL_OPTIONS,
  SEED_OFFERS,
  SELL_OPTIONS,
  SERIES_A_OFFERS,
  founders,
  playGame,
  type LegalForm,
  type RoundOffer,
} from '@/lib/founder-game';
import { eur, eurCents, eurShort, int, pct } from '@/lib/format';
import { writeJSON } from '@/lib/storage';
import { StackedBars, seriesColor, seriesInk, type BarRow } from './StackedBars';

const STAGES = ['name', 'form', 'capital', 'seed', 'pool', 'seriesA', 'ipo', 'result'] as const;
type Stage = (typeof STAGES)[number];

const slotFor = (id: string) => ({ f1: 1, f2: 2, pool: 3, r1: 4, r2: 5, public: 6 })[id] ?? 7;

function Choice(props: { name: string; checked: boolean; onChange: () => void; title: string; body?: string; aside?: string }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 px-3 py-2.5 transition-colors ${props.checked ? 'border-link' : 'border-border hover:border-link'}`}
    >
      <input type="radio" name={props.name} className="mt-1 accent-[var(--link)]" checked={props.checked} onChange={props.onChange} />
      <span className="flex-1">
        <span className="font-semibold">{props.title}</span>
        {props.body && <span className="mt-0.5 block text-sm text-muted">{props.body}</span>}
      </span>
      {props.aside && <span className="shrink-0 text-sm font-semibold tabular-nums">{props.aside}</span>}
    </label>
  );
}

export default function FounderGame() {
  const [stage, setStage] = useState<Stage>('name');
  const [company, setCompany] = useState('Alpenbyte');
  const [form, setForm] = useState<LegalForm | null>(null);
  const [converted, setConverted] = useState(false);
  const [capital, setCapital] = useState(100_000);
  const [yourPct, setYourPct] = useState(0.6);
  const [seed, setSeed] = useState<RoundOffer | null>(null);
  const [pool, setPool] = useState<number | null>(null);
  const [seriesA, setSeriesA] = useState<RoundOffer | null>(null);
  const [ipoId, setIpoId] = useState<(typeof IPO_OPTIONS)[number]['id'] | null>(null);
  const [sellPct, setSellPct] = useState<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  const step = STAGES.indexOf(stage);
  const go = (s: Stage) => setStage(s);
  useEffect(() => {
    // Move focus to the new question, but not on first render (that would scroll the page).
    if (started.current) headingRef.current?.focus();
    started.current = true;
  }, [stage]);

  const name = company.trim() || 'Alpenbyte';
  const legalSuffix = form === 'gmbh' && !converted ? 'GmbH' : 'AG';
  const ipo = IPO_OPTIONS.find((o) => o.id === ipoId) ?? null;

  const result = useMemo(
    () =>
      seed && seriesA && ipo && pool !== null
        ? playGame({ yourPct, seed, poolPct: pool, seriesA, ipo: { preMoney: ipo.preMoney, coverage: ipo.coverage }, sellPct })
        : null,
    [yourPct, seed, pool, seriesA, ipo, sellPct],
  );

  useEffect(() => {
    if (stage === 'result') writeJSON('founder-game', { completed: true, date: new Date().toISOString() });
  }, [stage]);

  /** Your ownership after a hypothetical round, for showing the effect of each offer. */
  const yourAfter = (offer: RoundOffer, beforeSeed: boolean) => {
    let h = founders(yourPct);
    if (!beforeSeed && seed) h = priceRound(h, seed.investment, seed.preMoney, 'r1', '').holders;
    const r = priceRound(h, offer.investment, offer.preMoney, 'x', '').holders;
    return (r.find((x) => x.id === 'f1')?.shares ?? 0) / totalShares(r);
  };

  const restart = () => {
    setStage('name');
    setForm(null);
    setConverted(false);
    setCapital(100_000);
    setYourPct(0.6);
    setSeed(null);
    setPool(null);
    setSeriesA(null);
    setIpoId(null);
    setSellPct(0);
  };

  // A plain render helper, not a component: a component defined inside render would remount on every update.
  const nav = (next: Stage, disabled?: boolean, label?: string) => (
    <div className="mt-5 flex flex-wrap gap-2">
      {step > 0 && (
        <button type="button" className="btn btn-ghost" onClick={() => go(STAGES[step - 1])}>
          {t('game.back')}
        </button>
      )}
      <button type="button" className="btn btn-primary disabled:opacity-50" disabled={disabled} onClick={() => go(next)}>
        {label ?? t('game.next')}
      </button>
    </div>
  );

  const heading = (text: string) => (
    <h3 ref={headingRef} tabIndex={-1} className="text-base font-bold outline-none sm:text-lg">
      {text}
    </h3>
  );

  return (
    <div className="card p-4 sm:p-6">
      {/* The surrounding page section supplies the title and introduction. */}
      <p className="text-xs font-semibold text-muted" aria-live="polite">
        {stage === 'result' ? t('game.done') : t('game.progress', { n: step + 1, total: STAGES.length - 1 })}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${(step / (STAGES.length - 1)) * 100}%` }} />
      </div>

      <div className="mt-5">
        {stage === 'name' && (
          <>
            {heading(t('game.name.q'))}
            <label className="mt-3 flex flex-col gap-1 text-sm">
              <span className="text-muted">{t('game.name.label')}</span>
              <input
                className="w-full max-w-xs rounded-lg border border-border bg-surface px-3 py-2 text-text"
                value={company}
                maxLength={24}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
            {nav('form', false, t('game.start'))}
          </>
        )}

        {stage === 'form' && (
          <>
            {heading(t('game.form.q', { name }))}
            <div className="mt-3 space-y-2" role="radiogroup">
              {(['sole', 'gmbh', 'ag'] as const).map((f) => (
                <Choice key={f} name="form" checked={form === f} onChange={() => setForm(f)} title={t(`game.form.${f}`)} body={t(`game.form.${f}.body`)} />
              ))}
            </div>
            {form && (
              <div className={`callout mt-4 ${form === 'sole' ? 'callout-warning' : 'callout-tip'}`} aria-live="polite">
                <p>{t(`game.form.${form}.feedback`)}</p>
              </div>
            )}
            {nav('capital', !form || form === 'sole')}
          </>
        )}

        {stage === 'capital' && form && (
          <>
            {heading(t('game.capital.q', { name: `${name} ${legalSuffix}` }))}
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted">{t('game.capital.label', { min: eur(MIN_CAPITAL[form]) })}</span>
                <span className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={10_000}
                    className="w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-text tabular-nums"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value) || 0)}
                  />
                  <span className="text-muted">€</span>
                </span>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted">{t('game.capital.split', { you: pct(yourPct, 0), co: pct(1 - yourPct, 0) })}</span>
                <input
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.05}
                  value={yourPct}
                  aria-valuetext={pct(yourPct, 0)}
                  className="mt-2 accent-[var(--link)]"
                  onChange={(e) => setYourPct(Number(e.target.value))}
                />
              </label>
            </div>
            {capital < MIN_CAPITAL[form] ? (
              <div className="callout callout-warning mt-4" aria-live="polite">
                <p>{t('game.capital.tooLow', { min: eur(MIN_CAPITAL[form]) })}</p>
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-surface-2 p-3 text-sm" aria-live="polite">
                {form === 'gmbh'
                  ? t('game.capital.resultGmbh', { you: pct(yourPct, 0), co: pct(1 - yourPct, 0), shares: int(FOUNDING_SHARES) })
                  : t('game.capital.result', {
                      shares: int(FOUNDING_SHARES),
                      you: int(Math.round(FOUNDING_SHARES * yourPct)),
                      co: int(FOUNDING_SHARES - Math.round(FOUNDING_SHARES * yourPct)),
                    })}
              </p>
            )}
            {nav('seed', capital < MIN_CAPITAL[form])}
          </>
        )}

        {stage === 'seed' && (
          <>
            {heading(t('game.seed.q'))}
            <p className="mt-1 text-sm text-muted">{t('game.seed.help')}</p>
            <div className="mt-3 space-y-2" role="radiogroup">
              {SEED_OFFERS.map((o) => (
                <Choice
                  key={o.id}
                  name="seed"
                  checked={seed?.id === o.id}
                  onChange={() => setSeed(o)}
                  title={t('game.offer', { amount: eurShort(o.investment), pre: eurShort(o.preMoney) })}
                  body={t('game.offer.body', { share: pct(o.investment / (o.preMoney + o.investment), 0) })}
                  aside={t('game.youAfter', { pct: pct(yourAfter(o, true), 0) })}
                />
              ))}
            </div>
            {nav('pool', !seed)}
          </>
        )}

        {stage === 'pool' && (
          <>
            {heading(t('game.pool.q'))}
            <p className="mt-1 text-sm text-muted">{t('game.pool.help')}</p>
            <div className="mt-3 space-y-2" role="radiogroup">
              {POOL_OPTIONS.map((p) => (
                <Choice key={p} name="pool" checked={pool === p} onChange={() => setPool(p)} title={p === 0 ? t('game.pool.none') : t('game.pool.size', { pct: pct(p, 0) })} />
              ))}
            </div>
            {nav('seriesA', pool === null)}
          </>
        )}

        {stage === 'seriesA' && (
          <>
            {heading(t('game.seriesA.q', { name }))}
            <p className="mt-1 text-sm text-muted">{t('game.seriesA.help')}</p>
            <div className="mt-3 space-y-2" role="radiogroup">
              {SERIES_A_OFFERS.map((o) => (
                <Choice
                  key={o.id}
                  name="seriesA"
                  checked={seriesA?.id === o.id}
                  onChange={() => setSeriesA(o)}
                  title={t('game.offer', { amount: eurShort(o.investment), pre: eurShort(o.preMoney) })}
                  body={t('game.offer.body', { share: pct(o.investment / (o.preMoney + o.investment), 0) })}
                />
              ))}
            </div>
            {nav('ipo', !seriesA)}
          </>
        )}

        {stage === 'ipo' && (
          <>
            {heading(t('game.ipo.q', { name }))}
            {form === 'gmbh' && !converted ? (
              <div className="callout callout-warning mt-3">
                <p>{t('game.ipo.convert')}</p>
                <button type="button" className="btn btn-primary mt-2" onClick={() => setConverted(true)}>
                  {t('game.ipo.convertButton')}
                </button>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted">{t('game.ipo.help', { raise: eurShort(IPO_RAISE) })}</p>
                <fieldset className="mt-3">
                  <legend className="text-sm font-semibold">{t('game.ipo.price')}</legend>
                  <div className="mt-2 space-y-2">
                    {IPO_OPTIONS.map((o) => (
                      <Choice
                        key={o.id}
                        name="ipo"
                        checked={ipoId === o.id}
                        onChange={() => setIpoId(o.id)}
                        title={t(`game.ipo.${o.id}`, { pre: eurShort(o.preMoney) })}
                        aside={t('game.ipo.coverage', { x: o.coverage.toFixed(1) })}
                      />
                    ))}
                  </div>
                </fieldset>
                {ipo && (
                  <div className={`callout mt-3 ${ipo.coverage < 1 ? 'callout-warning' : ipo.coverage < 2 ? 'callout-note' : 'callout-tip'}`} aria-live="polite">
                    <p>{t(`game.ipo.feedback.${ipo.id}`)}</p>
                  </div>
                )}
                <fieldset className="mt-4">
                  <legend className="text-sm font-semibold">{t('game.ipo.sell')}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {SELL_OPTIONS.map((p) => (
                      <Choice key={p} name="sell" checked={sellPct === p} onChange={() => setSellPct(p)} title={p === 0 ? t('game.ipo.sellNone') : t('game.ipo.sellPct', { pct: pct(p, 0) })} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted">{t('game.ipo.sellHelp')}</p>
                </fieldset>
              </>
            )}
            {nav('result', !ipo || ipo.coverage < 1 || (form === 'gmbh' && !converted), t('game.ipo.ring'))}
          </>
        )}

        {stage === 'result' && result && (
          <>
            {heading(t('game.result.title', { name }))}
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [t('game.result.price'), eurCents(result.ipoPrice)],
                [t('game.result.marketCap'), eurShort(result.marketCap)],
                [t('game.result.yourStake'), pct(result.yourPct)],
                [t('game.result.yourValue'), eurShort(result.yourPaperValue)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-surface-2 p-3">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 text-lg font-bold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              <li>{t('game.result.raised', { total: eurShort(result.companyRaisedTotal) })}</li>
              <li>{result.yourCash > 0 ? t('game.result.cash', { cash: eurShort(result.yourCash) }) : t('game.result.noCash')}</li>
              <li>{t('game.result.paper')}</li>
            </ul>
            <div className="mt-5">
              <StackedBars
                ariaLabel={t('game.result.chart')}
                legend={result.stages[result.stages.length - 1].holders.map((h) => ({ key: h.id, name: t(`game.holder.${h.id}` as never), color: seriesColor(slotFor(h.id)) }))}
                rows={result.stages.map(
                  (s): BarRow => ({
                    label: t(`game.stage.${s.label}`),
                    segments: s.holders.map((h, i) => ({
                      key: h.id,
                      name: t(`game.holder.${h.id}` as never),
                      value: ownership(s.holders)[i],
                      color: seriesColor(slotFor(h.id)),
                      ink: seriesInk(slotFor(h.id)),
                      detail: `${int(h.shares)} ${t('cap.sharesWord')}`,
                    })),
                  }),
                )}
              />
            </div>
            <ul className="sr-only">
              {result.stages.map((s) => (
                <li key={s.label}>
                  {t(`game.stage.${s.label}`)}: {t('game.result.youOwn', { pct: pct((s.holders.find((h) => h.id === 'f1')?.shares ?? 0) / totalShares(s.holders)) })}
                </li>
              ))}
            </ul>
            <p className="callout callout-note mt-5 text-sm">{t('game.result.reality')}</p>
            <button type="button" className="btn btn-ghost mt-4" onClick={restart}>
              {t('game.again')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
