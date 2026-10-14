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

## Phase 5 (2026-10-11): "How Stocks Are Made"

| Topic | Decision |
|---|---|
| Page structure | One scroll-through page (`/how-stocks-are-made`) that acts as a hub. It holds 9 short steps (what happens, who is involved, an example with numbers, Austria/US notes), each linking to the full lessons in the Learn section rather than repeating them |
| Content location | Steps in `content/how-stocks-are-made/steps/*.md` and case studies in `.../cases/*.md`, as content collections (`journeySteps`, `caseStudies`) with sources and `lastReviewed` |
| Case studies | VOC 1602 (Euronext), Facebook/Nasdaq 2012 (SEC release 2013-95), Saudi Aramco 2019 (Aramco's pricing announcement), BAWAG 2017 as the Austrian IPO (Wiener Börse + BAWAG ad-hoc release), Stable Road/Momentus as the SPAC example (SEC release 2021-124). Only facts stated in those documents are used; e.g. no "largest IPO ever" claim for Aramco and no claim that its greenshoe was exercised |
| Simulators | Cap table/dilution, IPO bookbuilding and "Build your own company" are React islands built on pure, unit-tested libraries (`captable.ts`, `bookbuilding.ts`, `founder-game.ts`). The order book and all game numbers are invented and labelled as such |
| Charts | Hand-built HTML/SVG (no chart library). The categorical palette is validated for light (#ffffff) and dark (#13233a) surfaces. Every chart has a table or list view, a legend and direct labels; colours follow the holder, not its rank |
| Mini-quizzes | Each step shows up to 3 questions drawn in turn from its linked lessons' quizzes (`QuizSection lessonLinks`) |
| Special quiz | `content/quizzes/HSM-how-stocks-are-made.json` (25 questions, category "HSM"), including the new **order-the-steps** question type |
| Order questions | Reordered with up/down buttons (keyboard and screen-reader friendly, no drag and drop); they never start in the solved order |
| Founder badge | Finishing the game stores `stockora-founder-game` in localStorage for the "Founder" badge (Phase 9) |
| Glossary | Each Markdown entry links the first mention of a term, so a small script on the journey page keeps only the first link per term on the whole page. "Offer price" got its own entry; it had been linked to Ask price |

## Phase 6 (2026-10-11): Trading Times tool

| Topic | Decision |
|---|---|
| Time zones | Browser `Intl` time-zone database only (no Luxon): `src/lib/market-hours.ts` converts local exchange times with computed offsets, so DST switch dates are never hard-coded. Skipped wall-clock times resolve to the moment after the jump, repeated ones to the first occurrence |
| Coverage | 16 exchanges: Vienna, Xetra, SIX, LSE, Euronext Paris, NYSE, TSX, B3, Tokyo, Shanghai/Shenzhen, Hong Kong, Korea, Singapore, NSE India, ASX, TASE. JSE, Saudi Exchange and Borsa Istanbul are listed as "coming later" because their official hours pages could not be read reliably |
| Data | `content/exchanges.json`: local sessions (with auctions, lunch breaks, pre/after-hours), optional per-weekday sessions (TASE Fridays), trading days, holidays with early closes / late opens / half days, the years covered, sources and an "as of" date. Validated by the schema and by `validate-content.js` (order of sessions, holidays on trading days, stale-data warning) |
| Holidays | Only years with an official list are included (2026 and, where published, 2027). Where a year is missing (e.g. Euronext 2027) or no official list could be retrieved (KRX, SGX), the tool shows a visible warning instead of guessing |
| Source choices | Hong Kong holidays from GovHK (HKEX trades on weekdays except public holidays); LSE holidays before September 2026 from GOV.UK; China from the Shenzhen exchange's 2026 schedule; US extended hours shown as NYSE Arca's sessions, labelled as venue-specific |
| Time-limited hours | B3 publishes hours tied to US daylight saving time, so its sessions carry `sessionsValidUntil` (31 Oct 2026); after that date the tool says "hours not confirmed" |
| Half days without times | Euronext and TASE half days whose exact hours are not published here are flagged as such; the normal day is shown with a warning |
| UI | One React island with live status (15 s refresh), 24-hour timeline in the viewer's zone (Europe–US overlap band, now line, table view), "When can I trade?", converters, holiday lists and a computed DST explainer. Viewer zone defaults to Europe/Vienna and is remembered in `stockora-times-zone`. The home page widget now shows live status for five exchanges |
| Tests | 28 tests for DST transitions (Europe, US, Australia, zones without DST), the Vienna–New York gap, weekends, holidays, lunch breaks, early closes, late opens, per-weekday sessions, missing holiday data and the timeline |
| Category E correction check | The HKEX "Extended Morning Session" (12:00–13:00) applies only to special securities per HKEX's 2011 notice; for shares it remains a lunch break, so the Category E lesson stays correct |

## Phase 7a/7b (2026-10-11): Chart School and Chart Lab

| Topic | Decision |
|---|---|
| Order | Category J (Chart School) first, because the brief asks to show the Chart Lab before continuing; categories I and K–W follow after review |
| Lessons | 10 lessons under /learn/technical-analysis; /charts is the hub, /charts/candles the encyclopedia, /charts/lab the lab, /charts/quiz the chart reading quiz |
| Sources | Indicator definitions from CME Group's education course (an exchange) and John Bollinger's own site; evidence from Park & Irwin (2007), Lo, Mamaysky & Wang (2000), Marshall (2005) and the Nobel committee's 2013 summary; pattern rules and test statistics from Thomas Bulkowski (shown as "direction only, not profit"); TradingView facts only from its own help pages |
| Homma | Presented as commonly linked to candlesticks with uncertain history; only the Dojima Rice Exchange (JPX) and Nison's 1991 book are stated as facts |
| Single source of drawings | content/candles.json holds OHLC data for 24 patterns; the encyclopedia, the lessons (via scripts/build-chart-images.mjs) and the lab all draw from it |
| Simulated data only | No real price data anywhere. src/lib/chart/core.ts simulates 1-minute data for 7 scenarios (seeded, deterministic) and aggregates to 5m–1W without crossing sessions |
| Chart Lab | Hand-built SVG (no chart library, no third-party scripts, no TradingView widgets): candles/bars/line/Heikin Ashi, log scale, volume, SMA/EMA/Bollinger/VWAP, RSI and MACD panes, trendline/horizontal line/zone/Fibonacci/measure tools, crosshair with OHLC readout, replay, "next candle" game, click-to-explain, interface tour and a "read this chart" walkthrough following the lesson 9 checklist |
| Chart quiz | Generated per round from a seed: candle names, trend, RSI, timeframe and two click-on-the-chart questions (support zone, highest close); scores in stockora-quiz-scores ("chart-quiz") |
| Base path | New rehype plugin prefixes internal Markdown links (e.g. /charts/lab) with the deploy base path |

## Phase 7c (2026-10-11 to 2026-10-14): Categories I and K–W

| Topic | Decision |
|---|---|
| Scope | 14 categories, one commit each (I, K, L, M, N, O, P, Q, R, S, T, U, V, W); 114 new lessons |
| Totals after Phase 7 | 196 lessons; glossary 551 terms; quiz 1,060 questions (every category ≥ 25; beginner 40%, intermediate 44%, advanced 15%); 89 videos |
| Running example | Fictional "Alpenrad AG" for company figures (I, V, W); no real company is used as a worked example |
| Long-run data | Damodaran's 1928–2025 US returns (NYU Stern, updated January 2026), own calculations; always labelled as US dollar data, before costs and taxes |
| Austrian law | Read from RIS or JUSLINE in the current version (AktG, ÜbG, ImmoInvFG, BörseG 2018, WAG 2018, MedienG); RIS document numbers cited where JUSLINE lacks a law |
| Taxes (Q) | Every lesson carries a VERIFY banner; BMF pages are the primary source; no rate is stated without a BMF or law citation |
| Scams (T) | FMA warning pages and Investor.gov only; specific warned firms are never named in lessons |
| Category S | Overview only; country detail is deferred to the Phase 8 country pages; exchanges limited to the 16 in content/exchanges.json |
| Site tool links | Lessons link only to live pages (/glossary, /times, /charts, /search, /sources, /corrections); /scams, /world, /quizzes, /videos and /tools are still "coming soon" (one existing link to /scams in Category J will work once Scam Shield ships) |
| Videos | Official or educational channels (Khan Academy, regulators, central banks, universities, major newsrooms); every ID checked with YouTube oEmbed; channels selling courses, signals or broker referrals excluded |
| Validator | scripts/validate-content.js now parses front matter with the `yaml` package (new devDependency) and rejects invalid YAML and non-string tags |
| Glossary linking | Generic words avoided as aliases (e.g. "own shares" renamed to "Treasury shares", "ETC" and "BIS" not used as aliases because they match ordinary text); each category checked for false links after build |
| Blocked sources | FRED blocked (NY Fed, Cleveland Fed used instead); some sec.gov PDFs read via web.archive.org copies; EUR-Lex unreachable at times (Austrian implementing law cited instead, e.g. § 49 WAG 2018 for MiFID II marketing rules) |

## Open items
- Review the draft Privacy Policy (hosting section) before going public.
- Owner to check domains, handles and trademarks (brief §0.1).
- Owner to fill in real Impressum details.
- Set `reportConfig.githubRepo` once the GitHub repository exists.
- Trading Times: add 2027 holidays for Euronext, TSX, B3, NSE and China when published; re-check B3 hours after US DST ends; find official KRX and SGX holiday lists; verify JSE, Saudi Exchange and Borsa Istanbul hours.
