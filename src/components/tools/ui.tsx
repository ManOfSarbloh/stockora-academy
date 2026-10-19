/**
 * Shared building blocks for the calculators on /tools: number inputs, result rows, a formula box
 * and a small SVG line chart (legend, end labels, hover/focus readout, table view).
 */
import { useId, useState, type ReactNode } from 'react';
import { t } from '@/i18n';

export function NumField({
  label,
  value,
  onChange,
  step = 'any',
  min,
  max,
  unit,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number | 'any';
  min?: number;
  max?: number;
  unit?: string;
  help?: string;
}) {
  const id = useId();
  const [text, setText] = useState(String(value));
  // Keep the typed text (so "1." can be typed) but report a number whenever it parses.
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={text}
          aria-describedby={help ? `${id}-help` : undefined}
          className="w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-text tabular-nums"
          onChange={(e) => {
            setText(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value !== '' && Number.isFinite(n)) onChange(n);
          }}
        />
        {unit && <span className="shrink-0 text-sm text-muted">{unit}</span>}
      </div>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-xs text-muted">
          {help}
        </p>
      )}
    </div>
  );
}

export function Select<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { v: T; label: string }[] }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-text">
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Two-column layout: inputs on the left, results on the right (stacked on phones). */
export function CalcLayout({ inputs, results, wide }: { inputs: ReactNode; results: ReactNode; wide?: ReactNode }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">{inputs}</div>
        <div aria-live="polite">{results}</div>
      </div>
      {wide && <div className="mt-6">{wide}</div>}
    </div>
  );
}

export function Results({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-border rounded-lg border border-border">{children}</dl>;
}

export function Row({ label, value, strong, tone }: { label: string; value: ReactNode; strong?: boolean; tone?: 'good' | 'bad' }) {
  const toneClass = tone === 'good' ? 'text-link' : tone === 'bad' ? 'text-[#c2410c] dark:text-[#fb923c]' : '';
  return (
    <div className="flex items-baseline justify-between gap-4 px-3 py-2">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={`text-right tabular-nums ${strong ? 'text-lg font-bold' : 'font-semibold'} ${toneClass}`}>{value}</dd>
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <details className="mt-4 rounded-lg border border-border p-3 text-sm">
      <summary className="cursor-pointer font-semibold">{t('tools.formula')}</summary>
      <div className="mt-2 space-y-1 text-muted">{children}</div>
    </details>
  );
}

export function Note({ kind = 'note', children }: { kind?: 'note' | 'warning'; children: ReactNode }) {
  return <p className={`callout ${kind === 'warning' ? 'callout-warning' : 'callout-note'} mt-4 text-sm`}>{children}</p>;
}

// ---------------------------------------------------------------------------
// Line chart
// ---------------------------------------------------------------------------

export interface LineSeries {
  key: string;
  name: string;
  /** CSS colour, e.g. var(--series-1). */
  color: string;
  values: number[];
  dashed?: boolean;
}

const W = 640;
const H = 280;
const PAD = { l: 64, r: 16, t: 12, b: 30 };

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  const step = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => n <= x) ?? 10;
  return step * p;
}

export function LineChart({ series, xLabels, format, ariaLabel, xTitle }: { series: LineSeries[]; xLabels: (string | number)[]; format: (v: number) => string; ariaLabel: string; xTitle?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = xLabels.length;
  const all = series.flatMap((s) => s.values);
  const lo = Math.min(0, ...all);
  const hi = niceMax(Math.max(...all));
  const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * (W - PAD.l - PAD.r));
  const y = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo || 1)) * (H - PAD.t - PAD.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => lo + f * (hi - lo));
  const xStep = Math.max(1, Math.ceil(n / 8));
  const idx = hover ?? n - 1;

  function pick(clientX: number, el: SVGSVGElement) {
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  return (
    <figure>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-hidden="true">
        {series.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5 rounded" style={{ background: s.color, borderTop: s.dashed ? `2px dashed ${s.color}` : undefined }} />
            {s.name}
          </li>
        ))}
      </ul>
      <p className="mt-2 min-h-5 text-sm text-muted" aria-hidden="true">
        <strong className="text-text">
          {xTitle ? `${xTitle} ` : ''}
          {xLabels[idx]}
        </strong>
        {series.map((s) => (
          <span key={s.key}>
            {' '}
            · {s.name}: <strong className="text-text tabular-nums">{format(s.values[idx])}</strong>
          </span>
        ))}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={ariaLabel}
        onMouseMove={(e) => pick(e.clientX, e.currentTarget)}
        onMouseLeave={() => setHover(null)}
        onTouchMove={(e) => pick(e.touches[0].clientX, e.currentTarget)}
      >
        {ticks.map((tv) => (
          <g key={tv}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(tv)} y2={y(tv)} stroke="var(--chart-grid)" strokeWidth={1} />
            <text x={PAD.l - 6} y={y(tv) + 4} textAnchor="end" fontSize={11} fill="var(--muted)">
              {format(tv)}
            </text>
          </g>
        ))}
        {xLabels.map((l, i) =>
          i % xStep === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--muted)">
              {l}
            </text>
          ) : null,
        )}
        {/* Draw the first series last, so it stays on top where lines overlap. */}
        {[...series].reverse().map((s) => (
          <polyline
            key={s.key}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dashed ? '6 4' : undefined}
            strokeLinejoin="round"
            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          />
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />}
        {series.map((s) => (
          <circle key={s.key} cx={x(idx)} cy={y(s.values[idx])} r={4} fill={s.color} stroke="var(--surface)" strokeWidth={2} />
        ))}
      </svg>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-muted">{t('tools.tableView')}</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full text-right tabular-nums">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">{xTitle ?? ''}</th>
                {series.map((s) => (
                  <th key={s.key} className="px-2 py-1">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xLabels.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-2 py-1 text-left">{l}</td>
                  {series.map((s) => (
                    <td key={s.key} className="px-2 py-1">
                      {format(s.values[i])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
