import { describe, expect, it } from 'vitest';
import { rng, type Question } from '../src/lib/quiz';
import {
  EXAM,
  addDays,
  badgeStatus,
  breakdown,
  categoryAccuracy,
  completeDaily,
  currentStreak,
  dueForReview,
  emptyDaily,
  emptyExam,
  formatDuration,
  pickDaily,
  pickExam,
  pickMega,
  pickSpread,
  pickWeakSpot,
  recordAnswer,
  recordExam,
  recordRun,
  saveScore,
  type QuizStats,
} from '../src/lib/quiz-engine';
import { buildGameItems, pickRound, shortIndexName } from '../src/lib/world-game';
import { glossaryQuestions, parsePlayConfig, pickSpecial, playQuery, specialById } from '../src/lib/quiz-sets';

const mk = (id: string, category: string, difficulty: Question['difficulty'] = 'beginner', type: 'mc' | 'tf' | 'num' | 'order' = 'mc'): Question => {
  const base = { id, category, topic: 't', difficulty, question: id, explanation: 'e', lessonLink: '/learn/x', sources: [] };
  if (type === 'tf') return { ...base, type: 'true_false', answerBool: true };
  if (type === 'num') return { ...base, type: 'number', answerNumber: 1, tolerance: 0 };
  if (type === 'order') return { ...base, type: 'order', orderedItems: ['a', 'b'] };
  return { ...base, type: 'multiple_choice', options: ['a', 'b'], answerIndex: 0 };
};

const cats = ['A', 'B', 'C', 'D'];
const bank: Question[] = cats.flatMap((c) =>
  Array.from({ length: 30 }, (_, i) => mk(`${c}-${i}`, c, (['beginner', 'intermediate', 'advanced'] as const)[i % 3])),
);

