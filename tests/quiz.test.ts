import { describe, expect, it } from 'vitest';
import {
  correctAnswerText,
  isAnswered,
  isCorrect,
  parseNumberCandidates,
  prepareQuiz,
  rng,
  scoreQuiz,
  shuffle,
  shuffleOptions,
  type Question,
} from '../src/lib/quiz';

const base = { category: 'A', topic: 't', difficulty: 'beginner' as const, explanation: 'e', lessonLink: '/learn/x', sources: [] };
const mc: Question = { ...base, id: 'A-1', type: 'multiple_choice', question: 'q', options: ['a', 'b', 'c', 'd'], answerIndex: 2 };
const ms: Question = { ...base, id: 'A-2', type: 'multiple_select', question: 'q', options: ['a', 'b', 'c', 'd'], answers: [0, 3] };
const tf: Question = { ...base, id: 'A-3', type: 'true_false', question: 'q', answerBool: false };
const num: Question = { ...base, id: 'A-4', type: 'number', question: 'q', answerNumber: 2.5, tolerance: 0.05, unit: '%' };
const ord: Question = { ...base, id: 'A-6', type: 'order', question: 'q', orderedItems: ['first', 'second', 'third'] };
const big: Question = { ...base, id: 'A-5', type: 'number', question: 'q', answerNumber: 1500, tolerance: 0 };

describe('parseNumberCandidates', () => {
  it('reads plain numbers and decimal commas', () => {
    expect(parseNumberCandidates('2.5')).toEqual([2.5]);
    expect(parseNumberCandidates('2,5')).toEqual([2.5]);
    expect(parseNumberCandidates(' 2,5 % ')).toEqual([2.5]);
    expect(parseNumberCandidates('€300')).toEqual([300]);
  });
  it('handles thousands separators in both styles', () => {
    expect(parseNumberCandidates('1,234.5')).toEqual([1234.5]);
    expect(parseNumberCandidates('1.234,5')).toEqual([1234.5]);
  });
  it('keeps both readings for ambiguous input', () => {
    expect(parseNumberCandidates('1,500').sort((a, b) => a - b)).toEqual([1.5, 1500]);
    expect(parseNumberCandidates('1.500').sort((a, b) => a - b)).toEqual([1.5, 1500]);
  });
  it('rejects text', () => {
    expect(parseNumberCandidates('')).toEqual([]);
    expect(parseNumberCandidates('ten')).toEqual([]);
  });
});

describe('isCorrect', () => {
  it('multiple choice', () => {
    expect(isCorrect(mc, 2)).toBe(true);
    expect(isCorrect(mc, 1)).toBe(false);
    expect(isCorrect(mc, undefined)).toBe(false);
  });
  it('multiple select needs exactly the right set', () => {
    expect(isCorrect(ms, [3, 0])).toBe(true);
    expect(isCorrect(ms, [0])).toBe(false);
    expect(isCorrect(ms, [0, 1, 3])).toBe(false);
  });
  it('true/false', () => {
    expect(isCorrect(tf, false)).toBe(true);
    expect(isCorrect(tf, true)).toBe(false);
  });
  it('numbers with tolerance and either decimal style', () => {
    expect(isCorrect(num, '2.5')).toBe(true);
    expect(isCorrect(num, '2,5%')).toBe(true);
    expect(isCorrect(num, '2.54')).toBe(true);
    expect(isCorrect(num, '2.6')).toBe(false);
    expect(isCorrect(big, '1,500')).toBe(true);
    expect(isCorrect(big, '1.500')).toBe(true);
    expect(isCorrect(big, '15')).toBe(false);
  });
});

