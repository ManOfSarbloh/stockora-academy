/**
 * Static JSON with every quiz question, built at build time and loaded by the quiz player
 * (/quizzes/play) and flashcards. Sources and review dates stay in the content files; the player
 * only needs the question, the answer, the explanation and the lesson link (plus the first source).
 * Other languages: /quizzes/<locale>/questions.json.
 */
import type { APIRoute } from 'astro';
import { buildQuizData } from '@/lib/quiz-bank';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildQuizData('en')), { headers: { 'Content-Type': 'application/json' } });
