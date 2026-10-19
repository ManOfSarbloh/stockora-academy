/**
 * IPO pricing (bookbuilding) simulator for a fictional company. Slide the offer price within the
 * range and watch demand, coverage, money raised and allocations change. The order book is invented
 * for teaching; it does not describe any real IPO.
 */
import { useId, useMemo, useState } from 'react';
import { t } from '@/i18n';
import { allocate, demandAt, highestCoveredPrice, priceSteps, summarise, type BookOrder } from '@/lib/bookbuilding';
import { eurCents, eurShort, int, pct } from '@/lib/format';

export const BOOK: BookOrder[] = [
  { investor: 'Fund A', shares: 3_000_000, maxPrice: 23 },
  { investor: 'Fund B', shares: 2_500_000, maxPrice: 22 },
  { investor: 'Pension fund C', shares: 2_500_000, maxPrice: 22 },
  { investor: 'Insurer D', shares: 4_000_000, maxPrice: 21 },
  { investor: 'Fund E', shares: 3_500_000, maxPrice: 20.5 },
  { investor: 'Fund F', shares: 3_500_000, maxPrice: 20 },
  { investor: 'Hedge fund G', shares: 2_000_000, maxPrice: 19.5 },
  { investor: 'Fund H', shares: 4_000_000, maxPrice: 19 },
  { investor: 'Family office I', shares: 3_000_000, maxPrice: 18.5 },
  { investor: 'Fund J', shares: 3_000_000, maxPrice: 18 },
];

export const OFFER = { company: 'Alpenbyte AG', sharesBefore: 30_000_000, offered: 10_000_000, low: 18, high: 22, step: 0.5 };

// Chart geometry (SVG user units)
const W = 640;
const H = 300;
const M = { top: 16, right: 20, bottom: 44, left: 56 };
const PMIN = 17.5;
const PMAX = 23.5;
const QMAX = 35_000_000;
const x = (q: number) => M.left + (q / QMAX) * (W - M.left - M.right);
const y = (p: number) => M.top + ((PMAX - p) / (PMAX - PMIN)) * (H - M.top - M.bottom);

