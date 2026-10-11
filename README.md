# Stockora Academy

A free, beginner-friendly learning website about stocks, trading and stock markets around the world.
**Education only**: no investment advice, no product recommendations, no affiliate links, no tracking.

Full requirements: [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) · Decisions: [docs/DECISIONS.md](docs/DECISIONS.md)

## Tech stack

- [Astro 7](https://astro.build) (static site) with React islands for interactive parts
- TypeScript, Tailwind CSS 4
- [Pagefind](https://pagefind.app) for full-text search (built after `astro build`)
- Vitest for unit tests
- Deployed to GitHub Pages by GitHub Actions

## Getting started

Requires Node.js 22.12 or newer (24 LTS recommended).

```bash
npm install
npm run dev        # http://localhost:4321 (search is not available in dev)
npm run build      # build the site and the search index into dist/
npm run preview    # serve dist/ (search works here)
npm run verify     # validate content, type-check, run tests and build: run before every commit
```

## Editing content (no code needed)

All content lives in [`content/`](content/). Every file is checked against a schema when the site builds
([`src/content.config.ts`](src/content.config.ts)); a mistake stops the build with a message saying which file and field is wrong.

| What | Where | Format |
|---|---|---|
| Topics (A–W) | `content/categories.json` | One object per topic: title, summary, levels, learning-path order |
| Lessons | `content/lessons/<A–W>/<slug>.md` | Markdown with front-matter. Copy [`content/lessons/_TEMPLATE.md`](content/lessons/_TEMPLATE.md) |
| Quiz questions | `content/quizzes/<name>.json` | Array of questions. See [`content/quizzes/_EXAMPLE.json`](content/quizzes/_EXAMPLE.json) |
| Countries | `content/countries/<code>.json` | One file per country |
| Glossary | `content/glossary.json` | Array of terms |
| Videos | `content/videos.json` | Array of YouTube entries |
| Exchanges, hours, holidays | `content/exchanges.json` | Array of exchanges |

Rules for content (see the brief, section 17):

- Every factual page needs `sources` and a `lastReviewed` date. Official sources first.
- Never guess numbers, dates, tax rates, trading hours or links. If something cannot be verified, leave it out.
- Write in your own words, in simple English. Define every term on first use.
- Files whose name starts with `_` are ignored (use them for templates and notes).
- Run `npm run validate` to see content counts and cross-file errors (duplicate IDs, broken references).

### Writing lessons

Callout boxes use GitHub-style alert syntax. Available kinds: `EXAMPLE`, `TAKEAWAYS`, `MISTAKE`, `WARNING`,
`AUSTRIA`, `VERIFY`, `NOTE`, `TIP`. An optional title can follow the marker.

```markdown
> [!MISTAKE] "A €5 share is cheaper than a €500 share"
> The price of one share tells you almost nothing on its own...
```

Glossary terms (and their `aliases`) are linked automatically on their first mention in each lesson, with a
hover/tap definition. Restart `npm run dev` after editing `content/glossary.json`.

Lesson URLs are `/learn/<topic-slug>/<file-name>/`, e.g. `content/lessons/A/what-is-a-stock.md` becomes
`/learn/foundations/what-is-a-stock/`. Set `draft: true` to hide a lesson from the published site (drafts still show in `npm run dev`).

UI text (buttons, menus, labels) lives in [`src/i18n/en.ts`](src/i18n/en.ts). A German dictionary can be added later with the same keys.

## Project structure

```
content/            all site content (see above)
docs/               brief and decisions log
public/             static files (favicon, robots.txt)
scripts/            content validation (later: link and video checkers)
src/
  components/       Astro components (header, footer, cards, callouts)
  config/           navigation, planned sections, brand settings
  i18n/             UI strings
  layouts/          page layouts
  lib/              pure, tested logic (URLs, storage, later calculators and market hours)
  pages/            one file per route
  styles/           global CSS and colour tokens
tests/              Vitest unit tests
```

## Deployment (GitHub Pages)

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which validates, tests, builds and deploys.

The workflow sets the site URL and base path automatically, so the site works both at
`https://<user>.github.io/<repo>/` and on a custom domain.

## Privacy

No analytics, no cookies, fonts are self-hosted. Settings and progress are stored only in the visitor's browser
(`localStorage`, keys prefixed `stockora-`). See `src/pages/privacy.astro`.
