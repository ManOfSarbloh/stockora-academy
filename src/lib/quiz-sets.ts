/**
 * Which questions belong to which quiz on the hub: special quizzes, the glossary quiz generator and
 * the quiz-set ids used in URLs (/quizzes/play/?set=...). Pure functions, unit-tested.
 */
import { rng, shuffle, type Question } from './quiz';

/** Pseudo-category for generated glossary questions. */
export const GLOSSARY_CATEGORY = 'GL';
/** Category of the "How Stocks Are Made" journey quiz. */
export const JOURNEY_CATEGORY = 'HSM';

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  categories: string[];
  aliases?: string[];
}

export type SpecialId =
  | 'glossary'
  | 'trading-times'
  | 'how-stocks-are-made'
  | 'scam-spotter'
  | 'taxes-austria'
  | 'calculation'
  | 'chart-reading'
  | 'true-or-myth'
  | 'timeline'
  | 'world-matching';

export interface SpecialQuiz {
  id: SpecialId;
  /** Questions per run (a random draw from the pool). */
  size: number;
  /** Quizzes that live on their own page instead of the quiz player. */
  href?: string;
  pool?: (q: Question) => boolean;
}

export const SPECIAL_QUIZZES: SpecialQuiz[] = [
  { id: 'glossary', size: 15, pool: (q) => q.category === GLOSSARY_CATEGORY },
  { id: 'trading-times', size: 15, pool: (q) => q.category === 'E' },
  { id: 'how-stocks-are-made', size: 15, pool: (q) => q.category === 'B' || q.category === JOURNEY_CATEGORY },
  { id: 'scam-spotter', size: 15, pool: (q) => q.category === 'T' },
  { id: 'taxes-austria', size: 15, pool: (q) => q.category === 'Q' },
  { id: 'calculation', size: 15, pool: (q) => q.type === 'number' && q.category !== GLOSSARY_CATEGORY },
  { id: 'chart-reading', size: 0, href: '/charts/quiz' },
  { id: 'true-or-myth', size: 15, pool: (q) => q.type === 'true_false' },
  { id: 'timeline', size: 12, pool: (q) => q.type === 'order' || q.category === 'K' },
  { id: 'world-matching', size: 0, href: '/quizzes/world-game' },
];

export const specialById = (id: string) => SPECIAL_QUIZZES.find((s) => s.id === id);

/** For the timeline quiz, put ordering questions first so every run includes them. */
export function pickSpecial(special: SpecialQuiz, questions: Question[], random: () => number = Math.random): Question[] {
  const pool = shuffle(questions.filter(special.pool ?? (() => false)), random);
  if (special.id === 'timeline') pool.sort((a, b) => (a.type === 'order' ? 0 : 1) - (b.type === 'order' ? 0 : 1));
  return pool.slice(0, special.size);
}

const mentions = (text: string, word: string) => word.length > 2 && text.toLowerCase().includes(word.toLowerCase());

/**
 * One multiple-choice question per glossary term: "Which term matches this definition?" with three
 * other terms as distractors, preferably from the same topic. Terms whose definition gives the answer
 * away (it contains the term or an alias) are skipped. Deterministic for a given seed.
 */
/** `prompt` is the question text; "{def}" is replaced with the definition. */
export function glossaryQuestions(items: GlossaryItem[], seed = 1, prompt = 'Which term matches this definition? "{def}"'): Question[] {
  const random = rng(seed);
  const usable = items.filter((g) => !mentions(g.definition, g.term) && !(g.aliases ?? []).some((a) => mentions(g.definition, a)));
  return usable.map((g) => {
    const sameTopic = items.filter((o) => o.id !== g.id && o.categories.some((c) => g.categories.includes(c)));
    const others = items.filter((o) => o.id !== g.id && !sameTopic.includes(o));
    const distractors = [...shuffle(sameTopic, random), ...shuffle(others, random)]
      .filter((o, i, arr) => arr.findIndex((x) => x.term.toLowerCase() === o.term.toLowerCase()) === i && o.term.toLowerCase() !== g.term.toLowerCase())
      .slice(0, 3)
      .map((o) => o.term);
    const options = [g.term, ...distractors];
    return {
      id: `GL-${g.id}`,
      category: GLOSSARY_CATEGORY,
      topic: 'glossary',
      difficulty: 'beginner',
      type: 'multiple_choice',
      question: prompt.replace('{def}', g.definition),
      options,
      answerIndex: 0,
      explanation: `${g.term}: ${g.definition}`,
      lessonLink: `/glossary#${g.id}`,
      sources: [],
    } satisfies Question;
  });
}

// ---------------------------------------------------------------------------
// Quiz-set ids in URLs
// ---------------------------------------------------------------------------

export type Kind = 'category' | 'country' | 'special' | 'mega' | 'exam' | 'daily' | 'weak' | 'review' | 'custom';
export type Mode = 'practice' | 'exam';

export interface PlayConfig {
  kind: Kind;
  /** Category id, country code or special id. */
  id?: string;
  mode: Mode;
  /** Number of questions (mega, custom, weak, review). */
  n?: number;
  level?: Question['difficulty'] | null;
  /** Categories for the custom quiz. */
  cats?: string[];
  /** Timer in minutes (exam mode only); 0 = no timer. */
  minutes?: number;
}

const KINDS: Kind[] = ['category', 'country', 'special', 'mega', 'exam', 'daily', 'weak', 'review', 'custom'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const clampN = (v: string | null, def: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? Math.min(100, Math.round(n)) : def;
};

/** Read a play config from a URL query string. Unknown values fall back to safe defaults. */
export function parsePlayConfig(search: string): PlayConfig {
  const p = new URLSearchParams(search);
  const kind = (KINDS as string[]).includes(p.get('kind') ?? '') ? (p.get('kind') as Kind) : 'mega';
  const level = LEVELS.includes(p.get('level') ?? '') ? (p.get('level') as Question['difficulty']) : null;
  const mode: Mode = kind === 'exam' ? 'exam' : p.get('mode') === 'exam' ? 'exam' : 'practice';
  const cats = (p.get('cats') ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter((c) => /^[A-Z]{1,3}$/.test(c));
  const minutes = clampN(p.get('minutes'), 0);
  return {
    kind,
    id: p.get('id') ?? undefined,
    mode,
    n: clampN(p.get('n'), kind === 'mega' ? 20 : 15),
    level,
    cats,
    minutes: mode === 'exam' ? (p.get('minutes') ? minutes : 0) : 0,
  };
}

/** Build the query string for a play config (inverse of parsePlayConfig for the fields that matter). */
export function playQuery(c: Partial<PlayConfig> & { kind: Kind }): string {
  const p = new URLSearchParams({ kind: c.kind });
  if (c.id) p.set('id', c.id);
  if (c.mode === 'exam' && c.kind !== 'exam') p.set('mode', 'exam');
  if (c.n) p.set('n', String(c.n));
  if (c.level) p.set('level', c.level);
  if (c.cats?.length) p.set('cats', c.cats.join(','));
  if (c.minutes) p.set('minutes', String(c.minutes));
  return `?${p}`;
}
