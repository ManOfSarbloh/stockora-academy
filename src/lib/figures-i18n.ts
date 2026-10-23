/**
 * On translated pages, swaps each lesson figure (an <img> of an SVG from content/lessons) for its
 * translated copy in public/figures/<locale>/ and uses the translated description as alt text.
 * The copies and src/i18n/figures-manifest.json come from scripts/build-figure-translations.mjs.
 */
import manifest from '@/i18n/figures-manifest.json';
import type { Locale } from '@/i18n/locales';
import { joinBase } from '@/lib/url';

const figures = manifest as Partial<Record<Locale, Record<string, string>>>;
const IMG = /<img\b[^>]*\ssrc="[^"]*\/_astro\/([a-z0-9-]+)\.[A-Za-z0-9_-]+\.svg"[^>]*>/g;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function localizeFigures(html: string, locale: Locale, base: string): string {
  const titles = figures[locale];
  if (!titles || !html.includes('/_astro/')) return html;
  return html.replace(IMG, (tag, name: string) => {
    const title = titles[name];
    if (!title) return tag;
    return tag.replace(/\ssrc="[^"]*"/, ` src="${joinBase(base, `/figures/${locale}/${name}.svg`)}"`).replace(/\salt="[^"]*"/, ` alt="${esc(title)}"`);
  });
}
