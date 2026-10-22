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
  amber: '#c98500',
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

// ---- 7. A buy limit order: filled, or left waiting (F: market-and-limit-orders) ----------------------
{
  const name = 'limit-order';
  const P = 'lo';
  const W = 740;
  const H = 330;
  const DUR = 8;
  const py = (p) => 260 - ((p - 46) / 16) * 190; // €46–62
  const panel = (x0, title, pts, cls) => {
    const xs = (i) => x0 + 20 + (i / (pts.length - 1)) * 270;
    const line = pts.map((p, i) => `${r(xs(i))},${r(py(p))}`).join(' ');
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(xs(i) - xs(i - 1), py(pts[i]) - py(pts[i - 1]));
    let g = T(x0 + 20, 74, title, { size: 13, weight: 700 });
    for (const p of [48, 50, 52, 56, 60]) g += `<line x1="${x0 + 20}" x2="${x0 + 290}" y1="${r(py(p))}" y2="${r(py(p))}" stroke="${C.grid}"/>` + T(x0 + 14, py(p) + 4, eur(p), { size: 11, fill: C.muted, anchor: 'end' });
    g += `<line x1="${x0 + 20}" x2="${x0 + 290}" y1="${r(py(50))}" y2="${r(py(50))}" stroke="${C.teal}" stroke-width="2" stroke-dasharray="6 4"/>`;
    g += T(x0 + 290, py(50) + 16, 'your buy limit €50', { size: 11.5, weight: 700, fill: C.teal, anchor: 'end' });
    g += `<polyline class="${P}-${cls}" points="${line}" fill="none" stroke="${C.slate}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" style="stroke-dasharray:${r(len)}"/>`;
    return { g, len, xs };
  };
  const a = panel(20, 'If the price falls to €50', [52, 52.6, 51.4, 51.8, 50.6, 50, 51, 52.4], 'la');
  const b = panel(390, 'If it never gets there', [52, 53, 52.4, 54, 55.5, 55, 57.5, 60], 'lb');
  const hit = a.xs(5);
  const css = [
    `@keyframes ${P}-draw-a{0%{stroke-dashoffset:${r(a.len)}}${pctKey(3.4 / DUR)},100%{stroke-dashoffset:0}}`,
    `@keyframes ${P}-draw-b{0%,${pctKey(4 / DUR)}{stroke-dashoffset:${r(b.len)}}${pctKey(7.4 / DUR)},100%{stroke-dashoffset:0}}`,
    `.${P}-la,.${P}-lb{stroke-dashoffset:0}`,
    `.anim-armed .${P}-la{animation:${P}-draw-a ${DUR}s linear both}`,
    `.anim-armed .${P}-lb{animation:${P}-draw-b ${DUR}s linear both}`,
    fadeIn(`${P}-hit`, 2.4 / DUR),
    fadeIn(`${P}-miss`, 7.4 / DUR),
    `.anim-armed .${P}-hit{animation:${P}-hit ${DUR}s linear both}`,
    `.anim-armed .${P}-miss{animation:${P}-miss ${DUR}s linear both}`,
  ].join('');
  let body = T(32, 34, 'A buy limit order at €50 while the share trades at €52', { size: 16, weight: 700 });
  body += a.g + b.g;
  body += `<g class="${P}-hit"><circle cx="${r(hit)}" cy="${r(py(50))}" r="8" fill="${C.up}" stroke="${C.white}" stroke-width="2"/>`;
  body += `<rect x="60" y="282" width="270" height="34" rx="17" fill="${C.up}"/>` + T(195, 304, 'Executed at €50 or less', { anchor: 'middle', weight: 700, fill: C.white }) + `</g>`;
  body += `<g class="${P}-miss"><rect x="430" y="282" width="270" height="34" rx="17" fill="${C.down}"/>` + T(565, 304, 'Never filled: you miss the rise to €60', { anchor: 'middle', size: 12.5, weight: 700, fill: C.white }) + `</g>`;
  write(name, doc(name, W, H, css, body, 'Animation: a buy limit order at €50 placed while the share trades at €52; if the price falls to €50 the order executes at €50 or less; if the price never falls that far the order stays unexecuted and you miss a rise to €60'));
}

