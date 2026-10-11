/**
 * Rehype plugin: links the first mention of each glossary term on a page to its glossary entry.
 * The short definition is stored on the link (data-def) so a tooltip can show it without extra requests.
 *
 * Matching rules:
 *  - the term or any of its aliases, case-insensitive, with an optional plural "s"/"es"
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

export function buildMatcher(terms: GlossaryTerm[]): Matcher | null {
  const byPhrase = new Map<string, GlossaryTerm>();
  for (const t of terms) {
    for (const p of [t.term, ...(t.aliases ?? [])]) {
      const key = p.trim().toLowerCase();
      if (key && !byPhrase.has(key)) byPhrase.set(key, t);
    }
  }
  if (byPhrase.size === 0) return null;
  const phrases = [...byPhrase.keys()].sort((a, b) => b.length - a.length).map(escapeRegex);
  const regex = new RegExp(`(?<![\\p{L}\\p{N}])(${phrases.join('|')})(?:e?s)?(?![\\p{L}\\p{N}])`, 'giu');
  return { regex, idFor: (phrase) => byPhrase.get(phrase.toLowerCase()) };
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

export function rehypeGlossaryLinks(options: { terms: GlossaryTerm[]; base?: string }) {
  const matcher = buildMatcher(options.terms);
  const base = (options.base ?? '/').replace(/\/?$/, '/');
  const hrefFor = (id: string) => `${base}glossary/#${id}`;

  return (tree: Root) => {
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
