#!/usr/bin/env node
/**
 * Generates concept diagrams for lessons outside the Chart School (original SVG artwork).
 * Every number drawn here comes from the worked example of the lesson the image belongs to;
 * change the lesson and the drawing together. Output: content/lessons/<topic>/img/<name>.svg.
 * Run with `npm run build:lesson-images` and commit the SVGs.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ---- Style ------------------------------------------------------------------------------------
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
const r1 = (n) => Math.round(n * 10) / 10;

function doc(W, H, body, title, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}" font-family="${FONT}"><title>${esc(title)}</title>${defs ? `<defs>${defs}</defs>` : ''}<rect width="${W}" height="${H}" rx="14" fill="${C.white}"/>${body}</svg>\n`;
}
const T = (x, y, s, o = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" font-size="${o.size ?? 13}" font-weight="${o.weight ?? 500}" fill="${o.fill ?? C.text}" text-anchor="${o.anchor ?? 'start'}"${o.italic ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const R = (x, y, w, h, fill, o = {}) =>
  `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(Math.max(0, w))}" height="${r1(Math.max(0, h))}" rx="${o.rx ?? 4}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1.5}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
const L = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${o.stroke ?? C.muted}" stroke-width="${o.w ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.arrow ? ` marker-end="url(#${o.arrow})"` : ''} stroke-linecap="round"/>`;
const P = (d, o = {}) =>
  `<path d="${d}" fill="${o.fill ?? 'none'}" stroke="${o.stroke ?? C.muted}" stroke-width="${o.w ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.arrow ? ` marker-end="url(#${o.arrow})"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
const arrowDef = (id, color) =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="${color}"/></marker>`;
const eur = (n, d = 0) => `€${n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const pct = (n, d = 0) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
const legend = (x, y, items) =>
  items
    .map(([color, label], i) => R(x, y + i * 22 - 11, 14, 14, color, { rx: 3 }) + T(x + 22, y + i * 22, label, { size: 12.5, fill: C.muted }))
    .join('');
/** Box with up to three centred lines of text. */
const box = (x, y, w, h, lines, o = {}) =>
  R(x, y, w, h, o.fill ?? C.pale, { rx: 10, stroke: o.stroke ?? C.light }) +
  lines.map((s, i) => T(x + w / 2, y + h / 2 + (i - (lines.length - 1) / 2) * 18 + 5, s, { anchor: 'middle', size: i === 0 ? 14 : 12.5, weight: i === 0 ? 700 : 500, fill: i === 0 ? (o.titleFill ?? C.text) : C.muted })).join('');

const files = [];
function write(topic, name, svg) {
  const dir = join('content/lessons', topic, 'img');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), svg);
  files.push(`${topic}/img/${name}`);
}

// ---- C: share classes and voting (lesson: share-classes-and-voting) ------------------------
{
  const W = 720;
  const H = 280;
  const x0 = 40;
  const bw = 640;
  const founderVotes = 100 / 190; // 10 m Class B × 10 votes vs 90 m Class A × 1 vote
  const rows = [
    ['Share of the economic value (dividends)', 0.1],
    ['Share of the votes', founderVotes],
  ];
  let b = T(x0, 38, 'One company, two very different shares of control', { size: 16, weight: 700 });
  rows.forEach(([label, f], i) => {
    const y = 74 + i * 78;
    b += T(x0, y, label, { weight: 600, fill: C.muted });
    b += R(x0, y + 10, bw * f, 40, C.navy, { rx: 6 }) + R(x0 + bw * f, y + 10, bw * (1 - f), 40, C.light, { rx: 6 });
    b += T(x0 + Math.max(bw * f, 46) - 10, y + 36, `${Math.round(f * 100)}%`, { anchor: 'end', weight: 700, fill: C.white });
    b += T(x0 + bw - 12, y + 36, `${Math.round((1 - f) * 100)}%`, { anchor: 'end', weight: 700, fill: C.navy });
  });
  b += legend(x0, 236, [[C.navy, 'Founder: 10 million Class B shares with 10 votes each']]);
  b += legend(x0 + 360, 236, [[C.light, 'Public: 90 million Class A shares, 1 vote each']]);
  write('C', 'dual-class-votes.svg', doc(W, H, b, 'Dual-class example: the founder holds 10% of the economic value but about 53% of the votes (100 of 190 million votes)'));
}

