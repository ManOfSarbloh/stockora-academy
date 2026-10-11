// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkCallouts } from './src/lib/markdown/callouts.ts';
import { rehypeGlossaryLinks } from './src/lib/markdown/glossary-links.ts';

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/.
// The deploy workflow sets SITE_URL and BASE_PATH; locally both fall back to the root.
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

// Glossary terms are read once at startup for auto-linking (restart `npm run dev` after editing the glossary).
const glossaryTerms = JSON.parse(readFileSync('./content/glossary.json', 'utf8'));

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
      remarkPlugins: [remarkCallouts],
      rehypePlugins: [[rehypeGlossaryLinks, { terms: glossaryTerms, base }]],
    }),
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
