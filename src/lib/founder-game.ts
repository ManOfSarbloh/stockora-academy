/**
 * "Build your own company" mini-game: the choices a player makes and the cap table they lead to.
 * All offers and valuations are invented play money. Pure functions, unit-tested.
 */
import { priceRound, topUpPool, totalShares, type Holder } from './captable';

export type LegalForm = 'sole' | 'gmbh' | 'ag';

/** Austrian minimum share capital (USP, as of 2026): GmbH €10,000, AG €70,000. Sole traders have none. */
export const MIN_CAPITAL: Record<LegalForm, number> = { sole: 0, gmbh: 10_000, ag: 70_000 };

export const FOUNDING_SHARES = 1_000_000;

export interface RoundOffer {
  id: string;
  investment: number;
  preMoney: number;
}

export const SEED_OFFERS: RoundOffer[] = [
  { id: 'small', investment: 500_000, preMoney: 2_500_000 },
  { id: 'medium', investment: 1_000_000, preMoney: 4_000_000 },
  { id: 'large', investment: 2_000_000, preMoney: 5_000_000 },
];

export const SERIES_A_OFFERS: RoundOffer[] = [
  { id: 'small', investment: 3_000_000, preMoney: 12_000_000 },
  { id: 'medium', investment: 5_000_000, preMoney: 20_000_000 },
  { id: 'large', investment: 8_000_000, preMoney: 24_000_000 },
];

export const POOL_OPTIONS = [0, 0.1, 0.15] as const;

/** IPO price points: pre-money valuation and the (invented) coverage of the order book at that price. */
export const IPO_OPTIONS = [
  { id: 'low', preMoney: 60_000_000, coverage: 3.2 },
  { id: 'mid', preMoney: 80_000_000, coverage: 1.6 },
  { id: 'high', preMoney: 100_000_000, coverage: 0.8 },
] as const;

/** New money the company raises in the IPO (primary shares). */
export const IPO_RAISE = 20_000_000;
/** Share of your own shares you may sell in the IPO (secondary shares). */
export const SELL_OPTIONS = [0, 0.1, 0.25] as const;

export interface GameChoices {
  yourPct: number; // 0–1, your share of the founding shares
  seed: RoundOffer;
  poolPct: number;
  seriesA: RoundOffer;
  ipo: { preMoney: number; coverage: number };
  sellPct: number;
}

export interface GameStage {
  label: 'founding' | 'seed' | 'pool' | 'seriesA' | 'ipo';
  holders: Holder[];
  pricePerShare?: number;
}

export interface GameResult {
  stages: GameStage[];
  ipoPrice: number;
  /** False if the IPO book is not covered at the chosen price. */
  ipoCovered: boolean;
  yourShares: number;
  yourPct: number;
  yourPaperValue: number;
  yourCash: number;
  companyRaisedTotal: number;
  marketCap: number;
}

export function founders(yourPct: number): Holder[] {
  const you = Math.round(FOUNDING_SHARES * Math.min(1, Math.max(0, yourPct)));
  return [
    { id: 'f1', name: 'You', kind: 'founder', shares: you },
    { id: 'f2', name: 'Co-founder', kind: 'founder', shares: FOUNDING_SHARES - you },
  ].filter((h) => h.shares > 0) as Holder[];
}

export function playGame(c: GameChoices): GameResult {
  const stages: GameStage[] = [];
  let h = founders(c.yourPct);
  stages.push({ label: 'founding', holders: h });

  const seed = priceRound(h, c.seed.investment, c.seed.preMoney, 'r1', 'Seed investor');
  h = seed.holders;
  stages.push({ label: 'seed', holders: h, pricePerShare: seed.pricePerShare });

  if (c.poolPct > 0) {
    h = topUpPool(h, c.poolPct).holders;
    stages.push({ label: 'pool', holders: h });
  }

  const a = priceRound(h, c.seriesA.investment, c.seriesA.preMoney, 'r2', 'Series A fund');
  h = a.holders;
  stages.push({ label: 'seriesA', holders: h, pricePerShare: a.pricePerShare });

  // IPO: new shares for the company (primary), plus some of your shares sold to the public (secondary).
  const ipoPrice = c.ipo.preMoney / totalShares(h);
  const ipoCovered = c.ipo.coverage >= 1;
  const primary = priceRound(h, IPO_RAISE, c.ipo.preMoney, 'public', 'Public shareholders');
  h = primary.holders;
  const you = h.find((x) => x.id === 'f1');
  const sold = you ? Math.round(you.shares * c.sellPct) : 0;
  if (sold > 0) h = h.map((x) => (x.id === 'f1' ? { ...x, shares: x.shares - sold } : x.id === 'public' ? { ...x, shares: x.shares + sold } : x));
  stages.push({ label: 'ipo', holders: h, pricePerShare: ipoPrice });

  const yourShares = h.find((x) => x.id === 'f1')?.shares ?? 0;
  const total = totalShares(h);
  return {
    stages,
    ipoPrice,
    ipoCovered,
    yourShares,
    yourPct: total ? yourShares / total : 0,
    yourPaperValue: yourShares * ipoPrice,
    yourCash: sold * ipoPrice,
    companyRaisedTotal: c.seed.investment + c.seriesA.investment + IPO_RAISE,
    marketCap: total * ipoPrice,
  };
}
