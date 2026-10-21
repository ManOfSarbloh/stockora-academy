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

## Phase 8 (2026-10-16): World Markets

| Topic | Decision |
|---|---|
| Scope | The brief's first 20 countries (owner's choice): AT, DE, CH, GB, US, FR, NL, IT, ES, SE, PL, JP, CN, HK, IN, KR, TW, SG, AU, CA. One JSON file per country in content/countries, validated by a strict Zod schema; each page has a quiz of 10–14 questions (category = country code, lessonLink /world/<code>) |
| Pages | /world (hub with map and country cards by region), /world/<code> (country template following brief §6.1), /world/compare (compare-two picker plus sortable, region-filterable tables: overview, trading hours, taxes, market rules) |
| Map | Natural Earth 110m boundaries from world-atlas (ISC licence) projected at build time with d3-geo into a static SVG; no map library ships to the browser. Hong Kong and Singapore are missing from the 110m file and are drawn as markers |
| Market size | World Bank WDI (data from the World Federation of Exchanges) in content/world/market-size.json, as of 2026-10-08. Values older than 2022 are hidden ("No comparable recent figure"), which affects FR, NL, IT and SE (Euronext/Nasdaq group exchanges) and TW (not in WDI) |
| Classification | FTSE Russell only (country classification paper v3.5, October 2026, Appendix 3). MSCI's classification table could not be read as text, so the compare page links to MSCI instead of quoting it |
| Hours | Taken from content/exchanges.json where the exchange exists there; Amsterdam (Euronext) and Warsaw (GPW) session times are not stated because the official documents could not be opened; the pages link to the exchanges instead |
| Taxes | Every country has a VERIFY banner, an as-of date and official sources (tax authority, ministry or exchange guide). Withholding rates are stated only where an official page gives them (e.g. Korea: procedure only, no rate). The "For an Austrian investor" note always refers back to Category Q's 15% credit rule |
| Recent changes captured | Korea: transaction tax restored to the 2023 level from January 2026 (KOSPI 0.05% + 0.15% rural tax), deposit cover KRW 100m since 1 Sep 2025, short selling resumed 31 Mar 2025. Singapore: board lots of 10 or 1 share for stocks above S$10/S$100 from 5 Oct 2026. India: Income-tax Act 2025 in force from 1 Apr 2026. Canada and US on T+1 since May 2024; EU, UK and Switzerland move to T+1 on 11 Oct 2027 |
| Not stated | Japan deposit protection (no official English page found); Taiwan deposit insurance (CDIC site unreachable); Hong Kong board lot sizes per stock |
| Companies | "Famous companies" lists are neutral name lists of large listed firms, never recommendations, and show no figures |
| Preview | `astro preview` in Astro 7 daemonises itself, so the preview_start launcher hangs; run it via Bash in the background and open http://localhost:4321 instead |

## Phase 9 (2026-10-16): Quiz hub

