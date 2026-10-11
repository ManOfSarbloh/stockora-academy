import { describe, expect, it } from 'vitest';
import { joinBase, stripBase } from '../src/lib/url';

describe('joinBase', () => {
  it('adds a trailing slash to page links', () => {
    expect(joinBase('/', '/learn')).toBe('/learn/');
    expect(joinBase('/', 'learn/foundations')).toBe('/learn/foundations/');
  });

  it('keeps the home page as the base', () => {
    expect(joinBase('/', '/')).toBe('/');
    expect(joinBase('/stockora-academy/', '/')).toBe('/stockora-academy/');
  });

  it('prefixes a project-site base path', () => {
    expect(joinBase('/stockora-academy', '/learn')).toBe('/stockora-academy/learn/');
    expect(joinBase('/stockora-academy/', '/learn/')).toBe('/stockora-academy/learn/');
  });

  it('leaves file links without a trailing slash', () => {
    expect(joinBase('/repo/', '/favicon.svg')).toBe('/repo/favicon.svg');
    expect(joinBase('/', '/sitemap-index.xml')).toBe('/sitemap-index.xml');
  });

  it('keeps hash fragments after the slash', () => {
    expect(joinBase('/', '/glossary#limit-order')).toBe('/glossary/#limit-order');
  });
});

describe('stripBase', () => {
  it('returns a normalised path without the base', () => {
    expect(stripBase('/stockora-academy/', '/stockora-academy/learn/foundations/')).toBe('/learn/foundations');
    expect(stripBase('/', '/learn/')).toBe('/learn');
    expect(stripBase('/', '/')).toBe('/');
    expect(stripBase('/stockora-academy/', '/stockora-academy/')).toBe('/');
  });
});
