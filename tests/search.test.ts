import { describe, expect, it } from 'vitest';
import { findQuick, normalize, pageType, questionCore, type QuickEntry } from '../src/lib/search';

describe('questionCore', () => {
  it('strips question words and articles in every language', () => {
    expect(questionCore('What is a dividend?')).toBe('dividend');
    expect(questionCore("what's an ETF")).toBe('etf');
    expect(questionCore('What does market cap mean?')).toBe('market cap');
    expect(questionCore('How do I calculate the P/E ratio')).toBe('p e ratio');
    expect(questionCore('Was ist eine Dividende?', 'de')).toBe('dividende');
    expect(questionCore('Was bedeutet KESt', 'de')).toBe('kest');
    expect(questionCore('¿Qué es un dividendo?', 'es')).toBe('dividendo');
    expect(questionCore("Qu'est-ce qu'une action ?", 'fr')).toBe('action');
    expect(questionCore("Qu’est-ce que l’inflation", 'fr')).toBe('inflation');
    expect(questionCore("Cos'è il dividendo?", 'it')).toBe('dividendo');
    expect(questionCore('Что такое дивиденд?', 'ru')).toBe('дивиденд');
  });

  it('understands English questions on translated pages', () => {
    expect(questionCore('what is a stock split', 'de')).toBe('stock split');
  });

  it('leaves plain searches alone and never returns an empty string', () => {
    expect(questionCore('Vienna Stock Exchange')).toBe('vienna stock exchange');
    expect(questionCore('what is')).toBe('what is');
    expect(questionCore('the')).toBe('the');
  });
});

describe('normalize', () => {
  it('drops accents, case and punctuation', () => {
    expect(normalize('  Börse, Übernahme!  ')).toBe('borse ubernahme');
    expect(normalize('S&P 500')).toBe('s&p 500');
  });
});

describe('pageType', () => {
  it('classifies routes for the result filters', () => {
    expect(pageType('/learn/foundations/what-is-a-stock/')).toBe('lesson');
    expect(pageType('/learn/foundations/')).toBe('topic');
    expect(pageType('/learn/')).toBe('topic');
    expect(pageType('/how-stocks-are-made/')).toBe('topic');
    expect(pageType('/glossary/')).toBe('glossary');
    expect(pageType('/world/at/')).toBe('country');
    expect(pageType('/tools/compound-growth/')).toBe('tool');
    expect(pageType('/times/')).toBe('tool');
    expect(pageType('/quizzes/')).toBe('quiz');
    expect(pageType('/charts/lab/')).toBe('chart');
    expect(pageType('/scams/')).toBe('page');
    expect(pageType('/')).toBe('page');
  });
});

describe('findQuick', () => {
  const e = (kind: QuickEntry['kind'], title: string, ...names: string[]): QuickEntry => ({
    kind,
    title,
    href: '/',
    names: [title, ...names].map(normalize),
  });
  const entries = [
    e('term', 'Dividend'),
    e('term', 'Dividend yield'),
    e('term', 'Special dividend'),
    e('term', 'Stock split', 'split', 'splits'),
    e('tool', 'Dividend yield and payout ratio'),
    e('country', 'Austria', 'Österreich'),
    e('term', 'Exchange-traded fund (ETF)', 'etf', 'etfs'),
  ];
  const titles = (q: string) => findQuick(entries, q).map((r) => r.entry.title);

  it('puts the exact term first', () => {
    expect(titles('dividend')[0]).toBe('Dividend');
    expect(titles('dividends')[0]).toBe('Dividend');
    expect(titles('etf')[0]).toBe('Exchange-traded fund (ETF)');
  });

  it('finds partial and word matches', () => {
    expect(titles('dividend yield').slice(0, 2)).toEqual(['Dividend yield', 'Dividend yield and payout ratio']);
    expect(titles('split')).toContain('Stock split');
    expect(titles('osterreich')).toEqual(['Austria']);
  });

  it('ignores very short or unrelated queries', () => {
    expect(findQuick(entries, 'd')).toEqual([]);
    expect(findQuick(entries, 'banana')).toEqual([]);
  });
});
