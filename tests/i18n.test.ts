import { describe, expect, it } from 'vitest';
import { en } from '../src/i18n/en';
import { dictionaries } from '../src/i18n/dictionaries';
import { isEnglishOnly, localeFromPath, localizePath, stripLocale } from '../src/i18n/routes';
import { localizeHtml } from '../src/i18n/localize-html';

describe('language paths', () => {
  it('reads and strips the language prefix', () => {
    expect(localeFromPath('/de/tools/')).toBe('de');
    expect(localeFromPath('/tools/')).toBe('en');
    expect(localeFromPath('/')).toBe('en');
    expect(stripLocale('/de/tools/')).toBe('/tools/');
    expect(stripLocale('/de')).toBe('/');
    expect(stripLocale('/de/')).toBe('/');
    expect(stripLocale('/learn/')).toBe('/learn/');
  });

  it('localises page paths but not files', () => {
    expect(localizePath('/tools/', 'de')).toBe('/de/tools/');
    expect(localizePath('/', 'fr')).toBe('/fr/');
    expect(localizePath('/de/tools/', 'en')).toBe('/tools/');
    expect(localizePath('/de/tools/', 'ru')).toBe('/ru/tools/');
    expect(localizePath('/glossary#etf', 'it')).toBe('/it/glossary#etf');
    expect(localizePath('/og-default.png', 'de')).toBe('/og-default.png');
    expect(localizePath('/quizzes/questions.json', 'es')).toBe('/quizzes/questions.json');
  });

  it('knows which pages have English-only content', () => {
    expect(isEnglishOnly('/learn/foundations/what-is-a-stock/')).toBe(true);
    expect(isEnglishOnly('/learn/foundations/')).toBe(true);
    expect(isEnglishOnly('/learn/')).toBe(false);
    expect(isEnglishOnly('/world/at/')).toBe(true);
    expect(isEnglishOnly('/tools/leverage/')).toBe(false);
    expect(isEnglishOnly('/glossary/')).toBe(false);
  });
});

describe('localizeHtml', () => {
  it('keeps internal links in the page language', () => {
    const html = '<a href="/r/learn/x/">x</a> <a class="c" href="/r/">home</a> <form action="/r/search/">';
    expect(localizeHtml(html, 'de', '/r/')).toBe('<a href="/r/de/learn/x/">x</a> <a class="c" href="/r/de/">home</a> <form action="/r/de/search/">');
  });

  it('leaves the language switcher, files, other languages and external links alone', () => {
    const html =
      '<a href="/r/learn/" hreflang="en">EN</a><a href="/r/og.png">i</a><a href="/r/fr/tools/">fr</a><a href="https://x.org/">x</a><a href="#top">t</a>';
    expect(localizeHtml(html, 'de', '/r/')).toBe(html);
  });

  it('does nothing on English pages', () => {
    expect(localizeHtml('<a href="/learn/">x</a>', 'en', '/')).toBe('<a href="/learn/">x</a>');
  });
});

describe('UI dictionaries', () => {
  it('only registers known languages', () => {
    for (const locale of Object.keys(dictionaries)) expect(['de', 'es', 'fr', 'it', 'ru']).toContain(locale);
  });
  const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  for (const [locale, dict] of Object.entries(dictionaries)) {
    it(`${locale} has every key, with the same placeholders as English`, () => {
      const missing = Object.keys(en).filter((k) => !(k in dict));
      expect(missing).toEqual([]);
      const extra = Object.keys(dict).filter((k) => !(k in en));
      expect(extra).toEqual([]);
      const wrong = Object.entries(dict)
        .filter(([k, v]) => JSON.stringify(placeholders(v as string)) !== JSON.stringify(placeholders(en[k as keyof typeof en])))
        .map(([k]) => k);
      expect(wrong).toEqual([]);
      const empty = Object.entries(dict).filter(([, v]) => !(v as string).trim()).map(([k]) => k);
      expect(empty).toEqual([]);
    });
  }
});
