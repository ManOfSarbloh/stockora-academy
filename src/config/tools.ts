/**
 * Every tool on the site, in hub order. Calculators live at /tools/<slug>; the other entries link to
 * tools that already have their own page (Trading Times, Chart Lab, …).
 */
export type ToolGroup = 'money' | 'company' | 'risk' | 'markets' | 'charts';

export interface ToolSource {
  title: string;
  url: string;
}

export interface Tool {
  slug: string;
  group: ToolGroup;
  icon: string;
  /** External page for tools that already exist elsewhere on the site. */
  href?: string;
  /** Lesson keys ("<topic-slug>/<lesson-slug>") shown as "Learn more". */
  lessons: string[];
  /** Official sources for the rules a calculator applies (tax rates, regulatory limits). */
  sources?: ToolSource[];
}

const BMF_GAINS: ToolSource = {
  title: 'Substanzgewinne bzw. Einkünfte aus realisierten Wertsteigerungen (BMF, in German)',
  url: 'https://www.bmf.gv.at/themen/steuern/sparen-veranlagen/substanzgewinne-bzw-einkuenfte-aus-realisierten-wertsteigerungen.html',
};
const ESTG_27A: ToolSource = { title: '§ 27a EStG: special tax rates (JUSLINE, in German)', url: 'https://www.jusline.at/gesetz/estg/paragraf/27a' };

export const TOOLS: Tool[] = [
  {
    slug: 'profit-loss',
    group: 'money',
    icon: '💶',
    lessons: ['returns-and-costs/capital-gains-and-losses', 'taxes/gains-and-cost-basis', 'taxes/austria-kest-overview'],
    sources: [BMF_GAINS, ESTG_27A],
  },
  { slug: 'break-even', group: 'money', icon: '⚖️', lessons: ['returns-and-costs/break-even-and-small-trades', 'returns-and-costs/investment-costs'] },
  { slug: 'compound-growth', group: 'money', icon: '📈', lessons: ['returns-and-costs/compound-growth', 'returns-and-costs/inflation-and-real-returns'] },
  { slug: 'savings-plan', group: 'money', icon: '🗓️', lessons: ['investing-strategies/savings-plans-and-lump-sums', 'brokers-accounts-orders/savings-plans-and-lending', 'returns-and-costs/investment-costs'] },
  { slug: 'currency', group: 'money', icon: '💱', lessons: ['macroeconomics/currencies-and-your-investments'] },
  {
    slug: 'dividends',
    group: 'company',
    icon: '🪙',
    lessons: ['returns-and-costs/dividend-yield-and-payout-ratio', 'returns-and-costs/dividends-and-key-dates', 'taxes/dividends-and-withholding-tax'],
    sources: [ESTG_27A],
  },
  { slug: 'valuation-ratios', group: 'company', icon: '🔍', lessons: ['fundamental-analysis/valuation-ratios', 'fundamental-analysis/income-statement', 'fundamental-analysis/balance-sheet'] },
  {
    slug: 'splits-and-rights',
    group: 'company',
    icon: '✂️',
    lessons: ['corporate-actions/splits-and-bonus-shares', 'corporate-actions/capital-increases-and-rights-issues'],
    sources: [{ title: '§ 153 AktG: Bezugsrecht (JUSLINE, in German)', url: 'https://www.jusline.at/gesetz/aktg/paragraf/153' }],
  },
  { slug: 'cap-table', group: 'company', icon: '🥧', lessons: ['how-stocks-are-made/cap-table-and-dilution', 'how-stocks-are-made/funding-rounds'] },
  { slug: 'ipo-bookbuilding', group: 'company', icon: '📒', lessons: ['how-stocks-are-made/ipo-process', 'how-stocks-are-made/listing-day'] },
  { slug: 'position-size', group: 'risk', icon: '📏', lessons: ['risk-management/position-sizing-and-exits', 'brokers-accounts-orders/stop-orders'] },
  {
    slug: 'leverage',
    group: 'risk',
    icon: '🎚️',
    lessons: ['trading-leverage-derivatives/leverage-and-margin', 'trading-leverage-derivatives/cfds'],
    sources: [
      {
        title: 'ESMA agrees to prohibit binary options and restrict CFDs to protect retail investors (ESMA, 27 March 2018)',
        url: 'https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors',
      },
    ],
  },
  { slug: 'trading-times', group: 'markets', icon: '🕘', href: '/times', lessons: [] },
  { slug: 'country-compare', group: 'markets', icon: '🌍', href: '/world/compare', lessons: [] },
  { slug: 'founder-game', group: 'markets', icon: '🎲', href: '/how-stocks-are-made#game', lessons: [] },
  { slug: 'candlestick-builder', group: 'charts', icon: '🕯️', lessons: ['technical-analysis/candlestick-anatomy', 'technical-analysis/single-candle-patterns'] },
  { slug: 'chart-lab', group: 'charts', icon: '🧪', href: '/charts/lab', lessons: [] },
  { slug: 'candlestick-encyclopedia', group: 'charts', icon: '📚', href: '/charts/candles', lessons: [] },
  { slug: 'chart-quiz', group: 'charts', icon: '🎯', href: '/charts/quiz', lessons: [] },
];

export const TOOL_GROUPS: ToolGroup[] = ['money', 'company', 'risk', 'markets', 'charts'];

/** Calculators that get their own page at /tools/<slug>. */
export const calculatorTools = () => TOOLS.filter((t) => !t.href);
