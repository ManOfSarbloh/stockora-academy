/** Loads the question bank built at /quizzes/questions.json (once per page). */
import { url } from './url';
import type { QuizData } from '@/pages/quizzes/questions.json';

let cache: Promise<QuizData> | null = null;

export function loadQuizData(): Promise<QuizData> {
  cache ??= fetch(url('/quizzes/questions.json')).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<QuizData>;
  });
  cache.catch(() => (cache = null));
  return cache;
}
