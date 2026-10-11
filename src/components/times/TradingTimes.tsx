/**
 * Trading Times tool (React island). Holds the viewer's time zone (remembered in localStorage as
 * "stockora-times-zone") and the ticking clock, and renders the individual tools.
 */
import { useEffect, useId, useMemo, useState } from 'react';
import { t } from '@/i18n';
import { readJSON, writeJSON } from '@/lib/storage';
import { zonedTime, type Exchange } from '@/lib/market-hours';
import { COMMON_ZONES, DEFAULT_ZONE, allZones, deviceZone, fmtDay, useNow, zoneLabel } from './shared';
import StatusGrid from './StatusGrid';
import Timeline from './Timeline';
import { Converter, DstExplainer, Holidays, TradeHelper } from './Tools';

const SECTIONS = ['status', 'timeline', 'helper', 'convert', 'holidays', 'dst'] as const;

export default function TradingTimes({ exchanges, asOf }: { exchanges: Exchange[]; asOf: string }) {
  const now = useNow(15000);
  const selectId = useId();
  const [zone, setZone] = useState(DEFAULT_ZONE);
  const device = useMemo(() => deviceZone(), []);
  const zones = useMemo(() => allZones(), []);

  useEffect(() => {
    const saved = readJSON<string | null>('times-zone', null);
    if (saved && zones.includes(saved)) setZone(saved);
  }, [zones]);

  const changeZone = (z: string) => {
    setZone(z);
    writeJSON('times-zone', z);
  };

  return (
    <div>
      {/* ---- Zone picker and clock (sticky so it stays visible while scrolling) ---- */}
      <div className="-mx-4 border-y border-border bg-bg/95 px-4 py-3 backdrop-blur sm:sticky sm:top-16 sm:z-20 sm:mx-0 sm:rounded-xl sm:border">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label htmlFor={selectId} className="flex min-w-60 flex-col gap-1 text-sm">
            <span className="font-semibold">{t('tt.zone')}</span>
            <select id={selectId} className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-text" value={zone} onChange={(e) => changeZone(e.target.value)}>
              {device && <option value={device}>{t('tt.zoneDevice', { zone: device.replace(/_/g, ' ') })}</option>}
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
          </label>
          <p className="text-lg font-semibold tabular-nums" aria-live="off">
            {t('tt.nowIn', { zone: zoneLabel(zone), time: zonedTime(now, zone) })}
          </p>
        </div>
        <nav aria-label={t('tt.title')} className="mt-2 flex gap-x-4 gap-y-1 overflow-x-auto text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <a key={s} href={`#tt-${s}`}>
              {t(`tt.nav.${s}`)}
            </a>
          ))}
        </nav>
      </div>

      <section id="tt-status" className="mt-8 scroll-mt-44" aria-labelledby="tt-status-title">
        <h2 id="tt-status-title" className="text-2xl font-bold tracking-tight">
          {t('tt.nav.status')}
        </h2>
        <div className="mt-4">
          <StatusGrid exchanges={exchanges} now={now} zone={zone} />
        </div>
      </section>

      <section id="tt-timeline" className="mt-14 scroll-mt-44" aria-labelledby="tt-timeline-title">
        <h2 id="tt-timeline-title" className="text-2xl font-bold tracking-tight">
          {t('tt.timeline.title')}
        </h2>
        <p className="mt-1 text-muted">{t('tt.timeline.lead', { zone: zone.replace(/_/g, ' ') })}</p>
        <div className="card mt-4 p-4 sm:p-5">
          <Timeline exchanges={exchanges} now={now} zone={zone} />
        </div>
      </section>

      <section id="tt-helper" className="mt-14 scroll-mt-44" aria-labelledby="tt-helper-title">
        <h2 id="tt-helper-title" className="text-2xl font-bold tracking-tight">
          {t('tt.helper.title')}
        </h2>
        <p className="mt-1 text-muted">{t('tt.helper.lead')}</p>
        <div className="card mt-4 p-4 sm:p-5">
          <TradeHelper exchanges={exchanges} now={now} zone={zone} />
        </div>
      </section>

      <section id="tt-convert" className="mt-14 scroll-mt-44" aria-labelledby="tt-convert-title">
        <h2 id="tt-convert-title" className="text-2xl font-bold tracking-tight">
          {t('tt.convert.title')}
        </h2>
        <p className="mt-1 text-muted">{t('tt.convert.lead')}</p>
        <div className="card mt-4 p-4 sm:p-5">
          <Converter exchanges={exchanges} now={now} zone={zone} />
        </div>
      </section>

      <section id="tt-holidays" className="mt-14 scroll-mt-44" aria-labelledby="tt-holidays-title">
        <h2 id="tt-holidays-title" className="text-2xl font-bold tracking-tight">
          {t('tt.holidays.title')}
        </h2>
        <p className="mt-1 text-muted">{t('tt.holidays.lead')}</p>
        <div className="card mt-4 p-4 sm:p-5">
          <Holidays exchanges={exchanges} now={now} />
        </div>
      </section>

      <section id="tt-dst" className="mt-14 scroll-mt-44" aria-labelledby="tt-dst-title">
        <h2 id="tt-dst-title" className="text-2xl font-bold tracking-tight">
          {t('tt.dst.title')}
        </h2>
        <p className="mt-1 max-w-3xl text-muted">{t('tt.dst.lead', { year: now.getUTCFullYear() })}</p>
        <div className="card mt-4 p-4 sm:p-5">
          <DstExplainer exchanges={exchanges} now={now} />
        </div>
      </section>

      <p className="mt-10 max-w-3xl text-sm text-muted">{t('tt.disclaimer', { date: fmtDay(asOf, true) })}</p>
    </div>
  );
}
