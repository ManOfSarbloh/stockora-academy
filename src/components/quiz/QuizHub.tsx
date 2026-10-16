/**
 * Interactive part of /quizzes: daily quiz and streak, Mega Quiz settings, Final Exam status,
 * review and weak-spot modes, the custom quiz builder and badges. State comes from localStorage
 * after hydration; the server render shows the empty state.
 */
import { useEffect, useId, useState } from 'react';
import { t, type UiKey } from '@/i18n';
import { url } from '@/lib/url';
import {
  BADGES,
  EXAM,
  badgeStatus,
  currentStreak,
  dayKey,
  emptyDaily,
  emptyExam,
  type BadgeStatus,
  type DailyState,
  type ExamState,
  type Level,
  type QuizStats,
} from '@/lib/quiz-engine';
import { playQuery, type Kind, type Mode } from '@/lib/quiz-sets';
import { COUNTRY_CODES, QUIZ_EVENT, TOPIC_IDS, loadDaily, loadExam, loadScores, loadStats } from '@/lib/quiz-store';

interface Props {
  names: Record<string, string>;
  /** Topic ids plus extra pickable groups for the custom builder, in display order. */
  topics: string[];
  countries: string[];
}

const BADGE_ICONS: Record<string, string> = {
  'first-quiz': '🎯',
  perfect: '💯',
  'category-master': '🎓',
  'world-traveler': '🌍',
  'scam-spotter': '🛡️',
  founder: '🏗️',
  'streak-7': '🔥',
  'exam-passed': '🏆',
};

const play = (c: Parameters<typeof playQuery>[0]) => `${url('/quizzes/play')}${playQuery(c)}`;

/** Category of a question id ("AT-004" → "AT"); ids always start with their category (checked by the validator). */
const catOf = (id: string) => id.split('-')[0];

function weakFromStats(stats: QuizStats): { category: string; percent: number }[] {
  const acc = new Map<string, { a: number; c: number }>();
  for (const [id, s] of Object.entries(stats)) {
    const k = catOf(id);
    const m = acc.get(k) ?? { a: 0, c: 0 };
    m.a += s.seen;
    m.c += s.correct;
    acc.set(k, m);
  }
  return [...acc.entries()]
    .filter(([, m]) => m.a >= 3 && m.c < m.a)
    .map(([category, m]) => ({ category, percent: Math.round((m.c / m.a) * 100) }))
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);
}

