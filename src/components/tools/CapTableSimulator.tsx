/**
 * Cap table and dilution simulator: two founders, then any mix of funding rounds and option-pool
 * top-ups. Shows ownership after every step as stacked bars plus a full table (the table is also
 * the accessible view of the chart).
 */
import { useId, useMemo, useState } from 'react';
import { t } from '@/i18n';
import { ownership, runSteps, totalShares, type Holder, type Step } from '@/lib/captable';
import { eur, eurCents, eurShort, int, pct } from '@/lib/format';
import { StackedBars, seriesColor, seriesInk, type BarRow } from './StackedBars';

const MAX_STEPS = 6;

const defaultFounders: Holder[] = [
  { id: 'f1', name: 'Anna', kind: 'founder', shares: 600_000 },
  { id: 'f2', name: 'Ben', kind: 'founder', shares: 400_000 },
];

const defaultSteps: Step[] = [
  { type: 'round', id: 'r1', name: 'Seed investor', investment: 1_000_000, preMoney: 4_000_000 },
  { type: 'pool', id: 'p1', name: 'Option pool', targetPct: 0.1 },
  { type: 'round', id: 'r2', name: 'Series A fund', investment: 5_000_000, preMoney: 20_000_000 },
];

/** Colour slots follow the holder, never its position: founders 1–2, pool 3, investors 4–8 by creation order. */
function slotFor(id: string): number {
  if (id === 'f1') return 1;
  if (id === 'f2') return 2;
  if (id === 'pool') return 3;
  const n = Number(id.replace(/\D/g, '')) || 1;
  return 4 + ((n - 1) % 5);
}

function NumberField(props: { label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; suffix?: string }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{props.label}</span>
      <span className="flex items-center gap-1.5">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="w-full min-w-0 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-text tabular-nums"
          value={Number.isFinite(props.value) ? props.value : ''}
          step={props.step ?? 1}
          min={props.min ?? 0}
          max={props.max}
          onChange={(e) => props.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        />
        {props.suffix && <span className="shrink-0 text-muted">{props.suffix}</span>}
      </span>
    </label>
  );
}

