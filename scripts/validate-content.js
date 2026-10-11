#!/usr/bin/env node
/**
 * Cross-file content checks that the per-entry schemas in src/content.config.ts cannot do:
 * unique IDs across files, references that must exist, and progress towards the content targets.
 * Exit code 1 on errors; targets are only reported.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT = 'content';
const errors = [];
const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));
const jsonFiles = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')) : [];

// Categories
const categories = readJSON(join(CONTENT, 'categories.json'));
const catIds = new Set(categories.map((c) => c.id));
const slugs = new Set();
const orders = new Set();
for (const c of categories) {
  if (slugs.has(c.slug)) errors.push(`categories: duplicate slug "${c.slug}"`);
  if (orders.has(c.pathOrder)) errors.push(`categories: duplicate pathOrder ${c.pathOrder}`);
  slugs.add(c.slug);
  orders.add(c.pathOrder);
}

// Lessons: collect valid lesson keys ("<topic-slug>/<lesson-slug>") and page paths
const slugByLetter = Object.fromEntries(categories.map((c) => [c.id, c.slug]));
const lessonKeys = new Set();
const validPaths = new Set(categories.map((c) => `/learn/${c.slug}`));
const lessonsDir = join(CONTENT, 'lessons');
for (const letter of existsSync(lessonsDir) ? readdirSync(lessonsDir) : []) {
  const dir = join(lessonsDir, letter);
  if (!slugByLetter[letter]) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const key = `${slugByLetter[letter]}/${f.replace(/\.md$/, '')}`;
    lessonKeys.add(key);
    validPaths.add(`/learn/${key}`);
  }
}
const pathOk = (p) => validPaths.has(p.split('#')[0].replace(/\/$/, ''));

// Glossary
const glossary = readJSON(join(CONTENT, 'glossary.json'));
const termIds = new Set();
for (const g of glossary) {
  if (termIds.has(g.id)) errors.push(`glossary: duplicate id "${g.id}"`);
  termIds.add(g.id);
}
for (const g of glossary) {
  for (const r of g.related ?? []) if (!termIds.has(r)) errors.push(`glossary "${g.id}": related term "${r}" does not exist`);
  for (const c of g.categories ?? []) if (!catIds.has(c)) errors.push(`glossary "${g.id}": unknown category "${c}"`);
}

// Videos
const videos = readJSON(join(CONTENT, 'videos.json'));
const videoIds = new Set();
for (const v of videos) {
  if (videoIds.has(v.id)) errors.push(`videos: duplicate id "${v.id}"`);
  videoIds.add(v.id);
  for (const k of v.lessons ?? []) if (!lessonKeys.has(k)) errors.push(`videos ${v.id}: lesson "${k}" does not exist`);
}

// Quizzes
const qIds = new Map();
const byDifficulty = { beginner: 0, intermediate: 0, advanced: 0 };
const perFile = {};
for (const f of jsonFiles(join(CONTENT, 'quizzes'))) {
  const items = readJSON(join(CONTENT, 'quizzes', f));
  perFile[f] = items.length;
  for (const q of items) {
    if (qIds.has(q.id)) errors.push(`quizzes: id "${q.id}" in ${f} already used in ${qIds.get(q.id)}`);
    qIds.set(q.id, f);
    if (q.difficulty in byDifficulty) byDifficulty[q.difficulty]++;
    if (q.lessonLink && !pathOk(q.lessonLink)) errors.push(`quizzes ${q.id}: lessonLink "${q.lessonLink}" does not match any lesson or topic page`);
    if (q.type === 'multiple_choice' && !(q.answerIndex < q.options?.length))
      errors.push(`quizzes ${q.id}: answerIndex out of range`);
    if (q.type === 'multiple_select' && q.answers?.some((a) => a >= q.options?.length))
      errors.push(`quizzes ${q.id}: an answer index is out of range`);
  }
}

// Report
const total = qIds.size;
const pct = (n) => (total ? `${Math.round((n / total) * 100)}%` : '-');
console.log('Content summary');
console.log(`  categories      ${categories.length}`);
console.log(`  lessons         ${lessonKeys.size}`);
console.log(`  glossary terms  ${glossary.length} / 400 target`);
console.log(`  videos          ${videos.length}`);
console.log(`  quiz questions  ${total} / 900 target`);
console.log(
  `    difficulty    beginner ${pct(byDifficulty.beginner)}, intermediate ${pct(byDifficulty.intermediate)}, advanced ${pct(byDifficulty.advanced)} (target 40/40/20)`,
);
for (const [f, n] of Object.entries(perFile)) console.log(`    ${f.padEnd(30)}${n}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n✓ No content errors.');
