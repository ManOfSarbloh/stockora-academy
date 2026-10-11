import type { UiKey } from '@/i18n';

export interface NavItem {
  href: string;
  label: UiKey;
}

/** Shown directly in the header on wide screens. */
export const primaryNav: NavItem[] = [
  { href: '/learn', label: 'nav.learn' },
  { href: '/how-stocks-are-made', label: 'nav.howStocksAreMade' },
  { href: '/world', label: 'nav.world' },
  { href: '/times', label: 'nav.times' },
  { href: '/charts', label: 'nav.charts' },
  { href: '/quizzes', label: 'nav.quizzes' },
];

/** Grouped under "More" in the header. */
export const secondaryNav: NavItem[] = [
  { href: '/videos', label: 'nav.videos' },
  { href: '/glossary', label: 'nav.glossary' },
  { href: '/tools', label: 'nav.tools' },
  { href: '/history', label: 'nav.history' },
  { href: '/scams', label: 'nav.scams' },
  { href: '/me', label: 'nav.me' },
];

export const legalNav: NavItem[] = [
  { href: '/about', label: 'footer.about' },
  { href: '/disclaimer', label: 'footer.disclaimer' },
  { href: '/privacy', label: 'footer.privacy' },
  { href: '/sources', label: 'footer.sources' },
  { href: '/corrections', label: 'footer.corrections' },
  { href: '/impressum', label: 'footer.impressum' },
];

/**
 * Where "Report a mistake" links go. Set `githubRepo` (e.g. "owner/stockora-academy") once the
 * repository exists; until then the links point to the Corrections page.
 */
export const reportConfig = {
  githubRepo: null as string | null,
};

/** Planned sections that are not built yet: shown on their placeholder pages. */
export interface PlannedSection {
  title: string;
  lead: string;
  planned: string[];
}

export const plannedSections: Record<string, PlannedSection> = {
  'how-stocks-are-made': {
    title: 'How Stocks Are Made',
    lead: 'The full journey of a share, from an idea to a listed company, step by step.',
    planned: [
      'Nine interactive steps, from founding a company to how shares disappear',
      'Austria and US examples side by side',
      'Cap table and dilution simulator',
      'IPO bookbuilding simulator',
      '"Build your own company" mini-game (play money only)',
    ],
  },
  world: {
    title: 'World Markets',
    lead: 'Stock markets country by country: exchanges, indexes, regulators, hours, rules and taxes.',
    planned: [
      'Country pages for at least 20 markets, starting with Austria',
      'Clickable world map',
      'Sortable comparison tables',
      '"Compare two countries" tool',
    ],
  },
  times: {
    title: 'Trading Times',
    lead: 'Which stock markets are open right now, shown in your own time zone.',
    planned: [
      'Live open / closed / lunch break status with countdowns',
      '24-hour timeline showing market overlaps',
      'Time zone converter and holiday calendars',
      'Daylight saving time explainer, with this year’s dates calculated automatically',
    ],
  },
  charts: {
    title: 'Chart School',
    lead: 'How to read price charts and candlesticks, and how charting platforms work.',
    planned: [
      'Nine chart-reading lessons',
      'Candlestick Encyclopedia',
      'Chart Lab: an interactive chart sandbox with simulated data',
      '"Reveal the next candle" game and Chart Reading Quiz',
    ],
  },
  quizzes: {
    title: 'Quizzes',
    lead: 'Test what you have learned, topic by topic or across everything.',
    planned: [
      'A quiz for every topic and every country',
      'Practice, exam, review and weak-spot modes',
      'Daily quiz with streaks, and a Mega Quiz',
      'Final Exam with a printable just-for-fun certificate',
    ],
  },
  videos: {
    title: 'Videos',
    lead: 'Hand-picked educational videos for every topic.',
    planned: [
      'Videos filterable by topic, level, language and length',
      'Privacy-friendly: videos load only after you click',
      'Every link checked automatically',
    ],
  },
  tools: {
    title: 'Tools',
    lead: 'Calculators and simulators that show the maths behind investing.',
    planned: [
      'Profit/loss, dividend, P/E and break-even calculators',
      'Compound growth and savings plan simulators',
      'Position size, leverage and currency effect calculators',
      'Candlestick builder',
    ],
  },
  history: {
    title: 'History',
    lead: 'A timeline of stock markets, from the first shares to today.',
    planned: ['Interactive timeline with sources', 'Famous crashes and what we learned from them', 'Myth vs fact (for example, Tulip mania)'],
  },
  scams: {
    title: 'Scam Shield',
    lead: 'Learn the red flags of investment fraud and how to check who you are dealing with.',
    planned: [
      'Interactive red-flag checklist',
      'How to verify a broker, step by step',
      '"Spot the scam" game',
      'What to do if you have been scammed',
    ],
  },
};
