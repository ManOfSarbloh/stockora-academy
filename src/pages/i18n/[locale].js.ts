import type { APIRoute } from 'astro';
import { dictionaries } from '@/i18n/dictionaries';
import { ACTIVE_LOCALES } from '@/i18n/pages';

/**
 * /i18n/<locale>.js: the UI dictionary for interactive parts of the page (React islands).
 * Loaded in <head> on translated pages, before any island runs; English is bundled instead.
 */
export function getStaticPaths() {
  return ACTIVE_LOCALES.filter((l) => l !== 'en').map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as keyof typeof dictionaries;
  const payload = JSON.stringify({ locale, dict: dictionaries[locale] }).replace(/</g, '\\u003c');
  return new Response(`window.__STOCKORA_I18N__=${payload};\n`, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
};
