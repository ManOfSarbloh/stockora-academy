# Stockora Academy: The Complete Stocks, Trading & Share Market Learning Website

> **How to use this file:** Put it in an empty folder, start Claude Code (`claude`), and say:
> **"Read PROJECT_BRIEF.md fully. Make a plan first, show it to me, then build the website phase by phase. Ask me before big decisions."**

---

## 0. Vision

Build the most complete free beginner-to-advanced website about stocks (shares), trading, and stock markets worldwide. It must:

1. Explain **everything** about stocks, organized into **clear categories** (section 4).
2. Explain **how stocks are made** from company founding to IPO to daily trading (section 5).
3. Cover **stock markets in different countries**: exchanges, indexes, regulators, taxes, rules, hours (section 6).
4. Show **trading times** for all major markets, converted to the visitor's time zone (section 7).
5. Have a **quiz section**: a quiz for every category, every subtopic, every country, plus a mega-quiz on everything (section 8).
6. Include **good YouTube videos** for each category, embedded in a privacy-friendly way (section 9).
7. Include a glossary, calculators, history timeline, and scam awareness (sections 10-13).
8. Teach **how to read charts and candlesticks** and **how a charting platform like TradingView works**, with an interactive **Chart Lab** (section 4.1).

**Audience:** complete beginners (16+) up to ambitious learners. Written in simple English first (structure the code so German can be added later; the owner lives in Austria, so Austria is the "home" country example everywhere).
**Tone:** friendly, clear, example-driven, no unexplained jargon.
**Hard rule:** educational only. No investment advice, no stock/broker/crypto recommendations, no affiliate links, no real-money trading.

### 0.1 Brand: "Stockora Academy"

- **Name:** Stockora Academy (decided). Short form: **Stockora**. Use the full name in the logo, page titles, and legal text; use "Stockora" in running text where natural.
- **Meaning/feel:** a coined word built around "stock"; calm, trustworthy, beginner-friendly, never hype. No promises of profit anywhere in the copy.
- **Tagline ideas** (pick or improve; keep it honest, no earnings promises): "Learn how the stock market really works." / "From first share to world markets."
- **Use the name consistently** in: page `<title>`s, meta tags, footer, disclaimer, quiz certificate, README, `localStorage` key prefix (`stockora-`), package name (`stockora-academy`).
- **Logo/identity:** Claude Code should propose 2-3 simple original logo/wordmark ideas as SVG (no copied logos, no stock-market clichés that look like a broker). Favicon included.
- **Domain and handle checklist (the owner will check availability themselves; do not assume anything is free):**
  - Domains to look up: `stockoraacademy.com`, `stockora.academy`, `stockora.at`, `stockora.com`.
  - Handles to look up: `stockoraacademy` / `stockora_academy` on Instagram, TikTok, YouTube, X.
  - Trademark searches (EUIPO TMview and the Austrian Patent Office register) for "Stockora" in education and financial-information classes.
  - **Known near-name to avoid confusion with:** "Stockvora" (a stock newsletter). Do not imitate its look, wording, or logo.
- **Do not** claim to be an accredited school or a regulated financial service. "Academy" only means "learning site". Add this to the About page.

---

## 1. Tech & Architecture

- Static, content-driven site. Suggested: **Vite + React + TypeScript + Tailwind CSS** (or Astro if it makes content easier). Claude Code may propose a better option, but must explain why.
- **All content lives in files** (`/content/**`), never hard-coded in components:
  - Lessons: Markdown with front-matter (`title`, `category`, `level`, `readingTime`, `tags`, `lastReviewed`, `sources`).
  - Quizzes: JSON (`/content/quizzes/<category>.json`).
  - Countries: JSON (`/content/countries/<code>.json`).
  - Videos: JSON (`/content/videos.json`).
  - Glossary: JSON (`/content/glossary.json`).
  - Exchanges and holidays: JSON (`/content/exchanges.json`).
