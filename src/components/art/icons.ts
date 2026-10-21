/**
 * Stockora's illustration set: original line icons on a 48×48 grid. Strokes use currentColor and
 * accents use the brand teal (CSS variables), so every icon follows light and dark mode.
 * Rendered by Icon.astro (inline) and HeroArt.astro (page header banner).
 */
const soft = 'fill="var(--teal)" fill-opacity=".2" stroke="none"';
const tealStroke = 'stroke="var(--teal)"';
const tealFill = 'fill="var(--teal)" stroke="none"';

export const ICONS = {
  // ---- Topics (A–W) ----
  foundations: `
    <path d="M22 11a15 15 0 1 0 15 15H22Z"/>
    <path d="M26 7a15 15 0 0 1 15 15H26Z" ${soft}/>
    <path d="M26 7a15 15 0 0 1 15 15H26Z" ${tealStroke}/>`,
  sprout: `
    <path d="M8 41h32"/>
    <path d="M24 41V22"/>
    <path d="M24 29c-8 0-12-6-12-12 7 0 12 4 12 12Z" ${soft}/>
    <path d="M24 29c-8 0-12-6-12-12 7 0 12 4 12 12Z"/>
    <path d="M24 22c0-8 5-13 12-13 0 8-5 13-12 13Z" ${soft}/>
    <path d="M24 22c0-8 5-13 12-13 0 8-5 13-12 13Z" ${tealStroke}/>`,
  certificates: `
    <path d="M16 14v-3a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3h-2"/>
    <path d="M11 20v-3a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3h-2"/>
    <rect x="6" y="20" width="26" height="19" rx="3" ${soft}/>
    <rect x="6" y="20" width="26" height="19" rx="3"/>
    <path d="M11 27h10M11 32h6"/>
    <circle cx="26" cy="31" r="2.5" ${tealStroke}/>`,
  exchange: `
    <path d="M6 18 24 8l18 10Z" ${soft}/>
    <path d="M6 18 24 8l18 10Z"/>
    <path d="M12 21v13M20 21v13M28 21v13M36 21v13"/>
    <path d="M9 37h30M7 41h34"/>`,
  clock: `
    <circle cx="24" cy="24" r="17" ${soft}/>
    <circle cx="24" cy="24" r="17"/>
    <path d="M24 13v11l7 5" ${tealStroke}/>
    <path d="M24 9v1.5M24 37.5V39M9 24h1.5M37.5 24H39"/>`,
  phone: `
    <rect x="13" y="5" width="22" height="38" rx="4"/>
    <rect x="17" y="13" width="14" height="24" rx="2" ${soft}/>
    <path d="M21 9h6"/>
    <path d="m20 24 4-5 4 5" ${tealStroke}/>
    <path d="m20 28 4 5 4-5"/>`,
  coins: `
    <path d="M7 23v13a10 4 0 0 0 20 0V23"/>
    <ellipse cx="17" cy="23" rx="10" ry="4" ${soft}/>
    <ellipse cx="17" cy="23" rx="10" ry="4"/>
    <path d="M7 28a10 4 0 0 0 20 0M7 32a10 4 0 0 0 20 0"/>
    <path d="m30 22 11-11M33 11h8v8" ${tealStroke}/>`,
  basket: `
    <path d="M16 21v-8M24 21V7M32 21v-6" ${tealStroke}/>
    <path d="M7 21h34l-4 19H11Z" ${soft}/>
    <path d="M7 21h34l-4 19H11Z"/>
    <path d="M18 27v8M24 27v8M30 27v8"/>`,
  bars: `
    <path d="M6 39 9 31h12l3 8Z"/>
    <path d="M24 39 27 31h12l3 8Z"/>
    <path d="M15 31 18 23h12l3 8Z" ${soft}/>
    <path d="M15 31 18 23h12l3 8Z" ${tealStroke}/>
    <path d="M30 12l2-4 2 4 4 1-4 2-2 4-2-4-4-2Z" ${tealFill}/>`,
  report: `
    <path d="M10 6h18l6 6v27H10Z"/>
    <path d="M28 6v6h6"/>
    <path d="M15 17h11M15 23h8"/>
    <circle cx="30" cy="31" r="7.5" ${soft}/>
    <circle cx="30" cy="31" r="7.5" ${tealStroke}/>
    <path d="m35.5 36.5 6 6" ${tealStroke}/>`,
  candles: `
    <path d="M14 9v30M24 6v26M34 13v29"/>
    <rect x="10" y="16" width="8" height="14" rx="1.5" ${soft}/>
    <rect x="10" y="16" width="8" height="14" rx="1.5"/>
    <rect x="20" y="10" width="8" height="13" rx="1.5" ${tealFill}/>
    <rect x="30" y="21" width="8" height="15" rx="1.5" ${soft}/>
    <rect x="30" y="21" width="8" height="15" rx="1.5"/>`,
  cycle: `
    <path d="M6 41h36"/>
    <path d="M6 31c6 0 8-16 14-16s8 20 14 20c4 0 6-9 8-15v21H6Z" ${soft}/>
    <path d="M6 31c6 0 8-16 14-16s8 20 14 20c4 0 6-9 8-15" ${tealStroke}/>
    <path d="m37 21 5-1 1 5" ${tealStroke}/>`,
  percent: `
    <circle cx="24" cy="24" r="17" ${soft}/>
    <circle cx="24" cy="24" r="17"/>
    <circle cx="18" cy="18" r="3.5"/>
    <circle cx="30" cy="30" r="3.5" ${tealStroke}/>
    <path d="M31 16 17 32" ${tealStroke}/>`,
  briefcase: `
    <path d="M18 16v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
    <rect x="6" y="16" width="36" height="24" rx="4" ${soft}/>
    <rect x="6" y="16" width="36" height="24" rx="4"/>
    <path d="M6 26h15M27 26h15"/>
    <rect x="21" y="23" width="6" height="6" rx="1.5" ${tealStroke}/>`,
  lever: `
    <path d="m18 41 6-9 6 9Z" ${soft}/>
    <path d="m18 41 6-9 6 9Z"/>
    <path d="M5 38 43 26"/>
    <rect x="7" y="29" width="8" height="7" rx="1.5" transform="rotate(-17.5 11 32.5)"/>
    <path d="M39 21V8M35 12l4-4 4 4" ${tealStroke}/>`,
  mind: `
    <path d="M30 42v-7h4a3 3 0 0 0 3-3v-5l3-1-4-7c0-8-6-13-13-13-9 0-14 7-14 14 0 6 3 9 5 11v11"/>
    <circle cx="23" cy="19" r="6.5" ${soft}/>
    <path d="M20 19a3 3 0 1 1 3 3v2" ${tealStroke}/>
    <circle cx="23" cy="27.5" r="1.3" ${tealFill}/>`,
  umbrella: `
    <path d="M6 24C6 14 14 8 24 8s18 6 18 16c-3-3-7-3-9 0-2-3-7-3-9 0-2-3-7-3-9 0-2-3-6-3-9 0Z" ${soft}/>
    <path d="M6 24C6 14 14 8 24 8s18 6 18 16c-3-3-7-3-9 0-2-3-7-3-9 0-2-3-7-3-9 0-2-3-6-3-9 0Z"/>
    <path d="M24 8V5M24 24v14a4 4 0 0 1-8 0"/>
    <path d="M10 33v2M36 31v2M40 37v2" ${tealStroke}/>`,
  receipt: `
    <path d="M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3Z" ${soft}/>
    <path d="M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3Z"/>
    <circle cx="19" cy="15" r="2.5" ${tealStroke}/>
    <circle cx="29" cy="25" r="2.5" ${tealStroke}/>
    <path d="M30 13 18 27" ${tealStroke}/>
    <path d="M17 33h14"/>`,
  scales: `
    <path d="M24 10v28M16 40h16M9 14h30"/>
    <circle cx="24" cy="8" r="2"/>
    <path d="M9 14 4 26M9 14l5 12M39 14l-5 12M39 14l5 12"/>
    <path d="M3 26a6 4 0 0 0 12 0Z" ${soft}/>
    <path d="M3 26a6 4 0 0 0 12 0Z" ${tealStroke}/>
    <path d="M33 26a6 4 0 0 0 12 0Z" ${soft}/>
    <path d="M33 26a6 4 0 0 0 12 0Z" ${tealStroke}/>`,
  globe: `
    <circle cx="24" cy="24" r="17" ${soft}/>
    <circle cx="24" cy="24" r="17"/>
    <ellipse cx="24" cy="24" rx="7" ry="17" ${tealStroke}/>
    <path d="M7 24h34M10 15h28M10 33h28"/>`,
  shield: `
    <path d="M24 6 39 12v11c0 9-7 16-15 19-8-3-15-10-15-19V12Z" ${soft}/>
    <path d="M24 6 39 12v11c0 9-7 16-15 19-8-3-15-10-15-19V12Z"/>
    <path d="M24 15v11" ${tealStroke}/>
    <circle cx="24" cy="32" r="1.6" ${tealFill}/>`,
  split: `
    <circle cx="11" cy="24" r="6" ${soft}/>
    <circle cx="11" cy="24" r="6"/>
    <path d="M17 24h6l7-9M23 24l7 9"/>
    <circle cx="36" cy="13" r="5" ${soft}/>
    <circle cx="36" cy="13" r="5" ${tealStroke}/>
    <circle cx="36" cy="35" r="5" ${soft}/>
    <circle cx="36" cy="35" r="5" ${tealStroke}/>`,
  news: `
    <path d="M8 9h26v27a4 4 0 0 0 4 4H12a4 4 0 0 1-4-4Z"/>
    <path d="M34 16h6v20a3 3 0 0 1-6 0"/>
    <rect x="13" y="14" width="16" height="7" rx="1.5" ${soft}/>
    <rect x="13" y="14" width="16" height="7" rx="1.5" ${tealStroke}/>
    <path d="M13 27h16M13 32h10"/>`,

  // ---- Site sections ----
  learn: `
    <path d="M4 18 24 9l20 9-20 9Z" ${soft}/>
    <path d="M4 18 24 9l20 9-20 9Z"/>
    <path d="M12 22v10c0 3 6 6 12 6s12-3 12-6V22"/>
    <path d="M44 18v10" ${tealStroke}/>`,
  quiz: `
    <rect x="9" y="5" width="30" height="38" rx="4"/>
    <path d="m14 15 3 3 5-6M14 25l3 3 5-6" ${tealStroke}/>
    <path d="M27 15h7M27 25h7M27 35h7"/>
    <rect x="14" y="32" width="6" height="6" rx="1.5" ${soft}/>
    <rect x="14" y="32" width="6" height="6" rx="1.5"/>`,
  calculator: `
    <rect x="11" y="5" width="26" height="38" rx="4"/>
    <rect x="15" y="9" width="18" height="8" rx="1.5" ${soft}/>
    <rect x="15" y="9" width="18" height="8" rx="1.5" ${tealStroke}/>
    <g fill="currentColor" stroke="none"><circle cx="18" cy="24" r="1.8"/><circle cx="24" cy="24" r="1.8"/><circle cx="30" cy="24" r="1.8"/><circle cx="18" cy="30" r="1.8"/><circle cx="24" cy="30" r="1.8"/><circle cx="18" cy="36" r="1.8"/><circle cx="24" cy="36" r="1.8"/></g>
    <rect x="28" y="28.5" width="4" height="9" rx="2" ${tealFill}/>`,
  book: `
    <path d="M24 12c-5-4-12-4-18-2v28c6-2 13-2 18 2Z" ${soft}/>
    <path d="M24 12c-5-4-12-4-18-2v28c6-2 13-2 18 2Z"/>
    <path d="M24 12c5-4 12-4 18-2v28c-6-2-13-2-18 2Z"/>
    <path d="M24 12v28"/>
    <path d="M29 17h8M29 23h8M29 29h5" ${tealStroke}/>`,
  hourglass: `
    <path d="M12 6h24M12 42h24"/>
    <path d="M15 6c0 10 9 14 9 18s-9 8-9 18M33 6c0 10-9 14-9 18s9 8 9 18"/>
    <path d="M19 13h10c-1 4-5 6-5 6s-4-2-5-6Z" ${soft}/>
    <path d="M17.5 38.5c1.5-5 6.5-7 6.5-7s5 2 6.5 7Z" ${tealFill} fill-opacity=".55"/>`,
  play: `
    <rect x="5" y="10" width="38" height="28" rx="6" ${soft}/>
    <rect x="5" y="10" width="38" height="28" rx="6"/>
    <path d="m20 18 11 6-11 6Z" ${tealFill}/>`,
  bookmark: `
    <path d="M14 6h20v36l-10-8-10 8Z" ${soft}/>
    <path d="M14 6h20v36l-10-8-10 8Z"/>
    <path d="m19 19 3.5 3.5L29 16" ${tealStroke}/>`,
  search: `
    <circle cx="21" cy="21" r="13" ${soft}/>
    <circle cx="21" cy="21" r="13"/>
    <path d="m31 31 10 10" ${tealStroke}/>
    <path d="M15 21a6 6 0 0 1 6-6"/>`,
  compare: `
    <rect x="6" y="8" width="15" height="32" rx="3" ${soft}/>
    <rect x="6" y="8" width="15" height="32" rx="3"/>
    <rect x="27" y="8" width="15" height="32" rx="3"/>
    <path d="M10 16h7M10 22h7M10 28h5M31 16h7M31 22h7M31 28h5" ${tealStroke}/>`,
  trophy: `
    <path d="M15 7h18v10a9 9 0 0 1-18 0Z" ${soft}/>
    <path d="M15 7h18v10a9 9 0 0 1-18 0Z"/>
    <path d="M15 11H9a5 5 0 0 0 6 8M33 11h6a5 5 0 0 1-6 8"/>
    <path d="M24 26v8M17 41h14M19 41l1-7h8l1 7"/>
    <path d="m24 11 1.3 2.7 3 .4-2.2 2 .5 3-2.6-1.4-2.6 1.4.5-3-2.2-2 3-.4Z" ${tealFill}/>`,
  cards: `
    <rect x="16" y="8" width="24" height="32" rx="3" transform="rotate(10 28 24)"/>
    <rect x="8" y="9" width="24" height="32" rx="3" fill="var(--surface)" stroke="none"/>
    <rect x="8" y="9" width="24" height="32" rx="3" ${soft}/>
    <rect x="8" y="9" width="24" height="32" rx="3"/>
    <path d="M14 20h12M14 26h8" ${tealStroke}/>`,
  calendar: `
    <rect x="6" y="10" width="36" height="32" rx="4"/>
    <path d="M6 19h36" />
    <path d="M15 6v8M33 6v8"/>
    <rect x="12" y="25" width="7" height="6" rx="1.5" ${soft}/>
    <rect x="12" y="25" width="7" height="6" rx="1.5" ${tealStroke}/>
    <path d="M24 28h12M12 36h24"/>`,
  map: `
    <path d="m6 12 12-5 12 5 12-5v29l-12 5-12-5-12 5Z" ${soft}/>
    <path d="m6 12 12-5 12 5 12-5v29l-12 5-12-5-12 5Z"/>
    <path d="M18 7v29M30 12v29"/>
    <circle cx="24" cy="22" r="3" ${tealFill}/>`,
} as const;

export type IconName = keyof typeof ICONS;

/** One illustration per topic (category id). */
export const TOPIC_ICONS: Record<string, IconName> = {
  A: 'foundations',
  B: 'sprout',
  C: 'certificates',
  D: 'exchange',
  E: 'clock',
  F: 'phone',
  G: 'coins',
  H: 'basket',
  U: 'bars',
  I: 'report',
  J: 'candles',
  K: 'cycle',
  L: 'percent',
  M: 'briefcase',
  N: 'lever',
  O: 'mind',
  P: 'umbrella',
  Q: 'receipt',
  R: 'scales',
  S: 'globe',
  T: 'shield',
  V: 'split',
  W: 'news',
};

export const topicIcon = (id: string): IconName => TOPIC_ICONS[id] ?? 'learn';