describe('dates', () => {
  it('adds days across month ends and DST changes', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('spaced repetition', () => {
  it('moves a correct answer up a box and schedules it later', () => {
    let s: QuizStats = {};
    s = recordAnswer(s, 'q', true, '2026-10-16');
    expect(s.q).toMatchObject({ box: 1, due: '2026-10-17', seen: 1, correct: 1 });
    s = recordAnswer(s, 'q', true, '2026-10-17');
    expect(s.q).toMatchObject({ box: 2, due: '2026-10-20' });
  });
  it('sends a wrong answer back to box 1, due the same day', () => {
    let s: QuizStats = {};
    s = recordRun(s, [{ id: 'q', correct: true }], '2026-10-01');
    s = recordAnswer(s, 'q', true, '2026-10-02');
    s = recordAnswer(s, 'q', false, '2026-10-05');
    expect(s.q).toMatchObject({ box: 1, due: '2026-10-05', seen: 3, correct: 2, lastCorrect: false });
  });
  it('lists due questions with wrong ones first and ignores unseen ones', () => {
    const qs = [mk('a', 'A'), mk('b', 'A'), mk('c', 'A'), mk('d', 'A')];
    let s: QuizStats = {};
    s = recordAnswer(s, 'a', true, '2026-10-10'); // due 10-11
    s = recordAnswer(s, 'b', false, '2026-10-12'); // due 10-12
    s = recordAnswer(s, 'c', true, '2026-10-15'); // due 10-16
    expect(dueForReview(qs, s, '2026-10-12').map((q) => q.id)).toEqual(['b', 'a']);
    expect(dueForReview(qs, s, '2026-10-16').map((q) => q.id)).toEqual(['b', 'a', 'c']);
  });
});

describe('weak-spot mode', () => {
  it('computes accuracy per category, weakest first', () => {
    let s: QuizStats = {};
    s = recordRun(
      s,
      [
        { id: 'A-0', correct: true },
        { id: 'A-1', correct: true },
        { id: 'A-2', correct: true },
        { id: 'B-0', correct: false },
        { id: 'B-1', correct: false },
        { id: 'B-2', correct: true },
      ],
      '2026-10-16',
    );
    const acc = categoryAccuracy(bank, s);
    expect(acc[0]).toMatchObject({ category: 'B', answered: 3, correct: 1, percent: 33 });
    expect(acc[1].category).toBe('A');
  });
  it('picks questions from weak categories, wrong ones first', () => {
    let s: QuizStats = {};
    s = recordRun(
      s,
      [
        { id: 'C-0', correct: false },
        { id: 'C-1', correct: true },
        { id: 'C-2', correct: false },
        { id: 'A-0', correct: true },
        { id: 'A-1', correct: true },
        { id: 'A-2', correct: true },
      ],
      '2026-10-16',
    );
    const picked = pickWeakSpot(bank, s, 10, rng(3));
    expect(picked).toHaveLength(10);
    expect(picked.every((q) => q.category === 'C')).toBe(true);
    expect(picked.slice(0, 2).map((q) => q.id).sort()).toEqual(['C-0', 'C-2']);
  });
  it('returns nothing without enough history', () => {
    expect(pickWeakSpot(bank, {}, 10)).toEqual([]);
  });
});

describe('picking questions', () => {
  it('spreads a quiz across categories', () => {
    const picked = pickSpread(bank, 8, rng(1));
    const counts = cats.map((c) => picked.filter((q) => q.category === c).length);
    expect(counts).toEqual([2, 2, 2, 2]);
    expect(new Set(picked.map((q) => q.id)).size).toBe(8);
  });
  it('mega quiz respects the level filter and length', () => {
    const picked = pickMega(bank, 20, 'advanced', rng(2));
    expect(picked).toHaveLength(20);
    expect(picked.every((q) => q.difficulty === 'advanced')).toBe(true);
  });
  it('never returns more questions than exist', () => {
    expect(pickMega(bank.slice(0, 5), 50, null, rng(1))).toHaveLength(5);
  });
  it('final exam has 100 distinct questions covering every topic', () => {
    const big = [...'ABCDEFGHIJKLMNOPQRSTUVW'].flatMap((c) => Array.from({ length: 30 }, (_, i) => mk(`${c}-${i}`, c)));
    const topics = [...'ABCDEFGHIJKLMNOPQRSTUVW'];
    const exam = pickExam(big, topics, rng(5));
    expect(exam).toHaveLength(EXAM.questions);
    expect(new Set(exam.map((q) => q.id)).size).toBe(EXAM.questions);
    for (const t of topics) expect(exam.some((q) => q.category === t)).toBe(true);
  });
  it('daily quiz is the same for a given day and changes the next day', () => {
    const a = pickDaily(bank, '2026-10-16').map((q) => q.id);
    const b = pickDaily([...bank].reverse(), '2026-10-16').map((q) => q.id);
    const c = pickDaily(bank, '2026-10-17').map((q) => q.id);
    expect(a).toHaveLength(5);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    expect(pickDaily(bank, '2026-10-16').every((q) => q.difficulty !== 'advanced')).toBe(true);
  });
});

describe('daily streak', () => {
  it('counts consecutive days and resets after a gap', () => {
    let d = emptyDaily();
    d = completeDaily(d, '2026-10-14', 80);
    d = completeDaily(d, '2026-10-15', 60);
    d = completeDaily(d, '2026-10-15', 100); // same day again: no extra streak
    expect(d).toMatchObject({ streak: 2, best: 2, lastScore: 100 });
    expect(currentStreak(d, '2026-10-16')).toBe(2);
    expect(currentStreak(d, '2026-10-17')).toBe(0);
    d = completeDaily(d, '2026-10-18', 40);
    expect(d).toMatchObject({ streak: 1, best: 2 });
  });
});

describe('badges', () => {
  const topicCategories = ['A', 'B', 'T'];
  const countryCodes = ['AT', 'DE'];
  const now = new Date('2026-10-16T10:00:00Z');
  const status = (scores = {}, daily = emptyDaily(), exam = emptyExam()) =>
    Object.fromEntries(badgeStatus({ scores, daily, exam, topicCategories, countryCodes }).map((b) => [b.id, b]));

  it('starts with nothing earned', () => {
    expect(Object.values(status()).some((b) => b.earned)).toBe(false);
  });
  it('earns badges from scores', () => {
    let book = saveScore({}, 'A', 85, 25, now);
    book = saveScore(book, 'country-AT', 50, 10, now);
    book = saveScore(book, 'country-DE', 70, 10, now);
    book = saveScore(book, 'HSM', 40, 25, now);
    const s = status(book);
    expect(s['first-quiz'].earned).toBe(true);
    expect(s['category-master']).toMatchObject({ earned: true, progress: { done: 1, total: 3 } });
    expect(s['world-traveler'].earned).toBe(true);
    expect(s.founder.earned).toBe(true);
    expect(s.perfect.earned).toBe(false);
    expect(s['scam-spotter'].earned).toBe(false);
  });
  it('needs at least five questions for a perfect score', () => {
    expect(status(saveScore({}, 'A:lesson', 100, 2, now)).perfect.earned).toBe(false);
    expect(status(saveScore({}, 'B', 100, 5, now)).perfect.earned).toBe(true);
  });
  it('scam spotter from the special quiz or category T', () => {
    expect(status(saveScore({}, 'special-scam-spotter', 80, 15, now))['scam-spotter'].earned).toBe(true);
    expect(status(saveScore({}, 'T', 79, 30, now))['scam-spotter'].earned).toBe(false);
  });
  it('streak and exam badges', () => {
    const daily = { lastDay: '2026-10-16', streak: 7, best: 7, lastScore: 100 };
    let exam = recordExam(emptyExam(), 79, '2026-10-15');
    expect(exam.passed).toBe(false);
    exam = recordExam(exam, 86, '2026-10-16');
    expect(exam).toMatchObject({ passed: true, best: 86, passedOn: '2026-10-16', attempts: 2 });
    exam = recordExam(exam, 50, '2026-10-17');
    expect(exam).toMatchObject({ passed: true, best: 86, passedOn: '2026-10-16' });
    const s = status({}, daily, exam);
    expect(s['streak-7'].earned).toBe(true);
    expect(s['exam-passed'].earned).toBe(true);
  });
});

describe('results', () => {
  it('breaks a run down by category in the given order', () => {
    const rows = breakdown(
      [
        { category: 'B', correct: true },
        { category: 'A', correct: false },
        { category: 'A', correct: true },
      ],
      ['A', 'B'],
    );
    expect(rows).toEqual([
      { category: 'A', correct: 1, total: 2, percent: 50 },
      { category: 'B', correct: 1, total: 1, percent: 100 },
    ]);
  });
  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65_000)).toBe('1:05');
    expect(formatDuration(3_909_000)).toBe('1:05:09');
    expect(formatDuration(-5)).toBe('0:00');
  });
});

