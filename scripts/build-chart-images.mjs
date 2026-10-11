#!/usr/bin/env node
/**
 * Generates the Chart School's lesson images (original SVG artwork) from data:
 *   content/candles.json  -> content/lessons/J/img/pattern-<id>.svg
 *   simulated markets     -> chart types, Heikin Ashi, indicators, …
 * Run with `npm run build:chart-images` after changing patterns or drawings, and commit the SVGs.
 * Uses Node's built-in TypeScript type stripping to reuse the site's chart library.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { aggregate, heikinAshi, simulate } from '../src/lib/chart/core.ts';
import { bollinger, macd, rsi, sma } from '../src/lib/chart/indicators.ts';
import { exampleSeries } from '../src/lib/chart/examples.ts';
import { COLORS, candleElements, makeScale, patternSvg, svgDoc } from '../src/lib/chart/svg.ts';

const OUT = 'content/lessons/J/img';
mkdirSync(OUT, { recursive: true });
const write = (name, svg) => writeFileSync(join(OUT, name), svg + '\n');
const f = (n) => Math.round(n * 10) / 10;
const text = (x, y, s, o = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-size="${o.size ?? 13}" font-weight="${o.weight ?? 500}" fill="${o.fill ?? COLORS.text}" text-anchor="${o.anchor ?? 'start'}">${s}</text>`;
const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${o.stroke ?? COLORS.muted}" stroke-width="${o.width ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
const poly = (pts, o = {}) =>
  `<polyline points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" fill="none" stroke="${o.stroke ?? COLORS.blue}" stroke-width="${o.width ?? 2}" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

// ---- 1. Pattern drawings ----------------------------------------------------------------
const patterns = JSON.parse(readFileSync('content/candles.json', 'utf8'));
for (const p of patterns) {
  const { candles, contextCount } = exampleSeries(p);
  write(`pattern-${p.id}.svg`, patternSvg(candles, contextCount, `${p.name}: example drawing`));
}

const daily = (scenario, seed, days = 120) => aggregate(simulate(scenario, { days, seed }), 'D');

// ---- 2. Line, bar and candlestick chart of the same data --------------------------------
{
  const d = daily('uptrend', 21, 40).slice(0, 16);
  const lo = Math.min(...d.map((c) => c.l));
  const hi = Math.max(...d.map((c) => c.h));
  const W = 780;
  const H = 250;
  const pw = (W - 40) / 3;
  let body = '';
  ['Line chart (closes only)', 'Bar chart (OHLC)', 'Candlestick chart'].forEach((title, k) => {
    const box = { x: 20 + k * pw + 8, y: 40, w: pw - 16, h: H - 60 };
    const s = makeScale(d.length, lo, hi, box);
    body += `<rect x="${f(box.x - 4)}" y="30" width="${f(box.w + 8)}" height="${H - 40}" rx="8" fill="none" stroke="${COLORS.grid}"/>`;
    body += text(box.x + box.w / 2, 22, title, { anchor: 'middle', weight: 600 });
    if (k === 0) body += poly(d.map((c, i) => [s.x(i), s.y(c.c)]));
    else body += candleElements(d, s, 0, k === 1 ? 'bar' : 'candle');
  });
  write('chart-types.svg', svgDoc(W, H, body, 'The same 16 days drawn as a line chart, a bar chart and a candlestick chart'));
}

// ---- 3. Anatomy of a candle --------------------------------------------------------------
{
  const W = 560;
  const H = 320;
  const y = (p) => 40 + ((107 - p) / (107 - 97)) * 240;
  const drawCandle = (cx, o, h, l, c, color) => {
    const top = y(Math.max(o, c));
    const bot = y(Math.min(o, c));
    return `${line(cx, y(h), cx, y(l), { stroke: color, width: 3 })}<rect x="${cx - 28}" y="${f(top)}" width="56" height="${f(bot - top)}" rx="3" fill="${color}"/>`;
  };
  let body = '';
  // price axis
  for (const p of [98, 100, 102, 104, 106]) body += line(40, y(p), 520, y(p), { stroke: COLORS.grid, width: 1 }) + text(34, y(p) + 4, String(p), { anchor: 'end', size: 12, fill: COLORS.muted });
  body += drawCandle(170, 100, 106, 98, 104, COLORS.up);
  body += drawCandle(390, 104, 106, 98, 100, COLORS.down);
  const label = (x, yy, s, anchor = 'start') => text(x, yy + 4, s, { size: 13, anchor });
  const tick = (x1, x2, yy) => line(x1, yy, x2, yy, { stroke: COLORS.text, width: 1 });
  // rising candle labels (left side)
  body += tick(110, 140, y(106)) + label(105, y(106), 'High 106', 'end');
  body += tick(110, 140, y(104)) + label(105, y(104), 'Close 104', 'end');
  body += tick(110, 140, y(100)) + label(105, y(100), 'Open 100', 'end');
  body += tick(110, 140, y(98)) + label(105, y(98), 'Low 98', 'end');
  body += tick(200, 228, y(105)) + label(232, y(105), 'Upper wick');
  body += tick(200, 228, y(102)) + label(232, y(102), 'Body');
  body += tick(200, 228, y(99)) + label(232, y(99), 'Lower wick');
  // falling candle labels (right side)
  body += tick(420, 450, y(104)) + label(455, y(104), 'Open 104');
  body += tick(420, 450, y(100)) + label(455, y(100), 'Close 100');
  body += text(170, 305, 'Rising: close above open', { anchor: 'middle', weight: 600, fill: COLORS.up });
  body += text(390, 305, 'Falling: close below open', { anchor: 'middle', weight: 600, fill: COLORS.down });
  write('candle-anatomy.svg', svgDoc(W, H, body, 'Anatomy of a candle: open 100, high 106, low 98, close 104, and a falling candle for comparison'));
}

// ---- 4. Normal candles vs Heikin Ashi -----------------------------------------------------
{
  const d = daily('range', 4, 60).slice(10, 40);
  const ha = heikinAshi(d);
  const lo = Math.min(...d.map((c) => c.l));
  const hi = Math.max(...d.map((c) => c.h));
  const W = 780;
  const H = 250;
  let body = '';
  [
    ['Normal candles (real prices)', d],
    ['Heikin Ashi (averaged, not real prices)', ha],
  ].forEach(([title, data], k) => {
    const box = { x: 20 + k * 375, y: 40, w: 350, h: H - 60 };
    const s = makeScale(data.length, lo, hi, box);
    body += text(box.x + box.w / 2, 22, title, { anchor: 'middle', weight: 600 });
    body += candleElements(data, s);
  });
  write('heikin-ashi.svg', svgDoc(W, H, body, 'The same 30 days as normal candles and as Heikin Ashi candles'));
}

// ---- 5. Linear vs logarithmic scale ----------------------------------------------------------
{
  const pts = Array.from({ length: 41 }, (_, i) => 10 * Math.pow(1.122, i)); // ×100 over 40 steps
  const W = 780;
  const H = 270;
  let body = '';
  const panel = (k, title, yOf, ticks) => {
    const x0 = 70 + k * 380;
    const box = { x: x0, y: 40, w: 300, h: 190 };
    body += text(box.x + box.w / 2, 22, title, { anchor: 'middle', weight: 600 });
    for (const t of ticks) body += line(box.x, yOf(t, box), box.x + box.w, yOf(t, box), { stroke: COLORS.grid, width: 1 }) + text(box.x - 6, yOf(t, box) + 4, String(t), { anchor: 'end', size: 11, fill: COLORS.muted });
    body += poly(pts.map((p, i) => [box.x + (i / 40) * box.w, yOf(p, box)]));
  };
  panel(0, 'Linear scale', (p, b) => b.y + b.h - ((p - 0) / 1000) * b.h, [0, 250, 500, 750, 1000]);
  panel(1, 'Logarithmic scale', (p, b) => b.y + b.h - (Math.log10(p / 10) / 2) * b.h, [10, 20, 50, 100, 200, 500, 1000]);
  body += text(390, 258, 'A price growing at the same percentage rate: a curve on a linear scale, a straight line on a log scale.', { anchor: 'middle', size: 12, fill: COLORS.muted });
  write('linear-vs-log.svg', svgDoc(W, H, body, 'The same price history on a linear and on a logarithmic scale'));
}

// ---- 6. Trend structure, support and resistance ----------------------------------------------
{
  const W = 780;
  const H = 260;
  let body = '';
  const panel = (k, title, ys, labels, zones = []) => {
    const box = { x: 20 + k * 255, y: 44, w: 230, h: 180 };
    body += text(box.x + box.w / 2, 24, title, { anchor: 'middle', weight: 600 });
    for (const [z1, z2, name] of zones) {
      const y1 = box.y + (1 - z2) * box.h;
      const y2 = box.y + (1 - z1) * box.h;
      body += `<rect x="${box.x}" y="${f(y1)}" width="${box.w}" height="${f(y2 - y1)}" fill="${COLORS.zone}"/>` + text(box.x + box.w - 4, (y1 + y2) / 2 + 4, name, { size: 11, fill: COLORS.blue, weight: 600, anchor: 'end' });
    }
    const pts = ys.map((v, i) => [box.x + (i / (ys.length - 1)) * box.w, box.y + (1 - v) * box.h]);
    body += poly(pts, { stroke: COLORS.text });
    labels.forEach((l, i) => {
      if (!l) return;
      const [x, y] = pts[i];
      const above = l.startsWith('H') || l === 'LH';
      body += text(x, above ? y - 10 : y + 22, l, { anchor: 'middle', size: 12, weight: 700, fill: above ? COLORS.up : COLORS.down });
    });
  };
  panel(0, 'Uptrend', [0.1, 0.45, 0.3, 0.65, 0.5, 0.85, 0.7], ['', 'H', 'HL', 'HH', 'HL', 'HH', 'HL']);
  panel(1, 'Downtrend', [0.9, 0.55, 0.7, 0.35, 0.5, 0.15, 0.3], ['', 'L', 'LH', 'LL', 'LH', 'LL', 'LH']);
  panel(2, 'Range (sideways)', [0.3, 0.75, 0.25, 0.78, 0.28, 0.74, 0.5], [], [
    [0.7, 0.82, 'Resistance zone'],
    [0.2, 0.32, 'Support zone'],
  ]);
  body += text(390, 250, 'HH = higher high, HL = higher low, LH = lower high, LL = lower low', { anchor: 'middle', size: 12, fill: COLORS.muted });
  write('trend-structure.svg', svgDoc(W, H, body, 'Uptrend with higher highs and higher lows, downtrend with lower highs and lower lows, and a sideways range between support and resistance zones'));
}

// ---- 7. Classic chart patterns -----------------------------------------------------------------
{
  const W = 780;
  const H = 440;
  let body = '';
  const panel = (k, title, ys, extra) => {
    const col = k % 2;
    const row = Math.floor(k / 2);
    const box = { x: 30 + col * 375, y: 46 + row * 205, w: 340, h: 150 };
    body += text(box.x + box.w / 2, box.y - 18, title, { anchor: 'middle', weight: 600 });
    const X = (i) => box.x + (i / (ys.length - 1)) * box.w;
    const Y = (v) => box.y + (1 - v) * box.h;
    body += poly(ys.map((v, i) => [X(i), Y(v)]), { stroke: COLORS.text });
    body += extra(X, Y);
  };
  panel(0, 'Head and shoulders', [0.15, 0.6, 0.4, 0.85, 0.4, 0.62, 0.38, 0.15], (X, Y) =>
    line(X(1.5), Y(0.4), X(7), Y(0.38), { stroke: COLORS.orange, width: 2, dash: '6 4' }) + text(X(1.6), Y(0.4) + 18, 'Neckline', { size: 12, fill: COLORS.orange, weight: 600 }) + text(X(1), Y(0.6) - 10, 'Shoulder', { anchor: 'middle', size: 11, fill: COLORS.muted }) + text(X(3), Y(0.85) - 10, 'Head', { anchor: 'middle', size: 11, fill: COLORS.muted }) + text(X(5), Y(0.62) - 10, 'Shoulder', { anchor: 'middle', size: 11, fill: COLORS.muted }),
  );
  panel(1, 'Double top', [0.15, 0.8, 0.45, 0.8, 0.3, 0.1], (X, Y) =>
    line(X(0.5), Y(0.82), X(4), Y(0.82), { stroke: COLORS.orange, width: 2, dash: '6 4' }) + line(X(1.5), Y(0.45), X(5), Y(0.45), { stroke: COLORS.blue, width: 2, dash: '6 4' }) + text(X(1.5), Y(0.45) + 16, 'Low between the tops', { size: 11, fill: COLORS.blue, weight: 600 }),
  );
  panel(2, 'Ascending triangle', [0.1, 0.75, 0.3, 0.75, 0.45, 0.75, 0.58, 0.75, 0.95], (X, Y) =>
    line(X(1), Y(0.75), X(7), Y(0.75), { stroke: COLORS.orange, width: 2, dash: '6 4' }) + line(X(0), Y(0.1), X(6), Y(0.58), { stroke: COLORS.blue, width: 2, dash: '6 4' }) + text(X(6.8), Y(0.95), 'Breakout?', { anchor: 'end', size: 11, fill: COLORS.muted }),
  );
  panel(3, 'Bull flag', [0.05, 0.75, 0.68, 0.72, 0.62, 0.66, 0.57, 0.95], (X, Y) =>
    line(X(1), Y(0.77), X(6), Y(0.6), { stroke: COLORS.orange, width: 2, dash: '6 4' }) + line(X(2), Y(0.66), X(6), Y(0.55), { stroke: COLORS.orange, width: 2, dash: '6 4' }) + text(X(0.62), Y(0.22), 'Pole', { size: 11, fill: COLORS.muted }) + text(X(4), Y(0.8), 'Flag', { anchor: 'middle', size: 11, fill: COLORS.muted }),
  );
  write('chart-patterns.svg', svgDoc(W, H, body, 'Simplified sketches of a head and shoulders, a double top, an ascending triangle and a bull flag'));
}

// ---- 8. Indicators -----------------------------------------------------------------------------
{
  const all = daily('gap', 9, 160);
  const closes = all.map((c) => c.c);
  const m20 = sma(closes, 20);
  const m50 = sma(closes, 50);
  const bb = bollinger(closes, 20, 2);
  const r = rsi(closes, 14);
  const md = macd(closes);
  const from = 60;
  const d = all.slice(from);
  const sl = (a) => a.slice(from);
  const W = 780;
  const H = 520;
  const lo = Math.min(...d.map((c) => c.l), ...sl(bb.lower));
  const hi = Math.max(...d.map((c) => c.h), ...sl(bb.upper));
  const box = { x: 50, y: 40, w: 700, h: 250 };
  const s = makeScale(d.length, lo, hi, box);
  let body = text(50, 24, 'Price with SMA 20, SMA 50 and Bollinger Bands (20, 2)', { weight: 600 });
  const series = (vals, yOf, o) => poly(vals.map((v, i) => [s.x(i), yOf(v)]).filter(([, y]) => Number.isFinite(y)), o);
  body += series(sl(bb.upper), s.y, { stroke: '#9aa3ad', width: 1.2 }) + series(sl(bb.lower), s.y, { stroke: '#9aa3ad', width: 1.2 });
  body += candleElements(d, s);
  body += series(sl(m20), s.y, { stroke: COLORS.blue, width: 2 }) + series(sl(m50), s.y, { stroke: COLORS.orange, width: 2 });
  // RSI pane
  const rb = { y: 330, h: 70 };
  const ry = (v) => rb.y + (1 - v / 100) * rb.h;
  body += text(50, rb.y - 10, 'RSI (14) with the conventional 70 and 30 levels', { weight: 600 });
  body += line(box.x, ry(70), box.x + box.w, ry(70), { stroke: COLORS.down, width: 1, dash: '4 3' }) + line(box.x, ry(30), box.x + box.w, ry(30), { stroke: COLORS.up, width: 1, dash: '4 3' });
  body += text(box.x - 6, ry(70) + 4, '70', { anchor: 'end', size: 11, fill: COLORS.muted }) + text(box.x - 6, ry(30) + 4, '30', { anchor: 'end', size: 11, fill: COLORS.muted });
  body += series(sl(r), ry, { stroke: COLORS.violet, width: 1.8 });
  // MACD pane
  const mb = { y: 440, h: 60 };
  const mv = sl(md.macd).concat(sl(md.signal)).filter(Number.isFinite);
  const mmax = Math.max(...mv.map(Math.abs));
  const my = (v) => mb.y + mb.h / 2 - (v / mmax) * (mb.h / 2);
  body += text(50, mb.y - 10, 'MACD (12, 26, 9): MACD line, signal line and histogram', { weight: 600 });
  body += line(box.x, my(0), box.x + box.w, my(0), { stroke: COLORS.grid, width: 1 });
  sl(md.hist).forEach((h, i) => {
    if (!Number.isFinite(h)) return;
    body += `<rect x="${f(s.x(i) - s.slot * 0.3)}" y="${f(Math.min(my(0), my(h)))}" width="${f(s.slot * 0.6)}" height="${f(Math.abs(my(h) - my(0)))}" fill="${h >= 0 ? 'rgba(22,131,74,0.45)' : 'rgba(200,53,47,0.45)'}"/>`;
  });
  body += series(sl(md.macd), my, { stroke: COLORS.blue, width: 1.6 }) + series(sl(md.signal), my, { stroke: COLORS.orange, width: 1.6 });
  write('indicators.svg', svgDoc(W, H, body, 'Simulated price chart with moving averages and Bollinger Bands, and RSI and MACD panes below'));
}

// ---- 9. Generic charting platform layout (original sketch, not a screenshot) --------------------
{
  const W = 800;
  const H = 470;
  const box = (x, y, w, h, label, sub = '') =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f4f7fa" stroke="#c9d3de"/>` + text(x + w / 2, y + h / 2 - (sub ? 4 : -4), label, { anchor: 'middle', weight: 600, size: 13 }) + (sub ? text(x + w / 2, y + h / 2 + 14, sub, { anchor: 'middle', size: 11, fill: COLORS.muted }) : '');
  let body = '';
  body += box(16, 16, 768, 44, 'Top toolbar', 'symbol search · timeframe · chart type · indicators · alerts · replay · layouts');
  body += box(16, 70, 56, 300, 'Draw', '');
  body += text(44, 300, 'tools', { anchor: 'middle', size: 11, fill: COLORS.muted });
  body += `<rect x="82" y="70" width="508" height="300" rx="8" fill="#ffffff" stroke="#c9d3de"/>`;
  const d = daily('uptrend', 31, 60).slice(10, 50);
  const s = makeScale(d.length, Math.min(...d.map((c) => c.l)), Math.max(...d.map((c) => c.h)), { x: 92, y: 84, w: 440, h: 200 });
  body += candleElements(d, s);
  const vmax = Math.max(...d.map((c) => c.v));
  d.forEach((c, i) => {
    const h = (c.v / vmax) * 50;
    body += `<rect x="${f(s.x(i) - s.slot * 0.3)}" y="${f(352 - h)}" width="${f(s.slot * 0.6)}" height="${f(h)}" fill="#c9d3de"/>`;
  });
  body += line(82, 298, 590, 298, { stroke: '#c9d3de', width: 1 });
  body += line(540, 70, 540, 370, { stroke: '#c9d3de', width: 1 });
  body += text(565, 90, 'Price', { anchor: 'middle', size: 11, fill: COLORS.muted }) + text(565, 104, 'scale', { anchor: 'middle', size: 11, fill: COLORS.muted });
  body += text(565, 330, 'Volume', { anchor: 'middle', size: 11, fill: COLORS.muted });
  body += line(300, 84, 300, 284, { stroke: COLORS.blue, width: 1, dash: '3 3' }) + line(92, 180, 530, 180, { stroke: COLORS.blue, width: 1, dash: '3 3' }) + text(306, 176, 'crosshair', { size: 11, fill: COLORS.blue });
  body += box(600, 70, 184, 300, 'Right panel', 'watchlist · alerts · details');
  body += box(16, 380, 768, 44, 'Bottom panel', 'screener · script editor · strategy tester · paper trading');
  body += text(400, 452, 'Original sketch of a typical charting platform layout. Real platforms differ and change over time.', { anchor: 'middle', size: 12, fill: COLORS.muted });
  write('platform-layout.svg', svgDoc(W, H, body, 'Sketch of a typical charting platform: top toolbar, drawing tools on the left, chart and volume in the middle, panels on the right and bottom'));
}

console.log(`Chart images written to ${OUT}`);
