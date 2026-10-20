/**
 * Content collections. All site content lives in /content and is validated here at build time:
 * a missing field, wrong category letter or malformed date stops the build with a clear error.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const CATEGORY_IDS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
] as const;

const categoryId = z.enum(CATEGORY_IDS);
const level = z.enum(['beginner', 'intermediate', 'advanced']);
/** "2026-10" or "2026-10-11". YAML turns an unquoted full date into a Date object, so accept that too. */
const reviewDate = z.union([
  z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, { error: 'Use YYYY-MM or YYYY-MM-DD' }),
  z.date().transform((d) => d.toISOString().slice(0, 10)),
]);
const source = z.object({ title: z.string(), url: z.url() });

const categories = defineCollection({
  loader: file('content/categories.json'),
  schema: z.object({
    id: categoryId,
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    summary: z.string(),
    levels: z.array(level).min(1),
    pathOrder: z.number().int().positive(),
    pathStage: z.enum(['basics', 'markets', 'risk', 'rules']),
  }),
});

const lessons = defineCollection({
  // Files starting with "_" (e.g. _TEMPLATE.md) are ignored.
  loader: glob({ pattern: '**/[^_]*.md', base: './content/lessons' }),
  schema: z.object({
    title: z.string(),
    category: categoryId,
    order: z.number().int().nonnegative(),
    level,
    summary: z.string(),
    readingTime: z.number().positive(),
    tags: z.array(z.string()).default([]),
    lastReviewed: reviewDate,
    sources: z.array(source).min(1),
    draft: z.boolean().default(false),
  }),
});

const glossary = defineCollection({
  loader: file('content/glossary.json'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    term: z.string(),
    definition: z.string(),
    example: z.string().optional(),
    related: z.array(z.string()).default([]),
    categories: z.array(categoryId).min(1),
    de: z.string().optional(),
    aliases: z.array(z.string()).default([]),
  }),
});

const videos = defineCollection({
  loader: file('content/videos.json'),
  schema: z.object({
    id: z.string().regex(/^[A-Za-z0-9_-]{11}$/, { error: 'Must be an 11-character YouTube video ID' }),
    title: z.string(),
    channel: z.string(),
    categories: z.array(z.union([categoryId, z.string()])).min(1),
    level,
    durationMinutes: z.number().positive(),
    language: z.string().min(2),
    whyGood: z.string(),
    lastChecked: reviewDate,
    /** Lesson keys ("<topic-slug>/<lesson-slug>") where the video is shown. */
    lessons: z.array(z.string()).default([]),
  }),
});

const hhmm = z.string().regex(/^\d{2}:\d{2}$/, { error: 'Use HH:MM (24-hour, exchange local time)' });
const session = z.object({
  type: z.enum(['pre', 'auction-open', 'regular', 'lunch', 'auction-close', 'post']),
  start: hhmm,
  end: hhmm,
  label: z.string().optional(),
});

/**
 * Exchange hours and holidays for the Trading Times tool. All times are local exchange time;
 * the tool converts them with the browser's time-zone database, so DST is never hard-coded.
 */
const exchanges = defineCollection({
  loader: file('content/exchanges.json'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    shortName: z.string(),
    city: z.string(),
    country: z.string().length(2),
    region: z.enum(['europe', 'americas', 'asia-pacific', 'middle-east-africa']),
    timeZone: z.string(),
    website: z.url(),
    hoursSource: z.url(),
    sessions: z.array(session).min(1),
    /** Different sessions on particular weekdays (0 = Sunday … 6 = Saturday), e.g. shorter Fridays. */
    weekdaySessions: z.record(z.string().regex(/^[0-6]$/), z.array(session).min(1)).optional(),
    /** Trading weekdays (0 = Sunday … 6 = Saturday). */
    tradingDays: z.array(z.number().int().min(0).max(6)).default([1, 2, 3, 4, 5]),
    /** Last date (YYYY-MM-DD) for which the published sessions are confirmed. */
    sessionsValidUntil: z.iso.date().optional(),
    holidays: z
      .array(
        z.object({
          date: z.iso.date(),
          name: z.string(),
          /** Regular trading ends early at this time (the closing auction follows). */
          earlyClose: hhmm.optional(),
          /** Extended session end on early-close days (otherwise dropped). */
          earlyPostClose: hhmm.optional(),
          /** Regular trading starts late at this time. */
          lateOpen: hhmm.optional(),
          /** Shortened day whose exact hours the exchange has not published here. */
          halfDay: z.boolean().optional(),
        }),
      )
      .default([]),
    holidaysSource: z.url(),
    /** Years for which the full official holiday list is included. */
    holidayYears: z.array(z.number().int()).default([]),
    extraSources: z.array(source).default([]),
    asOf: reviewDate,
    notes: z.string().optional(),
  }),
});

