# Stockora Academy: Decisions Log

Full requirements: [PROJECT_BRIEF.md](PROJECT_BRIEF.md).

## Phase 1 (2026-10-11)

| Topic | Decision |
|---|---|
| Stack | Astro + React islands + TypeScript + Tailwind CSS |
| Charts | TradingView Lightweight Charts (Apache-2.0, attribution required); D3 for diagrams |
| Time zones | luxon, default zone Europe/Vienna |
| Search | Pagefind (full-text), Fuse.js (glossary / instant filters) |
| Tests | Vitest (logic), Playwright + axe (smoke / accessibility) |
| Colours | Deep navy + teal: primary `#0F2A44`, accent `#0E9F9A`, bg `#F7FAFC`, text `#1A2433`, dark bg `#0B1622` |
| Hosting | GitHub Pages via GitHub Actions |
| Logo | **B · Path** (chosen 2026-10-11): geometric "S" as one road ending in a teal dot. Files: `public/brand/`, `public/favicon.svg`; component `src/components/LogoMark.astro` |
| Extra step | Phase 3b: Category A built end-to-end as a vertical slice before writing B–W at scale |

## Phase 2 (2026-10-11)

| Topic | Decision |
|---|---|
| Versions | Astro 7.3, React 19.3, Tailwind 4.3, TypeScript 6 (TS 7 not yet supported by `@astrojs/check`), Node 24 LTS |
| Accessible teal | Brand teal `#0E9F9A` is only 3.1:1 on the light background, so it is used for decoration only. Links/buttons use `#0A7672` (5.5:1). Dark mode uses `#2CC4BE` |
| Fonts | Inter, self-hosted via `@fontsource-variable/inter` (no Google Fonts requests) |
| Whitespace | `compressHTML: true` (Astro 7 default `'jsx'` drops spaces between inline elements) |
| Topic URLs | `/learn/<slug>/` (e.g. `/learn/market-structure/`) rather than `/learn/D/`; quiz `lessonLink`s will use slugs |
| Category count | The brief says "22 categories" but lists A–W = 23. All 23 are included |

## Phase 3 (2026-10-11)

| Topic | Decision |
|---|---|
| Markdown processor | `unified` (remark/rehype) instead of Astro 7's new default Sätteri: its plugin API is very new; unified is officially supported and well understood |
| Callouts | GitHub-style alerts (`> [!EXAMPLE]`): plain Markdown, readable on GitHub too, no MDX needed |
| Glossary links | Build-time rehype plugin, first mention per page, definition stored on the link for the tooltip (no extra request) |
| Progress & bookmarks | `localStorage` keys `stockora-progress` (versioned) and `stockora-bookmarks`; pure functions in `src/lib/progress.ts` are unit-tested |
| "My learning" page | `/me/`: overall progress, bookmarks, progress by topic, reset button |
| Report a mistake | Prefilled GitHub issue once `reportConfig.githubRepo` is set (src/config/site.ts); until then links to Corrections |

## Phase 3b (2026-10-11): Category A vertical slice

| Topic | Decision |
|---|---|
| Category A scope | 10 lessons covering every Foundations topic in the brief; all facts checked against official sources (SEC/Investor.gov, FINRA, ESMA, OeKB, Austrian USP and RIS, FMA, Wiener Börse, Deutsche Börse, Banca d'Italia) |
| Diagrams | Original SVGs stored next to the lesson and referenced with relative Markdown image paths; own white background so they work in dark mode |
| Video embeds | No YouTube thumbnail before the click (a thumbnail would already contact Google); styled placeholder with title, then `youtube-nocookie.com` |
| Video choice | Only uploads from the original channel (Khan Academy, TED-Ed), never re-uploads; `whyGood` texts only claim what title and channel show |
| `check-videos.js` | Runs in CI before the build (oEmbed: exists, title ≥60% word match, same channel) |
| Practice quiz | React island, `client:only`; practice mode with instant feedback, results, retry wrong answers. Supports multiple choice, multiple select, true/false and number (accepts "2.5" and "2,5"). Match/order types and exam/weak-spot modes come in Phase 9 |
| Quiz placement | Full topic quiz on each topic page (`#quiz`); up to 5 "Check yourself" questions per lesson (question `topic` = lesson file name) |
| Quiz scores | `localStorage` key `stockora-quiz-scores` (best and last per quiz) |
| Validator | Now also checks that every quiz `lessonLink` and video `lessons` key points to a real page |

## Phase 4 (2026-10-11): Categories B–H

| Topic | Decision |
|---|---|
| Scope | Categories B–H written at Category A depth, one commit per category: 62 more lessons (72 in total), quiz questions for every category (366 in total, 39/41/20 difficulty mix), 238 glossary terms, 25 videos |
| Source rule | A claim stays only if an opened official page or legal text supports it; search-engine summaries are never used as sources. Claims that could not be confirmed were softened or removed |
| PDFs | Official PDFs are downloaded with curl into the scratchpad and read as text, never opened in the browser pane. Scanned (image-only) PDFs are not cited |
| Austrian tax content | Category H explains fund taxation (§ 186 InvFG, § 27a and § 95 EStG) with a VERIFY banner and pointers to Category Q; no tax advice |
| No product picks | ETF lessons compare criteria only (index, costs, tracking difference, structure, domicile, tax reporting, trading). Indexes are named as examples; funds, providers and brokers never are |
| Video vetting | Descriptions are checked for broker referrals, courses or signals. Non-financial sponsors are acceptable. A news segment featuring an issuer's CEO was rejected as promotional |
| Glossary aliases | Everyday words are left out as aliases, and so are words that collide with other terms ("acquisition cost" got its own entry so it does not link to Takeover) |

## Open items
- Review the draft Privacy Policy (hosting section) before going public.
- Owner to check domains, handles and trademarks (brief §0.1).
- Owner to fill in real Impressum details.
- Set `reportConfig.githubRepo` once the GitHub repository exists.
