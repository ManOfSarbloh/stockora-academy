/**
 * Translated lessons (content/i18n/<locale>/lessons/…). Build-time only.
 * A lesson is shown translated on /<locale>/… when a translation exists; otherwise the English text
 * is shown with the "English only" note, as before.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/locales';
import { ACTIVE_LOCALES } from '@/i18n/pages';
import type { LessonEntry } from './lessons';

export type LessonTranslation = CollectionEntry<'lessonTranslations'>;

let byId: Promise<Map<string, LessonTranslation>> | null = null;
const all = () => (byId ??= getCollection('lessonTranslations').then((list) => new Map(list.map((t) => [t.id, t]))));

/** The translation of an English lesson entry (id "a/what-is-a-stock") into `locale`, if there is one. */
export async function lessonTranslation(entry: LessonEntry, locale: Locale): Promise<LessonTranslation | undefined> {
  if (locale === 'en') return undefined;
  return (await all()).get(`${locale}/lessons/${entry.id}`);
}

/** Languages a lesson can be read in: English plus every translation. */
export async function lessonLanguages(entry: LessonEntry): Promise<Locale[]> {
  const map = await all();
  return ACTIVE_LOCALES.filter((l) => l === 'en' || map.has(`${l}/lessons/${entry.id}`));
}