// ---- E: a trading day in Vienna, with the NYSE (lesson: regular-trading-hours) -----------------
{
  const W = 760;
  const H = 300;
  const x0 = 60;
  const x1 = 730;
  const start = 8 * 60;
  const end = 22 * 60;
  const X = (h, m = 0) => x0 + ((h * 60 + m - start) / (end - start)) * (x1 - x0);
  const seg = (y, a, b, fill) => R(X(...a), y, Math.max(4, X(...b) - X(...a)), 30, fill, { rx: 3 });
  let b = T(x0, 36, 'A normal trading day, in Vienna time', { size: 16, weight: 700 });
  for (let h = 8; h <= 22; h += 2) b += L(X(h), 58, X(h), 212, { stroke: C.grid, w: 1 }) + T(X(h), 230, `${String(h).padStart(2, '0')}:00`, { anchor: 'middle', size: 12, fill: C.muted });
  // overlap
  b += R(X(15, 30), 60, X(17, 30) - X(15, 30), 150, 'rgba(14,159,154,0.10)', { rx: 6, stroke: C.teal, dash: '4 4', sw: 1.2 });
  b += T((X(15, 30) + X(17, 30)) / 2, 74, 'Both open', { anchor: 'middle', size: 12, weight: 700, fill: C.teal });
  // Vienna
  const yV = 96;
  b += T(x0 - 6, yV - 8, 'Vienna Stock Exchange (ATX shares)', { size: 12.5, weight: 600, fill: C.muted });
  b += seg(yV, [8, 0], [8, 55], C.light) + seg(yV, [8, 55], [9, 0], C.amber) + seg(yV, [9, 0], [12, 0], C.teal) + seg(yV, [12, 0], [12, 3], C.amber);
  b += seg(yV, [12, 3], [17, 30], C.teal) + seg(yV, [17, 30], [17, 35], C.amber) + seg(yV, [17, 35], [17, 45], C.slate) + seg(yV, [17, 45], [17, 50], C.light);
  b += T(X(10, 30), yV + 20, '09:00–17:30', { anchor: 'middle', size: 12, weight: 700, fill: C.white });
  // NYSE
  const yN = 166;
  b += T(x0 - 6, yN - 8, 'New York Stock Exchange core session (normally)', { size: 12.5, weight: 600, fill: C.muted });
  b += seg(yN, [15, 30], [22, 0], C.navy);
  b += T(X(18, 45), yN + 20, '15:30–22:00', { anchor: 'middle', size: 12, weight: 700, fill: C.white });
  b += legend(x0, 264, [[C.teal, 'Continuous trading']]) + legend(x0 + 170, 264, [[C.amber, 'Auctions (open, midday, close)']]);
  b += legend(x0 + 400, 264, [[C.slate, 'Trade at close']]) + legend(x0 + 540, 264, [[C.light, 'Pre- and post-trading']]);
  write('E', 'trading-day-vienna.svg', doc(W, H, b, 'Timeline of a normal trading day in Vienna time: Vienna opening auction 08:55, continuous trading 09:00 to 17:30 with a short midday auction, closing auction 17:30 to 17:35, trade at close to 17:45; the NYSE core session normally runs 15:30 to 22:00 Vienna time, so both are open from 15:30 to 17:30'));
}

// ---- H: how an ETF works (lesson: how-etfs-work) -----------------------------------------------
{
  const W = 760;
  const H = 360;
  const defs = arrowDef('ha', C.slate) + arrowDef('ht', C.teal);
  let b = T(40, 36, 'Two markets for one ETF', { size: 16, weight: 700 });
  // zone labels
  b += R(24, 54, 712, 120, 'rgba(14,159,154,0.06)', { rx: 12 });
  b += T(40, 76, '1 · On the exchange, all day: investors trade existing units with each other', { size: 12.5, weight: 600, fill: C.teal });
  b += R(24, 190, 712, 150, 'rgba(15,42,68,0.05)', { rx: 12 });
  b += T(40, 212, '2 · With the fund, in large blocks: units are created and redeemed', { size: 12.5, weight: 600, fill: C.navy });
  b += box(48, 92, 170, 64, ['You and other', 'investors'], { fill: C.white });
  b += box(296, 92, 170, 64, ['Stock exchange', 'ETF units change hands'], { fill: C.white });
  b += box(544, 92, 170, 64, ['Authorised', 'participant'], { fill: C.white });
  b += L(222, 116, 290, 116, { stroke: C.teal, w: 2, arrow: 'ht' }) + L(290, 132, 222, 132, { stroke: C.teal, w: 2, arrow: 'ht' });
  b += T(256, 108, 'buy', { anchor: 'middle', size: 11.5, fill: C.muted }) + T(256, 148, 'sell', { anchor: 'middle', size: 11.5, fill: C.muted });
  b += L(470, 116, 538, 116, { stroke: C.teal, w: 2, arrow: 'ht' }) + L(538, 132, 470, 132, { stroke: C.teal, w: 2, arrow: 'ht' });
  b += box(544, 236, 170, 84, ['ETF (the fund)', 'holds a basket of', 'shares or bonds'], { fill: C.white, stroke: C.navy });
  b += L(600, 160, 600, 230, { stroke: C.slate, w: 2, arrow: 'ha' }) + L(660, 230, 660, 160, { stroke: C.slate, w: 2, arrow: 'ha' });
  b += T(530, 254, 'Creation ↓', { anchor: 'end', size: 12.5, weight: 700, fill: C.slate }) + T(530, 270, 'basket in, new units out', { anchor: 'end', size: 12, fill: C.muted });
  b += T(530, 294, 'Redemption ↑', { anchor: 'end', size: 12.5, weight: 700, fill: C.slate }) + T(530, 310, 'units in, basket out', { anchor: 'end', size: 12, fill: C.muted });
  b += T(40, 252, 'Arbitrage by authorised', { size: 12, fill: C.muted }) + T(40, 270, 'participants keeps the ETF', { size: 12, fill: C.muted }) + T(40, 288, 'price close to its value (NAV)', { size: 12, fill: C.muted });
  write('H', 'how-an-etf-works.svg', doc(W, H, b, 'How an ETF works: investors buy and sell existing ETF units on the exchange all day; authorised participants create new units by delivering a basket of securities to the fund, or redeem units for the basket, which keeps the price close to the fund\'s value', defs));
}

