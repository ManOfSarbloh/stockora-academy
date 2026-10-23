/** Loads the question bank built at /quizzes/questions.json (once per page), in the page's language. */
import { getLocale } from '@/i18n';
import { url } from './url';
import type { QuizData } from './quiz-bank';

let cache: Promise<QuizData> | null = null;

export function loadQuizData(): Promise<QuizData> {
  const locale = getLocale();
  const file = locale === 'en' ? '/quizzes/questions.json' : `/quizzes/${locale}/questions.json`;
  cache ??= fetch(url(file, 'en')).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<QuizData>;
  });
  cache.catch(() => (cache = null));
  return cache;
}
