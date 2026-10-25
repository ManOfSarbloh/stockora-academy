/**
 * Rehype plugin: links the first mention of each glossary term on a page to its glossary entry.
 * The short definition is stored on the link (data-def) so a tooltip can show it without extra requests.
 *
 * Matching rules:
 *  - the term or any of its aliases, case-insensitive, with an optional plural "s"/"es"; an all-capital
 *    abbreviation ("MAR", "ETC") only matches in capitals, so French "mars" or Spanish "etc." stay plain text
 *  - whole words only (letters/digits must not touch the match), so "ETF" does not match inside "ETFs"
 *    except as the plural, and "share" does not match inside "shareholder"
 *  - longer phrases win ("market order" before "market")
 *  - never inside headings, links, code, buttons or elements with the class "no-gloss"
 */
import type { Element, ElementContent, Root, RootContent, Text } from 'hast';

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  aliases?: string[];
}

const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'script', 'style', 'svg', 'abbr']);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface Matcher {
  regex: RegExp;
  idFor: (phrase: string) => GlossaryTerm | undefined;
}

/** Optional word endings accepted after a term: English plurals by default, German declensions for "de". */
export const PLURAL_SUFFIX: Record<string, string> = { en: '(?:e?s)?', de: '(?:e|en|n|s|es|er|ern)?', es: '(?:e?s)?', fr: '(?:s|x)?', it: '' };

export function buildMatcher(terms: GlossaryTerm[], suffix = PLURAL_SUFFIX.en): Matcher | null {
  const byPhrase = new Map<string, GlossaryTerm>();
  const capitalsOnly = new Set<string>();
  for (const t of terms) {
    for (const p of [t.term, ...(t.aliases ?? [])]) {
      const key = p.trim().toLowerCase();
      if (!key || byPhrase.has(key)) continue;
      byPhrase.set(key, t);
      if (!/\p{Ll}/u.test(p) && (p.match(/\p{Lu}/gu) ?? []).length >= 2) capitalsOnly.add(key);
    }
  }
  if (byPhrase.size === 0) return null;
  const phrases = [...byPhrase.keys()].sort((a, b) => b.length - a.length).map(escapeRegex);
  const regex = new RegExp(`(?<![\\p{L}\\p{N}])(${phrases.join('|')})${suffix}(?![\\p{L}\\p{N}])`, 'giu');
  const idFor = (phrase: string) => {
    const key = phrase.toLowerCase();
    return capitalsOnly.has(key) && phrase !== phrase.toUpperCase() ? undefined : byPhrase.get(key);
  };
  return { regex, idFor };
}

function hasClass(el: Element, cls: string): boolean {
  const c = el.properties?.className;
  return Array.isArray(c) ? c.includes(cls) : c === cls;
}

/** Split one text node into text + link nodes. `used` tracks terms already linked on this page. */
export function linkText(
  value: string,
  matcher: Matcher,
  used: Set<string>,
  hrefFor: (id: string) => string,
): ElementContent[] | null {
  const out: ElementContent[] = [];
  let last = 0;
  matcher.regex.lastIndex = 0;
  for (const m of value.matchAll(matcher.regex)) {
    const term = matcher.idFor(m[1]);
    if (!term || used.has(term.id)) continue;
    used.add(term.id);
    const start = m.index ?? 0;
    if (start > last) out.push({ type: 'text', value: value.slice(last, start) });
    out.push({
      type: 'element',
      tagName: 'a',
      properties: { href: hrefFor(term.id), className: ['gloss'], dataGloss: term.id, dataTerm: term.term, dataDef: term.definition },
      children: [{ type: 'text', value: m[0] }],
    });
    last = start + m[0].length;
  }
  if (out.length === 0) return null;
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

/**
 * `termsByLocale` holds each translated glossary; a Markdown file under content/i18n/<locale>/ is linked with
 * that language's terms (whose aliases include the English term, often used as is). Links point to the English
 * glossary URL; the middleware moves them into the page's language.
 */
export function rehypeGlossaryLinks(options: { terms: GlossaryTerm[]; termsByLocale?: Record<string, GlossaryTerm[]>; base?: string }) {
  const english = buildMatcher(options.terms);
  const byLocale = new Map(
    Object.entries(options.termsByLocale ?? {}).map(([loc, terms]) => [loc, buildMatcher(terms, PLURAL_SUFFIX[loc] ?? '')]),
  );
  const base = (options.base ?? '/').replace(/\/?$/, '/');
  const hrefFor = (id: string) => `${base}glossary/#${id}`;

  return (tree: Root, file?: { path?: string }) => {
    const loc = file?.path?.match(/[\\/]content[\\/]i18n[\\/]([a-z]{2})[\\/]/)?.[1];
    const matcher = loc ? byLocale.get(loc) ?? null : english;
    if (!matcher) return;
    const used = new Set<string>();

    const walk = (parent: Root | Element) => {
      const next: (RootContent | ElementContent)[] = [];
      for (const child of parent.children) {
        if (child.type === 'text') {
          const replaced = linkText((child as Text).value, matcher, used, hrefFor);
          if (replaced) next.push(...replaced);
          else next.push(child);
          continue;
        }
        if (child.type === 'element' && !SKIP_TAGS.has(child.tagName) && !hasClass(child, 'no-gloss') && !hasClass(child, 'callout-title')) {
          walk(child);
        }
        next.push(child);
      }
      parent.children = next as typeof parent.children;
    };

    walk(tree);
  };
}
