/** Number formatting for tools and simulators (English UI, euro amounts). */

const eurFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eurCentsFmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const intFmt = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });

/** €1,250,000 */
export const eur = (n: number) => eurFmt.format(n);
/** €4.00 */
export const eurCents = (n: number) => eurCentsFmt.format(n);
/** 1,250,000 */
export const int = (n: number) => intFmt.format(n);

/** €1.3 million / €250,000 / €2.4 billion: short form for headlines and labels. */
export function eurShort(n: number): string {
  const a = Math.abs(n);
  const one = (x: number) => (Math.round(x * 10) / 10).toLocaleString('en');
  if (a >= 1e9) return `€${one(n / 1e9)} billion`;
  if (a >= 1e6) return `€${one(n / 1e6)} million`;
  return eur(n);
}

/** 0.4812 → "48.1%" */
export const pct = (fraction: number, digits = 1) => `${(fraction * 100).toFixed(digits)}%`;
