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
| Logo | Pending: 3 SVG options to be shown in Phase 2 |
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

## Open items
- Logo choice: compare the options at `/brand/` (provisional: A · Slice).
- Review the draft Privacy Policy (hosting section) before going public.
- Owner to check domains, handles and trademarks (brief §0.1).
- Owner to fill in real Impressum details.
