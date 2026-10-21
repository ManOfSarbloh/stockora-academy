#!/usr/bin/env node
/**
 * Generates the lesson animations (original animated SVG) into src/animations/<name>.svg.
 * Lessons embed them with a callout line:  > [!ANIMATION] <name>  (src/lib/markdown/animations.ts).
 *
 * How they behave: every animation rule is scoped to `.anim-armed`, which the page script adds only
 * when motion is allowed. Without it (no JavaScript, "reduce motion", print) the SVG shows its final
 * frame, which carries the same information as a still diagram. Class names are prefixed per
 * animation because the SVG is inlined into the page. Numbers come from the lessons' examples.
 * Run with `npm run build:animations` and commit the SVGs.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const C = {
  navy: '#0F2A44',
  teal: '#0E9F9A',
  slate: '#3B6E8F',
  light: '#9FB7C9',
  pale: '#E9F1F6',
  up: '#16834a',
  down: '#c8352f',
  text: '#1a2433',
  muted: '#516075',
  grid: '#e3e8ee',
  white: '#ffffff',
};
const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r = (n) => Math.round(n * 100) / 100;
const T = (x, y, s, o = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${o.size ?? 13}" font-weight="${o.weight ?? 500}" fill="${o.fill ?? C.text}" text-anchor="${o.anchor ?? 'start'}"${o.cls ? ` class="${o.cls}"` : ''}>${esc(s)}</text>`;
const pctKey = (p) => `${r(p * 100)}%`;
const eur = (n, d = 0) => `€${n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function doc(name, W, H, css, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}" font-family="${FONT}" class="anim-svg anim-${name}"><title>${esc(title)}</title><style>${css}</style><rect width="${W}" height="${H}" rx="14" fill="${C.white}"/>${body}</svg>\n`;
}
/** A fade-in at fraction `at` of the run (keyframes are relative to the whole animation). */
const fadeIn = (name, at) => `@keyframes ${name}{0%,${pctKey(Math.max(0, at - 0.001))}{opacity:0}${pctKey(Math.min(1, at + 0.03))},100%{opacity:1}}`;

mkdirSync('src/animations', { recursive: true });
const out = [];
const write = (name, svg) => {
  writeFileSync(`src/animations/${name}.svg`, svg);
  out.push(name);
};

