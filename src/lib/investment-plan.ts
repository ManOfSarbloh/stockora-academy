/**
 * Investment plan builder (/tools/investment-plan): the data a learner writes down, following the template in
 * the lesson "Writing your own investment plan" (investing-strategies/investment-plan), and a few small
 * calculations that help them check it. Nothing here suggests products or a mix: the learner enters their own.
 * Pure functions, unit-tested in tests/investment-plan.test.ts.
 */

export interface PlanGoal {
  what: string;
  amount: number | null;
  year: number | null;
}

export interface Plan {
  version: 1;
  goals: PlanGoal[];
  expenses: number | null;
  months: number | null;
  emergencyWhere: string;
  debt: string;
  maxFall: number | null;
  portfolio: number | null;
  shares: number | null;
  bonds: number | null;
  cash: number | null;
  glide: string;
  products: string;
  maxCost: number | null;
  broker: string;
  monthly: number | null;
  planDay: number | null;
  rebalanceMonths: number | null;
  rebalanceDrift: number | null;
  crashRule: string;
  /** "YYYY-MM" */
  review: string;
  updated: string;
}

export const MAX_GOALS = 3;

/**
 * An empty plan. Every decision starts blank (no preset mix, limits or rules), so the tool never suggests
 * an allocation or behaviour; examples are shown only as placeholders.
 */
export function emptyPlan(): Plan {
  return {
    version: 1,
    goals: [{ what: '', amount: null, year: null }],
    expenses: null,
    months: null,
    emergencyWhere: '',
    debt: '',
    maxFall: null,
    portfolio: null,
    shares: null,
    bonds: null,
    cash: null,
    glide: '',
    products: '',
    maxCost: null,
    broker: '',
    monthly: null,
    planDay: null,
    rebalanceMonths: null,
    rebalanceDrift: null,
    crashRule: '',
    review: '',
    updated: '',
  };
}

/** Emergency fund target: monthly costs × months. */
export const emergencyTarget = (expenses: number | null, months: number | null): number | null =>
  expenses != null && expenses > 0 && months != null && months > 0 ? Math.round(expenses * months) : null;

/** What a temporary fall of `pct` percent means in euros for a portfolio. */
export const fallInEuros = (portfolio: number | null, pct: number | null): number | null =>
  portfolio != null && portfolio > 0 && pct != null ? Math.round((portfolio * pct) / 100) : null;

type Mix = Pick<Plan, 'shares' | 'bonds' | 'cash'>;
/** Sum of the mix; an empty part counts as 0. */
export const mixTotal = (p: Mix) => (p.shares ?? 0) + (p.bonds ?? 0) + (p.cash ?? 0);
/** True once the learner has typed at least one part of the mix. */
export const mixEntered = (p: Mix) => p.shares != null || p.bonds != null || p.cash != null;
export const mixValid = (p: Mix) =>
  mixEntered(p) && [p.shares, p.bonds, p.cash].every((x) => x == null || (Number.isFinite(x) && x >= 0)) && Math.abs(mixTotal(p) - 100) < 1e-9;

/**
 * The lesson's crash example with the learner's own mix: if shares fall by `fall` (0.3 = 30%) and bonds and cash
 * stay put, the share part of the portfolio drops from `from` to `to` percent; `drift` is the difference in
 * percentage points and `rebalance` says whether it exceeds the learner's drift limit.
 */
export function crashCheck(p: Pick<Plan, 'shares' | 'bonds' | 'cash' | 'rebalanceDrift'>, fall = 0.3) {
  const total = mixTotal(p);
  if (total <= 0 || p.shares == null || p.shares <= 0 || p.rebalanceDrift == null) return null;
  const sharesAfter = p.shares * (1 - fall);
  const to = (sharesAfter / (sharesAfter + (p.bonds ?? 0) + (p.cash ?? 0))) * 100;
  const from = (p.shares / total) * 100;
  const drift = from - to;
  return { from, to, drift, rebalance: drift > p.rebalanceDrift };
}

/** Whole years from `now` until the goal's year (null without a year, 0 if it has passed). */
export const yearsUntil = (year: number | null, now: Date) => (year == null ? null : Math.max(0, year - now.getFullYear()));

/** Reads a saved plan, filling in fields that older or partial saves may lack. */
export function restorePlan(raw: unknown): Plan | null {
  if (!raw || typeof raw !== 'object' || (raw as Plan).version !== 1) return null;
  const base = emptyPlan();
  const p = { ...base, ...(raw as Partial<Plan>) } as Plan;
  p.goals = Array.isArray(p.goals) && p.goals.length > 0 ? p.goals.slice(0, MAX_GOALS) : base.goals;
  return p;
}
