# Stockora Academy

A free, beginner-friendly learning website about stocks, trading and stock markets around the world.
**Education only**: no investment advice, no product recommendations, no affiliate links, no tracking.

Full requirements: [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) · Decisions and open items: [docs/DECISIONS.md](docs/DECISIONS.md)

## What is on the site

| Section | URL | What it is |
|---|---|---|
| Learn | `/learn` | 23 topics (A–W), 196 lessons with sources, callouts, glossary links, mini-quizzes and progress tracking |
| How Stocks Are Made | `/how-stocks-are-made` | A 9-step journey from founding to listing, with a cap table simulator, IPO bookbuilding and a founder game |
| World Markets | `/world` | 20 country pages, a map and sortable comparison tables |
| Trading Times | `/times` | Live open/closed status, a 24-hour timeline and holidays for 16 exchanges (DST-safe, tested) |
| Chart School | `/charts` | Chart-reading lessons, a candlestick encyclopedia, the Chart Lab (hand-built SVG, simulated data) and a chart quiz |
| Quizzes | `/quizzes` | 1,368 questions: topic, country and special quizzes, Mega Quiz, daily quiz, spaced repetition, weak-spot mode, Final Exam and badges |
| Videos | `/videos` | 110 checked YouTube videos with filters; the player loads only after a click |
| Glossary | `/glossary` | 551 terms, linked automatically from lessons |
| Tools | `/tools` | 13 calculators and simulators (profit/loss with an Austrian tax estimate, compound growth, savings plan, leverage, …) |
| History | `/history` | A sourced timeline of market milestones, crashes and rule changes |
| Scam Shield | `/scams` | Red-flag checklist, checks before investing, a spot-the-scam exercise and where to get help in Austria |
| Search | `/search` | Pagefind full-text search plus instant answers: questions like “What is a dividend?” (in any of the five languages) show the glossary definition, with quick links to tools, countries and topics, filters by page type and a `/` shortcut |

The site is also available in German (`/de/`), Spanish (`/es/`), French (`/fr/`) and Italian (`/it/`): the interface,
home page, tools, glossary, Scam Shield and information pages are translated; lessons, quizzes and country pages stay in
English and say so.

Progress, bookmarks, quiz scores and settings stay in the visitor's browser (`localStorage`). There is no account, no
analytics and no cookie.

## Tech stack