// ---- 8. The cost-average effect (M: savings-plans-and-lump-sums; €100 a month) -----------------------
{
  const name = 'cost-average';
  const P = 'ca';
  const W = 760;
  const H = 360;
  const DUR = 8;
  const months = [
    [50, 2.0],
    [40, 2.5],
    [25, 4.0],
    [50, 2.0],
  ];
  const base = 300;
  const k = 3.6; // px per € of price
  const t0 = (i) => 0.3 + i * 1.3;
  const css = [
    `.${P}-bar{transform-box:fill-box;transform-origin:50% 100%}`,
    `@keyframes ${P}-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}`,
    `@keyframes ${P}-fade{from{opacity:0}to{opacity:1}}`,
    `.anim-armed .${P}-bar{animation:${P}-grow .5s ease-out both}`,
    `.anim-armed .${P}-f{animation:${P}-fade .45s ease-out both}`,
  ].join('');
  let b = T(32, 34, '€100 every month, whatever the price', { size: 16, weight: 700 });
  b += T(40, 66, 'Price per unit', { size: 12.5, weight: 600, fill: C.muted });
  months.forEach(([price, units], i) => {
    const x = 60 + i * 100;
    const st = (d) => `style="animation-delay:${r(t0(i) + d)}s"`;
    b += `<rect class="${P}-bar" ${st(0)} x="${x}" y="${r(base - price * k)}" width="56" height="${r(price * k)}" rx="5" fill="${C.light}"/>`;
    b += `<g class="${P}-f" ${st(0.3)}>${T(x + 28, base - price * k - 8, eur(price), { anchor: 'middle', weight: 700 })}</g>`;
    b += T(x + 28, base + 20, `Month ${i + 1}`, { anchor: 'middle', size: 12, fill: C.muted });
    // units bought: one block per half unit
    const blocks = Math.round(units * 2);
    let g = '';
    for (let j = 0; j < blocks; j++) g += `<rect x="${x + 8 + (j % 4) * 11}" y="${r(base - 16 - Math.floor(j / 4) * 12)}" width="9" height="9" rx="2" fill="${C.teal}"/>`;
    b += `<g class="${P}-f" ${st(0.6)}>${g}${T(x + 28, base + 38, `${units.toFixed(2)} units`, { anchor: 'middle', size: 12, weight: 700, fill: C.teal })}</g>`;
  });
  const rx = 470;
  b += `<rect x="${rx}" y="60" width="260" height="250" rx="12" fill="${C.white}" stroke="${C.light}"/>`;
  const line = (y, label, value, d, o = {}) =>
    `<g class="${P}-f" style="animation-delay:${r(d)}s">${T(rx + 18, y, label, { size: 12.5, fill: C.muted })}${T(rx + 242, y, value, { anchor: 'end', size: o.size ?? 13.5, weight: 700, fill: o.fill ?? C.text })}</g>`;
  b += T(rx + 18, 88, 'After four months', { weight: 700 });
  b += line(120, 'Invested', '€400', t0(3) + 1);
  b += line(146, 'Units bought', '10.50', t0(3) + 1.2);
  b += line(182, 'Average cost per unit', '≈ €38.10', t0(3) + 1.5, { fill: C.teal, size: 14.5 });
  b += line(208, 'Average of the four prices', '€41.25', t0(3) + 1.8);
  b += `<g class="${P}-f" style="animation-delay:${r(t0(3) + 2.2)}s"><line x1="${rx + 18}" x2="${rx + 242}" y1="226" y2="226" stroke="${C.grid}"/>${T(rx + 18, 252, 'Worth at €50: 10.5 × €50 = €525', { size: 13, weight: 700 })}${T(rx + 18, 276, 'a gain of 31%, although the price only', { size: 12, fill: C.muted })}${T(rx + 18, 293, 'returned to where it started', { size: 12, fill: C.muted })}</g>`;
  write(name, doc(name, W, H, css, b, 'Animation: €100 a month buys 2 units at €50, 2.5 at €40, 4 at €25 and 2 at €50: 10.5 units for €400, an average cost of about €38.10 against an average price of €41.25; at €50 the holding is worth €525'));
}

