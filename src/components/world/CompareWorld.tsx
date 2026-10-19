/**
 * World Markets comparison: sortable, filterable tables and a "compare two countries" picker.
 * All data is passed in at build time from the country files; nothing is fetched.
 */
import { useMemo, useState } from 'react';

export interface CompareRow {
  code: string;
  name: string;
  href: string;
  region: string;
  regionLabel: string;
  currency: string;
  ftse: string;
  listedCompanies: number | null;
  listedYear: number | null;
  marketCapUsd: number | null;
  marketCapYear: number | null;
  marketCapPctGdp: number | null;
  settlement: string;
  csd: string;
  exchanges: { name: string; hours: string; timeZone: string; hoursSource: string }[];
  index: string;
  indexConstituents: string;
  regulators: string;
  rules: string[];
  taxGlance: string;
  taxAsOf: string;
}

type Table = 'overview' | 'hours' | 'taxes' | 'rules';
type SortKey = 'name' | 'listedCompanies' | 'marketCapUsd' | 'marketCapPctGdp' | 'ftse' | 'settlement';

const FTSE_RANK: Record<string, number> = { Developed: 0, 'Advanced Emerging': 1, 'Secondary Emerging': 2, Frontier: 3, Unclassified: 4 };

function usd(v: number | null) {
  if (v === null) return '–';
  return v >= 1e12 ? `$${(v / 1e12).toFixed(2)} tn` : `$${Math.round(v / 1e9)} bn`;
}

