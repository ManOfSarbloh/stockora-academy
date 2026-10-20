/** Site languages. English is the original and lives at the root; the others under /<code>/. */
export const LOCALES = ['en', 'de', 'es', 'fr', 'it', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (s: unknown): s is Locale => typeof s === 'string' && (LOCALES as readonly string[]).includes(s);

/** Each language's name in that language (for the language switcher). */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  ru: 'Русский',
};

/** Locale used for numbers and dates. German uses the Austrian conventions (the site's home market). */
export const intlLocale: Record<Locale, string> = {
  en: 'en-GB',
  de: 'de-AT',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  ru: 'ru-RU',
};