// ---- 9. Rebalancing back to 60/40 (M: rebalancing) -----------------------------------------------------
{
  const name = 'rebalancing';
  const P = 'rb';
  const W = 740;
  const H = 340;
  const DUR = 8;
  const at = (sec) => pctKey(sec / DUR);
  const base = 270;
  const k = 2.4; // px per € thousand
  const sx = 120;
  const bx = 300;
  const hS = (v) => r(v * k);
  const css = [
    `.${P}-sh{transform-box:fill-box;transform-origin:50% 100%}`,
    // shares: 60 → 75 (rise) → 69 (sell 6)
    `@keyframes ${P}-sh{0%,${at(0.6)}{transform:scaleY(${r(60 / 69)})}${at(2.4)},${at(4.6)}{transform:scaleY(${r(75 / 69)})}${at(6.2)},100%{transform:scaleY(1)}}`,
    `@keyframes ${P}-bo{0%,${at(4.6)}{transform:scaleY(${r(40 / 46)})}${at(6.2)},100%{transform:scaleY(1)}}`,
    `@keyframes ${P}-chip{0%,${at(4.4)}{transform:translate(0,${hS(-6)}px);opacity:0}${at(4.6)}{opacity:1;transform:translate(0,${hS(-6)}px)}${at(6.0)}{opacity:1;transform:translate(${bx - sx}px,${hS(-6)}px)}${at(6.3)},100%{opacity:0;transform:translate(${bx - sx}px,${hS(-6)}px)}}`,
    `.${P}-chip{opacity:0}`,
    `.anim-armed .${P}-shares{animation:${P}-sh ${DUR}s ease-in-out both}`,
    `.anim-armed .${P}-bonds{animation:${P}-bo ${DUR}s ease-in-out both}`,
    `.anim-armed .${P}-chip{animation:${P}-chip ${DUR}s ease-in-out both}`,
    ...[
      ['s1', 0, 2.4],
      ['s2', 2.4, 6.2],
      ['s3', 6.2, null],
    ].map(([id, from, to]) =>
      to === null
        ? `@keyframes ${P}-${id}{0%,${at(from)}{opacity:0}${at(from + 0.3)},100%{opacity:1}}.anim-armed .${P}-${id}{animation:${P}-${id} ${DUR}s linear both}`
        : `@keyframes ${P}-${id}{0%,${at(from)}{opacity:${from === 0 ? 1 : 0}}${at(from + 0.01)}{opacity:1}${at(to)}{opacity:1}${at(to + 0.01)},100%{opacity:0}}.${P}-${id}{opacity:0}.anim-armed .${P}-${id}{animation:${P}-${id} ${DUR}s linear both}`,
    ),
  ].join('');
  let b = T(32, 34, 'Rebalancing a 60/40 mix after a good year for shares', { size: 16, weight: 700 });
  b += `<line x1="80" x2="420" y1="${base}" y2="${base}" stroke="${C.text}" stroke-width="1.5"/>`;
  // final heights: shares 69, bonds 46 (€ thousand); earlier frames are scaled versions of these
  b += `<rect class="${P}-sh ${P}-shares" x="${sx}" y="${base - 69 * k}" width="90" height="${69 * k}" rx="6" fill="${C.navy}"/>`;
  b += `<rect class="${P}-sh ${P}-bonds" x="${bx}" y="${base - 46 * k}" width="90" height="${46 * k}" rx="6" fill="${C.light}"/>`;
  b += `<g class="${P}-chip"><rect x="${sx + 10}" y="${base - 75 * k}" width="70" height="${6 * k * 2.2}" rx="5" fill="${C.amber}"/>${T(sx + 45, base - 75 * k + 22, '€6,000', { anchor: 'middle', size: 12.5, weight: 700, fill: C.white })}</g>`;
  b += T(sx + 45, base + 22, 'Shares', { anchor: 'middle', weight: 700 }) + T(bx + 45, base + 22, 'Bonds', { anchor: 'middle', weight: 700 });
  const card = (cls, lines) =>
    `<g class="${cls}"><rect x="450" y="70" width="270" height="170" rx="12" fill="${C.white}" stroke="${C.light}"/>${lines
      .map(([s, o], i) => T(468, 100 + i * 26, s, o))
      .join('')}</g>`;
  b += card(`${P}-s1`, [
    ['Start: €100,000', { weight: 700 }],
    ['Shares €60,000 · bonds €40,000', {}],
    ['Mix: 60% shares', { weight: 700, fill: C.navy }],
  ]);
  b += card(`${P}-s2`, [
    ['Shares rise 25%, bonds stay flat', { weight: 700 }],
    ['Shares €75,000 · bonds €40,000', {}],
    ['Total €115,000', {}],
    ['Mix: 75 ÷ 115 = 65% shares', { weight: 700, fill: C.amber }],
  ]);
  b += card(`${P}-s3`, [
    ['Back to 60/40', { weight: 700 }],
    ['Target: 0.60 × €115,000 = €69,000', { size: 12.5 }],
    ['Sell €6,000 shares, buy €6,000 bonds', { size: 12.5 }],
    ['Shares €69,000 · bonds €46,000', {}],
    ['Mix: 60% shares again', { weight: 700, fill: C.up }],
  ]);
  write(name, doc(name, W, H, css, b, 'Animation: a €100,000 portfolio with €60,000 in shares and €40,000 in bonds; shares rise 25% to €75,000, so the mix drifts to 65% shares; selling €6,000 of shares and buying €6,000 of bonds restores 60/40 with €69,000 and €46,000'));
}

