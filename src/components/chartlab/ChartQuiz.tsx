/**
 * Chart Reading Quiz: ten questions on charts generated from simulated data, including
 * click-on-the-chart answers. Scores are kept in localStorage like the other quizzes.
 */
import { useMemo, useRef, useState } from 'react';
import { t } from '@/i18n';
import { SESSION_MINUTES, type Candle } from '@/lib/chart/core';
import { rsi } from '@/lib/chart/indicators';
import { generateChartQuiz, isHighestClick, isSupportClick, type ChartQuestion } from '@/lib/chart/quiz-gen';
import type { PatternDef } from '@/lib/chart/examples';
import { readJSON, writeJSON } from '@/lib/storage';
import ChartCanvas, { type Drawing, type Pane, type Point } from './ChartCanvas';

interface PatternInfo extends PatternDef {
  formation: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
function labelFor(q: ChartQuestion) {
  return (c: Candle) => {
    if (q.kind === 'timeframe' && q.answer === 'W') return `Week ${Math.floor(c.day / 5) + 1}`;
    if (q.kind === 'timeframe' && q.answer === '1h') {
      const m = 570 + (c.t - c.day * SESSION_MINUTES);
      return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    }
    return `Day ${c.day + 1}`;
  };
}

const optionsFor = (q: ChartQuestion): { key: string; label: string }[] => {
  if (q.kind === 'candle') return q.options.map((o, i) => ({ key: String(i), label: o }));
  if (q.kind === 'trend') return (['up', 'down', 'range'] as const).map((k) => ({ key: k, label: t(`cq.opt.${k}`) }));
  if (q.kind === 'rsi') return (['high', 'low', 'mid'] as const).map((k) => ({ key: k, label: t(k === 'high' ? 'cq.opt.rsiHigh' : k === 'low' ? 'cq.opt.rsiLow' : 'cq.opt.rsiMid') }));
  if (q.kind === 'timeframe') return (['1h', 'D', 'W'] as const).map((k) => ({ key: k, label: t(`cq.opt.${k}`) }));
  return [];
};

export default function ChartQuiz({ patterns }: { patterns: PatternInfo[] }) {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6));
  const questions = useMemo(() => generateChartQuiz(seed, patterns as never), [seed, patterns]);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [click, setClick] = useState<Point | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const q = questions[index];
  const isClick = q.kind === 'support' || q.kind === 'highest';
  const ok = (() => {
    if (q.kind === 'candle') return choice === String(q.answer);
    if (q.kind === 'trend' || q.kind === 'rsi' || q.kind === 'timeframe') return choice === q.answer;
    if (q.kind === 'support') return !!click && isSupportClick(q, click.p);
    if (q.kind === 'highest') return !!click && isHighestClick(q, click.i);
    return false;
  })();

  const check = () => {
    setChecked(true);
    if (ok) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (index + 1 >= questions.length) {
      const pct = Math.round((correct / questions.length) * 100);
      const scores = readJSON<Record<string, { best: number; last: number; date: string }>>('quiz-scores', {});
      scores['chart-quiz'] = { best: Math.max(scores['chart-quiz']?.best ?? 0, pct), last: pct, date: new Date().toISOString() };
      writeJSON('quiz-scores', scores);
      setDone(true);
    } else {
      setIndex(index + 1);
      setChoice(null);
      setClick(null);
      setChecked(false);
    }
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const restart = () => {
    setSeed(Math.floor(Math.random() * 1e6));
    setIndex(0);
    setChoice(null);
    setClick(null);
    setChecked(false);
    setCorrect(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="card p-5">
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">
          {t('cq.score', { c: correct, n: questions.length, pct })}
        </h2>
        <button type="button" className="btn btn-primary mt-4" onClick={restart}>
          {t('cq.again')}
        </button>
      </div>
    );
  }

  // Chart for this question
  const panes: Pane[] = q.kind === 'rsi' ? [{ key: 'rsi', label: 'RSI 14', lines: [{ key: 'r', label: 'RSI', values: rsi(q.candles.map((c) => c.c), 14), color: 'var(--series-7)' }], range: [0, 100], guides: [30, 70] }] : [];
  const drawings: Drawing[] = [];
  if (checked && q.kind === 'support') drawings.push({ type: 'rect', a: { i: 0, p: q.zone.hi }, b: { i: q.candles.length - 1, p: q.zone.lo } });
  if (click && q.kind === 'support') drawings.push({ type: 'hline', a: click, b: click });
  const selected = q.kind === 'highest' ? (checked ? q.index : click?.i ?? null) : null;
  const question =
    q.kind === 'candle' ? t('cq.q.candle') : q.kind === 'trend' ? t('cq.q.trend') : q.kind === 'rsi' ? t('cq.q.rsi') : q.kind === 'support' ? t('cq.q.support') : q.kind === 'highest' ? t('cq.q.highest') : t('cq.q.timeframe');

  const explanation = (() => {
    if (q.kind === 'candle') {
      const p = patterns.find((x) => x.id === q.patternId)!;
      return t('cq.ex.candle', { name: p.name, formation: p.formation });
    }
    if (q.kind === 'trend') return t('cq.ex.trend', { name: t(`cl.scenario.${q.scenario}`) });
    if (q.kind === 'rsi') return t('cq.ex.rsi', { v: q.value.toFixed(0) });
    if (q.kind === 'support') return t('cq.ex.support', { lo: q.zone.lo.toFixed(2), hi: q.zone.hi.toFixed(2) });
    if (q.kind === 'highest') return t('cq.ex.highest', { c: q.candles[q.index].c.toFixed(2) });
    return t('cq.ex.timeframe', { what: t(q.answer === '1h' ? 'cq.ex.tfh' : q.answer === 'D' ? 'cq.ex.tfd' : 'cq.ex.tfw') });
  })();

  return (
    <div className="card p-4 sm:p-5">
      <p className="text-xs font-semibold text-muted">{t('cq.qOf', { n: index + 1, total: questions.length })}</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-semibold outline-none">
        {question}
      </h2>
      <div className="mt-3">
        <ChartCanvas
          candles={q.candles}
          window={{ start: 0, end: q.candles.length }}
          showVolume={false}
          panes={panes}
          drawings={drawings}
          selected={selected}
          highlight={q.kind === 'candle' ? q.highlight : null}
          height={q.kind === 'candle' ? 200 : 260}
          timeLabel={q.kind === 'timeframe' || q.kind === 'trend' ? labelFor(q) : undefined}
          onPick={(pt) => !checked && isClick && setClick(pt)}
          ariaLabel={question}
        />
      </div>
      {isClick ? (
        <p className="mt-2 text-sm text-muted">{click ? `✓ ${click.p.toFixed(2)}` : t('cq.clickHint')}</p>
      ) : (
        <div className="mt-3 space-y-2" role="radiogroup" aria-label={question}>
          {optionsFor(q).map((o) => {
            const right = checked && ((q.kind === 'candle' && o.key === String(q.answer)) || ('answer' in q && q.kind !== 'candle' && o.key === q.answer));
            return (
              <label key={o.key} className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2 ${right ? 'border-link bg-link/10' : choice === o.key ? 'border-link' : 'border-border'}`}>
                <input type="radio" name={`cq-${index}`} className="accent-[var(--link)]" checked={choice === o.key} disabled={checked} onChange={() => setChoice(o.key)} />
                <span>{o.label}</span>
                {right && <span className="ml-auto text-sm font-semibold text-link">✓</span>}
              </label>
            );
          })}
        </div>
      )}
      {checked && (
        <div className={`callout mt-4 ${ok ? 'callout-tip' : 'callout-warning'}`} aria-live="polite">
          <p className="callout-title">{ok ? t('cq.right') : t('cq.wrong')}</p>
          <p>{explanation}</p>
        </div>
      )}
      <div className="mt-4">
        {!checked ? (
          <button type="button" className="btn btn-primary disabled:opacity-50" disabled={isClick ? !click : choice === null} onClick={check}>
            {t('cq.check')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={next}>
            {index + 1 < questions.length ? t('cq.next') : t('cq.finish')}
          </button>
        )}
      </div>
    </div>
  );
}
