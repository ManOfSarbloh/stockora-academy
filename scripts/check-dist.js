#!/usr/bin/env node
/**
 * Checks the built site in dist/ (run after `astro build`; part of `npm run verify`):
 *   - every page has a title, description, canonical link, social image and exactly one <h1>
 *   - structured data (JSON-LD) parses
 *   - noindex pages are not in the sitemap, and every other page is
 *   - every internal link and #anchor points to something that exists
 * Exits with code 1 and a list of problems if anything is wrong.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const problems = [];
const problem = (page, msg) => problems.push(`${page}: ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

const files = walk(DIST);
/** "/learn/x/" style route for a dist file (without the base path). */
const routeOf = (file) => '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
const pages = new Map(); // route -> { ids, html }
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  pages.set(routeOf(f), { html, ids, file: f });
}

// ---- Sitemap -------------------------------------------------------------------------------
const sitemapRoutes = new Set();
for (const name of readdirSync(DIST).filter((n) => /^sitemap-\d+\.xml$/.test(n))) {
  for (const m of readFileSync(join(DIST, name), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(m[1]).pathname;
    sitemapRoutes.add('/' + path.slice(base.length));
  }
}

// ---- Per page ------------------------------------------------------------------------------
const linkRe = /\s(?:href|src)="([^"]+)"/g;
let linksChecked = 0;
for (const [route, { html }] of pages) {
  if (route === '/404.html') continue;
  const noindex = /<meta name="robots" content="noindex"/.test(html);
  const isRedirect = /<meta http-equiv="refresh"/.test(html);
  if (isRedirect) continue;

  if (!/<title>[^<]+<\/title>/.test(html)) problem(route, 'missing <title>');
  if (!/<meta name="description" content="[^"]+"/.test(html)) problem(route, 'missing meta description');
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) problem(route, 'missing canonical link');
  if (!/<meta property="og:image" content="[^"]+"/.test(html)) problem(route, 'missing og:image');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  // Client-only pages (e.g. the quiz player) render their <h1> in the browser.
  if (h1s !== 1 && !(h1s === 0 && noindex)) problem(route, `${h1s} <h1> elements (expected 1)`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      problem(route, 'JSON-LD does not parse');
    }
  }

  if (noindex && sitemapRoutes.has(route)) problem(route, 'noindex page is listed in the sitemap');
  if (!noindex && !sitemapRoutes.has(route)) problem(route, 'missing from the sitemap');

  // Internal links and anchors.
  for (const m of html.matchAll(linkRe)) {
    const raw = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(raw)) continue;
    if (raw.includes('{')) continue; // templates such as the search action
    linksChecked++;
    let [pathPart, hash] = raw.split('#');
    pathPart = pathPart.split('?')[0];
    let target;
    if (pathPart === '') target = route;
    else if (pathPart.startsWith(base)) target = '/' + pathPart.slice(base.length);
    else if (pathPart.startsWith('/')) {
      problem(route, `link outside the base path: ${raw}`);
      continue;
    } else continue; // relative links are not used by the site

    const decoded = decodeURIComponent(target);
    if (/\.[a-z0-9]+$/i.test(decoded) && !decoded.endsWith('.html')) {
      if (!existsSync(join(DIST, decoded))) problem(route, `broken link: ${raw}`);
      continue;
    }
    const key = decoded.endsWith('/') ? decoded : `${decoded}/`;
    const page = pages.get(key) ?? pages.get(decoded);
    if (!page) {
      problem(route, `broken link: ${raw}`);
      continue;
    }
    if (hash && !page.ids.has(decodeURIComponent(hash))) problem(route, `missing anchor: ${raw}`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s) in dist/:\n  ${problems.slice(0, 200).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ dist/: ${pages.size} pages, ${sitemapRoutes.size} in the sitemap, ${linksChecked} internal links checked.`);
