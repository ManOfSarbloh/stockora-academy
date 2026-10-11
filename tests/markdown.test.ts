import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { parseMarker, remarkCallouts } from '../src/lib/markdown/callouts';
import { buildMatcher, rehypeGlossaryLinks, type GlossaryTerm } from '../src/lib/markdown/glossary-links';
import { prefixBase } from '../src/lib/markdown/base-links';

const terms: GlossaryTerm[] = [
  { id: 'stock', term: 'Stock', aliases: ['share'], definition: 'A unit of ownership.' },
  { id: 'shareholder', term: 'Shareholder', definition: 'An owner of shares.' },
  { id: 'market-order', term: 'Market order', definition: 'Buy or sell at the best available price.' },
  { id: 'market', term: 'Market', definition: 'A place where things are traded.' },
  { id: 'pe', term: 'P/E', aliases: ['P/E ratio'], definition: 'Price divided by earnings per share.' },
  { id: 't-plus-1', term: 'T+1', definition: 'Settlement one business day after the trade.' },
];

async function md(src: string, base = '/') {
  const file = await unified()
    .use(remarkParse)
    .use(remarkCallouts)
    .use(remarkRehype)
    .use(rehypeGlossaryLinks, { terms, base })
    .use(rehypeStringify)
    .process(src);
  return String(file);
}

describe('parseMarker', () => {
  it('reads kind and default title', () => {
    expect(parseMarker('[!EXAMPLE]\nrest')).toEqual({ kind: 'example', title: 'Example', rest: 'rest' });
  });
  it('reads a custom title', () => {
    expect(parseMarker('[!mistake] Price is not value')?.title).toBe('Price is not value');
  });
  it('maps GitHub alert names', () => {
    expect(parseMarker('[!CAUTION]')?.kind).toBe('warning');
  });
  it('ignores unknown kinds and normal text', () => {
    expect(parseMarker('[!BANANA]')).toBeNull();
    expect(parseMarker('Just a quote')).toBeNull();
  });
});

describe('remarkCallouts', () => {
  it('turns an alert blockquote into an aside with a title', async () => {
    const html = await md('> [!EXAMPLE]\n> You buy 25 of 1,000 shares.');
    expect(html).toContain('<aside class="callout callout-example" aria-label="Example">');
    expect(html).toContain('<p class="callout-title">Example</p>');
    expect(html).toContain('You buy 25 of 1,000');
    expect(html).not.toContain('[!EXAMPLE]');
  });

  it('keeps ordinary blockquotes untouched', async () => {
    expect(await md('> A normal quote')).toContain('<blockquote>');
  });

  it('supports a custom title and multiple paragraphs', async () => {
    const html = await md('> [!MISTAKE] Cheap price\n> First.\n>\n> Second.');
    expect(html).toContain('<p class="callout-title">Cheap price</p>');
    expect(html).toMatch(/First\.<\/p>\s*<p>Second\./);
  });
});

describe('glossary matcher', () => {
  const m = buildMatcher(terms)!;
  const found = (s: string) => [...s.matchAll(m.regex)].map((x) => x[0]);

  it('matches whole words, case-insensitive, with plurals', () => {
    expect(found('Stocks and a share')).toEqual(['Stocks', 'share']);
  });
  it('does not match inside longer words', () => {
    expect(found('A shareholder')).toEqual(['shareholder']);
    expect(found('supermarkets')).toEqual([]);
  });
  it('prefers the longest phrase', () => {
    expect(found('Use a market order')).toEqual(['market order']);
  });
  it('handles terms with symbols', () => {
    expect(found('The P/E ratio is 20. T+1 settlement.')).toEqual(['P/E ratio', 'T+1']);
  });
});

describe('rehypeGlossaryLinks', () => {
  it('links only the first mention of each term', async () => {
    const html = await md('A share is a share.');
    expect(html.match(/class="gloss"/g)).toHaveLength(1);
    expect(html).toContain('href="/glossary/#stock"');
    expect(html).toContain('data-def="A unit of ownership."');
  });

  it('respects the base path', async () => {
    expect(await md('A share.', '/stockora-academy')).toContain('href="/stockora-academy/glossary/#stock"');
  });

  it('skips headings, links, code and callout titles', async () => {
    const html = await md('## Stock basics\n\n[a share](/x) and `share`\n\n> [!NOTE] Market\n> text');
    expect(html).not.toContain('class="gloss"');
  });

  it('still links inside emphasis and lists', async () => {
    const html = await md('- Each **share** counts');
    expect(html).toContain('<strong><a href="/glossary/#stock"');
  });
});

describe('base path for internal links', () => {
  it('prefixes only site-internal absolute links', () => {
    expect(prefixBase('/charts/lab', '/stockora-academy/')).toBe('/stockora-academy/charts/lab');
    expect(prefixBase('/charts/lab', '/')).toBe('/charts/lab');
    expect(prefixBase('https://example.org/x', '/stockora-academy/')).toBe('https://example.org/x');
    expect(prefixBase('//cdn.example.org/x', '/stockora-academy/')).toBe('//cdn.example.org/x');
    expect(prefixBase('#top', '/stockora-academy/')).toBe('#top');
    expect(prefixBase('/stockora-academy/charts', '/stockora-academy/')).toBe('/stockora-academy/charts');
  });
});
