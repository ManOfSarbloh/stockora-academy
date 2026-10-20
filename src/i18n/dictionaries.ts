/** All translated UI dictionaries (English is in en.ts). Build-time only: never import this from browser code. */
import type { Dictionary, Locale } from './index';
import { de } from './de';
import { es } from './es';

export const dictionaries: Partial<Record<Exclude<Locale, 'en'>, Partial<Dictionary>>> = { de, es };
