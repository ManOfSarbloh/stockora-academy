#!/usr/bin/env node
/**
 * Checks the built site in dist/ (run after `astro build`; part of `npm run verify`):
 *   - every page has a title, description, canonical link, social image and exactly one <h1>
 *   - structured data (JSON-LD) parses
 *   - a page is in the sitemap exactly when it is indexable and its canonical link points to itself
 *   - every internal link, #anchor and hreflang alternate points to something that exists
 *   - links on a translated page (/de/, /fr/, …) stay in that language, except the language switcher
 * Exits with code 1 and a list of problems if anything is wrong.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const LOCALE_CODES = ['de', 'es', 'fr', 'it', 'ru'];
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

  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const selfCanonical = canonical && '/' + new URL(canonical).pathname.slice(base.length) === route;
  const shouldList = !noindex && selfCanonical;
  if (!shouldList && sitemapRoutes.has(route)) problem(route, noindex ? 'noindex page is listed in the sitemap' : 'page with a canonical elsewhere is listed in the sitemap');
  if (shouldList && !sitemapRoutes.has(route)) problem(route, 'missing from the sitemap');
  if (canonical && !selfCanonical) {
    const target = '/' + new URL(canonical).pathname.slice(base.length);
    if (!pages.has(target)) problem(route, `canonical points to a missing page: ${canonical}`);
  }
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) {
    const target = '/' + new URL(m[2]).pathname.slice(base.length);
    if (!pages.has(target)) problem(route, `hreflang ${m[1]} points to a missing page: ${m[2]}`);
  }

  // Translated pages keep visitors in their language.
  const lang = route.split('/')[1];
  if (LOCALE_CODES.includes(lang)) {
    for (const tag of html.match(/<a\b[^>]*>/g) || []) {
      if (/\shreflang=/.test(tag)) continue;
      const href = (tag.match(/\shref="([^"]+)"/) || [])[1];
      if (!href || !href.startsWith(base)) continue;
      const rest = href.slice(base.length).split(/[?#]/)[0];
      if (/\.[a-z0-9]+$/i.test(rest)) continue; // files
      if (!rest.startsWith(`${lang}/`) && rest !== lang) problem(route, `link leaves the language: ${href}`);
    }
  }

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
