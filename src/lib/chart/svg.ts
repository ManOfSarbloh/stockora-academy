/**
 * Static SVG drawings of candles and simple charts (original artwork, generated from data).
 * Used by the Candlestick Encyclopedia and by scripts/build-chart-images.ts for lesson images.
 * Drawings carry their own white background so they read well in light and dark mode.
 */
import type { Candle } from './core';

export const COLORS = {
  up: '#16834a',
  down: '#c8352f',
  context: '#a7b0bb',
  text: '#1a2433',
  muted: '#516075',
  grid: '#e3e8ee',
  blue: '#2a78d6',
  orange: '#d9622b',
  violet: '#4a3aa7',
  zone: 'rgba(42,120,214,0.12)',
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f = (n: number) => Math.round(n * 10) / 10;

export interface Scale {
  x: (i: number) => number;
  y: (p: number) => number;
  slot: number;
}

export function makeScale(n: number, lo: number, hi: number, box: { x: number; y: number; w: number; h: number }): Scale {
  const pad = (hi - lo) * 0.08 || 1;
  const min = lo - pad;
  const max = hi + pad;
  const slot = box.w / n;
  return {
    slot,
    x: (i) => box.x + slot * (i + 0.5),
    y: (p) => box.y + ((max - p) / (max - min)) * box.h,
  };
}

/** Candles as SVG elements (no wrapper). Bars before `highlightFrom` are drawn in grey. */
export function candleElements(candles: Pick<Candle, 'o' | 'h' | 'l' | 'c'>[], s: Scale, highlightFrom = 0, style: 'candle' | 'bar' = 'candle'): string {
  const w = Math.max(3, Math.min(26, s.slot * 0.62));
  return candles
    .map((c, i) => {
      const color = i < highlightFrom ? COLORS.context : c.c >= c.o ? COLORS.up : COLORS.down;
      const x = s.x(i);
      if (style === 'bar') {
        const tick = w / 2;
        return `<g stroke="${color}" stroke-width="2"><line x1="${f(x)}" x2="${f(x)}" y1="${f(s.y(c.h))}" y2="${f(s.y(c.l))}"/><line x1="${f(x - tick)}" x2="${f(x)}" y1="${f(s.y(c.o))}" y2="${f(s.y(c.o))}"/><line x1="${f(x)}" x2="${f(x + tick)}" y1="${f(s.y(c.c))}" y2="${f(s.y(c.c))}"/></g>`;
      }
      const top = s.y(Math.max(c.o, c.c));
      const bot = s.y(Math.min(c.o, c.c));
      const bodyH = Math.max(1.5, bot - top);
      return `<g><line x1="${f(x)}" x2="${f(x)}" y1="${f(s.y(c.h))}" y2="${f(s.y(c.l))}" stroke="${color}" stroke-width="2"/><rect x="${f(x - w / 2)}" y="${f(top)}" width="${f(w)}" height="${f(bodyH)}" rx="1.5" fill="${color}"/></g>`;
    })
    .join('');
}

export function svgDoc(width: number, height: number, body: string, title: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(title)}" font-family="Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"><title>${esc(title)}</title><rect width="${width}" height="${height}" rx="12" fill="#ffffff"/>${body}</svg>`;
}

/** A small pattern drawing: context candles in grey, then the pattern in colour. */
export function patternSvg(candles: Pick<Candle, 'o' | 'h' | 'l' | 'c'>[], contextCount: number, title: string, opts: { width?: number; height?: number } = {}): string {
  const width = opts.width ?? 260;
  const height = opts.height ?? 170;
  const lo = Math.min(...candles.map((c) => c.l));
  const hi = Math.max(...candles.map((c) => c.h));
  const s = makeScale(candles.length, lo, hi, { x: 14, y: 12, w: width - 28, h: height - 24 });
  // a faint band marks where the pattern starts
  const bandX = s.x(contextCount) - s.slot / 2;
  const band = contextCount > 0 ? `<rect x="${f(bandX)}" y="6" width="${f(width - 14 - bandX)}" height="${height - 12}" rx="8" fill="${COLORS.zone}"/>` : '';
  return svgDoc(width, height, band + candleElements(candles, s, contextCount), title);
}
