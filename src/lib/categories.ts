import { getCollection, type CollectionEntry } from 'astro:content';
import { translationFile, type CategoryText } from '@/lib/translations';

export type Category = CollectionEntry<'categories'>['data'];
export const STAGES = ['basics', 'markets', 'risk', 'rules'] as const;

/** All categories in learning-path order, with titles and summaries in the page's language. */
export async function getCategories(): Promise<Category[]> {
  const entries = await getCollection('categories');
  const tr = translationFile<Record<string, CategoryText>>('categories');
  return entries
    .map((e) => (tr?.[e.data.id] ? { ...e.data, title: tr[e.data.id].title, summary: tr[e.data.id].summary } : e.data))
    .sort((a, b) => a.pathOrder - b.pathOrder);
}
