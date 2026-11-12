/**
 * Study planner on "My learning": a weekly goal of lessons, this week's count, a streak of weeks in which the
 * goal was reached and the last weeks as a small chart. Built only from the dates in the progress store
 * (src/lib/progress.ts) and a goal saved in this browser. Weeks run Monday to Sunday in local time.
 * Pure functions, unit-tested in tests/study-plan.test.ts.
 */
import type { ProgressState } from './progress';

export const GOALS = [1, 2, 3, 5, 7] as const;
export const DEFAULT_GOAL = 3;
export const GOAL_KEY = 'study-goal';

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Monday of the week that contains `d` (local time), as "YYYY-MM-DD". */
export function weekStart(d: Date): string {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const back = (m.getDay() + 6) % 7; // Monday = 0 … Sunday = 6
  m.setDate(m.getDate() - back);
  return ymd(m);
}

/** The Monday `n` weeks before the week starting on `monday`. */
export function weeksBefore(monday: string, n: number): string {
  const [y, mo, da] = monday.split('-').map(Number);
  const d = new Date(y, mo - 1, da - 7 * n);
  return ymd(d);
}

/** Lessons marked done per week (keyed by the week's Monday). */
export function doneByWeek(state: ProgressState): Map<string, number> {
  const out = new Map<string, number>();
  for (const iso of Object.values(state.done)) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    const w = weekStart(d);
    out.set(w, (out.get(w) ?? 0) + 1);
  }
  return out;
}

/** The last `n` weeks up to and including the current one, oldest first. */
export function lastWeeks(state: ProgressState, now: Date, n = 8): { week: string; count: number }[] {
  const counts = doneByWeek(state);
  const current = weekStart(now);
  return Array.from({ length: n }, (_, i) => {
    const week = weeksBefore(current, n - 1 - i);
    return { week, count: counts.get(week) ?? 0 };
  });
}

/**
 * Weeks in a row with the goal reached: the current week counts once the goal is reached; otherwise the streak
 * runs back from last week, so an unfinished current week does not break it yet.
 */
export function weekStreak(state: ProgressState, goal: number, now: Date): number {
  const counts = doneByWeek(state);
  let week = weekStart(now);
  let streak = 0;
  if ((counts.get(week) ?? 0) >= goal) streak = 1;
  week = weeksBefore(week, 1);
  while ((counts.get(week) ?? 0) >= goal) {
    streak++;
    week = weeksBefore(week, 1);
  }
  return streak;
}

/** Days left in the current week, today included (Monday = 7 … Sunday = 1). */
export const daysLeftInWeek = (now: Date) => 7 - ((now.getDay() + 6) % 7);

export const normaliseGoal = (raw: unknown): number =>
  typeof raw === 'number' && (GOALS as readonly number[]).includes(raw) ? raw : DEFAULT_GOAL;
