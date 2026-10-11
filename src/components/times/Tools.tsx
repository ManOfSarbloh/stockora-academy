/**
 * Smaller Trading Times tools: "When can I trade?", the time converters, holiday lists and the
 * daylight saving time explainer. All logic comes from src/lib/market-hours.ts.
 */
import { useId, useMemo, useState } from 'react';
import { t } from '@/i18n';
import {
  addDays,
  convertLocalTime,
  weekdayOf,
  dstTransitions,
  gapPeriods,
  regularMinutesIn,
  regularOnly,
  daySchedule,
  zonedDate,
  zonedTime,
  zonedTimeToUtc,
  type Exchange,
} from '@/lib/market-hours';
import { COMMON_ZONES, allZones, fmtDay, fmtDuration, zoneLabel } from './shared';

const inputCls = 'w-full min-w-0 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-text';

function Field({ label, children }: { label: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children(id)}
    </label>
  );
}

function ZoneSelect({ id, value, onChange }: { id: string; value: string; onChange: (z: string) => void }) {
  const zones = useMemo(() => allZones(), []);
  return (
    <select id={id} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <optgroup label={t('tt.zoneCommon')}>
        {COMMON_ZONES.map((z) => (
          <option key={z} value={z}>
            {z.replace(/_/g, ' ')}
          </option>
        ))}
      </optgroup>
      <optgroup label={t('tt.zoneAll')}>
        {zones.map((z) => (
          <option key={z} value={z}>
            {z.replace(/_/g, ' ')}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

const dayShiftNote = (n: number) => (n < 0 ? ` ${t('tt.convert.prevDay')}` : n > 0 ? ` ${t('tt.convert.nextDay')}` : '');

// ---------------------------------------------------------------------------------------------

export function TradeHelper({ exchanges, now, zone }: { exchanges: Exchange[]; now: Date; zone: string }) {
  // Default to today, or the next Monday at weekends.
  const [date, setDate] = useState(() => {
    const d = zonedDate(now, zone);
    const wd = weekdayOf(d);
    return wd === 6 ? addDays(d, 2) : wd === 0 ? addDays(d, 1) : d;
  });
  const [from, setFrom] = useState('18:00');
  const [to, setTo] = useState('22:00');

  const results = useMemo(() => {
    const start = zonedTimeToUtc(date, from, zone);
    let end = zonedTimeToUtc(date, to, zone);
    if (end <= start) end = new Date(end.getTime() + 24 * 3600 * 1000); // window over midnight
    return exchanges
      .map((ex) => ({ ex, minutes: regularMinutesIn(ex, start, end), start, end }))
      .filter((r) => r.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);
  }, [exchanges, date, from, to, zone]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t('tt.helper.date')}>{(id) => <input id={id} type="date" className={inputCls} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />}</Field>
        <Field label={`${t('tt.helper.from')} (${zoneLabel(zone)})`}>{(id) => <input id={id} type="time" className={inputCls} value={from} onChange={(e) => e.target.value && setFrom(e.target.value)} />}</Field>
        <Field label={`${t('tt.helper.to')} (${zoneLabel(zone)})`}>{(id) => <input id={id} type="time" className={inputCls} value={to} onChange={(e) => e.target.value && setTo(e.target.value)} />}</Field>
      </div>
      <div aria-live="polite">
        {results.length === 0 ? (
          <p className="mt-4 text-muted">{t('tt.helper.none')}</p>
        ) : (
          <ul className="mt-4 divide-y divide-border/60">
            {results.map(({ ex, minutes, start, end }) => (
              <li key={ex.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2">
                <span className="font-semibold">{ex.shortName}</span>
                <span className="text-sm tabular-nums">
                  {t('tt.helper.minutes', { duration: fmtDuration(minutes * 60000) })}
                  <span className="text-muted"> · {t('tt.helper.window', { from: zonedTime(start, ex.timeZone), to: zonedTime(end, ex.timeZone) })}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-sm text-muted">{t('tt.helper.note')}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

export function Converter({ exchanges, now, zone }: { exchanges: Exchange[]; now: Date; zone: string }) {
  const [exId, setExId] = useState('nyse');
  const ex = exchanges.find((e) => e.id === exId) ?? exchanges[0];
  const [date, setDate] = useState(() => zonedDate(now, ex.timeZone));
  const [time, setTime] = useState('09:30');
  const r = convertLocalTime(date, time, ex.timeZone, zone);

  const [fromZone, setFromZone] = useState('America/New_York');
  const [toZone, setToZone] = useState(zone);
  const [anyTime, setAnyTime] = useState('16:00');
  const anyDate = zonedDate(now, fromZone);
  const r2 = convertLocalTime(anyDate, anyTime, fromZone, toZone);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={t('tt.convert.exchange')}>
            {(id) => (
              <select id={id} className={inputCls} value={exId} onChange={(e) => setExId(e.target.value)}>
                {exchanges.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.shortName}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label={t('tt.convert.date')}>{(id) => <input id={id} type="date" className={inputCls} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />}</Field>
          <Field label={t('tt.convert.time')}>{(id) => <input id={id} type="time" className={inputCls} value={time} onChange={(e) => e.target.value && setTime(e.target.value)} />}</Field>
        </div>
        <p className="mt-4 rounded-lg bg-surface-2 p-3 text-lg font-semibold tabular-nums" aria-live="polite">
          {t('tt.convert.result', { time: r.time, date: fmtDay(r.date, true), zone: zoneLabel(zone) })}
          <span className="text-sm font-normal text-muted">{dayShiftNote(r.dayShift)}</span>
        </p>
      </div>
      <div>
        <h3 className="font-semibold">{t('tt.convert.anyTitle')}</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <Field label={t('tt.convert.from')}>{(id) => <ZoneSelect id={id} value={fromZone} onChange={setFromZone} />}</Field>
          <Field label={t('tt.convert.time')}>{(id) => <input id={id} type="time" className={inputCls} value={anyTime} onChange={(e) => e.target.value && setAnyTime(e.target.value)} />}</Field>
          <Field label={t('tt.convert.to')}>{(id) => <ZoneSelect id={id} value={toZone} onChange={setToZone} />}</Field>
        </div>
        <p className="mt-4 rounded-lg bg-surface-2 p-3 text-lg font-semibold tabular-nums" aria-live="polite">
          {r2.time} <span className="text-sm font-normal text-muted">{zoneLabel(toZone)} · {fmtDay(r2.date, true)}</span>
          <span className="text-sm font-normal text-muted">{dayShiftNote(r2.dayShift)}</span>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

export function Holidays({ exchanges, now }: { exchanges: Exchange[]; now: Date }) {
  const [exId, setExId] = useState('wiener-boerse');
  const ex = exchanges.find((e) => e.id === exId) ?? exchanges[0];
  const today = zonedDate(now, ex.timeZone);
  const year = Number(today.slice(0, 4));

  return (
    <div>
      <div className="max-w-xs">
        <Field label={t('tt.holidays.exchange')}>
          {(id) => (
            <select id={id} className={inputCls} value={exId} onChange={(e) => setExId(e.target.value)}>
              {exchanges.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.shortName}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2" aria-live="polite">
        {[year, year + 1].map((y) => {
          const list = ex.holidays.filter((h) => h.date.startsWith(String(y)));
          return (
            <section key={y} aria-labelledby={`tt-hol-${y}`}>
              <h3 id={`tt-hol-${y}`} className="font-semibold">
                {y}
              </h3>
              {!ex.holidayYears.includes(y) ? (
                <p className="mt-2 text-sm text-[#9a4a00] dark:text-[#f0b44c]">⚠ {t('tt.holidays.none', { year: y, date: fmtDay(ex.asOf, true) })}</p>
              ) : (
                <ul className="mt-2 divide-y divide-border/60 text-sm">
                  {list.map((h) => (
                    <li key={h.date} className={`flex flex-wrap justify-between gap-x-3 py-1.5 ${h.date < today ? 'text-muted' : ''}`}>
                      <span className="tabular-nums">
                        {fmtDay(h.date)} {h.date < today && <span className="text-xs">({t('tt.holidays.past')})</span>}
                      </span>
                      <span className="text-right">
                        {h.name} ·{' '}
                        <strong className="font-semibold">
                          {h.earlyClose
                            ? t('tt.holidays.earlyClose', { time: h.earlyClose })
                            : h.lateOpen
                              ? t('tt.holidays.lateOpen', { time: h.lateOpen })
                              : h.halfDay
                                ? t('tt.holidays.halfDay')
                                : t('tt.holidays.closed')}
                        </strong>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
      {ex.notes && <p className="mt-4 text-sm text-muted">{ex.notes}</p>}
      <p className="mt-2 text-sm text-muted">
        {t('tt.holidays.asOf', { date: fmtDay(ex.asOf, true) })}{' '}
        <a href={ex.holidaysSource} rel="noopener">
          {new URL(ex.holidaysSource).hostname}
        </a>
        {(ex.extraSources ?? []).map((s) => (
          <span key={s.url}>
            {' · '}
            <a href={s.url} rel="noopener">
              {s.title}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

export function DstExplainer({ exchanges, now }: { exchanges: Exchange[]; now: Date }) {
  const year = Number(zonedDate(now, 'Europe/Vienna').slice(0, 4));
  const eu = dstTransitions('Europe/Vienna', year);
  const us = dstTransitions('America/New_York', year);
  const periods = gapPeriods('Europe/Vienna', 'America/New_York', year);
  const nyse = exchanges.find((e) => e.id === 'nyse');
  const day = (d: Date, z: string) => fmtDay(zonedDate(d, z), true);

  /** NYSE core session in Vienna time on the first weekday of a period. */
  const nyseInVienna = (from: Date, to: Date) => {
    if (!nyse) return '–';
    for (let ms = from.getTime() + 12 * 3600 * 1000; ms < to.getTime(); ms += 24 * 3600 * 1000) {
      const reg = regularOnly(daySchedule(nyse, zonedDate(new Date(ms), nyse.timeZone)).intervals)[0];
      if (reg) return `${zonedTime(reg.start, 'Europe/Vienna')}–${zonedTime(reg.end, 'Europe/Vienna')}`;
    }
    return '–';
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          [t('tt.dst.eu'), eu, 'Europe/Vienna'],
          [t('tt.dst.us'), us, 'America/New_York'],
        ].map(([label, tr, z]) => (
          <div key={label as string} className="rounded-lg bg-surface-2 p-3 text-sm">
            <p className="font-semibold">{label as string}</p>
            {(tr as ReturnType<typeof dstTransitions>).map((x) => (
              <p key={x.instant.toISOString()} className="tabular-nums">
                {x.offsetAfter > x.offsetBefore ? t('tt.dst.starts') : t('tt.dst.ends')}: {day(x.instant, z as string)}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[30rem] text-sm tabular-nums">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th scope="col" className="py-2 pr-3">
                {t('tt.dst.period')}
              </th>
              <th scope="col" className="py-2 pr-3">
                {t('tt.dst.gap')}
              </th>
              <th scope="col" className="py-2">
                {t('tt.dst.nyse')}
              </th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p, i) => {
              const short = p.gapMinutes !== -360;
              return (
                <tr key={p.from.toISOString()} className={`border-b border-border/60 ${short ? 'font-semibold' : ''}`}>
                  <td className="py-1.5 pr-3">
                    {day(p.from, 'Europe/Vienna')} – {i === periods.length - 1 ? fmtDay(`${year}-12-31`, true) : day(p.to, 'Europe/Vienna')}
                  </td>
                  <td className="py-1.5 pr-3">{t('tt.dst.hours', { n: Math.abs(p.gapMinutes) / 60 })}</td>
                  <td className="py-1.5">{nyseInVienna(p.from, p.to)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">{t('tt.dst.note')}</p>
    </div>
  );
}