export default function CapTableSimulator() {
  const [founders, setFounders] = useState<Holder[]>(defaultFounders);
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [counter, setCounter] = useState(3);

  const results = useMemo(() => runSteps(founders, steps), [founders, steps]);

  const stages = [{ label: t('cap.start'), holders: founders }, ...results.map((r) => ({ label: r.step.name, holders: r.holders }))];
  const finalHolders = stages[stages.length - 1].holders;
  const allHolders = finalHolders; // holders only ever get added, so the last stage lists everyone

  const rows: BarRow[] = stages.map((s) => {
    const own = ownership(s.holders);
    return {
      label: s.label,
      segments: s.holders.map((h, i) => ({ key: h.id, name: h.name, value: own[i], color: seriesColor(slotFor(h.id)), ink: seriesInk(slotFor(h.id)), detail: `${int(h.shares)} ${t('cap.sharesWord')}` })),
    };
  });

  const lastRound = [...results].reverse().find((r) => r.step.type === 'round' && r.pricePerShare);
  const f1Final = finalHolders.find((h) => h.id === 'f1');

  const updateStep = (id: string, patch: Partial<Step>) => setSteps((ss) => ss.map((s) => (s.id === id ? ({ ...s, ...patch } as Step) : s)));
  const removeStep = (id: string) => setSteps((ss) => ss.filter((s) => s.id !== id));
  const addRound = () => {
    const n = counter + 1;
    setCounter(n);
    const prev = [...results].reverse().find((r) => r.postMoney)?.postMoney ?? 4_000_000;
    setSteps((ss) => [...ss, { type: 'round', id: `r${n}`, name: t('cap.newInvestor', { n: ss.filter((s) => s.type === 'round').length + 1 }), investment: Math.round(prev / 4 / 100_000) * 100_000 || 1_000_000, preMoney: prev * 2 }]);
  };
  const addPool = () => {
    const n = counter + 1;
    setCounter(n);
    setSteps((ss) => [...ss, { type: 'pool', id: `p${n}`, name: t('cap.poolTopUp'), targetPct: 0.1 }]);
  };
  const reset = () => {
    setFounders(defaultFounders);
    setSteps(defaultSteps);
    setCounter(3);
  };

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-lg font-bold">{t('cap.title')}</h3>
      <p className="mt-1 text-sm text-muted">{t('cap.lead')}</p>

      {/* ---- Inputs ---- */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {founders.map((f, i) => (
          <fieldset key={f.id} className="rounded-lg border border-border p-3">
            <legend className="px-1 text-sm font-semibold">{t('cap.founderN', { n: i + 1 })}</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted">{t('cap.name')}</span>
                <input
                  className="w-full min-w-0 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-text"
                  value={f.name}
                  maxLength={24}
                  onChange={(e) => setFounders((fs) => fs.map((x) => (x.id === f.id ? { ...x, name: e.target.value } : x)))}
                />
              </label>
              <NumberField
                label={t('cap.shares')}
                value={f.shares}
                step={10_000}
                onChange={(v) => setFounders((fs) => fs.map((x) => (x.id === f.id ? { ...x, shares: Math.max(0, Math.round(v)) } : x)))}
              />
            </div>
          </fieldset>
        ))}
      </div>

      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {t('cap.stepN', { n: i + 1 })} · {s.type === 'round' ? t('cap.round') : t('cap.pool')}
              </span>
              <button type="button" className="text-sm text-muted underline hover:text-text" onClick={() => removeStep(s.id)}>
                {t('cap.remove')}
              </button>
            </div>
            {s.type === 'round' ? (
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-muted">{t('cap.investor')}</span>
                  <input
                    className="w-full min-w-0 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-text"
                    value={s.name}
                    maxLength={28}
                    onChange={(e) => updateStep(s.id, { name: e.target.value })}
                  />
                </label>
                <NumberField label={t('cap.investment')} value={s.investment} step={100_000} suffix="€" onChange={(v) => updateStep(s.id, { investment: v })} />
                <NumberField label={t('cap.preMoney')} value={s.preMoney} step={500_000} suffix="€" onChange={(v) => updateStep(s.id, { preMoney: v })} />
              </div>
            ) : (
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <NumberField
                  label={t('cap.poolTarget')}
                  value={Math.round(s.targetPct * 1000) / 10}
                  step={1}
                  max={50}
                  suffix="%"
                  onChange={(v) => updateStep(s.id, { targetPct: Math.min(0.5, Math.max(0, v / 100)) })}
                />
                <p className="text-sm text-muted sm:col-span-2 sm:self-end">{t('cap.poolHelp')}</p>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm disabled:opacity-50" disabled={steps.length >= MAX_STEPS} onClick={addRound}>
          + {t('cap.addRound')}
        </button>
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm disabled:opacity-50" disabled={steps.length >= MAX_STEPS} onClick={addPool}>
          + {t('cap.addPool')}
        </button>
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={reset}>
          {t('cap.reset')}
        </button>
      </div>

      {/* ---- Result ---- */}
      {f1Final && totalShares(finalHolders) > 0 && (
        <p className="mt-6 rounded-lg bg-surface-2 p-3 text-sm" aria-live="polite">
          {lastRound?.pricePerShare
            ? t('cap.insight', {
                name: f1Final.name,
                pct: pct(f1Final.shares / totalShares(finalHolders)),
                start: pct(founders[0].shares / Math.max(1, totalShares(founders))),
                price: eurCents(lastRound.pricePerShare),
                value: eurShort(f1Final.shares * lastRound.pricePerShare),
              })
            : t('cap.insightNoRound', { name: f1Final.name, pct: pct(f1Final.shares / totalShares(finalHolders)) })}
        </p>
      )}

      <div className="mt-5">
        <StackedBars rows={rows} legend={allHolders.map((h) => ({ key: h.id, name: h.name, color: seriesColor(slotFor(h.id)) }))} ariaLabel={t('cap.chartLabel')} />
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-sm tabular-nums">
          <caption className="sr-only">{t('cap.tableCaption')}</caption>
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th scope="col" className="py-2 pr-3 font-semibold">
                {t('cap.holder')}
              </th>
              {stages.map((s, i) => (
                <th key={i} scope="col" className="py-2 pr-3 text-right font-semibold">
                  {s.label}
                </th>
              ))}
              <th scope="col" className="py-2 text-right font-semibold">
                {t('cap.sharesEnd')}
              </th>
            </tr>
          </thead>
          <tbody>
            {allHolders.map((h) => (
              <tr key={h.id} className="border-b border-border/60">
                <th scope="row" className="py-2 pr-3 text-left font-medium">
                  <span className="mr-2 inline-block size-2.5 rounded-sm align-middle" style={{ background: seriesColor(slotFor(h.id)) }} aria-hidden="true" />
                  {h.name}
                </th>
                {stages.map((s, i) => {
                  const hh = s.holders.find((x) => x.id === h.id);
                  const tot = totalShares(s.holders);
                  return (
                    <td key={i} className="py-2 pr-3 text-right">
                      {hh && tot ? pct(hh.shares / tot) : '–'}
                    </td>
                  );
                })}
                <td className="py-2 text-right">{int(h.shares)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="text-muted">
            <tr>
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                {t('cap.pricePerShare')}
              </th>
              <td className="py-2 pr-3 text-right">–</td>
              {results.map((r, i) => (
                <td key={i} className="py-2 pr-3 text-right">
                  {r.pricePerShare ? eurCents(r.pricePerShare) : '–'}
                </td>
              ))}
              <td />
            </tr>
            <tr>
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                {t('cap.postMoney')}
              </th>
              <td className="py-2 pr-3 text-right">–</td>
              {results.map((r, i) => (
                <td key={i} className="py-2 pr-3 text-right">
                  {r.postMoney && r.step.type === 'round' ? eur(r.postMoney) : '–'}
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">{t('cap.note')}</p>
    </div>
  );
}