// ---- I: Alpenrad AG balance sheet (lesson: balance-sheet) -------------------------------------
{
  const W = 780;
  const H = 420;
  const top = 70;
  const k = 0.62; // px per € million (500 → 310 px)
  const colW = 230;
  const xa = 140;
  const xl = 430;
  const stack = (x, items) => {
    let y = top;
    let s = '';
    for (const [label, v, fill, ink] of items) {
      const h = v * k;
      s += R(x, y, colW, h - 2, fill, { rx: 4 });
      if (h >= 22) s += T(x + 10, y + h / 2 + 4, label, { size: 12.5, weight: 600, fill: ink }) + T(x + colW - 10, y + h / 2 + 4, String(v), { size: 12.5, weight: 700, fill: ink, anchor: 'end' });
      y += h;
    }
    return s;
  };
  let b = T(40, 36, 'Alpenrad AG balance sheet, 31 December 2025 (€ millions)', { size: 16, weight: 700 });
  b += T(xa + colW / 2, top - 10, 'What it owns: assets 500', { anchor: 'middle', weight: 700, fill: C.muted });
  b += T(xl + colW / 2, top - 10, 'Who financed it: 300 + 200', { anchor: 'middle', weight: 700, fill: C.muted });
  b += stack(xa, [
    ['Cash', 40, '#CFE9E7', C.text],
    ['Receivables', 60, '#A9DAD7', C.text],
    ['Inventory', 100, '#6FC3BE', C.text],
    ['Property, plant, equipment', 220, C.slate, C.white],
    ['Intangible assets', 80, '#2C5674', C.white],
  ]);
  b += stack(xl, [
    ['Current liabilities', 120, '#F3D9D7', C.text],
    ['Long-term loans and bonds', 130, '#E3AFAB', C.text],
    ['Provisions and other', 50, '#D58C86', C.text],
    ["Shareholders' equity", 200, C.navy, C.white],
  ]);
  const brace = (x, y1, y2, label, side) => {
    const dx = side === 'left' ? -10 : 10;
    return P(`M${x} ${y1 + 2} h${dx} V${y2 - 2} h${-dx}`, { stroke: C.muted, w: 1.3 }) + T(x + dx * 1.6, (y1 + y2) / 2 + 4, label, { size: 12, weight: 600, fill: C.muted, anchor: side === 'left' ? 'end' : 'start' });
  };
  b += brace(xa - 4, top, top + 200 * k, 'Current 200', 'left') + brace(xa - 4, top + 200 * k, top + 500 * k, 'Non-current 300', 'left');
  b += brace(xl + colW + 4, top, top + 300 * k, 'Liabilities 300', 'right') + brace(xl + colW + 4, top + 300 * k, top + 500 * k, 'Equity 200', 'right');
  b += T(W / 2, top + 500 * k + 34, 'Assets 500 = liabilities 300 + equity 200. It always balances.', { anchor: 'middle', weight: 700 });
  write('I', 'balance-sheet-alpenrad.svg', doc(W, H, b, 'Alpenrad AG balance sheet in € millions: assets of 500 (cash 40, receivables 60, inventory 100, property plant and equipment 220, intangibles 80) equal liabilities of 300 (current 120, long-term loans and bonds 130, provisions 50) plus shareholders\' equity of 200'));
}

// ---- K: losses need bigger gains (lesson: bull-and-bear-markets) -------------------------------
{
  const rows = [
    [10, 11.1],
    [20, 25],
    [33, 50],
    [50, 100],
    [80, 400],
  ];
  const W = 760;
  const H = 70 + rows.length * 46 + 40;
  const axis = 250;
  const k = 1.1; // px per percentage point, same scale both sides
  let b = T(40, 36, 'A loss needs a bigger gain to break even', { size: 16, weight: 700 });
  b += T(axis - 10, 62, 'Loss', { anchor: 'end', weight: 700, fill: C.down }) + T(axis + 10, 62, 'Gain needed to get back', { weight: 700, fill: C.up });
  rows.forEach(([loss, gain], i) => {
    const y = 76 + i * 46;
    b += R(axis - loss * k, y, loss * k, 30, C.down, { rx: 4 });
    b += T(axis - loss * k - 8, y + 20, pct(-loss), { anchor: 'end', weight: 700, fill: C.down });
    b += R(axis, y, gain * k, 30, C.up, { rx: 4 });
    b += T(axis + gain * k + 8, y + 20, pct(gain, gain % 1 ? 1 : 0), { weight: 700, fill: C.up });
  });
  b += L(axis, 70, axis, 76 + rows.length * 46 - 10, { stroke: C.text, w: 1.5 });
  b += T(40, H - 18, 'Both sides use the same scale.', { size: 12, fill: C.muted });
  write('K', 'loss-gain-asymmetry.svg', doc(W, H, b, 'Bar chart on one scale: a 10% loss needs an 11.1% gain to break even, 20% needs 25%, 33% needs 50%, 50% needs 100% and 80% needs 400%'));
}

