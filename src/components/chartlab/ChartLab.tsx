/**
 * Chart Lab: an educational chart sandbox with SIMULATED prices. Chart types, timeframes,
 * log scale, volume, indicators, drawing tools, crosshair, replay, a "next candle" game,
 * a click-any-candle explainer and two guided tours. No signals, no real market data.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '@/i18n';
import { SCENARIOS, SESSION_MINUTES, aggregate, heikinAshi, simulate, type Candle, type Scenario, type Timeframe } from '@/lib/chart/core';
import { bollinger, ema, macd, rsi, sma, vwap } from '@/lib/chart/indicators';
import { anatomy, explain } from '@/lib/chart/patterns';
import { exampleSeries, type PatternDef } from '@/lib/chart/examples';
import { windowEndingAt } from '@/lib/chart/viewport';
import { url } from '@/lib/url';
import ChartCanvas, { type ChartType, type Drawing, type Overlay, type Pane, type Tool } from './ChartCanvas';

interface PatternInfo extends PatternDef {
  formation: string;
}

const TIMEFRAMES: Timeframe[] = ['5m', '15m', '1h', 'D', 'W'];
const TYPES: ChartType[] = ['candle', 'bar', 'line', 'ha'];
const TOOLS: Tool[] = ['none', 'trend', 'hline', 'rect', 'fib', 'measure'];
const pad = (n: number) => String(n).padStart(2, '0');

function timeLabelFor(tf: Timeframe | 'pattern') {
  return (c: Candle) => {
    if (tf === 'pattern' || tf === 'D') return `Day ${c.day + 1}`;
    if (tf === 'W') return `Week ${Math.floor(c.day / 5) + 1}`;
    const m = 570 + (c.t - c.day * SESSION_MINUTES);
    return `D${c.day + 1} ${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  };
}

interface TourStep {
  target: string;
  text: string;
  lines?: number[];
  select?: number;
}

const btn = (on: boolean) => `rounded-lg border px-2.5 py-1 text-sm transition-colors ${on ? 'border-link bg-link/10 font-semibold text-link' : 'border-border hover:border-link'}`;

export default function ChartLab({ patterns }: { patterns: PatternInfo[] }) {
  // ---- data ----
  const [scenario, setScenario] = useState<Scenario>('uptrend');
  const [seed, setSeed] = useState(7);
  const [patternId, setPatternId] = useState<string | null>(null);
  const [tf, setTf] = useState<Timeframe>('D');
  const [chartType, setChartType] = useState<ChartType>('candle');
  const [log, setLog] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [ind, setInd] = useState({ sma: true, smaLen: 20, ema: false, emaLen: 50, bb: false, vwap: false, rsi: false, macd: false });
  const [tool, setTool] = useState<Tool>('none');
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  // Fewer candles on narrow screens, so each one stays readable.
  const [size, setSize] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 50 : 100));
  const [end, setEnd] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [replay, setReplay] = useState<{ on: boolean; cursor: number; playing: boolean; speed: number }>({ on: false, cursor: 0, playing: false, speed: 600 });
  const [game, setGame] = useState({ total: 0, correct: 0, streak: 0, last: '' as '' | 'right' | 'wrong' });
  const [tour, setTour] = useState<{ kind: 'ui' | 'read'; step: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // A pattern can be opened from the encyclopedia with ?pattern=<id>.
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('pattern');
    if (id && patterns.some((p) => p.id === id)) setPatternId(id);
  }, [patterns]);

  // Keep the address in sync, so a reload or a shared link shows the same pattern (or none).
  useEffect(() => {
    const u = new URL(location.href);
    if (patternId) u.searchParams.set('pattern', patternId);
    else u.searchParams.delete('pattern');
    history.replaceState(null, '', u);
  }, [patternId]);

  const pattern = patterns.find((p) => p.id === patternId) ?? null;
  const base = useMemo(() => (pattern ? null : simulate(scenario, { days: 160, seed })), [scenario, seed, pattern]);
  const all = useMemo<Candle[]>(() => (pattern ? exampleSeries(pattern, 8).candles : aggregate(base!, tf)), [base, tf, pattern]);
  const count = replay.on ? Math.min(all.length, replay.cursor + 1) : all.length;
  const candles = useMemo(() => all.slice(0, count), [all, count]);
  const display = useMemo(() => (chartType === 'ha' ? heikinAshi(candles) : candles), [candles, chartType]);
  const win = windowEndingAt(end ?? count, pattern ? count : size, count);

  // Reset view-dependent state when the data changes.
  useEffect(() => {
    setDrawings([]);
    setSelected(pattern ? all.length - 1 : null);
    setEnd(null);
    setReplay((r) => ({ ...r, on: false, playing: false }));
  }, [all, pattern]);

  // ---- indicators ----
  const closes = useMemo(() => candles.map((c) => c.c), [candles]);
  const overlays: Overlay[] = [];
  if (ind.sma) overlays.push({ key: 'sma', label: `SMA ${ind.smaLen}`, values: sma(closes, ind.smaLen), color: 'var(--series-1)' });
  if (ind.ema) overlays.push({ key: 'ema', label: `EMA ${ind.emaLen}`, values: ema(closes, ind.emaLen), color: 'var(--series-2)' });
  if (ind.bb) {
    const b = bollinger(closes, 20, 2);
    overlays.push({ key: 'bbu', label: 'BB upper', values: b.upper, color: 'var(--cl-cross)', width: 1 });
    overlays.push({ key: 'bbl', label: 'BB lower', values: b.lower, color: 'var(--cl-cross)', width: 1 });
    overlays.push({ key: 'bbm', label: 'BB mid', values: b.mid, color: 'var(--cl-cross)', width: 1, dash: '4 3' });
  }
  if (ind.vwap) overlays.push({ key: 'vwap', label: 'VWAP', values: vwap(candles), color: 'var(--series-7)', width: 1.6 });
  const panes: Pane[] = [];
  if (ind.rsi) panes.push({ key: 'rsi', label: 'RSI 14', lines: [{ key: 'rsi', label: 'RSI', values: rsi(closes, 14), color: 'var(--series-7)' }], range: [0, 100], guides: [30, 70] });
  if (ind.macd) {
    const m = macd(closes);
    panes.push({ key: 'macd', label: 'MACD 12 26 9', lines: [{ key: 'm', label: 'MACD', values: m.macd, color: 'var(--series-1)' }, { key: 's', label: 'Signal', values: m.signal, color: 'var(--series-2)' }], hist: m.hist });
  }

  // ---- replay ----
  useEffect(() => {
    if (!replay.on || !replay.playing) return;
    const id = setInterval(() => {
      setReplay((r) => (r.cursor + 1 >= all.length ? { ...r, playing: false } : { ...r, cursor: r.cursor + 1 }));
    }, replay.speed);
    return () => clearInterval(id);
  }, [replay.on, replay.playing, replay.speed, all.length]);

  const startReplay = () => {
    const cursor = Math.max(30, Math.floor(all.length * 0.6));
    setReplay({ on: true, cursor, playing: false, speed: 600 });
    setGame({ total: 0, correct: 0, streak: 0, last: '' });
    setEnd(null);
  };
  const guess = (dir: 'up' | 'down') => {
    if (!replay.on || replay.cursor + 1 >= all.length) return;
    const now = all[replay.cursor].c;
    const next = all[replay.cursor + 1].c;
    const ok = dir === 'up' ? next >= now : next < now;
    setGame((g) => ({ total: g.total + 1, correct: g.correct + (ok ? 1 : 0), streak: ok ? g.streak + 1 : 0, last: ok ? 'right' : 'wrong' }));
    setReplay((r) => ({ ...r, cursor: r.cursor + 1 }));
  };

  // ---- explainer ----
  const sel = selected !== null && selected < candles.length ? selected : null;
  const match = sel !== null ? explain(candles, sel) : null;
  const matchInfo = match ? patterns.find((p) => p.id === match.id) : null;
  const a = sel !== null ? anatomy(candles[sel]) : null;

  // ---- guided tours ----
  const uiSteps: TourStep[] = [
    { target: 'cl-data', text: t('cl.tour.data') },
    { target: 'cl-chart', text: t('cl.tour.chart') },
    { target: 'cl-tf', text: t('cl.tour.tf') },
    { target: 'cl-type', text: t('cl.tour.type') },
    { target: 'cl-ind', text: t('cl.tour.ind') },
    { target: 'cl-tools', text: t('cl.tour.tools') },
    { target: 'cl-replay', text: t('cl.tour.replay') },
    { target: 'cl-explain', text: t('cl.tour.explain') },
  ];
  const readSteps = useMemo<TourStep[]>(() => {
    if (!candles.length) return [];
    const L = candles.length - 1;
    const last = candles[L];
    const s50 = sma(closes, Math.min(50, Math.max(5, Math.floor(candles.length / 3))));
    const slope = Number.isFinite(s50[L]) && Number.isFinite(s50[Math.max(0, L - 10)]) ? s50[L] - s50[Math.max(0, L - 10)] : 0;
    const trend = last.c > s50[L] && slope > 0 ? t('cl.read.trend.up') : last.c < s50[L] && slope < 0 ? t('cl.read.trend.down') : t('cl.read.trend.side');
    const look = candles.slice(Math.max(0, L - 60));
    const sup = Math.min(...look.map((c) => c.l));
    const res = Math.max(...look.map((c) => c.h));
    const m = explain(candles, L);
    const mName = m ? patterns.find((p) => p.id === m.id)?.name : null;
    const avgVol = candles.slice(Math.max(0, L - 20), L).reduce((s, c) => s + c.v, 0) / Math.max(1, Math.min(20, L));
    const rel = avgVol ? last.v / avgVol : 1;
    const r = rsi(closes, 14)[L];
    const rText = !Number.isFinite(r) ? t('cl.read.rsi.na') : r > 70 ? t('cl.read.rsi.high', { v: r.toFixed(0) }) : r < 30 ? t('cl.read.rsi.low', { v: r.toFixed(0) }) : t('cl.read.rsi.mid', { v: r.toFixed(0) });
    return [
      { target: 'cl-data', text: t('cl.read.1') },
      { target: 'cl-tf', text: t('cl.read.2', { tf: pattern ? t('cl.tf.D') : t(`cl.tf.${tf}`) }) },
      { target: 'cl-chart', text: t('cl.read.3', { trend }) },
      { target: 'cl-chart', text: t('cl.read.4', { sup: sup.toFixed(2), res: res.toFixed(2) }), lines: [sup, res] },
      { target: 'cl-chart', text: mName ? t('cl.read.5a', { name: mName }) : t('cl.read.5b'), select: L },
      { target: 'cl-chart', text: t('cl.read.6', { x: rel.toFixed(1) }) },
      { target: 'cl-ind', text: t('cl.read.7', { rsi: rText }) },
      { target: 'cl-chart', text: t('cl.read.8', { sup: sup.toFixed(2) }), lines: [sup] },
      { target: 'cl-chart', text: t('cl.read.9') },
    ];
  }, [candles, closes, patterns, pattern, tf]);
  const steps = tour?.kind === 'read' ? readSteps : uiSteps;
  const step: TourStep | null = tour ? (steps[tour.step] ?? null) : null;
  useEffect(() => {
    if (!step) return;
    document.getElementById(step.target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (step.select !== undefined) setSelected(step.select);
  }, [step]);
  const ring = (id: string) => (step?.target === id ? 'ring-2 ring-[var(--link)] ring-offset-2 ring-offset-[var(--bg)]' : '');
  const tourLines: Drawing[] = step?.lines ? step.lines.map((p) => ({ type: 'hline' as const, a: { i: 0, p }, b: { i: 0, p } })) : [];

  return (
    <div className="space-y-4">
      {/* ---- tour panel ---- */}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={() => setTour({ kind: 'ui', step: 0 })}>
          {t('cl.tour.start')}
        </button>
        <button type="button" className="btn btn-primary px-3 py-1.5 text-sm" onClick={() => setTour({ kind: 'read', step: 0 })}>
          {t('cl.read.start')}
        </button>
      </div>
      {tour && step && (
        <div className="callout callout-tip sticky top-20 z-10" aria-live="polite">
          <p className="callout-title">
            {tour.kind === 'ui' ? t('cl.tour.title') : t('cl.read.title')} · {tour.step + 1}/{steps.length}
          </p>
          <p>{step.text}</p>
          <div className="mt-2 flex gap-2">
            <button type="button" className="btn btn-ghost px-3 py-1 text-sm disabled:opacity-40" disabled={tour.step === 0} onClick={() => setTour({ ...tour, step: tour.step - 1 })}>
              {t('cl.tour.back')}
            </button>
            {tour.step + 1 < steps.length ? (
              <button type="button" className="btn btn-primary px-3 py-1 text-sm" onClick={() => setTour({ ...tour, step: tour.step + 1 })}>
                {t('cl.tour.next')}
              </button>
            ) : (
              <button type="button" className="btn btn-primary px-3 py-1 text-sm" onClick={() => setTour(null)}>
                {t('cl.tour.done')}
              </button>
            )}
            <button type="button" className="ml-auto text-sm text-muted underline" onClick={() => setTour(null)}>
              {t('cl.tour.close')}
            </button>
          </div>
        </div>
      )}

      {/* ---- data ---- */}
      <div id="cl-data" className={`card flex flex-wrap items-end gap-3 p-3 ${ring('cl-data')}`}>
        {pattern ? (
          <>
            <p className="text-sm">
              {t('cl.patternMode', { name: pattern.name })} <a href={url(`/charts/candles#${pattern.id}`)}>{t('cl.inEncyclopedia')}</a>
            </p>
            <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={() => setPatternId(null)}>
              {t('cl.backToMarket')}
            </button>
          </>
        ) : (
          <>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-muted">{t('cl.scenario')}</span>
              <select className="rounded-lg border border-border bg-surface px-2.5 py-1.5" value={scenario} onChange={(e) => setScenario(e.target.value as Scenario)}>
                {SCENARIOS.map((s) => (
                  <option key={s} value={s}>
                    {t(`cl.scenario.${s}`)}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn btn-ghost px-3 py-1.5 text-sm" onClick={() => setSeed((s) => s + 1)}>
              {t('cl.newChart')}
            </button>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-muted">{t('cl.pattern')}</span>
              <select className="rounded-lg border border-border bg-surface px-2.5 py-1.5" value="" onChange={(e) => e.target.value && setPatternId(e.target.value)}>
                <option value="">{t('cl.patternPick')}</option>
                {patterns.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <p className="basis-full text-xs text-muted">{t('cl.simulated')}</p>
      </div>

      {/* ---- view controls ---- */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div id="cl-tf" role="group" aria-label={t('cl.timeframe')} className={`flex flex-wrap items-center gap-1 rounded-lg ${ring('cl-tf')}`}>
          <span className="mr-1 text-xs text-muted">{t('cl.timeframe')}</span>
          {TIMEFRAMES.map((x) => (
            <button key={x} type="button" disabled={!!pattern} className={`${btn(tf === x)} disabled:opacity-40`} aria-pressed={tf === x} onClick={() => setTf(x)}>
              {t(`cl.tfShort.${x}`)}
            </button>
          ))}
        </div>
        <div id="cl-type" role="group" aria-label={t('cl.chartType')} className={`flex flex-wrap items-center gap-1 rounded-lg ${ring('cl-type')}`}>
          <span className="mr-1 text-xs text-muted">{t('cl.chartType')}</span>
          {TYPES.map((x) => (
            <button key={x} type="button" className={btn(chartType === x)} aria-pressed={chartType === x} onClick={() => setChartType(x)}>
              {t(`cl.type.${x}`)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" className="accent-[var(--link)]" checked={log} onChange={(e) => setLog(e.target.checked)} /> {t('cl.log')}
        </label>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" className="accent-[var(--link)]" checked={showVolume} onChange={(e) => setShowVolume(e.target.checked)} /> {t('cl.volume')}
        </label>
      </div>

      <div id="cl-ind" className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg text-sm ${ring('cl-ind')}`}>
        <span className="text-xs text-muted">{t('cl.indicators')}</span>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" className="accent-[var(--link)]" checked={ind.sma} onChange={(e) => setInd({ ...ind, sma: e.target.checked })} />
          <span className="inline-block h-0.5 w-4 bg-[var(--series-1)]" aria-hidden="true" /> SMA
          <input type="number" min={2} max={200} aria-label={t('cl.length', { name: 'SMA' })} className="w-14 rounded border border-border bg-surface px-1 py-0.5" value={ind.smaLen} onChange={(e) => setInd({ ...ind, smaLen: Math.min(200, Math.max(2, Number(e.target.value) || 20)) })} />
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" className="accent-[var(--link)]" checked={ind.ema} onChange={(e) => setInd({ ...ind, ema: e.target.checked })} />
          <span className="inline-block h-0.5 w-4 bg-[var(--series-2)]" aria-hidden="true" /> EMA
          <input type="number" min={2} max={200} aria-label={t('cl.length', { name: 'EMA' })} className="w-14 rounded border border-border bg-surface px-1 py-0.5" value={ind.emaLen} onChange={(e) => setInd({ ...ind, emaLen: Math.min(200, Math.max(2, Number(e.target.value) || 50)) })} />
        </label>
        {(
          [
            ['bb', 'Bollinger 20, 2'],
            ['vwap', 'VWAP'],
            ['rsi', 'RSI 14'],
            ['macd', 'MACD 12 26 9'],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="flex items-center gap-1.5">
            <input type="checkbox" className="accent-[var(--link)]" checked={ind[k]} onChange={(e) => setInd({ ...ind, [k]: e.target.checked })} /> {label}
          </label>
        ))}
      </div>
      {ind.vwap && (tf === 'D' || tf === 'W' || pattern) && <p className="text-xs text-[var(--cl-ha-note)]">⚠ {t('cl.vwapNote')}</p>}
      {chartType === 'ha' && <p className="text-xs text-[var(--cl-ha-note)]">⚠ {t('cl.haNote')}</p>}

      <div id="cl-tools" className={`flex flex-wrap items-center gap-1 rounded-lg ${ring('cl-tools')}`} role="group" aria-label={t('cl.tools')}>
        <span className="mr-1 text-xs text-muted">{t('cl.tools')}</span>
        {TOOLS.map((x) => (
          <button key={x} type="button" className={btn(tool === x)} aria-pressed={tool === x} onClick={() => setTool(x)}>
            {t(`cl.tool.${x}`)}
          </button>
        ))}
        <button type="button" className="ml-2 text-sm text-muted underline disabled:opacity-40" disabled={!drawings.length} onClick={() => setDrawings((d) => d.slice(0, -1))}>
          {t('cl.undo')}
        </button>
        <button type="button" className="text-sm text-muted underline disabled:opacity-40" disabled={!drawings.length} onClick={() => setDrawings([])}>
          {t('cl.clear')}
        </button>
      </div>
      {tool !== 'none' && <p className="text-xs text-muted">{tool === 'hline' ? t('cl.toolHintOne') : t('cl.toolHintTwo')}</p>}

      {/* ---- chart ---- */}
      <div id="cl-chart" ref={chartRef} className={`card p-3 ${ring('cl-chart')}`}>
        {overlays.length > 0 && (
          <ul className="mb-1 flex flex-wrap gap-x-3 text-xs" aria-hidden="true">
            {overlays
              .filter((o) => !o.key.startsWith('bb') || o.key === 'bbm')
              .map((o) => (
                <li key={o.key} className="flex items-center gap-1">
                  <span className="inline-block h-0.5 w-4" style={{ background: o.color }} /> {o.key === 'bbm' ? 'Bollinger 20, 2' : o.label}
                </li>
              ))}
          </ul>
        )}
        <ChartCanvas
          candles={candles}
          display={display}
          window={win}
          chartType={chartType}
          log={log}
          showVolume={showVolume}
          overlays={overlays}
          panes={panes}
          drawings={[...drawings, ...tourLines]}
          tool={tool}
          selected={sel}
          highlight={pattern ? { from: all.length - pattern.candles.length, to: all.length - 1 } : null}
          height={300}
          timeLabel={timeLabelFor(pattern ? 'pattern' : tf)}
          onDraw={(d) => setDrawings((ds) => [...ds, d])}
          onPick={(pt) => setSelected(pt.i)}
          ariaLabel={t('cl.chartLabel', { scenario: pattern ? pattern.name : t(`cl.scenario.${scenario}`), tf: t(`cl.tf.${pattern ? 'D' : tf}`) })}
        />
        {!pattern && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <button type="button" className="btn btn-ghost px-2.5 py-1" aria-label={t('cl.zoomOut')} onClick={() => setSize((s) => Math.min(400, Math.round(s * 1.4)))}>
              −
            </button>
            <button type="button" className="btn btn-ghost px-2.5 py-1" aria-label={t('cl.zoomIn')} onClick={() => setSize((s) => Math.max(20, Math.round(s / 1.4)))}>
              +
            </button>
            <label className="flex flex-1 items-center gap-2">
              <span className="text-xs text-muted">{t('cl.scroll')}</span>
              <input type="range" className="flex-1 accent-[var(--link)]" min={Math.min(size, count)} max={count} value={win.end} onChange={(e) => setEnd(Number(e.target.value) >= count ? null : Number(e.target.value))} />
            </label>
          </div>
        )}
      </div>

      {/* ---- replay and game ---- */}
      {!pattern && (
        <div id="cl-replay" className={`card p-3 ${ring('cl-replay')}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{t('cl.replay')}</span>
            {!replay.on ? (
              <button type="button" className="btn btn-ghost px-3 py-1 text-sm" onClick={startReplay}>
                {t('cl.replayStart')}
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-ghost px-3 py-1 text-sm" onClick={() => setReplay((r) => ({ ...r, playing: !r.playing }))}>
                  {replay.playing ? t('cl.pause') : t('cl.play')}
                </button>
                <button type="button" className="btn btn-ghost px-3 py-1 text-sm" disabled={replay.cursor + 1 >= all.length} onClick={() => setReplay((r) => ({ ...r, cursor: Math.min(all.length - 1, r.cursor + 1) }))}>
                  {t('cl.step')}
                </button>
                <label className="flex items-center gap-1 text-sm">
                  <span className="text-muted">{t('cl.speed')}</span>
                  <select className="rounded border border-border bg-surface px-1 py-0.5" value={replay.speed} onChange={(e) => setReplay((r) => ({ ...r, speed: Number(e.target.value) }))}>
                    <option value={1200}>0.5×</option>
                    <option value={600}>1×</option>
                    <option value={200}>3×</option>
                  </select>
                </label>
                <button type="button" className="text-sm text-muted underline" onClick={() => setReplay((r) => ({ ...r, on: false, playing: false }))}>
                  {t('cl.replayExit')}
                </button>
                <span className="text-xs text-muted tabular-nums">{t('cl.replayPos', { n: replay.cursor + 1, total: all.length })}</span>
              </>
            )}
          </div>
          {replay.on && (
            <div className="mt-3 rounded-lg bg-surface-2 p-3">
              <p className="font-semibold">{t('cl.game.title')}</p>
              <p className="text-sm text-muted">{t('cl.game.q')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" className="btn btn-ghost px-3 py-1 text-sm" disabled={replay.playing || replay.cursor + 1 >= all.length} onClick={() => guess('up')}>
                  ▲ {t('cl.game.higher')}
                </button>
                <button type="button" className="btn btn-ghost px-3 py-1 text-sm" disabled={replay.playing || replay.cursor + 1 >= all.length} onClick={() => guess('down')}>
                  ▼ {t('cl.game.lower')}
                </button>
                <span className="text-sm tabular-nums" aria-live="polite">
                  {game.last === 'right' ? `✓ ${t('cl.game.right')}` : game.last === 'wrong' ? `✗ ${t('cl.game.wrong')}` : ''}{' '}
                  {game.total > 0 && t('cl.game.score', { c: game.correct, n: game.total, pct: Math.round((game.correct / game.total) * 100), s: game.streak })}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">{t('cl.game.note')}</p>
            </div>
          )}
        </div>
      )}

      {/* ---- explainer ---- */}
      <div id="cl-explain" className={`card p-4 ${ring('cl-explain')}`} aria-live="polite">
        <h2 className="font-semibold">{t('cl.explain.title')}</h2>
        {sel === null || !a ? (
          <p className="mt-1 text-sm text-muted">{t('cl.explain.hint')}</p>
        ) : (
          <div className="mt-1 text-sm">
            <p className="tabular-nums">
              {timeLabelFor(pattern ? 'pattern' : tf)(candles[sel])}: O {candles[sel].o.toFixed(2)} · H {candles[sel].h.toFixed(2)} · L {candles[sel].l.toFixed(2)} · C {candles[sel].c.toFixed(2)}
            </p>
            <p className="mt-1 text-muted">
              {t('cl.explain.anatomy', {
                dir: a.bullish ? t('cl.explain.rising') : t('cl.explain.falling'),
                body: Math.round(a.bodyPct * 100),
                upper: Math.round(a.upperPct * 100),
                lower: Math.round(a.lowerPct * 100),
              })}
            </p>
            {match && matchInfo ? (
              <p className="mt-2">
                <strong>{t('cl.explain.is', { name: matchInfo.name })}</strong> {t('cl.explain.because')} {match.reasons.join('; ')}.{' '}
                <a href={url(`/charts/candles#${matchInfo.id}`)}>{t('cl.explain.more')}</a>
              </p>
            ) : (
              <p className="mt-2 text-muted">{t('cl.explain.none')}</p>
            )}
            {chartType === 'ha' && <p className="mt-1 text-xs text-muted">{t('cl.explain.haReal')}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
