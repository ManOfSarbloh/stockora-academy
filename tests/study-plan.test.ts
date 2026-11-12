import { describe, expect, it } from 'vitest';
import { DEFAULT_GOAL, daysLeftInWeek, lastWeeks, normaliseGoal, weekStart, weekStreak, weeksBefore } from '../src/lib/study-plan';
import type { ProgressState } from '../src/lib/progress';

// Local-time dates (the planner works in the visitor's local week).
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const state = (dates: Date[]): ProgressState => ({ version: 1, done: Object.fromEntries(dates.map((d, i) => [`t/l${i}`, d.toISOString()])) });

describe('study planner', () => {
  it('finds the Monday of a week', () => {
    expect(weekStart(at(2026, 11, 12))).toBe('2026-11-09'); // Thursday
    expect(weekStart(at(2026, 11, 9))).toBe('2026-11-09'); // Monday
    expect(weekStart(at(2026, 11, 15))).toBe('2026-11-09'); // Sunday
    expect(weeksBefore('2026-11-09', 1)).toBe('2026-11-02');
    expect(weeksBefore('2026-01-05', 2)).toBe('2025-12-22');
  });
  it('counts lessons per week for the last weeks, oldest first', () => {
    const s = state([at(2026, 11, 10), at(2026, 11, 11), at(2026, 11, 3), at(2026, 10, 1)]);
    const w = lastWeeks(s, at(2026, 11, 12), 3);
    expect(w).toEqual([
      { week: '2026-10-26', count: 0 },
      { week: '2026-11-02', count: 1 },
      { week: '2026-11-09', count: 2 },
    ]);
  });
  it('counts a streak of weeks with the goal reached, without breaking it for an unfinished current week', () => {
    const s = state([at(2026, 10, 27), at(2026, 10, 28), at(2026, 11, 3), at(2026, 11, 4)]);
    expect(weekStreak(s, 2, at(2026, 11, 12))).toBe(2); // current week 0 so far, the two weeks before reached it
    const t = state([at(2026, 10, 27), at(2026, 10, 28), at(2026, 11, 3), at(2026, 11, 4), at(2026, 11, 10), at(2026, 11, 11)]);
    expect(weekStreak(t, 2, at(2026, 11, 12))).toBe(3);
    expect(weekStreak(t, 3, at(2026, 11, 12))).toBe(0);
    expect(weekStreak(state([]), 1, at(2026, 11, 12))).toBe(0);
  });
  it('counts the days left in the week', () => {
    expect(daysLeftInWeek(at(2026, 11, 9))).toBe(7);
    expect(daysLeftInWeek(at(2026, 11, 12))).toBe(4);
    expect(daysLeftInWeek(at(2026, 11, 15))).toBe(1);
  });
  it('accepts only offered goals', () => {
    expect(normaliseGoal(5)).toBe(5);
    expect(normaliseGoal(4)).toBe(DEFAULT_GOAL);
    expect(normaliseGoal('3')).toBe(DEFAULT_GOAL);
  });
});
