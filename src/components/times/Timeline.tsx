/**
 * 24-hour timeline: every exchange's sessions on one calendar day in the viewer's time zone,
 * with the Europe–US overlap highlighted and a "now" line. A table view lists the same data.
 */
import { useMemo, useState } from 'react';
import { t } from '@/i18n';
import {
  addDays,
  daySchedule,
  intersect,
  regularOnly,
  timelineForViewerDay,
  viewerDayWindow,
  zonedDate,
  zonedTime,
  type Exchange,
  type TimelineSegment,
} from '@/lib/market-hours';
import { fmtDay, fmtDuration, zoneLabel } from './shared';

const segClass = (s: TimelineSegment) =>
  s.type === 'regular' ? 'tt-seg-regular' : s.type === 'pre' || s.type === 'post' ? 'tt-seg-ext' : s.type === 'lunch' ? 'hidden' : 'tt-seg-auction';

const segName = (s: TimelineSegment) =>
  s.label ??
  (s.type === 'regular'
    ? t('tt.timeline.legend.regular')
    : s.type === 'auction-open'
      ? t('tt.auction.open')
      : s.type === 'auction-close'
        ? t('tt.auction.close')
        : t(`tt.state.${s.type === 'pre' ? 'pre' : 'post'}`));

/** Merge overlapping intervals. */
function union(xs: { start: Date; end: Date }[]) {
  const s = [...xs].sort((a, b) => a.start.getTime() - b.start.getTime());
  const out: { start: Date; end: Date }[] = [];
  for (const x of s) {
    const last = out[out.length - 1];
    if (last && x.start.getTime() <= last.end.getTime()) last.end = new Date(Math.max(last.end.getTime(), x.end.getTime()));
    else out.push({ ...x });
  }
  return out;
}