describe('quiz sets', () => {
  it('builds glossary questions without giving the answer away', () => {
    const items = [
      { id: 'stock', term: 'Stock', definition: 'A unit of ownership in a company.', categories: ['A'] },
      { id: 'bond', term: 'Bond', definition: 'A loan to an issuer that pays interest.', categories: ['A'] },
      { id: 'etf', term: 'ETF', definition: 'A fund traded on an exchange like a share.', categories: ['H'] },
      { id: 'dividend', term: 'Dividend', definition: 'Part of the profit paid to shareholders.', categories: ['A'] },
      { id: 'ipo', term: 'IPO', definition: 'An IPO is the first sale of shares to the public.', categories: ['B'] },
    ];
    const qs = glossaryQuestions(items, 7);
    expect(qs.map((q) => q.id)).not.toContain('GL-ipo');
    const stock = qs.find((q) => q.id === 'GL-stock')!;
    expect(stock.type).toBe('multiple_choice');
    if (stock.type === 'multiple_choice') {
      expect(stock.options[stock.answerIndex]).toBe('Stock');
      expect(new Set(stock.options).size).toBe(4);
    }
  });
  it('puts ordering questions first in the timeline quiz', () => {
    const qs = [mk('K-1', 'K'), mk('A-9', 'A', 'beginner', 'order'), mk('K-2', 'K'), mk('X-1', 'X')];
    const picked = pickSpecial(specialById('timeline')!, qs, rng(1));
    expect(picked[0].id).toBe('A-9');
    expect(picked.map((q) => q.id)).not.toContain('X-1');
  });
  it('picks calculation questions by type', () => {
    const qs = [mk('A-1', 'A', 'beginner', 'num'), mk('A-2', 'A'), mk('B-1', 'B', 'beginner', 'num')];
    expect(pickSpecial(specialById('calculation')!, qs, rng(1)).map((q) => q.id).sort()).toEqual(['A-1', 'B-1']);
  });
  it('parses and builds play URLs', () => {
    const c = parsePlayConfig('?kind=custom&cats=A,B,zz&n=500&level=advanced&mode=exam&minutes=30');
    expect(c).toMatchObject({ kind: 'custom', cats: ['A', 'B'], n: 100, level: 'advanced', mode: 'exam', minutes: 30 });
    expect(parsePlayConfig('?kind=nope')).toMatchObject({ kind: 'mega', mode: 'practice', n: 20, level: null });
    expect(parsePlayConfig('?kind=exam').mode).toBe('exam');
    expect(parsePlayConfig('?kind=mega&minutes=30').minutes).toBe(0);
    const q = playQuery({ kind: 'mega', n: 50, level: 'beginner', mode: 'exam', minutes: 45 });
    expect(parsePlayConfig(q)).toMatchObject({ kind: 'mega', n: 50, level: 'beginner', mode: 'exam', minutes: 45 });
  });
});

