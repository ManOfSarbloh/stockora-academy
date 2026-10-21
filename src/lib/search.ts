/**
 * Search helpers shared by the search page (build time) and its script (browser): turning a typed
 * question into the words worth searching for, classifying pages for the result filters, and
 * finding instant answers (glossary terms, tools, countries, topics, sections) in a small index
 * that is built into the search page. Pure functions, no Astro or browser APIs.
 */
import type { Locale } from '@/i18n/locales';

/** Lower case, no accents, typographic apostrophes straightened, punctuation turned into spaces. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’‘`´]/g, "'")
    .replace(/[^\p{L}\p{N}'&+\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Question openers per language, longest first so "what does" wins over "what". Normalized form. */
const QUESTION_STARTS: Record<Locale, string[]> = {
  en: [
    'what is the meaning of', 'what is meant by', 'what does the term', 'what does', 'what are', "what's", 'what is', 'whats',
    'how do i calculate', 'how do you calculate', 'how to calculate', 'how does', 'how do', 'how to', 'how is', 'how are',
    'can you explain', 'explain', 'define', 'definition of', 'meaning of', 'tell me about', 'why do', 'why does', 'why is', 'why are', 'when is', 'when do', 'where is', 'who is',
  ],
  de: [
    'was versteht man unter', 'was bedeutet', 'was heisst', 'was sind', 'was ist', 'wie funktionieren', 'wie funktioniert', 'wie berechnet man',
    'wie berechne ich', 'wie kann ich', 'wie viel', 'wie', 'erklare', 'erklar mir', 'definition von', 'bedeutung von', 'warum', 'wann', 'wo ist', 'wer ist',
  ],
  es: [
    'que significa', 'que quiere decir', 'que es', 'que son', 'como funcionan', 'como funciona', 'como se calcula', 'como calcular', 'como',
    'explica', 'explicame', 'definicion de', 'significado de', 'por que', 'cuando', 'donde', 'quien es',
  ],
  fr: [
    "qu'est-ce qu'un", "qu'est-ce qu'une", "qu'est-ce que", "qu'est ce que", "qu'est-ce qu'", "c'est quoi", 'que signifie', 'que veut dire',
    'comment fonctionnent', 'comment fonctionne', 'comment calculer', 'comment', 'explique', 'expliquez', 'definition de', 'definition du', 'signification de', 'pourquoi', 'quand', 'ou est', 'qui est',
  ],
  it: [
    "che cos'e", "che cosa e", "cos'e", 'cosa e', 'cosa sono', 'cosa significa', 'che significa', 'come funzionano', 'come funziona',
    'come si calcola', 'come calcolare', 'come', 'spiega', 'spiegami', 'definizione di', 'significato di', 'perche', 'quando', 'dove', 'chi e',
  ],
  ru: [
    'что такое', 'что значит', 'что означает', 'как работает', 'как работают', 'как рассчитать', 'как посчитать', 'как',
    'объясните', 'объясни', 'определение', 'значение', 'почему', 'когда', 'где', 'кто такой',
  ],
};

const ARTICLES: Record<Locale, string[]> = {
  en: ['a', 'an', 'the'],
  de: ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'man'],
  es: ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo'],
  fr: ['le', 'la', 'les', "l'", 'un', 'une', 'des', 'du', 'de', "d'"],
  it: ['il', 'lo', 'la', 'i', 'gli', 'le', "l'", 'un', 'uno', 'una', "un'", 'del', 'della', 'dei', 'delle'],
  ru: [],
};

/** Trailing words that only belong to the question ("… mean", "… bedeutet"). */
const QUESTION_ENDS: Record<Locale, string[]> = {
  en: ['mean', 'means', 'meaning', 'work', 'works', 'calculated', 'stand for'],
  de: ['bedeutet', 'bedeutung', 'funktioniert', 'gemeint'],
  es: ['significa', 'funciona'],
  fr: ['signifie', 'veut dire', 'fonctionne'],
  it: ['significa', 'funziona', 'vuol dire'],
  ru: ['значит', 'означает', 'работает'],
};

