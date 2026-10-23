/** The question bank in another language (see /quizzes/questions.json). */
import type { APIRoute, GetStaticPaths } from 'astro';
import type { Locale } from '@/i18n';
import { ACTIVE_LOCALES } from '@/i18n/pages';
import { buildQuizData } from '@/lib/quiz-bank';

export const getStaticPaths: GetStaticPaths = () =>
  ACTIVE_LOCALES.filter((l) => l !== 'en').map((locale) => ({ params: { locale } }));

export const GET: APIRoute = async ({ params }) =>
  new Response(JSON.stringify(await buildQuizData(params.locale as Locale)), {
    headers: { 'Content-Type': 'application/json' },
  });
