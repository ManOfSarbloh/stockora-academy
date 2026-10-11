/**
 * Quiz logic: answer checking, option shuffling and scoring. Pure functions, unit-tested.
 * The question shapes mirror the `quizzes` schema in src/content.config.ts.
 */

interface Base {
  id: string;
  category: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  explanation: string;
  lessonLink: string;
  sources: string[];
}

export type Question =
  | (Base & { type: 'multiple_choice'; options: string[]; answerIndex: number })
  | (Base & { type: 'multiple_select'; options: string[]; answers: number[] })
  | (Base & { type: 'true_false'; answerBool: boolean })
  | (Base & { type: 'number'; answerNumber: number; tolerance: number; unit?: string })
  | (Base & { type: 'match'; pairs: [string, string][] })
  | (Base & { type: 'order'; orderedItems: string[]; /** Set by shuffleOptions: the order the items are first shown in (indices into orderedItems). */ initialOrder?: number[] });

export type AnswerValue = number | number[] | boolean | string;

/** Question types the practice quiz can show today (match arrives with the full quiz hub). */
export const SUPPORTED_TYPES = ['multiple_choice', 'multiple_select', 'true_false', 'number', 'order'] as const;
export const isSupported = (q: Question) => (SUPPORTED_TYPES as readonly string[]).includes(q.type);

/**
 * Possible numeric readings of what a learner typed. "2,5" (German decimal comma) and "2.5" both work;
 * ambiguous input like "1,500" yields both 1.5 and 1500, and the answer counts if either is right.
 */
export function parseNumberCandidates(input: string): number[] {
  const s = input.trim().replace(/[\s€$£%]/g, '').replace(/^\+/, '');
  if (!s || !/^-?[\d.,]+$/.test(s)) return [];
  const out = new Set<number>();
  const add = (str: string) => {
    const n = Number(str);
    if (str !== '' && Number.isFinite(n)) out.add(n);
  };
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  if (hasDot && hasComma) {
    // The later separator is the decimal one: "1,234.5" or "1.234,5".
    const dec = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
    const thou = dec === '.' ? ',' : '.';
    add(s.split(thou).join('').replace(dec, '.'));
  } else if (hasComma) {
    add(s.replace(',', '.'));
    if (/^-?\d{1,3}(,\d{3})+$/.test(s)) add(s.split(',').join(''));
  } else if (hasDot) {
    add(s);
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) add(s.split('.').join(''));
  } else {
    add(s);
  }
  return [...out];
}

export function isCorrect(q: Question, answer: AnswerValue | undefined): boolean {
  if (answer === undefined) return false;
  switch (q.type) {
    case 'multiple_choice':
      return answer === q.answerIndex;
    case 'multiple_select': {
      if (!Array.isArray(answer)) return false;
      const a = new Set(answer);
      return a.size === q.answers.length && q.answers.every((i) => a.has(i));
    }
    case 'true_false':
      return answer === q.answerBool;
    case 'number': {
      const tol = q.tolerance ?? 0;
      return parseNumberCandidates(String(answer)).some((n) => Math.abs(n - q.answerNumber) <= tol + 1e-9);
    }
    case 'order':
      // The answer lists indices into orderedItems in the order the learner arranged them.
      return Array.isArray(answer) && answer.length === q.orderedItems.length && answer.every((v, i) => v === i);
    default:
      return false;
  }
}

/** Small seeded random generator (mulberry32), so shuffles can be reproduced in tests. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffle the answer options of a question and remap the correct answer(s) to the new positions. */
export function shuffleOptions(q: Question, random: () => number = Math.random): Question {
  if (q.type === 'order') {
    const n = q.orderedItems.length;
    let initialOrder = shuffle(
      q.orderedItems.map((_, i) => i),
      random,
    );
    // Never start in the correct order: swap the first two if the shuffle happened to solve it.
    if (n > 1 && initialOrder.every((v, i) => v === i)) [initialOrder[0], initialOrder[1]] = [initialOrder[1], initialOrder[0]];
    initialOrder = [...initialOrder];
    return { ...q, initialOrder };
  }
  if (q.type !== 'multiple_choice' && q.type !== 'multiple_select') return q;
  const order = shuffle(
    q.options.map((_, i) => i),
    random,
  );
  const options = order.map((i) => q.options[i]);
  const newIndex = (old: number) => order.indexOf(old);
  return q.type === 'multiple_choice'
    ? { ...q, options, answerIndex: newIndex(q.answerIndex) }
    : { ...q, options, answers: q.answers.map(newIndex).sort((a, b) => a - b) };
}

/**
 * Prepare a quiz run: shuffle question order and options, and make sure the first question
 * is not the one that was shown last (so the same question never appears twice in a row on retry).
 */
export function prepareQuiz(questions: Question[], random: () => number = Math.random, lastShownId?: string): Question[] {
  const qs = shuffle(questions, random).map((q) => shuffleOptions(q, random));
  if (qs.length > 1 && qs[0].id === lastShownId) [qs[0], qs[1]] = [qs[1], qs[0]];
  return qs;
}

export interface QuizResult {
  correct: number;
  total: number;
  percent: number;
  wrongIds: string[];
}

export function scoreQuiz(questions: Question[], answers: Record<string, AnswerValue | undefined>): QuizResult {
  const wrongIds = questions.filter((q) => !isCorrect(q, answers[q.id])).map((q) => q.id);
  const total = questions.length;
  const correct = total - wrongIds.length;
  return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0, wrongIds };
}

/** Human-readable correct answer, for the feedback box. */
export function correctAnswerText(q: Question, labels: { true: string; false: string }): string {
  switch (q.type) {
    case 'multiple_choice':
      return q.options[q.answerIndex];
    case 'multiple_select':
      return q.answers.map((i) => q.options[i]).join('; ');
    case 'true_false':
      return q.answerBool ? labels.true : labels.false;
    case 'number':
      return `${q.answerNumber.toLocaleString('en')}${q.unit ? ` ${q.unit}` : ''}`;
    case 'order':
      return q.orderedItems.map((s, i) => `${i + 1}. ${s}`).join(' → ');
    default:
      return '';
  }
}