// ---- 1. A candle forming from a day's trades (J: candlestick-anatomy; open 100, high 106, low 98, close 104) ----
{
  const name = 'candle-forming';
  const P = 'cf';
  const W = 720;
  const H = 330;
  const DUR = 9; // seconds, whole run
  const DRAW = 7.2; // seconds the price takes to cross the day
  const open = 100;
  const y = (p) => 60 + ((107 - p) / 10) * 220;
  const x = (t) => 70 + t * 350;
  const ticks = [
    [0, 100],
    [0.12, 99],
    [0.22, 98],
    [0.35, 100.5],
    [0.5, 103],
    [0.62, 106],
    [0.75, 103.5],
    [0.88, 102.5],
    [1, 104],
  ];
  // Events along the path: every tick, plus where the price crosses the open (colour change, running max).
  const pts = ticks.map(([t, p]) => ({ x: x(t), y: y(p), p }));
  const events = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if ((a.p - open) * (b.p - open) < 0) {
      const k = (open - a.p) / (b.p - a.p);
      events.push({ x: a.x + k * (b.x - a.x), y: a.y + k * (b.y - a.y), p: open, cross: true });
    }
    events.push(b);
  }
  let len = 0;
  events.forEach((e, i) => {
    if (i) len += Math.hypot(e.x - events[i - 1].x, e.y - events[i - 1].y);
    e.len = len;
  });
  const total = len;
  let hi = open;
  let lo = open;
  for (const e of events) {
    hi = Math.max(hi, e.p);
    lo = Math.min(lo, e.p);
    e.hi = hi;
    e.lo = lo;
    e.f = (e.len / total) * (DRAW / DUR); // fraction of the whole run
  }
  const yo = y(open);
  const kf = (prop) => events.map((e) => `${pctKey(e.f)}{${prop(e)}}`).join('');
  const color = (e, before) => (e.cross ? (before ? C.down : C.up) : e.p >= open ? C.up : C.down);
  const bodyKf = events
    .map((e) => {
      const s = `transform:scaleY(${r(y(e.p) - yo)})`;
      if (!e.cross) return `${pctKey(e.f)}{${s};fill:${color(e)}}`;
      return `${pctKey(e.f)}{${s};fill:${C.down}}${pctKey(e.f + 0.0005)}{${s};fill:${C.up}}`;
    })
    .join('');
  const last = events[events.length - 1];
  const fLow = events.find((e) => e.p === 98).f;
  const fHigh = events.find((e) => e.p === 106).f;
  const fClose = last.f;
  const css = [
    `.${P}-box{transform-box:fill-box;transform-origin:50% 0}`,
    `.${P}-body{transform:scaleY(${r(y(104) - yo)});fill:${C.up}}`,
    `.${P}-wu{transform:scaleY(${r(y(106) - yo)})}`,
    `.${P}-wl{transform:scaleY(${r(y(98) - yo)})}`,
    `.${P}-dot{transform:translate(${r(last.x)}px,${r(last.y)}px)}`,
    `.${P}-mark{transform:translateY(${r(last.y)}px)}`,
    `.${P}-line{stroke-dasharray:${r(total)};stroke-dashoffset:0}`,
    `@keyframes ${P}-body{${bodyKf}100%{transform:scaleY(${r(y(104) - yo)});fill:${C.up}}}`,
    `@keyframes ${P}-wu{${kf((e) => `transform:scaleY(${r(y(e.hi) - yo)})`)}100%{transform:scaleY(${r(y(106) - yo)})}}`,
    `@keyframes ${P}-wl{${kf((e) => `transform:scaleY(${r(y(e.lo) - yo)})`)}100%{transform:scaleY(${r(y(98) - yo)})}}`,
    `@keyframes ${P}-dot{${kf((e) => `transform:translate(${r(e.x)}px,${r(e.y)}px)`)}100%{transform:translate(${r(last.x)}px,${r(last.y)}px)}}`,
    `@keyframes ${P}-mark{${kf((e) => `transform:translateY(${r(e.y)}px)`)}100%{transform:translateY(${r(last.y)}px)}}`,
    `@keyframes ${P}-line{0%{stroke-dashoffset:${r(total)}}${pctKey(DRAW / DUR)},100%{stroke-dashoffset:0}}`,
    fadeIn(`${P}-lo`, fLow),
    fadeIn(`${P}-hi`, fHigh),
    fadeIn(`${P}-cl`, fClose),
    `.anim-armed .${P}-body{animation:${P}-body ${DUR}s linear both}`,
    `.anim-armed .${P}-wu{animation:${P}-wu ${DUR}s linear both}`,
    `.anim-armed .${P}-wl{animation:${P}-wl ${DUR}s linear both}`,
    `.anim-armed .${P}-dot{animation:${P}-dot ${DUR}s linear both}`,
    `.anim-armed .${P}-mark{animation:${P}-mark ${DUR}s linear both}`,
    `.anim-armed .${P}-line{animation:${P}-line ${DUR}s linear both}`,
    `.anim-armed .${P}-lo{animation:${P}-lo ${DUR}s linear both}`,
    `.anim-armed .${P}-hi{animation:${P}-hi ${DUR}s linear both}`,
    `.anim-armed .${P}-cl{animation:${P}-cl ${DUR}s linear both}`,
  ].join('');
  let b = T(32, 34, 'One trading day becomes one candle', { size: 16, weight: 700 });
  b += T(70, 56, "The day's trades", { size: 12.5, weight: 600, fill: C.muted }) + T(560, 56, 'The candle', { size: 12.5, weight: 600, fill: C.muted, anchor: 'middle' });
  for (const p of [98, 100, 102, 104, 106]) b += `<line x1="70" x2="440" y1="${r(y(p))}" y2="${r(y(p))}" stroke="${C.grid}"/>` + T(62, y(p) + 4, String(p), { size: 11.5, fill: C.muted, anchor: 'end' });
  b += `<line x1="70" x2="660" y1="${r(yo)}" y2="${r(yo)}" stroke="${C.light}" stroke-dasharray="5 4"/>`;
  b += T(70, 304, 'Morning', { size: 11.5, fill: C.muted }) + T(420, 304, 'Close', { size: 11.5, fill: C.muted, anchor: 'end' });
  b += `<polyline class="${P}-line" points="${events.map((e) => `${r(e.x)},${r(e.y)}`).join(' ')}" fill="none" stroke="${C.slate}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  b += `<circle class="${P}-dot" cx="0" cy="0" r="6" fill="${C.teal}" stroke="${C.white}" stroke-width="2"/>`;
  // candle: wicks and body anchored on the open line, scaled in the vertical
  b += `<rect class="${P}-box ${P}-wu" x="558" y="${r(yo)}" width="4" height="1" fill="${C.text}"/>`;
  b += `<rect class="${P}-box ${P}-wl" x="558" y="${r(yo)}" width="4" height="1" fill="${C.text}"/>`;
  b += `<rect class="${P}-box ${P}-body" x="536" y="${r(yo)}" width="48" height="1"/>`;
  b += `<path class="${P}-mark" d="M594 0l9-6v12z" fill="${C.teal}"/>`;
  b += T(530, yo + 4, 'Open 100', { anchor: 'end', size: 12.5, weight: 600, fill: C.muted });
  b += T(612, y(106) + 4, 'High 106', { size: 12.5, weight: 700, cls: `${P}-hi` });
  b += T(612, y(98) + 4, 'Low 98', { size: 12.5, weight: 700, cls: `${P}-lo` });
  b += T(612, y(104) + 4, 'Close 104', { size: 12.5, weight: 700, fill: C.up, cls: `${P}-cl` });
  write(name, doc(name, W, H, css, b, "Animation: a day's prices move from 100 down to a low of 98, up to a high of 106 and close at 104, and the candle grows with them: a rising body from 100 to 104 with wicks to 106 and 98"));
}

// ---- 2. A market order filling against the order book (F: market-and-limit-orders) ---------------
{
  const name = 'market-order-fill';
  const P = 'mo';
  const W = 720;
  const H = 300;
  const DUR = 8;
  const at = (s) => s / DUR;
  const css = [
    `.${P}-shrink{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}`,
    `@keyframes ${P}-pill{0%{transform:translateY(24px);opacity:0}${pctKey(at(1.2))},100%{transform:translateY(0);opacity:1}}`,
    `@keyframes ${P}-a{0%,${pctKey(at(1.6))}{transform:scaleX(1)}${pctKey(at(3))},100%{transform:scaleX(0)}}`,
    `@keyframes ${P}-b{0%,${pctKey(at(3.3))}{transform:scaleX(1)}${pctKey(at(5))},100%{transform:scaleX(0)}}`,
    `@keyframes ${P}-t1{0%,${pctKey(at(3.3) - 0.001)}{opacity:1}${pctKey(at(3.3))},100%{opacity:0}}`,
    `@keyframes ${P}-t2{0%,${pctKey(at(3.3) - 0.001)}{opacity:0}${pctKey(at(3.3))},${pctKey(at(5.2) - 0.001)}{opacity:1}${pctKey(at(5.2))},100%{opacity:0}}`,
    `.${P}-t1,.${P}-t2{opacity:0}`,
    fadeIn(`${P}-f1`, at(3)),
    fadeIn(`${P}-f2`, at(5)),
    fadeIn(`${P}-f3`, at(5.6)),
    fadeIn(`${P}-done`, at(5.2)),
    `.anim-armed .${P}-pill{animation:${P}-pill ${DUR}s ease-out both}`,
    `.anim-armed .${P}-a{animation:${P}-a ${DUR}s linear both}`,
    `.anim-armed .${P}-b{animation:${P}-b ${DUR}s linear both}`,
    `.anim-armed .${P}-t1{animation:${P}-t1 ${DUR}s linear both}`,
    `.anim-armed .${P}-t2{animation:${P}-t2 ${DUR}s linear both}`,
    ...['f1', 'f2', 'f3', 'done'].map((k) => `.anim-armed .${P}-${k}{animation:${P}-${k} ${DUR}s linear both}`),
  ].join('');
  let b = T(32, 34, 'A market order to buy 500 shares', { size: 16, weight: 700 });
  b += T(40, 66, 'Sellers in the order book', { weight: 600, fill: C.muted });
  const levels = [
    [20.1, 300, 'b'],
    [20.02, 200, 'a'],
  ];
  levels.forEach(([price, qty, k], i) => {
    const yy = 80 + i * 56;
    b += `<rect x="40" y="${yy}" width="300" height="44" rx="8" fill="${C.pale}" stroke="${C.light}"/>`;
    b += T(56, yy + 28, eur(price, 2), { weight: 700, size: 15 });
    b += `<rect x="140" y="${yy + 12}" width="${qty * 0.48}" height="20" rx="4" fill="none" stroke="${C.light}" stroke-dasharray="3 3"/>`;
    b += `<rect class="${P}-shrink ${P}-${k}" x="140" y="${yy + 12}" width="${qty * 0.48}" height="20" rx="4" fill="${C.teal}"/>`;
    b += T(150 + qty * 0.48, yy + 27, `${qty} shares`, { size: 12.5, fill: C.muted });
  });
  b += `<line x1="40" x2="340" y1="212" y2="212" stroke="${C.navy}" stroke-width="2" stroke-dasharray="5 4"/>`;
  b += T(40, 232, 'Last price on your screen: €20.00', { size: 12.5, weight: 600, fill: C.navy });
  // the incoming order
  b += `<g class="${P}-pill"><rect x="40" y="250" width="300" height="34" rx="17" fill="${C.navy}"/>`;
  b += T(190, 272, 'Buy 500 at market', { anchor: 'middle', weight: 700, fill: C.white, cls: `${P}-t1` });
  b += T(190, 272, '300 still to buy', { anchor: 'middle', weight: 700, fill: C.white, cls: `${P}-t2` });
  b += T(190, 272, 'Filled: 500 shares', { anchor: 'middle', weight: 700, fill: C.white, cls: `${P}-done` });
  b += `</g>`;
  const rx = 400;
  b += `<rect x="${rx}" y="80" width="290" height="190" rx="10" fill="${C.white}" stroke="${C.light}"/>`;
  b += T(rx + 18, 106, 'What you pay', { weight: 700 });
  b += T(rx + 18, 136, `200 × ${eur(20.02, 2)} = ${eur(4004)}`, { cls: `${P}-f1` });
  b += T(rx + 18, 162, `300 × ${eur(20.1, 2)} = ${eur(6030)}`, { cls: `${P}-f2` });
  b += `<g class="${P}-f3"><line x1="${rx + 18}" x2="${rx + 272}" y1="176" y2="176" stroke="${C.grid}"/>`;
  b += T(rx + 18, 198, `Total ${eur(10034)} · about ${eur(20.07, 2)} a share`, { weight: 700 });
  b += T(rx + 18, 224, 'Expected at €20.00: €10,000', { size: 12.5, fill: C.muted });
  b += T(rx + 18, 248, 'Slippage: about €34', { size: 12.5, weight: 700, fill: C.down }) + `</g>`;
  write(name, doc(name, W, H, css, b, 'Animation: a market order to buy 500 shares first takes all 200 shares offered at €20.02, then the 300 at €20.10; it costs €10,034 in total, about €20.07 a share instead of the €20.00 last price, about €34 of slippage'));
}

// ---- 3. Compound versus simple growth, year by year (G: compound-growth; €10,000 at 5% for 30 years) ----
{
  const name = 'compound-growth';
  const P = 'cg';
  const W = 760;
  const H = 360;
  const DUR = 8;
  const years = 30;
  const x0 = 80;
  const step = 21;
  const base = 300;
  const k = 230 / 45000;
  const comp = (n) => 10000 * 1.05 ** n;
  const simple = (n) => 10000 + 500 * n;
  const delay = (n) => 0.3 + n * 0.19; // seconds
  const grow = 0.3;
  const css = [
    `.${P}-bar{transform-box:fill-box;transform-origin:50% 100%}`,
    `@keyframes ${P}-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}`,
    `@keyframes ${P}-fade{from{opacity:0}to{opacity:1}}`,
    `.anim-armed .${P}-bar{animation:${P}-grow ${grow}s ease-out both}`,
    `.anim-armed .${P}-lab{animation:${P}-fade .4s ease-out both}`,
  ].join('');
  let b = T(32, 34, '€10,000 at 5% a year: simple versus compound growth', { size: 16, weight: 700 });
  b += `<rect x="420" y="48" width="14" height="14" rx="3" fill="${C.light}"/>` + T(442, 60, 'Simple: interest on €10,000 only', { size: 12.5, fill: C.muted });
  b += `<rect x="420" y="70" width="14" height="14" rx="3" fill="${C.teal}"/>` + T(442, 82, 'Compound: interest on interest too', { size: 12.5, fill: C.muted });
  for (const v of [0, 10000, 20000, 30000, 40000]) b += `<line x1="${x0 - 6}" x2="${x0 + (years + 1) * step}" y1="${r(base - v * k)}" y2="${r(base - v * k)}" stroke="${C.grid}"/>` + T(x0 - 12, base - v * k + 4, v ? `€${v / 1000}k` : '€0', { size: 11.5, fill: C.muted, anchor: 'end' });
  for (let n = 0; n <= years; n++) {
    const x = x0 + n * step;
    const st = `style="animation-delay:${r(delay(n))}s"`;
    b += `<rect class="${P}-bar" ${st} x="${x}" y="${r(base - simple(n) * k)}" width="8" height="${r(simple(n) * k)}" fill="${C.light}"/>`;
    b += `<rect class="${P}-bar" ${st} x="${x + 9}" y="${r(base - comp(n) * k)}" width="8" height="${r(comp(n) * k)}" fill="${C.teal}"/>`;
    if (n % 5 === 0) b += T(x + 8, base + 18, String(n), { size: 11.5, fill: C.muted, anchor: 'middle' });
  }
  b += T(x0 + 15 * step, base + 38, 'Years', { size: 12, fill: C.muted, anchor: 'middle' });
  const label = (n, text, dy, fill) =>
    `<g class="${P}-lab" style="animation-delay:${r(delay(n) + grow)}s">${T(x0 + n * step + 13, base - comp(n) * k - dy, text, { size: 12.5, weight: 700, fill, anchor: 'middle' })}</g>`;
  b += label(10, eur(Math.round(comp(10))), 10, C.teal);
  b += label(20, eur(Math.round(comp(20))), 10, C.teal);
  b += label(30, eur(Math.round(comp(30))), 10, C.teal);
  b += `<g class="${P}-lab" style="animation-delay:${r(delay(30) + grow)}s">${T(x0 + 30 * step - 8, base - simple(30) * k - 10, eur(simple(30)), { size: 12.5, weight: 700, fill: C.slate, anchor: 'end' })}</g>`;
  write(name, doc(name, W, H, css, b, `Animation: €10,000 growing at 5% a year for 30 years; simple growth reaches €25,000, compound growth about ${eur(Math.round(comp(10)))} after 10 years, ${eur(Math.round(comp(20)))} after 20 and ${eur(Math.round(comp(30)))} after 30`));
}

// ---- 4. An opening auction finds one price (D: auctions-and-continuous-trading) -------------------
{
  const name = 'opening-auction';
  const P = 'oa';
  const W = 720;
  const H = 360;
  const DUR = 9;
  const at = (sec) => sec / DUR;
  const rows = [
    [20.2, 300, 1500],
    [20.1, 700, 1000],
    [20.0, 1000, 800],
    [19.9, 1600, 400],
  ];
  const best = 2; // €20.00: 800 shares, the most that can trade
  const k = 0.15; // px per share
  const xb = 300; // buyers' bars end here (grow to the left)
  const xs = 440; // sellers' bars start here
  const rowY = (i) => 100 + i * 56;
  const css = [
    `.${P}-bar{transform-box:fill-box}`,
    `.${P}-buy{transform-origin:100% 50%}`,
    `.${P}-sell{transform-origin:0 50%}`,
    `@keyframes ${P}-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`,
    `@keyframes ${P}-fade{from{opacity:0}to{opacity:1}}`,
    `@keyframes ${P}-dim{from{opacity:1}to{opacity:.4}}`,
    `.${P}-dim{opacity:.4}`,
    `.anim-armed .${P}-bar{animation:${P}-grow .7s ease-out both}`,
    `.anim-armed .${P}-can{animation:${P}-fade .4s ease-out both}`,
    `.anim-armed .${P}-dim{animation:${P}-dim .5s ease-out both;animation-delay:${at(6.2) * DUR}s}`,
    `.anim-armed .${P}-win{animation:${P}-fade .5s ease-out both;animation-delay:${at(6.2) * DUR}s}`,
    `.anim-armed .${P}-badge{animation:${P}-fade .5s ease-out both;animation-delay:${at(6.8) * DUR}s}`,
    `.anim-armed .${P}-end{animation:${P}-fade .1s linear both;animation-delay:${DUR - 0.1}s}`,
  ].join('');
  let b = T(32, 34, 'An opening auction: one price for everyone', { size: 16, weight: 700 });
  b += T(xb, 78, 'Buyers would buy', { anchor: 'end', size: 12.5, weight: 700, fill: C.up });
  b += T((xb + xs) / 2, 78, 'Price', { anchor: 'middle', size: 12.5, weight: 700, fill: C.muted });
  b += T(xs, 78, 'Sellers would sell', { size: 12.5, weight: 700, fill: C.down });
  rows.forEach(([price, buy, sell], i) => {
    const y = rowY(i);
    const d = `style="animation-delay:${r(0.3 + i * 0.45)}s"`;
    const canTrade = Math.min(buy, sell);
    const g = i === best ? '' : ` class="${P}-dim"`;
    b += `<g${g}>`;
    b += `<rect class="${P}-bar ${P}-buy" ${d} x="${xb - buy * k}" y="${y}" width="${buy * k}" height="20" rx="4" fill="${C.up}"/>`;
    b += T(xb - buy * k - 6, y + 15, buy.toLocaleString('en-GB'), { anchor: 'end', size: 12.5, weight: 700, fill: C.up });
    b += `<rect class="${P}-bar ${P}-sell" ${d} x="${xs}" y="${y}" width="${sell * k}" height="20" rx="4" fill="${C.down}"/>`;
    b += T(xs + sell * k + 6, y + 15, sell.toLocaleString('en-GB'), { size: 12.5, weight: 700, fill: C.down });
    b += T((xb + xs) / 2, y + 15, eur(price, 2), { anchor: 'middle', size: 14, weight: 700 });
    b += `<g class="${P}-can" style="animation-delay:${r(3.6 + i * 0.5)}s">${T((xb + xs) / 2, y + 36, `could trade ${canTrade.toLocaleString('en-GB')}`, { anchor: 'middle', size: 11.5, weight: 600, fill: C.muted })}</g>`;
    b += `</g>`;
  });
  const y = rowY(best);
  b += `<rect class="${P}-win" x="${xb + 4}" y="${y - 8}" width="${xs - xb - 8}" height="52" rx="10" fill="none" stroke="${C.teal}" stroke-width="2.5"/>`;
  b += `<g class="${P}-badge"><rect x="160" y="${rowY(3) + 50}" width="400" height="40" rx="20" fill="${C.navy}"/>`;
  b += T(360, rowY(3) + 75, 'Auction price €20.00: 800 shares trade at one price', { anchor: 'middle', size: 13.5, weight: 700, fill: C.white }) + `</g>`;
  b += `<g class="${P}-end"></g>`;
  write(name, doc(name, W, H, css, b, 'Animation: buy and sell orders collected for an opening auction; at €20.20 300 shares could trade, at €20.10 700, at €20.00 800 and at €19.90 400, so the auction price is €20.00 and 800 shares trade at that single price'));
}

// ---- 5. ETF arbitrage: creation and redemption keep the price near its value (H: how-etfs-work) -----
{
  const name = 'etf-arbitrage';
  const P = 'ea';
  const W = 760;
  const H = 360;
  const DUR = 9;
  // price scale for the gauge
  const py = (p) => 320 - ((p - 49.7) / 0.4) * 210;
  const boxes = [
    ['Exchange', 250],
    ['Authorised participant', 420],
    ['ETF (the fund)', 590],
  ];
  const bx = (i) => boxes[i][1] + 65; // box centre
  const BY = 92;
  const move = (id, x1, y1, x2, y2, t0, t1) =>
    `@keyframes ${P}-${id}{0%,${pctKey(t0 / DUR)}{transform:translate(${x1}px,${y1}px);opacity:0}${pctKey((t0 + 0.15) / DUR)}{opacity:1}${pctKey((t1 - 0.15) / DUR)}{opacity:1}${pctKey(t1 / DUR)},100%{transform:translate(${x2}px,${y2}px);opacity:0}}` +
    `.${P}-${id}{opacity:0}.anim-armed .${P}-${id}{animation:${P}-${id} ${DUR}s ease-in-out both}`;
  const step = (n, t0) =>
    `@keyframes ${P}-s${n}{0%,${pctKey(t0 / DUR)}{opacity:.35}${pctKey((t0 + 0.3) / DUR)},100%{opacity:1}}.anim-armed .${P}-s${n}{animation:${P}-s${n} ${DUR}s linear both}`;
  const css = [
    move('u1', bx(0), BY + 40, bx(1), BY + 40, 0.6, 2.6),
    move('u2', bx(1), BY + 40, bx(2), BY + 40, 3.4, 5.0),
    move('b1', bx(2), BY + 52, bx(1), BY + 52, 4.2, 5.8),
    move('b2', bx(1), BY + 52, bx(0), BY + 52, 6.2, 8.0),
    step(1, 0.5),
    step(2, 3.3),
    step(3, 6.1),
    `@keyframes ${P}-price{0%,${pctKey(0.8 / DUR)}{transform:translateY(${r(py(49.8))}px)}${pctKey(3.2 / DUR)},100%{transform:translateY(${r(py(50.0))}px)}}`,
    `.${P}-price{transform:translateY(${r(py(50.0))}px)}.anim-armed .${P}-price{animation:${P}-price ${DUR}s ease-in-out both}`,
    `@keyframes ${P}-t1{0%,${pctKey(3.2 / DUR)}{opacity:1}${pctKey(3.4 / DUR)},100%{opacity:0}}@keyframes ${P}-t2{0%,${pctKey(3.2 / DUR)}{opacity:0}${pctKey(3.4 / DUR)},100%{opacity:1}}`,
    `.${P}-t1{opacity:0}.anim-armed .${P}-t1{animation:${P}-t1 ${DUR}s linear both}.anim-armed .${P}-t2{animation:${P}-t2 ${DUR}s linear both}`,
  ].join('');
  let b = T(32, 34, 'How arbitrage pulls an ETF back to its value', { size: 16, weight: 700 });
  // gauge
  b += T(40, 66, 'ETF price on the exchange', { size: 12.5, weight: 600, fill: C.muted });
  for (const p of [49.7, 49.8, 49.9, 50.0, 50.1]) b += `<line x1="96" x2="200" y1="${r(py(p))}" y2="${r(py(p))}" stroke="${C.grid}"/>` + T(88, py(p) + 4, eur(p, 2), { anchor: 'end', size: 11.5, fill: C.muted });
  b += `<line x1="96" x2="200" y1="${r(py(50))}" y2="${r(py(50))}" stroke="${C.navy}" stroke-width="2" stroke-dasharray="5 4"/>`;
  b += `<line x1="40" x2="62" y1="84" y2="84" stroke="${C.navy}" stroke-width="2" stroke-dasharray="5 4"/>` + T(68, 88, 'Value of the holdings (NAV)', { size: 11.5, weight: 700, fill: C.navy });
  b += `<g class="${P}-price"><rect x="110" y="-11" width="76" height="22" rx="11" fill="${C.teal}"/><text class="${P}-t1" x="148" y="4" font-size="12" font-weight="700" fill="${C.white}" text-anchor="middle">${esc(eur(49.8, 2))}</text><text class="${P}-t2" x="148" y="4" font-size="12" font-weight="700" fill="${C.white}" text-anchor="middle">≈ ${esc(eur(50, 2))}</text></g>`;
  // boxes
  boxes.forEach(([label, x]) => {
    b += `<rect x="${x}" y="${BY}" width="130" height="64" rx="12" fill="${C.pale}" stroke="${C.light}"/>`;
    const words = label.split(' ');
    const lines = label.length > 16 ? [words.slice(0, 1).join(' '), words.slice(1).join(' ')] : [label];
    lines.forEach((l, j) => (b += T(x + 65, BY + 28 + j * 17 - (lines.length - 1) * 8, l, { anchor: 'middle', size: 13, weight: 700 })));
  });
  // tokens: ETF units (squares) and a basket of shares (bars)
  const unit = (cls) => `<g class="${cls}"><rect x="-14" y="-7" width="12" height="12" rx="2" fill="${C.teal}"/><rect x="2" y="-7" width="12" height="12" rx="2" fill="${C.teal}"/></g>`;
  const basket = (cls) => `<g class="${cls}"><rect x="-16" y="-8" width="7" height="12" rx="1.5" fill="${C.slate}"/><rect x="-6" y="-12" width="7" height="16" rx="1.5" fill="${C.navy}"/><rect x="4" y="-6" width="7" height="10" rx="1.5" fill="${C.slate}"/></g>`;
  b += unit(`${P}-u1`) + unit(`${P}-u2`) + basket(`${P}-b1`) + basket(`${P}-b2`);
  // step captions
  const caps = [
    ['1', 'Buys ETF units cheaply on the exchange at €49.80,', 'below the €50.00 value of the holdings.'],
    ['2', 'Redeems the units with the fund and receives', 'the underlying shares, worth €50.00 a unit.'],
    ['3', 'Sells those shares. The buying in step 1 has', 'pushed the ETF price back towards €50.'],
  ];
  caps.forEach(([n, a, c], i) => {
    const y = 196 + i * 50;
    b += `<g class="${P}-s${i + 1}"><circle cx="262" cy="${y + 2}" r="12" fill="${C.navy}"/>${T(262, y + 7, n, { anchor: 'middle', size: 12.5, weight: 700, fill: C.white })}`;
    b += T(284, y, a, { size: 13, weight: 600 }) + T(284, y + 18, c, { size: 12.5, fill: C.muted }) + `</g>`;
  });
  write(name, doc(name, W, H, css, b, 'Animation: an ETF trades at €49.80 while its holdings are worth €50.00 a unit; an authorised participant buys units on the exchange, which pushes the price up towards €50, redeems them with the fund for the underlying shares and sells those shares'));
}

// ---- 6. A 2-for-1 split (V: splits-and-bonus-shares; Investor.gov's example) ----------------------
{
  const name = 'stock-split';
  const P = 'ss';
  const W = 720;
  const H = 340;
  const DUR = 7;
  const cell = 18;
  const x0 = 70;
  const y0 = 68;
  const css = [
    `.${P}-cut{transform-box:fill-box;transform-origin:50% 0}`,
    `@keyframes ${P}-cut{from{transform:scaleY(0)}to{transform:scaleY(1)}}`,
    `@keyframes ${P}-in{0%,${pctKey(4 / DUR)}{opacity:0}${pctKey(4.5 / DUR)},100%{opacity:1}}`,
    `@keyframes ${P}-out{0%,${pctKey(4 / DUR)}{opacity:1}${pctKey(4.5 / DUR)},100%{opacity:0}}`,
    `.${P}-before{opacity:0}`,
    `.anim-armed .${P}-cut{animation:${P}-cut .35s ease-out both}`,
    `.anim-armed .${P}-before{animation:${P}-out ${DUR}s linear both}`,
    `.anim-armed .${P}-after{animation:${P}-in ${DUR}s linear both}`,
  ].join('');
  let b = T(32, 34, 'A 2-for-1 split: more, smaller slices of the same value', { size: 16, weight: 700 });
  b += `<rect x="${x0 - 3}" y="${y0 - 3}" width="${10 * cell + 6}" height="${10 * cell + 6}" rx="6" fill="${C.white}" stroke="${C.navy}" stroke-width="2"/>`;
  for (let rr = 0; rr < 10; rr++)
    for (let c = 0; c < 10; c++) b += `<rect x="${x0 + c * cell + 1}" y="${y0 + rr * cell + 1}" width="${cell - 2}" height="${cell - 2}" rx="2" fill="${C.teal}"/>`;
  // the cuts: one white line through the middle of each column of cells, sweeping left to right
  for (let c = 0; c < 10; c++)
    b += `<rect class="${P}-cut" style="animation-delay:${r(1 + c * 0.25)}s" x="${x0 + c * cell + cell / 2 - 1}" y="${y0}" width="2" height="${10 * cell}" fill="${C.white}"/>`;
  const tx = 330;
  const big = (y, s, cls, fill = C.text) => `<g class="${cls}">${T(tx, y, s, { size: 22, weight: 700, fill })}</g>`;
  b += T(tx, 96, 'Shares', { size: 12.5, weight: 600, fill: C.muted });
  b += big(124, '100', `${P}-before`) + big(124, '200', `${P}-after`);
  b += T(tx, 166, 'Price per share', { size: 12.5, weight: 600, fill: C.muted });
  b += big(194, '$100', `${P}-before`) + big(194, '$50', `${P}-after`);
  b += T(tx, 236, 'Total value', { size: 12.5, weight: 600, fill: C.muted });
  b += T(tx, 264, '$10,000', { size: 22, weight: 700, fill: C.navy }) + T(tx + 110, 264, 'unchanged', { size: 13, weight: 700, fill: C.up });
  b += T(32, 318, 'Your slice of the company stays the same; there are just more, cheaper shares.', { size: 12.5, fill: C.muted });
  write(name, doc(name, W, H, css, b, 'Animation: 100 shares at $100 each, worth $10,000, are each cut in two by a 2-for-1 split, giving 200 shares at $50 each, still worth $10,000'));
}

console.log(`Wrote ${out.length} animations: ${out.join(', ')}`);
