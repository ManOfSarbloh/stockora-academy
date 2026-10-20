import { en, type UiKey } from './en';
import { LOCALES, defaultLocale, isLocale, type Locale } from './locales';

export { LOCALES, defaultLocale, isLocale, localeNames, intlLocale, type Locale } from './locales';
export type { UiKey };

export type Dictionary = Record<UiKey, string>;

/**
 * Dictionaries are registered, not imported here, so the browser only downloads the one it needs:
 * at build time src/i18n/server.ts registers all of them; in the browser, /i18n/<locale>.js
 * (loaded in <head> on non-English pages) puts the page's dictionary on window.__STOCKORA_I18N__.
 */
const dictionaries: Partial<Record<Locale, Partial<Dictionary>>> = { en };

declare global {
  interface Window {
    __STOCKORA_I18N__?: { locale: Locale; dict: Partial<Dictionary> };
  }
}
if (typeof window !== 'undefined' && window.__STOCKORA_I18N__) {
  dictionaries[window.__STOCKORA_I18N__.locale] = window.__STOCKORA_I18N__.dict;
}

export function registerDictionary(locale: Locale, dict: Partial<Dictionary>): void {
  dictionaries[locale] = dict;
}

let buildLocale: Locale = defaultLocale;

/** Set by the middleware before each page is rendered at build time (pages are built one at a time). */
export function setLocale(locale: Locale): void {
  buildLocale = locale;
}

/** The current page's language: <html lang> in the browser, the page being built on the server. */
export function getLocale(): Locale {
  if (typeof document !== 'undefined') {
    const lang = document.documentElement.lang;
    return isLocale(lang) ? lang : defaultLocale;
  }
  return buildLocale;
}

/**
 * Look up a UI string. `{name}` placeholders are replaced from `vars`.
 * Falls back to English if a key is missing in another locale.
 */
export function t(key: UiKey, vars?: Record<string, string | number>, locale: Locale = getLocale()): string {
  let s = dictionaries[locale]?.[key] ?? en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

/** True once a dictionary exists for the locale (the site only offers languages that have one). */
export const hasDictionary = (locale: Locale) => locale in dictionaries;

export const otherLocales = () => LOCALES.filter((l) => l !== defaultLocale);