- Client-side only: progress, quiz scores, bookmarks, and settings in **localStorage**.
- Full-text search across lessons, glossary, countries (e.g. Fuse.js or Pagefind).
- i18n-ready (all UI strings in one dictionary file), English first.
- Mobile-first, responsive, WCAG-accessible, dark mode, fast (Lighthouse 90+).
- Privacy-friendly: **no tracking, no third-party cookies**. YouTube videos load only after the visitor clicks (see section 9).
- Tests: unit tests for calculators, time-zone/market-hours logic, and quiz scoring; a link checker script for videos and sources.
- Deployable free (Netlify, Vercel, or GitHub Pages).
- **Charts:** build our own educational chart sandbox ("Chart Lab", section 4.1) with an open-source charting library (e.g. TradingView's open-source Lightweight Charts, which is Apache-2.0 licensed and requires an attribution notice; verify the license text; or D3/ECharts). Use **simulated data or data whose license is verified**; never scrape price data. Do not embed third-party tracking widgets by default (see the privacy rule above).

---

## 2. Site Map

- **Home:** hero, "Start here" learning path, category grid, progress bar, "Quiz of the day", "Is the market open now?" widget.
- **Learn** (`/learn`): 22 categories (section 4), each with lessons, key takeaways, videos, glossary links, and a category quiz.
- **How Stocks Are Made** (`/how-stocks-are-made`): the full journey, interactive step-by-step (section 5).
- **World Markets** (`/world`): country explorer with map, comparison table, and country pages (section 6).
- **Trading Times** (`/times`): live open/closed, 24h timeline, converter, holidays (section 7).
- **Quizzes** (`/quizzes`): hub with all quizzes (section 8).
- **Videos** (`/videos`): all videos filterable by category and level (section 9).
- **Chart School** (`/charts`): how to read charts, candlestick encyclopedia, how TradingView-style platforms work, and the interactive Chart Lab (section 4.1).
- **Glossary** (`/glossary`): searchable A-Z (section 10).
- **Tools** (`/tools`): calculators and simulators (section 11).
- **History** (`/history`): timeline of stock markets and crashes (section 12).
- **Scam Shield** (`/scams`): red flags and verification steps (section 13).
- **About / Disclaimer / Sources / Privacy / Impressum** (legal pages, section 15).

Global features: search bar, progress tracker, bookmarks, "next lesson" button, level filter (Beginner / Intermediate / Advanced), dark mode, disclaimer footer.

---

## 3. Learning Path

A recommended order for beginners: A to B to C to D to E to F to G to H to U (money-making basics), then I, J, K, L, M (understanding markets), then N, O, P (risk and behavior), then Q, R, S, T, V, W (rules, world, safety, extras). Each category shows level tags so advanced readers can jump around.

---

## 4. Category Catalogue (every category needs lessons + videos + glossary tags + a quiz)

Each lesson: plain-English explanation, a worked numeric example, a "common beginner mistake" box, "key takeaways", and links to related lessons and glossary terms. Add diagrams where marked (D).

### A. Foundations of Stocks
What a stock is (D: pie chart of ownership); why companies exist and need money; shareholder rights (vote, dividend, information, residual claim); equity vs debt; stocks vs bonds vs cash vs property; why prices exist; risk and return; stock vs share vs security vs equity; ticker, ISIN, WKN; what "the stock market" actually is (not one place); who participates (retail, institutions, funds, banks, market makers, governments).

### B. How Stocks Are Made (see section 5 for the full spec)
Company founding; share capital; cap table; funding rounds; IPO; listing; first trade; after-IPO.

### C. Types of Stocks & Related Securities
Common vs preferred; voting vs non-voting; share classes (A/B); par value vs no-par (Nennbetrags- vs Stückaktien); bearer vs registered shares (Inhaber- vs Namensaktien); growth, value, dividend, blue-chip, cyclical, defensive, penny, meme stocks; large/mid/small/micro-cap; sectors and industries (GICS); ADRs/GDRs; REITs; convertible bonds, warrants, subscription rights; tracker certificates; fractional shares.

### D. Market Structure: Where and How Shares Trade
Primary vs secondary market; stock exchanges (history and function); order book and matching engine (D); price discovery; opening/closing auctions; market makers and liquidity providers; OTC trading, dark pools, MTFs (e.g. in Europe), alternative trading systems (in the US); clearing houses (CCPs) and central securities depositories (CSDs); settlement (T+2, T+1, why it exists); circuit breakers and trading halts; tick sizes and lot sizes; exchange fees; high-frequency trading (what it is, pros/cons).

### E. Trading Times & Sessions
Regular hours; pre-market and after-hours; opening and closing auctions; lunch breaks (some Asian markets); weekends and holidays; half-days; time zones and DST; market overlaps (Europe/US); why the first and last hour are volatile; triple witching and index rebalancing days; 24-hour trading ideas (overnight sessions). Links to the Trading Times tool.

### F. Brokers, Accounts & Orders
What a broker is; full-service vs discount vs online brokers vs neobrokers; bank Depot vs broker Depot; how to choose a broker safely (criteria only, no recommendations: regulation, deposit protection, costs, product range, tax handling, platform quality); account types (cash vs margin; tax-advantaged accounts in different countries, e.g. ISA UK, 401(k)/IRA US, NISA Japan, TFSA Canada); opening an account (KYC, ID checks); order types (market, limit, stop, stop-limit, trailing stop, fill-or-kill, good-till-cancelled, day order); bid/ask/spread; slippage; partial fills; fractional investing; savings plans; securities lending; payment for order flow (what it is, controversy); investor protection schemes.

### G. How You Make (and Lose) Money, and What It Costs
Capital gains and losses; dividends (ordinary, special, ex-dividend date, record date, payment date); dividend yield and payout ratio; total return; compound growth (D); real vs nominal returns; inflation; costs: commissions, spreads, FX fees, custody fees, fund fees (TER), taxes; break-even calculation; the cost of small trades.

### H. Indexes, ETFs & Funds
What an index is and how it is built (market-cap weighted, price weighted, equal weighted, free-float); major indexes worldwide (section 6); ETF mechanics (creation/redemption, physical vs synthetic, accumulating vs distributing, TER, tracking error); index funds vs mutual funds vs active funds; smart beta/factor ETFs; thematic ETFs and why they are risky; sector ETFs; leveraged/inverse ETFs and why they are dangerous; ETF taxation overview (Austria: reporting funds, etc.); how to compare ETFs (criteria only); rebalancing; MSCI World vs FTSE All-World vs S&P 500 explained (what they contain).

### I. Fundamental Analysis & Valuation
Reading an annual report; balance sheet, income statement, cash flow statement (D); revenue, gross/operating/net margin, EBITDA, EBIT, free cash flow; EPS, book value, ROE, ROA, ROIC; debt metrics (debt/equity, interest coverage); valuation ratios (P/E, forward P/E, PEG, P/B, P/S, EV/EBITDA, dividend yield); intrinsic value and DCF (simple version with spreadsheet-style example); margin of safety; moats and competitive advantage; industry analysis; management quality; comparing companies fairly; red flags in accounts; where to find financial data (official filings, investor relations pages).

### J. Technical Analysis & Chart Reading (see section 4.1 "Chart School" for the full spec)
Price charts (line, bar, candlestick, Heikin Ashi) (D); timeframes; how to read a candle (body, wicks, open/high/low/close) and what single and multi-candle patterns mean; trends, support, resistance, trendlines, channels; volume; moving averages (SMA/EMA); RSI, MACD, Bollinger Bands, VWAP (what they show, their limits); chart patterns (head and shoulders, double top/bottom, triangles, flags); gaps; multi-timeframe analysis; how charting platforms like TradingView work; why technical analysis is controversial; efficient market hypothesis vs technical analysis; backtesting and its pitfalls (overfitting).

### K. Market Cycles, Crashes & History Lessons
Bull/bear markets; economic cycles; sentiment cycles; valuation bubbles; major events (Tulip mania as a myth-vs-fact lesson, South Sea Bubble, 1929, 1987, dot-com, 2008, 2020, 2022 rate shock); what recoveries looked like; why timing the market fails; long-term historical returns and their caveats (survivorship bias); lessons from each crash.

### L. Macroeconomics & the Market
Interest rates and central banks (ECB, Fed, Bank of England, SNB, BoJ); inflation; GDP; unemployment; yield curve; currency exchange rates and how they affect foreign stock returns; commodity prices; geopolitics; earnings seasons; economic calendar; how news moves prices (and why reacting to news is hard).

### M. Investing Strategies & Portfolio Building
Investing goals and time horizons; asset allocation; diversification (by company, sector, country, asset class); buy-and-hold; dollar-cost averaging vs lump sum; value investing; growth investing; dividend investing; index investing; factor investing; core-satellite; rebalancing; emergency fund first; the cost of being in cash; retirement and long-term planning concepts; DIY vs advisor vs robo-advisor; how to build a watchlist; writing an investment plan.

### N. Trading Styles, Leverage & Derivatives
Investing vs trading vs speculating vs gambling; day trading, swing trading, position trading, scalping; why most retail day traders lose (cite studies, e.g. from regulators; Claude Code must find and cite real sources); short selling (mechanics, risks, short squeezes, GameStop 2021 case study); margin and leverage with numeric examples; margin calls; options basics (calls/puts, premium, expiry, a simple example, the risk of total loss); futures; CFDs (why regulators restrict them for retail in the EU/UK); warrants/turbo certificates; paper trading; trading plans, journals, and discipline. Strong risk warnings throughout.

### O. Psychology & Behavioral Finance
FOMO; fear and greed; loss aversion; overconfidence; confirmation bias; herd behavior; anchoring; recency bias; sunk-cost fallacy; gambler's fallacy; hindsight bias; social media influence; how to build good habits (automation, rules, checklists); case studies of emotional mistakes.

### P. Risk Management
Types of risk (market, company-specific, liquidity, currency, inflation, interest-rate, concentration, counterparty, regulatory, political, black swan); measuring risk (volatility, standard deviation, beta, drawdown, Sharpe ratio explained simply); position sizing; stop-losses (benefits and limits, gaps); diversification limits; risk of ruin math (a 50% loss needs a 100% gain); never invest money you need soon; insurance and deposit protection concepts.

### Q. Taxes (concepts + country-specific)
General concepts: capital gains tax, dividend tax, withholding tax, double taxation treaties, wash-sale-type rules, tax-loss harvesting, transaction taxes/stamp duties, tax-advantaged accounts. Country sections live in section 6. **Austria deep dive (home country):** KESt 27.5%, automatic withholding by Austrian banks/brokers, foreign broker declaration, loss offsetting (Verlustausgleich), ETF reporting funds, dividends from foreign companies and withholding tax, Freibeträge, the tax return (Steuererklärung), where to check (BMF, FinanzOnline). Every tax page must show a **last reviewed date**, a **"rules change, verify with the official source or a tax advisor"** banner, and links to official sites.

### R. Regulation, Law & Ethics
Why markets are regulated; regulators worldwide (FMA, BaFin, FINMA, ESMA, FCA, SEC, FINRA, SEBI, CSRC, JFSA, ASIC...); prospectus requirements; disclosure and ad-hoc announcements; insider trading and market manipulation (examples); investor protection and compensation schemes; shareholder rights (voting, annual general meeting, proxy voting, dividends); takeovers and squeeze-outs; delisting; bankruptcy and what happens to shares; short-selling rules; MiFID II basics (EU); ESG and sustainable investing (what it means, greenwashing risks); whistleblowing; corporate governance basics.

### S. Stock Markets Around the World
Overview and the world map; country profiles (section 6); comparison table; how foreign investors access markets; ADRs/GDRs; currency effects; emerging vs developed vs frontier markets; index providers (MSCI, FTSE Russell, S&P, STOXX); market size rankings (with "as of" dates, verify).

### T. Scams, Fraud & Safety
Fake brokers; "guaranteed returns"; pump-and-dump; boiler rooms; romance/"pig butchering" investment scams; social media "gurus" and "signal groups"; fake trading apps; recovery scams; phishing; deepfake endorsements; unregulated offshore brokers; how to verify a broker (FMA company database, regulator warning lists, ESMA/IOSCO I-SCAN); what to do if scammed (police, bank, regulator). Includes an interactive red-flag checklist and a "Spot the scam" game.

### U. Other Asset Classes (for comparison)
Bonds (basics, yield, risk), money market, savings, real estate, gold and commodities, forex, cryptocurrencies (clear risk warnings, neutral explanation), private equity (why retail access is limited), how stocks compare to each. Educational only.

### V. Corporate Actions & Company Events
Dividends; stock splits and reverse splits; buybacks; rights issues; secondary offerings and dilution; mergers and acquisitions; spin-offs; takeovers; tender offers; delistings; name/ticker changes; bankruptcies and restructurings; what each means for a shareholder (with numbers).

### W. Tools, Resources & Reading the News
How to read a stock quote page; stock screeners; charting tools; financial news sources and how to judge them; economic and earnings calendars; official filings databases (e.g. SEC EDGAR, company registers); investor relations pages; analyst ratings (conflicts of interest); how to avoid information overload; keeping an investment journal; further reading list (classic books) and trusted websites (official sources first).

### 4.1 Chart School: How to Read Charts, What Candles Mean, and How TradingView-Style Platforms Work

**Goal:** after this section a complete beginner can open any charting platform and understand what is on the screen. It is the deep dive for category J, with its own page (`/charts`), lessons, a candlestick encyclopedia, an interactive **Chart Lab**, quizzes, and videos. Everything is educational: **no buy/sell signals, no predictions**, and every pattern page carries a "patterns are probabilities, not promises" box.

**Lesson 1. What a chart shows.** Price on the vertical axis, time on the horizontal axis. Chart types: line (closing prices), bar (OHLC), **candlestick**, area, **Heikin Ashi** (smoothed candles built from averages, so they do not show real traded prices), and a short mention of Renko/Kagi (time-independent). **Linear vs logarithmic scale** (when log is better: long periods and percentage moves). **Timeframes** (1 minute, 5 minutes, 1 hour, daily, weekly, monthly): each candle = one period; the same market looks different on each; higher timeframes give more reliable context. **Volume bars** under the price. **Adjusted vs unadjusted prices** (splits, dividends). Time zones, exchange sessions, pre/after-hours candles, and overnight **gaps**. **Delayed vs real-time data**.

**Lesson 2. Anatomy of a candlestick.** **OHLC** = open, high, low, close. The **body** is the range between open and close; the thin lines (**wicks / shadows**) show the high and low beyond the body. Colors: commonly green/white = close above open (bullish) and red/black = close below open (bearish), but colors are customizable and in several East Asian markets red means up, so always check the platform's setting. Worked example with numbers: open 100, high 106, low 98, close 104 (draw it, label every part). **What one candle tells you:** who "won" that period (buyers or sellers); a long body = strong conviction; a small body = indecision; a long upper wick = price rose but sellers pushed it back down (rejection); a long lower wick = price fell but buyers pushed it back up. **Context matters:** where the candle appears (after an uptrend or downtrend, near support or resistance), its size compared with recent candles, volume, and the timeframe. Short history: candlestick charting is commonly traced to Japanese rice traders in the 1700s, often linked to Munehisa Homma, and was popularized in the West by Steve Nison in the 1990s (verify these facts from reliable sources).

**Lesson 3. Single-candle shapes** (each with an original SVG, "what it looks like", "what traders read into it", "how it commonly fails"):
- **Doji** (open about equal to close; indecision) and variants: long-legged, dragonfly, gravestone.
- **Spinning top** (small body, wicks on both sides; indecision).
- **Marubozu** (full body, little or no wicks; strong one-sided momentum).
- **Hammer** (small body near the top, long lower wick, after a downtrend) vs **hanging man** (same shape after an uptrend): the shape is the same, the context changes the reading.
- **Inverted hammer** vs **shooting star** (long upper wick; after a downtrend vs after an uptrend).

**Lesson 4. Multi-candle patterns** (formation, what traders think it means, what confirmation they wait for, how it fails): **bullish and bearish engulfing**, **harami** (and harami cross), **piercing line** and **dark cloud cover**, **morning star** and **evening star**, **three white soldiers** and **three black crows**, **tweezer tops and bottoms**, **inside bar**. Add a note on gaps (breakaway, continuation, exhaustion).

**Lesson 5. Honest limits of candlestick patterns.** Patterns are probabilities, not predictions. Show hindsight bias (patterns look obvious after the fact), confirmation bias, and the need for confirmation (the next candle, volume, a break of a level). Explain why traders combine patterns with trend, support/resistance, and risk management (where would I be proven wrong?). Claude Code must find and cite **real research** on the predictive power of candlestick/technical patterns (results are mixed and often weak after trading costs; report this fairly and do not overclaim in either direction).

**Lesson 6. Trend and market structure.** Uptrend = higher highs and higher lows; downtrend = lower highs and lower lows; sideways range. Trendlines and channels. **Support and resistance as zones, not exact lines**; role reversal (broken resistance can become support); round numbers, previous highs/lows, 52-week highs/lows. Breakouts, **false breakouts (fakeouts)**, pullbacks and retests. Volume as confirmation (and its limits).

**Lesson 7. Indicators (what they are and are not).** Overlay indicators vs oscillators. **Moving averages** (SMA vs EMA; common lengths 20/50/100/200; "golden cross" = 50-day crosses above 200-day, "death cross" = the opposite; they lag by design). **RSI** (scale 0-100, conventional 70 "overbought" and 30 "oversold" levels, why a strong trend can stay overbought, divergence). **MACD** (MACD line, signal line, histogram). **Bollinger Bands** (volatility, squeezes). **VWAP** (volume-weighted average price, mostly intraday). **ATR** (average true range, a volatility measure). **Fibonacci retracements** (popular but subjective; explain the debate). Rules of thumb: indicators are derived from price; more indicators does not mean better; indicator overload; "repainting" indicators can mislead.

**Lesson 8. A reading routine and multi-timeframe analysis.** Top-down: weekly, then daily, then hourly. A beginner checklist: 1) confirm symbol, exchange, and currency; 2) pick the timeframe that matches your goal; 3) read the trend structure; 4) mark support/resistance zones; 5) look at the latest candles; 6) check volume; 7) add at most one or two indicators; 8) write down what would prove you wrong; 9) accept that "no trade" is a valid decision. Include the pitfalls of backtesting (overfitting, survivorship bias, ignoring costs) and why paper trading comes before real money.

