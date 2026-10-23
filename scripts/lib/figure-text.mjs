/**
 * Shared helpers for translating the text inside SVG figures (lesson diagrams, Chart School drawings,
 * animations). Numbers are lifted out of each string as {0}, {1}, … so one dictionary entry covers the
 * words and the numbers are re-formatted for each language.
 */
export const LOCALES = ['de', 'es', 'fr', 'it'];
export const INTL = { de: 'de-AT', es: 'es-ES', fr: 'fr-FR', it: 'it-IT' };

// A number with optional sign, currency, thousands separators, decimals and % or "m" suffix.
// Not part of times (09:00), ratios (5:1), years (1987) or words.
const NUM = /(?<![\w:.,/])([−+-]?)(€|\$)?(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(%)?(?!\w|:\d|\.\d)/g;
const isYear = (int, dec, cur, pct) => !cur && !pct && !dec && /^\d{4}$/.test(int) && +int >= 1500 && +int <= 2100;

/** "Total €10,034 · about €20.07 a share" → { key: "Total {0} · about {1} a share", nums: [...] } */
export function templatize(s) {
  const nums = [];
  const key = s.replace(NUM, (m, sign, cur, int, dec, pct) => {
    if (isYear(int, dec, cur, pct)) return m;
    nums.push({ sign, cur, value: Number(int.replace(/,/g, '') + (dec ?? '')), decimals: dec ? dec.length - 1 : 0, pct: Boolean(pct) });
    return `{${nums.length - 1}}`;
  });
  return { key, nums };
}

export function formatNum(n, loc) {
  const intl = INTL[loc];
  const opts = { minimumFractionDigits: n.decimals, maximumFractionDigits: n.decimals };
  let s;
  if (n.cur) s = new Intl.NumberFormat(intl, { ...opts, style: 'currency', currency: n.cur === '$' ? 'USD' : 'EUR', currencyDisplay: 'symbol' }).format(n.value);
  else if (n.pct) s = new Intl.NumberFormat(intl, { ...opts, style: 'percent' }).format(n.value / 100);
  else s = new Intl.NumberFormat(intl, { ...opts, useGrouping: n.value >= 10000 || (n.value >= 1000 && loc !== 'es') }).format(n.value);
  if (n.cur === '$') s = s.replace(/US\$|\$\s?US|USD/, '$');
  const sign = n.sign === '-' || n.sign === '−' ? '−' : n.sign;
  return sign + s;
}

export const hasWords = (s) => /\p{L}{2,}/u.test(s);

/** Translate one string: dictionary for the words, locale formatting for the numbers. */
export function translate(s, loc, dict, missing) {
  const { key, nums } = templatize(s);
  let out = key;
  if (hasWords(key)) {
    if (dict[key] === undefined) {
      missing?.add(key);
      out = key;
    } else out = dict[key];
  }
  return out.replace(/\{(\d+)\}/g, (_, i) => (nums[+i] ? formatNum(nums[+i], loc) : `{${i}}`));
}

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const encode = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Every translatable string in an SVG: <text>/<tspan> contents, <title> and aria-label. */
export function svgStrings(svg) {
  const out = [];
  for (const m of svg.matchAll(/<(text|tspan|title)\b[^>]*>([^<]+)</g)) out.push(decode(m[2]));
  for (const m of svg.matchAll(/aria-label="([^"]*)"/g)) out.push(decode(m[1]));
  return out.map((s) => s.trim()).filter(Boolean);
}

/** A translated copy of an SVG. */
export function translateSvg(svg, loc, dict, missing) {
  return svg
    .replace(/(<(?:text|tspan|title)\b[^>]*>)([^<]+)(<)/g, (m, open, body, close) => {
      const t = body.trim();
      if (!t) return m;
      return open + encode(translate(decode(t), loc, dict, missing)) + close;
    })
    .replace(/aria-label="([^"]*)"/g, (m, v) => `aria-label="${encode(translate(decode(v), loc, dict, missing))}"`);
}
