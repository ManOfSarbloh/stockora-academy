/**
 * Practice quiz: one question at a time, instant feedback with explanation, results at the end.
 * Used for topic quizzes and the short "check yourself" quizzes under lessons.
 * The full quiz hub (exam mode, timers, badges, more question types) comes in Phase 9.
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { t } from '@/i18n';
import { url } from '@/lib/url';
import { readJSON, writeJSON } from '@/lib/storage';
import { correctAnswerText, isCorrect, isSupported, prepareQuiz, type AnswerValue, type Question } from '@/lib/quiz';

interface Props {
  quizId: string;
  questions: Question[];
  /** Report links go here (Corrections page or a GitHub issue URL builder result). */
  reportHref: string;
}

type Phase = 'answering' | 'feedback' | 'done';

interface ScoreRecord {
  best: number;
  last: number;
  date: string;
}

export default function PracticeQuiz({ quizId, questions, reportHref }: Props) {
  const usable = useMemo(() => questions.filter(isSupported), [questions]);
  const [run, setRun] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue | undefined>>({});
  const [phase, setPhase] = useState<Phase>('answering');
  const lastShown = useRef<string | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  // Shuffle on the client only (avoids a mismatch with server-rendered HTML).
  useEffect(() => setRun(prepareQuiz(usable)), [usable]);

  if (usable.length === 0) return null;
  if (run.length === 0) return <div className="card p-5 text-muted">…</div>;

  const q = run[index];
  const answer = answers[q?.id ?? ''];
  /** Current arrangement of an order question (indices into orderedItems). */
  const orderNow: number[] =
    q?.type === 'order' ? (Array.isArray(answer) ? answer : (q.initialOrder ?? q.orderedItems.map((_, i) => i))) : [];
  const correctCount = run.filter((x) => isCorrect(x, answers[x.id])).length;

  function setAnswer(v: AnswerValue) {
    if (phase !== 'answering') return;
    setAnswers((a) => ({ ...a, [q.id]: v }));
  }

  function check() {
    // An order question can be submitted as shown, so record the starting arrangement if nothing was moved.
    if (q.type === 'order' && !Array.isArray(answer)) setAnswers((a) => ({ ...a, [q.id]: orderNow }));
    setPhase('feedback');
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= orderNow.length) return;
    const next = [...orderNow];
    [next[from], next[to]] = [next[to], next[from]];
    setAnswer(next);
  }

  function next() {
    lastShown.current = q.id;
    if (index + 1 < run.length) {
      setIndex(index + 1);
      setPhase('answering');
    } else {
      finish();
    }
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function finish() {
    const pct = Math.round((correctCount / run.length) * 100);
    const scores = readJSON<Record<string, ScoreRecord>>('quiz-scores', {});
    const prev = scores[quizId];
    scores[quizId] = { best: Math.max(prev?.best ?? 0, pct), last: pct, date: new Date().toISOString() };
    writeJSON('quiz-scores', scores);
    setPhase('done');
  }

  function restart(onlyWrong: boolean) {
    const pool = onlyWrong ? run.filter((x) => !isCorrect(x, answers[x.id])) : usable;
    setRun(prepareQuiz(pool, Math.random, lastShown.current));
    setAnswers({});
    setIndex(0);
    setPhase('answering');
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  // ---- Results ----
  if (phase === 'done') {
    const pct = Math.round((correctCount / run.length) * 100);
    const wrong = run.filter((x) => !isCorrect(x, answers[x.id]));
    return (
      <div className="card p-5 sm:p-6">
        <h3 ref={headingRef} tabIndex={-1} className="text-lg font-bold outline-none">
          {pct === 100 ? t('quiz.perfect') : t('quiz.score', { score: correctCount, total: run.length, pct })}
        </h3>
        {pct === 100 && <p className="mt-1 text-muted">{t('quiz.score', { score: correctCount, total: run.length, pct })}</p>}
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
        </div>
        {wrong.length > 0 && (
          <ul className="mt-5 space-y-3">
            {wrong.map((x) => (
              <li key={x.id} className="rounded-lg border border-border p-3 text-sm">
                <p className="font-semibold">{x.question}</p>
                <p className="mt-1">
                  <span className="text-muted">{t('quiz.correctAnswer')}:</span> {correctAnswerText(x, { true: t('quiz.true'), false: t('quiz.false') })}
                </p>
                <p className="mt-1 text-muted">{x.explanation}</p>
                <a className="mt-1 inline-block font-medium" href={url(x.lessonLink)}>
                  {t('quiz.readLesson')} →
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {wrong.length > 0 && (
            <button type="button" className="btn btn-primary" onClick={() => restart(true)}>
              {t('quiz.retryWrong')}
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={() => restart(false)}>
            {t('quiz.restart')}
          </button>
        </div>
      </div>
    );
  }

  // ---- Question ----
  const ok = isCorrect(q, answer);
  const hasAnswer =
    q.type === 'order' ||
    (answer !== undefined && !(Array.isArray(answer) && answer.length === 0) && !(typeof answer === 'string' && answer.trim() === ''));
  const locked = phase === 'feedback';

  const optionClass = (selected: boolean, isRight: boolean) => {
    const base = 'flex w-full items-start gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-colors';
    if (!locked) return `${base} cursor-pointer ${selected ? 'border-link' : 'border-border hover:border-link'}`;
    if (isRight) return `${base} border-link bg-link/10`;
    if (selected) return `${base} border-[#c2410c] bg-[#c2410c]/10 dark:border-[#fb923c] dark:bg-[#fb923c]/10`;
    return `${base} border-border opacity-70`;
  };

  /** After checking, mark options with a symbol and text, so the result does not rely on colour alone. */
  const mark = (selected: boolean, isRight: boolean) =>
    !locked ? null : isRight ? (
      <span className="ml-auto shrink-0 text-sm font-semibold text-link">✓ {t('quiz.correctAnswer')}</span>
    ) : selected ? (
      <span className="ml-auto shrink-0 text-sm font-semibold text-[#c2410c] dark:text-[#fb923c]">✗ {t('quiz.yourAnswer')}</span>
    ) : null;

  return (
    <div className="card p-5 sm:p-6">
      <p className="text-xs font-semibold text-muted" aria-live="polite">
        {t('quiz.questionOf', { n: index + 1, total: run.length })}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${(index / run.length) * 100}%` }} />
      </div>

      <fieldset className="mt-4">
        <legend>
          <h3 ref={headingRef} tabIndex={-1} className="text-base font-semibold outline-none sm:text-lg">
            {q.question}
          </h3>
          {q.type === 'multiple_select' && <span className="mt-1 block text-sm text-muted">{t('quiz.selectAll')}</span>}
          {q.type === 'order' && <span className="mt-1 block text-sm text-muted">{t('quiz.orderHint')}</span>}
        </legend>

        <div className="mt-4 space-y-2">
          {q.type === 'multiple_choice' &&
            q.options.map((opt, i) => (
              <label key={i} className={optionClass(answer === i, i === q.answerIndex)}>
                <input
                  type="radio"
                  name={`${uid}-${q.id}`}
                  className="mt-1 accent-[var(--link)]"
                  checked={answer === i}
                  disabled={locked}
                  onChange={() => setAnswer(i)}
                />
                <span>{opt}</span>
                {mark(answer === i, i === q.answerIndex)}
              </label>
            ))}

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
                  if (e.key === 'Enter' && hasAnswer && !locked) check();
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
                      <span className="ml-auto shrink-0 text-sm font-semibold text-[#c2410c] dark:text-[#fb923c]">
                        ✗ {t('quiz.correctPosition', { n: item + 1 })}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </fieldset>

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
              <span className="mx-2 text-muted">·</span>
              <a href={reportHref} className="text-muted">
                {t('quiz.report')}
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-5">
        {!locked ? (
          <button type="button" className="btn btn-primary disabled:opacity-50" disabled={!hasAnswer} onClick={check}>
            {t('quiz.check')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={next} autoFocus>
            {index + 1 < run.length ? t('quiz.next') : t('quiz.finish')}
          </button>
        )}
      </div>
    </div>
  );
}
