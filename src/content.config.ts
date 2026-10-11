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

const session = z.object({
  type: z.enum(['pre', 'auction-open', 'regular', 'lunch', 'auction-close', 'post']),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

const exchanges = defineCollection({
  loader: file('content/exchanges.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string().length(2),
    timeZone: z.string(),
    website: z.url(),
    hoursSource: z.url(),
    sessions: z.array(session).min(1),
    holidays: z
      .array(z.object({ date: z.iso.date(), name: z.string(), earlyClose: z.string().optional() }))
      .default([]),
    holidaysSource: z.url().optional(),
    asOf: reviewDate,
    notes: z.string().optional(),
  }),
});

const countries = defineCollection({
  loader: glob({ pattern: '[^_]*.json', base: './content/countries' }),
  schema: z.object({
    code: z.string().length(2),
    name: z.string(),
    region: z.string(),
    currency: z.string().length(3),
    exchanges: z.array(z.string()).default([]),
    lastReviewed: reviewDate,
    sources: z.array(source).min(1),
  }).loose(),
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

export const collections = { categories, lessons, glossary, videos, exchanges, countries, quizzes, journeySteps, caseStudies };