export default function QuizHub({ names, topics, countries }: Props) {
  const uid = useId();
  const [daily, setDaily] = useState<DailyState>(emptyDaily());
  const [exam, setExam] = useState<ExamState>(emptyExam());
  const [due, setDue] = useState(0);
  const [weak, setWeak] = useState<{ category: string; percent: number }[]>([]);
  const [badges, setBadges] = useState<BadgeStatus[]>([]);
  const [today, setToday] = useState('');

  // Mega Quiz settings
  const [megaN, setMegaN] = useState(20);
  const [megaLevel, setMegaLevel] = useState<Level | ''>('');
  const [megaMode, setMegaMode] = useState<Mode>('practice');
  const [megaTimer, setMegaTimer] = useState(0);

  // Custom builder
  const [cats, setCats] = useState<string[]>([]);
  const [worldOn, setWorldOn] = useState(false);
  const [customN, setCustomN] = useState(20);
  const [customLevel, setCustomLevel] = useState<Level | ''>('');
  const [customMode, setCustomMode] = useState<Mode>('practice');
  const [customTimer, setCustomTimer] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const d = dayKey(new Date());
      const stats = loadStats();
      setToday(d);
      setDaily(loadDaily());
      setExam(loadExam());
      setDue(Object.values(stats).filter((s) => s.due <= d).length);
      setWeak(weakFromStats(stats));
      setBadges(badgeStatus({ scores: loadScores(), daily: loadDaily(), exam: loadExam(), topicCategories: TOPIC_IDS, countryCodes: COUNTRY_CODES }));
    };
    refresh();
    window.addEventListener(QUIZ_EVENT, refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      window.removeEventListener(QUIZ_EVENT, refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, []);

  const streak = today ? currentStreak(daily, today) : 0;
  const doneToday = !!today && daily.lastDay === today;
  const customCats = [...cats, ...(worldOn ? countries : [])];
  const levelOptions: (Level | '')[] = ['', 'beginner', 'intermediate', 'advanced'];
  const levelLabel = (l: Level | '') => (l ? t(`qh.level.${l}` as UiKey) : t('qh.anyLevel'));
  const fmtDate = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const radioGroup = <T extends string | number>(name: string, legend: string, value: T, set: (v: T) => void, options: { v: T; label: string }[]) => (
    <fieldset className="mt-3">
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={String(o.v)}
            className={`cursor-pointer rounded-full border-2 px-3 py-1 text-sm ${value === o.v ? 'border-link bg-link/10 font-semibold' : 'border-border'}`}
          >
            <input type="radio" name={`${uid}-${name}`} className="sr-only" checked={value === o.v} onChange={() => set(o.v)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );

  const levelSelect = (id: string, value: Level | '', set: (v: Level | '') => void) => (
    <label className="mt-3 block text-sm font-semibold" htmlFor={`${uid}-${id}`}>
      {t('qh.level')}
      <select
        id={`${uid}-${id}`}
        className="mt-1.5 block w-full max-w-xs rounded-lg border border-border bg-surface px-2 py-1.5 font-normal text-text"
        value={value}
        onChange={(e) => set(e.target.value as Level | '')}
      >
        {levelOptions.map((l) => (
          <option key={l} value={l}>
            {levelLabel(l)}
          </option>
        ))}
      </select>
    </label>
  );

  const timerOptions = [0, 15, 30, 60].map((m) => ({ v: m, label: m ? t('qh.minutes', { n: m }) : t('qh.noTimer') }));
  const modeOptions: { v: Mode; label: string }[] = [
    { v: 'practice', label: t('qh.mode.practice') },
    { v: 'exam', label: t('qh.mode.exam') },
  ];
  const link = (kind: Kind, extra: Omit<Parameters<typeof playQuery>[0], 'kind'>) => play({ kind, ...extra });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Daily quiz */}
        <section className="card flex flex-col p-5" aria-labelledby={`${uid}-daily`}>
          <h2 id={`${uid}-daily`} className="text-lg font-bold">
            📅 {t('qh.daily.title')}
          </h2>
          <p className="mt-1 text-sm text-muted">{t('qh.daily.lead')}</p>
          <p className="mt-3 font-semibold" aria-live="polite">
            🔥 {streak === 1 ? t('qh.daily.streakOne') : t('qh.daily.streak', { n: streak })}
            {daily.best > 0 && <span className="ml-2 text-sm font-normal text-muted">{t('qh.daily.best', { n: daily.best })}</span>}
          </p>
          {doneToday && <p className="mt-1 text-sm text-muted">{t('qh.daily.done', { score: daily.lastScore ?? 0 })}</p>}
          <div className="mt-auto pt-4">
            <a className={`btn ${doneToday ? 'btn-ghost' : 'btn-primary'}`} href={link('daily', {})}>
              {doneToday ? t('qh.daily.again') : t('qh.daily.start')}
            </a>
          </div>
        </section>

        {/* Final Exam */}
        <section className="card flex flex-col p-5" aria-labelledby={`${uid}-exam`}>
          <h2 id={`${uid}-exam`} className="text-lg font-bold">
            🏆 {t('qh.exam.title')}
          </h2>
          <p className="mt-1 text-sm text-muted">{t('qh.exam.lead', { n: EXAM.questions, min: EXAM.minutes, pass: EXAM.passPercent })}</p>
          <p className="mt-1 text-xs text-muted">{t('qh.exam.note')}</p>
          {exam.passed && exam.passedOn ? (
            <p className="mt-3 text-sm font-semibold">{t('qh.exam.passed', { date: fmtDate(exam.passedOn), best: exam.best })}</p>
          ) : exam.attempts > 0 ? (
            <p className="mt-3 text-sm">{t('qh.exam.best', { best: exam.best, n: exam.attempts })}</p>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            <a className="btn btn-primary" href={link('exam', {})}>
              {t('qh.exam.start')}
            </a>
            {exam.passed && (
              <a className="btn btn-ghost" href={url('/quizzes/certificate')}>
                {t('qh.exam.certificate')}
              </a>
            )}
          </div>
        </section>

        {/* Review + weak spot */}
        <section className="card flex flex-col gap-4 p-5" aria-labelledby={`${uid}-review`}>
          <div>
            <h2 id={`${uid}-review`} className="text-lg font-bold">
              🔁 {t('qh.review.title')}
            </h2>
            <p className="mt-1 text-sm text-muted">{t('qh.review.lead')}</p>
            <p className="mt-2 text-sm font-semibold">{due > 0 ? t('qh.review.due', { n: due }) : t('qh.review.none')}</p>
            {due > 0 && (
              <a className="btn btn-primary mt-3" href={link('review', { n: Math.min(due, 20) })}>
                {t('qh.start')}
              </a>
            )}
          </div>
          <div className="border-t border-border pt-4">
            <h2 className="text-lg font-bold">🎯 {t('qh.weak.title')}</h2>
            <p className="mt-1 text-sm text-muted">{weak.length ? t('qh.weak.lead') : t('qh.weak.empty')}</p>
            {weak.length > 0 && (
              <>
                <p className="mt-2 text-sm">
                  {t('qh.weak.topics', { list: weak.map((w) => `${names[w.category] ?? w.category} (${w.percent}%)`).join(', ') })}
                </p>
                <a className="btn btn-primary mt-3" href={link('weak', { n: 15 })}>
                  {t('qh.start')}
                </a>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mega Quiz */}
        <section className="card p-5" aria-labelledby={`${uid}-mega`}>
          <h2 id={`${uid}-mega`} className="text-lg font-bold">
            🌐 {t('qh.mega.title')}
          </h2>
          <p className="mt-1 text-sm text-muted">{t('qh.mega.lead')}</p>
          {radioGroup('mega-n', t('qh.length'), megaN, setMegaN, [20, 50, 100].map((v) => ({ v, label: t('qh.questions', { n: v }) })))}
          {levelSelect('mega-level', megaLevel, setMegaLevel)}
          {radioGroup('mega-mode', t('qh.mode'), megaMode, setMegaMode, modeOptions)}
          {megaMode === 'exam' && radioGroup('mega-timer', t('qh.timer'), megaTimer, setMegaTimer, timerOptions)}
          <a
            className="btn btn-primary mt-4"
            href={link('mega', { n: megaN, level: megaLevel || null, mode: megaMode, minutes: megaMode === 'exam' ? megaTimer : 0 })}
          >
            {t('qh.start')}
          </a>
        </section>

        {/* Custom builder */}
        <section className="card p-5" aria-labelledby={`${uid}-custom`}>
          <h2 id={`${uid}-custom`} className="text-lg font-bold">
            🛠️ {t('qh.custom.title')}
          </h2>
          <p className="mt-1 text-sm text-muted">{t('qh.custom.lead')}</p>
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold">{t('qh.custom.topics')}</legend>
            <div className="mt-1 flex gap-3 text-sm">
              <button type="button" className="text-link underline" onClick={() => (setCats(topics), setWorldOn(true))}>
                {t('qh.custom.all')}
              </button>
              <button type="button" className="text-link underline" onClick={() => (setCats([]), setWorldOn(false))}>
                {t('qh.custom.none')}
              </button>
            </div>
            <div className="mt-2 grid max-h-56 gap-1 overflow-y-auto pr-1 text-sm sm:grid-cols-2">
              {topics.map((c) => (
                <label key={c} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[var(--link)]"
                    checked={cats.includes(c)}
                    onChange={(e) => setCats(e.target.checked ? [...cats, c] : cats.filter((x) => x !== c))}
                  />
                  <span>{names[c] ?? c}</span>
                </label>
              ))}
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 accent-[var(--link)]" checked={worldOn} onChange={(e) => setWorldOn(e.target.checked)} />
                <span>{t('qh.countries.title')}</span>
              </label>
            </div>
          </fieldset>
          {radioGroup('custom-n', t('qh.length'), customN, setCustomN, [10, 20, 50].map((v) => ({ v, label: t('qh.questions', { n: v }) })))}
          {levelSelect('custom-level', customLevel, setCustomLevel)}
          {radioGroup('custom-mode', t('qh.mode'), customMode, setCustomMode, modeOptions)}
          {customMode === 'exam' && radioGroup('custom-timer', t('qh.timer'), customTimer, setCustomTimer, timerOptions)}
          {customCats.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{t('qh.custom.pick')}</p>
          ) : (
            <a
              className="btn btn-primary mt-4"
              href={link('custom', {
                cats: customCats,
                n: customN,
                level: customLevel || null,
                mode: customMode,
                minutes: customMode === 'exam' ? customTimer : 0,
              })}
            >
              {t('qh.start')}
            </a>
          )}
        </section>
      </div>

      {/* Badges */}
      <section className="card p-5" aria-labelledby={`${uid}-badges`}>
        <h2 id={`${uid}-badges`} className="text-lg font-bold">
          {t('qh.badges.title')}
        </h2>
        <p className="mt-1 text-sm text-muted">{t('qh.badges.lead')}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((id) => {
            const b = badges.find((x) => x.id === id);
            const earned = !!b?.earned;
            return (
              <li key={id} className={`flex items-start gap-3 rounded-lg border-2 p-3 ${earned ? 'border-link' : 'border-dashed border-border'}`}>
                <span className={`text-2xl ${earned ? '' : 'opacity-30 grayscale'}`} aria-hidden="true">
                  {BADGE_ICONS[id]}
                </span>
                <span className="text-sm">
                  <span className="block font-semibold">
                    {t(`badge.${id}.name` as UiKey)}
                    <span className="sr-only">{earned ? ' (earned)' : ' (not earned yet)'}</span>
                  </span>
                  <span className="block text-muted">{t(`badge.${id}.desc` as UiKey)}</span>
                  {b?.progress && !earned && (
                    <span className="block text-xs text-muted">{t('qh.badges.progress', { done: b.progress.done, total: b.progress.total })}</span>
                  )}
                  {earned && <span className="block text-xs font-semibold text-link">✓</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
