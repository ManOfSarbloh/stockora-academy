import { getCollection, type CollectionEntry } from 'astro:content';

export type Category = CollectionEntry<'categories'>['data'];
export const STAGES = ['basics', 'markets', 'risk', 'rules'] as const;

/** All categories in learning-path order. */
export async function getCategories(): Promise<Category[]> {
  const entries = await getCollection('categories');
  return entries.map((e) => e.data).sort((a, b) => a.pathOrder - b.pathOrder);
}
