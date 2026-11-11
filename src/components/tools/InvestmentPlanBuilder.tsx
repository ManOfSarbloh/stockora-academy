/**
 * Investment plan builder (/tools/investment-plan): a worksheet following the lesson "Writing your own
 * investment plan". The learner enters their own decisions; the tool only adds small checks (emergency fund
 * target, the acceptable fall in euros, the lesson's crash example with their mix) and a printable summary.
 * Saved in localStorage ("stockora-investment-plan"). Logic in src/lib/investment-plan.ts.
 */
import { useEffect, useId, useState, type ReactNode } from 'react';
import { t } from '@/i18n';
import { dateLong, dec, eur } from '@/lib/format';
import { readJSON, remove, writeJSON } from '@/lib/storage';
import {
  MAX_GOALS,
  crashCheck,
  emergencyTarget,
  emptyPlan,
  fallInEuros,
  mixTotal,
  mixValid,
  restorePlan,
  yearsUntil,
  type Plan,
  type PlanGoal,
} from '@/lib/investment-plan';

const STORE_KEY = 'investment-plan';
const inputCls = 'mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-text';
const numCls = 'mt-1 w-36 rounded-lg border border-border bg-surface px-3 py-1.5 text-text tabular-nums';

/** "" → null, otherwise a finite number (or the previous value while typing something invalid). */
const toNum = (v: string): number | null => {
  if (v.trim() === '') return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

function Field({ label, help, children, id }: { label: string; help?: ReactNode; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {children}
      {help && (
        <p id={`${id}-help`} className="mt-1 text-xs text-muted">
          {help}
        </p>
      )}
    </div>
  );
}

function NumInput({ id, value, onChange, step = 'any', min, max, help }: { id: string; value: number | null; onChange: (v: number | null) => void; step?: string; min?: number; max?: number; help?: boolean }) {
  const [text, setText] = useState(value == null ? '' : String(value));
  useEffect(() => {
    if (toNum(text) !== value) setText(value == null ? '' : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      max={max}
      value={text}
      aria-describedby={help ? `${id}-help` : undefined}
      className={numCls}
      onChange={(e) => {
        setText(e.target.value);
        onChange(toNum(e.target.value));
      }}
    />
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="card space-y-4 p-5" aria-labelledby={id}>
      <h2 id={id} className="text-lg font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function InvestmentPlanBuilder() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const id = useId();

  useEffect(() => {
    setPlan(restorePlan(readJSON<unknown>(STORE_KEY, null), t('ip.crashRule.default')) ?? emptyPlan(t('ip.crashRule.default')));
  }, []);
  useEffect(() => {
    const done = () => document.documentElement.classList.remove('print-plan');
    window.addEventListener('afterprint', done);
    return () => window.removeEventListener('afterprint', done);
  }, []);

  if (!plan) return <div className="island-fallback h-[1600px]" />;

  const update = (patch: Partial<Plan>) => {
    const next = { ...plan, ...patch, updated: new Date().toISOString().slice(0, 10) };
    setPlan(next);
    writeJSON(STORE_KEY, next);
  };
  const setGoal = (i: number, patch: Partial<PlanGoal>) => update({ goals: plan.goals.map((g, j) => (j === i ? { ...g, ...patch } : g)) });

  const target = emergencyTarget(plan.expenses, plan.months);
  const fallEuro = fallInEuros(plan.portfolio, plan.maxFall);
  const mixOk = mixValid(plan);
  const crash = mixOk ? crashCheck(plan) : null;
  const now = new Date();
  const pctTxt = (n: number) => `${dec(n, 1)}%`;
  const or = (s: string) => (s.trim() ? s : t('ip.empty'));

  return (
    <div className="space-y-6">
      <p className="on-surface rounded-xl border border-warn-border bg-warn-bg p-3 text-sm">{t('ip.intro')}</p>
      <p className="text-sm text-muted" aria-live="polite">
        {plan.updated ? t('ip.saved') : ''}
      </p>

      <div className="no-print space-y-6">
        <Section title={t('ip.s1')}>
          {plan.goals.map((g, i) => {
            const years = yearsUntil(g.year, now);
            return (
              <fieldset key={i} className="space-y-3 rounded-lg border border-border p-3">
                <legend className="px-1 text-sm font-semibold">{t('ip.goal.n', { n: i + 1 })}</legend>
                <Field id={`${id}-g${i}w`} label={t('ip.goal.what')}>
                  <input id={`${id}-g${i}w`} className={inputCls} value={g.what} placeholder={t('ip.goal.what.ph')} onChange={(e) => setGoal(i, { what: e.target.value })} />
                </Field>
                <div className="flex flex-wrap gap-4">
                  <Field id={`${id}-g${i}a`} label={t('ip.goal.amount')}>
                    <NumInput id={`${id}-g${i}a`} value={g.amount} min={0} step="100" onChange={(v) => setGoal(i, { amount: v })} />
                  </Field>
                  <Field id={`${id}-g${i}y`} label={t('ip.goal.year')} help={years != null ? t('ip.goal.years', { n: years }) : undefined}>
                    <NumInput id={`${id}-g${i}y`} value={g.year} min={now.getFullYear()} step="1" help={years != null} onChange={(v) => setGoal(i, { year: v == null ? null : Math.round(v) })} />
                  </Field>
                </div>
                {plan.goals.length > 1 && (
                  <button type="button" className="text-sm font-semibold text-link underline" onClick={() => update({ goals: plan.goals.filter((_, j) => j !== i) })}>
                    {t('ip.goal.remove', { n: i + 1 })}
                  </button>
                )}
              </fieldset>
            );
          })}
          {plan.goals.length < MAX_GOALS && (
            <button type="button" className="btn btn-ghost" onClick={() => update({ goals: [...plan.goals, { what: '', amount: null, year: null }] })}>
              {t('ip.goal.add')}
            </button>
          )}
        </Section>

        <Section title={t('ip.s2')}>
          <div className="flex flex-wrap gap-4">
            <Field id={`${id}-exp`} label={t('ip.expenses')}>
              <NumInput id={`${id}-exp`} value={plan.expenses} min={0} step="50" onChange={(v) => update({ expenses: v })} />
            </Field>
            <Field id={`${id}-mon`} label={t('ip.months')} help={t('ip.months.help')}>
              <NumInput id={`${id}-mon`} value={plan.months} min={0} max={24} step="1" help onChange={(v) => update({ months: v ?? 0 })} />
            </Field>
          </div>
          {target != null && <p className="font-semibold">{t('ip.emergencyTarget', { amount: eur(target) })}</p>}
          <Field id={`${id}-where`} label={t('ip.where')}>
            <input id={`${id}-where`} className={inputCls} value={plan.emergencyWhere} placeholder={t('ip.where.ph')} onChange={(e) => update({ emergencyWhere: e.target.value })} />
          </Field>
          <Field id={`${id}-debt`} label={t('ip.debt')}>
            <input id={`${id}-debt`} className={inputCls} value={plan.debt} placeholder={t('ip.debt.ph')} onChange={(e) => update({ debt: e.target.value })} />
          </Field>
        </Section>

        <Section title={t('ip.s3')}>
          <div className="flex flex-wrap gap-4">
            <Field id={`${id}-fall`} label={t('ip.maxFall')}>
              <NumInput id={`${id}-fall`} value={plan.maxFall} min={0} max={100} step="5" onChange={(v) => update({ maxFall: v ?? 0 })} />
            </Field>
            <Field id={`${id}-port`} label={t('ip.portfolio')}>
              <NumInput id={`${id}-port`} value={plan.portfolio} min={0} step="1000" onChange={(v) => update({ portfolio: v })} />
            </Field>
          </div>
          {fallEuro != null && <p className="font-semibold">{t('ip.fallEuro', { pct: pctTxt(plan.maxFall), amount: eur(fallEuro) })}</p>}
          <p className="text-sm text-muted">{t('ip.fallHint')}</p>
        </Section>

        <Section title={t('ip.s4')}>
          <div className="flex flex-wrap gap-4">
            {(['shares', 'bonds', 'cash'] as const).map((k) => (
              <Field key={k} id={`${id}-${k}`} label={t(`ip.${k}`)}>
                <NumInput id={`${id}-${k}`} value={plan[k]} min={0} max={100} step="5" onChange={(v) => update({ [k]: v ?? 0 })} />
              </Field>
            ))}
          </div>
          <p className={mixOk ? 'text-sm text-muted' : 'text-sm font-semibold text-[#b42318] dark:text-[#ff8a80]'} aria-live="polite">
            {t('ip.mixTotal', { n: dec(mixTotal(plan), 1) })}
            {!mixOk && ` ${t('ip.mixErr')}`}
          </p>
          <Field id={`${id}-glide`} label={t('ip.glide')}>
            <input id={`${id}-glide`} className={inputCls} value={plan.glide} placeholder={t('ip.glide.ph')} onChange={(e) => update({ glide: e.target.value })} />
          </Field>
        </Section>

        <Section title={t('ip.s5')}>
          <Field id={`${id}-prod`} label={t('ip.products')}>
            <input id={`${id}-prod`} className={inputCls} value={plan.products} placeholder={t('ip.products.ph')} onChange={(e) => update({ products: e.target.value })} />
          </Field>
          <div className="flex flex-wrap gap-4">
            <Field id={`${id}-cost`} label={t('ip.maxCost')}>
              <NumInput id={`${id}-cost`} value={plan.maxCost} min={0} step="0.05" onChange={(v) => update({ maxCost: v })} />
            </Field>
            <Field id={`${id}-monthly`} label={t('ip.monthly')}>
              <NumInput id={`${id}-monthly`} value={plan.monthly} min={0} step="25" onChange={(v) => update({ monthly: v })} />
            </Field>
            <Field id={`${id}-day`} label={t('ip.planDay')}>
              <NumInput id={`${id}-day`} value={plan.planDay} min={1} max={31} step="1" onChange={(v) => update({ planDay: v == null ? null : Math.round(v) })} />
            </Field>
          </div>
          <Field id={`${id}-broker`} label={t('ip.broker')}>
            <input id={`${id}-broker`} className={inputCls} value={plan.broker} onChange={(e) => update({ broker: e.target.value })} />
          </Field>
        </Section>

        <Section title={t('ip.s6')}>
          <div className="flex flex-wrap gap-4">
            <Field id={`${id}-rm`} label={t('ip.rebMonths')}>
              <NumInput id={`${id}-rm`} value={plan.rebalanceMonths} min={1} max={60} step="1" onChange={(v) => update({ rebalanceMonths: v ?? 12 })} />
            </Field>
            <Field id={`${id}-rd`} label={t('ip.rebDrift')}>
              <NumInput id={`${id}-rd`} value={plan.rebalanceDrift} min={0} max={50} step="1" onChange={(v) => update({ rebalanceDrift: v ?? 5 })} />
            </Field>
          </div>
        </Section>

        <Section title={t('ip.s7')}>
          <Field id={`${id}-rule`} label={t('ip.crashRule')}>
            <textarea id={`${id}-rule`} rows={3} className={inputCls} value={plan.crashRule} onChange={(e) => update({ crashRule: e.target.value })} />
          </Field>
          {crash && (
            <p className="text-sm">
              {t('ip.crashCheck', { from: pctTxt(crash.from), to: pctTxt(crash.to), drift: dec(crash.drift, 1) })}{' '}
              <strong>{t(crash.rebalance ? 'ip.crash.over' : 'ip.crash.under', { n: dec(plan.rebalanceDrift, 1) })}</strong>
            </p>
          )}
        </Section>

        <Section title={t('ip.s8')}>
          <Field id={`${id}-rev`} label={t('ip.review')} help={t('ip.review.help')}>
            <input id={`${id}-rev`} type="month" className={numCls} value={plan.review} aria-describedby={`${id}-rev-help`} onChange={(e) => update({ review: e.target.value })} />
          </Field>
        </Section>
      </div>

      <Summary plan={plan} target={target} pctTxt={pctTxt} or={or} />

      <div className="no-print flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            document.documentElement.classList.add('print-plan');
            window.print();
          }}
        >
          {t('ip.print')}
        </button>
        {!confirmReset ? (
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(true)}>
            {t('ip.reset')}
          </button>
        ) : (
          <span className="flex flex-wrap items-center gap-2" role="group" aria-label={t('ip.reset.sure')}>
            <span className="text-sm font-semibold">{t('ip.reset.sure')}</span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                remove(STORE_KEY);
                setPlan(emptyPlan(t('ip.crashRule.default')));
                setConfirmReset(false);
              }}
            >
              {t('ip.reset.yes')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
              {t('ip.reset.no')}
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

function Summary({ plan, target, pctTxt, or }: { plan: Plan; target: number | null; pctTxt: (n: number) => string; or: (s: string) => string }) {
  const goals = plan.goals.filter((g) => g.what.trim() || g.amount != null || g.year != null);
  const row = (label: string, value: ReactNode) => (
    <div className="border-b border-border py-2 sm:grid sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-semibold">{label}</dt>
      <dd className="whitespace-pre-line">{value}</dd>
    </div>
  );
  const q = ['ip.q1', 'ip.q2', 'ip.q3', 'ip.q4', 'ip.q5'] as const;
  return (
    <section id="plan-summary" className="card border-2 border-link p-5" aria-labelledby="plan-summary-h">
      <h2 id="plan-summary-h" className="text-xl font-bold">
        {t('ip.summary')}
      </h2>
      {plan.updated && <p className="text-sm text-muted">{t('ip.summary.updated', { date: dateLong(plan.updated) })}</p>}
      <dl className="mt-3 text-sm">
        {row(
          t('ip.s1'),
          goals.length === 0
            ? t('ip.empty')
            : goals.map((g, i) => (
                <span key={i} className="block">
                  {[or(g.what), g.amount != null ? eur(g.amount) : null, g.year != null ? String(g.year) : null].filter(Boolean).join(' · ')}
                </span>
              )),
        )}
        {row(
          t('ip.s2'),
          <>
            {t('ip.summary.emergency', { months: plan.months, amount: target != null ? eur(target) : t('ip.empty'), where: or(plan.emergencyWhere) })}
            {plan.debt.trim() && <span className="block">{`${t('ip.debt')}: ${plan.debt}`}</span>}
          </>,
        )}
        {row(t('ip.s3'), t('ip.summary.fall', { pct: pctTxt(plan.maxFall) }))}
        {row(
          t('ip.s4'),
          <>
            {t('ip.summary.mix', { shares: dec(plan.shares, 1), bonds: dec(plan.bonds, 1), cash: dec(plan.cash, 1) })}
            {plan.glide.trim() && <span className="block">{plan.glide}</span>}
          </>,
        )}
        {row(
          t('ip.s5'),
          <>
            {[or(plan.products), plan.maxCost != null ? t('ip.summary.cost', { pct: `${dec(plan.maxCost, 2)}%` }) : null, plan.broker.trim() || null]
              .filter(Boolean)
              .join(' · ')}
            {plan.monthly != null && (
              <span className="block">{t('ip.summary.saving', { amount: eur(plan.monthly), day: plan.planDay ?? t('ip.empty') })}</span>
            )}
          </>,
        )}
        {row(t('ip.s6'), t('ip.summary.rebalance', { months: plan.rebalanceMonths, drift: dec(plan.rebalanceDrift, 1) }))}
        {row(t('ip.s7'), or(plan.crashRule))}
        {row(t('ip.s8'), plan.review ? `${plan.review} · ${t('ip.review.help')}` : t('ip.review.help'))}
        {row(
          t('ip.s9'),
          <ol className="list-decimal space-y-0.5 pl-5">
            {q.map((k) => (
              <li key={k}>{t(k)}</li>
            ))}
          </ol>,
        )}
      </dl>
      <p className="mt-2 text-xs text-muted">{t('ip.q.source')}</p>
      <p className="mt-3 text-xs text-muted">{t('ip.disclaimer')}</p>
    </section>
  );
}
