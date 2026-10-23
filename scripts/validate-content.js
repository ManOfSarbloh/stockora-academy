#!/usr/bin/env node
/**
 * Cross-file content checks that the per-entry schemas in src/content.config.ts cannot do:
 * unique IDs across files, references that must exist, and progress towards the content targets.
 * Exit code 1 on errors; targets are only reported.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { basename } from 'node:path';
import { translateSvg } from './lib/figure-text.mjs';

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
const lessonFiles = new Map(); // "A/slug" -> English markdown
const validPaths = new Set(categories.map((c) => `/learn/${c.slug}`));
const lessonsDir = join(CONTENT, 'lessons');
for (const letter of existsSync(lessonsDir) ? readdirSync(lessonsDir) : []) {
  const dir = join(lessonsDir, letter);
  if (!slugByLetter[letter]) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    const key = `${slugByLetter[letter]}/${f.replace(/\.md$/, '')}`;
    lessonKeys.add(key);
    lessonFiles.set(`${letter}/${f}`, readFileSync(join(dir, f), 'utf8'));
    validPaths.add(`/learn/${key}`);
    // Front matter must be valid YAML (an unquoted ": " in a summary breaks it), and tags must be text.
    try {
      const data = parseYaml(readFileSync(join(dir, f), 'utf8').split(/^---$/m)[1] ?? '');
      for (const t of data?.tags ?? []) if (typeof t !== 'string') errors.push(`lesson ${key}: tag ${t} must be quoted text`);
    } catch (e) {
      errors.push(`lesson ${key}: invalid front matter (${e.message.split('\n')[0]})`);
    }
  }
}
validPaths.add('/how-stocks-are-made');

// World Markets: country pages, their related lessons and Trading Times links.
const countriesDir = join(CONTENT, 'countries');
const exchangeIds = new Set((existsSync(join(CONTENT, 'exchanges.json')) ? readJSON(join(CONTENT, 'exchanges.json')) : []).map((e) => e.id));
const countryCodes = new Set();
for (const f of jsonFiles(countriesDir)) {
  const c = readJSON(join(countriesDir, f));
  if (f !== `${String(c.code).toLowerCase()}.json`) errors.push(`countries ${f}: file name must be the lower-case country code`);
  if (countryCodes.has(c.code)) errors.push(`countries: duplicate code "${c.code}"`);
  countryCodes.add(c.code);
  validPaths.add(`/world/${String(c.code).toLowerCase()}`);
  for (const k of c.lessons ?? []) if (!lessonKeys.has(k)) errors.push(`countries ${c.code}: lesson "${k}" does not exist`);
  for (const e of c.exchanges ?? [])
    if (e.tradingTimesId && !exchangeIds.has(e.tradingTimesId)) errors.push(`countries ${c.code}: tradingTimesId "${e.tradingTimesId}" is not in exchanges.json`);
}
validPaths.add('/world');
const pathOk = (p) => validPaths.has(p.split('#')[0].replace(/\/$/, ''));

// "How Stocks Are Made" journey: step numbers 1..n without gaps, and every linked lesson must exist.
const stepsDir = join(CONTENT, 'how-stocks-are-made', 'steps');
const stepFiles = existsSync(stepsDir) ? readdirSync(stepsDir).filter((f) => f.endsWith('.md') && !f.startsWith('_')) : [];
const stepNumbers = [];
for (const f of stepFiles) {
  const front = readFileSync(join(stepsDir, f), 'utf8').split('---')[1] ?? '';
  const step = Number(front.match(/^step:\s*(\d+)/m)?.[1]);
  stepNumbers.push(step);
  const list = front.match(/^lessons:\s*\[(.*)\]/m)?.[1] ?? '';
  for (const k of list.split(',').map((x) => x.trim()).filter(Boolean))
    if (!lessonKeys.has(k)) errors.push(`how-stocks-are-made ${f}: lesson "${k}" does not exist`);
}
stepNumbers.sort((a, b) => a - b).forEach((n, i) => {
  if (n !== i + 1) errors.push(`how-stocks-are-made: step numbers must run 1..${stepNumbers.length} without gaps (found ${n})`);
});

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
const qById = new Map();
const byDifficulty = { beginner: 0, intermediate: 0, advanced: 0 };
const perFile = {};
for (const f of jsonFiles(join(CONTENT, 'quizzes'))) {
  const items = readJSON(join(CONTENT, 'quizzes', f));
  perFile[f] = items.length;
  for (const q of items) {
    if (qIds.has(q.id)) errors.push(`quizzes: id "${q.id}" in ${f} already used in ${qIds.get(q.id)}`);
    qIds.set(q.id, f);
    qById.set(q.id, q);
    if (q.difficulty in byDifficulty) byDifficulty[q.difficulty]++;
    if (q.lessonLink && !pathOk(q.lessonLink)) errors.push(`quizzes ${q.id}: lessonLink "${q.lessonLink}" does not match any lesson or topic page`);
    if (q.type === 'multiple_choice' && !(q.answerIndex < q.options?.length))
      errors.push(`quizzes ${q.id}: answerIndex out of range`);
    if (q.type === 'multiple_select' && q.answers?.some((a) => a >= q.options?.length))
      errors.push(`quizzes ${q.id}: an answer index is out of range`);
    if (q.type === 'order' && new Set(q.orderedItems).size !== q.orderedItems?.length)
      errors.push(`quizzes ${q.id}: order items must be unique`);
    // The quiz hub reads the category from the id prefix (review and weak-spot statistics).
    if (q.id.split('-')[0] !== q.category) errors.push(`quizzes ${q.id}: id must start with its category "${q.category}-"`);
    if (q.type === 'match') {
      const rights = (q.pairs ?? []).map((p) => p[1]);
      if ((q.pairs ?? []).length < 2) errors.push(`quizzes ${q.id}: a match question needs at least 2 pairs`);
      if (new Set(rights).size !== rights.length) errors.push(`quizzes ${q.id}: match answers must be unique`);
    }
  }
}

// History timeline: unique ids, links to existing pages (or the live tool pages), sources present.
{
  const live = new Set(['/times', '/tools', '/quizzes', '/videos', '/glossary', '/history', '/scams', '/charts', '/charts/lab', '/charts/candles', '/charts/quiz', '/world/compare']);
  const ids = new Set();
  for (const h of readJSON(join(CONTENT, 'history.json'))) {
    if (ids.has(h.id)) errors.push(`history: duplicate id "${h.id}"`);
    ids.add(h.id);
    for (const l of h.links ?? []) {
      const p = l.href.split('#')[0].replace(/\/$/, '');
      if (!pathOk(l.href) && !live.has(p)) errors.push(`history ${h.id}: link "${l.href}" does not match a page`);
    }
    if (!h.sources?.length) errors.push(`history ${h.id}: needs at least one source`);
  }
}

// Exchanges (Trading Times): sessions in order, holidays on trading days within the covered years,
// and a reminder when the data is getting old (hours and holidays must be re-checked regularly).
const exchangesFile = join(CONTENT, 'exchanges.json');
const exchangeList = existsSync(exchangesFile) ? readJSON(exchangesFile) : [];
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const staleWarnings = [];
const exIds = new Set();
for (const e of exchangeList) {
  if (exIds.has(e.id)) errors.push(`exchanges: duplicate id "${e.id}"`);
  exIds.add(e.id);
  const days = e.tradingDays ?? [1, 2, 3, 4, 5];
  const lists = [e.sessions, ...Object.values(e.weekdaySessions ?? {})];
  for (const list of lists) {
    let prevEnd = -1;
    for (const s of list) {
      if (toMin(s.end) <= toMin(s.start)) errors.push(`exchanges ${e.id}: session ${s.type} ${s.start}-${s.end} ends before it starts`);
      if (toMin(s.start) < prevEnd) errors.push(`exchanges ${e.id}: session ${s.type} ${s.start} overlaps the previous one`);
      prevEnd = toMin(s.end);
    }
  }
  const seen = new Set();
  for (const h of e.holidays ?? []) {
    if (seen.has(h.date)) errors.push(`exchanges ${e.id}: holiday ${h.date} listed twice`);
    seen.add(h.date);
    const wd = new Date(h.date + 'T12:00:00Z').getUTCDay();
    if (!days.includes(wd)) errors.push(`exchanges ${e.id}: holiday ${h.date} is not a trading day`);
    if (!(e.holidayYears ?? []).includes(Number(h.date.slice(0, 4)))) errors.push(`exchanges ${e.id}: holiday ${h.date} is outside holidayYears`);
  }
  const ageDays = (Date.now() - new Date(e.asOf).getTime()) / 86400000;
  if (ageDays > 120) staleWarnings.push(`${e.id} (as of ${e.asOf})`);
  const thisYear = new Date().getUTCFullYear();
  if (!(e.holidayYears ?? []).includes(thisYear + 1) && new Date().getUTCMonth() >= 10) staleWarnings.push(`${e.id}: no ${thisYear + 1} holidays yet`);
}

// ---- Translations (content/i18n/<locale>/*.json, content/pages/<locale>/*.md) ----
const LOCALES = ['de', 'es', 'fr', 'it', 'ru'];
const translationStatus = [];
const scamShield = readJSON('content/scam-shield.json');
const glossaryById = new Map(glossary.map((g) => [g.id, g]));
if (existsSync('content/i18n')) {
  for (const loc of readdirSync('content/i18n')) {
    if (!LOCALES.includes(loc)) {
      errors.push(`content/i18n/${loc}: unknown language (expected one of ${LOCALES.join(', ')})`);
      continue;
    }
    const status = [];
    for (const d of readdirSync(`content/i18n/${loc}`, { withFileTypes: true })) {
      if (d.isDirectory() && d.name !== 'lessons' && d.name !== 'quizzes') errors.push(`content/i18n/${loc}/${d.name}: unknown translation folder`);
    }
    const lessonDir = `content/i18n/${loc}/lessons`;
    if (existsSync(lessonDir)) {
      let n = 0;
      let outdated = 0;
      for (const letter of readdirSync(lessonDir)) {
        for (const f of readdirSync(join(lessonDir, letter)).filter((x) => x.endsWith('.md') && !x.startsWith('_'))) {
          const where = `${lessonDir}/${letter}/${f}`;
          const en = lessonFiles.get(`${letter}/${f}`);
          if (!en) {
            errors.push(`${where}: there is no English lesson content/lessons/${letter}/${f}`);
            continue;
          }
          n++;
          const text = readFileSync(where, 'utf8');
          let fm;
          try {
            fm = parseYaml(text.split(/^---$/m)[1] ?? '') ?? {};
          } catch (e) {
            errors.push(`${where}: invalid front matter (${e.message.split('\n')[0]})`);
            continue;
          }
          const enFm = parseYaml(en.split(/^---$/m)[1] ?? '') ?? {};
          if (!fm.title || !fm.summary || !fm.translatedFrom) errors.push(`${where}: needs title, summary and translatedFrom`);
          if (String(fm.translatedFrom) > String(enFm.lastReviewed)) errors.push(`${where}: translatedFrom is later than the English lastReviewed`);
          if (String(fm.translatedFrom) < String(enFm.lastReviewed)) outdated++;
          // Same figures and animations as the English lesson (images point at the English files).
          const figs = (md, base) =>
            [...md.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => join(base, m[1])).concat([...md.matchAll(/\[!ANIMATION\]\s+(\S+)/g)].map((m) => `anim:${m[1]}`)).sort().join('|');
          if (figs(text, join(lessonDir, letter)) !== figs(en, join('content/lessons', letter))) errors.push(`${where}: figures and animations must match the English lesson (image paths point to ../../../../lessons/${letter}/img/…)`);
          const sections = (md) => (md.match(/^## /gm) ?? []).length;
          if (sections(text) !== sections(en)) errors.push(`${where}: has ${sections(text)} sections (##), the English lesson has ${sections(en)}`);
        }
      }
      status.push(`lessons ${n}/${lessonKeys.size}${outdated ? ` (${outdated} outdated)` : ''}`);
    }
    const quizDir = `content/i18n/${loc}/quizzes`;
    if (existsSync(quizDir)) {
      let n = 0;
      for (const f of jsonFiles(quizDir)) {
        const where = `${quizDir}/${f}`;
        for (const [id, o] of Object.entries(readJSON(where))) {
          const q = qById.get(id);
          if (!q) {
            errors.push(`${where}: unknown question "${id}"`);
            continue;
          }
          n++;
          if (!o.question || !o.explanation) errors.push(`${where} ${id}: needs question and explanation`);
          for (const k of ['options', 'pairs', 'orderedItems']) {
            if (o[k] === undefined) {
              if (q[k]?.some((x) => /[a-z]{3}/i.test(String(x)))) errors.push(`${where} ${id}: ${k} must be translated`);
            } else if (!Array.isArray(q[k]) || o[k].length !== q[k].length) errors.push(`${where} ${id}: ${k} must have ${q[k]?.length ?? 0} entries, in the English order`);
          }
        }
      }
      status.push(`quiz questions ${n}/${qById.size}`);
    }
    for (const f of readdirSync(`content/i18n/${loc}`).filter((n) => n.endsWith('.json'))) {
      const where = `content/i18n/${loc}/${f}`;
      const data = readJSON(where);
      if (f === 'categories.json') {
        for (const [id, v] of Object.entries(data)) {
          if (!catIds.has(id)) errors.push(`${where}: unknown category "${id}"`);
          if (!v.title || !v.summary) errors.push(`${where} ${id}: needs title and summary`);
        }
        status.push(`categories ${Object.keys(data).length}/${catIds.size}`);
      } else if (f === 'glossary.json') {
        for (const [id, v] of Object.entries(data)) {
          const g = glossaryById.get(id);
          if (!g) errors.push(`${where}: unknown term "${id}"`);
          if (!v.term || !v.definition) errors.push(`${where} ${id}: needs term and definition`);
          if (g && Boolean(v.example) !== Boolean(g.example)) errors.push(`${where} ${id}: example must be present exactly when the English entry has one`);
        }
        status.push(`glossary ${Object.keys(data).length}/${glossary.length}`);
      } else if (f === 'scam-shield.json') {
        const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
        if (!same(Object.keys(data.flags ?? {}), scamShield.flags.map((x) => x.id))) errors.push(`${where}: flags must have exactly the English ids`);
        if (!same(Object.keys(data.scenarios ?? {}), scamShield.scenarios.map((x) => x.id))) errors.push(`${where}: scenarios must have exactly the English ids`);
        for (const k of ['checks', 'afterSteps', 'links'])
          if ((data[k] ?? []).length !== scamShield[k].length) errors.push(`${where}: ${k} must have ${scamShield[k].length} entries, in the English order`);
        status.push('scam shield');
      } else if (f === 'figures.json') {
        // Every text in every figure must be translated, and the translated copies must be current.
        const missing = new Set();
        const svgs = [];
        const walkSvg = (d) => {
          for (const n of readdirSync(d, { withFileTypes: true })) {
            const p = join(d, n.name);
            if (n.isDirectory()) walkSvg(p);
            else if (n.name.endsWith('.svg')) svgs.push([p, `public/figures/${loc}/${n.name}`]);
          }
        };
        walkSvg('content/lessons');
        for (const n of readdirSync('src/animations').filter((x) => x.endsWith('.svg'))) svgs.push([join('src/animations', n), `src/animations/${loc}/${n}`]);
        let stale = 0;
        for (const [src, copy] of svgs) {
          const expected = translateSvg(readFileSync(src, 'utf8'), loc, data, missing);
          if (!existsSync(copy) || readFileSync(copy, 'utf8') !== expected) stale++;
        }
        if (missing.size) errors.push(`${where}: ${missing.size} figure texts are not translated, e.g. "${[...missing][0]}"`);
        if (stale) errors.push(`${where}: ${stale} translated figures are missing or out of date (run npm run build:figure-translations)`);
        status.push(`figures ${svgs.length - stale}/${svgs.length}`);
      } else errors.push(`${where}: unknown translation file`);
    }
    translationStatus.push(`${loc}: ${status.join(', ') || 'no data files'}`);
  }
}
if (existsSync('content/pages')) {
  const enPages = new Set(readdirSync('content/pages/en').filter((n) => n.endsWith('.md')));
  for (const loc of readdirSync('content/pages')) {
    if (loc === 'en') continue;
    if (!LOCALES.includes(loc)) errors.push(`content/pages/${loc}: unknown language`);
    for (const f of readdirSync(`content/pages/${loc}`)) if (!enPages.has(f)) errors.push(`content/pages/${loc}/${f}: there is no English page with this name`);
  }
}

// Report
const total = qIds.size;
const pct = (n) => (total ? `${Math.round((n / total) * 100)}%` : '-');
console.log('Content summary');
console.log(`  categories      ${categories.length}`);
console.log(`  lessons         ${lessonKeys.size}`);
console.log(`  journey steps   ${stepFiles.length}`);
console.log(`  exchanges       ${exchangeList.length}`);
console.log(`  countries       ${countryCodes.size} / 20 target`);
console.log(`  glossary terms  ${glossary.length} / 400 target`);
console.log(`  videos          ${videos.length}`);
console.log(`  quiz questions  ${total} / 900 target`);
console.log(
  `    difficulty    beginner ${pct(byDifficulty.beginner)}, intermediate ${pct(byDifficulty.intermediate)}, advanced ${pct(byDifficulty.advanced)} (target 40/40/20)`,
);
for (const [f, n] of Object.entries(perFile)) console.log(`    ${f.padEnd(30)}${n}`);

if (translationStatus.length) console.log(`  translations\n    ${translationStatus.join('\n    ')}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
if (staleWarnings.length) console.log(`\n⚠ Re-check exchange data on the official sites: ${staleWarnings.join(', ')}`);
console.log('\n✓ No content errors.');