export default function Timeline({ exchanges, now, zone }: { exchanges: Exchange[]; now: Date; zone: string }) {
  const today = zonedDate(now, zone);
  const [date, setDate] = useState<string | null>(null);
  const day = date ?? today;
  const [hover, setHover] = useState<{ ex: Exchange; seg: TimelineSegment } | null>(null);

  const win = viewerDayWindow(day, zone);
  const rows = useMemo(() => exchanges.map((ex) => ({ ex, ...timelineForViewerDay(ex, day, zone) })), [exchanges, day, zone]);

  // Europe–US overlap: continuous trading in London or Frankfurt at the same time as New York.
  const overlap = useMemo(() => {
    const byId = (id: string) => rows.find((r) => r.ex.id === id);
    const eu = union(['lse', 'xetra'].flatMap((id) => regularOnly(byId(id)?.segments ?? [])));
    const us = regularOnly(byId('nyse')?.segments ?? []);
    return union(intersect(eu, us));
  }, [rows]);

  const pct = (min: number) => `${(min / win.minutes) * 100}%`;
  const minOf = (d: Date) => (d.getTime() - win.start.getTime()) / 60000;
  const nowMin = day === today ? minOf(now) : null;
  const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => h * 60).filter((m) => m <= win.minutes);

  const reasonFor = (ex: Exchange) => {
    const d = daySchedule(ex, day);
    if (d.kind === 'holiday') return `${t('tt.state.holiday')}: ${d.holiday?.name}`;
    if (d.kind === 'weekend') return t('tt.state.weekend');
    if (d.kind === 'hours-unconfirmed') return t('tt.state.unknown');
    return t('tt.state.closed');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={() => setDate(addDays(day, -1))} aria-label={t('tt.timeline.prev')}>
          ←
        </button>
        <p className="min-w-40 text-center font-semibold" aria-live="polite">
          {fmtDay(day, true)}
        </p>
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={() => setDate(addDays(day, 1))} aria-label={t('tt.timeline.next')}>
          →
        </button>
        {day !== today && (
          <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={() => setDate(null)}>
            {t('tt.timeline.today')}
          </button>
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-hidden="true">
        <li className="flex items-center gap-1.5">
          <span className="tt-seg-regular inline-block h-3 w-5 rounded-sm" /> {t('tt.timeline.legend.regular')}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="tt-seg-auction inline-block h-3 w-5 rounded-sm" /> {t('tt.timeline.legend.auction')}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="tt-seg-ext inline-block h-3 w-5 rounded-sm" /> {t('tt.timeline.legend.extended')}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="tt-overlap inline-block h-3 w-5 rounded-sm" /> {t('tt.timeline.legend.overlap')}
        </li>
        {nowMin !== null && (
          <li className="flex items-center gap-1.5">
            <span className="tt-now inline-block h-3 w-0.5" /> {t('tt.timeline.legend.now')}
          </li>
        )}
      </ul>

      <p className="mt-2 text-sm">
        {overlap.length
          ? overlap.map((o) => t('tt.timeline.overlap', { from: zonedTime(o.start, zone), to: zonedTime(o.end, zone), duration: fmtDuration(o.end.getTime() - o.start.getTime()) })).join(' · ')
          : t('tt.timeline.noOverlap')}
      </p>
      {win.minutes !== 1440 && <p className="mt-1 text-sm text-muted">{t('tt.timeline.dayLength', { hours: win.minutes / 60 })}</p>}

      <p className="mt-2 min-h-5 text-sm text-muted tabular-nums" aria-hidden="true">
        {hover ? (
          <>
            <strong className="text-text">{hover.ex.shortName}</strong> · {segName(hover.seg)}: {zonedTime(hover.seg.start, zone)}–{zonedTime(hover.seg.end, zone)} {zoneLabel(zone)} (
            {zonedTime(hover.seg.start, hover.ex.timeZone)}–{zonedTime(hover.seg.end, hover.ex.timeZone)} {t('tt.timeline.local')})
          </>
        ) : (
          ' '
        )}
      </p>

      {/* ---- Chart ---- */}
      <div className="mt-1 overflow-x-auto" aria-hidden="true" onMouseLeave={() => setHover(null)}>
        <div className="min-w-[40rem]">
          <div className="grid grid-cols-[8.5rem_1fr] gap-x-3">
            <div />
            <div className="relative h-5 text-xs text-muted tabular-nums">
              {ticks.map((m) => (
                <span key={m} className={`absolute ${m === 0 ? '' : m >= win.minutes ? '-translate-x-full' : '-translate-x-1/2'}`} style={{ left: pct(m) }}>
                  {String(Math.round(m / 60)).padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            {rows.map(({ ex, segments }) => (
              <div key={ex.id} className="grid grid-cols-[8.5rem_1fr] items-center gap-x-3 border-t border-border/60 py-1.5">
                <span className="truncate text-sm" title={ex.name}>
                  {ex.shortName}
                </span>
                <div className="relative h-6">
                  {ticks.map((m) => (
                    <span key={m} className="absolute inset-y-0 w-px bg-[var(--chart-grid)]" style={{ left: pct(m) }} />
                  ))}
                  {overlap.map((o, i) => (
                    <span key={i} className="tt-overlap absolute inset-y-[-6px]" style={{ left: pct(minOf(o.start)), width: pct(minOf(o.end) - minOf(o.start)) }} />
                  ))}
                  {segments.length === 0 && <span className="absolute inset-y-0 left-2 flex items-center text-xs text-muted">{reasonFor(ex)}</span>}
                  {segments.map((s, i) => (
                    <span
                      key={i}
                      className={`${segClass(s)} absolute inset-y-1 rounded-[3px]`}
                      style={{ left: pct(s.startMin), width: `max(2px, ${pct(s.endMin - s.startMin)})` }}
                      onMouseEnter={() => setHover({ ex, seg: s })}
                    />
                  ))}
                  {nowMin !== null && <span className="tt-now absolute inset-y-[-6px] w-0.5" style={{ left: pct(nowMin) }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Table view ---- */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold">{t('tt.timeline.table')}</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm tabular-nums">
            <caption className="sr-only">
              {t('tt.timeline.title')} · {fmtDay(day, true)} · {zone}
            </caption>
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th scope="col" className="py-2 pr-3">
                  {t('tt.convert.exchange')}
                </th>
                <th scope="col" className="py-2 pr-3">
                  {t('tt.timeline.legend.regular')} ({t('tt.timeline.yourTime')})
                </th>
                <th scope="col" className="py-2">
                  {t('tt.timeline.legend.extended')} / {t('tt.timeline.legend.auction')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ ex, segments }) => (
                <tr key={ex.id} className="border-b border-border/60">
                  <th scope="row" className="py-1.5 pr-3 text-left font-medium">
                    {ex.shortName}
                  </th>
                  <td className="py-1.5 pr-3">
                    {regularOnly(segments)
                      .map((s) => `${zonedTime(s.start, zone)}–${zonedTime(s.end, zone)}`)
                      .join(', ') || reasonFor(ex)}
                  </td>
                  <td className="py-1.5 text-muted">
                    {segments
                      .filter((s) => s.type !== 'regular' && s.type !== 'lunch')
                      .map((s) => `${segName(s)} ${zonedTime(s.start, zone)}–${zonedTime(s.end, zone)}`)
                      .join(' · ') || '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
