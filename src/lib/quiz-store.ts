/**
 * Browser storage for the quiz hub (all in localStorage, prefixed "stockora-"; nothing leaves the browser).
 *  - quiz-scores: best and latest percentage per quiz id
 *  - quiz-stats:  per-question history for review and weak-spot modes (spaced repetition)
 *  - quiz-daily:  daily quiz streak
 *  - quiz-exam:   Final Exam attempts and pass date
 *  - quiz-name:   name printed on the certificate
 */
import categoriesJson from '../../content/categories.json';
import { readJSON, remove, writeJSON } from './storage';
import {
  badgeStatus,
  dayKey,
  emptyDaily,
  emptyExam,
  recordRun,
  saveScore,
  type BadgeId,
  type DailyState,
  type ExamState,
  type QuizStats,
  type ScoreBook,
} from './quiz-engine';

export const QUIZ_KEYS = ['quiz-scores', 'quiz-stats', 'quiz-daily', 'quiz-exam', 'quiz-name'] as const;

/** Topic categories (A–W) and country codes, for badge progress. */
export const TOPIC_IDS: string[] = (categoriesJson as { id: string }[]).map((c) => c.id);
export const COUNTRY_CODES: string[] = Object.keys(import.meta.glob('../../content/countries/*.json'))
  .map((p) => p.match(/([a-z]{2})\.json$/)?.[1]?.toUpperCase())
  .filter((c): c is string => !!c);

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

export const loadScores = (): ScoreBook => {
  const raw = readJSON<unknown>('quiz-scores', {});
  return isObj(raw) ? (raw as ScoreBook) : {};
};
export const loadStats = (): QuizStats => {
  const raw = readJSON<unknown>('quiz-stats', {});
  return isObj(raw) ? (raw as QuizStats) : {};
};
export const loadDaily = (): DailyState => {
  const raw = readJSON<unknown>('quiz-daily', null);
  return isObj(raw) && typeof raw.streak === 'number' ? { ...emptyDaily(), ...(raw as Partial<DailyState>) } : emptyDaily();
};
export const loadExam = (): ExamState => {
  const raw = readJSON<unknown>('quiz-exam', null);
  return isObj(raw) && typeof raw.attempts === 'number' ? { ...emptyExam(), ...(raw as Partial<ExamState>) } : emptyExam();
};
export const saveDaily = (d: DailyState) => writeJSON('quiz-daily', d);
export const saveExam = (e: ExamState) => writeJSON('quiz-exam', e);
export const loadName = () => readJSON<string>('quiz-name', '');
export const saveName = (n: string) => writeJSON('quiz-name', n);

export function earnedBadges(): BadgeId[] {
  return badgeStatus({ scores: loadScores(), daily: loadDaily(), exam: loadExam(), topicCategories: TOPIC_IDS, countryCodes: COUNTRY_CODES })
    .filter((b) => b.earned)
    .map((b) => b.id);
}

/** Fired on window after any quiz result is saved, so badges and progress widgets can update. */
export const QUIZ_EVENT = 'stockora:quiz-change';

/**
 * Save a finished quiz: score (when the run has an id), per-question history for spaced repetition.
 * Returns the badges earned by this run.
 */
export function recordQuizRun(quizId: string | null, results: { id: string; correct: boolean }[], extra?: () => void): BadgeId[] {
  const before = new Set(earnedBadges());
  const now = new Date();
  if (quizId && results.length) {
    const pct = Math.round((results.filter((r) => r.correct).length / results.length) * 100);
    writeJSON('quiz-scores', saveScore(loadScores(), quizId, pct, results.length, now));
  }
  writeJSON('quiz-stats', recordRun(loadStats(), results, dayKey(now)));
  extra?.();
  const gained = earnedBadges().filter((b) => !before.has(b));
  try {
    window.dispatchEvent(new CustomEvent(QUIZ_EVENT));
  } catch {
    /* no window in tests */
  }
  return gained;
}

/** Save only a score (for games whose rounds are not questions from the bank). Returns new badges. */
export function saveGameScore(quizId: string, percent: number, n: number): BadgeId[] {
  const before = new Set(earnedBadges());
  writeJSON('quiz-scores', saveScore(loadScores(), quizId, percent, n, new Date()));
  try {
    window.dispatchEvent(new CustomEvent(QUIZ_EVENT));
  } catch {
    /* ignore */
  }
  return earnedBadges().filter((b) => !before.has(b));
}

export function resetQuizData() {
  for (const k of QUIZ_KEYS) remove(k);
}
