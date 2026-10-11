import { getCollection, type CollectionEntry } from 'astro:content';

export type Category = CollectionEntry<'categories'>['data'];
export const STAGES = ['basics', 'markets', 'risk', 'rules'] as const;

/** All categories in learning-path order. */
export async function getCategories(): Promise<Category[]> {
  const entries = await getCollection('categories');
  return entries.map((e) => e.data).sort((a, b) => a.pathOrder - b.pathOrder);
}

/** Published lessons of one category, in their configured order. */
export async function getLessons(categoryId: Category['id']) {
  const lessons = await getCollection(
    'lessons',
    (l) => l.data.category === categoryId && (import.meta.env.DEV || !l.data.draft),
  );
  return lessons.sort((a, b) => a.data.order - b.data.order);
}
