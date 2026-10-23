#!/usr/bin/env node
/**
 * Translated copies of every SVG figure: lesson diagrams and Chart School drawings
 * (content/lessons/**\/*.svg → public/figures/<locale>/<name>.svg) and animations
 * (src/animations/<name>.svg → src/animations/<locale>/<name>.svg).
 * Words come from content/i18n/<locale>/figures.json (keys use {0}, {1} … for numbers), numbers are
 * re-formatted for the language. Also writes src/i18n/figures-manifest.json (the translated
 * description of each figure), which the middleware uses for alt text.
 * Run after the image generators: `npm run build:figure-translations`. Fails if a string is missing.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { LOCALES, translate, translateSvg } from './lib/figure-text.mjs';

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.svg')) files.push(p);
  }
};
walk('content/lessons');
const lessonFigures = files.sort();
const animations = readdirSync('src/animations')
  .filter((f) => f.endsWith('.svg'))
  .map((f) => join('src/animations', f));

const names = lessonFigures.map((f) => basename(f, '.svg'));
const dup = names.filter((n, i) => names.indexOf(n) !== i);
if (dup.length) throw new Error(`Figure names must be unique across topics: ${dup.join(', ')}`);

const manifest = {};
let failed = false;
for (const loc of LOCALES) {
  const dictFile = `content/i18n/${loc}/figures.json`;
  if (!existsSync(dictFile)) continue;
  const dict = JSON.parse(readFileSync(dictFile, 'utf8'));
  const missing = new Set();
  manifest[loc] = {};
  mkdirSync(`public/figures/${loc}`, { recursive: true });
  mkdirSync(`src/animations/${loc}`, { recursive: true });
  for (const f of lessonFigures) {
    const svg = readFileSync(f, 'utf8');
    const name = basename(f, '.svg');
    writeFileSync(`public/figures/${loc}/${name}.svg`, translateSvg(svg, loc, dict, missing));
    const title = svg.match(/<title>([^<]*)<\/title>/)?.[1];
    if (title) manifest[loc][name] = translate(title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"), loc, dict, missing);
  }
  for (const f of animations) writeFileSync(`src/animations/${loc}/${basename(f)}`, translateSvg(readFileSync(f, 'utf8'), loc, dict, missing));
  console.log(`${loc}: ${lessonFigures.length} figures, ${animations.length} animations${missing.size ? `, ${missing.size} MISSING strings` : ''}`);
  if (missing.size) {
    failed = true;
    for (const m of missing) console.log(`  missing: ${m}`);
  }
}
writeFileSync('src/i18n/figures-manifest.json', JSON.stringify(manifest, null, 1) + '\n');
if (failed) process.exit(1);
