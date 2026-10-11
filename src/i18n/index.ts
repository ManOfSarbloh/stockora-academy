import { en, type UiKey } from './en';

export const locales = { en } as const;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'en';

/**
 * Look up a UI string. `{name}` placeholders are replaced from `vars`.
 * Falls back to English if a key is missing in another locale.
 */
export function t(key: UiKey, vars?: Record<string, string | number>, locale: Locale = defaultLocale): string {
  const dict: Record<string, string> = locales[locale] ?? en;
  let s = dict[key] ?? en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

export type { UiKey };