const textItem = z.object({ title: z.string(), text: z.string() });

const countries = defineCollection({
  loader: glob({ pattern: '[^_]*.json', base: './content/countries' }),
  schema: z.object({
    /** ISO 3166-1 alpha-2 code in upper case; the page lives at /world/<code in lower case>. */
    code: z.string().regex(/^[A-Z]{2}$/),
    name: z.string(),
    region: z.enum(['europe', 'americas', 'asia-pacific', 'middle-east-africa']),
    /** Shown first and used as the home example (Austria). */
    home: z.boolean().default(false),
    summary: z.string(),
    currency: z.object({ code: z.string().length(3), name: z.string(), note: z.string() }),
    /** Equity market classification by index providers (as of a date, with source). */
    classification: z.object({ ftse: z.enum(['Developed', 'Advanced Emerging', 'Secondary Emerging', 'Frontier', 'Unclassified']), asOf: reviewDate, source }),
    /** Number of listed companies, market capitalisation and similar, each with its own date and source. */
    marketSize: z.array(z.object({ label: z.string(), value: z.string(), asOf: reviewDate, source })).default([]),
    exchanges: z
      .array(
        z.object({
          name: z.string(),
          /** Id in content/exchanges.json, if the exchange is in the Trading Times tool. */
          tradingTimesId: z.string().optional(),
          city: z.string(),
          founded: z.string().optional(),
          website: z.url(),
          /** Plain-language summary of regular trading hours in local time. */
          hours: z.string(),
          timeZone: z.string(),
          hoursSource: z.url(),
          holidaysSource: z.url().optional(),
          note: z.string().optional(),
        }),
      )
      .min(1),
    indexes: z.array(z.object({ name: z.string(), constituents: z.string().optional(), description: z.string(), source })).min(1),
    regulators: z.array(z.object({ name: z.string(), role: z.string(), url: z.url() })).min(1),
    investorProtection: z.array(z.object({ name: z.string(), text: z.string(), url: z.url() })).default([]),
    settlement: z.object({ cycle: z.string(), csd: z.string(), note: z.string().optional(), asOf: reviewDate, source }),
    /** Market rules that differ from what a European investor may expect. */
    rules: z.array(textItem.extend({ source: source.optional() })).default([]),
    taxes: z.object({
      asOf: reviewDate,
      /** One line for the comparison table. */
      glance: z.string(),
      items: z.array(textItem).min(1),
      sources: z.array(source).min(1),
    }),
    /** How a foreign (Austrian) investor can access the market, in general terms. */
    access: z.array(z.string()).min(1),
    /** Neutral examples of well-known listed companies (never recommendations). */
    companies: z.array(z.string()).default([]),
    history: z.array(z.object({ year: z.string(), text: z.string() })).default([]),
    funFacts: z.array(z.string()).default([]),
    /** Lesson keys ("<category-slug>/<lesson>") related to this country. */
    lessons: z.array(z.string()).default([]),
    lastReviewed: reviewDate,
    sources: z.array(source).min(1),
  }),
});

