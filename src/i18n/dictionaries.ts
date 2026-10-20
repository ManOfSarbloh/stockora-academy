/** All translated UI dictionaries (English is in en.ts). Build-time only: never import this from browser code. */
import type { Dictionary, Locale } from './index';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';

export const dictionaries: Partial<Record<Exclude<Locale, 'en'>, Partial<Dictionary>>> = { de, es, fr, it };