// ---- L: rates hit distant cash flows harder (lesson: interest-rates-and-stock-prices) ---------
{
  const W = 720;
  const H = 330;
  const base = 260;
  const k = 1.7; // px per €
  const groups = [
    ['Company A: €100 in 1 year', 96.15, 94.34, '−2%'],
    ['Company B: €100 in 20 years', 45.64, 31.18, '−32%'],
  ];
  let b = T(40, 36, 'What €100 of future cash is worth today', { size: 16, weight: 700 });
  b += legend(430, 34, [[C.slate, 'at a 4% discount rate'], [C.navy, 'at a 6% discount rate']]);
  for (const v of [0, 50, 100]) b += L(70, base - v * k, 680, base - v * k, { stroke: C.grid, w: 1 }) + T(62, base - v * k + 4, eur(v), { anchor: 'end', size: 12, fill: C.muted });
  groups.forEach(([label, a, c, drop], i) => {
    const x = 130 + i * 290;
    b += R(x, base - a * k, 80, a * k, C.slate, { rx: 4 }) + T(x + 40, base - a * k - 8, eur(a, 2), { anchor: 'middle', weight: 700 });
    b += R(x + 92, base - c * k, 80, c * k, C.navy, { rx: 4 }) + T(x + 132, base - c * k - 8, eur(c, 2), { anchor: 'middle', weight: 700 });
    b += T(x + 86, base + 24, label, { anchor: 'middle', weight: 600, fill: C.muted });
    b += T(x + 86, base + 46, `Higher rate: ${drop}`, { anchor: 'middle', weight: 700, fill: C.down });
  });
  write('L', 'discounting-near-far.svg', doc(W, H, b, 'Present value of €100: paid in 1 year it is worth €96.15 at 4% and €94.34 at 6% (about −2%); paid in 20 years it is worth €45.64 at 4% and €31.18 at 6% (about −32%)'));
}

// ---- M: share/bond mixes, 1928–2025 (lesson: asset-allocation) -------------------------------
{
  const mixes = [
    ['100/0', 10.0, -43.8],
    ['80/20', 9.3, -35.6],
    ['60/40', 8.3, -27.3],
    ['40/60', 7.2, -19.1],
    ['20/80', 6.0, -17.9],
    ['0/100', 4.5, -17.8],
  ];
  const W = 740;
  const H = 400;
  const zero = 150;
  const k = 4.2; // px per percentage point, both directions
  let b = T(40, 36, 'Shares / bonds mixes, US data 1928–2025', { size: 16, weight: 700 });
  b += legend(430, 34, [[C.up, 'Average yearly return (compound)'], [C.down, 'Worst calendar year']]);
  b += L(60, zero, 700, zero, { stroke: C.text, w: 1.5 });
  mixes.forEach(([label, avg, worst], i) => {
    const x = 92 + i * 104;
    b += R(x, zero - avg * k, 56, avg * k, C.up, { rx: 4 }) + T(x + 28, zero - avg * k - 8, `${avg.toFixed(1)}%`, { anchor: 'middle', weight: 700, fill: C.up });
    b += R(x, zero, 56, -worst * k, C.down, { rx: 4 }) + T(x + 28, zero - worst * k + 18, pct(worst, 1), { anchor: 'middle', weight: 700, fill: C.down });
    b += T(x + 28, H - 30, label, { anchor: 'middle', weight: 700 });
  });
  b += T(40, H - 30, 'Mix:', { weight: 600, fill: C.muted });
  write('M', 'mixes-return-vs-worst-year.svg', doc(W, H, b, 'For share and bond mixes from 100/0 to 0/100 in US data 1928–2025: average yearly returns of 10.0%, 9.3%, 8.3%, 7.2%, 6.0% and 4.5%, and worst calendar years of −43.8%, −35.6%, −27.3%, −19.1%, −17.9% and −17.8%'));
}

