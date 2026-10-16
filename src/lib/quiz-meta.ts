/**
 * Build-time facts about the quiz collection for the hub pages: display names, links per category,
 * topic and country order, and question counts. Server-side only (uses astro:content).
 */
import { getCollection } from 'astro:content';
import { getCategories } from './categories';
import { countryHref, getCountries } from './countries';
import { GLOSSARY_CATEGORY, JOURNEY_CATEGORY, glossaryQuestions } from './quiz-sets';

export interface QuizMeta {
  names: Record<string, string>;
  hrefs: Record<string, string>;
  /** Topic categories A–W in learning-path order. */
  topics: string[];
  /** Country codes in display order. */
  countries: string[];
  /** Questions per category id (content files only, without generated glossary questions). */
  counts: Record<string, number>;
  total: number;
}

export async function getQuizMeta(): Promise<QuizMeta> {
  const [categories, countries, quizzes, glossary] = await Promise.all([
    getCategories(),
    getCountries(),
    getCollection('quizzes'),
    getCollection('glossary'),
  ]);
  const names: Record<string, string> = { [GLOSSARY_CATEGORY]: 'Glossary', [JOURNEY_CATEGORY]: 'How Stocks Are Made' };
  const hrefs: Record<string, string> = { [GLOSSARY_CATEGORY]: '/glossary', [JOURNEY_CATEGORY]: '/how-stocks-are-made' };
  for (const c of categories) {
    names[c.id] = c.title;
    hrefs[c.id] = `/learn/${c.slug}`;
  }
  for (const c of countries) {
    names[c.code] = c.name;
    hrefs[c.code] = countryHref(c.code);
  }
  const counts: Record<string, number> = {};
  for (const q of quizzes) counts[q.data.category] = (counts[q.data.category] ?? 0) + 1;
  return {
    names,
    hrefs,
    topics: categories.map((c) => c.id),
    countries: countries.map((c) => c.code),
    counts: { ...counts, [GLOSSARY_CATEGORY]: glossaryQuestions(glossary.map((g) => g.data)).length },
    total: quizzes.length,
  };
}
