/**
 * The quiz player used everywhere: topic and lesson quizzes, country quizzes and every hub mode.
 *  - Practice mode: check each answer, see the explanation, optional hint.
 *  - Exam mode: no feedback until the end, free navigation, optional timer.
 * Results: score, time, score by topic, topics to revise, wrong answers with explanations, new badges.
 */
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { t, type UiKey } from '@/i18n';
import { url } from '@/lib/url';
import { correctAnswerText, isAnswered, isCorrect, isSupported, prepareQuiz, type AnswerValue, type Question } from '@/lib/quiz';
import { breakdown, formatDuration, type BadgeId } from '@/lib/quiz-engine';
import { recordQuizRun } from '@/lib/quiz-store';

export interface RunResult {
  correct: number;
  total: number;
  percent: number;
  elapsedMs: number;
  results: { id: string; category: string; correct: boolean }[];
}

interface Props {
  questions: (Question & { src?: string })[];
  /** Score key in quiz-scores; null for runs that should not be scored (e.g. review). */
  quizId: string | null;
  mode?: 'practice' | 'exam';
  timeLimitMinutes?: number;
  /** Display names and links for categories (for the score-by-topic chart). */
  names?: Record<string, string>;
  hrefs?: Record<string, string>;
  /** Category order for the breakdown chart. */
  order?: string[];
  reportHref: (q: Question) => string;
  /** Called when the run is saved (before badges are computed); may return a note for the results screen. */
  onFinish?: (r: RunResult) => ReactNode | void;
  /** Draw a fresh set of questions for "New questions". Without it, "Start again" reshuffles the same set. */
  redraw?: () => Question[];
  hubHref?: string;
  passPercent?: number;
  /** Heading level for the question and the results title: 3 inside a lesson section, 2 on a page of its own. */
  headingLevel?: 2 | 3;
}

type Phase = 'answering' | 'feedback' | 'done';
const LOST = 'border-[#c2410c] bg-[#c2410c]/10 dark:border-[#fb923c] dark:bg-[#fb923c]/10';
const LOST_TEXT = 'text-[#c2410c] dark:text-[#fb923c]';

