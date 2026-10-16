/**
 * Practice quiz embedded on topic, lesson, journey and country pages: a thin wrapper around QuizRunner.
 */
import QuizRunner from './QuizRunner';
import type { Question } from '@/lib/quiz';

interface Props {
  quizId: string;
  questions: Question[];
  /** Report links go here (Corrections page or a GitHub issue URL builder result). */
  reportHref: string;
}

export default function PracticeQuiz({ quizId, questions, reportHref }: Props) {
  return <QuizRunner quizId={quizId} questions={questions} reportHref={() => reportHref} />;
}