**Lesson 9. How a charting platform like TradingView works.** Use TradingView as the well-known example and say clearly that the same concepts apply in any charting platform; no affiliation, no recommendation, no affiliate links; features and pricing change, so link to the official site and mark "verify". Cover:
- **What it is:** a web-based charting and market-analysis platform (with mobile and desktop apps) covering stocks, indexes, forex, crypto, and futures, with a social/"ideas" side.
- **Interface tour (original illustration, not screenshots):** top toolbar (symbol search, timeframe selector, chart type, indicators, alerts, replay, layouts, save), left toolbar (drawing tools), right panel (watchlist, alerts, news and symbol details), bottom panel (screener, script editor, paper trading, broker panel), and the chart area itself (candles, volume pane, crosshair, price and time scales).
- **Symbols:** the `EXCHANGE:TICKER` format, the same company listed on several exchanges, currency, extended-hours sessions, **delayed vs real-time data** (depends on the exchange and subscription).
- **Chart settings:** candle colors, log/linear scale, adjusting for splits and dividends, time zone, session breaks.
- **Indicators:** built-in library, adding and configuring (length, source), community-written scripts (quality varies; they are not advice).
- **Drawing tools:** trendline, horizontal line and ray, parallel channel, rectangle (zones), Fibonacci retracement, measure tool, long/short position tool (visualizes risk vs reward), text notes, anchored VWAP.
- **Alerts:** price and indicator conditions, notifications; how they can cause over-trading and FOMO.
- **Replay mode:** plays historical candles bar by bar for practice.
- **Watchlists, multi-chart layouts, templates, synced crosshair.**
- **Screener:** filters such as market cap, P/E, volume; a screener result is not a recommendation.
- **Paper trading:** a simulated account with fake money.
- **Pine Script:** the platform's scripting language for custom indicators and strategies, and the **strategy tester** (backtesting) with its pitfalls.
- **Community "ideas":** user-published chart opinions; warn about hype, scams, and "signal" sellers (link to Scam Shield).
- **Plans:** free vs paid differences, data subscriptions (verify on the official site; do not recommend a plan).
- **Broker connections:** some brokers can be linked; explain the risks neutrally.
- **Risks and limits:** delayed data, wrong time zone, repainting indicators, overfitted backtests, too many alerts, social-feed FOMO.
- **Guided walkthrough:** "Read this chart step by step", following the checklist in Lesson 8, built with the Chart Lab.

**Interactive Chart Lab (our own educational chart sandbox, TradingView-like in concept, original in design).**
- **Data:** a simulated-data generator with scenarios (uptrend, downtrend, range, crash, gap, news spike, slow bleed) plus any real historical series **only if its license is verified**. Never scrape or copy price data.
- **Features:** switch between candlestick / bar / line / Heikin Ashi; timeframe aggregation (e.g. from 1-minute simulated data to 5m / 1h / 1d); log/linear toggle; volume pane; indicators (SMA, EMA, RSI, MACD, Bollinger Bands, VWAP) with adjustable settings; drawing tools (trendline, horizontal line, rectangle, Fibonacci retracement, measure); crosshair with an OHLC tooltip; **replay mode** (play, pause, step); a **"reveal the next candle" prediction game** with a score (play-money-free, educational only); **click-any-candle explainer** ("this is a hammer because the body is small, the lower wick is long, and it appears after a drop").
- **Guided tours:** step-by-step overlays that teach each part of the interface.
- **Chart Reading Quiz:** charts generated from simulated data; questions like "What is this candle called?", "Where is support?", "Is this an uptrend?", "What does the RSI show?", "Which timeframe is this?", plus click-on-the-chart answers.
- **Candlestick Encyclopedia** (`/charts/candles`): one card per pattern with an original SVG, formation, meaning, confirmation, typical failure, a live example in the Chart Lab, and glossary links.
- **If official TradingView embeddable widgets are used anywhere:** they load third-party scripts, so load them only after a click, follow their terms of use, show attribution, and mention it in the Privacy Policy. Prefer our own charts by default. Do not copy TradingView's interface, logo, or screenshots.

