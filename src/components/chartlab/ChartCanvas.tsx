/**
 * The Chart Lab's chart: an SVG with a price pane, optional volume, RSI and MACD panes,
 * overlay lines, drawings and a crosshair. Used by the Chart Lab and the chart-reading quiz.
 * All data shown here is simulated.
 */
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { Candle } from '@/lib/chart/core';
import { fibLevels, measure, priceExtent, xScale, yScale, type Window } from '@/lib/chart/viewport';

export type ChartType = 'candle' | 'bar' | 'line' | 'ha';

export interface Overlay {
  key: string;
  label: string;
  values: number[];
  color: string;
  dash?: string;
  width?: number;
}

export interface Pane {
  key: 'rsi' | 'macd';
  label: string;
  lines: Overlay[];
  hist?: number[];
  /** Fixed range (RSI 0–100); otherwise symmetric around zero. */
  range?: [number, number];
  guides?: number[];
}

export type Tool = 'none' | 'trend' | 'hline' | 'rect' | 'fib' | 'measure';
export interface Point {
  i: number;
  p: number;
}
export interface Drawing {
  type: Exclude<Tool, 'none'>;
  a: Point;
  b: Point;
}

export interface ChartCanvasProps {
  candles: Candle[];
  /** Candles to draw (Heikin Ashi or real); `candles` stays the real data for tooltips. */
  display?: Candle[];
  window: Window;
  chartType?: ChartType;
  log?: boolean;
  showVolume?: boolean;
  overlays?: Overlay[];
  panes?: Pane[];
  drawings?: Drawing[];
  tool?: Tool;
  selected?: number | null;
  highlight?: { from: number; to: number } | null;
  height?: number;
  timeLabel?: (c: Candle) => string;
  onDraw?: (d: Drawing) => void;
  onPick?: (pt: Point) => void;
  ariaLabel: string;
}

const AXIS_W = 58;
const TIME_H = 22;
const VOL_H = 56;
const PANE_H = 84;
const GAP = 10;
const fmt = (n: number) => (Math.abs(n) >= 1000 ? n.toFixed(0) : Math.abs(n) >= 10 ? n.toFixed(2) : n.toFixed(3));