// ---- 10. A short sale: limited gain, unlimited loss (N: short-selling) ---------------------------------
{
  const name = 'short-sale';
  const P = 'sh';
  const W = 760;
  const H = 360;
  const DUR = 9;
  const py = (p) => 320 - (p / 200) * 260; // €0–200
  const steps = [
    ['1', 'Borrow 100 shares'],
    ['2', 'Sell them at €50: you receive €5,000'],
    ['3', 'Later, buy 100 shares back'],
    ['4', 'Return them to the lender'],
  ];
  const outcomes = [
    [40, 'Buy back at €40: €4,000', 'Profit €1,000', C.up, 3.0],
    [80, 'Buy back at €80: €8,000', 'Loss €3,000', C.down, 5.0],
    [200, 'Buy back at €200: €20,000', 'Loss €15,000, three times what you received', C.down, 7.2],
  ];
  const css = [
    `@keyframes ${P}-mk{0%,${pctKey(1.6 / DUR)}{transform:translateY(${r(py(50))}px)}${pctKey(2.8 / DUR)},${pctKey(3.6 / DUR)}{transform:translateY(${r(py(40))}px)}${pctKey(4.8 / DUR)},${pctKey(5.6 / DUR)}{transform:translateY(${r(py(80))}px)}${pctKey(7.0 / DUR)},100%{transform:translateY(${r(py(200))}px)}}`,
    `.${P}-mk{transform:translateY(${r(py(200))}px)}.anim-armed .${P}-mk{animation:${P}-mk ${DUR}s ease-in-out both}`,
    ...steps.map((_, i) => fadeIn(`${P}-st${i}`, (0.2 + i * 0.45) / DUR) + `.anim-armed .${P}-st${i}{animation:${P}-st${i} ${DUR}s linear both}`),
    ...outcomes.map(([, , , , t], i) => fadeIn(`${P}-o${i}`, t / DUR) + `.anim-armed .${P}-o${i}{animation:${P}-o${i} ${DUR}s linear both}`),
  ].join('');
  let b = T(32, 34, 'Selling short 100 shares at €50', { size: 16, weight: 700 });
  steps.forEach(([n, s], i) => {
    const y = 74 + i * 36;
    b += `<g class="${P}-st${i}"><circle cx="48" cy="${y - 4}" r="12" fill="${C.navy}"/>${T(48, y + 1, n, { anchor: 'middle', size: 12.5, weight: 700, fill: C.white })}${T(70, y, s, { size: 13, weight: 600 })}</g>`;
  });
  // price ruler
  const rx = 390;
  for (const p of [0, 50, 100, 150, 200]) b += `<line x1="${rx}" x2="${rx + 26}" y1="${r(py(p))}" y2="${r(py(p))}" stroke="${C.grid}"/>` + T(rx - 6, py(p) + 4, eur(p), { size: 11.5, fill: C.muted, anchor: 'end' });
  b += `<line x1="${rx + 13}" x2="${rx + 13}" y1="${r(py(200))}" y2="${r(py(0))}" stroke="${C.light}" stroke-width="3" stroke-linecap="round"/>`;
  b += `<line x1="${rx}" x2="${rx + 345}" y1="${r(py(50))}" y2="${r(py(50))}" stroke="${C.navy}" stroke-dasharray="5 4"/>` + T(rx + 345, py(50) - 6, 'sold at €50', { size: 11.5, weight: 700, fill: C.navy, anchor: 'end' });
  outcomes.forEach(([p, a, c, fill], i) => {
    const y = py(p);
    const ty = i === 0 ? y + 22 : y - 4;
    b += `<g class="${P}-o${i}"><circle cx="${rx + 13}" cy="${r(y)}" r="6" fill="${fill}"/>${T(rx + 40, ty, a, { size: 12.5, weight: 600 })}${T(rx + 40, ty + 17, c, { size: 12.5, weight: 700, fill })}</g>`;
  });
  b += `<g class="${P}-mk"><path d="M${rx - 2} 0l-9-6v12z" fill="${C.teal}"/></g>`;
  b += T(32, 236, 'The most you can gain is the €5,000 you received,', { size: 12.5, fill: C.muted }) + T(32, 254, 'if the price falls to zero. The loss has no limit.', { size: 12.5, weight: 700, fill: C.down });
  write(name, doc(name, W, H, css, b, 'Animation: you sell 100 borrowed shares at €50 and receive €5,000; buying back at €40 costs €4,000, a €1,000 profit; at €80 it costs €8,000, a €3,000 loss; at €200 it costs €20,000, a €15,000 loss; the gain is limited but the loss is not'));
}

