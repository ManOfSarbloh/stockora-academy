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