// ---- N: leverage multiplies results (lesson: leverage-and-margin) ------------------------------
{
  const cases = [
    ['Price −20%', -20, -100],
    ['Price −10%', -10, -50],
    ['Price +10%', 10, 50],
  ];
  const W = 720;
  const H = 330;
  const axis = 430;
  const k = 2.4;
  let b = T(40, 36, 'Your €1,000, with and without 5:1 leverage', { size: 16, weight: 700 });
  b += legend(40, 64, [[C.light, 'Without leverage (€1,000 position)']]) + legend(330, 64, [[C.navy, 'With 5:1 leverage (€5,000 position)']]);
  cases.forEach(([label, a, l], i) => {
    const y = 100 + i * 70;
    b += T(40, y + 30, label, { weight: 700 });
    for (const [v, fill, dy, ink] of [
      [a, C.light, 0, C.text],
      [l, C.navy, 26, C.white],
    ]) {
      const w = Math.abs(v) * k;
      const x = v < 0 ? axis - w : axis;
      b += R(x, y + dy, w, 22, fill, { rx: 4 });
      const t = `${pct(v)} (${v < 0 ? '−' : '+'}${eur(Math.abs(v) * 10)})`;
      const inside = w > 120;
      const tx = inside ? (v < 0 ? x + 8 : x + w - 8) : v < 0 ? x - 8 : x + w + 8;
      const anchor = inside ? (v < 0 ? 'start' : 'end') : v < 0 ? 'end' : 'start';
      b += T(tx, y + dy + 16, t, { anchor, size: 12.5, weight: 700, fill: inside ? ink : v < 0 ? C.down : C.up });
    }
  });
  b += L(axis, 92, axis, 310, { stroke: C.text, w: 1.5 });
  b += T(W - 40, H - 14, 'At 5:1, a 20% fall wipes out the whole stake.', { anchor: 'end', size: 12.5, weight: 700, fill: C.down });
  write('N', 'leverage-5-to-1.svg', doc(W, H, b, 'With €1,000 of your own money: a 20% price fall costs 20% without leverage but 100% with 5:1 leverage; a 10% fall costs 10% or 50%; a 10% rise gains 10% or 50%'));
}

// ---- O: loss aversion, the shape (lesson: loss-aversion) -----------------------------------------
{
  const W = 640;
  const H = 400;
  const cx = 320;
  const cy = 200;
  const pts = (side) => {
    const out = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * 250;
      const y = side > 0 ? 95 * Math.pow(x / 250, 0.6) : -170 * Math.pow(x / 250, 0.6);
      out.push(`${r1(cx + side * x)},${r1(cy - y)}`);
    }
    return out.join(' ');
  };
  const defs = arrowDef('oa', C.muted);
  let b = T(32, 36, 'Losses feel bigger than gains of the same size', { size: 16, weight: 700 });
  b += L(50, cy, 600, cy, { arrow: 'oa' }) + L(cx, 370, cx, 60, { arrow: 'oa' });
  b += T(596, cy + 22, 'Gain', { anchor: 'end', size: 12.5, fill: C.muted }) + T(56, cy + 22, 'Loss', { size: 12.5, fill: C.muted });
  b += T(cx + 8, 70, 'Feels good', { size: 12.5, fill: C.muted }) + T(cx + 8, 366, 'Feels bad', { size: 12.5, fill: C.muted });
  b += `<polyline points="${pts(1)}" fill="none" stroke="${C.up}" stroke-width="3" stroke-linecap="round"/>`;
  b += `<polyline points="${pts(-1)}" fill="none" stroke="${C.down}" stroke-width="3" stroke-linecap="round"/>`;
  const g = 95 * Math.pow(150 / 250, 0.6);
  const lo = 170 * Math.pow(150 / 250, 0.6);
  b += L(cx + 150, cy, cx + 150, cy - g, { stroke: C.up, w: 1.5, dash: '4 3' }) + L(cx - 150, cy, cx - 150, cy + lo, { stroke: C.down, w: 1.5, dash: '4 3' });
  b += T(cx + 158, cy - g / 2, 'win €100', { size: 12.5, weight: 700, fill: C.up }) + T(cx - 158, cy + lo / 2, 'lose €100', { anchor: 'end', size: 12.5, weight: 700, fill: C.down });
  b += T(W - 24, H - 14, 'Illustration of the shape only (prospect theory), not measured values', { anchor: 'end', size: 11.5, fill: C.muted, italic: true });
  write('O', 'loss-aversion-curve.svg', doc(W, H, b, 'Illustration of loss aversion: the curve for losses falls about twice as steeply as the curve for gains rises, so losing €100 feels worse than winning €100 feels good', defs));
}

// ---- P: volatility drag (lesson: drawdowns-and-volatility-drag) --------------------------------
{
  const W = 700;
  const H = 330;
  const base = 270;
  const k = 0.13; // px per €
  const steps = [
    ['Start', 1000, C.slate],
    ['After +50%', 1500, C.up],
    ['Then −50%', 750, C.down],
  ];
  let b = T(40, 36, '+50% then −50% does not get you back to the start', { size: 16, weight: 700 });
  b += L(70, base - 1000 * k, 520, base - 1000 * k, { stroke: C.navy, w: 1.5, dash: '5 4' });
  b += T(526, base - 1000 * k + 4, 'Start: €1,000', { size: 12.5, weight: 600, fill: C.navy });
  steps.forEach(([label, v, fill], i) => {
    const x = 100 + i * 140;
    b += R(x, base - v * k, 90, v * k, fill, { rx: 5 }) + T(x + 45, base - v * k - 10, eur(v), { anchor: 'middle', weight: 700, size: 14 });
    b += T(x + 45, base + 24, label, { anchor: 'middle', weight: 600, fill: C.muted });
  });
  b += L(70, base, 520, base, { stroke: C.text, w: 1.5 });
  b += R(530, 160, 150, 92, C.pale, { rx: 10, stroke: C.light });
  b += T(545, 186, 'Average of the', { size: 12.5, fill: C.muted }) + T(545, 204, 'two returns: 0%', { size: 12.5, weight: 700 });
  b += T(545, 230, 'Actual result:', { size: 12.5, fill: C.muted }) + T(545, 246, '−25%', { size: 14, weight: 700, fill: C.down });
  write('P', 'volatility-drag.svg', doc(W, H, b, 'Volatility drag: €1,000 rises 50% to €1,500 and then falls 50% to €750; the average of the two returns is 0% but the actual result is −25%'));
}

