/**
 * Flashcards: glossary terms (term → definition) or key facts from the quizzes (question → answer
 * and explanation). Cards marked "Again" come back a few cards later in the same session.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '@/i18n';
import { url } from '@/lib/url';
import { correctAnswerText, shuffle, type Question } from '@/lib/quiz';
import { loadQuizData } from '@/lib/quiz-data';
import type { QuizData } from '@/pages/quizzes/questions.json';

interface Props {
  names: Record<string, string>;
  /** Topic ids, then extra ids (HSM, countries) for the facts deck. */
  topics: string[];
  countries: string[];
}

interface Card {
  id: string;
  front: string;
  back: string;
  detail?: string;
  href: string;
}

type Deck = 'glossary' | 'facts';
const SESSION = 20;
const REQUEUE_GAP = 3;

/** Fact cards only for question types whose answer reads well on its own. */
const FACT_TYPES = new Set(['multiple_choice', 'true_false', 'number']);

export default function Flashcards({ names, topics, countries }: Props) {
  const [data, setData] = useState<QuizData | null>(null);
  const [error, setError] = useState(false);
  const [deck, setDeck] = useState<Deck>('glossary');
  const [topic, setTopic] = useState('');
  const [queue, setQueue] = useState<Card[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [again, setAgain] = useState<string[]>([]);
  const frontRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    loadQuizData()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const allCards = useMemo<Card[]>(() => {
    if (!data) return [];
    if (deck === 'glossary') {
      return data.glossary
        .filter((g) => !topic || g.categories.includes(topic))
        .map((g) => ({ id: g.id, front: g.term, back: g.definition, href: `/glossary#${g.id}` }));
    }
    return data.questions
      .filter((q) => q.category !== 'GL' && FACT_TYPES.has(q.type) && (!topic || q.category === topic || (topic === 'WORLD' && countries.includes(q.category))))
      .map((q: Question) => ({
        id: q.id,
        front: q.question,
        back: correctAnswerText(q, { true: t('quiz.true'), false: t('quiz.false') }),
        detail: q.explanation,
        href: q.lessonLink,
      }));
  }, [data, deck, topic, countries]);

  function start(cards: Card[]) {
    setQueue(shuffle(cards).slice(0, SESSION));
    setPos(0);
    setFlipped(false);
    setKnown([]);
    setAgain([]);
  }

  useEffect(() => start(allCards), [allCards]);

  if (error) return <p className="callout callout-warning">{t('quiz.loadError')}</p>;
  if (!data) {
    // Same size as the page's fallback, so the footer does not jump while questions load.
    return (
      <div className="island-fallback h-[340px] lg:h-[285px]" role="status">
        <span className="sr-only">{t('quiz.loading')}</span>
      </div>
    );
  }

  const card = queue[pos];
  const done = queue.length > 0 && pos >= queue.length;

  function answer(knewIt: boolean) {
    if (!card) return;
    if (knewIt) {
      setKnown((k) => (k.includes(card.id) ? k : [...k, card.id]));
      setAgain((a) => a.filter((x) => x !== card.id));
    } else {
      setAgain((a) => (a.includes(card.id) ? a : [...a, card.id]));
      // Put the card back a few places later in this session.
      setQueue((q) => {
        const next = [...q];
        next.splice(Math.min(next.length, pos + 1 + REQUEUE_GAP), 0, card);
        return next;
      });
    }
    setPos((p) => p + 1);
    setFlipped(false);
    requestAnimationFrame(() => frontRef.current?.focus());
  }

  const topicOptions = deck === 'glossary' ? topics : [...topics, 'HSM', 'WORLD'];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm font-semibold">
          {t('fc.deck')}
          <select
            className="mt-1.5 block rounded-lg border border-border bg-surface px-2 py-1.5 font-normal text-text"
            value={deck}
            onChange={(e) => {
              setDeck(e.target.value as Deck);
              setTopic('');
            }}
          >
            <option value="glossary">{t('fc.deck.glossary')}</option>
            <option value="facts">{t('fc.deck.facts')}</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          {t('fc.topic')}
          <select
            className="mt-1.5 block max-w-xs rounded-lg border border-border bg-surface px-2 py-1.5 font-normal text-text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">{t('fc.allTopics')}</option>
            {topicOptions.map((c) => (
              <option key={c} value={c}>
                {c === 'WORLD' ? t('qh.countries.title') : (names[c] ?? c)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {done ? (
        <div className="card p-6">
          <p className="text-lg font-semibold" aria-live="polite">
            {t('fc.done', { known: known.length, again: again.length })}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {again.length > 0 && (
              <button type="button" className="btn btn-primary" onClick={() => start(allCards.filter((c) => again.includes(c.id)))}>
                {t('fc.repeat')}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => start(allCards)}>
              {t('fc.restart')}
            </button>
          </div>
        </div>
      ) : card ? (
        <div className="card p-6 sm:p-8">
          <p className="text-xs font-semibold text-muted">{t('fc.progress', { n: Math.min(pos + 1, queue.length), total: queue.length })}</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-link uppercase">{t('fc.front')}</p>
          <p ref={frontRef} tabIndex={-1} className={`mt-2 font-semibold outline-none ${deck === 'glossary' ? 'text-2xl' : 'text-lg'}`}>
            {card.front}
          </p>
          <div aria-live="polite">
            {flipped && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="text-xs font-semibold tracking-wide text-link uppercase">{t('fc.back')}</p>
                <p className="mt-2 text-lg">{card.back}</p>
                {card.detail && <p className="mt-2 text-muted">{card.detail}</p>}
                <a className="mt-2 inline-block text-sm" href={url(card.href)}>
                  {deck === 'glossary' ? t('nav.glossary') : t('quiz.readLesson')} →
                </a>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {!flipped ? (
              <button type="button" className="btn btn-primary" onClick={() => setFlipped(true)} autoFocus>
                {t('fc.flip')}
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-ghost" onClick={() => answer(false)}>
                  ↺ {t('fc.again')}
                </button>
                <button type="button" className="btn btn-primary" onClick={() => answer(true)}>
                  ✓ {t('fc.know')}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="card p-5 text-muted">{t('quiz.noQuestions')}</p>
      )}
    </div>
  );
}
