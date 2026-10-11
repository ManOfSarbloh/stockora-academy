// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/.
// The deploy workflow sets SITE_URL and BASE_PATH; locally both fall back to the root.
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Keep HTML whitespace rules (Astro 7 defaults to JSX rules, which drop
  // spaces between inline elements: risky for text-heavy lesson pages).
  compressHTML: true,
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
