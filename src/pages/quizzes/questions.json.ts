/**
 * Static JSON with every quiz question, built at build time and loaded by the quiz player
 * (/quizzes/play) and flashcards. Sources and review dates stay in the content files; the player
 * only needs the question, the answer, the explanation and the lesson link (plus the first source).
 */
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { glossaryQuestions } from '@/lib/quiz-sets';
import type { Question } from '@/lib/quiz';

export interface QuizData {
  questions: (Question & { src?: string })[];
  glossary: { id: string; term: string; definition: string; categories: string[] }[];
}

export const GET: APIRoute = async () => {
  const quizzes = await getCollection('quizzes');
  const questions = quizzes.map(({ data }) => {
    const { sources, lastReviewed: _r, sourceFile: _f, ...q } = data as typeof data & { lastReviewed?: string };
    return { ...q, src: sources[0] } as Question & { src?: string };
  });
  const glossary = (await getCollection('glossary')).map(({ data }) => ({
    id: data.id,
    term: data.term,
    definition: data.definition,
    categories: data.categories,
    aliases: data.aliases,
  }));
  const body: QuizData = {
    questions: [...questions, ...glossaryQuestions(glossary, 20261016)],
    glossary: glossary.map(({ aliases: _a, ...g }) => g),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
};