// ---- 11. A margin call (N: leverage-and-margin) ------------------------------------------------------
{
  const name = 'margin-call';
  const P = 'mc';
  const W = 760;
  const H = 360;
  const DUR = 8;
  const at = (sec) => pctKey(sec / DUR);
  const base = 300;
  const k = 0.022; // px per €
  const x = 60;
  const css = [
    `.${P}-eq{transform-box:fill-box;transform-origin:50% 100%}`,
    // equity bar sits on top of the loan: €5,000 shrinking to €2,000 (final), so scale from 5000/2000 to 1
    `@keyframes ${P}-eq{0%,${at(1)}{transform:scaleY(2.5)}${at(4)},100%{transform:scaleY(1)}}`,
    `.anim-armed .${P}-eq{animation:${P}-eq ${DUR}s ease-in-out both}`,
    `@keyframes ${P}-gauge{0%,${at(1)}{transform:scaleX(${r(50 / 28.57)})}${at(4)},100%{transform:scaleX(1)}}`,
    `.${P}-gfill{transform-box:fill-box;transform-origin:0 50%}.anim-armed .${P}-gfill{animation:${P}-gauge ${DUR}s ease-in-out both}`,
    `@keyframes ${P}-t50{0%,${at(3.9)}{opacity:1}${at(4)},100%{opacity:0}}@keyframes ${P}-t29{0%,${at(3.9)}{opacity:0}${at(4)},100%{opacity:1}}`,
    `.${P}-t50{opacity:0}.anim-armed .${P}-t50{animation:${P}-t50 ${DUR}s linear both}.anim-armed .${P}-t29{animation:${P}-t29 ${DUR}s linear both}`,
    `@keyframes ${P}-p10{0%,${at(3.9)}{opacity:1}${at(4)},100%{opacity:0}}@keyframes ${P}-p7{0%,${at(3.9)}{opacity:0}${at(4)},100%{opacity:1}}`,
    `.${P}-p10{opacity:0}.anim-armed .${P}-p10{animation:${P}-p10 ${DUR}s linear both}.anim-armed .${P}-p7{animation:${P}-p7 ${DUR}s linear both}`,
    fadeIn(`${P}-call`, 4.4 / DUR) + `.anim-armed .${P}-call{animation:${P}-call ${DUR}s linear both}`,
    fadeIn(`${P}-sold`, 6 / DUR) + `.anim-armed .${P}-sold{animation:${P}-sold ${DUR}s linear both}`,
  ].join('');
  let b = T(32, 34, 'Buying €10,000 of shares with €5,000 of your own money', { size: 16, weight: 700 });
  b += `<rect x="${x}" y="${base - 5000 * k}" width="110" height="${5000 * k}" rx="6" fill="${C.slate}"/>` + T(x + 55, base - 2500 * k + 5, 'Loan €5,000', { anchor: 'middle', size: 12.5, weight: 700, fill: C.white });
  b += `<rect class="${P}-eq" x="${x}" y="${base - 7000 * k}" width="110" height="${2000 * k}" rx="6" fill="${C.teal}"/>`;
  b += T(x + 55, base + 22, 'Your position', { anchor: 'middle', weight: 700 });
  b += `<g class="${P}-p10">${T(x + 124, base - 10000 * k + 14, 'Worth €10,000', { size: 12.5, weight: 700 })}${T(x + 124, base - 7500 * k + 4, 'Your money €5,000', { size: 12.5, weight: 700, fill: C.teal })}</g>`;
  b += `<g class="${P}-p7">${T(x + 124, base - 7000 * k + 14, 'Shares fall 30%: €7,000', { size: 12.5, weight: 700 })}${T(x + 124, base - 7000 * k + 34, 'Yours: €7,000 − €5,000', { size: 12.5, weight: 700, fill: C.teal })}${T(x + 124, base - 7000 * k + 52, '= €2,000', { size: 12.5, weight: 700, fill: C.teal })}</g>`;
  // equity share gauge
  const gx = 470;
  const gw = 260;
  b += T(gx, 86, 'Your equity as a share of the position', { size: 12.5, weight: 600, fill: C.muted });
  b += `<rect x="${gx}" y="98" width="${gw}" height="22" rx="11" fill="${C.pale}" stroke="${C.light}"/>`;
  b += `<rect class="${P}-gfill" x="${gx}" y="98" width="${r(gw * 0.2857)}" height="22" rx="11" fill="${C.teal}"/>`;
  b += `<line x1="${r(gx + gw * 0.3)}" x2="${r(gx + gw * 0.3)}" y1="92" y2="126" stroke="${C.down}" stroke-width="2.5"/>` + T(gx + gw * 0.3, 142, 'broker minimum 30%', { size: 11.5, weight: 700, fill: C.down, anchor: 'middle' });
  b += `<g class="${P}-t50">${T(gx + gw, 86, '50%', { size: 13, weight: 700, anchor: 'end' })}</g><g class="${P}-t29">${T(gx + gw, 86, '29%', { size: 13, weight: 700, fill: C.down, anchor: 'end' })}</g>`;
  b += `<g class="${P}-call"><rect x="${gx}" y="160" width="${gw}" height="50" rx="10" fill="${C.down}"/>${T(gx + gw / 2, 181, 'Margin call', { anchor: 'middle', size: 14, weight: 700, fill: C.white })}${T(gx + gw / 2, 199, 'add money, or the broker sells', { anchor: 'middle', size: 12.5, fill: C.white })}</g>`;
  b += `<g class="${P}-sold">${T(gx, 238, 'If it sells at €7,000, you keep €2,000:', { size: 13, weight: 700 })}${T(gx, 258, 'a 60% loss on your own money', { size: 13, weight: 700, fill: C.down })}${T(gx, 276, 'from a 30% fall.', { size: 13, weight: 700, fill: C.down })}${T(gx, 302, 'If the shares recover later,', { size: 12.5, fill: C.muted })}${T(gx, 320, 'you no longer own them.', { size: 12.5, fill: C.muted })}</g>`;
  write(name, doc(name, W, H, css, b, 'Animation: €10,000 of shares bought with €5,000 of your own money and a €5,000 loan; the shares fall 30% to €7,000, your equity drops to €2,000 or 29% of the position, below the broker\'s 30% minimum; a margin call follows, and if the broker sells you keep €2,000, a 60% loss'));
}

console.log(`Wrote ${out.length} animations: ${out.join(', ')}`);
