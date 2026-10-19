/**
 * Structured data (schema.org JSON-LD) for search engines. Pure functions: pages pass absolute URLs.
 * Only facts the page itself shows go in here (title, summary, review date, level), never ratings or prices.
 */
export type JsonLd = Record<string, unknown>;

export interface Crumb {
  name: string;
  url: string;
}

export function publisher(siteUrl: string, name: string): JsonLd {
  return {
    '@type': 'Organization',
    name,
    url: siteUrl,
    logo: new URL('brand/stockora-mark.svg', siteUrl).href,
  };
}

export function website(opts: { siteUrl: string; name: string; description: string; searchUrl: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: opts.name,
    url: opts.siteUrl,
    description: opts.description,
    inLanguage: 'en',
    publisher: publisher(opts.siteUrl, opts.name),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${opts.searchUrl}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbs(items: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  };
}

export function lesson(opts: {
  title: string;
  summary: string;
  url: string;
  lastReviewed: string;
  level: string;
  topic: string;
  siteUrl: string;
  siteName: string;
  image: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['Article', 'LearningResource'],
    headline: opts.title,
    description: opts.summary,
    url: opts.url,
    mainEntityOfPage: opts.url,
    image: opts.image,
    dateModified: opts.lastReviewed,
    inLanguage: 'en',
    isAccessibleForFree: true,
    educationalLevel: opts.level,
    learningResourceType: 'Lesson',
    about: opts.topic,
    author: publisher(opts.siteUrl, opts.siteName),
    publisher: publisher(opts.siteUrl, opts.siteName),
  };
}

/** Serialise for a <script type="application/ld+json"> tag; "<" is escaped so text can never close the tag. */
export function toScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
