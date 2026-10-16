/**
 * Quiz hub logic: picking questions for each mode, spaced repetition, the daily streak and badges.
 * Pure functions (no storage, no DOM), unit-tested in tests/quiz-engine.test.ts.
 */
import { rng, shuffle, type Question } from './quiz';

export type Level = Question['difficulty'];

// ---------------------------------------------------------------------------
// Dates (local calendar days as "YYYY-MM-DD")
// ---------------------------------------------------------------------------

export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Add whole days to a "YYYY-MM-DD" key (calendar arithmetic, independent of time zones and DST). */
export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/** Stable 32-bit hash of a string (FNV-1a), used to seed the daily quiz. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// ---------------------------------------------------------------------------
// Spaced repetition (a simple Leitner system)
// ---------------------------------------------------------------------------

/** Per-question history. `box` 1–5: wrong answers go back to box 1 and are due again the same day. */
export interface QuestionStat {
  seen: number;
  correct: number;
  box: number;
  due: string;
  last: string;
  lastCorrect: boolean;
}
export type QuizStats = Record<string, QuestionStat>;

/** Days until a question is due again after a correct answer, by the box it moves into. */
export const BOX_INTERVALS = [0, 1, 3, 7, 14, 30];
export const MAX_BOX = 5;

export function recordAnswer(stats: QuizStats, id: string, correct: boolean, today: string): QuizStats {
  const prev = stats[id];
  const box = correct ? Math.min(MAX_BOX, (prev?.box ?? 0) + 1) : 1;
  const next: QuestionStat = {
    seen: (prev?.seen ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    box,
    due: correct ? addDays(today, BOX_INTERVALS[box]) : today,
    last: today,
    lastCorrect: correct,
  };
  return { ...stats, [id]: next };
}

export function recordRun(stats: QuizStats, results: { id: string; correct: boolean }[], today: string): QuizStats {
  return results.reduce((s, r) => recordAnswer(s, r.id, r.correct, today), stats);
}

/** Questions due for review: answered before and due today or earlier. Wrong and overdue ones first. */
export function dueForReview(questions: Question[], stats: QuizStats, today: string): Question[] {
  return questions
    .filter((q) => stats[q.id] && stats[q.id].due <= today)
    .sort((a, b) => {
      const sa = stats[a.id];
      const sb = stats[b.id];
      if (sa.lastCorrect !== sb.lastCorrect) return sa.lastCorrect ? 1 : -1;
      if (sa.box !== sb.box) return sa.box - sb.box;
      return sa.due.localeCompare(sb.due);
    });
}

/** Questions answered wrong the last time they were seen (for "retry my mistakes"). */
export function lastWrong(questions: Question[], stats: QuizStats): Question[] {
  return questions.filter((q) => stats[q.id] && !stats[q.id].lastCorrect);
}

export interface CategoryAccuracy {
  category: string;
  answered: number;
  correct: number;
  percent: number;
}

/** Accuracy per category over every recorded answer. */
export function categoryAccuracy(questions: Question[], stats: QuizStats): CategoryAccuracy[] {
  const acc = new Map<string, { answered: number; correct: number }>();
  for (const q of questions) {
    const s = stats[q.id];
    if (!s) continue;
    const a = acc.get(q.category) ?? { answered: 0, correct: 0 };
    a.answered += s.seen;
    a.correct += s.correct;
    acc.set(q.category, a);
  }
  return [...acc.entries()]
    .map(([category, a]) => ({ category, ...a, percent: Math.round((a.correct / a.answered) * 100) }))
    .sort((a, b) => a.percent - b.percent || b.answered - a.answered);
}

/** Categories with enough answers to judge, weakest first. */
export function weakCategories(questions: Question[], stats: QuizStats, minAnswered = 3, count = 3): string[] {
  return categoryAccuracy(questions, stats)
    .filter((c) => c.answered >= minAnswered && c.percent < 100)
    .slice(0, count)
    .map((c) => c.category);
}

/**
 * Weak-spot mode: questions from the categories where the learner scores lowest, preferring
 * questions answered wrong last time, then unseen ones, then the rest. Returns [] when there is
 * not enough history yet.
 */
export function pickWeakSpot(questions: Question[], stats: QuizStats, n: number, random: () => number = Math.random): Question[] {
  const cats = weakCategories(questions, stats);
  if (cats.length === 0) return [];
  const pool = questions.filter((q) => cats.includes(q.category));
  const rank = (q: Question) => (stats[q.id] ? (stats[q.id].lastCorrect ? 2 : 0) : 1);
  const shuffled = shuffle(pool, random);
  return shuffled.sort((a, b) => rank(a) - rank(b)).slice(0, n);
}

// ---------------------------------------------------------------------------
// Picking questions
// ---------------------------------------------------------------------------

/**
 * Draw n questions spread across categories: categories are visited in a shuffled round-robin,
 * so a 20-question quiz does not end up with five questions from one topic.
 */
export type GroupOf = (q: Question) => string;
const byCategory: GroupOf = (q) => q.category;

export function pickSpread(questions: Question[], n: number, random: () => number = Math.random, groupOf: GroupOf = byCategory): Question[] {
  const byCat = new Map<string, Question[]>();
  for (const q of shuffle(questions, random)) {
    const g = groupOf(q);
    const list = byCat.get(g) ?? [];
    list.push(q);
    byCat.set(g, list);
  }
  const cats = shuffle([...byCat.keys()], random);
  const out: Question[] = [];
  for (let round = 0; out.length < n; round++) {
    let added = false;
    for (const c of cats) {
      const q = byCat.get(c)![round];
      if (q && out.length < n) {
        out.push(q);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

export function filterLevel(questions: Question[], level: Level | null | undefined): Question[] {
  return level ? questions.filter((q) => q.difficulty === level) : questions;
}

/** The Mega Quiz: n questions from everything, optionally one level only. */
export function pickMega(questions: Question[], n: number, level?: Level | null, random: () => number = Math.random, groupOf?: GroupOf): Question[] {
  return pickSpread(filterLevel(questions, level), n, random, groupOf);
}

/** Final Exam settings. */
export const EXAM = { questions: 100, minutes: 100, passPercent: 80 } as const;

/**
 * Final Exam: 100 questions covering every topic. Each of the topic categories gets an equal share
 * first; the remaining places are filled from everything (countries and the journey quiz included).
 */
export function pickExam(questions: Question[], topicCategories: string[], random: () => number = Math.random, groupOf?: GroupOf): Question[] {
  const perTopic = Math.floor((EXAM.questions * 0.88) / Math.max(1, topicCategories.length));
  const chosen: Question[] = [];
  for (const c of topicCategories) {
    chosen.push(...shuffle(questions.filter((q) => q.category === c), random).slice(0, perTopic));
  }
  const used = new Set(chosen.map((q) => q.id));
  const rest = pickSpread(
    questions.filter((q) => !used.has(q.id)),
    EXAM.questions - chosen.length,
    random,
    groupOf,
  );
  return shuffle([...chosen, ...rest], random);
}

/**
 * Daily quiz: the same five questions for everyone on a given day, from five different categories,
 * beginner and intermediate only.
 */
export const DAILY_SIZE = 5;
export function pickDaily(questions: Question[], day: string, groupOf?: GroupOf): Question[] {
  const pool = questions.filter((q) => q.difficulty !== 'advanced').sort((a, b) => a.id.localeCompare(b.id));
  return pickSpread(pool, DAILY_SIZE, rng(hashString(`stockora-daily-${day}`)), groupOf);
}

// ---------------------------------------------------------------------------
// Daily streak
// ---------------------------------------------------------------------------

export interface DailyState {
  /** Day of the last completed daily quiz. */
  lastDay: string | null;
  streak: number;
  best: number;
  /** Score of the last completed daily quiz, for "come back tomorrow". */
  lastScore: number | null;
}

export const emptyDaily = (): DailyState => ({ lastDay: null, streak: 0, best: 0, lastScore: null });

export function completeDaily(state: DailyState, today: string, score: number): DailyState {
  if (state.lastDay === today) return { ...state, lastScore: Math.max(state.lastScore ?? 0, score) };
  const streak = state.lastDay === addDays(today, -1) ? state.streak + 1 : 1;
  return { lastDay: today, streak, best: Math.max(state.best, streak), lastScore: score };
}

/** The streak as it stands today: it breaks once a whole day has been missed. */
export function currentStreak(state: DailyState, today: string): number {
  if (!state.lastDay) return 0;
  return state.lastDay === today || state.lastDay === addDays(today, -1) ? state.streak : 0;
}

// ---------------------------------------------------------------------------
// Scores and badges
// ---------------------------------------------------------------------------

export interface ScoreRecord {
  best: number;
  last: number;
  date: string;
  /** Number of questions in the last run (missing in records saved before Phase 9). */
  n?: number;
}
export type ScoreBook = Record<string, ScoreRecord>;

export function saveScore(book: ScoreBook, quizId: string, percent: number, n: number, now: Date): ScoreBook {
  const prev = book[quizId];
  return { ...book, [quizId]: { best: Math.max(prev?.best ?? 0, percent), last: percent, date: now.toISOString(), n } };
}

export interface ExamState {
  passed: boolean;
  best: number;
  /** Date of the first pass (printed on the certificate). */
  passedOn: string | null;
  attempts: number;
}
export const emptyExam = (): ExamState => ({ passed: false, best: 0, passedOn: null, attempts: 0 });

export function recordExam(state: ExamState, percent: number, today: string): ExamState {
  const passed = percent >= EXAM.passPercent;
  return {
    passed: state.passed || passed,
    best: Math.max(state.best, percent),
    passedOn: state.passedOn ?? (passed ? today : null),
    attempts: state.attempts + 1,
  };
}

export type BadgeId = 'first-quiz' | 'perfect' | 'category-master' | 'world-traveler' | 'scam-spotter' | 'founder' | 'streak-7' | 'exam-passed';
export const BADGES: BadgeId[] = ['first-quiz', 'perfect', 'category-master', 'world-traveler', 'scam-spotter', 'founder', 'streak-7', 'exam-passed'];

export interface BadgeInput {
  scores: ScoreBook;
  daily: DailyState;
  exam: ExamState;
  /** Topic category ids (A–W), for "Category Master". */
  topicCategories: string[];
  /** Country codes with a quiz, for "World Traveler". */
  countryCodes: string[];
}

export interface BadgeStatus {
  id: BadgeId;
  earned: boolean;
  /** Progress towards the badge, e.g. 12 of 20 countries. */
  progress?: { done: number; total: number };
}

/** Quiz ids used across the site. */
export const quizIds = {
  category: (id: string) => id,
  country: (code: string) => `country-${code}`,
  special: (id: string) => `special-${id}`,
  journey: 'HSM',
};

export const MASTER_PERCENT = 80;
/** A "Perfect Score" needs a real quiz, not a two-question check. */
export const PERFECT_MIN_QUESTIONS = 5;

export function badgeStatus(input: BadgeInput): BadgeStatus[] {
  const { scores, daily, exam, topicCategories, countryCodes } = input;
  const best = (id: string) => scores[id]?.best ?? -1;
  const mastered = topicCategories.filter((c) => best(quizIds.category(c)) >= MASTER_PERCENT).length;
  const countriesDone = countryCodes.filter((c) => scores[quizIds.country(c)]).length;
  const perfect = Object.values(scores).some((r) => r.best === 100 && (r.n ?? 0) >= PERFECT_MIN_QUESTIONS);
  const scam = Math.max(best(quizIds.special('scam-spotter')), best(quizIds.category('T'))) >= MASTER_PERCENT;
  const founder = Math.max(best(quizIds.journey), best(quizIds.special('how-stocks-are-made'))) >= 0;
  return [
    { id: 'first-quiz', earned: Object.keys(scores).length > 0 },
    { id: 'perfect', earned: perfect },
    { id: 'category-master', earned: mastered > 0, progress: { done: mastered, total: topicCategories.length } },
    { id: 'world-traveler', earned: countryCodes.length > 0 && countriesDone === countryCodes.length, progress: { done: countriesDone, total: countryCodes.length } },
    { id: 'scam-spotter', earned: scam },
    { id: 'founder', earned: founder },
    { id: 'streak-7', earned: daily.best >= 7, progress: { done: Math.min(daily.best, 7), total: 7 } },
    { id: 'exam-passed', earned: exam.passed },
  ];
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

export interface CategoryResult {
  category: string;
  correct: number;
  total: number;
  percent: number;
}

/** Per-category breakdown of one run, sorted by category order as given (or by appearance). */
export function breakdown(results: { category: string; correct: boolean }[], order?: string[]): CategoryResult[] {
  const map = new Map<string, { correct: number; total: number }>();
  for (const r of results) {
    const m = map.get(r.category) ?? { correct: 0, total: 0 };
    m.total += 1;
    if (r.correct) m.correct += 1;
    map.set(r.category, m);
  }
  const rows = [...map.entries()].map(([category, m]) => ({ category, ...m, percent: Math.round((m.correct / m.total) * 100) }));
  if (order) rows.sort((a, b) => idx(order, a.category) - idx(order, b.category));
  return rows;
}
const idx = (order: string[], c: string) => (order.includes(c) ? order.indexOf(c) : order.length);

/** "1:05:09" or "4:07" style elapsed or remaining time. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}