export default function CompareWorld({ rows, base }: { rows: CompareRow[]; base: string }) {
  const [table, setTable] = useState<Table>('overview');
  const [region, setRegion] = useState('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'name', dir: 1 });
  const [a, setA] = useState(rows[0]?.code ?? '');
  const [b, setB] = useState(rows[1]?.code ?? '');

  const regions = useMemo(() => [...new Map(rows.map((r) => [r.region, r.regionLabel])).entries()], [rows]);

  const shown = useMemo(() => {
    const list = rows.filter((r) => region === 'all' || r.region === region);
    const val = (r: CompareRow): string | number => {
      switch (sort.key) {
        case 'name':
          return r.name;
        case 'ftse':
          return FTSE_RANK[r.ftse] ?? 9;
        case 'settlement':
          return r.settlement;
        default:
          return r[sort.key] ?? -1;
      }
    };
    return [...list].sort((x, y) => {
      const vx = val(x);
      const vy = val(y);
      const c = typeof vx === 'number' && typeof vy === 'number' ? vx - vy : String(vx).localeCompare(String(vy));
      return c * sort.dir;
    });
  }, [rows, region, sort]);

  const sortBy = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key ? ((-s.dir) as 1 | -1) : key === 'name' ? 1 : -1 }));
  const th = (key: SortKey, label: string, num = false) => (
    <th scope="col" className={`py-2 pr-3 ${num ? 'text-right' : ''}`} aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => sortBy(key)} className="font-semibold hover:text-link">
        {label}
        <span aria-hidden="true" className="ml-1 text-xs">
          {sort.key === key ? (sort.dir === 1 ? '▲' : '▼') : '↕'}
        </span>
      </button>
    </th>
  );
  const link = (r: CompareRow) => (
    <a href={`${base}${r.href.replace(/^\//, '')}/`} className="font-semibold">
      {r.name}
    </a>
  );

  const ca = rows.find((r) => r.code === a);
  const cb = rows.find((r) => r.code === b);
  const facts: [string, (r: CompareRow) => string][] = [
    ['Region', (r) => r.regionLabel],
    ['Currency', (r) => r.currency],
    ['FTSE Russell classification', (r) => r.ftse],
    ['Listed domestic companies', (r) => (r.listedCompanies === null ? '–' : `${r.listedCompanies.toLocaleString('en-GB')} (${r.listedYear})`)],
    ['Market capitalisation', (r) => (r.marketCapUsd === null ? '–' : `${usd(r.marketCapUsd)} (${r.marketCapYear})`)],
    ['Main index', (r) => `${r.index}${r.indexConstituents ? ` (${r.indexConstituents})` : ''}`],
    ['Main exchange hours', (r) => `${r.exchanges[0].hours} (${r.exchanges[0].timeZone})`],
    ['Settlement', (r) => r.settlement],
    ['Regulators', (r) => r.regulators],
    ['Taxes at a glance', (r) => r.taxGlance],
  ];

  return (
    <div>
      <section aria-labelledby="two-title" className="card p-5">
        <h2 id="two-title" className="text-xl font-bold">
          Compare two countries
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm">
            <span className="sr-only">First country</span>
            <select value={a} onChange={(e) => setA(e.target.value)} className="rounded-md border border-border bg-surface px-3 py-2">
              {rows.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <span className="text-muted">vs</span>
          <label className="text-sm">
            <span className="sr-only">Second country</span>
            <select value={b} onChange={(e) => setB(e.target.value)} className="rounded-md border border-border bg-surface px-3 py-2">
              {rows.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {ca && cb && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="w-48 py-2 pr-3 text-muted"></th>
                  <th scope="col" className="py-2 pr-3">
                    {link(ca)}
                  </th>
                  <th scope="col" className="py-2">
                    {link(cb)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {facts.map(([label, f]) => (
                  <tr key={label} className="border-b border-border/60 align-top">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-muted">
                      {label}
                    </th>
                    <td className="py-2 pr-3">{f(ca)}</td>
                    <td className="py-2">{f(cb)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="tables-title" className="mt-12">
        <h2 id="tables-title" className="text-xl font-bold">
          Comparison tables
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Table">
          {(
            [
              ['overview', 'Overview'],
              ['hours', 'Trading hours'],
              ['taxes', 'Taxes'],
              ['rules', 'Market rules'],
            ] as [Table, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={table === id}
              onClick={() => setTable(id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${table === id ? 'border-link bg-link text-[var(--bg)]' : 'border-border hover:border-link'}`}
            >
              {label}
            </button>
          ))}
          </div>
          <label className="ml-auto text-sm">
            <span className="mr-2 text-muted">Region</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-md border border-border bg-surface px-2 py-1.5">
              <option value="all">All</option>
              {regions.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          {table === 'overview' && (
            <table className="w-full min-w-[48rem] text-sm tabular-nums">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  {th('name', 'Country')}
                  {th('ftse', 'FTSE class')}
                  {th('listedCompanies', 'Listed companies', true)}
                  {th('marketCapUsd', 'Market cap', true)}
                  {th('marketCapPctGdp', '% of GDP', true)}
                  {th('settlement', 'Settlement')}
                  <th scope="col" className="py-2">
                    Main index
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.code} className="border-b border-border/60">
                    <td className="py-2 pr-3">{link(r)}</td>
                    <td className="py-2 pr-3">{r.ftse}</td>
                    <td className="py-2 pr-3 text-right">
                      {r.listedCompanies === null ? '–' : r.listedCompanies.toLocaleString('en-GB')}
                      {r.listedYear !== null && <span className="ml-1 text-xs text-muted">{r.listedYear}</span>}
                    </td>
                    <td className="py-2 pr-3 text-right">{usd(r.marketCapUsd)}</td>
                    <td className="py-2 pr-3 text-right">{r.marketCapPctGdp === null ? '–' : `${Math.round(r.marketCapPctGdp)}%`}</td>
                    <td className="py-2 pr-3">{r.settlement}</td>
                    <td className="py-2">{r.index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {table === 'hours' && (
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  {th('name', 'Country')}
                  <th scope="col" className="py-2 pr-3">
                    Exchange
                  </th>
                  <th scope="col" className="py-2 pr-3">
                    Regular hours (local time)
                  </th>
                  <th scope="col" className="py-2">
                    Time zone
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.flatMap((r) =>
                  r.exchanges.map((e, i) => (
                    <tr key={r.code + e.name} className="border-b border-border/60 align-top">
                      <td className="py-2 pr-3">{i === 0 ? link(r) : ''}</td>
                      <td className="py-2 pr-3">
                        <a href={e.hoursSource} rel="noopener">
                          {e.name}
                        </a>
                      </td>
                      <td className="py-2 pr-3">{e.hours}</td>
                      <td className="py-2">{e.timeZone}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          )}
          {table === 'taxes' && (
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  {th('name', 'Country')}
                  <th scope="col" className="py-2 pr-3">
                    At a glance
                  </th>
                  <th scope="col" className="py-2">
                    As of
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.code} className="border-b border-border/60 align-top">
                    <td className="py-2 pr-3">{link(r)}</td>
                    <td className="py-2 pr-3">{r.taxGlance}</td>
                    <td className="py-2 whitespace-nowrap">{r.taxAsOf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {table === 'rules' && (
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  {th('name', 'Country')}
                  <th scope="col" className="py-2">
                    Rules that differ (details on each country page)
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.code} className="border-b border-border/60 align-top">
                    <td className="py-2 pr-3">{link(r)}</td>
                    <td className="py-2">{r.rules.length ? r.rules.join(' · ') : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
