/** Home page widget: open/closed status of a few major exchanges, linking to the full tool. */
import { t } from '@/i18n';
import { statusAt, type Exchange } from '@/lib/market-hours';
import { STATE_STYLE, useNow } from './shared';

export default function MarketWidget({ exchanges, href }: { exchanges: Exchange[]; href: string }) {
  const now = useNow(30000);
  return (
    <div className="card flex h-full flex-col p-5">
      <p className="font-semibold">{t('home.widgets.market')}</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {exchanges.map((ex) => {
          const s = statusAt(ex, now);
          const style = STATE_STYLE[s.state];
          return (
            <li key={ex.id} className="flex items-center justify-between gap-2">
              <span>{ex.shortName}</span>
              <span className={`tt-badge ${style.cls}`}>
                <span aria-hidden="true">{style.symbol}</span> {t(`tt.state.${s.state}`)}
              </span>
            </li>
          );
        })}
      </ul>
      <a href={href} className="mt-auto pt-3 text-sm font-medium">
        {t('tt.title')} →
      </a>
    </div>
  );
}