describe('order questions', () => {
  it('are correct only in the exact order', () => {
    expect(isCorrect(ord, [0, 1, 2])).toBe(true);
    expect(isCorrect(ord, [1, 0, 2])).toBe(false);
    expect(isCorrect(ord, [0, 1])).toBe(false);
    expect(isCorrect(ord, 'first')).toBe(false);
  });
  it('never start in the solved order and keep every item', () => {
    for (let seed = 1; seed < 60; seed++) {
      const q = shuffleOptions(ord, rng(seed)) as Extract<Question, { type: 'order' }>;
      expect(q.initialOrder).toBeDefined();
      expect([...q.initialOrder!].sort()).toEqual([0, 1, 2]);
      expect(isCorrect(q, q.initialOrder)).toBe(false);
    }
  });
  it('shows the full sequence as the correct answer', () => {
    expect(correctAnswerText(ord, { true: 'True', false: 'False' })).toBe('1. first → 2. second → 3. third');
  });
});

describe('shuffling', () => {
  it('is reproducible with a seed and keeps all items', () => {
    const a = shuffle([1, 2, 3, 4, 5], rng(42));
    expect(shuffle([1, 2, 3, 4, 5], rng(42))).toEqual(a);
    expect([...a].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('remaps correct answers when options move', () => {
    for (let seed = 1; seed < 30; seed++) {
      const q = shuffleOptions(mc, rng(seed)) as Extract<Question, { type: 'multiple_choice' }>;
      expect(q.options[q.answerIndex]).toBe('c');
      const m = shuffleOptions(ms, rng(seed)) as Extract<Question, { type: 'multiple_select' }>;
      expect(m.answers.map((i) => m.options[i]).sort()).toEqual(['a', 'd']);
    }
  });

  it('never starts with the question shown last', () => {
    for (let seed = 1; seed < 50; seed++) {
      expect(prepareQuiz([mc, ms, tf], rng(seed), 'A-1')[0].id).not.toBe('A-1');
    }
  });
});

describe('scoreQuiz', () => {
  it('counts correct answers and lists wrong ones', () => {
    const r = scoreQuiz([mc, ms, tf, num], { 'A-1': 2, 'A-2': [0], 'A-3': false });
    expect(r).toEqual({ correct: 2, total: 4, percent: 50, wrongIds: ['A-2', 'A-4'] });
  });
  it('handles an empty quiz', () => {
    expect(scoreQuiz([], {}).percent).toBe(0);
  });
});

describe('correctAnswerText', () => {
  const labels = { true: 'True', false: 'False' };
  it('formats each type', () => {
    expect(correctAnswerText(mc, labels)).toBe('c');
    expect(correctAnswerText(ms, labels)).toBe('a; d');
    expect(correctAnswerText(tf, labels)).toBe('False');
    expect(correctAnswerText(num, labels)).toBe('2.5 %');
  });
});

describe('match questions', () => {
  const m: Question = { ...base, id: 'A-7', type: 'match', question: 'q', pairs: [['a', '1'], ['b', '2'], ['c', '3']] };
  it('is correct only when every left item has its own right item', () => {
    expect(isCorrect(m, [0, 1, 2])).toBe(true);
    expect(isCorrect(m, [1, 0, 2])).toBe(false);
    expect(isCorrect(m, [0, 1, -1])).toBe(false);
    expect(isCorrect(m, [0, 1])).toBe(false);
  });
  it('needs every pair chosen before it counts as answered', () => {
    expect(isAnswered(m, [0, -1, 2])).toBe(false);
    expect(isAnswered(m, [2, 0, 1])).toBe(true);
    expect(isAnswered(mc, undefined)).toBe(false);
    expect(isAnswered(num, '  ')).toBe(false);
    expect(isAnswered(ord, undefined)).toBe(true);
  });
  it('shuffles the right-hand list so it never starts in the solved order', () => {
    for (let s = 1; s < 30; s++) {
      const sh = shuffleOptions(m, rng(s));
      if (sh.type !== 'match') throw new Error('type');
      expect([...sh.rightOrder!].sort()).toEqual([0, 1, 2]);
      expect(sh.rightOrder).not.toEqual([0, 1, 2]);
    }
  });
  it('shows the pairs as the correct answer', () => {
    expect(correctAnswerText(m, { true: 'T', false: 'F' })).toBe('a → 1; b → 2; c → 3');
  });
});
