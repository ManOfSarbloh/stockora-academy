/**
 * Translated quiz questions: content/i18n/<locale>/quizzes/*.json map question ids to the translated
 * fields (question, explanation, options, pairs, orderedItems). Missing questions or fields stay in
 * English. Build-time only.
 */
import type { Locale } from '@/i18n/locales';
import type { Question } from './quiz';

type Overlay = Partial<Pick<Question, 'question' | 'explanation'>> & {
  options?: string[];
  pairs?: [string, string][];
  orderedItems?: string[];
};

const files = import.meta.glob<Record<string, Overlay>>('../../content/i18n/*/quizzes/*.json', { eager: true, import: 'default' });
const byLocale = new Map<string, Map<string, Overlay>>();
for (const [path, data] of Object.entries(files)) {
  const loc = path.split('/')[4];
  const map = byLocale.get(loc) ?? new Map<string, Overlay>();
  for (const [id, o] of Object.entries(data)) map.set(id, o);
  byLocale.set(loc, map);
}

/** The question in `locale` where a translation exists (array fields only if they have the same length). */
export function localizeQuestion<Q extends Question>(q: Q, locale: Locale): Q {
  const o = locale === 'en' ? undefined : byLocale.get(locale)?.get(q.id);
  if (!o) return q;
  const out = { ...q } as Q & Overlay;
  if (o.question) out.question = o.question;
  if (o.explanation) out.explanation = o.explanation;
  if ('options' in q && o.options?.length === q.options.length) out.options = o.options;
  if ('pairs' in q && o.pairs?.length === q.pairs.length) out.pairs = o.pairs;
  if ('orderedItems' in q && o.orderedItems?.length === q.orderedItems.length) out.orderedItems = o.orderedItems;
  return out;
}

/** Number of translated questions per locale (for the content check). */
export const translatedQuestionIds = (locale: string) => new Set(byLocale.get(locale)?.keys() ?? []);