describe('grouping', () => {
  it('can treat several categories as one group', () => {
    const qs = [...bank, ...['AT', 'DE', 'FR', 'IT', 'JP', 'US'].flatMap((c) => Array.from({ length: 5 }, (_, i) => mk(`${c}-${i}`, c)))];
    const world = new Set(['AT', 'DE', 'FR', 'IT', 'JP', 'US']);
    const picked = pickMega(qs, 10, null, rng(4), (q) => (world.has(q.category) ? 'WORLD' : q.category));
    expect(picked.filter((q) => world.has(q.category))).toHaveLength(2);
  });
});


describe('world matching game', () => {
  const countries = [
    { code: 'AT', name: 'Austria', indexes: ['ATX (Austrian Traded Index)'], currency: { code: 'EUR', name: 'Euro' } },
    { code: 'DE', name: 'Germany', indexes: ['DAX', 'MDAX'], currency: { code: 'EUR', name: 'Euro' } },
    { code: 'CH', name: 'Switzerland', indexes: ['SMI (Swiss Market Index)'], currency: { code: 'CHF', name: 'Swiss franc' } },
    { code: 'JP', name: 'Japan', indexes: ['TOPIX (Tokyo Stock Price Index)', 'Nikkei 225'], currency: { code: 'JPY', name: 'Japanese yen' } },
  ];
  it('shortens index names', () => {
    expect(shortIndexName('ATX (Austrian Traded Index)')).toBe('ATX');
    expect(shortIndexName('Nikkei 225')).toBe('Nikkei 225');
  });
  it('skips shared currencies', () => {
    const items = buildGameItems(countries);
    expect(items.filter((i) => i.kind === 'currency').map((i) => i.code).sort()).toEqual(['CH', 'JP']);
    expect(items.find((i) => i.label === 'Nikkei 225')?.code).toBe('JP');
    expect(items).toHaveLength(8);
  });
  it('picks one item per country in a round', () => {
    const round = pickRound(buildGameItems(countries), 4, rng(9));
    expect(round).toHaveLength(4);
    expect(new Set(round.map((i) => i.code)).size).toBe(4);
  });
});
