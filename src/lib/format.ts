/**
 * Number and date formatting in the page's language (German uses Austrian conventions):
 * eur(1250000) is "€1,250,000" in English and "€ 1.250.000" in German.
 */
import { getLocale, intlLocale, t } from '@/i18n';

const cache = new Map<string, Intl.NumberFormat>();
function nf(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const loc = intlLocale[getLocale()];
  const key = `${loc}|${JSON.stringify(options)}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(loc, options);
    cache.set(key, f);
  }
  return f;
}

/** €1,250,000 */
export const eur = (n: number) => nf({ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
/** €4.00 */
export const eurCents = (n: number) => nf({ style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
/** 1,250,000 */
export const int = (n: number) => nf({ maximumFractionDigits: 0 }).format(n);

/** A number with a fixed number of decimals ("–" for anything that is not a finite number). */
export const num = (n: number, digits = 2) =>
  Number.isFinite(n) ? nf({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n) : '–';

/** A number with up to `digits` decimals: 1.5 → "1.5", 2 → "2". */
export const dec = (n: number, digits = 1) => nf({ maximumFractionDigits: digits }).format(n);

/** €1.3 million / €250,000 / €2.4 billion: short form for headlines and labels. */
export function eurShort(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return t('fmt.eurBillion', { n: dec(n / 1e9) });
  if (a >= 1e6) return t('fmt.eurMillion', { n: dec(n / 1e6) });
  return eur(n);
}

/** 0.4812 → "48.1%" */
export const pct = (fraction: number, digits = 1) =>
  nf({ style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(fraction);

/** "2026-10-19" → "19 October 2026" (the date itself, independent of time zones). */
export function dateLong(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale[getLocale()], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