| Topic | Decision |
|---|---|
| One player | src/components/quiz/QuizRunner.tsx runs every quiz on the site (lesson, topic, country, journey and hub quizzes). Practice mode: check, explanation, hint (removes one wrong option, gives the answer count, or links to the lesson). Exam mode: no feedback until the end, free navigation, question palette, optional timer, auto-finish when time runs out, leave-page warning |
| New question type | "Match the pairs" (select per row; right-hand list shuffled and never pre-solved). The two existing match questions now show; the validator checks pairs |
| Pages | /quizzes (hub), /quizzes/play?kind=… (category, country, special, mega, exam, daily, weak, review, custom), /quizzes/certificate (printable, print CSS hides site chrome), /quizzes/flashcards (glossary and key facts, "Again" cards return three cards later), /quizzes/world-game (matching plus map clicks) |
| Question bank delivery | /quizzes/questions.json built at build time (about 1.1 MB, about 240 KB gzipped) and fetched only by the player and flashcards; sources stay in the content files, only the first source travels for the "Source" link |
| Spreading | Mega Quiz, daily quiz and Final Exam draw round-robin across groups; all country quizzes count as one group so 20 countries do not crowd out topics |
| Final Exam | 100 questions (88 spread evenly over the 22 topics, the rest from everything), 100 minutes, pass mark 80%. Certificate shows best score and first pass date, clearly "for fun and self-assessment, not an official qualification"; the name is stored only locally |
| Daily quiz | Same five questions for everyone on a calendar day (seeded by the date), beginner and intermediate only, five different groups; streak breaks after a missed day |
| Spaced repetition | Leitner boxes 1–5 per question (intervals 0, 1, 3, 7, 14, 30 days); wrong answers return to box 1, due the same day. Weak-spot mode uses categories with at least 3 answers, weakest three first. Category is read from the question id prefix, which the validator now enforces |
| Special quizzes | Built from existing verified content: glossary quiz generated from definitions (terms whose definition contains the term are skipped), Trading Times = E, How Stocks Are Made = B + journey, Scam Spotter = T, Taxes = Q, Calculation = all number questions, True or Myth = all true/false, Timeline = ordering questions + K; Chart Reading links to /charts/quiz; World Markets game uses the country files (indexes, and currencies used by only one country) |
| Badges | First Quiz, Perfect Score (100% with at least 5 questions), Category Master (80%+ in a topic quiz), World Traveler (all 20 country quizzes), Scam Spotter (80%+ in the Scam Spotter quiz or topic T), Founder (finish the How Stocks Are Made quiz), Streak 7, Exam Passed. Computed from stored scores, never from events, so they survive reloads |
| Storage | New localStorage keys quiz-stats, quiz-daily, quiz-exam, quiz-name (all "stockora-" prefixed); listed on the privacy page together with the older founder-game and times-zone keys; "Reset" on My Progress clears them |
| Content | 68 new advanced questions so every one of the 196 lessons has a 5-question mini-quiz; each is built from its lesson and cites that lesson's official source. Totals: 1,368 questions (plus 431 generated glossary questions), beginner 38%, intermediate 44%, advanced 18% |
| Correction | S/major-exchanges said Tel Aviv trades on a different weekly schedule; TASE has traded Monday to Friday since January 2026 (TASE trading schedule page), fixed |

## Phase 10 (2026-10-16 to 2026-10-18): Video library

| Topic | Decision |
|---|---|
| Page | /videos lists every video (110) with filters for topic or country, level, language, length (≤5, 5–15, 15–30, >30 minutes) and a text search over titles and channels. Filters are plain HTML plus a small script and are mirrored in the URL (e.g. /videos?topic=J). Each card links to the topic and country pages it appears on |
| Privacy | Unchanged click-to-load embed: nothing is requested from YouTube before a click (checked in the browser), then the player loads from youtube-nocookie.com; every card also has a plain "Watch on YouTube" link |
| Selection rules | Exchanges, regulators, central banks, public broadcasters and established newsrooms first. Broker channels (e.g. TD Direct Investing, Zerodha, Directa, Killik) were skipped even when educational, because the brief excludes broker promotion; anonymous explainer channels were skipped too. Marketing claims in descriptions ("most efficient exchange") ruled a video out |
| New videos | 21 added after checking channel, title, length and description: 3 for Trading Times (Nasdaq on 23/5 trading, Bloomberg report, Börse Stuttgart on auctions) and country videos from Wiener Börse, Deutsche Börse, SIX, LSEG, Clearstream (T+1), Euronext Paris CEO, AMF, CONSOB, GPW, Nasdaq Stockholm, Telemadrid, NTV, moneycontrol (NSE), Reuters, TaiwanPlus, Bloomberg (SGX) and ASX. Five existing videos were tagged to countries (HKEX Stock Connect to CN and HK, DTCC to US, Deutsche Börse to DE, FMA and BMF to AT) |
| Languages | English first; German, French, Spanish and Italian videos are labelled and filterable, used where an official local source is better than an English third-party one |
| Gaps | The Netherlands has no video yet (no suitable AFM or Euronext Amsterdam explainer found); its page shows the brief's "Search YouTube" button. Several countries have one video only. 80 of 196 lessons have a lesson-specific video; every topic page shows 2–9 |
| Checker | scripts/check-videos.js checks all IDs via oEmbed (existence, title similarity, channel). `npm run check:videos:write` also sets lastChecked to today for passing videos; `npm run verify:full` runs the normal verify plus the video check. It is not part of the plain build, because a build should not fail when YouTube is unreachable; a scheduled CI run is planned for Phase 12 |

