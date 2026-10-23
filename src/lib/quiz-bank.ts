/**
 * The question bank behind the quiz player and flashcards, in one language: every quiz question
 * (translated where content/i18n/<locale>/quizzes has it) plus the glossary questions (from the
 * translated glossary). Built at build time by /quizzes/questions.json and /quizzes/<locale>/questions.json.
 */
import { getCollection } from 'astro:content';
import { t, type Locale } from '@/i18n';
import { glossaryQuestions } from './quiz-sets';
import { localizeQuestion } from './quiz-translations';
import { translationFile, type GlossaryText } from './translations';
import type { Question } from './quiz';

export interface QuizData {
  questions: (Question & { src?: string })[];
  glossary: { id: string; term: string; definition: string; categories: string[] }[];
}

export async function buildQuizData(locale: Locale): Promise<QuizData> {
  const quizzes = await getCollection('quizzes');
  const questions = quizzes.map(({ data }) => {
    const { sources, lastReviewed: _r, sourceFile: _f, ...q } = data as typeof data & { lastReviewed?: string };
    return localizeQuestion({ ...q, src: sources[0] } as Question & { src?: string }, locale);
  });
  const tr = translationFile<Record<string, GlossaryText>>('glossary', locale);
  const glossary = (await getCollection('glossary')).map(({ data }) => ({
    id: data.id,
    term: tr?.[data.id]?.term ?? data.term,
    definition: tr?.[data.id]?.definition ?? data.definition,
    categories: data.categories,
    aliases: tr?.[data.id] ? [] : data.aliases,
  }));
  return {
    questions: [...questions, ...glossaryQuestions(glossary, 20261016, t('quiz.glossaryPrompt', undefined, locale))],
    glossary: glossary.map(({ aliases: _a, ...g }) => g),
  };
}
