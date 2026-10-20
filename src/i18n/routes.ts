/**
 * Language-aware paths. All paths here are site paths without the deploy base, e.g. "/de/tools/".
 * Pure functions (no Astro or browser APIs), shared by the site, the middleware and astro.config.
 */
import { defaultLocale, isLocale, type Locale } from './locales';

const isFile = (path: string) => /\.[a-z0-9]+$/i.test(path.split(/[?#]/)[0]);

/** "/de/tools/" → "de"; "/tools/" → "en". */
export function localeFromPath(path: string): Locale {
  const first = path.split('/')[1];
  return isLocale(first) && first !== defaultLocale ? first : defaultLocale;
}

/** "/de/tools/" → "/tools/"; "/de" → "/". */
export function stripLocale(path: string): string {
  const locale = localeFromPath(path);
  if (locale === defaultLocale) return path || '/';
  const rest = path.slice(locale.length + 1);
  return rest.startsWith('/') ? rest : `/${rest}`;
}

/**
 * Put a page path into a language: localizePath("/tools/", "de") → "/de/tools/".
 * Files (anything with an extension) and paths already in a language are returned unchanged.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || isFile(path)) return path;
  const route = stripLocale(path);
  if (locale === defaultLocale) return route;
  return route === '/' ? `/${locale}/` : `/${locale}${route}`;
}

/**
 * Pages whose main content exists only in English (lessons, country data, quizzes, …).
 * In other languages they keep the translated interface, show an "English only" note,
 * point their canonical link to the English page and stay out of the sitemap.
 * `route` has no locale prefix and ends with "/".
 */
const ENGLISH_ONLY = [
  /^\/learn\/[^/]+\/(.+\/)?$/, // topic and lesson pages (/learn/ itself is translated)
  /^\/how-stocks-are-made\/$/,
  /^\/world\//,
  /^\/history\/$/,
  /^\/videos\/$/,
  /^\/charts\/(candles\/|quiz\/)?$/,
  /^\/quizzes\/(play|flashcards|world-game|certificate)\/$/,
];
export const isEnglishOnly = (route: string) => ENGLISH_ONLY.some((re) => re.test(route));
