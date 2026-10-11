/** Live status cards: one per exchange, grouped by region, with a countdown to the next change. */
import { t } from '@/i18n';
import { statusAt, zonedTime, type Exchange, type Status } from '@/lib/market-hours';
import { STATE_STYLE, fmtDay, fmtDuration } from './shared';

const REGIONS = ['europe', 'americas', 'asia-pacific', 'middle-east-africa'] as const;

function stateLabel(s: Status): string {
  if (s.state === 'holiday' && s.day.holiday) return `${t('tt.state.holiday')}: ${s.day.holiday.name}`;
  if (s.interval?.label) return s.interval.label;
  if (s.state === 'auction' && s.interval) return s.interval.type === 'auction-open' ? t('tt.auction.open') : t('tt.auction.close');
  return t(`tt.state.${s.state}`);
}

function nextLabel(s: Status, now: Date, zone: string): string | null {
  if (!s.nextChange || !s.nextState) return null;
  const ms = s.nextChange.getTime() - now.getTime();
  const what = s.nextState === 'closed' ? t('tt.what.closed') : t(`tt.what.${s.nextState}`);
  if (ms < 24 * 3600 * 1000) return t('tt.next', { what, time: fmtDuration(ms) });
  // More than a day away: show the day and time in the viewer's zone.
  const when = `${fmtDay(new Intl.DateTimeFormat('en-CA', { timeZone: zone }).format(s.nextChange))} ${zonedTime(s.nextChange, zone)}`;
  return t('tt.nextAt', { what, when });
}

export default function StatusGrid({ exchanges, now, zone }: { exchanges: Exchange[]; now: Date; zone: string }) {
  return (
    <div className="space-y-6">
      {REGIONS.map((r) => {
        const list = exchanges.filter((e) => e.region === r);
        if (!list.length) return null;
        return (
          <section key={r} aria-labelledby={`tt-region-${r}`}>
            <h3 id={`tt-region-${r}`} className="text-sm font-semibold tracking-wide text-muted uppercase">
              {t(`tt.region.${r}`)}
            </h3>
            <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((ex) => {
                const s = statusAt(ex, now);
                const style = STATE_STYLE[s.state];
                const next = nextLabel(s, now, zone);
                const year = Number(s.localDate.slice(0, 4));
                const warnings = [
                  s.day.holidaysUnknown && t('tt.warn.holidaysUnknown', { year }),
                  s.day.halfDayHoursUnknown && t('tt.warn.halfDay'),
                  s.state === 'unknown' && ex.sessionsValidUntil && t('tt.warn.hoursUnconfirmed', { date: fmtDay(ex.sessionsValidUntil, true) }),
                ].filter(Boolean) as string[];
                return (
                  <li key={ex.id} className="card flex flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold" title={ex.name}>
                          {ex.shortName}
                        </p>
                        <p className="text-xs text-muted tabular-nums">{t('tt.localTime', { time: s.localTime })}</p>
                      </div>
                      <span className={`tt-badge ${style.cls}`}>
                        <span aria-hidden="true">{style.symbol}</span> {stateLabel(s)}
                      </span>
                    </div>
                    {next && <p className="text-sm tabular-nums">{next}</p>}
                    {warnings.map((w) => (
                      <p key={w} className="text-xs text-[#9a4a00] dark:text-[#f0b44c]">
                        ⚠ {w}
                      </p>
                    ))}
                    <p className="mt-auto flex flex-wrap gap-x-3 text-xs">
                      <a href={ex.hoursSource} rel="noopener">
                        {t('tt.sources')}
                      </a>
                      <a href={ex.holidaysSource} rel="noopener">
                        {t('tt.holidaySource')}
                      </a>
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
