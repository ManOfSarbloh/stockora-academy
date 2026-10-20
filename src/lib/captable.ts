/**
 * Cap table maths for the cap-table simulator and the "Build your own company" game.
 * Pure functions, unit-tested. All share counts are whole numbers.
 */

export type HolderKind = 'founder' | 'pool' | 'investor' | 'public';

export interface Holder {
  id: string;
  name: string;
  kind: HolderKind;
  shares: number;
}

export type Step =
  | { type: 'pool'; id: string; name: string; /** Pool size after the step, as a share of all shares (0–1). */ targetPct: number }
  | { type: 'round'; id: string; name: string; investment: number; preMoney: number };

export interface StepResult {
  step: Step;
  holders: Holder[];
  totalShares: number;
  /** Price per share paid in a round (undefined for pool steps). */
  pricePerShare?: number;
  newShares: number;
  /** Company value right after a round: pre-money + investment. */
  postMoney?: number;
}

export const totalShares = (holders: Holder[]) => holders.reduce((s, h) => s + h.shares, 0);

/** Each holder's fraction of all shares (0–1), in holder order. */
export function ownership(holders: Holder[]): number[] {
  const total = totalShares(holders);
  return holders.map((h) => (total > 0 ? h.shares / total : 0));
}

function addShares(holders: Holder[], id: string, name: string, kind: HolderKind, shares: number): Holder[] {
  const existing = holders.find((h) => h.id === id);
  if (existing) return holders.map((h) => (h.id === id ? { ...h, shares: h.shares + shares } : h));
  return [...holders, { id, name, kind, shares }];
}

/**
 * Create or top up the employee option pool so that it equals `targetPct` of all shares afterwards.
 * New pool shares dilute everyone else. If the pool is already at least that big, nothing changes.
 */
export function topUpPool(holders: Holder[], targetPct: number, poolId = 'pool', poolName = 'Option pool'): { holders: Holder[]; newShares: number } {
  if (!(targetPct > 0 && targetPct < 1)) return { holders, newShares: 0 };
  const current = holders.find((h) => h.id === poolId)?.shares ?? 0;
  const others = totalShares(holders) - current;
  // pool / (others + pool) = target  =>  pool = target × others / (1 − target)
  const needed = Math.round((targetPct * others) / (1 - targetPct));
  const newShares = Math.max(0, needed - current);
  return { holders: newShares > 0 ? addShares(holders, poolId, poolName, 'pool', newShares) : holders, newShares };
}

/**
 * A priced funding round: the price per share is the pre-money valuation divided by all shares
 * outstanding before the round (including the option pool); the investor receives investment ÷ price new shares.
 */
export function priceRound(
  holders: Holder[],
  investment: number,
  preMoney: number,
  investorId: string,
  investorName: string,
): { holders: Holder[]; pricePerShare: number; newShares: number; postMoney: number } {
  const before = totalShares(holders);
  if (!(investment > 0 && preMoney > 0 && before > 0)) return { holders, pricePerShare: 0, newShares: 0, postMoney: preMoney };
  const pricePerShare = preMoney / before;
  const newShares = Math.round(investment / pricePerShare);
  return {
    holders: addShares(holders, investorId, investorName, 'investor', newShares),
    pricePerShare,
    newShares,
    postMoney: preMoney + investment,
  };
}

/** Apply a list of steps in order and return the cap table after each one. */
export function runSteps(start: Holder[], steps: Step[]): StepResult[] {
  const out: StepResult[] = [];
  let holders = start;
  for (const step of steps) {
    if (step.type === 'pool') {
      const r = topUpPool(holders, step.targetPct, 'pool', step.name);
      holders = r.holders;
      out.push({ step, holders, totalShares: totalShares(holders), newShares: r.newShares });
    } else {
      const r = priceRound(holders, step.investment, step.preMoney, step.id, step.name);
      holders = r.holders;
      out.push({ step, holders, totalShares: totalShares(holders), pricePerShare: r.pricePerShare, newShares: r.newShares, postMoney: r.postMoney });
    }
  }
  return out;
}

/** Value of a holding at a given price per share. */
export const stakeValue = (shares: number, pricePerShare: number) => shares * pricePerShare;