// ---- Quizzes: every file in /content/quizzes is an array of questions. ----
const questionBase = {
  id: z.string().regex(/^[A-Z0-9]+-[A-Z0-9-]+$/, { error: 'IDs look like "D-017" or "AT-003"' }),
  category: z.string(),
  topic: z.string(),
  difficulty: level,
  question: z.string(),
  explanation: z.string(),
  lessonLink: z.string().startsWith('/'),
  sources: z.array(z.url()).default([]),
  lastReviewed: reviewDate,
};

const question = z.discriminatedUnion('type', [
  z.object({ ...questionBase, type: z.literal('multiple_choice'), options: z.array(z.string()).min(2), answerIndex: z.number().int().nonnegative() }),
  z.object({ ...questionBase, type: z.literal('multiple_select'), options: z.array(z.string()).min(2), answers: z.array(z.number().int().nonnegative()).min(1) }),
  z.object({ ...questionBase, type: z.literal('true_false'), answerBool: z.boolean() }),
  z.object({ ...questionBase, type: z.literal('number'), answerNumber: z.number(), tolerance: z.number().nonnegative().default(0), unit: z.string().optional() }),
  z.object({ ...questionBase, type: z.literal('match'), pairs: z.array(z.tuple([z.string(), z.string()])).min(2) }),
  z.object({ ...questionBase, type: z.literal('order'), orderedItems: z.array(z.string()).min(2) }),
]);

const quizzes = defineCollection({
  loader: async () => {
    const dir = 'content/quizzes';
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
      .flatMap((f) => {
        const items = JSON.parse(readFileSync(join(dir, f), 'utf8')) as Array<{ id: string }>;
        return items.map((q) => ({ ...q, sourceFile: f }));
      });
  },
  schema: question.and(z.object({ sourceFile: z.string() })),
});

// ---- "How Stocks Are Made" journey page ----
const journeySteps = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './content/how-stocks-are-made/steps' }),
  schema: z.object({
    step: z.number().int().positive(),
    title: z.string(),
    /** Short label for the pipeline diagram. */
    short: z.string(),
    summary: z.string(),
    /** Lesson keys ("<topic-slug>/<lesson-slug>") for "Go deeper" links and the step's mini-quiz. */
    lessons: z.array(z.string()).min(1),
    /** Interactive tool shown at the end of the step. */
    tool: z.enum(['cap-table', 'bookbuilding']).optional(),
    lastReviewed: reviewDate,
    sources: z.array(source).min(1),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './content/how-stocks-are-made/cases' }),
  schema: z.object({
    order: z.number().int().nonnegative(),
    year: z.number().int(),
    title: z.string(),
    place: z.string(),
    summary: z.string(),
    lastReviewed: reviewDate,
    sources: z.array(source).min(1),
  }),
});

// ---- History timeline (/history) ----
const history = defineCollection({
  loader: file('content/history.json'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    /** Year used for ordering and the era filter. */
    year: z.number().int(),
    /** Date as shown, e.g. "17 May 1792" or "1630s". */
    date: z.string(),
    kind: z.enum(['milestone', 'crash', 'bubble', 'rule', 'technology']),
    title: z.string(),
    what: z.string(),
    why: z.string(),
    lesson: z.string(),
    /** Popular belief versus what the sources show. */
    myth: z.object({ myth: z.string(), fact: z.string() }).optional(),
    /** Planned events (shown under "Coming up" until they happen). */
    planned: z.boolean().default(false),
    /** Site links ("/learn/…", "/world/…"). */
    links: z.array(z.object({ title: z.string(), href: z.string() })).default([]),
    sources: z.array(source).min(1),
  }),
});

/** Information pages (about, disclaimer, privacy, …), one Markdown file per language: content/pages/<locale>/<slug>.md */
const pages = defineCollection({
  loader: glob({ pattern: '*/[^_]*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    lead: z.string().optional(),
    lastUpdated: reviewDate.optional(),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { categories, lessons, glossary, videos, exchanges, countries, quizzes, journeySteps, caseStudies, history, pages };
