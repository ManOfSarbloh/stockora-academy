/**
 * Interactive parts of /scams: the red-flag checklist (explanatory warning level, not a prediction)
 * and the "Spot the scam" scenarios (fictional messages, answer then explanation).
 */
import { useId, useState } from 'react';
import { t } from '@/i18n';

interface Flag {
  id: string;
  text: string;
  why: string;
  source: string;
}
interface Scenario {
  id: string;
  channel: string;
  from: string;
  message: string;
  scam: boolean;
  explain: string;
}

const LOST = 'text-[#c2410c] dark:text-[#fb923c]';

export function RedFlagChecklist({ flags }: { flags: Flag[] }) {
  const uid = useId();
  const [ticked, setTicked] = useState<string[]>([]);
  const n = ticked.length;
  const level = n === 0 ? 0 : n === 1 ? 1 : 2;
  const levelText = [t('ss.level0'), t('ss.level1'), t('ss.level2')][level];
  const levelClass = ['callout-note', 'callout-warning', 'callout-warning'][level];
  return (
    <div className="card p-5 sm:p-6">
      <p className="text-sm text-muted">{t('ss.checklistLead')}</p>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {flags.map((f) => {
          const on = ticked.includes(f.id);
          return (
            <li key={f.id}>
              <label className={`flex h-full cursor-pointer items-start gap-3 rounded-lg border-2 p-3 ${on ? 'border-[#c2410c] bg-[#c2410c]/5 dark:border-[#fb923c]' : 'border-border hover:border-link'}`}>
                <input
                  type="checkbox"
                  className="mt-1 accent-[#c2410c]"
                  checked={on}
                  aria-describedby={`${uid}-${f.id}`}
                  onChange={() => setTicked(on ? ticked.filter((x) => x !== f.id) : [...ticked, f.id])}
                />
                <span>
                  <span className="block font-medium">{f.text}</span>
                  <span id={`${uid}-${f.id}`} className="mt-0.5 block text-xs text-muted">
                    {f.why} <span className="whitespace-nowrap">({f.source})</span>
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="mt-5" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{t('ss.flagsTicked', { n })}</span>
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-2.5 w-10 rounded-full ${i <= level && n > 0 ? 'bg-[#c2410c] dark:bg-[#fb923c]' : 'bg-surface-2'}`} />
            ))}
          </span>
        </div>
        <p className={`callout ${levelClass} mt-3`}>{levelText}</p>
        <p className="mt-2 text-xs text-muted">{t('ss.checklistNote')}</p>
        {n > 0 && (
          <button type="button" className="btn btn-ghost mt-3 text-sm" onClick={() => setTicked([])}>
            {t('ss.clear')}
          </button>
        )}
      </div>
    </div>
  );
}

export function SpotTheScam({ scenarios }: { scenarios: Scenario[] }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const done = Object.keys(answers).length;
  const right = scenarios.filter((s) => s.id in answers && answers[s.id] === s.scam).length;
  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2">
        {scenarios.map((s, i) => {
          const answered = s.id in answers;
          const correct = answered && answers[s.id] === s.scam;
          return (
            <li key={s.id} className="card flex flex-col p-5">
              <p className="text-xs font-semibold text-muted">
                {t('ss.case', { n: i + 1 })} · {s.channel}
              </p>
              <div className="mt-2 rounded-xl rounded-tl-sm bg-surface-2 p-3 text-sm">
                <p className="text-xs font-semibold text-muted">{s.from}</p>
                <p className="mt-1">{s.message}</p>
              </div>
              {!answered ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary" onClick={() => setAnswers({ ...answers, [s.id]: true })}>
                    🚩 {t('ss.isScam')}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setAnswers({ ...answers, [s.id]: false })}>
                    ✓ {t('ss.looksLegit')}
                  </button>
                </div>
              ) : (
                <div className={`callout mt-4 ${correct ? 'callout-tip' : 'callout-warning'}`} aria-live="polite">
                  <p className={`callout-title ${correct ? '' : LOST}`}>
                    {correct ? t('quiz.correct') : t('quiz.incorrect')} {s.scam ? t('ss.answerScam') : t('ss.answerLegit')}
                  </p>
                  <p className="text-sm">{s.explain}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-semibold" aria-live="polite">
        {done > 0 && t('ss.score', { right, done, total: scenarios.length })}
      </p>
      {done > 0 && (
        <button type="button" className="btn btn-ghost mt-2 text-sm" onClick={() => setAnswers({})}>
          {t('ss.again')}
        </button>
      )}
    </div>
  );
}
