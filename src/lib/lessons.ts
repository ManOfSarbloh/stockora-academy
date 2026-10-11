import { getCollection, type CollectionEntry } from 'astro:content';
import { getCategories, type Category } from './categories';

export type LessonEntry = CollectionEntry<'lessons'>;

export interface LessonRef {
  key: string;
  title: string;
  href: string;
  category: Category;
  entry: LessonEntry;
}

/** "a/what-is-a-stock" -> "what-is-a-stock" */
export const lessonSlug = (entry: LessonEntry) => entry.id.split('/').pop()!;

const isPublished = (l: LessonEntry) => import.meta.env.DEV || !l.data.draft;

/** Every published lesson in learning-path order: by category path order, then lesson order. */
export async function getLessonSequence(): Promise<LessonRef[]> {
  const [categories, lessons] = await Promise.all([getCategories(), getCollection('lessons', isPublished)]);
  return categories.flatMap((category) =>
    lessons
      .filter((l) => l.data.category === category.id)
      .sort((a, b) => a.data.order - b.data.order)
      .map((entry) => {
        const slug = lessonSlug(entry);
        return {
          key: `${category.slug}/${slug}`,
          title: entry.data.title,
          href: `/learn/${category.slug}/${slug}`,
          category,
          entry,
        };
      }),
  );
}

/** Lesson keys grouped by category id, for progress rings. */
export async function getLessonKeysByCategory(): Promise<Record<string, string[]>> {
  const seq = await getLessonSequence();
  const out: Record<string, string[]> = {};
  for (const l of seq) (out[l.category.id] ??= []).push(l.key);
  return out;
}