**Videos for this section** (see section 9): 2-3 on candlesticks, 2 on support/resistance and trend, 2 on indicators, 1-2 beginner tutorials for using a charting platform such as TradingView (from the platform's own official channel or a reputable educator; verify each link; no affiliate links, no hype, no signal sellers).

---

## 5. Deep Dive Spec: "How Stocks Are Made" (interactive, step-by-step)

Build this as a **scroll-through or step-by-step interactive page**, with a diagram of the whole pipeline and a detailed lesson for each step. Each step has: "What happens", "Who is involved", "Example with numbers", "Austria example" and "US example" where they differ, and a mini-quiz.

**Step 1. An idea becomes a company.** Legal forms and why they matter: sole proprietorship vs corporation. Examples: Austria (GmbH, AG), Germany (GmbH, AG), Switzerland (GmbH, AG), UK (Ltd, plc), USA (LLC, C-corp "Inc."), France (SARL, SA/SAS). Only companies with share capital can issue shares. Registering in the commercial register (Austria: Firmenbuch; UK: Companies House; US: state registries, e.g. Delaware). Claude Code must verify minimum share capital requirements per country (e.g. Austrian GmbH and AG minimums) from official sources and show "as of" dates.

**Step 2. Share capital and the first shares.** What share capital is; authorized vs issued shares; par value vs no-par; founders receive the first shares; shareholder agreement; the **cap table** (build an interactive cap-table calculator: founders, investors, option pool, dilution after each round).

**Step 3. Private funding rounds.** Bootstrapping, friends and family, angel investors, seed, Series A/B/C, venture capital, private equity, crowdfunding. Pre-money vs post-money valuation with a worked example (e.g. founder owns 100%, investor pays €1m for 20% at €4m pre-money; show dilution). Preferred shares in private rounds (liquidation preference explained simply). Employee stock option plans (ESOP), vesting and cliffs.

**Step 4. Why and how a company goes public.** Reasons (raise money, liquidity for early investors, currency for acquisitions, visibility) and downsides (costs, disclosure, short-term pressure, loss of privacy). Other routes: **direct listing**, **SPAC / de-SPAC**, **reverse merger**, **spin-off**, **privatization of state-owned companies**, **dual listing**, **IPO on smaller markets/growth segments**.

**Step 5. The IPO process in detail (timeline graphic).**
1. Decision and preparation (audited financial statements, governance, board changes).
2. Choosing advisors: **investment banks (underwriters)**, lawyers, auditors, PR; the lead bank ("bookrunner").
3. Due diligence and drafting the **prospectus** (EU: approved by the national regulator, e.g. FMA in Austria; US: Form S-1 filed with the SEC; UK: FCA).
4. Valuation work and price range.
5. **Roadshow** with institutional investors; **bookbuilding** (collecting orders at different prices).
6. **Pricing** the offer and **allocation** (who gets shares; oversubscription; retail tranche).
7. Over-allotment option (**greenshoe**) and price stabilization.
8. **Listing day**: first trade, opening auction, "first day pop" or "break below issue price".
9. **Quiet period**, **lock-up period** (insiders cannot sell for e.g. 90-180 days, verify typical ranges), start of analyst coverage.
10. Primary shares (new shares, money goes to the company) vs secondary shares (existing holders sell).
Explain **free float**, **market cap at IPO**, **underpricing**, and index inclusion.

**Step 6. The technical side: how a share "exists".** Shares are registered in the company's share register; **ISIN** numbers are assigned by a national numbering agency (Austria: OeKB; verify); modern shares are mostly **book-entry (dematerialized)**, held at a **central securities depository** (CSD: e.g. OeKB CSD in Austria, Clearstream in Germany, Euroclear, DTC in the US) and credited to your broker's account; paper share certificates are rare. Explain the chain: you → broker → custodian/CSD → company register. Ticker symbol assigned by the exchange; listing segments (e.g. Vienna's segments such as Prime Market and Standard Market; verify current names and rules on wienerborse.at).

**Step 7. After the IPO: trading and price formation.** Secondary market trading; order book; auctions; supply and demand; news and earnings; how the first price is found.

**Step 8. Life as a listed company.** Quarterly/half-yearly reporting, ad-hoc announcements, annual general meeting, dividends, buybacks, share issues (rights issue, capital increase), dilution, index inclusion/exclusion, takeovers, delisting.

**Step 9. How shares disappear.** Mergers and acquisitions, squeeze-outs, going private, bankruptcy (shareholders are last in line).

**Case studies (short, factual, with sources):**
- **Dutch East India Company (VOC), 1602:** often described as the first company to issue shares to the public that traded on an exchange (Amsterdam).
- **Facebook IPO, 2012:** technical glitches on Nasdaq on listing day.
- **Saudi Aramco IPO, 2019:** among the largest IPOs ever (verify the exact figures).
- **An Austrian IPO case study** chosen by Claude Code from Wiener Börse history (verify facts from official sources).
- **A SPAC example** and what went wrong for many investors.

**Interactive tools for this page:** cap-table/dilution simulator; IPO pricing simulator (bookbuilding: slide the price, watch demand); "Build your own company" mini-game (found a company, issue shares, raise a round, go public; clearly fictional play-money).

---

## 6. World Markets (country-by-country)

### 6.1 Country page template (`/content/countries/<code>.json` + a page for each)
Each country page must contain:
- Overview: economy size context, number of listed companies, total market capitalization (with "as of" date and source).
- **Exchanges** (name, location, founding year, website, link to official trading hours/holiday calendar).
- **Main indexes** and what they contain (e.g. ATX, DAX, SMI...).
- **Regulator(s)** and investor protection scheme.
- **Currency** and any currency effects for foreign investors.
- **Trading hours** (local time) and time zone; pre/post-market if any; holidays link.
- **Settlement cycle** (e.g. T+1 / T+2) and CSD.
- **Market rules that differ**: price limits (e.g. daily limits in China), lot/board sizes (e.g. Japan trading units), short-selling rules, tick sizes, circuit breakers, foreign ownership limits, special share classes (e.g. China A-shares vs H-shares).
- **Taxes for individual investors** (overview only: capital gains, dividends, withholding tax, transaction taxes/stamp duties, tax-advantaged accounts) with a "last reviewed" date and official links.
- **How a foreign (e.g. Austrian) investor can access this market** (in general terms: via local broker, international broker, ADRs, ETFs; no recommendations).
- **Famous companies listed** (neutral list, not recommendations) and notable history (crashes, reforms).
- **Fun facts** (oldest exchange, records).
- **Country quiz** (min. 10 questions).

### 6.2 Countries to cover (v1 = at least the first 20; add the rest if time allows)

| # | Country | Main exchange(s) | Headline indexes | Regulator (verify) |
|---|---|---|---|---|
| 1 | Austria (home) | Wiener Börse | ATX | FMA |
| 2 | Germany | Deutsche Börse / Xetra, Frankfurt | DAX, MDAX, SDAX | BaFin |
| 3 | Switzerland | SIX Swiss Exchange | SMI | FINMA |
| 4 | United Kingdom | London Stock Exchange | FTSE 100, FTSE 250 | FCA |
| 5 | United States | NYSE, Nasdaq | S&P 500, Dow Jones, Nasdaq Composite/100 | SEC, FINRA |
| 6 | France | Euronext Paris | CAC 40 | AMF |
| 7 | Netherlands | Euronext Amsterdam | AEX | AFM |
| 8 | Italy | Euronext Milan (Borsa Italiana) | FTSE MIB | Consob |
| 9 | Spain | BME (Bolsa de Madrid) | IBEX 35 | CNMV |
| 10 | Sweden / Nordics | Nasdaq Stockholm (+ Copenhagen, Helsinki), Euronext Oslo | OMXS30 etc. | Finansinspektionen etc. |
| 11 | Poland | Warsaw Stock Exchange | WIG20 | KNF |
| 12 | Japan | Japan Exchange Group (Tokyo) | Nikkei 225, TOPIX | JFSA |
| 13 | China | Shanghai SE, Shenzhen SE | SSE Composite, CSI 300 | CSRC |
| 14 | Hong Kong | HKEX | Hang Seng | SFC |
| 15 | India | NSE, BSE | Nifty 50, Sensex | SEBI |
| 16 | South Korea | Korea Exchange | KOSPI, KOSDAQ | FSC/FSS |
| 17 | Taiwan | TWSE | TAIEX | FSC |
| 18 | Singapore | SGX | STI | MAS |
| 19 | Australia | ASX | S&P/ASX 200 | ASIC |
| 20 | Canada | TSX | S&P/TSX Composite | provincial regulators / CIRO |
| 21 | Brazil | B3 | Ibovespa | CVM |
| 22 | Mexico | BMV | S&P/BMV IPC | CNBV |
| 23 | South Africa | JSE | FTSE/JSE All Share, Top 40 | FSCA |
| 24 | Saudi Arabia | Tadawul | TASI | CMA |
| 25 | UAE | DFM, ADX | DFM General, FTSE ADX | SCA |
| 26 | Turkey | Borsa Istanbul | BIST 100 | CMB |
| 27 | Israel | TASE | TA-35 | ISA |
| 28 | Russia | Moscow Exchange | MOEX | note sanctions and restrictions for foreign investors; explain neutrally |
| 29 | Indonesia, Thailand, Malaysia, Vietnam, Philippines | respective exchanges | respective indexes | respective regulators |
| 30 | Nigeria, Egypt, Kenya (frontier example) | respective exchanges | respective indexes | respective regulators |

(Claude Code must verify every entry from the official exchange/regulator websites and fix mistakes. Do not guess.)

### 6.3 Cross-country comparison pages (interactive tables, sortable/filterable)
- **Trading hours** (in local time and in the visitor's time zone).
- **Settlement cycles** (e.g. the US moved to T+1 in 2024; Europe and the UK have announced T+1 plans for 2027; verify the current status).
- **Taxes at a glance** (capital gains, dividends, transaction taxes) with "verify" banners.
- **Market structure differences:** price limits, lot sizes, short-selling restrictions, foreign access routes (e.g. Stock Connect for mainland China).
- **Index comparison:** how many companies, weighting method, provider, major sectors.
- **Developed vs emerging vs frontier** classification (MSCI/FTSE definitions, "as of" dates).
- **World map** (SVG): click a country, open its page; color by region or by market size.
- **"Compare two countries" tool:** pick two countries and see side-by-side facts.

---

## 7. Trading Times (tool + lessons)

Use the browser `Intl` API or `luxon` for time zones so DST is handled correctly. Default zone: Europe/Vienna, with a selector.

### Exchange data (local time; **verify each on the official exchange site before publishing, and link to it**)

| Exchange | Time zone | Regular hours (local) | Notes (verify) |
|---|---|---|---|
| Wiener Börse | Europe/Vienna | 09:00 - 17:30 | closing auction near the end |
| Xetra (Frankfurt) | Europe/Berlin | 09:00 - 17:30 | |
| SIX Swiss Exchange | Europe/Zurich | 09:00 - 17:30 | |
| London Stock Exchange | Europe/London | 08:00 - 16:30 | |
| Euronext (Paris, Amsterdam...) | Europe/Paris | 09:00 - 17:30 | |
| NYSE / Nasdaq | America/New_York | 09:30 - 16:00 | pre-market about 04:00 - 09:30, after-hours about 16:00 - 20:00 |
| Toronto (TSX) | America/Toronto | 09:30 - 16:00 | |
| Tokyo (JPX) | Asia/Tokyo | 09:00 - 15:30 | lunch break 11:30 - 12:30; closing time changed to 15:30 in Nov 2024 |
| Hong Kong (HKEX) | Asia/Hong_Kong | check official | hours and lunch break have changed recently, verify |
| Shanghai / Shenzhen | Asia/Shanghai | 09:30 - 11:30 and 13:00 - 15:00 | |
| India (NSE/BSE) | Asia/Kolkata | 09:15 - 15:30 | |
| Korea Exchange | Asia/Seoul | 09:00 - 15:30 | |
| Singapore (SGX) | Asia/Singapore | check official | |
| ASX (Sydney) | Australia/Sydney | about 10:00 - 16:00 | staggered opening by letter, verify |
| B3 (Brazil), JSE, Tadawul, Borsa Istanbul, TASE, others | their zones | **research from official sites** | |

### Features
1. **Live status:** every exchange shows Open / Closed / Pre-market / After-hours / Lunch break / Holiday, with a countdown to the next change, based on the visitor's current time.
2. **24-hour timeline bar:** all markets on one chart in the visitor's time zone, showing overlaps. Highlight Europe-US overlap.
3. **Time zone selector** and a **"Convert a market time"** tool.
4. **Holiday calendars** for each exchange for the current and next year (from official calendars; mark source and date). Also **early-close days**.
5. **DST explainer:** US and Europe switch on different dates, so for a few weeks per year the Vienna-New York gap changes (normally NYSE 09:30 - 16:00 ET = 15:30 - 22:00 in Vienna). Show the actual dates for the current year, computed in code, never hard-coded.
6. **"When can I trade what?" helper:** pick your time zone and see which markets are open during your free hours (e.g. after work).
7. **Lessons:** opening and closing auctions, why volatility is highest at open/close, what happens at lunch breaks, after-hours risks (low liquidity, wide spreads), triple witching, index rebalancing days.
8. **Unit tests** that simulate DST transitions, weekends, holidays, and lunch breaks.

---

## 8. Quiz System

### 8.1 Quiz hub structure
- **Per category:** one quiz for each of the 22 categories (A-W).
- **Per subtopic:** short 5-question mini-quizzes after each lesson.
- **Per country:** one quiz for every country page.
- **Special quizzes:** Glossary Quiz, Trading Times Quiz, "How Stocks Are Made" Quiz, Scam Spotter Quiz, Taxes Quiz (Austria), Calculation Quiz (maths of investing), Chart Reading Quiz, "True or Myth?" Quiz, Timeline/History Quiz, World Markets Matching Game.
- **MEGA QUIZ ("Everything"):** randomly drawn from all categories, selectable length (20 / 50 / 100 questions), optional filter by level, and a **Final Exam** (100 questions, timed, pass mark 80%) that unlocks a printable **certificate of completion** (clearly "for fun / self-assessment, not an official qualification").
- **Custom quiz builder:** choose categories + level + number of questions + mode.
- **Daily quiz** (5 random questions, streak counter).

### 8.2 Modes and features
- **Practice mode:** instant feedback and explanation after every question, hints, link to the lesson.
- **Exam mode:** no feedback until the end, optional timer.
- **Review mode:** retry only wrong answers; **Weak-spot mode:** automatically picks questions from categories where the user scores lowest; simple **spaced repetition** (questions answered wrong reappear sooner).
- **Flashcards mode** for glossary and key facts.
- Question types: multiple choice, multiple select, true/false, fill-in number (calculations, with tolerance), match-the-pairs, order-the-steps (e.g. the IPO steps), "which chart/candlestick is this?", "spot the scam" scenarios, map clicks ("click the country with the Nikkei 225").
- Randomize question and answer order. Never show the same question twice in a row.
- **Results screen:** score, percent, time, per-category breakdown (bar chart), weak topics, links back to lessons, "retry wrong answers" button, share-less (no social tracking).
- **Progress and badges** in localStorage: "First Quiz", "Perfect Score", "Category Master" (80%+ in a category), "World Traveler" (all country quizzes), "Scam Spotter", "Founder" (How Stocks Are Made), "Streak 7", "Exam Passed".
- **Content size target:** at least **25 questions per category** (550+), **10 per country** (200+), plus special quizzes: **total 900+ questions**, mixed difficulty (about 40% beginner, 40% intermediate, 20% advanced). Every question needs a clear explanation and a `lessonLink`.
- Add a **"Report a mistake"** link on each question (opens a prefilled email/GitHub issue, no tracking).

### 8.3 Question JSON format (`/content/quizzes/<category>.json`)

```json
{
  "id": "D-017",
  "category": "D",
  "topic": "settlement",
  "difficulty": "intermediate",
  "type": "multiple_choice",
  "question": "What does 'T+1 settlement' mean?",
  "options": [
    "The trade is final one business day after the trade date",
    "The trade is final one hour after the trade date",
    "Only one trade per day is allowed",
    "The trade costs one percent more"
  ],
  "answerIndex": 0,
  "explanation": "Settlement is the actual exchange of money and shares. T is the trade date; T+1 means one business day later.",
  "lessonLink": "/learn/D/settlement",
  "sources": ["https://..."],
  "lastReviewed": "2026-10"
}
```

Other types use the same shape with `answers` (multiple select), `answerBool`, `answerNumber` + `tolerance`, `pairs` (matching), `orderedItems` (ordering).

### 8.4 Starter questions (Claude Code must write hundreds more in the same style, accurate and sourced)

**A Foundations**
1. If a company has 1,000 shares and you own 25, what percent do you own? (2.5%) - beginner
2. Which comes first when a company goes bankrupt: shareholders or lenders? (Lenders) - intermediate
3. True or false: "The stock market" is one physical place. (False) - beginner

**B How Stocks Are Made**
1. Order these: found company, seed round, Series A, IPO, first day of trading. - beginner
2. Primary vs secondary shares in an IPO: who receives the money? (Primary: the company; secondary: the selling shareholders) - intermediate
3. What is a lock-up period? (Time after an IPO when insiders may not sell) - intermediate
4. What is a greenshoe option? (Option for underwriters to sell extra shares and stabilize the price) - advanced
5. An investor pays €1m for a company valued at €4m before the investment. What percent does the investor get? (20%) - intermediate
6. What is a SPAC? (A shell company that lists first and then merges with a private company) - intermediate

**C Types**
1. Which share type usually has no voting rights but priority dividends? (Preferred) - beginner
2. What does a REIT invest in? (Real estate) - beginner

**D Market Structure**
1. What is the spread? (Difference between best bid and best ask) - beginner
2. What does a CSD do? (Holds securities in electronic form and records ownership) - intermediate
3. What is a circuit breaker? (A temporary trading halt after large price moves) - intermediate

**E Trading Times**
1. NYSE opens at 09:30 New York time. What is that in Vienna in a normal week? (15:30) - intermediate
2. Which two major markets overlap most with the European session? (US and parts of Asia early morning) - beginner
3. Why can after-hours trading be riskier? (Lower liquidity and wider spreads) - beginner

**F Brokers & Orders**
1. A buy limit order at €50 can execute at which prices? (€50 or lower) - beginner
2. What does a stop-loss order do? (Triggers a sale if the price falls to a set level) - beginner

**G Money & Costs**
1. A €200 share pays €6 dividends per year. Dividend yield? (3%) - beginner
2. You buy at €80, sell at €100, fees total €4, per share. Profit before tax? (€16) - beginner
3. If a stock falls 50%, what gain is needed to get back to even? (100%) - intermediate

**H Indexes & ETFs**
1. Which index tracks Japan's 225 large companies? (Nikkei 225) - beginner
2. What does TER stand for? (Total Expense Ratio) - beginner
3. Why are leveraged ETFs risky for long-term holding? (Daily reset and compounding effects can cause large losses) - advanced

**I Fundamental Analysis**
1. EPS is €2 and the share price is €40. P/E? (20) - beginner
2. Which statement shows whether a company earned a profit over a period? (Income statement) - beginner

**J Technical Analysis & Chart Reading** (also used for the Chart Reading Quiz; many of these should use generated chart images)
1. What four prices does a candlestick show? (Open, high, low, close) - beginner
2. What is a 50-day moving average? (Average closing price of the last 50 days) - beginner
3. What does the thin line above or below a candle's body (the wick) show? (The high or low reached beyond the open/close range) - beginner
4. A candle opens at 100 and closes at 104 on a standard green-up chart. What color is it and what does it mean? (Green; buyers ended the period higher than it began) - beginner
5. What does a doji suggest? (Indecision: open and close were about equal) - beginner
6. A candle has a small body and a very long lower wick after a downtrend. What is it commonly called? (A hammer) - intermediate
7. What is the difference between a hammer and a hanging man? (Same shape; the hammer appears after a downtrend, the hanging man after an uptrend) - intermediate
8. What is a bullish engulfing pattern? (A large up candle whose body fully covers the previous down candle's body) - intermediate
9. What does a marubozu candle show? (Strong one-sided momentum: a full body with little or no wicks) - intermediate
10. What defines an uptrend? (Higher highs and higher lows) - beginner
11. What is a "golden cross"? (The 50-day moving average crossing above the 200-day moving average) - intermediate
12. An RSI reading above 70 is conventionally called what? (Overbought; it does not guarantee a fall) - intermediate
13. Why use a logarithmic scale on a long-term chart? (Equal percentage moves look equal in size) - intermediate
14. On a daily chart, what does one candle represent? (One trading day) - beginner
15. What is a Heikin Ashi candle? (A smoothed candle calculated from averaged prices, so it does not show the real open/close) - advanced
16. What does a ticker like `NASDAQ:AAPL` on a charting platform tell you? (The exchange and the symbol) - beginner
17. What does "replay mode" on a charting platform do? (Plays past candles bar by bar so you can practice) - beginner
18. What is Pine Script used for in TradingView? (Writing custom indicators and strategies) - intermediate
19. True or false: a candlestick pattern guarantees the next move. (False; patterns are probabilities, not promises) - beginner
20. What is a false breakout? (Price breaks a level but quickly returns, trapping early buyers or sellers) - intermediate
21. Why do traders check higher timeframes first? (They give more reliable trend and context) - intermediate
22. What is VWAP? (Volume-weighted average price, mostly used for intraday trading) - advanced

**K History**
1. Which year had the "Black Monday" crash? (1987) - intermediate
2. What was the 2008 crisis mainly triggered by? (US housing/mortgage-related financial crisis) - intermediate

**L Macro**
1. When central banks raise interest rates, what often happens to bond prices? (They fall) - intermediate
2. If the euro rises against the US dollar, what happens to a European investor's US stock returns, all else equal? (They fall in euro terms) - advanced

**M Strategies**
1. What is dollar-cost averaging? (Investing equal amounts at regular intervals) - beginner
2. What does diversification reduce? (Company-specific risk) - beginner

**N Trading & Derivatives**
1. In short selling, what is the maximum possible loss? (Theoretically unlimited) - intermediate
2. You use 5x leverage and the price drops 20%. What happens? (You lose 100% of your invested capital) - advanced

**O Psychology**
1. What is FOMO? (Fear of missing out) - beginner
2. What is loss aversion? (Losses feel stronger than equal gains) - intermediate

**P Risk**
1. What does "drawdown" mean? (A decline from a peak to a trough) - intermediate
2. Which risk is reduced by owning stocks from many countries? (Concentration/country risk) - beginner

**Q Taxes (Austria)**
1. What is the KESt rate on stock gains and dividends in Austria? (27.5%) - beginner
2. Who usually withholds KESt for an Austrian investor? (The Austrian bank/broker holding the Depot) - beginner

**R Regulation**
1. What is insider trading? (Trading on non-public price-relevant information) - beginner
2. Which Austrian authority supervises financial markets? (FMA) - beginner

**S World Markets**
1. Which index is the main index of Switzerland? (SMI) - beginner
2. In China, what are "A-shares"? (Shares of mainland companies listed in Shanghai/Shenzhen, traded in yuan) - intermediate

**T Scams**
1. Which is a major red flag? (Guaranteed high returns) - beginner
2. What is a pump-and-dump? (Hyping a cheap stock, then selling to buyers before the price collapses) - beginner

**U Other Assets**
1. Which usually has the higher long-term risk: stocks or government bonds? (Stocks) - beginner

**V Corporate Actions**
1. In a 2-for-1 stock split, what happens to the share price, all else equal? (It halves) - beginner
2. What is the ex-dividend date? (The first day the stock trades without the right to the upcoming dividend) - intermediate

**W Tools**
1. Which official US database holds company filings? (SEC EDGAR) - beginner

---

## 9. YouTube Video Library

### 9.1 Requirements
- Every category (A-W), every major lesson, and every country page should have **1-3 good videos**.
- Each video entry: `id` (YouTube video ID), `title`, `channel`, `categories`, `level`, `durationMinutes`, `language`, `whyGood` (one sentence), `lastChecked`.
- **Quality rules:** educational, accurate, neutral. Prefer established educators, universities, public broadcasters, regulators, exchanges. **No** "get rich quick", no stock tips, no affiliate/sponsored broker promotion, no crypto hype, no clickbait. Prefer videos under 25 minutes for beginners; longer lectures are fine for advanced.
- **Verify every link works** before shipping. Write a script (`scripts/check-videos.js`) that calls `https://www.youtube.com/oembed?url=<video url>&format=json` for each entry, fails if a video is gone or the title is very different, and prints a report. Run it in the build.
- **Privacy:** embed with `youtube-nocookie.com` and a **click-to-load placeholder** (thumbnail + "Click to load video; this connects to YouTube"). Always also show a plain link "Watch on YouTube".
- Show the **channel name** and add a note: "External videos; we do not control their content; not financial advice."
- Videos page: filter by category, level, language, length.
- If a good video cannot be confirmed, do **not** invent a link: show a **"Search YouTube for this topic"** button using `https://www.youtube.com/results?search_query=<encoded query>` instead.

### 9.2 Starting list
Status **CONFIRMED** = link or title was found in a web search while preparing this brief (still re-verify with the checker). Status **CANDIDATE** = a well-known video or channel to look up; **Claude Code must find the exact URL, verify it, and pick the best version**.

| Category | Video / channel | Status | Link or search |
|---|---|---|---|
| A Foundations | TED-Ed: "How does the stock market work?" | CONFIRMED | https://youtu.be/p7HKvqRI_Bo |
| A Foundations | Khan Academy: "What it means to buy a company's stock" | CANDIDATE | channel: https://www.youtube.com/channel/UCQ1Rt02HirUvBK2D2-ZO_2g |
| A Foundations | Khan Academy: "Bonds vs stocks" | CANDIDATE | same channel |
| A / D | Netflix / Vox: "Explained: The Stock Market" (full episode) | CANDIDATE | search: `Explained The Stock Market Netflix full episode` |
| A / D | Common Craft: "Stock Markets in Plain English" | CANDIDATE | page: https://www.commoncraft.com/node/5600 (find the YouTube upload) |
| B How Stocks Are Made | CNBC: "What is an IPO? \| CNBC Explains" | CANDIDATE | search: `What is an IPO CNBC Explains` |
| B How Stocks Are Made | Best 2-3 videos on IPO process, bookbuilding, direct listing, SPAC | CANDIDATE | search: `IPO process explained bookbuilding underwriter`, `direct listing vs IPO explained`, `how SPACs work explained` |
| B How Stocks Are Made | Venture rounds, cap table, dilution explained | CANDIDATE | search: `cap table dilution explained seed series A` |
| C Types | Preferred vs common stock; ADR explained | CANDIDATE | search: `preferred vs common stock explained`, `what is an ADR explained` |
| D Market Structure | How an order book / matching engine works; settlement and clearing | CANDIDATE | search: `how an order book works explained`, `clearing and settlement explained DTCC` |
| E Trading Times | Pre-market and after-hours trading explained | CANDIDATE | search: `pre-market after-hours trading explained risks` |
| F Brokers & Orders | Order types explained (market, limit, stop) | CANDIDATE | search: `market order limit order stop order explained` |
| G Money & Costs | Dividends, ex-dividend date explained | CANDIDATE | search: `ex-dividend date explained` |
| H Indexes & ETFs | Ben Felix (evidence-based index investing); also Rational Reminder podcast | CANDIDATE | channel: https://www.youtube.com/@benfelixcsi (pick beginner-friendly index fund / ETF videos) |
| H Indexes & ETFs | German-language ETF/investing basics (Finanzfluss) | CANDIDATE | search: `Finanzfluss ETF erklärt` (for the German version later) |
| I Fundamental | Khan Academy: "Introduction to the income statement" and balance sheet videos | CANDIDATE | Khan channel above |
| I Fundamental | Valuation lectures by Prof. Aswath Damodaran (NYU) for advanced learners | CANDIDATE | search: `Aswath Damodaran valuation lecture` |
| J Technical | Candlestick charts explained for beginners (anatomy, doji, hammer, engulfing) from an educational channel | CANDIDATE | search: `how to read candlestick charts beginners`, `candlestick patterns explained doji hammer engulfing` (avoid hype channels) |
| J Technical | Support, resistance, trends, breakouts | CANDIDATE | search: `support and resistance explained`, `market structure higher highs higher lows explained` |
| J Technical | Indicators: moving averages, RSI, MACD, Bollinger Bands | CANDIDATE | search: `moving average RSI MACD explained beginners`, `Bollinger Bands explained` |
| J Technical | Beginner tutorial: how to use TradingView (interface, drawing tools, indicators, alerts, replay) | CANDIDATE | search: `TradingView tutorial for beginners`; prefer the platform's official channel or a reputable educator; verify the video is current because the interface changes; no affiliate links |
| J Technical | Honest view: does technical analysis work? (research-based, balanced) | CANDIDATE | search: `does technical analysis work evidence` (prefer academic or well-known evidence-based educators) |
| K History | 1929 crash, 1987 Black Monday, 2008 crisis explained | CANDIDATE | search: `1929 stock market crash explained`, `2008 financial crisis explained` |
| L Macro | Interest rates and stocks; how central banks work | CANDIDATE | search: `how interest rates affect stock market explained` |
| M Strategies | Dollar-cost averaging vs lump sum; asset allocation | CANDIDATE | search: `dollar cost averaging vs lump sum explained` |
| N Trading | Short selling basics; Khan Academy "Basic shorting"; GameStop short squeeze explained | CANDIDATE | Khan channel; search: `GameStop short squeeze explained` |
| N Trading | Options basics (calls and puts) from an educational source | CANDIDATE | search: `options basics calls puts explained beginners` |
| O Psychology | Behavioral finance: loss aversion, herd behavior | CANDIDATE | search: `behavioral finance loss aversion explained` |
| P Risk | Risk, volatility, diversification explained | CANDIDATE | search: `diversification risk volatility explained` |
| Q Taxes | Austria: KESt, Depot, foreign broker taxes explained (German-language, official or reputable) | CANDIDATE | search: `KESt Wertpapiere Österreich erklärt Depot`; prefer official/bank educational content |
| R Regulation | Insider trading explained; what regulators do | CANDIDATE | search: `insider trading explained` |
| S World Markets | One explainer per major region (Japan, China/HK Stock Connect, India, Europe/Euronext) | CANDIDATE | search: `how Chinese stock market works A-shares H-shares`, `Stock Connect explained`, `Euronext explained` |
| T Scams | Investment scam awareness (regulators, e.g. FMA/other regulator videos; reputable scam-exposing channels) | CANDIDATE | search: `investment scam warning signs`, `fake broker scam explained` |
| U Other assets | Stocks vs bonds vs real estate comparison | CANDIDATE | search: `stocks vs bonds explained` |
| V Corporate Actions | Stock splits, buybacks, rights issues explained | CANDIDATE | search: `stock split vs reverse split explained`, `share buyback explained` |
| W Tools | How to read a stock quote page and an annual report | CANDIDATE | search: `how to read an annual report beginners` |

### 9.3 Trusted sources to prefer (when choosing videos)
Khan Academy, TED-Ed, CNBC explainers, Investopedia, Vox/Netflix Explained, Ben Felix, Aswath Damodaran (NYU), central banks and regulators' own channels, exchanges' own educational channels (e.g. Wiener Börse, Deutsche Börse, NYSE, Nasdaq, LSE, SIX), university channels, public broadcasters (ORF, ZDF, BBC, PBS). **Do not include** channels that primarily sell trading courses, signals, or broker referrals.

---

## 10. Glossary

Searchable A-Z with category filters; each entry: plain-English definition, an example, related terms, category tag, and (if useful) the German translation (e.g. "Dividendenrendite"). **Aim for 400+ terms.** Must include at least everything below, plus all terms used anywhere in the lessons:

stock/share, equity, shareholder, ticker, ISIN, WKN, market cap, free float, IPO, direct listing, SPAC, underwriter, prospectus, bookbuilding, greenshoe, lock-up, primary/secondary offering, cap table, dilution, pre-money/post-money, venture capital, ESOP, vesting, common/preferred stock, par value, bearer/registered share, ADR/GDR, REIT, blue chip, penny stock, large/mid/small-cap, growth/value/dividend/cyclical/defensive stock, sector, exchange, order book, matching engine, auction, market maker, liquidity, volume, spread, bid/ask, tick size, lot size, circuit breaker, trading halt, CCP, CSD, clearing, settlement, T+1/T+2, dark pool, MTF, OTC, broker, Depot, custodian, KYC, market/limit/stop/stop-limit/trailing-stop order, GTC, slippage, fractional share, savings plan, capital gain, dividend, ex-dividend date, yield, payout ratio, total return, compounding, inflation, real return, TER, tracking error, index, ETF, index fund, mutual fund, active/passive, accumulating/distributing, synthetic ETF, rebalancing, EPS, P/E, PEG, P/B, P/S, EV/EBITDA, ROE, ROIC, free cash flow, DCF, margin of safety, moat, balance sheet, income statement, cash flow statement, candlestick, trend, support, resistance, moving average, RSI, MACD, Bollinger Bands, volatility, beta, drawdown, Sharpe ratio, bull/bear market, correction, crash, bubble, recession, interest rate, yield curve, central bank, quantitative easing, FX risk, short selling, short squeeze, margin, leverage, margin call, option, call, put, future, CFD, certificate, warrant, diversification, asset allocation, dollar-cost averaging, value/growth/factor investing, FOMO, loss aversion, herd behavior, confirmation bias, KESt, withholding tax, capital gains tax, stamp duty, FMA, BaFin, SEC, FCA, ESMA, MiFID II, insider trading, market manipulation, pump-and-dump, ESG, greenwashing, rights issue, stock split, reverse split, buyback, spin-off, merger, takeover, squeeze-out, delisting, bankruptcy, pre-market, after-hours, triple witching, DST, A-shares/H-shares, Stock Connect, price limit, board lot, OHLC, candlestick body, wick/shadow, bullish/bearish candle, doji, spinning top, marubozu, hammer, hanging man, inverted hammer, shooting star, engulfing pattern, harami, piercing line, dark cloud cover, morning star, evening star, three white soldiers, three black crows, tweezer top/bottom, inside bar, gap, higher high/higher low, lower high/lower low, trendline, channel, breakout, false breakout (fakeout), pullback, retest, role reversal, golden cross, death cross, SMA, EMA, RSI, overbought/oversold, divergence, MACD, Bollinger Bands, squeeze, VWAP, ATR, Fibonacci retracement, Heikin Ashi, Renko, linear/logarithmic scale, timeframe, multi-timeframe analysis, adjusted price, delayed/real-time data, watchlist, alert, screener, replay mode, paper trading, Pine Script, backtest, overfitting, repainting, crosshair, drawing tools, charting platform.

Features: instant search, A-Z bar, category filter, deep links (`/glossary#limit-order`), hover/tap preview anywhere in lessons (auto-link glossary terms in lesson text), "Term of the day".

---

## 11. Calculators & Interactive Tools

1. Profit/loss calculator (fees, % return, and an Austrian KESt estimate, labeled "estimate only").
2. Dividend yield and payout ratio calculator.
3. P/E, EPS, P/B calculator.
4. Compound growth calculator with chart (also show a bad-years scenario and inflation-adjusted view; warn returns are not guaranteed).
5. Savings plan (Sparplan) simulator with fees.
6. Position size and risk calculator (account size, risk %, entry, stop).
7. Break-even calculator (including spreads and fees).
8. Leverage and margin simulator (shows how losses are magnified, margin call level).
9. Stock split / reverse split / rights issue calculator.
10. Cap table and dilution simulator (section 5).
11. IPO pricing and bookbuilding simulator (section 5).
12. Currency effect calculator (US stock return for a euro investor).
13. Time-zone and market-hours converter (section 7).
14. Candlestick builder: enter open/high/low/close, see the candle.
15. Paper-trading game with fake money and **historical or simulated** prices (clearly labeled as a game; no real-time data needed; optional for v2).
16. Country comparison tool (section 6).
17. **Chart Lab** (section 4.1): interactive chart sandbox with candlesticks, indicators, drawing tools, replay mode, and the "reveal the next candle" game, using simulated or license-verified data.
18. **Candlestick Encyclopedia** (section 4.1): searchable card for every pattern, with an original SVG and a live example in the Chart Lab.
19. **Indicator playground:** change the length of a moving average / RSI / Bollinger Bands on sample data and watch how the indicator changes (shows lag and noise).
20. **Support/resistance trainer:** click on a generated chart to mark zones and get feedback (educational, no trading advice).

All calculations in testable pure functions, with unit tests and shown formulas.

---

## 12. History Timeline (`/history`)

Interactive scrollable timeline with sources: ancient/medieval trade finance; Dutch East India Company (VOC) 1602 and the Amsterdam exchange; early bubbles (clearly distinguishing myth from fact, e.g. Tulip mania); South Sea Bubble 1720; Buttonwood Agreement 1792 and the NYSE (named 1817); Vienna exchange history (Wiener Börse founding, verify date and facts); telegraph and ticker tape; 1929 crash and the Great Depression; creation of the SEC (1934); post-war growth; first index funds (1970s); Black Monday 1987; electronic trading and Nasdaq; dot-com bubble 2000; decimalization; 2008 financial crisis; high-frequency trading and the 2010 flash crash; commission-free brokers and the 2021 retail boom/GameStop; COVID crash 2020; rate shock 2022; T+1 settlement 2024; more recent events (Claude Code should check for up-to-date milestones). Each item: date, what happened, why it matters, lesson learned, source.

---

## 13. Scam Shield (see category T)

- Red-flag checklist (interactive, scores a "scam likelihood" for a described offer; explanatory only).
- "How to verify a broker" step-by-step (check the regulator's register, license number, warning lists, domain age, contact details, withdrawal tests; never install remote-access software for a stranger).
- "Spot the scam" scenarios (screenshots recreated as text/UI, fictional).
- "What to do if you have been scammed" (stop payments, contact your bank, report to police and the regulator).
- Official links: FMA (fma.gv.at), Austrian consumer protection (AK, VKI), ESMA, national regulators, IOSCO I-SCAN, police.

---

## 14. Design & UX

- Calm, trustworthy, modern look (deep blue/teal + light background; readable font; generous spacing). Dark mode.
- Category cards with icons and progress rings; each category page: intro, lesson list, videos, quiz button, related glossary terms.
- Visuals (SVG/Canvas, original, no copyrighted images): ownership pie, IPO timeline, order book animation, candlestick anatomy, ETF structure, yield/price relationships, 24h market bar, world map.
- Callout boxes: Example, Key takeaway, Beginner mistake, Warning, Austria note, "Verify this" note.
- Lesson pages: reading time, table of contents, previous/next, bookmark, "mark as done", "take the quiz" button, "listen" option (browser text-to-speech) optional.
- Gamification (light): progress %, badges, streaks, never pressuring users to trade.
- Accessibility: keyboard navigation, screen-reader labels, color-blind-safe charts, respects reduced motion.

---

## 15. Legal & Safety Pages

**Disclaimer (footer + About):**
> Stockora Academy is for education only. It is not an accredited school or a regulated financial service. It does not provide investment, tax, or legal advice, and nothing here is a recommendation to buy or sell any security. Investing involves risk, including the loss of all invested money. Past performance does not guarantee future results. Tax rules, exchange hours, and regulations change; always check official sources and consider a licensed advisor. External videos and links are provided for convenience; we do not control their content.

Also create: **Privacy Policy** (no tracking; YouTube loads only on click), **Sources & Methodology** page (how content is researched and reviewed, with "last reviewed" dates), **Corrections** page. Add an **Impressum** page placeholder (the site owner is in Austria; website publishers there commonly need one; the owner must check the exact legal requirements and fill in real details; do not invent names/addresses).

---

## 16. Build Plan (phases; stop and show me after each)

1. **Plan:** propose stack, folder structure, content schema, and a short plan. The name is decided (Stockora Academy, see 0.1); ask me about colors, logo choice, and hosting.
2. **Foundation:** layout, navigation, dark mode, search, legal pages, content loader.
3. **Content engine:** lesson renderer, glossary auto-linking, progress tracking, bookmarks.
4. **Categories A-H** lessons (write real, accurate content with sources) + videos + category quizzes.
5. **"How Stocks Are Made"** interactive page + simulators + quiz.
6. **Trading Times** tool with exchange data, holidays, DST tests.
7. **Categories I-W** lessons + videos + quizzes. This includes the **Chart School** (section 4.1): lessons 1-9, the Candlestick Encyclopedia, the Chart Lab, and the Chart Reading Quiz. Build the Chart Lab as its own sub-phase and show it to me before moving on.
8. **World Markets:** country template, 20+ country pages, comparison tables, map, country quizzes.
9. **Quiz hub:** all modes (practice, exam, weak-spot, daily, mega quiz, final exam, certificate), badges, results screens.
10. **Video library** page + `check-videos.js` + click-to-load embeds.
11. **Calculators/tools**, history timeline, scam shield.
12. **Polish:** accessibility, performance, SEO (sitemap, meta, structured data), README, deployment.

Content can be written in batches: for each category, write lessons, then 25+ quiz questions, then add videos, then glossary entries.

---

## 17. Rules for Claude Code

1. **Accuracy first.** Use official sources (exchanges, regulators, ministries, central banks, official statistics). Add `sources` and `lastReviewed` to every factual page. Facts marked "(verify)" in this brief are not confirmed. If you cannot verify something, say so on the page or leave it out; never invent numbers, dates, tax rates, hours, or links.
2. **No advice.** No recommendations of specific stocks, funds, brokers, apps, or crypto. Describe criteria, not products. No affiliate links. **Exception:** TradingView may be described in the Chart School as an example of a charting platform (what it does and how it works), neutrally and with a "verify on the official site" link; no recommendation of a plan, no affiliate links, no copied logos or screenshots.
3. **Time-sensitive data** (hours, holidays, taxes, settlement rules, market sizes) must be in data files with "as of" dates and shown with a "verify on the official site" link.
4. **Copyright:** write all lessons in your own words; do not copy text from books, sites, or videos; use original diagrams; quote only briefly with attribution.
5. **Keep content editable** in `/content` without touching code. Document how in the README.
6. Write **tests** for calculators, time logic, and quiz scoring; run build + tests + link/video check before finishing each phase.
7. Commit in small steps with clear messages.
8. When a decision is large or something is unclear, **ask me first**.
9. Keep language beginner-friendly: define every term on first use and link the glossary.

---

## 18. Definition of Done (v1)

- [ ] 22 categories (A-W) with lessons, key takeaways, examples, and sources.
- [ ] "How Stocks Are Made" interactive page with simulators.
- [ ] At least 20 country pages + comparison tables + map.
- [ ] Trading Times tool with live status, timeline, holidays, DST-safe, tested.
- [ ] 900+ quiz questions: every category, every country, special quizzes, mega quiz, final exam, daily quiz, weak-spot mode.
- [ ] 1-3 verified YouTube videos per category (privacy-friendly embeds), all checked by script.
- [ ] 400+ glossary terms with auto-linking.
- [ ] Calculators and tools (section 11).
- [ ] Chart School: 9 chart-reading lessons, Candlestick Encyclopedia, "how TradingView-style platforms work" lesson, working Chart Lab (candles, indicators, drawing tools, replay, prediction game), Chart Reading Quiz, 6+ verified videos.
- [ ] History timeline and Scam Shield.
- [ ] Legal pages, disclaimer on every page, no tracking.
- [ ] Accessible, responsive, fast (Lighthouse 90+), README and deployment instructions.
