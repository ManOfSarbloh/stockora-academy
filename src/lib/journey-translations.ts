/**
 * Translated How Stocks Are Made content (content/i18n/<locale>/how-stocks-are-made/{steps,cases}/…). Build-time only.
 * A step or case study without a translation keeps its English text.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/locales';
import { ACTIVE_LOCALES } from '@/i18n/pages';

export type JourneyTranslation = CollectionEntry<'journeyTranslations'>;
type Kind = 'steps' | 'cases';

let byId: Promise<Map<string, JourneyTranslation>> | null = null;
const all = () => (byId ??= getCollection('journeyTranslations').then((list) => new Map(list.map((t) => [t.id, t]))));

/** The translation of a step or case study (English entry id "01-idea-to-company") into `locale`, if there is one. */
export async function journeyTranslation(kind: Kind, id: string, locale: Locale): Promise<JourneyTranslation | undefined> {
  if (locale === 'en') return undefined;
  return (await all()).get(`${locale}/how-stocks-are-made/${kind}/${id}`);
}

/** Languages in which every step and case study is translated. */
export async function journeyLanguages(): Promise<Locale[]> {
  const [map, steps, cases] = await Promise.all([all(), getCollection('journeySteps'), getCollection('caseStudies')]);
  const ids = [...steps.map((s) => `steps/${s.id}`), ...cases.map((c) => `cases/${c.id}`)];
  return ACTIVE_LOCALES.filter((l) => l === 'en' || ids.every((id) => map.has(`${l}/how-stocks-are-made/${id}`)));
}
