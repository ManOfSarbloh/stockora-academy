/**
 * World Markets Matching Game. Round 1: match indexes and currencies to countries. Round 2: find the
 * country on the map (or pick it from the list, for keyboard and screen reader users).
 * All facts come from the country pages (content/countries).
 */
import { useEffect, useId, useState } from 'react';
import { t } from '@/i18n';
import { url } from '@/lib/url';
import { buildGameItems, pickRound, type GameCountry, type GameItem } from '@/lib/world-game';
import { saveGameScore } from '@/lib/quiz-store';
import type { BadgeId } from '@/lib/quiz-engine';
import type { UiKey } from '@/i18n';

interface Shape {
  code: string | null;
  d: string;
}
interface Props {
  countries: GameCountry[];
  map: { width: number; height: number; shapes: Shape[]; markers: { code: string; x: number; y: number }[] };
}

const MATCH_N = 6;
const MAP_N = 5;
const LOST = 'text-[#c2410c] dark:text-[#fb923c]';

export default function WorldGame({ countries, map }: Props) {
  const uid = useId();
  const [items] = useState(() => buildGameItems(countries));
  const [round1, setRound1] = useState<GameItem[]>([]);
  const [round2, setRound2] = useState<GameItem[]>([]);
  const [picks1, setPicks1] = useState<string[]>([]);
  const [checked1, setChecked1] = useState(false);
  const [step, setStep] = useState(0); // index within round 2
  const [pick2, setPick2] = useState('');
  const [checked2, setChecked2] = useState(false);
  const [score2, setScore2] = useState(0);
  const [finished, setFinished] = useState(false);
  const [badges, setBadges] = useState<BadgeId[]>([]);

  const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));
  const nameOf = (code: string) => countries.find((c) => c.code === code)?.name ?? code;
  const targetCodes = new Set(countries.map((c) => c.code));

  function newGame() {
    const r1 = pickRound(items, MATCH_N);
    const rest = items.filter((i) => !r1.includes(i));
    setRound1(r1);
    setRound2(pickRound(rest, MAP_N));
    setPicks1(r1.map(() => ''));
    setChecked1(false);
    setStep(0);
    setPick2('');
    setChecked2(false);
    setScore2(0);
    setFinished(false);
    setBadges([]);
  }

  useEffect(newGame, [items]);

  if (round1.length === 0) return <p className="card p-5 text-muted">{t('quiz.loading')}</p>;

  const score1 = checked1 ? round1.filter((it, i) => picks1[i] === it.code).length : 0;
  const q2 = round2[step];
  const total = round1.length + round2.length;

  function check2() {
    if (!q2 || !pick2) return;
    setChecked2(true);
    if (pick2 === q2.code) setScore2((s) => s + 1);
  }

  function next2() {
    if (step + 1 < round2.length) {
      setStep(step + 1);
      setPick2('');
      setChecked2(false);
    } else {
      const correct = score1 + score2;
      setBadges(saveGameScore('special-world-matching', Math.round((correct / total) * 100), total));
      setFinished(true);
    }
  }

  const question2 = (it: GameItem) =>
    it.kind === 'index' ? t('wg.map.question.index', { item: it.label }) : t('wg.map.question.currency', { item: it.label });

  const fillFor = (code: string | null) => {
    if (!code || !targetCodes.has(code)) return 'fill-[var(--chart-grid)]';
    if (checked2 && q2 && code === q2.code) return 'fill-[var(--series-1)]';
    if (checked2 && code === pick2) return 'fill-[#c2410c] dark:fill-[#fb923c]';
    if (code === pick2) return 'fill-[var(--link)]';
    return 'fill-[var(--series-3)] hover:fill-[var(--link)] cursor-pointer';
  };

  return (
    <div className="space-y-8">
      {/* Round 1 */}
      <section className="card p-5 sm:p-6" aria-labelledby={`${uid}-r1`}>
        <h2 id={`${uid}-r1`} className="text-xl font-bold">
          {t('wg.match.title')}
        </h2>
        <p className="mt-1 text-sm text-muted">{t('wg.match.lead')}</p>
        <ul className="mt-4 space-y-2">
          {round1.map((it, i) => {
            const right = checked1 && picks1[i] === it.code;
            return (
              <li
                key={it.label}
                className={`grid gap-2 rounded-lg border-2 px-3 py-2.5 sm:grid-cols-[1fr_minmax(0,14rem)] sm:items-center ${
                  !checked1 ? 'border-border' : right ? 'border-link bg-link/10' : 'border-[#c2410c] dark:border-[#fb923c]'
                }`}
              >
                <span>{t(it.kind === 'index' ? 'wg.index' : 'wg.currency', { item: it.label })}</span>
                <span className="flex flex-col gap-1">
                  <select
                    className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-text"
                    aria-label={t('quiz.matchFor', { item: it.label })}
                    value={picks1[i]}
                    disabled={checked1}
                    onChange={(e) => setPicks1(picks1.map((p, j) => (j === i ? e.target.value : p)))}
                  >
                    <option value="">{t('quiz.matchChoose')}</option>
                    {sorted.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {checked1 && (
                    <span className={`text-sm font-semibold ${right ? 'text-link' : LOST}`}>
                      {right ? '✓' : `✗ ${t('wg.wrong', { name: nameOf(it.code) })}`}{' '}
                      <a href={url(`/world/${it.code.toLowerCase()}`)} className="font-normal">
                        →
                      </a>
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        {!checked1 ? (
          <button type="button" className="btn btn-primary mt-4 disabled:opacity-50" disabled={picks1.some((p) => !p)} onClick={() => setChecked1(true)}>
            {t('wg.check')}
          </button>
        ) : (
          <p className="mt-4 font-semibold" aria-live="polite">
            {t('wg.score', { score: score1, total: round1.length })}
          </p>
        )}
      </section>

      {/* Round 2 */}
      {checked1 && (
        <section className="card p-5 sm:p-6" aria-labelledby={`${uid}-r2`}>
          <h2 id={`${uid}-r2`} className="text-xl font-bold">
            {t('wg.map.title')}
          </h2>
          <p className="mt-1 text-sm text-muted">{t('wg.map.lead')}</p>

          {finished ? (
            <div className="mt-4" aria-live="polite">
              <p className="text-lg font-semibold">{t('wg.score', { score: score1 + score2, total })}</p>
              {badges.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <li key={b} className="rounded-full border-2 border-link px-3 py-1 text-sm font-semibold">
                      🏅 {t('quiz.newBadge', { name: t(`badge.${b}.name` as UiKey) })}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary" onClick={newGame}>
                  {t('wg.newGame')}
                </button>
                <a className="btn btn-ghost" href={url('/quizzes')}>
                  {t('quiz.toHub')}
                </a>
              </div>
            </div>
          ) : (
            q2 && (
              <>
                <p className="mt-4 text-xs font-semibold text-muted">{t('quiz.questionOf', { n: step + 1, total: round2.length })}</p>
                <p className="mt-1 text-lg font-semibold">{question2(q2)}</p>
                <svg viewBox={`0 0 ${map.width} ${map.height}`} className="mt-4 h-auto w-full" role="img" aria-label={t('wg.mapLabel')}>
                  <g className="stroke-[var(--surface)]" strokeWidth={0.5}>
                    {map.shapes.map((s, i) => (
                      <path
                        key={i}
                        d={s.d}
                        className={fillFor(s.code)}
                        onClick={() => !checked2 && s.code && targetCodes.has(s.code) && setPick2(s.code)}
                      />
                    ))}
                  </g>
                  {map.markers.map((m) => (
                    <circle
                      key={m.code}
                      cx={m.x}
                      cy={m.y}
                      r={6}
                      strokeWidth={1.5}
                      className={`stroke-[var(--surface)] ${fillFor(m.code)}`}
                      onClick={() => !checked2 && setPick2(m.code)}
                    />
                  ))}
                </svg>
                <label className="mt-3 block text-sm font-semibold">
                  {t('wg.map.or')}
                  <select
                    className="mt-1.5 block w-full max-w-xs rounded-lg border border-border bg-surface px-2 py-1.5 font-normal text-text"
                    value={pick2}
                    disabled={checked2}
                    onChange={(e) => setPick2(e.target.value)}
                  >
                    <option value="">{t('quiz.matchChoose')}</option>
                    {sorted.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div aria-live="polite">
                  {pick2 && !checked2 && <p className="mt-2 text-sm">{nameOf(pick2)}</p>}
                  {checked2 && (
                    <p className={`mt-3 font-semibold ${pick2 === q2.code ? 'text-link' : LOST}`}>
                      {pick2 === q2.code ? `✓ ${t('wg.right', { name: nameOf(q2.code) })}` : `✗ ${t('wg.wrong', { name: nameOf(q2.code) })}`}{' '}
                      <a href={url(`/world/${q2.code.toLowerCase()}`)} className="font-normal">
                        {nameOf(q2.code)} →
                      </a>
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  {!checked2 ? (
                    <button type="button" className="btn btn-primary disabled:opacity-50" disabled={!pick2} onClick={check2}>
                      {t('wg.check')}
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary" onClick={next2} autoFocus>
                      {step + 1 < round2.length ? t('wg.next') : t('quiz.finish')}
                    </button>
                  )}
                </div>
              </>
            )
          )}
        </section>
      )}
    </div>
  );
}
