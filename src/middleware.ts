import { defineMiddleware } from 'astro:middleware';
import { setLocale } from '@/i18n';
import { localeFromPath } from '@/i18n/routes';
import { localizeHtml } from '@/i18n/localize-html';
import { injectAnimations } from '@/lib/animations-inline';
import { localizeFigures } from '@/lib/figures-i18n';
import { stripBase } from '@/lib/url';
import '@/i18n/server';

/**
 * Runs for every page at build time: sets the page's language for t() and url(), inlines lesson
 * animations, and keeps all internal links on translated pages in that language (see localize-html.ts).
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const base = import.meta.env.BASE_URL;
  const locale = localeFromPath(stripBase(base, context.url.pathname));
  setLocale(locale);
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  const out = injectAnimations(html, locale);
  if (locale === 'en' && out === html) return new Response(html, { status: response.status, headers: response.headers });
  return new Response(locale === 'en' ? out : localizeHtml(localizeFigures(out, locale, base), locale, base), { status: response.status, headers: response.headers });
});