- [Astro 7](https://astro.build) (static site) with React islands for the interactive parts
- TypeScript, Tailwind CSS 4, self-hosted Inter font
- [Pagefind](https://pagefind.app) for full-text search (built after `astro build`)
- Vitest for unit tests (calculators, market hours, quiz scoring, charts, URLs, structured data, …)
- Deployed to GitHub Pages by GitHub Actions; any static host works

## Getting started

Requires Node.js 22.12 or newer (24 LTS recommended).

```bash
npm install
npm run dev        # http://localhost:4321 (search is not available in dev)
npm run build      # build the site and the search index into dist/
npm run preview    # serve dist/ (search works here)
npm run verify     # run before every commit (see below)
```

## Checks

| Command | What it checks | When |
|---|---|---|
| `npm run verify` | Content validation, type check, unit tests, build, then `check:dist` | Before every commit; on every pull request and deploy |
| `npm run check:dist` | The built site: title, description, canonical and social tags, one `<h1>` per page, valid structured data, sitemap vs. `noindex`, and every internal link and `#anchor` | Part of `verify` |
| `npm run check:videos` | Every YouTube video still exists, is embeddable, and has the same title and channel. `check:videos:write` also updates `lastChecked` | Weekly in CI, and after editing videos |
| `npm run check:sources` | Every external source link in `content/` and `src/`. Reports **broken** (fix these), **moved** (check the new page still says what we cite) and **unchecked** (sites that block scripts, e.g. sec.gov) links. Add `-- --verbose` for details | Weekly in CI |
| `npm run verify:full` | All of the above | Before a release |

The weekly workflow ([`.github/workflows/link-check.yml`](.github/workflows/link-check.yml)) opens a GitHub issue when a
video or source link breaks. Video and link checks are deliberately not part of the deploy, so an outage at YouTube or
a regulator's website never blocks publishing.

## Editing content (no code needed)

All content lives in [`content/`](content/). Every file is checked against a schema when the site builds
([`src/content.config.ts`](src/content.config.ts)) and by `npm run validate`; a mistake stops the build with a message
saying which file and field is wrong.

| What | Where | Format |
|---|---|---|
| Topics (A–W) | `content/categories.json` | One object per topic: title, summary, levels, learning-path order |
| Lessons | `content/lessons/<A–W>/<slug>.md` | Markdown with front-matter. Copy [`content/lessons/_TEMPLATE.md`](content/lessons/_TEMPLATE.md) |
| Quiz questions | `content/quizzes/<name>.json` | Array of questions. See [`content/quizzes/_EXAMPLE.json`](content/quizzes/_EXAMPLE.json) |
| Countries | `content/countries/<code>.json` | One file per country; market sizes in `content/world/market-size.json` |
| Glossary | `content/glossary.json` | Array of terms |
| Videos | `content/videos.json` | Array of YouTube entries |
| Exchanges, hours, holidays | `content/exchanges.json` | Array of exchanges, each with an `asOf` date and official sources |
| How Stocks Are Made | `content/how-stocks-are-made/steps/`, `…/cases/` | Markdown, one file per step or case study |
| Candlestick patterns | `content/candles.json` | Patterns for the encyclopedia, Chart Lab and chart quiz |
| History timeline | `content/history.json` | Events with `year`, `kind`, `what`, `why`, `lesson`, `links` and `sources`; `planned: true` for announced future changes |
| Scam Shield | `content/scam-shield.json` | Red flags, fictional practice cases, checks, help links and sources |
| Tools | [`src/config/tools.ts`](src/config/tools.ts) | Tool list, groups, related lessons and the sources for any rule a calculator applies |

Rules for content (see the brief, section 17):

- Every factual page needs `sources` and a `lastReviewed` date. Official sources first.
- Never guess numbers, dates, tax rates, trading hours or links. If something cannot be verified, leave it out.
- Time-sensitive data (hours, holidays, taxes, settlement rules) needs an "as of" date and a link to the official page.
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

Chart School images are generated from data: run `npm run build:chart-images` after changing `content/candles.json`
and commit the SVGs.

### Quiz questions

Each question's `id` must start with its category (e.g. `A-…`, `AT-…`). Its `topic` should be the lesson file name
(e.g. `what-is-a-stock`): up to 5 matching questions appear as "Check yourself" under that lesson, and all questions of
a category form the topic quiz. `lessonLink` must point to a real page such as `/learn/foundations/what-is-a-stock`;
`npm run validate` checks this. Avoid options like "all of the above", because answer options are shuffled.

### Videos

Add entries to `content/videos.json` with the 11-character YouTube ID. `lessons` lists the lesson keys
(`<topic-slug>/<lesson-file>`) where the video appears; topic and country pages show all videos of their category.
Prefer uploads from the original channel (exchanges, regulators, central banks, public broadcasters), never re-uploads
or broker channels. Run `npm run check:videos` afterwards.

### UI text and translations

Buttons, menus and labels live in [`src/i18n/en.ts`](src/i18n/en.ts). Each translation has the same keys in
`src/i18n/<locale>.ts` (`de`, `es`, `fr`, `it`); keep `{placeholders}` unchanged. `npm test` fails if a key or
placeholder is missing.

| What | English (original) | Translation |
|---|---|---|
| UI strings | `src/i18n/en.ts` | `src/i18n/<locale>.ts` |
| Topic titles and summaries | `content/categories.json` | `content/i18n/<locale>/categories.json` |
| Glossary | `content/glossary.json` | `content/i18n/<locale>/glossary.json` (keyed by term id: `term`, `definition`, `example`) |
| Scam Shield texts | `content/scam-shield.json` | `content/i18n/<locale>/scam-shield.json` |
| About, Disclaimer, Privacy, Sources, Corrections, Impressum | `content/pages/en/*.md` | `content/pages/<locale>/*.md` |

How it works: pages live under `src/pages/[...locale]/`; English stays at the root, the others get a `/<locale>/`
prefix. `src/middleware.ts` sets the language per page and rewrites internal links so visitors stay in their language.
Lessons, topic pages, country pages, history, videos, the chart lab and most quiz pages are English-only routes
(`src/i18n/routes.ts`): their translated versions show a translated interface with a notice, point their canonical URL
to the English page and are left out of the sitemap. When you change English text, update the translations too, or
the translated page keeps the old wording; `npm run validate` shows how many topics and glossary terms each language covers and rejects unknown ids.

To add a language: add it to `LOCALES` in `src/i18n/locales.ts`, create the files above, and register the dictionary
in `src/i18n/dictionaries.ts`. A Russian dictionary, topic texts, Scam Shield texts and information pages exist but are
not registered, because the Russian glossary has not been translated yet.

## Project structure

```
content/            all site content (see above)
docs/               brief and decisions log
public/             static files (favicon, logo, social preview image)
scripts/            content validation, built-site check, video and source link checkers, image generators
src/
  components/       Astro and React components (quiz, tools, chartlab, times, world, …)
  config/           navigation, brand, tool registry
  i18n/             UI strings (one dictionary per language) and language routing
  layouts/          page layouts (meta tags, structured data)
  lib/              pure, tested logic (calculators, market hours, quiz engine, charts, SEO, URLs)
  pages/            one file per route
  styles/           global CSS and colour tokens
tests/              Vitest unit tests
```

## Deployment

### GitHub Pages (set up)

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): validate, type-check,
   test, build, check the built site, deploy.
4. Set `reportConfig.githubRepo` in [`src/config/site.ts`](src/config/site.ts) (e.g. `"owner/stockora-academy"`) so
   "Report a mistake" opens a pre-filled GitHub issue.

The workflow sets the site URL and base path automatically, so the site works both at
`https://<user>.github.io/<repo>/` and on a custom domain (Settings → Pages → Custom domain). Canonical links, the
sitemap, `robots.txt` and structured data all follow it.

### Other static hosts (Netlify, Vercel, Cloudflare Pages, …)

Build command `npm run build`, output directory `dist`, Node 22.12+. Set the environment variable `SITE_URL` to the
public address (e.g. `https://stockora.example`) so canonical links and the sitemap are correct; leave `BASE_PATH`
unset when the site is served from the domain root.

### Before going public

See "Open items" in [docs/DECISIONS.md](docs/DECISIONS.md). In short: check the name, domain and trademarks. If you move
to another host, rewrite the Privacy Policy's hosting section (in every language) for that host.

## Social preview image

`public/og-default.png` (1200×630) is shown when a page is shared. It is rendered from HTML by a headless Chromium
browser; regenerate it after changing the name, tagline or colours:

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run build:og-image
```

## Privacy

No analytics, no cookies, no third-party requests on page load; fonts are self-hosted. YouTube videos load (from
youtube-nocookie.com) only after a click. Settings and progress are stored only in the visitor's browser
(`localStorage`, keys prefixed `stockora-`). See `src/pages/privacy.astro`.

## Credits

Map shapes: [Natural Earth](https://www.naturalearthdata.com/) (public domain) via `world-atlas`. Font: Inter (SIL Open
Font License). All charts, diagrams and chart data are original or simulated.
