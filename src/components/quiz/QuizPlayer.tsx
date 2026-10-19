/**
 * /quizzes/play: reads the quiz kind from the URL (?kind=mega&n=50 …), loads the question bank,
 * picks the questions and runs them in QuizRunner. Daily quiz and Final Exam save their extra state here.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { t, type UiKey } from '@/i18n';
import { url } from '@/lib/url';
import type { Question } from '@/lib/quiz';
import {
  EXAM,
  completeDaily,
  dayKey,
  dueForReview,
  pickDaily,
  pickExam,
  pickMega,
  pickSpread,
  pickWeakSpot,
  recordExam,
  type GroupOf,
} from '@/lib/quiz-engine';
import { parsePlayConfig, pickSpecial, specialById, type PlayConfig } from '@/lib/quiz-sets';
import { loadDaily, loadExam, loadStats, saveDaily, saveExam } from '@/lib/quiz-store';
import { loadQuizData } from '@/lib/quiz-data';
import QuizRunner, { type RunResult } from './QuizRunner';

interface Props {
  names: Record<string, string>;
  hrefs: Record<string, string>;
  topics: string[];
  countries: string[];
  reportBase: string;
  reportPage: string;
}

interface Plan {
  title: string;
  questions: Question[];
  quizId: string | null;
  redraw?: () => Question[];
  timeLimit?: number;
  passPercent?: number;
  onFinish?: (r: RunResult) => ReactNode | void;
}

export default function QuizPlayer({ names, hrefs, topics, countries, reportBase, reportPage }: Props) {
  const [bank, setBank] = useState<Question[] | null>(null);
  const [error, setError] = useState(false);
  const [cfg, setCfg] = useState<PlayConfig | null>(null);

  useEffect(() => {
    setCfg(parsePlayConfig(window.location.search));
    loadQuizData()
      .then((d) => setBank(d.questions))
      .catch(() => setError(true));
  }, []);

  const groupOf: GroupOf = useMemo(() => {
    const world = new Set(countries);
    return (q) => (world.has(q.category) ? 'WORLD' : q.category);
  }, [countries]);

  const plan = useMemo<Plan | null>(() => {
    if (!bank || !cfg) return null;
    const today = dayKey(new Date());
    const n = cfg.n ?? 20;
    const name = (id?: string) => (id && names[id]) || id || '';
    switch (cfg.kind) {
      case 'category':
      case 'country': {
        const id = (cfg.id ?? '').toUpperCase();
        return {
          title: t(cfg.kind === 'category' ? 'qp.title.category' : 'qp.title.country', { name: name(id) }),
          questions: bank.filter((q) => q.category === id),
          quizId: cfg.kind === 'category' ? id : `country-${id}`,
        };
      }
      case 'special': {
        const s = specialById(cfg.id ?? '');
        if (!s || s.href) return { title: '', questions: [], quizId: null };
        const draw = () => pickSpecial(s, bank);
        return { title: t(`qs.${s.id}.title` as UiKey), questions: draw(), quizId: `special-${s.id}`, redraw: draw };
      }
      case 'exam': {
        const draw = () => pickExam(bank, topics, Math.random, groupOf);
        return {
          title: t('qp.title.exam'),
          questions: draw(),
          quizId: 'final-exam',
          redraw: draw,
          timeLimit: EXAM.minutes,
          passPercent: EXAM.passPercent,
          onFinish: (r) => {
            const e = recordExam(loadExam(), r.percent, today);
            saveExam(e);
            return r.percent >= EXAM.passPercent ? (
              <a className="btn btn-primary" href={url('/quizzes/certificate')}>
                {t('qp.exam.cert')}
              </a>
            ) : null;
          },
        };
      }
      case 'daily':
        return {
          title: t('qp.title.daily', { date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }),
          questions: pickDaily(bank, today, groupOf),
          quizId: 'daily',
          onFinish: (r) => {
            const d = completeDaily(loadDaily(), today, r.percent);
            saveDaily(d);
            return (
              <p className="font-semibold">
                🔥 {d.streak === 1 ? t('qh.daily.streakOne') : t('qh.daily.streak', { n: d.streak })} · {t('qh.daily.best', { n: d.best })}
              </p>
            );
          },
        };
      case 'weak': {
        const draw = () => pickWeakSpot(bank, loadStats(), n);
        return { title: t('qp.title.weak'), questions: draw(), quizId: null, redraw: draw };
      }
      case 'review':
        return { title: t('qp.title.review'), questions: dueForReview(bank, loadStats(), today).slice(0, n), quizId: null };
      case 'custom': {
        const pool = bank.filter((q) => (cfg.cats ?? []).includes(q.category) && (!cfg.level || q.difficulty === cfg.level));
        const draw = () => pickSpread(pool, n, Math.random, groupOf);
        return { title: t('qp.title.custom'), questions: draw(), quizId: null, redraw: draw };
      }
      default: {
        const draw = () => pickMega(bank, n, cfg.level, Math.random, groupOf);
        return { title: t('qp.title.mega'), questions: draw(), quizId: cfg.level ? null : `mega-${n}`, redraw: draw };
      }
    }
    // The plan is fixed once per page load; redraws go through `redraw`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank, cfg]);

  useEffect(() => {
    if (plan?.title) document.title = `${plan.title} | ${t('site.name')}`;
  }, [plan?.title]);

  if (error) return <p className="callout callout-warning">{t('quiz.loadError')}</p>;
  if (!plan || !cfg) {
    // Same size as the page's fallback, so the footer does not jump while questions load.
    return (
      <div className="island-fallback h-[760px] lg:h-[560px]" role="status">
        <span className="sr-only">{t('quiz.loading')}</span>
      </div>
    );
  }

  const reportHref = (q: Question) => {
    if (!reportBase.includes('github.com')) return reportBase;
    const u = new URL(reportBase);
    u.searchParams.set('title', `Mistake in quiz question ${q.id}`);
    u.searchParams.set('body', `Question ${q.id} (${reportPage})\n\nWhat is wrong:\n\n\nWhat is correct (with an official source if possible):\n`);
    return u.toString();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
      {plan.questions.length > 0 && <p className="mt-1 text-muted">{t('qp.lead', { n: plan.questions.length })}</p>}
      <div className="mt-6">
        {plan.questions.length === 0 ? (
          <div className="card p-5">
            <p className="text-muted">{cfg.kind === 'weak' ? t('qh.weak.empty') : cfg.kind === 'review' ? t('qh.review.none') : t('quiz.noQuestions')}</p>
            <a className="btn btn-ghost mt-4" href={url('/quizzes')}>
              {t('quiz.toHub')}
            </a>
          </div>
        ) : (
          <QuizRunner
            questions={plan.questions}
            quizId={plan.quizId}
            mode={cfg.mode}
            timeLimitMinutes={plan.timeLimit ?? cfg.minutes}
            names={names}
            hrefs={hrefs}
            order={[...topics, 'HSM', 'GL', ...countries]}
            reportHref={reportHref}
            onFinish={plan.onFinish}
            redraw={plan.redraw}
            hubHref="/quizzes"
            passPercent={plan.passPercent}
            headingLevel={2}
          />
        )}
      </div>
    </div>
  );
}