export default function ChartCanvas(props: ChartCanvasProps) {
  const {
    candles,
    window: w,
    chartType = 'candle',
    log = false,
    showVolume = true,
    overlays = [],
    panes = [],
    drawings = [],
    tool = 'none',
    selected = null,
    highlight = null,
    height = 300,
    timeLabel,
    onDraw,
    onPick,
    ariaLabel,
  } = props;
  const display = props.display ?? candles;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(720);
  const [hover, setHover] = useState<Point | null>(null);
  const [pending, setPending] = useState<Point | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- layout ----
  const plotW = width - AXIS_W - 8;
  const priceTop = 8;
  const priceH = height;
  let y0 = priceTop + priceH + GAP;
  const volTop = showVolume ? y0 : 0;
  if (showVolume) y0 += VOL_H + GAP;
  const paneTops = panes.map(() => {
    const t = y0;
    y0 += PANE_H + GAP;
    return t;
  });
  const totalH = y0 + TIME_H;

  const xs = xScale(w, 8, plotW);
  const ext = priceExtent(display, w, overlays.map((o) => o.values));
  const ys = yScale(ext.lo, ext.hi, priceTop, priceH, log);
  const bodyW = Math.max(1, Math.min(14, xs.slot * 0.68));
  const idx = Array.from({ length: w.end - w.start }, (_, k) => w.start + k);

  const pointFrom = (e: ReactPointerEvent<SVGSVGElement>): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * width;
    const y = ((e.clientY - r.top) / r.height) * totalH;
    if (y < priceTop || y > priceTop + priceH || x < 8 || x > 8 + plotW) return null;
    const i = Math.min(w.end - 1, Math.max(w.start, xs.index(x)));
    return { i, p: ys.price(y) };
  };

  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => setHover(pointFrom(e));
  const onDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    const pt = pointFrom(e);
    if (!pt) return;
    if (tool === 'none') {
      onPick?.(pt);
      return;
    }
    if (tool === 'hline') {
      onDraw?.({ type: 'hline', a: pt, b: pt });
      return;
    }
    if (!pending) setPending(pt);
    else {
      onDraw?.({ type: tool, a: pending, b: pt });
      setPending(null);
    }
  };
  useEffect(() => setPending(null), [tool]);
  // A hovered or half-drawn point belongs to the old data once the candles change.
  useEffect(() => {
    setHover(null);
    setPending(null);
  }, [candles]);

  // ---- helpers ----
  const line = (vals: number[], scale: (v: number) => number) => {
    let d = '';
    let pen = false;
    for (const i of idx) {
      const v = vals[i];
      if (!Number.isFinite(v)) {
        pen = false;
        continue;
      }
      d += `${pen ? 'L' : 'M'}${xs.x(i).toFixed(1)},${scale(v).toFixed(1)}`;
      pen = true;
    }
    return d;
  };
  const clipX = (i: number) => Math.min(8 + plotW, Math.max(8, xs.x(i)));

  const hc = hover ? candles[hover.i] : null;
  const timeTicks = idx.filter((i) => (i - w.start) % Math.max(1, Math.round(90 / xs.slot)) === 0);

  const renderDrawing = (d: Drawing, k: number | string, preview = false) => {
    const op = preview ? 0.6 : 1;
    const stroke = 'var(--cl-draw)';
    if (d.type === 'hline')
      return (
        <g key={k} opacity={op}>
          <line x1={8} x2={8 + plotW} y1={ys.y(d.a.p)} y2={ys.y(d.a.p)} stroke={stroke} strokeWidth={1.5} />
          <text x={8 + plotW + 4} y={ys.y(d.a.p) + 4} fontSize={11} fill={stroke} fontWeight={600}>
            {fmt(d.a.p)}
          </text>
        </g>
      );
    if (d.type === 'trend') return <line key={k} opacity={op} x1={clipX(d.a.i)} y1={ys.y(d.a.p)} x2={clipX(d.b.i)} y2={ys.y(d.b.p)} stroke={stroke} strokeWidth={2} />;
    if (d.type === 'rect') {
      const x1 = clipX(Math.min(d.a.i, d.b.i));
      const x2 = clipX(Math.max(d.a.i, d.b.i));
      const y1 = ys.y(Math.max(d.a.p, d.b.p));
      const y2 = ys.y(Math.min(d.a.p, d.b.p));
      return <rect key={k} opacity={op} x={x1} y={y1} width={Math.max(1, x2 - x1)} height={Math.max(1, y2 - y1)} fill="var(--cl-draw)" fillOpacity={0.12} stroke={stroke} strokeWidth={1} />;
    }
    if (d.type === 'fib') {
      const x1 = clipX(Math.min(d.a.i, d.b.i));
      return (
        <g key={k} opacity={op}>
          {fibLevels(d.a.p, d.b.p).map((l) => (
            <g key={l.ratio}>
              <line x1={x1} x2={8 + plotW} y1={ys.y(l.price)} y2={ys.y(l.price)} stroke={stroke} strokeWidth={1} strokeDasharray={l.ratio === 0 || l.ratio === 1 ? undefined : '4 3'} />
              <text x={x1 + 4} y={ys.y(l.price) - 3} fontSize={10} fill={stroke}>
                {(l.ratio * 100).toFixed(1)}% · {fmt(l.price)}
              </text>
            </g>
          ))}
        </g>
      );
    }
    // measure
    const m = measure(d.a, d.b);
    const xa = clipX(d.a.i);
    const xb = clipX(d.b.i);
    const ya = ys.y(d.a.p);
    const yb = ys.y(d.b.p);
    return (
      <g key={k} opacity={op}>
        <rect x={Math.min(xa, xb)} y={Math.min(ya, yb)} width={Math.abs(xb - xa)} height={Math.abs(yb - ya)} fill={m.change >= 0 ? 'var(--cl-up)' : 'var(--cl-down)'} fillOpacity={0.12} />
        <line x1={xa} y1={ya} x2={xb} y2={yb} stroke={stroke} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={(xa + xb) / 2} y={Math.min(ya, yb) - 6} fontSize={11} fontWeight={600} textAnchor="middle" fill="currentColor">
          {m.change >= 0 ? '+' : ''}
          {fmt(m.change)} ({m.pct >= 0 ? '+' : ''}
          {m.pct.toFixed(2)}%) · {m.bars} bars
        </text>
      </g>
    );
  };

  return (
    <div ref={wrapRef} className="cl-root w-full">
      {/* OHLC readout, like a platform's status line */}
      <p className="min-h-5 text-xs text-muted tabular-nums" aria-live="off">
        {hc ? (
          <>
            {timeLabel ? <strong className="text-text">{timeLabel(hc)} </strong> : null}O <span className="text-text">{fmt(hc.o)}</span> H <span className="text-text">{fmt(hc.h)}</span> L{' '}
            <span className="text-text">{fmt(hc.l)}</span> C <span className="text-text">{fmt(hc.c)}</span> Vol <span className="text-text">{hc.v.toLocaleString('en')}</span>
          </>
        ) : (
          ' '
        )}
      </p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${totalH}`}
        width="100%"
        className={`block select-none touch-none ${tool !== 'none' ? 'cursor-crosshair' : 'cursor-pointer'}`}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onPointerDown={onDown}
      >
        {/* grid and price axis */}
        {ys.ticks.map((t) => (
          <g key={t}>
            <line x1={8} x2={8 + plotW} y1={ys.y(t)} y2={ys.y(t)} stroke="var(--cl-grid)" />
            <text x={8 + plotW + 6} y={ys.y(t) + 4} fontSize={11} fill="var(--cl-axis)">
              {fmt(t)}
            </text>
          </g>
        ))}
        {highlight && (
          <rect
            x={xs.x(Math.max(highlight.from, w.start)) - xs.slot / 2}
            y={priceTop}
            width={Math.max(0, xs.x(Math.min(highlight.to, w.end - 1)) - xs.x(Math.max(highlight.from, w.start)) + xs.slot)}
            height={priceH}
            fill="var(--cl-draw)"
            fillOpacity={0.1}
          />
        )}

        {/* price */}
        {chartType === 'line' ? (
          <path d={line(display.map((c) => c.c), ys.y)} fill="none" stroke="var(--series-1)" strokeWidth={2} />
        ) : (
          idx.map((i) => {
            const c = display[i];
            const up = c.c >= c.o;
            const color = up ? 'var(--cl-up)' : 'var(--cl-down)';
            const x = xs.x(i);
            if (chartType === 'bar')
              return (
                <g key={i} stroke={color} strokeWidth={1.5}>
                  <line x1={x} x2={x} y1={ys.y(c.h)} y2={ys.y(c.l)} />
                  <line x1={x - bodyW / 2} x2={x} y1={ys.y(c.o)} y2={ys.y(c.o)} />
                  <line x1={x} x2={x + bodyW / 2} y1={ys.y(c.c)} y2={ys.y(c.c)} />
                </g>
              );
            const top = ys.y(Math.max(c.o, c.c));
            const bot = ys.y(Math.min(c.o, c.c));
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={ys.y(c.h)} y2={ys.y(c.l)} stroke={color} strokeWidth={1} />
                <rect x={x - bodyW / 2} y={top} width={bodyW} height={Math.max(1, bot - top)} fill={color} />
              </g>
            );
          })
        )}
        {overlays.map((o) => (
          <path key={o.key} d={line(o.values, ys.y)} fill="none" stroke={o.color} strokeWidth={o.width ?? 1.6} strokeDasharray={o.dash} />
        ))}
        {selected !== null && selected >= w.start && selected < w.end && (
          <rect x={xs.x(selected) - Math.max(bodyW, 6) / 2 - 3} y={ys.y(candles[selected].h) - 6} width={Math.max(bodyW, 6) + 6} height={ys.y(candles[selected].l) - ys.y(candles[selected].h) + 12} rx={3} fill="none" stroke="var(--cl-draw)" strokeWidth={2} />
        )}
        {drawings.map((d, k) => renderDrawing(d, k))}
        {pending && hover && tool !== 'none' && tool !== 'hline' && renderDrawing({ type: tool, a: pending, b: hover }, 'preview', true)}

        {/* volume */}
        {showVolume && (
          <g>
            {(() => {
              let vmax = 1;
              for (const i of idx) vmax = Math.max(vmax, candles[i].v);
              return idx.map((i) => {
                const h = (candles[i].v / vmax) * VOL_H;
                return <rect key={i} x={xs.x(i) - bodyW / 2} y={volTop + VOL_H - h} width={bodyW} height={h} fill={display[i].c >= display[i].o ? 'var(--cl-up)' : 'var(--cl-down)'} fillOpacity={0.35} />;
              });
            })()}
            <text x={8 + plotW + 6} y={volTop + 12} fontSize={10} fill="var(--cl-axis)">
              Vol
            </text>
          </g>
        )}

        {/* indicator panes */}
        {panes.map((p, k) => {
          const top = paneTops[k];
          let lo = p.range?.[0] ?? Infinity;
          let hi = p.range?.[1] ?? -Infinity;
          if (!p.range) {
            for (const i of idx) for (const s of [...p.lines.map((l) => l.values), p.hist ?? []]) if (Number.isFinite(s[i])) hi = Math.max(hi, Math.abs(s[i]));
            if (!Number.isFinite(hi) || hi === 0) hi = 1;
            lo = -hi;
          }
          const py = (v: number) => top + ((hi - v) / (hi - lo)) * PANE_H;
          return (
            <g key={p.key}>
              <rect x={8} y={top} width={plotW} height={PANE_H} fill="none" stroke="var(--cl-grid)" />
              {(p.guides ?? (p.range ? [] : [0])).map((g) => (
                <g key={g}>
                  <line x1={8} x2={8 + plotW} y1={py(g)} y2={py(g)} stroke="var(--cl-cross)" strokeDasharray="3 3" strokeWidth={1} />
                  <text x={8 + plotW + 6} y={py(g) + 4} fontSize={10} fill="var(--cl-axis)">
                    {g}
                  </text>
                </g>
              ))}
              {p.hist &&
                idx.map((i) => {
                  const v = p.hist![i];
                  if (!Number.isFinite(v)) return null;
                  return <rect key={i} x={xs.x(i) - bodyW / 2} y={Math.min(py(0), py(v))} width={bodyW} height={Math.abs(py(v) - py(0))} fill={v >= 0 ? 'var(--cl-up)' : 'var(--cl-down)'} fillOpacity={0.45} />;
                })}
              {p.lines.map((l) => (
                <path key={l.key} d={line(l.values, py)} fill="none" stroke={l.color} strokeWidth={l.width ?? 1.5} />
              ))}
              <text x={12} y={top + 13} fontSize={11} fontWeight={600} fill="var(--cl-axis)">
                {p.label}
              </text>
            </g>
          );
        })}

        {/* time axis */}
        {timeLabel &&
          timeTicks.map((i) => (
            <text key={i} x={xs.x(i)} y={totalH - 6} fontSize={10} fill="var(--cl-axis)" textAnchor="middle">
              {timeLabel(candles[i])}
            </text>
          ))}

        {/* crosshair */}
        {hover && (
          <g pointerEvents="none">
            <line x1={xs.x(hover.i)} x2={xs.x(hover.i)} y1={priceTop} y2={totalH - TIME_H} stroke="var(--cl-cross)" strokeDasharray="3 3" />
            <line x1={8} x2={8 + plotW} y1={ys.y(hover.p)} y2={ys.y(hover.p)} stroke="var(--cl-cross)" strokeDasharray="3 3" />
            <rect x={8 + plotW + 2} y={ys.y(hover.p) - 9} width={AXIS_W - 4} height={18} rx={3} fill="var(--cl-cross)" />
            <text x={8 + plotW + 6} y={ys.y(hover.p) + 4} fontSize={11} fill="#fff">
              {fmt(hover.p)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
