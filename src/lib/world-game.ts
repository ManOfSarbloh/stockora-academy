/**
 * World Markets Matching Game: items built from the country pages (indexes and non-euro currencies)
 * and the logic for picking rounds. Pure functions, unit-tested.
 */
import { shuffle } from './quiz';

export interface GameCountry {
  code: string;
  name: string;
  indexes: string[];
  currency: { code: string; name: string };
}

export interface GameItem {
  kind: 'index' | 'currency';
  /** What the player sees, e.g. "DAX" or "Swiss franc (CHF)". */
  label: string;
  /** The country it belongs to. */
  code: string;
}

/** "ATX (Austrian Traded Index)" → "ATX": the long name often gives the country away. */
export const shortIndexName = (name: string) => name.replace(/\s*\(.*\)\s*$/, '').trim();

/**
 * Every index of every country, plus currencies that belong to exactly one country in the list
 * (the euro is shared, so it cannot be matched to one country).
 */
export function buildGameItems(countries: GameCountry[]): GameItem[] {
  const items: GameItem[] = [];
  for (const c of countries) for (const i of c.indexes) items.push({ kind: 'index', label: shortIndexName(i), code: c.code });
  const byCurrency = new Map<string, GameCountry[]>();
  for (const c of countries) byCurrency.set(c.currency.code, [...(byCurrency.get(c.currency.code) ?? []), c]);
  for (const [code, list] of byCurrency) {
    if (list.length === 1) items.push({ kind: 'currency', label: `${list[0].currency.name} (${code})`, code: list[0].code });
  }
  // Labels must be unique, otherwise a question could have two right answers.
  const seen = new Map<string, number>();
  for (const it of items) seen.set(it.label, (seen.get(it.label) ?? 0) + 1);
  return items.filter((it) => seen.get(it.label) === 1);
}

/** n items for one round, each from a different country. */
export function pickRound(items: GameItem[], n: number, random: () => number = Math.random): GameItem[] {
  const out: GameItem[] = [];
  const used = new Set<string>();
  for (const it of shuffle(items, random)) {
    if (used.has(it.code)) continue;
    out.push(it);
    used.add(it.code);
    if (out.length === n) break;
  }
  return out;
}