export default function QuizRunner({
  questions,
  quizId,
  mode = 'practice',
  timeLimitMinutes = 0,
  names = {},
  hrefs = {},
  order,
  reportHref,
  onFinish,
  redraw,
  hubHref,
  passPercent,
  headingLevel = 3,
}: Props) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const Sub = `h${headingLevel + 1}` as 'h3' | 'h4';
  const usable = useMemo(() => questions.filter(isSupported), [questions]);
  const exam = mode === 'exam';
  const [run, setRun] = useState<(Question & { src?: string })[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue | undefined>>({});
  const [phase, setPhase] = useState<Phase>('answering');
  const [hints, setHints] = useState<Record<string, number>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [finishedAt, setFinishedAt] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [gained, setGained] = useState<BadgeId[]>([]);
  const [note, setNote] = useState<ReactNode>(null);
  const lastShown = useRef<string | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finishing = useRef(false);
  const uid = useId();

  function begin(pool: Question[]) {
    setRun(prepareQuiz(pool, Math.random, lastShown.current));
    setAnswers({});
    setHints({});
    setIndex(0);
    setPhase('answering');
    setStartedAt(Date.now());
    setNow(Date.now());
    setFinishedAt(0);
    setTimedOut(false);
    setGained([]);
    setNote(null);
    finishing.current = false;
  }

  // Shuffle on the client only (avoids a mismatch with server-rendered HTML).
  useEffect(() => begin(usable), [usable]);

  const limitMs = exam && timeLimitMinutes > 0 ? timeLimitMinutes * 60_000 : 0;
  const running = phase !== 'done' && run.length > 0;

  // Timer tick (also used for elapsed time).
  useEffect(() => {
    if (!running || !limitMs) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [running, limitMs]);

  useEffect(() => {
    if (running && limitMs && now - startedAt >= limitMs) {
      setTimedOut(true);
      finish();
    }
  });

  // Warn before leaving a running exam.
  useEffect(() => {
    if (!exam || !running) return;
    // Browsers show their own text; preventDefault is what triggers the "leave page?" dialog.
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [exam, running]);

  if (usable.length === 0) return <div className="card p-5 text-muted">{t('quiz.noQuestions')}</div>;
  if (run.length === 0) return <div className="card p-5 text-muted">{t('quiz.loading')}</div>;

  const q = run[index];
  const answer = answers[q?.id ?? ''];
  const orderNow: number[] =
    q?.type === 'order' ? (Array.isArray(answer) ? answer : (q.initialOrder ?? q.orderedItems.map((_, i) => i))) : [];
  const matchNow: number[] = q?.type === 'match' ? (Array.isArray(answer) ? answer : q.pairs.map(() => -1)) : [];
  const multiCategory = new Set(run.map((x) => x.category)).size > 1;

  function focusHeading() {
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function setAnswer(v: AnswerValue) {
    if (phase !== 'answering') return;
    setAnswers((a) => ({ ...a, [q.id]: v }));
  }

  /** Order questions count as answered in their shown arrangement. */
  function withOrderDefaults(a: Record<string, AnswerValue | undefined>) {
    const out = { ...a };
    for (const x of run) if (x.type === 'order' && !Array.isArray(out[x.id])) out[x.id] = x.initialOrder ?? x.orderedItems.map((_, i) => i);
    return out;
  }

  function check() {
    if (q.type === 'order' && !Array.isArray(answer)) setAnswers((a) => ({ ...a, [q.id]: orderNow }));
    setPhase('feedback');
  }

  function go(to: number) {
    lastShown.current = q.id;
    setIndex(to);
    setPhase('answering');
    focusHeading();
  }

  function next() {
    if (index + 1 < run.length) go(index + 1);
    else finish();
  }

  function finish() {
    if (finishing.current) return;
    finishing.current = true;
    const final = withOrderDefaults(answers);
    setAnswers(final);
    const results = run.map((x) => ({ id: x.id, category: x.category, correct: isCorrect(x, final[x.id]) }));
    const correct = results.filter((r) => r.correct).length;
    const end = Date.now();
    const result: RunResult = {
      correct,
      total: run.length,
      percent: Math.round((correct / run.length) * 100),
      elapsedMs: end - startedAt,
      results,
    };
    let extraNote: ReactNode = null;
    const badges = recordQuizRun(quizId, results, () => {
      extraNote = onFinish?.(result) ?? null;
    });
    setNote(extraNote);
    setGained(badges);
    setFinishedAt(end);
    setPhase('done');
    focusHeading();
  }

  function tryFinishExam() {
    const final = withOrderDefaults(answers);
    const open = run.filter((x) => !isAnswered(x, final[x.id])).length;
    if (open > 0 && !window.confirm(t('quiz.examUnanswered', { n: open }))) return;
    finish();
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= orderNow.length) return;
    const nextOrder = [...orderNow];
    [nextOrder[from], nextOrder[to]] = [nextOrder[to], nextOrder[from]];
    setAnswer(nextOrder);
  }

  function takeHint() {
    if (q.type === 'multiple_choice') {
      const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answerIndex && i !== answer && !(q.id in hints && hints[q.id] === i));
      const pick = wrong[Math.floor(Math.random() * wrong.length)];
      setHints((h) => ({ ...h, [q.id]: pick ?? -1 }));
    } else {
      setHints((h) => ({ ...h, [q.id]: -1 }));
    }
  }

  // ---------------------------------------------------------------- Results
  if (phase === 'done') {
    const results = run.map((x) => ({ q: x, ok: isCorrect(x, answers[x.id]) }));
    const correct = results.filter((r) => r.ok).length;
    const pct = Math.round((correct / run.length) * 100);
    const wrong = results.filter((r) => !r.ok).map((r) => r.q);
    const rows = breakdown(
      results.map((r) => ({ category: r.q.category, correct: r.ok })),
      order,
    );
    const weak = rows.filter((r) => r.percent < 60 && r.total >= 2);
    const elapsed = (finishedAt || Date.now()) - startedAt;
    return (
      <div className="card p-5 sm:p-6">
        <H ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">
          {pct === 100 ? t('quiz.perfect') : t('quiz.score', { score: correct, total: run.length, pct })}
        </H>
        <p className="mt-1 text-sm text-muted">
          {pct === 100 && <>{t('quiz.score', { score: correct, total: run.length, pct })} · </>}
          {t('quiz.timeTaken', { time: formatDuration(elapsed) })}
        </p>
        {timedOut && <p className="callout callout-warning mt-3">{t('quiz.timeUp')}</p>}
        {passPercent !== undefined && (
          <p className={`callout mt-3 ${pct >= passPercent ? 'callout-tip' : 'callout-warning'}`}>
            {pct >= passPercent ? t('quiz.passed', { pass: passPercent }) : t('quiz.notPassed', { pass: passPercent })}
          </p>
        )}
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
        </div>

        {gained.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-live="polite">
            {gained.map((b) => (
              <li key={b} className="rounded-full border-2 border-link px-3 py-1 text-sm font-semibold">
                🏅 {t('quiz.newBadge', { name: t(`badge.${b}.name` as UiKey) })}
              </li>
            ))}
          </ul>
        )}
        {note && <div className="mt-4">{note}</div>}

        {multiCategory && rows.length > 1 && (
          <section className="mt-6" aria-labelledby={`${uid}-bd`}>
            <Sub id={`${uid}-bd`} className="font-semibold">
              {t('quiz.byTopic')}
            </Sub>
            <ul className="mt-3 space-y-2" aria-label={t('quiz.byTopicChart')}>
              {rows.map((r) => (
                <li key={r.category} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
                  <span className="truncate" title={names[r.category] ?? r.category}>
                    {names[r.category] ?? r.category}
                  </span>
                  <span className="h-3 overflow-hidden rounded-r bg-surface-2" aria-hidden="true">
                    <span className="block h-full rounded-r bg-teal" style={{ width: `${Math.max(r.percent, 2)}%` }} />
                  </span>
                  <span className="tabular-nums text-muted">
                    {r.correct}/{r.total} ({r.percent}%)
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {weak.length > 0 && (
          <section className="mt-6">
            <Sub className="font-semibold">{t('quiz.weakTopics')}</Sub>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {weak.map((r) => (
                <li key={r.category}>
                  {hrefs[r.category] ? (
                    <a className="rounded-full bg-surface-2 px-3 py-1 no-underline hover:underline" href={url(hrefs[r.category])}>
                      {names[r.category] ?? r.category} →
                    </a>
                  ) : (
                    <span className="rounded-full bg-surface-2 px-3 py-1">{names[r.category] ?? r.category}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {wrong.length > 0 && (
          <section className="mt-6">
            <Sub className="font-semibold">{t('quiz.wrongAnswers')}</Sub>
            <ul className="mt-3 space-y-3">
              {wrong.map((x) => (
                <li key={x.id} className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-semibold">{x.question}</p>
                  <p className="mt-1">
                    <span className="text-muted">{t('quiz.correctAnswer')}:</span> {correctAnswerText(x, { true: t('quiz.true'), false: t('quiz.false') })}
                  </p>
                  <p className="mt-1 text-muted">{x.explanation}</p>
                  <p className="mt-1">
                    <a className="font-medium" href={url(x.lessonLink)}>
                      {t('quiz.readLesson')} →
                    </a>
                    <span className="mx-2 text-muted">·</span>
                    <a href={reportHref(x)} className="text-muted">
                      {t('quiz.report')}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {wrong.length > 0 && (
            <button type="button" className="btn btn-primary" onClick={() => begin(wrong)}>
              {t('quiz.retryWrong')}
            </button>
          )}
          {redraw ? (
            <button type="button" className="btn btn-ghost" onClick={() => begin(redraw())}>
              {t('quiz.newDraw')}
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => begin(usable)}>
              {t('quiz.restart')}
            </button>
          )}
          {hubHref && (
            <a className="btn btn-ghost" href={url(hubHref)}>
              {t('quiz.toHub')}
            </a>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Question
  const locked = phase === 'feedback';
  const ok = isCorrect(q, answer);
  const hasAnswer = isAnswered(q, answer);
  const hint = hints[q.id];
  const remaining = limitMs ? limitMs - (now - startedAt) : 0;
  const answeredCount = run.filter((x) => x.type === 'order' || isAnswered(x, answers[x.id])).length;

  const optionClass = (selected: boolean, isRight: boolean, disabled = false) => {
    const base = 'flex w-full items-start gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-colors';
    if (disabled) return `${base} border-border opacity-40 line-through`;
    if (!locked) return `${base} cursor-pointer ${selected ? 'border-link' : 'border-border hover:border-link'}`;
    if (isRight) return `${base} border-link bg-link/10`;
    if (selected) return `${base} ${LOST}`;
    return `${base} border-border opacity-70`;
  };

  /** After checking, mark options with a symbol and text, so the result does not rely on colour alone. */
  const mark = (selected: boolean, isRight: boolean) =>
    !locked ? null : isRight ? (
      <span className="ml-auto shrink-0 text-sm font-semibold text-link">✓ {t('quiz.correctAnswer')}</span>
    ) : selected ? (
      <span className={`ml-auto shrink-0 text-sm font-semibold ${LOST_TEXT}`}>✗ {t('quiz.yourAnswer')}</span>
    ) : null;

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted">
        <p aria-live="polite">{t('quiz.questionOf', { n: index + 1, total: run.length })}</p>
        {limitMs > 0 && (
          <p className={`tabular-nums ${remaining < 5 * 60_000 ? LOST_TEXT : ''}`} role="timer" aria-live="off">
            {t('quiz.timeLeft', { time: formatDuration(remaining) })}
          </p>
        )}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div
          className="h-full rounded-full bg-teal transition-[width]"
          style={{ width: `${((exam ? answeredCount : index) / run.length) * 100}%` }}
        />
      </div>
      {exam && index === 0 && <p className="mt-3 text-sm text-muted">{t('quiz.examNoFeedback')}</p>}

      <fieldset className="mt-4">
        <legend>
          <H ref={headingRef} tabIndex={-1} className="text-base font-semibold outline-none sm:text-lg">
            {q.question}
          </H>
          {q.type === 'multiple_select' && <span className="mt-1 block text-sm text-muted">{t('quiz.selectAll')}</span>}
          {q.type === 'order' && <span className="mt-1 block text-sm text-muted">{t('quiz.orderHint')}</span>}
          {q.type === 'match' && <span className="mt-1 block text-sm text-muted">{t('quiz.matchHint')}</span>}
        </legend>

        <div className="mt-4 space-y-2">
          {q.type === 'multiple_choice' &&
            q.options.map((opt, i) => {
              const gone = hint === i && !locked;
              return (
                <label key={i} className={optionClass(answer === i, i === q.answerIndex, gone)}>
                  <input
                    type="radio"
                    name={`${uid}-${q.id}`}
                    className="mt-1 accent-[var(--link)]"
                    checked={answer === i}
                    disabled={locked || gone}
                    onChange={() => setAnswer(i)}
                  />
                  <span>{opt}</span>
                  {mark(answer === i, i === q.answerIndex)}
                </label>
              );
            })}

          {q.type === 'multiple_select' &&
            q.options.map((opt, i) => {
              const sel = Array.isArray(answer) && answer.includes(i);
              return (
                <label key={i} className={optionClass(sel, q.answers.includes(i))}>
                  <input
                    type="checkbox"
                    className="mt-1 accent-[var(--link)]"
                    checked={sel}
                    disabled={locked}
                    onChange={() => {
                      const cur = Array.isArray(answer) ? answer : [];
                      setAnswer(sel ? cur.filter((x) => x !== i) : [...cur, i]);
                    }}
                  />
                  <span>{opt}</span>
                  {mark(sel, q.answers.includes(i))}
                </label>
              );
            })}

          {q.type === 'true_false' &&
            [true, false].map((v) => (
              <label key={String(v)} className={optionClass(answer === v, v === q.answerBool)}>
                <input
                  type="radio"
                  name={`${uid}-${q.id}`}
                  className="mt-1 accent-[var(--link)]"
                  checked={answer === v}
                  disabled={locked}
                  onChange={() => setAnswer(v)}
                />
                <span>{v ? t('quiz.true') : t('quiz.false')}</span>
                {mark(answer === v, v === q.answerBool)}
              </label>
            ))}

          {q.type === 'number' && (
            <label className="flex items-center gap-2">
              <span className="sr-only">{t('quiz.yourAnswer')}</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={t('quiz.numberPlaceholder')}
                className="w-40 rounded-lg border border-border bg-surface px-3 py-2 text-text"
                value={typeof answer === 'string' ? answer : ''}
                disabled={locked}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && hasAnswer && !locked && !exam) check();
                }}
              />
              {q.unit && <span className="text-muted">{q.unit}</span>}
            </label>
          )}

          {q.type === 'order' && (
            <ol className="space-y-2">
              {orderNow.map((item, pos) => {
                const rightPlace = item === pos;
                return (
                  <li key={item} className={optionClass(false, locked && rightPlace).replace('cursor-pointer', '')}>
                    <span className="mt-0.5 w-6 shrink-0 text-right font-semibold tabular-nums text-muted">{pos + 1}.</span>
                    <span className="flex-1">{q.orderedItems[item]}</span>
                    {!locked ? (
                      <span className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          className="btn btn-ghost px-2 py-1 disabled:opacity-40"
                          disabled={pos === 0}
                          aria-label={t('quiz.moveUp', { item: q.orderedItems[item] })}
                          onClick={() => move(pos, pos - 1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost px-2 py-1 disabled:opacity-40"
                          disabled={pos === orderNow.length - 1}
                          aria-label={t('quiz.moveDown', { item: q.orderedItems[item] })}
                          onClick={() => move(pos, pos + 1)}
                        >
                          ↓
                        </button>
                      </span>
                    ) : rightPlace ? (
                      <span className="ml-auto shrink-0 text-sm font-semibold text-link">✓</span>
                    ) : (
                      <span className={`ml-auto shrink-0 text-sm font-semibold ${LOST_TEXT}`}>✗ {t('quiz.correctPosition', { n: item + 1 })}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {q.type === 'match' && (
            <ul className="space-y-2">
              {q.pairs.map(([left], i) => {
                const chosen = matchNow[i];
                const right = chosen === i;
                return (
                  <li
                    key={i}
                    className={`grid gap-2 rounded-lg border-2 px-3 py-2.5 sm:grid-cols-[1fr_minmax(0,16rem)] sm:items-center ${
                      !locked ? 'border-border' : right ? 'border-link bg-link/10' : LOST
                    }`}
                  >
                    <span>{left}</span>
                    <span className="flex flex-col gap-1">
                      <select
                        className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-text"
                        aria-label={t('quiz.matchFor', { item: left })}
                        value={chosen}
                        disabled={locked}
                        onChange={(e) => {
                          const nextMatch = [...matchNow];
                          nextMatch[i] = Number(e.target.value);
                          setAnswer(nextMatch);
                        }}
                      >
                        <option value={-1}>{t('quiz.matchChoose')}</option>
                        {(q.rightOrder ?? q.pairs.map((_, j) => j)).map((j) => (
                          <option key={j} value={j}>
                            {q.pairs[j][1]}
                          </option>
                        ))}
                      </select>
                      {locked && (
                        <span className={`text-sm font-semibold ${right ? 'text-link' : LOST_TEXT}`}>
                          {right ? '✓' : `✗ ${t('quiz.correctAnswer')}: ${q.pairs[i][1]}`}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </fieldset>

      {!exam && hint !== undefined && !locked && (
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {q.type === 'multiple_choice' && hint >= 0 && t('quiz.hintEliminated')}
          {q.type === 'multiple_select' && t('quiz.hintCount', { n: q.answers.length })}
          {q.type !== 'multiple_choice' && q.type !== 'multiple_select' && (
            <a href={url(q.lessonLink)} target="_blank" rel="noopener">
              {t('quiz.hintLesson')} ↗
            </a>
          )}
        </p>
      )}

      <div aria-live="polite">
        {locked && (
          <div className={`callout mt-5 ${ok ? 'callout-tip' : 'callout-warning'}`}>
            <p className="callout-title">{ok ? t('quiz.correct') : t('quiz.incorrect')}</p>
            {!ok && (
              <p>
                <span className="text-muted">{t('quiz.correctAnswer')}:</span>{' '}
                <strong>{correctAnswerText(q, { true: t('quiz.true'), false: t('quiz.false') })}</strong>
              </p>
            )}
            <p>{q.explanation}</p>
            <p className="text-sm">
              <a href={url(q.lessonLink)}>{t('quiz.readLesson')} →</a>
              {q.src && (
                <>
                  <span className="mx-2 text-muted">·</span>
                  <a href={q.src} rel="noopener" className="text-muted">
                    {t('quiz.source')} ↗
                  </a>
                </>
              )}
              <span className="mx-2 text-muted">·</span>
              <a href={reportHref(q)} className="text-muted">
                {t('quiz.report')}
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {exam ? (
          <>
            <button type="button" className="btn btn-ghost disabled:opacity-40" disabled={index === 0} onClick={() => go(index - 1)}>
              ← {t('quiz.back')}
            </button>
            {index + 1 < run.length && (
              <button type="button" className="btn btn-primary" onClick={() => go(index + 1)}>
                {t('quiz.examNext')} →
              </button>
            )}
            <button type="button" className={`btn ${index + 1 < run.length ? 'btn-ghost' : 'btn-primary'}`} onClick={tryFinishExam}>
              {t('quiz.examFinish')}
            </button>
          </>
        ) : !locked ? (
          <>
            <button type="button" className="btn btn-primary disabled:opacity-50" disabled={!hasAnswer} onClick={check}>
              {t('quiz.check')}
            </button>
            {hint === undefined && q.type !== 'true_false' && (
              <button type="button" className="btn btn-ghost" onClick={takeHint}>
                💡 {t('quiz.hint')}
              </button>
            )}
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={next} autoFocus>
            {index + 1 < run.length ? t('quiz.next') : t('quiz.finish')}
          </button>
        )}
      </div>

      {exam && run.length > 1 && (
        <nav className="mt-6" aria-label={t('quiz.navigator')}>
          <ol className="flex flex-wrap gap-1.5">
            {run.map((x, i) => {
              const done = x.type === 'order' ? Array.isArray(answers[x.id]) : isAnswered(x, answers[x.id]);
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index ? 'step' : undefined}
                    aria-label={`${i + 1}${done ? `, ${t('quiz.navAnswered')}` : ''}`}
                    className={`h-8 w-8 rounded-md border text-xs font-semibold tabular-nums ${
                      i === index ? 'border-link ring-2 ring-link' : 'border-border'
                    } ${done ? 'bg-teal/20' : 'bg-surface'}`}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}
