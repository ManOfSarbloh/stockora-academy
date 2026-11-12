/**
 * Study planner on "My learning" (logic in src/lib/study-plan.ts): a weekly goal, this week's lessons, a streak of
 * weeks with the goal reached, the last 8 weeks as a small bar chart and the next lesson on the learning path.
 * Counts lessons marked as done; the goal is saved in this browser ("stockora-study-goal").
 */
import { useEffect, useId, useState } from 'react';
import { getLocale, intlLocale, t } from '@/i18n';
import { CHANGE_EVENT, countDone, loadProgress, nextUnfinished, type ProgressState } from '@/lib/progress';
import { readJSON, writeJSON } from '@/lib/storage';
import { GOALS, GOAL_KEY, daysLeftInWeek, lastWeeks, normaliseGoal, weekStart, weekStreak } from '@/lib/study-plan';

interface Lesson {
  key: string;
  title: string;
  href: string;
}

const shortDate = (monday: string) => {
  const [y, m, d] = monday.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale[getLocale()], { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
};

export default function StudyPlanner({ lessons }: { lessons: Lesson[] }) {
  const id = useId();
  const [state, setState] = useState<ProgressState | null>(null);
  const [goal, setGoal] = useState(3);

  useEffect(() => {
    const load = () => setState(loadProgress());
    load();
    setGoal(normaliseGoal(readJSON<unknown>(GOAL_KEY, null)));
    window.addEventListener(CHANGE_EVENT, load);
    return () => window.removeEventListener(CHANGE_EVENT, load);
  }, []);

  if (!state) return <div className="island-fallback h-[420px]" />;

  const now = new Date();
  const weeks = lastWeeks(state, now, 8);
  const thisWeek = weeks.at(-1)!.count;
  const streak = weekStreak(state, goal, now);
  const keys = lessons.map((l) => l.key);
  const nextKey = nextUnfinished(state, keys);
  const next = lessons.find((l) => l.key === nextKey);
  const reached = thisWeek >= goal;
  const allDone = keys.length > 0 && countDone(state, keys) === keys.length;

  // Bar chart
  const W = 360;
  const H = 150;
  const pad = { l: 8, r: 8, t: 18, b: 24 };
  const max = Math.max(goal, ...weeks.map((w) => w.count), 1);
  const bw = (W - pad.l - pad.r) / weeks.length;
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const current = weekStart(now);

  return (
    <section className="card p-5" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="font-semibold">
        {t('sp.title')}
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor={`${id}-goal`} className="text-sm font-semibold">
          {t('sp.goal')}
        </label>
        <select
          id={`${id}-goal`}
          value={goal}
          onChange={(e) => {
            const g = normaliseGoal(Number(e.target.value));
            setGoal(g);
            writeJSON(GOAL_KEY, g);
          }}
          className="rounded-lg border border-border bg-surface px-2 py-1 text-sm"
        >
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {t(g === 1 ? 'sp.goal.one' : 'sp.goal.n', { n: g })}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-lg font-bold tabular-nums">{t('sp.week', { done: thisWeek, goal })}</p>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(thisWeek, goal)}
        aria-label={t('sp.week', { done: thisWeek, goal })}
      >
        <div className="h-full rounded-full bg-teal transition-[width] duration-500" style={{ width: `${Math.min(100, (thisWeek / goal) * 100)}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">
        {reached ? t('sp.reached') : `${t('sp.left', { n: goal - thisWeek })} · ${t('sp.daysLeft', { n: daysLeftInWeek(now) })}`}
      </p>
      <p className="mt-1 text-sm">{t('sp.streak', { n: streak })}</p>

      <figure className="mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t('sp.chart.aria')}>
          {weeks.map((w, i) => {
            const x = pad.l + i * bw + bw * 0.18;
            const width = bw * 0.64;
            const top = y(w.count);
            return (
              <g key={w.week}>
                <rect x={x} y={top} width={width} height={Math.max(0, y(0) - top)} rx="4" fill={w.week === current ? 'var(--link)' : 'var(--teal)'} />
                <text x={x + width / 2} y={top - 4} textAnchor="middle" fontSize="11" fill="var(--text)">
                  {w.count}
                </text>
                <text x={x + width / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--muted)">
                  {shortDate(w.week)}
                </text>
              </g>
            );
          })}
          <line x1={pad.l} x2={W - pad.r} y1={y(goal)} y2={y(goal)} stroke="var(--muted)" strokeDasharray="4 3" />
          <text x={W - pad.r} y={y(goal) - 4} textAnchor="end" fontSize="10" fill="var(--muted)">
            {t('sp.chart.goal')}
          </text>
        </svg>
        <figcaption className="mt-1 text-xs text-muted">{t('sp.chart')}</figcaption>
        <ul className="sr-only">
          {weeks.map((w) => (
            <li key={w.week}>{`${t('sp.weekOf', { date: shortDate(w.week) })}: ${w.count}`}</li>
          ))}
        </ul>
      </figure>

      <p className="mt-4 text-sm">
        {allDone ? (
          t('sp.allDone')
        ) : next ? (
          <>
            <span className="font-semibold">{t('sp.next')}:</span> <a href={next.href}>{next.title}</a>
          </>
        ) : null}
      </p>
      <p className="mt-3 text-xs text-muted">{t('sp.note')}</p>
    </section>
  );
}
