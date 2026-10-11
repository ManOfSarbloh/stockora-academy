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
console.log(`  glossary terms  ${glossary.length} / 400 target`);
console.log(`  videos          ${videos.length}`);
console.log(`  quiz questions  ${total} / 900 target`);
console.log(
  `    difficulty    beginner ${pct(byDifficulty.beginner)}, intermediate ${pct(byDifficulty.intermediate)}, advanced ${pct(byDifficulty.advanced)} (target 40/40/20)`,
);
for (const [f, n] of Object.entries(perFile)) console.log(`    ${f.padEnd(16)}${n}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n✓ No content errors.');
