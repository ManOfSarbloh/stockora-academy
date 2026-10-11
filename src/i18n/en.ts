// Every UI string lives here. A German dictionary (de.ts) with the same keys can be added later.
export const en = {
  'site.name': 'Stockora Academy',
  'site.shortName': 'Stockora',
  'site.tagline': 'Learn how the stock market really works.',
  'site.description':
    'A free, beginner-friendly learning site about stocks, trading and stock markets around the world. Education only, no investment advice.',

  'a11y.skipToContent': 'Skip to main content',
  'a11y.mainNav': 'Main navigation',
  'a11y.openMenu': 'Open menu',
  'a11y.closeMenu': 'Close menu',
  'a11y.home': 'Stockora Academy home',
  'a11y.footerNav': 'Footer navigation',

  'nav.learn': 'Learn',
  'nav.howStocksAreMade': 'How Stocks Are Made',
  'nav.world': 'World Markets',
  'nav.times': 'Trading Times',
  'nav.charts': 'Chart School',
  'nav.quizzes': 'Quizzes',
  'nav.videos': 'Videos',
  'nav.glossary': 'Glossary',
  'nav.tools': 'Tools',
  'nav.history': 'History',
  'nav.scams': 'Scam Shield',
  'nav.more': 'More',
  'nav.search': 'Search',

  'theme.toggle': 'Switch colour theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',

  'footer.disclaimerTitle': 'Education only',
  'footer.disclaimerShort':
    'Stockora Academy is for education only. It is not investment, tax or legal advice, and nothing here is a recommendation to buy or sell any security. Investing involves risk, including the loss of all invested money.',
  'footer.readFull': 'Read the full disclaimer',
  'footer.about': 'About',
  'footer.disclaimer': 'Disclaimer',
  'footer.privacy': 'Privacy',
  'footer.sources': 'Sources & Methodology',
  'footer.corrections': 'Corrections',
  'footer.impressum': 'Impressum',
  'footer.noTracking': 'No tracking. No cookies. No ads.',

  'home.hero.title': 'Learn how the stock market really works.',
  'home.hero.lead':
    'From your first share to stock markets around the world: free, step-by-step lessons in plain English, with quizzes, tools and an interactive chart lab.',
  'home.hero.start': 'Start here',
  'home.hero.browse': 'Browse all topics',
  'home.path.title': 'Your learning path',
  'home.path.lead':
    'A suggested order for beginners. Every topic is tagged by level, so you can also jump straight to what interests you.',
  'home.categories.title': 'All topics',
  'home.widgets.title': 'Coming soon on this page',
  'home.widgets.progress': 'Your progress',
  'home.widgets.progressBody': 'Track lessons you have finished. Saved only in your browser.',
  'home.widgets.quiz': 'Quiz of the day',
  'home.widgets.quizBody': 'Five quick questions every day, with a streak counter.',
  'home.widgets.market': 'Is the market open now?',
  'home.widgets.marketBody': 'Live open/closed status for major exchanges in your time zone.',
  'home.trust.title': 'What Stockora is, and is not',
  'home.trust.is': 'Free, independent education with sources and review dates.',
  'home.trust.isNot':
    'Not a broker, not a school, not financial advice. We never recommend stocks, funds, brokers or apps.',

  'stage.basics': 'The basics',
  'stage.basics.lead': 'What stocks are, how they are created and traded, and how you make and lose money.',
  'stage.markets': 'Understanding markets',
  'stage.markets.lead': 'How to analyse companies and charts, market history, the economy, and building a portfolio.',
  'stage.risk': 'Risk and behaviour',
  'stage.risk.lead': 'Trading and leverage, the psychology of investing, and managing risk.',
  'stage.rules': 'Rules, world and safety',
  'stage.rules.lead': 'Taxes, regulation, markets around the world, scams, company events and tools.',

  'level.beginner': 'Beginner',
  'level.intermediate': 'Intermediate',
  'level.advanced': 'Advanced',

  'learn.title': 'Learn',
  'learn.lead':
    'Everything about stocks, organised into topics. Follow the learning path or pick any topic.',
  'learn.lessons': 'Lessons',
  'learn.noLessons': 'Lessons for this topic are being written.',
  'learn.pathStep': 'Step',
  'learn.readingTime': '{n} min read',
  'learn.lastReviewed': 'Last reviewed',
  'learn.sources': 'Sources',
  'learn.backToTopics': 'All topics',

  'soon.badge': 'In progress',
  'soon.title': 'This section is being built',
  'soon.body': 'This part of Stockora Academy is planned and will be added soon.',
  'soon.planned': 'What it will include',

  'search.title': 'Search',
  'search.lead': 'Search lessons, glossary terms and country pages.',
  'search.devNote':
    'Search becomes available after a production build (npm run build, then npm run preview).',

  'verify.title': 'Verify this',
  'verify.body': 'Rules and data change. Check the official source before relying on this.',

  'notFound.title': 'Page not found',
  'notFound.body': 'This page does not exist (yet). Try the search or go back to the start.',
  'notFound.home': 'Go to the home page',
} as const;

export type UiKey = keyof typeof en;
