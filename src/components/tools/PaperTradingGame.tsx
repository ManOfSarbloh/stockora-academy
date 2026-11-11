/**
 * Paper-trading game (/tools/paper-trading): play money, invented companies, simulated prices.
 * All rules live in src/lib/paper-game.ts; this file is the interface. The game is saved in
 * localStorage ("stockora-paper-game") and the market is rebuilt from its seed.
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { t, type UiKey } from '@/i18n';
import { eurCents, int, pct } from '@/lib/format';
import { readJSON, remove, writeJSON } from '@/lib/storage';
import {
  GAME_LENGTHS,
  INSTRUMENTS,
  ORDER_FEE,
  START_CASH,
  advance,
  barIndex,
  benchmarkValues,
  cancelOrder,
  estimateCost,
  finish,
  instrument,
  newGame,
  placeOrder,
  portfolioValue,
  priceAt,
  randomSeed,
  simulateMarket,
  summarize,
  type GameState,
  type InstrumentId,
  type LogEntry,
  type OrderError,
  type OrderType,
  type Side,
} from '@/lib/paper-game';

const STORE_KEY = 'paper-game';
const name = (id: InstrumentId) => t(`pg.ins.${id}` as UiKey);
const signedPct = (f: number) => (f > 0 ? '+' : '') + pct(f);
const signedEur = (n: number) => (n > 0 ? '+' : '') + eurCents(n);
const gainClass = (n: number) => (n > 0 ? 'text-[#0b6b2b] dark:text-[#7fe08a]' : n < 0 ? 'text-[#b42318] dark:text-[#ff8a80]' : '');

export default function PaperTradingGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const [saved, setSaved] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const g = readJSON<GameState | null>(STORE_KEY, null);
    if (g && g.version === 1 && GAME_LENGTHS.includes(g.days as (typeof GAME_LENGTHS)[number])) setSaved(g);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (game) writeJSON(STORE_KEY, game);
  }, [game]);

  if (!loaded) return <div className="island-fallback h-[600px]" />;
  if (!game)
    return (
      <Setup
        saved={saved}
        onResume={() => setGame(saved)}
        onStart={(seed, days) => {
          remove(STORE_KEY);
          setGame(newGame(seed, days));
        }}
      />
    );
  return (
    <Play
      key={`${game.seed}-${game.days}`}
      game={game}
      setGame={setGame}
      onRestart={(seed, days) => setGame(newGame(seed, days))}
      onNew={() => {
        remove(STORE_KEY);
        setSaved(null);
        setGame(null);
      }}
    />
  );
}

function Disclaimer() {
  return <p className="on-surface rounded-xl border border-warn-border bg-warn-bg p-3 text-sm">{t('pg.disclaimer')}</p>;
}

function Setup({ saved, onResume, onStart }: { saved: GameState | null; onResume: () => void; onStart: (seed: number, days: number) => void }) {
  const [days, setDays] = useState<number>(120);
  const [seedText, setSeedText] = useState('');
  const [error, setError] = useState(false);
  const id = useId();
  const start = () => {
    const trimmed = seedText.trim();
    if (trimmed === '') return onStart(randomSeed(), days);
    const n = Number(trimmed);
    if (!Number.isInteger(n) || n < 1 || n > 99_999) return setError(true);
    onStart(n, days);
  };
  return (
    <div className="space-y-5">
      <Disclaimer />
      {saved && saved.day < saved.days && (
        <button type="button" className="btn btn-primary" onClick={onResume}>
          {t('pg.resume', { seed: saved.seed, day: saved.day, total: saved.days })}
        </button>
      )}
      <section className="card space-y-4 p-5" aria-labelledby={`${id}-h`}>
        <h2 id={`${id}-h`} className="text-xl font-bold">
          {t('pg.setup.title')}
        </h2>
        <p className="text-muted">{t('pg.setup.lead')}</p>
        <fieldset>
          <legend className="text-sm font-semibold">{t('pg.length')}</legend>
          <div className="mt-2 space-y-1.5">
            {GAME_LENGTHS.map((d) => (
              <label key={d} className="flex items-center gap-2">
                <input type="radio" name={`${id}-len`} checked={days === d} onChange={() => setDays(d)} className="accent-[var(--link)]" />
                {t(`pg.length.${d}` as UiKey)}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={`${id}-seed`} className="block text-sm font-semibold">
            {t('pg.seed')}
          </label>
          <input
            id={`${id}-seed`}
            inputMode="numeric"
            value={seedText}
            onChange={(e) => {
              setSeedText(e.target.value);
              setError(false);
            }}
            aria-describedby={`${id}-seed-help${error ? ` ${id}-seed-err` : ''}`}
            aria-invalid={error || undefined}
            className="mt-1 w-40 rounded-lg border border-border bg-surface px-3 py-1.5 tabular-nums"
          />
          <p id={`${id}-seed-help`} className="mt-1 text-xs text-muted">
            {t('pg.seed.help')}
          </p>
          {error && (
            <p id={`${id}-seed-err`} className="mt-1 text-sm font-semibold text-[#b42318] dark:text-[#ff8a80]">
              {t('pg.seed.err')}
            </p>
          )}
        </div>
        <button type="button" className="btn btn-primary" onClick={start}>
          {t('pg.start')}
        </button>
      </section>
    </div>
  );
}

function Play({
  game,
  setGame,
  onRestart,
  onNew,
}: {
  game: GameState;
  setGame: (g: GameState) => void;
  onRestart: (seed: number, days: number) => void;
  onNew: () => void;
}) {
  const market = useMemo(() => simulateMarket(game.seed, game.days), [game.seed, game.days]);
  const [selected, setSelected] = useState<InstrumentId>('world-etf');
  const [announce, setAnnounce] = useState('');
  const over = game.day >= game.days;
  const value = portfolioValue(game, market);
  const invested = value - game.cash;
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (over) resultRef.current?.focus();
  }, [over]);

  const step = (n: number) => {
    const g = advance(game, market, n);
    setGame(g);
    setAnnounce(t('pg.status', { day: g.day, value: eurCents(portfolioValue(g, market)) }));
  };

  return (
    <div className="space-y-6">
      <Disclaimer />
      <div className="card flex flex-wrap items-end justify-between gap-4 p-4">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
          <Stat label={t('pg.market', { seed: game.seed })} value={t('pg.day', { day: game.day, total: game.days })} />
          <Stat label={t('pg.cash')} value={eurCents(game.cash)} />
          <Stat label={t('pg.invested')} value={eurCents(invested)} />
          <Stat label={t('pg.total')} value={eurCents(value)} />
          <Stat label={t('pg.return')} value={signedPct(value / START_CASH - 1)} className={gainClass(value - START_CASH)} />
        </dl>
        {!over && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={() => step(1)}>
              {t('pg.next')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => step(5)}>
              {t('pg.week')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setGame(finish(game, market))}>
              {t('pg.finish')}
            </button>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {over && <Result game={game} market={market} headingRef={resultRef} onRestart={onRestart} onNew={onNew} />}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{t('pg.pick')}</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INSTRUMENTS.map((ins) => {
            const bar = priceAt(market, ins.id, game.day);
            const prev = market.bars[ins.id][barIndex(game.day) - 1];
            const change = bar.c / prev.c - 1;
            const held = game.positions[ins.id]?.qty ?? 0;
            const active = selected === ins.id;
            return (
              <label
                key={ins.id}
                className={`card flex cursor-pointer flex-col gap-1 border-2 p-3 transition-colors ${active ? 'border-link' : 'hover:border-link'}`}
              >
                <input type="radio" name="pg-instrument" className="sr-only" checked={active} onChange={() => setSelected(ins.id)} />
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{name(ins.id)}</span>
                  <span className="text-xs text-muted">{t(ins.kind === 'etf' ? 'pg.invented.fund' : 'pg.invented')}</span>
                </span>
                <span className="text-lg font-bold tabular-nums">{eurCents(bar.c)}</span>
                <span className={`text-sm tabular-nums ${gainClass(change)}`}>{t('pg.today', { change: signedPct(change) })}</span>
                <span className="text-xs text-muted">{t(`pg.insd.${ins.id}` as UiKey)}</span>
                {held > 0 && <span className="text-xs font-semibold text-link">{t('pg.held', { n: int(held) })}</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className={`grid gap-6 lg:items-start ${over ? "" : "lg:grid-cols-[minmax(0,1fr)_22rem]"}`}>
        <PriceChart game={game} market={market} id={selected} />
        {!over && <Ticket game={game} market={market} id={selected} setGame={setGame} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Holdings game={game} market={market} />
        <OpenOrders game={game} setGame={setGame} />
      </div>
      <Log log={game.log} />
    </div>
  );
}

function Stat({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`font-bold tabular-nums ${className}`}>{value}</dd>
    </div>
  );
}

function PriceChart({ game, market, id }: { game: GameState; market: ReturnType<typeof simulateMarket>; id: InstrumentId }) {
  const W = 640;
  const H = 260;
  const pad = { l: 8, r: 84, t: 14, b: 26 };
  const end = barIndex(game.day);
  const start = Math.max(0, end - 159);
  const closes = market.bars[id].slice(start, end + 1).map((b) => b.c);
  const lo = Math.min(...closes);
  const hi = Math.max(...closes);
  const span = hi - lo || 1;
  const x = (i: number) => pad.l + (i / Math.max(1, closes.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / span) * (H - pad.t - pad.b);
  const path = closes.map((c, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(c).toFixed(1)}`).join('');
  const toX = (day: number) => x(barIndex(day) - start);
  const fills = game.log.filter((e): e is Extract<LogEntry, { kind: 'fill' }> => e.kind === 'fill' && e.instrument === id);
  const news = game.log.filter((e) => e.kind === 'news' && (e.instrument === id || e.instrument === null));
  const startX = toX(0);
  return (
    <figure className="card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t('pg.chart.aria', { name: name(id), n: closes.length })}>
        {[lo, (lo + hi) / 2, hi].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--chart-grid)" strokeWidth="1" />
            <text x={W - pad.r + 6} y={y(v) + 5} fontSize="15" fill="var(--muted)">
              {eurCents(v)}
            </text>
          </g>
        ))}
        {startX >= pad.l && (
          <g>
            <line x1={startX} x2={startX} y1={pad.t} y2={H - pad.b} stroke="var(--muted)" strokeDasharray="4 4" strokeWidth="1" />
            <text x={startX + 4} y={H - 6} fontSize="15" fill="var(--muted)">
              {t('pg.chart.start')}
            </text>
          </g>
        )}
        <path d={path} fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" />
        {news.map((n, i) => {
          const cx = toX(n.day);
          const cy = y(market.bars[id][barIndex(n.day)].c);
          return <circle key={`n${i}`} cx={cx} cy={cy} r="5" fill="var(--surface)" stroke="var(--text)" strokeWidth="2" />;
        })}
        {fills.map((f, i) => {
          const cx = toX(f.day);
          const cy = y(f.price);
          const up = f.side === 'buy';
          const d = up ? `M${cx} ${cy - 2}l6 10h-12z` : `M${cx} ${cy + 2}l6 -10h-12z`;
          return (
            <path key={`f${i}`} d={d} fill={up ? 'var(--link)' : 'var(--cta)'} stroke="var(--surface)" strokeWidth="1.5">
              <title>{`${t(up ? 'pg.chart.buy' : 'pg.chart.sell')}: ${int(f.qty)} × ${eurCents(f.price)}`}</title>
            </path>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs text-muted">{t('pg.chartLegend')}</figcaption>
    </figure>
  );
}

const ERROR_KEY: Record<OrderError, UiKey> = { qty: 'pg.err.qty', price: 'pg.err.price', cash: 'pg.err.cash', shares: 'pg.err.shares', over: 'pg.err.over' };

function Ticket({
  game,
  market,
  id,
  setGame,
}: {
  game: GameState;
  market: ReturnType<typeof simulateMarket>;
  id: InstrumentId;
  setGame: (g: GameState) => void;
}) {
  const uid = useId();
  const [side, setSide] = useState<Side>('buy');
  const [type, setType] = useState<OrderType>('market');
  const [qtyText, setQtyText] = useState('10');
  const [priceText, setPriceText] = useState('');
  const [error, setError] = useState<OrderError | null>(null);
  const [done, setDone] = useState(false);
  const close = priceAt(market, id, game.day).c;
  const held = game.positions[id]?.qty ?? 0;

  useEffect(() => {
    setError(null);
    setDone(false);
    setPriceText('');
    if (side === 'buy' && type === 'stop') setType('market');
  }, [id, side]);

  const qty = Number(qtyText);
  const price = Number(priceText.replace(',', '.'));
  const needsPrice = type !== 'market';
  const maxBuy = Math.max(0, Math.floor((game.cash - ORDER_FEE) / (needsPrice && price > 0 ? price : close * (1 + instrument(id).spread / 2))));
  const est =
    Number.isInteger(qty) && qty > 0 && (!needsPrice || price > 0)
      ? side === 'buy'
        ? estimateCost(market, game.day, id, qty, needsPrice ? price : undefined)
        : qty * (needsPrice ? price : close * (1 - instrument(id).spread / 2)) - ORDER_FEE
      : null;

  const submit = () => {
    const r = placeOrder(game, market, { instrument: id, side, type, qty, price: needsPrice ? price : undefined });
    setError(r.error);
    setDone(!r.error);
    if (!r.error) setGame(r.state);
  };
  const helpKey: UiKey = type === 'market' ? 'pg.help.market' : type === 'stop' ? 'pg.help.stop' : side === 'buy' ? 'pg.help.limit.buy' : 'pg.help.limit.sell';
  const types: OrderType[] = side === 'buy' ? ['market', 'limit'] : ['market', 'limit', 'stop'];

  return (
    <section className="card space-y-3 p-4" aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`} className="text-lg font-bold">
        {t('pg.ticket')}: {name(id)}
      </h2>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={`${t('pg.buy')} / ${t('pg.sell')}`}>
        {(['buy', 'sell'] as Side[]).map((s) => (
          <label
            key={s}
            className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-center font-semibold ${side === s ? 'border-link' : 'border-border hover:border-link'}`}
          >
            <input type="radio" name={`${uid}-side`} className="sr-only" checked={side === s} onChange={() => setSide(s)} />
            {t(s === 'buy' ? 'pg.buy' : 'pg.sell')}
          </label>
        ))}
      </div>
      <div>
        <label htmlFor={`${uid}-type`} className="block text-sm font-semibold">
          {t('pg.type')}
        </label>
        <select
          id={`${uid}-type`}
          value={type}
          onChange={(e) => {
            setType(e.target.value as OrderType);
            setError(null);
            setDone(false);
          }}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1.5"
        >
          {types.map((o) => (
            <option key={o} value={o}>
              {t(`pg.type.${o}` as UiKey)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted">{t(helpKey)}</p>
      </div>
      <div>
        <label htmlFor={`${uid}-qty`} className="block text-sm font-semibold">
          {t('pg.qty')}
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id={`${uid}-qty`}
            inputMode="numeric"
            value={qtyText}
            onChange={(e) => {
              setQtyText(e.target.value);
              setError(null);
              setDone(false);
            }}
            aria-invalid={error === 'qty' || error === 'cash' || error === 'shares' || undefined}
            className="w-28 rounded-lg border border-border bg-surface px-3 py-1.5 tabular-nums"
          />
          <button type="button" className="text-sm font-semibold text-link underline" onClick={() => setQtyText(String(side === 'buy' ? maxBuy : held))}>
            {t('pg.max', { n: int(side === 'buy' ? maxBuy : held) })}
          </button>
        </div>
      </div>
      {needsPrice && (
        <div>
          <label htmlFor={`${uid}-px`} className="block text-sm font-semibold">
            {t(type === 'stop' ? 'pg.price.stop' : 'pg.price.limit')}
          </label>
          <input
            id={`${uid}-px`}
            inputMode="decimal"
            value={priceText}
            placeholder={close.toFixed(2)}
            onChange={(e) => {
              setPriceText(e.target.value);
              setError(null);
              setDone(false);
            }}
            aria-invalid={error === 'price' || undefined}
            className="mt-1 w-32 rounded-lg border border-border bg-surface px-3 py-1.5 tabular-nums"
          />
        </div>
      )}
      {est != null && (
        <p className="text-sm text-muted">
          {t(side === 'buy' ? 'pg.estimate.buy' : 'pg.estimate.sell', { amount: eurCents(est), fee: eurCents(ORDER_FEE) })}
        </p>
      )}
      <button type="button" className="btn btn-primary w-full justify-center" onClick={submit}>
        {t('pg.place')}
      </button>
      <p aria-live="polite" className="text-sm">
        {error && <span className="font-semibold text-[#b42318] dark:text-[#ff8a80]">{t(ERROR_KEY[error])}</span>}
        {done && <span>{t('pg.placed')}</span>}
      </p>
    </section>
  );
}

function Holdings({ game, market }: { game: GameState; market: ReturnType<typeof simulateMarket> }) {
  const rows = (Object.entries(game.positions) as [InstrumentId, { qty: number; cost: number }][]).filter(([, p]) => p.qty > 0);
  return (
    <section className="card p-4" aria-labelledby="pg-holdings">
      <h2 id="pg-holdings" className="text-lg font-bold">
        {t('pg.holdings')}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t('pg.holdings.none')}</p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="py-1 pr-2 font-semibold">{t('pg.col.name')}</th>
                <th className="py-1 pr-2 text-right font-semibold">{t('pg.col.qty')}</th>
                <th className="hidden py-1 pr-2 text-right font-semibold sm:table-cell">{t('pg.col.avg')}</th>
                <th className="py-1 pr-2 text-right font-semibold">{t('pg.col.value')}</th>
                <th className="py-1 text-right font-semibold">{t('pg.col.gain')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([id, p]) => {
                const v = p.qty * priceAt(market, id, game.day).c;
                return (
                  <tr key={id} className="border-t border-border">
                    <td className="py-1.5 pr-2">{name(id)}</td>
                    <td className="py-1.5 pr-2 text-right whitespace-nowrap tabular-nums">{int(p.qty)}</td>
                    <td className="hidden py-1.5 pr-2 text-right whitespace-nowrap tabular-nums sm:table-cell">{eurCents(p.cost / p.qty)}</td>
                    <td className="py-1.5 pr-2 text-right whitespace-nowrap tabular-nums">{eurCents(v)}</td>
                    <td className={`py-1.5 text-right whitespace-nowrap tabular-nums ${gainClass(v - p.cost)}`}>{signedEur(v - p.cost)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function OpenOrders({ game, setGame }: { game: GameState; setGame: (g: GameState) => void }) {
  return (
    <section className="card p-4" aria-labelledby="pg-orders">
      <h2 id="pg-orders" className="text-lg font-bold">
        {t('pg.orders')}
      </h2>
      {game.orders.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t('pg.orders.none')}</p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="py-1 pr-2 font-semibold">{t('pg.col.name')}</th>
                <th className="py-1 pr-2 font-semibold">{t('pg.col.type')}</th>
                <th className="py-1 pr-2 text-right font-semibold">{t('pg.col.qty')}</th>
                <th className="py-1 pr-2 text-right font-semibold">{t('pg.col.price')}</th>
                <th className="py-1">
                  <span className="sr-only">{t('pg.cancel')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {game.orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="py-1.5 pr-2">{name(o.instrument)}</td>
                  <td className="py-1.5 pr-2">
                    {t(o.side === 'buy' ? 'pg.buy' : 'pg.sell')} · {t(`pg.type.${o.type}` as UiKey)}
                  </td>
                  <td className="py-1.5 pr-2 text-right whitespace-nowrap tabular-nums">{int(o.qty)}</td>
                  <td className="py-1.5 pr-2 text-right whitespace-nowrap tabular-nums">{o.price != null ? eurCents(o.price) : '–'}</td>
                  <td className="py-1.5 text-right">
                    <button
                      type="button"
                      className="text-sm font-semibold text-link underline"
                      aria-label={t('pg.cancel.aria', { n: o.id })}
                      onClick={() => setGame(cancelOrder(game, o.id))}
                    >
                      {t('pg.cancel')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function logText(e: LogEntry): string {
  switch (e.kind) {
    case 'news':
      return t(`pg.news.${e.key}` as UiKey, { name: e.instrument ? name(e.instrument) : '' });
    case 'fill':
      return e.side === 'buy'
        ? t('pg.log.buy', { qty: int(e.qty), name: name(e.instrument), price: eurCents(e.price), fee: eurCents(e.fee) })
        : t('pg.log.sell', { qty: int(e.qty), name: name(e.instrument), price: eurCents(e.price), fee: eurCents(e.fee), gain: signedEur(e.gain ?? 0) });
    case 'rejected':
      return t(e.reason === 'cash' ? 'pg.log.rejected.cash' : 'pg.log.rejected.shares', { qty: int(e.qty), name: name(e.instrument) });
    case 'dividend':
      return t('pg.log.dividend', { name: name(e.instrument), gross: eurCents(e.gross), qty: int(e.qty), tax: eurCents(e.tax) });
  }
}

function Log({ log }: { log: LogEntry[] }) {
  const recent = log.slice(-15).reverse();
  return (
    <section className="card p-4" aria-labelledby="pg-log">
      <h2 id="pg-log" className="text-lg font-bold">
        {t('pg.log')}
      </h2>
      {recent.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t('pg.log.none')}</p>
      ) : (
        <>
          <ol className="mt-2 space-y-1.5 text-sm">
            {recent.map((e, i) => (
              <li key={`${e.day}-${i}`} className="flex gap-3">
                <span className="w-16 shrink-0 text-muted tabular-nums">{t('pg.log.day', { day: e.day })}</span>
                <span className={e.kind === 'news' ? 'font-semibold' : ''}>{logText(e)}</span>
              </li>
            ))}
          </ol>
          {log.some((e) => e.kind === 'news') && <p className="mt-3 text-xs text-muted">{t('pg.log.newsHint')}</p>}
        </>
      )}
    </section>
  );
}

function Result({
  game,
  market,
  headingRef,
  onRestart,
  onNew,
}: {
  game: GameState;
  market: ReturnType<typeof simulateMarket>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: (seed: number, days: number) => void;
  onNew: () => void;
}) {
  const s = summarize(game, market);
  const bench = benchmarkValues(market);
  const beat = s.final > s.benchmark;
  const W = 640;
  const H = 180;
  const all = [...game.values, ...bench];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const x = (i: number) => 8 + (i / game.days) * (W - 16 - 110);
  const y = (v: number) => 10 + (1 - (v - lo) / (hi - lo || 1)) * (H - 20);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  return (
    <section className="card space-y-4 border-2 border-link p-5" aria-labelledby="pg-result">
      <h2 id="pg-result" ref={headingRef} tabIndex={-1} className="text-xl font-bold">
        {t('pg.end.title')}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">{t('pg.end.you')}</p>
          <p className={`text-2xl font-bold tabular-nums ${gainClass(s.final - START_CASH)}`}>
            {eurCents(s.final)} ({signedPct(s.returnPct)})
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">{t('pg.end.bench')}</p>
          <p className={`text-2xl font-bold tabular-nums ${gainClass(s.benchmark - START_CASH)}`}>
            {eurCents(s.benchmark)} ({signedPct(s.benchmarkPct)})
          </p>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${t('pg.end.you')}: ${eurCents(s.final)}; ${t('pg.end.bench')}: ${eurCents(s.benchmark)}`}>
        <line x1="8" x2={W - 118} y1={y(START_CASH)} y2={y(START_CASH)} stroke="var(--chart-grid)" />
        <path d={line(bench)} fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="6 4" />
        <path d={line(game.values)} fill="none" stroke="var(--teal)" strokeWidth="2.5" />
        <text x={W - 104} y={y(game.values.at(-1)!) + 4} fontSize="12" fill="var(--text)">
          {t('pg.end.you')}
        </text>
        <text x={W - 104} y={y(bench.at(-1)!) + 4} fontSize="12" fill="var(--muted)">
          ETF
        </text>
      </svg>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <Row label={t('pg.end.drawdown')} value={pct(s.drawdown)} />
        <Row label={t('pg.end.trades')} value={int(s.trades)} />
        <Row label={t('pg.end.fees')} value={eurCents(s.fees)} />
        <Row label={t('pg.end.realized')} value={signedEur(s.realized)} />
        <Row label={t('pg.end.tax')} value={eurCents(s.taxEstimate)} />
        <Row label={t('pg.end.divTax')} value={eurCents(s.dividendTax)} />
      </dl>
      <ul className="list-disc space-y-1 pl-5">
        <li>{t(beat ? 'pg.end.beat' : 'pg.end.lost')}</li>
        {s.trades > 0 && <li>{t('pg.end.feesNote', { fees: eurCents(s.fees), pct: pct(s.fees / START_CASH) })}</li>}
        {s.drawdown < -0.05 && <li>{t('pg.end.ddNote', { pct: pct(-s.drawdown) })}</li>}
      </ul>
      <p className="text-xs text-muted">{t('pg.end.taxNote')}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => onRestart(game.seed, game.days)}>
          {t('pg.again')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onNew}>
          {t('pg.newMarket')}
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border py-1">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