## Phase 11 (2026-10-19): Tools, history timeline and Scam Shield

| Topic | Decision |
|---|---|
| Calculator maths | All formulas live in src/lib/calc.ts as pure functions, separate from the UI, with 23 tests in tests/calc.test.ts. The tests include the worked examples from the lessons (break-even €50.15, Alpenrad rights issue: TERP €19.20, right €0.80), so a calculator and its lesson cannot drift apart |
| KESt estimate | The profit/loss calculator applies 27.5% (§ 27a EStG) to the gain before fees, because fees are not deductible for private investors (BMF). A loss produces no tax; loss offsetting across positions, foreign withholding tax and the option to use the normal income tax rate are not modelled. The result is labelled as an estimate, with a note to check with the BMF or a tax adviser and the official sources listed |
| Tool registry | src/config/tools.ts lists every tool once (group, icon, lessons, sources). /tools is the hub; /tools/<slug> pages are generated for the 13 calculators. Tools that already had a page (Trading Times, country comparison, founder game, Chart Lab, candlestick encyclopedia, chart quiz) are linked to, not duplicated. Cap table and bookbuilding reuse the Phase 6 simulators. Every tool page shows "Learn more" lesson links, resolved and checked at build time |
| Charts | The compound growth and savings plan charts have a legend, a hover readout and a table view; the compound chart can add a crash year and an inflation-adjusted line |
| Brief items covered elsewhere | The indicator playground is Chart Lab, and the support/resistance trainer is part of the chart quiz. The paper-trading game was not built; it is a candidate for v2 |
| History timeline | /history has 28 events from 1285 (Bruges) to 2024 (T+1 in North America), plus two dated planned events (Nasdaq 23/5 trading, EU T+1 in 2027) shown under "Coming up". Each event has what happened, why it mattered, a lesson, links to lessons, and at least one source. The validator checks ids, internal links and sources. The tulip mania entry separates myth from fact (UChicago Press) |
| Sources skipped | The UK National Archives blog asked for human verification and was not used (Royal Museums Greenwich instead). History Today and Smithsonian returned 403 (UChicago Press instead). invent.org dates the stock ticker to 1863; the timeline keeps 1867 (first use on Wall Street) with NPR as an extra source. Claims no source supported were removed (e.g. on the flash crash and the dot-com bust) |
| Scam Shield | /scams replaces the placeholder: a 14-item red-flag checklist (nothing is stored), five checks before investing (FMA company database, FMA warnings, IOSCO I-SCAN, contact details, ask the regulator), six fictional cases to sort into scam or legitimate (two are legitimate, so the answer is not always "scam"), what to do after fraud, and Austrian help links (FMA, Bundeskriminalamt, Watchlist Internet, AK, VKI). Sources: FMA warnings from 2018, 2022 and 2026, Investor.gov. No real firms are named. A claim about small first withdrawals was left out because no official source was found |
| Placeholders | Every section is now live, so the ComingSoon component, plannedSections config and soon.* strings were removed |

## Phase 12 (2026-10-19): Polish, SEO and deployment