// ---- Q: KESt on a dividend (lesson: austria-kest-overview) ------------------------------------
{
  const W = 720;
  const H = 250;
  const x0 = 40;
  const bw = 640;
  let b = T(x0, 36, 'A €100 dividend from an Austrian company', { size: 16, weight: 700 });
  b += T(x0, 74, 'Gross dividend: €100', { weight: 600, fill: C.muted });
  b += R(x0, 86, bw * 0.725, 52, C.teal, { rx: 6 }) + R(x0 + bw * 0.725, 86, bw * 0.275, 52, C.slate, { rx: 6 });
  b += T(x0 + 16, 118, 'Paid to you: €72.50', { size: 15, weight: 700, fill: C.white });
  b += T(x0 + bw * 0.725 + 14, 110, 'KESt 27.5%: €27.50', { size: 13, weight: 700, fill: C.white }) + T(x0 + bw * 0.725 + 14, 128, 'withheld by your bank', { size: 12, fill: C.white });
  b += T(x0, 172, 'The bank pays the KESt to the tax office for you. For this dividend, nothing more needs to be declared.', { size: 13 });
  b += T(x0, 200, 'Interest on bank deposits is taxed at 25%; most other capital income at 27.5%.', { size: 12.5, fill: C.muted });
  write('Q', 'kest-dividend.svg', doc(W, H, b, 'Of a €100 gross dividend from an Austrian company, the bank withholds €27.50 KESt (27.5%) and pays €72.50 to you'));
}

// ---- R: who regulates (lesson: who-regulates) --------------------------------------------------
{
  const W = 760;
  const H = 408;
  const defs = arrowDef('ra', C.slate);
  let b = T(40, 36, 'Who watches over the Austrian market', { size: 16, weight: 700 });
  b += box(40, 56, 680, 62, ['European Union', 'Rules such as MiFID II, MAR, the Prospectus Regulation and PRIIPs · ESMA coordinates national regulators'], { fill: C.pale });
  b += L(350, 122, 350, 150, { stroke: C.slate, w: 2, arrow: 'ra' });
  b += box(200, 154, 300, 70, ['FMA (Finanzmarktaufsicht)', 'Banking, insurance, pension fund and', 'securities supervision; independent'], { fill: C.white, stroke: C.navy, titleFill: C.navy });
  b += box(526, 154, 194, 70, ['OeNB', 'Financial stability;', 'bank inspections for the FMA'], { fill: C.white });
  b += L(504, 189, 522, 189, { stroke: C.slate, w: 2 });
  const targets = [
    ['Banks'],
    ['Insurers and', 'pension funds'],
    ['Investment firms', 'and advisers'],
    ['Issuers', 'prospectuses,', 'disclosure'],
    ['Wiener Börse', 'legal supervision', 'of the exchange'],
  ];
  targets.forEach((lines, i) => {
    const x = 40 + i * 138;
    b += P(`M350 228 C350 262 ${x + 64} 262 ${x + 64} 290`, { stroke: C.slate, w: 1.6, arrow: 'ra' });
    b += box(x, 294, 128, 72, lines, { fill: C.white });
  });
  b += T(40, 390, 'The FMA also monitors market abuse (insider dealing, manipulation) and publishes investor warnings.', { size: 12, fill: C.muted });
  write('R', 'who-regulates-austria.svg', doc(W, H, b, 'EU rules and ESMA sit above the FMA, Austria\'s independent supervisor for banking, insurance, pension fund and securities supervision; the OeNB contributes financial stability and inspects banks for the FMA; the FMA supervises banks, insurers and pension funds, investment firms, issuers and, by legal supervision, the Wiener Börse', defs));
}

