/**
 * Horizontal 100% stacked bars (HTML, no chart library): one row per stage, segments keep their
 * colour per entity, 2px surface gaps between segments, direct labels on wide segments, a legend,
 * and a hover/focus readout. Pair it with a table for the full numbers.
 */
import { useState } from 'react';
import { pct } from '@/lib/format';

export interface BarSegment {
  key: string;
  name: string;
  /** Fraction of the row (0–1). */
  value: number;
  color: string;
  /** Text colour for a label drawn on the fill. */
  ink?: string;
  detail?: string;
}

export interface BarRow {
  label: string;
  segments: BarSegment[];
}

export const seriesColor = (slot: number) => `var(--series-${((slot - 1) % 8) + 1})`;
export const seriesInk = (slot: number) => `var(--series-${((slot - 1) % 8) + 1}-ink)`;

/** Labels go inside segments at least this wide. */
const LABEL_MIN = 0.12;

export function StackedBars({ rows, legend, ariaLabel }: { rows: BarRow[]; legend: { key: string; name: string; color: string }[]; ariaLabel: string }) {
  const [hover, setHover] = useState<{ row: string; seg: BarSegment } | null>(null);

  return (
    <figure aria-label={ariaLabel}>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-hidden="true">
        {legend.map((l) => (
          <li key={l.key} className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ background: l.color }} />
            {l.name}
          </li>
        ))}
      </ul>
      <p className="mt-2 min-h-5 text-sm text-muted" aria-hidden="true">
        {hover ? (
          <>
            <strong className="text-text">{hover.seg.name}</strong> · {hover.row}: <strong className="text-text tabular-nums">{pct(hover.seg.value)}</strong>
            {hover.seg.detail ? ` (${hover.seg.detail})` : ''}
          </>
        ) : (
          ' '
        )}
      </p>
      <div className="mt-1 space-y-2.5" aria-hidden="true" onMouseLeave={() => setHover(null)}>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[minmax(5rem,9rem)_1fr] items-center gap-3">
            <span className="truncate text-sm text-muted" title={r.label}>
              {r.label}
            </span>
            <div className="flex h-8 w-full overflow-hidden rounded-[4px]">
              {r.segments
                .filter((s) => s.value > 0)
                .map((s, i, arr) => (
                  <div
                    key={s.key}
                    className="flex h-full items-center justify-center overflow-hidden text-xs font-semibold tabular-nums"
                    style={{
                      width: `${s.value * 100}%`,
                      background: s.color,
                      color: s.ink ?? '#ffffff',
                      // 2px surface-coloured gap between neighbouring segments
                      boxShadow: i < arr.length - 1 ? 'inset -2px 0 0 var(--surface)' : undefined,
                      opacity: hover && hover.seg.key !== s.key ? 0.55 : 1,
                    }}
                    onMouseEnter={() => setHover({ row: r.label, seg: s })}
                  >
                    {s.value >= LABEL_MIN ? <span className="px-1">{pct(s.value, 0)}</span> : null}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