| Topic | Decision |
|---|---|
| Audit method | Lighthouse 12 (mobile, headless Brave, since Chrome is not installed) on 25 representative pages: every page type, every interactive tool. Before: performance 78–100, accessibility 92–100. After: performance 90–100 (all but the quiz player 96+), accessibility 100, best practices 100, SEO 100 on every indexable page (the quiz player and /me score 66 on SEO only because they are deliberately noindex). Eight pages were re-run in light mode: all 100 for accessibility |
| Dark-mode bug | Lesson and page prose was dark grey on the dark background in dark mode (contrast 1.0–1.8). The typography plugin's `.prose` lives in Tailwind's utilities layer, which beat our colour variables in `@layer components`. The variables are now unlayered. Found only through the audit, which ran in dark mode |
| Accessibility | Links in running text are underlined (WCAG 1.4.1: not colour alone); tap targets of at least 24 px on the glossary letter bar, topic chips and Trading Times lists; distinct button labels on the quiz hub; heading levels follow the page outline (components take a `headingLevel` where they appear at different depths); the country comparison uses toggle buttons (`aria-pressed`) instead of an incomplete ARIA tablist |
| Layout shift | All 11 client-only islands render a fallback box of about their final height (measured at 412 px and 1280 px), and the quiz player and flashcards keep that size while questions load. CLS dropped from up to 0.78 to near 0. The box is hidden when scripting is off, so the existing "needs JavaScript" notes still show |
| Structured data | WebSite with site search (home), Article + LearningResource with `dateModified` = lastReviewed (lessons), BreadcrumbList (lessons, topics, countries, tools). Only facts shown on the page; no ratings, no FAQ or course markup. Builders in src/lib/seo.ts with tests; `<` is escaped in the JSON |
| Social image | One site-wide 1200×630 PNG (logo, tagline, decorative candles, "education only"). Rendered by scripts/build-og-image.mjs through the DevTools protocol (Brave's `--screenshot` flag hangs on this Mac); no new dependency |
| robots and sitemap | robots.txt is generated so its Sitemap line has the real URL and base path. Pages marked noindex (/me, /quizzes/play, /quizzes/certificate, /impressum, /brand) are filtered out of the sitemap; scripts/check-dist.js fails the build if the two disagree |
| Built-site check | scripts/check-dist.js runs after every build (in `verify`, CI and deploy): meta tags, one h1, JSON-LD, sitemap, and all ~24,500 internal links and anchors. A build with `BASE_PATH=/stockora-academy` found one real bug: the home page's "continue" link had the base path twice, so it would have been broken on GitHub Pages. Runtime links (search, quiz feedback, islands) were checked in the browser under the base path too |
| Source links | scripts/check-sources.js checks all 662 external links in content/ and src/. First run: 0 broken (one false alarm from URLs containing brackets, fixed), 18 redirected. 13 were updated to their new address after checking that each new page still supports what we cite (FINRA source title changed to "Build an Emergency Fund"; the DTCC page now lists DTC among its subsidiaries with its role). Home-page redirects (e.g. nyse.com → /index) are accepted. About 135 links cannot be checked by script (investor.gov, sec.gov, FMA and others return 403 or time out); they are listed as "unchecked", not as failures |
| CI | Deploy: verify (with the built-site check) then publish; the YouTube check no longer runs on deploy, so a YouTube outage cannot block publishing. New weekly workflow (Mondays 06:00 UTC, also manual) runs check:videos and check:sources and opens one GitHub issue if anything breaks. New pull-request workflow runs verify |
| README | Rewritten: what is on the site, all checks and when they run, how to edit every content file, deployment on GitHub Pages and other static hosts, the pre-launch list, credits |
| Not changed | The /brand page (Phase 1 logo options) stays online but is noindex; it can be deleted once nobody needs the comparison. The site is English only; the i18n dictionary is ready for German |

## Maintenance (2026-10-20)

| Topic | Decision |
|---|---|
| Amsterdam hours | From Euronext's appendix to trading manuals 4-01/4-03 (Excel, effective 19 October 2026), trading group J0 (AEX shares): opening auction 09:00, continuous 09:00–17:30, closing auction 17:35, trading at last until 17:40; double fixing at 11:30 and 16:30 for less liquid groups. Same as Paris |
| Warsaw hours | GPW's session page loads its timetable from a service that returned no data, and gpw.pl refuses curl. The English Detailed Exchange Trading Rules were read in the browser (PDF text extracted in the page, not opened as a document): both the UTP version (February 2026) and the WATS version give 08:30–09:00 opening auction, 09:00–16:50 continuous, 16:50–17:00 closing auction, 17:00–17:05 trading at last, so the times hold whichever system is live. Only the Polish text is binding; the source title says so |
| Japan protection | DICJ (Japanese page, current): ¥10 million principal per depositor and bank plus interest; non-interest settlement deposits in full; foreign-currency deposits not covered. JIPF (English): up to ¥10 million per customer if a failed securities firm cannot return segregated assets; no cover for price falls. DICJ's English guide (FY2005) was not used because of its age |
| Taiwan protection | CDIC: NT$3 million per depositor and insured institution, principal and interest, NTD or foreign currency; securities firms are not covered. No official source was found for a securities investor compensation scheme, so none is stated |

## Deployment and legal pages (2026-10-20 to 2026-10-21)

| Topic | Decision |
|---|---|
| Deployment | 2026-10-20: public repository github.com/ManOfSarbloh/stockora-academy, GitHub Pages (Source: GitHub Actions), live at https://manofsarbloh.github.io/stockora-academy/. The first run failed at configure-pages until Pages was enabled; the re-run passed build (verify incl. built-site check) and deploy |
| Legal pages | 2026-10-21: Impressum filled in with the owner's name, town (Vienna, no street address, at the owner's request) and email. Privacy Policy hosting section completed from GitHub's own docs (Pages IP logging; General Privacy Statement: DPF certification, standard contractual clauses, GitHub, Inc. address), plus controller and GDPR rights; legal basis Art. 6(1)(f). Not legal advice: the owner may want a lawyer to confirm a town-only Offenlegung is enough |