// ---- S: our countries by FTSE Russell classification (lesson: market-classifications) ---------
{
  const countries = ['at', 'au', 'ca', 'ch', 'cn', 'de', 'es', 'fr', 'gb', 'hk', 'in', 'it', 'jp', 'kr', 'nl', 'pl', 'se', 'sg', 'tw', 'us'].map((c) =>
    JSON.parse(readFileSync(`content/countries/${c}.json`, 'utf8')),
  );
  const tiers = ['Developed', 'Advanced Emerging', 'Secondary Emerging', 'Frontier'];
  const asOf = countries[0].classification.asOf;
  const W = 760;
  const colW = 172;
  const byTier = tiers.map((t) => countries.filter((c) => c.classification.ftse === t).map((c) => c.name.replace(' (mainland)', '')).sort());
  const H = 120 + Math.max(...byTier.map((x) => x.length)) * 21 + 30;
  const fills = [C.navy, C.slate, C.teal, C.light];
  let b = T(40, 36, 'The 20 countries on this site, by FTSE Russell classification', { size: 16, weight: 700 });
  tiers.forEach((t, i) => {
    const x = 32 + i * (colW + 10);
    b += R(x, 54, colW, 40, fills[i], { rx: 8 });
    b += T(x + colW / 2, 79, `${t} (${byTier[i].length})`, { anchor: 'middle', weight: 700, fill: i === 3 ? C.text : C.white, size: 13 });
    byTier[i].forEach((n, j) => (b += T(x + 12, 118 + j * 21, n, { size: 13 })));
    if (!byTier[i].length) b += T(x + 12, 118, 'none of our 20', { size: 12.5, fill: C.muted, italic: true });
  });
  const d = new Date(asOf + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  b += T(40, H - 16, `Source: FTSE Russell country classification, as of ${d}.`, { size: 12, fill: C.muted });
  write('S', 'ftse-classification-our-countries.svg', doc(W, H, b, `The 20 countries on this site by FTSE Russell classification as of ${d}: ${tiers.map((t, i) => `${t}: ${byTier[i].join(', ') || 'none'}`).join('; ')}`));
}

// ---- T: the arithmetic of a Ponzi scheme (lesson: ponzi-and-pyramid-schemes) ---------------------
{
  const W = 740;
  const H = 340;
  const base = 270;
  const k = 0.0019; // px per €
  let b = T(40, 36, 'Paying 10% a month out of the investors\' own money', { size: 16, weight: 700 });
  b += T(40, 60, '100 people invest €1,000 each. The scheme pays out €10,000 a month and earns nothing.', { size: 12.5, fill: C.muted });
  for (let m = 0; m <= 10; m++) {
    const v = 100000 - m * 10000;
    const x = 70 + m * 60;
    b += R(x, base - v * k, 40, v * k, m === 0 ? C.navy : C.slate, { rx: 3 });
    if (m % 2 === 0 && v) b += T(x + 20, base - v * k - 8, eur(v / 1000) + 'k', { anchor: 'middle', size: 12, weight: 700 });
    b += T(x + 20, base + 20, String(m), { anchor: 'middle', size: 12, fill: C.muted });
  }
  b += L(60, base, 700, base, { stroke: C.text, w: 1.5 });
  b += T(380, base + 42, 'Months', { anchor: 'middle', size: 12.5, fill: C.muted });
  b += T(676, base - 18, 'Gone', { anchor: 'middle', size: 13, weight: 700, fill: C.down });
  b += T(W - 24, 96, 'Unless new investors keep paying in.', { anchor: 'end', size: 12.5, weight: 700, fill: C.down });
  write('T', 'ponzi-arithmetic.svg', doc(W, H, b, 'A scheme holding €100,000 from 100 investors that pays out €10,000 a month without real profits has nothing left after 10 months unless new investors pay in'));
}

// ---- U: return and volatility of asset classes (lesson: asset-classes-compared) ----------------
{
  const pts = [
    ['US large company shares', 19.4, 10.0, C.navy, 'end'],
    ['US small company shares', 37.9, 12.0, C.navy, 'end'],
    ['Baa corporate bonds', 7.7, 6.6, C.slate, 'start'],
    ['10-year Treasury bonds', 7.9, 4.5, C.slate, 'start'],
    ['US real estate', 6.2, 4.2, C.teal, 'start'],
    ['Gold', 21.5, 5.6, C.amber, 'start'],
    ['3-month Treasury bills', 3.0, 3.4, C.light, 'start'],
  ];
  const W = 740;
  const H = 420;
  const x0 = 80;
  const y0 = 350;
  const kx = 15.5; // px per volatility point
  const ky = 24; // px per return point
  let b = T(40, 36, 'Return and volatility, US data 1928–2025', { size: 16, weight: 700 });
  for (let v = 0; v <= 40; v += 10) b += L(x0 + v * kx, 60, x0 + v * kx, y0, { stroke: C.grid, w: 1 }) + T(x0 + v * kx, y0 + 20, `${v}%`, { anchor: 'middle', size: 12, fill: C.muted });
  for (let r = 0; r <= 12; r += 3) b += L(x0, y0 - r * ky, x0 + 40 * kx, y0 - r * ky, { stroke: C.grid, w: 1 }) + T(x0 - 8, y0 - r * ky + 4, `${r}%`, { anchor: 'end', size: 12, fill: C.muted });
  b += T(x0 + 20 * kx, y0 + 46, 'Volatility (how much yearly returns swing)', { anchor: 'middle', size: 12.5, weight: 600, fill: C.muted });
  b += `<text transform="translate(28 ${y0 - 6 * ky}) rotate(-90)" font-size="12.5" font-weight="600" fill="${C.muted}" text-anchor="middle">Average yearly return (compound)</text>`;
  for (const [name, vol, ret, fill, anchor] of pts) {
    const x = x0 + vol * kx;
    const y = y0 - ret * ky;
    b += `<circle cx="${r1(x)}" cy="${r1(y)}" r="7" fill="${fill}" stroke="${C.white}" stroke-width="2"/>`;
    const dy = name.startsWith('10-year') ? -6 : name.startsWith('US real') ? 16 : name.startsWith('3-month') ? 18 : name.startsWith('Baa') ? -4 : 4;
    b += T(anchor === 'end' ? x - 12 : x + 12, y + dy, `${name} (${ret.toFixed(1)}%)`, { anchor, size: 12.5, weight: 600 });
  }
  write('U', 'asset-classes-risk-return.svg', doc(W, H, b, 'Scatter chart of US data 1928–2025, compound return against volatility: small company shares 12.0% at 37.9%, large company shares 10.0% at 19.4%, Baa corporate bonds 6.6% at 7.7%, gold 5.6% at 21.5%, 10-year Treasury bonds 4.5% at 7.9%, US real estate 4.2% at 6.2%, 3-month Treasury bills 3.4% at 3.0%'));
}

// ---- V: a 2-for-1 split (lesson: splits-and-bonus-shares) ----------------------------------------
{
  const W = 720;
  const H = 340;
  const grid = (x, y, cols, rows, size, fill) => {
    let s = R(x - 2, y - 2, cols * size + 4, rows * size + 4, C.white, { rx: 6, stroke: C.navy, sw: 2 });
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += R(x + c * size + 1, y + r * size + 1, size - 2, size - 2, fill, { rx: 1.5 });
    return s;
  };
  const defs = arrowDef('va', C.slate);
  let b = T(40, 36, 'A 2-for-1 split: more, smaller slices of the same value', { size: 16, weight: 700 });
  b += grid(70, 70, 10, 10, 18, C.teal);
  b += T(160, 278, '100 shares × $100', { anchor: 'middle', weight: 700 }) + T(160, 300, '= $10,000', { anchor: 'middle', size: 14, weight: 700, fill: C.navy });
  b += L(286, 160, 404, 160, { stroke: C.slate, w: 2.5, arrow: 'va' }) + T(345, 148, 'split 2-for-1', { anchor: 'middle', size: 12.5, fill: C.muted });
  // 200 shares: same area, 20 × 10 with half-width cells
  let g = R(468, 68, 184, 184, C.white, { rx: 6, stroke: C.navy, sw: 2 });
  for (let r = 0; r < 10; r++) for (let c = 0; c < 20; c++) g += R(470 + c * 9 + 0.6, 70 + r * 18 + 1, 7.8, 16, C.light, { rx: 1 });
  b += g;
  b += T(560, 278, '200 shares × $50', { anchor: 'middle', weight: 700 }) + T(560, 300, '= $10,000', { anchor: 'middle', size: 14, weight: 700, fill: C.navy });
  write('V', 'stock-split-2-for-1.svg', doc(W, H, b, 'A 2-for-1 split: 100 shares at $100 ($10,000) become 200 shares at $50, still $10,000', defs));
}

// ---- W: reading one line of a quote page (lesson: reading-a-quote-page) --------------------------
{
  const W = 760;
  const H = 300;
  const cells = [
    ['Alpenrad AG', 'Name', 126],
    ['Prime Market', 'Market segment', 108],
    ['31.40 / 30.10 / 30.20 eD', 'High / low / close', 190],
    ['−3.8%', 'Change on the day', 70],
    ['182,000', 'Volume (shares)', 84],
    ['€5.5 m', 'Turnover (value)', 76],
  ];
  let b = T(40, 36, 'Reading one line of a quote page (fictional example)', { size: 16, weight: 700 });
  let x = 40;
  const y = 70;
  b += R(36, y - 6, 688, 52, C.pale, { rx: 8, stroke: C.light });
  cells.forEach(([value, label, w], i) => {
    b += T(x + 8, y + 26, value, { size: 14, weight: 700, fill: value.startsWith('−') ? C.down : C.text });
    const mid = x + w / 2;
    const ly = 150 + (i % 2) * 44;
    b += L(mid, y + 40, mid, ly - 14, { stroke: C.light, w: 1.2 });
    b += T(mid, ly, label, { anchor: 'middle', size: 12.5, weight: 600, fill: C.muted });
    x += w + 8;
  });
  b += R(40, 226, 680, 54, C.white, { rx: 10, stroke: C.amber });
  b += T(56, 248, '"eD" = ex-dividend: a €1.10 dividend was deducted from the price that day.', { size: 13, weight: 700 });
  b += T(56, 268, 'Most of the −3.8% is the dividend, not a loss for shareholders.', { size: 12.5, fill: C.muted });
  write('W', 'quote-line-annotated.svg', doc(W, H, b, 'A fictional quote line: Alpenrad AG, Prime Market, high 31.40, low 30.10, close 30.20 eD, −3.8%, volume 182,000, turnover €5.5 million; eD means ex-dividend, so most of the fall is the €1.10 dividend deduction'));
}

console.log(`Wrote ${files.length} images:\n  ${files.join('\n  ')}`);
