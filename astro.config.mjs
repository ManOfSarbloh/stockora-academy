// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkCallouts } from './src/lib/markdown/callouts.ts';
import { remarkAnimations } from './src/lib/markdown/animations.ts';
import { rehypeGlossaryLinks } from './src/lib/markdown/glossary-links.ts';
import { rehypeBaseLinks } from './src/lib/markdown/base-links.ts';
import { isEnglishOnly, localeFromPath, stripLocale } from './src/i18n/routes.ts';
import { translatedRoutes } from './src/i18n/translated-routes.ts';

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/.
// The deploy workflow sets SITE_URL and BASE_PATH; locally both fall back to the root.
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

// Pages marked noindex (BaseLayout `noindex` prop) are personal or utility pages: keep them out of the sitemap too,
// in every language. Translated copies of English-only pages (lessons, …) point their canonical link to the
// English page, so only the English page is listed.
const NOINDEX = ['/brand/', '/impressum/', '/me/', '/quizzes/certificate/', '/quizzes/play/'];
const basePrefix = base.replace(/\/$/, '');
/** @param {string} page */
function inSitemap(page) {
  const path = new URL(page).pathname.slice(basePrefix.length) || '/';
  const route = stripLocale(path);
  if (NOINDEX.includes(route)) return false;
  return localeFromPath(path) === 'en' || !isEnglishOnly(route) || translated.has(path);
}
// Translated lessons (and topic pages whose lessons are all translated) are listed in every language they exist in.
const translated = translatedRoutes();

// Glossary terms are read once at startup for auto-linking (restart `npm run dev` after editing the glossary).
const glossaryTerms = JSON.parse(readFileSync('./content/glossary.json', 'utf8'));
// For translated lessons: each language's term ("Aktie"), with the English term and aliases as alternatives,
// all pointing to the translated definition.
/** @type {Record<string, {id: string, term: string, definition: string, aliases: string[]}[]>} */
const glossaryByLocale = {};
for (const loc of ['de', 'es', 'fr', 'it']) {
  const file = `./content/i18n/${loc}/glossary.json`;
  if (!existsSync(file)) continue;
  const tr = JSON.parse(readFileSync(file, 'utf8'));
  // "Geldkurs (Geld)", "Diversifikation / Streuung": the part before the brackets and each " / " variant are
  // the term; a bracketed part only counts when it is an abbreviation ("KESt") or a capitalised phrase
  // ("Margin Call"), not a qualifier that is an everyday word ("Geld", "Japan", "strukturiertes Produkt").
  const split = (/** @type {any} */ g) => {
    const x = tr[g.id];
    const m = x?.term.match(/^(.*?)\s+\(([^)]+)\)\s*$/);
    const main = (m ? m[1] : x?.term ?? '').split(/\s+\/\s+/);
    const extra = m ? m[2].split(/\s*[,/]\s*/).filter((/** @type {string} */ p) => (p.match(/[A-ZÄÖÜ]/g) ?? []).length >= 2 || /^[A-ZÄÖÜ]\S*[\s-]\S/.test(p)) : [];
    return { main, extra };
  };
  const owner = new Map();
  for (const g of glossaryTerms) for (const p of [...split(g).main, g.term, ...(g.aliases ?? [])]) if (!owner.has(p.toLowerCase())) owner.set(p.toLowerCase(), g.id);
  glossaryByLocale[loc] = glossaryTerms.map((/** @type {any} */ g) => {
    const x = tr[g.id];
    if (!x) return g;
    const { main, extra } = split(g);
    const own = extra.filter((/** @type {string} */ p) => (owner.get(p.toLowerCase()) ?? g.id) === g.id);
    return { id: g.id, term: main[0], definition: x.definition, aliases: [...main.slice(1), ...own, g.term, ...(g.aliases ?? [])].filter((a) => a && a.length > 1) };
  });
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Keep HTML whitespace rules (Astro 7 defaults to JSX rules, which drop
  // spaces between inline elements: risky for text-heavy lesson pages).
  compressHTML: true,
  markdown: {
    // The unified pipeline (remark/rehype) is used for our two small content plugins.
    processor: unified({
      remarkPlugins: [remarkAnimations, remarkCallouts],
      rehypePlugins: [[rehypeGlossaryLinks, { terms: glossaryTerms, termsByLocale: glossaryByLocale, base }], [rehypeBaseLinks, { base }]],
    }),
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), sitemap({ filter: inSitemap })],
  vite: {
    plugins: [tailwindcss()],
  },
});
