import { describe, expect, it } from 'vitest';
import { breadcrumbs, lesson, toScript, website } from '../src/lib/seo';

describe('structured data', () => {
  it('numbers breadcrumbs from 1', () => {
    const b = breadcrumbs([
      { name: 'Learn', url: 'https://example.org/learn/' },
      { name: 'A. Foundations', url: 'https://example.org/learn/foundations/' },
    ]);
    expect(b['@type']).toBe('BreadcrumbList');
    const items = b.itemListElement as { position: number; item: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items[1].item).toBe('https://example.org/learn/foundations/');
  });

  it('builds the site search action from the search page URL', () => {
    const w = website({ siteUrl: 'https://example.org/sa/', name: 'S', description: 'D', searchUrl: 'https://example.org/sa/search/' });
    expect((w.potentialAction as { target: { urlTemplate: string } }).target.urlTemplate).toBe(
      'https://example.org/sa/search/?q={search_term_string}',
    );
    expect((w.publisher as { logo: string }).logo).toBe('https://example.org/sa/brand/stockora-mark.svg');
  });

  it('uses the review date as dateModified for lessons', () => {
    const l = lesson({
      title: 'What is a stock?',
      summary: 'S',
      url: 'https://example.org/learn/x/',
      lastReviewed: '2026-10-11',
      level: 'Beginner',
      topic: 'Foundations',
      siteUrl: 'https://example.org/',
      siteName: 'Stockora Academy',
      image: 'https://example.org/og-default.png',
    });
    expect(l.dateModified).toBe('2026-10-11');
    expect(l.isAccessibleForFree).toBe(true);
  });

  it('escapes "<" so content cannot close the script tag', () => {
    const s = toScript({ name: '</script><script>alert(1)</script>' });
    expect(s).not.toContain('<');
    expect(JSON.parse(s).name).toBe('</script><script>alert(1)</script>');
  });
});
