/**
 * Helpers for generating every page in every language. Build-time only (imports the dictionaries).
 */
import { LOCALES, defaultLocale, type Locale } from './locales';
import { dictionaries } from './dictionaries';

/** Languages the site is built in: English plus every language with a dictionary. */
export const ACTIVE_LOCALES: Locale[] = LOCALES.filter((l) => l === defaultLocale || l in dictionaries);

/** Route params for a page in every language: { locale: undefined } is English at the root. */
export const localeParams = (locales: readonly Locale[] = ACTIVE_LOCALES) =>
  locales.map((l) => ({ params: { locale: l === defaultLocale ? undefined : l } }));

/** Add the locale param to a dynamic page's static paths. */
export function withLocales<T extends { params: Record<string, string | undefined> }>(paths: T[], locales: readonly Locale[] = ACTIVE_LOCALES) {
  return locales.flatMap((l) => paths.map((p) => ({ ...p, params: { ...p.params, locale: l === defaultLocale ? undefined : l } })));
}