/** headingLevel: 3 inside a section of How Stocks Are Made, 2 on its own tool page. */
export default function BookbuildingSimulator({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const sliderId = useId();
  const prices = priceSteps(OFFER.low, OFFER.high, OFFER.step);
  const [price, setPrice] = useState(20);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const totalAfter = OFFER.sharesBefore + OFFER.offered;

  const s = summarise(BOOK, price, OFFER.offered, totalAfter);
  const alloc = useMemo(() => allocate(BOOK, price, OFFER.offered), [price]);
  const best = highestCoveredPrice(BOOK, OFFER.offered, OFFER.low, OFFER.high, OFFER.step);

  // Stepped demand curve: walk prices from high to low, demand grows as price falls.
  const curvePrices = priceSteps(PMIN, PMAX, OFFER.step).reverse();
  let path = '';
  curvePrices.forEach((p, i) => {
    const q = demandAt(BOOK, p);
    if (i === 0) path += `M ${x(q)} ${y(p)}`;
    else {
      path += ` L ${x(demandAt(BOOK, curvePrices[i - 1]))} ${y(p)} L ${x(q)} ${y(p)}`;
    }
  });

  const status = s.coverage < 1 ? 'under' : s.coverage < 1.5 ? 'thin' : 'strong';
  const shown = hoverPrice ?? price;

  function onPointer(e: React.PointerEvent<SVGSVGElement>, commit: boolean) {
    const svg = e.currentTarget;
    const r = svg.getBoundingClientRect();
    const py = ((e.clientY - r.top) / r.height) * H;
    const p = PMAX - ((py - M.top) / (H - M.top - M.bottom)) * (PMAX - PMIN);
    const snapped = Math.min(OFFER.high, Math.max(OFFER.low, Math.round(p / OFFER.step) * OFFER.step));
    if (commit) setPrice(snapped);
    else setHoverPrice(snapped);
  }

  return (
    <div className="card p-4 sm:p-6">
      <Heading className="text-lg font-bold">{t('book.title')}</Heading>
      <p className="mt-1 text-sm text-muted">{t('book.lead', { company: OFFER.company, offered: int(OFFER.offered), before: int(OFFER.sharesBefore), low: eurCents(OFFER.low), high: eurCents(OFFER.high) })}</p>

      <div className="mt-5">
        <label htmlFor={sliderId} className="flex items-baseline justify-between gap-3 font-semibold">
          <span>{t('book.offerPrice')}</span>
          <span className="text-2xl tabular-nums">{eurCents(price)}</span>
        </label>
        <input
          id={sliderId}
          type="range"
          className="mt-2 w-full accent-[var(--link)]"
          min={OFFER.low}
          max={OFFER.high}
          step={OFFER.step}
          value={price}
          aria-valuetext={eurCents(price)}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted tabular-nums" aria-hidden="true">
          {prices.filter((_, i) => i % 2 === 0).map((p) => (
            <span key={p}>€{p}</span>
          ))}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
        {[
          [t('book.demand'), `${int(s.demand)}`],
          [t('book.coverage'), `${s.coverage.toFixed(1)}×`],
          [t('book.raised'), eurShort(s.proceeds)],
          [t('book.marketCap'), eurShort(s.marketCap)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-surface-2 p-3">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className={`callout mt-4 ${status === 'under' ? 'callout-warning' : status === 'thin' ? 'callout-note' : 'callout-tip'}`} aria-live="polite">
        <p className="callout-title">{t(`book.status.${status}.title`)}</p>
        <p>
          {status === 'under'
            ? t('book.status.under.body', { sold: int(s.sold), offered: int(OFFER.offered) })
            : status === 'thin'
              ? t('book.status.thin.body', { fill: pct(s.fillRate, 0) })
              : t('book.status.strong.body', { fill: pct(s.fillRate, 0), unfilled: int(s.unfilled) })}
        </p>
        {best !== undefined && <p className="text-sm text-muted">{t('book.best', { price: eurCents(best) })}</p>}
      </div>

      {/* ---- Demand curve ---- */}
      <figure className="mt-5">
        <figcaption className="text-sm font-semibold">{t('book.chartTitle')}</figcaption>
        <p className="mt-1 min-h-5 text-sm text-muted" aria-hidden="true">
          {t('book.hover', { price: eurCents(shown), demand: int(demandAt(BOOK, shown)), cover: (demandAt(BOOK, shown) / OFFER.offered).toFixed(1) })}
        </p>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-1 h-auto w-full cursor-crosshair touch-none select-none"
          role="img"
          aria-label={t('book.chartLabel')}
          onPointerMove={(e) => onPointer(e, false)}
          onPointerLeave={() => setHoverPrice(null)}
          onPointerDown={(e) => onPointer(e, true)}
        >
          {/* price range band */}
          <rect x={M.left} y={y(OFFER.high)} width={W - M.left - M.right} height={y(OFFER.low) - y(OFFER.high)} fill="var(--surface-2)" />
          {/* gridlines + price ticks */}
          {[18, 19, 20, 21, 22, 23].map((p) => (
            <g key={p}>
              <line x1={M.left} x2={W - M.right} y1={y(p)} y2={y(p)} stroke="var(--chart-grid)" strokeWidth="1" />
              <text x={M.left - 8} y={y(p)} dy="0.32em" textAnchor="end" fontSize="12" fill="var(--muted)">
                €{p}
              </text>
            </g>
          ))}
          {/* quantity ticks */}
          {[0, 10, 20, 30].map((m) => (
            <text key={m} x={x(m * 1e6)} y={H - M.bottom + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">
              {m}m
            </text>
          ))}
          <text x={(M.left + W - M.right) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--muted)">
            {t('book.axisShares')}
          </text>
          {/* baseline */}
          <line x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} stroke="var(--border)" strokeWidth="1" />
          {/* shares offered */}
          <line x1={x(OFFER.offered)} x2={x(OFFER.offered)} y1={M.top} y2={H - M.bottom} stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={x(OFFER.offered) + 6} y={M.top + 10} fontSize="12" fill="var(--muted)">
            {t('book.offeredLabel')}
          </text>
          {/* demand curve */}
          <path d={path} fill="none" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" />
          <text x={x(demandAt(BOOK, PMIN)) + 8} y={y(PMIN + 0.25)} dy="0.32em" fontSize="12" fontWeight="600" fill="var(--text)">
            {t('book.demandLabel')}
          </text>
          {/* hover crosshair */}
          {hoverPrice !== null && <line x1={M.left} x2={W - M.right} y1={y(hoverPrice)} y2={y(hoverPrice)} stroke="var(--muted)" strokeWidth="1" />}
          {/* chosen price */}
          <line x1={M.left} x2={W - M.right} y1={y(price)} y2={y(price)} stroke="var(--text)" strokeWidth="1.5" />
          <circle cx={x(demandAt(BOOK, price))} cy={y(price)} r="5" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />
        </svg>
      </figure>

      {/* ---- Allocation table ---- */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-sm tabular-nums">
          <caption className="mb-2 text-left text-sm font-semibold">{t('book.tableCaption', { price: eurCents(price) })}</caption>
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th scope="col" className="py-2 pr-3 font-semibold">{t('book.investor')}</th>
              <th scope="col" className="py-2 pr-3 text-right font-semibold">{t('book.ordered')}</th>
              <th scope="col" className="py-2 pr-3 text-right font-semibold">{t('book.limit')}</th>
              <th scope="col" className="py-2 text-right font-semibold">{t('book.allocated')}</th>
            </tr>
          </thead>
          <tbody>
            {alloc.map((a, i) => (
              <tr key={a.investor} className={`border-b border-border/60 ${a.allocated === 0 ? 'text-muted' : ''}`}>
                <th scope="row" className="py-1.5 pr-3 text-left font-medium">{a.investor}</th>
                <td className="py-1.5 pr-3 text-right">{int(a.ordered)}</td>
                <td className="py-1.5 pr-3 text-right">{eurCents(BOOK[i].maxPrice)}</td>
                <td className="py-1.5 text-right">{a.allocated ? int(a.allocated) : t('book.none')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">{t('book.note')}</p>
    </div>
  );
}