## Languages (2026-10-20 to 2026-10-21)

| Topic | Decision |
|---|---|
| Languages | German, Spanish, French and Italian are live. The owner chose "interface + key pages": UI strings, home page, tools, glossary, Scam Shield, topic titles and the information pages are translated; the 196 lessons, 1,368 quiz questions, country pages, history and videos stay English. Russian was requested too, then dropped by the owner to save time: its UI dictionary, topic texts, Scam Shield texts and pages are in the repo but not registered; the 551-term glossary is missing |
| URLs | English stays at the root (no redirects, no broken links); other languages under /de/, /es/, /fr/, /it/. One `[...locale]` page tree generates every language; a middleware rewrites internal links in the HTML so visitors stay in their language |
| English-only pages | Translated URLs exist for every page so navigation never drops a visitor back into English, but English-only pages show a notice, set their canonical to the English page, carry no hreflang and are not in the sitemap (no duplicate content). Translated pages carry hreflang alternates and are in the sitemap |
| Translation | Written with AI help, with a footer note on every translated page and "English prevails" on the legal pages. Style: German "du" with Austrian conventions (de-AT number format), Spanish "tú", French "vous" with French spacing, Italian "tu". Official names (KESt, FMA, BMF, Firmenbuch, AG, GmbH) are kept; the glossary shows the English term under each translated one because the lessons are English. Counts use "Label: {n}" to avoid plural rules |
| Checks | Tests fail on missing keys or placeholders; validate checks translation files against the English ids; the built-site check verifies canonicals, hreflang, sitemap and that links on translated pages stay in that language |
| Header | With longer labels the full nav no longer fit at 1024 px (the right-hand buttons were pushed off-screen in English, Spanish and French). Between 1024 and 1279 px the last two primary items now move into "More"; Spanish and French nav labels were shortened ("Gráficos", "Tests", "Graphiques") so all six fit at 1280 px |

## Open items
- Owner to check domains, handles and trademarks (brief §0.1).
- Russian: translate the glossary (551 terms) to content/i18n/ru/glossary.json, review the existing Russian files, then register `ru` in src/i18n/dictionaries.ts.
- When English text changes, update the four translations (README, "UI text and translations").
- Trading Times: add 2027 holidays for Euronext, TSX, B3, NSE and China when published (checked 2026-10-20: none official yet; B3 usually publishes in early January, China's exchanges in late December after the State Council notice, NSE in December; Euronext's 2026 year-end half-day hours were still "to be announced"); the SGX site only loads after accepting cookies, so its calendar was not read; re-check B3 hours after US DST ends; find official KRX and SGX holiday lists; verify JSE, Saudi Exchange and Borsa Istanbul hours.
- World Markets: refresh content/world/market-size.json when the World Bank publishes 2026 figures; re-check country tax pages yearly (lastReviewed 2026-10-16); consider MSCI classification if a readable official source is found.