/**
 * The words of a query worth searching for: "What is a dividend?" → "dividend",
 * "Qu'est-ce qu'une action ?" → "action". Returns the normalized query if nothing is stripped,
 * and never returns an empty string for a non-empty query.
 */
export function questionCore(query: string, locale: Locale = 'en'): string {
  const full = normalize(query);
  let s = full;
  const langs: Locale[] = locale === 'en' ? ['en'] : [locale, 'en'];
  for (const l of langs) {
    const start = QUESTION_STARTS[l].find((p) => s === p || s.startsWith(`${p} `) || (p.endsWith("'") && s.startsWith(p)));
    if (start) {
      s = s.slice(start.length).trim();
      break;
    }
  }
  for (const l of langs) {
    for (const a of ARTICLES[l]) {
      if (a.endsWith("'") ? s.startsWith(a) : s.startsWith(`${a} `)) {
        s = s.slice(a.length).trim();
        break;
      }
    }
  }
  for (const l of langs) {
    const end = QUESTION_ENDS[l].find((e) => s.endsWith(` ${e}`));
    if (end) s = s.slice(0, -end.length - 1).trim();
  }
  return s || full;
}

export type PageType = 'lesson' | 'topic' | 'glossary' | 'country' | 'tool' | 'quiz' | 'chart' | 'page';
export const PAGE_TYPES: PageType[] = ['lesson', 'topic', 'glossary', 'country', 'tool', 'quiz', 'chart', 'page'];

/** Result filter for a page. `route` has no deploy base or locale prefix and ends with "/". */
export function pageType(route: string): PageType {
  if (/^\/learn\/[^/]+\/[^/]+\/$/.test(route)) return 'lesson';
  if (/^\/(learn|how-stocks-are-made)\//.test(route)) return 'topic';
  if (route === '/glossary/') return 'glossary';
  if (/^\/world\//.test(route)) return 'country';
  if (/^\/(tools|times)\//.test(route)) return 'tool';
  if (/^\/quizzes\//.test(route)) return 'quiz';
  if (/^\/charts\//.test(route)) return 'chart';
  return 'page';
}

export type QuickKind = 'term' | 'tool' | 'country' | 'topic' | 'section';

/** One instant-answer candidate in the search page's built-in index. */
export interface QuickEntry {
  kind: QuickKind;
  /** Title in the page's language. */
  title: string;
  /** English title, shown for glossary terms on translated pages (lessons use the English words). */
  en?: string;
  /** Site path without base or locale ("/glossary/#dividend"). */
  href: string;
  /** Glossary definition. */
  text?: string;
  /** Normalized names the entry answers to (title, English title, aliases). */
  names: string[];
}

/** Plural and simple inflection endings tried when comparing words ("dividends" ≈ "dividend"). */
const stem = (w: string) => w.replace(/(ies)$/, 'y').replace(/(es|en|s|n|e)$/, '');

function score(name: string, q: string): number {
  if (name === q) return 100;
  if (stem(name) === stem(q) && stem(q).length >= 3) return 95;
  if (q.length >= 3 && name.startsWith(q)) return 70 - Math.min(20, name.length - q.length);
  const words = name.split(' ');
  if (q.length >= 3 && words.some((w) => w === q || (stem(w) === stem(q) && stem(q).length >= 3))) return 55;
  if (q.length >= 4 && words.some((w) => w.startsWith(q))) return 40;
  if (q.length >= 5 && name.includes(q)) return 30;
  return 0;
}

/** Entries matching a query core, best first. Glossary terms beat other kinds on equal scores. */
export function findQuick(entries: QuickEntry[], core: string, limit = 6): { entry: QuickEntry; score: number }[] {
  const q = normalize(core);
  if (q.length < 2) return [];
  const kindBonus: Record<QuickKind, number> = { term: 3, tool: 2, country: 2, topic: 1, section: 0 };
  return entries
    .map((entry) => ({ entry, score: Math.max(0, ...entry.names.map((n) => score(n, q))) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score + kindBonus[b.entry.kind] - (a.score + kindBonus[a.entry.kind]) || a.entry.title.length - b.entry.title.length)
    .slice(0, limit);
}
