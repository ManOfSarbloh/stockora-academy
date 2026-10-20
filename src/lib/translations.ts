/**
 * Translated content data: content/i18n/<locale>/<name>.json holds only the translatable fields
 * (ids, links and numbers stay in the English originals). Build-time only: import from .astro pages
 * and server code, never from React islands (it would ship every translation to the browser).
 */
import { getLocale, type Locale } from '@/i18n';

const files = import.meta.glob<unknown>('../../content/i18n/*/*.json', { eager: true, import: 'default' });

export function translationFile<T>(name: string, locale: Locale = getLocale()): T | undefined {
  if (locale === 'en') return undefined;
  return files[`../../content/i18n/${locale}/${name}.json`] as T | undefined;
}

export interface CategoryText {
  title: string;
  summary: string;
}
export interface GlossaryText {
  term: string;
  definition: string;
  example?: string;
}
