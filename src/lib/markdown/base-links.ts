/**
 * Rehype plugin: prefixes site-internal links written as "/charts/lab" in Markdown with the
 * deploy base path (e.g. "/stockora-academy/charts/lab" on GitHub Pages). External links,
 * protocol-relative links and anchors are left alone.
 */
import type { Element, Root } from 'hast';

export function prefixBase(href: string, base: string): string {
  const b = base.replace(/\/$/, '');
  if (!b || !href.startsWith('/') || href.startsWith('//') || href.startsWith(b + '/')) return href;
  return b + href;
}

export function rehypeBaseLinks(options: { base?: string } = {}) {
  const base = options.base ?? '/';
  return (tree: Root) => {
    const walk = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName === 'a' && typeof child.properties?.href === 'string') child.properties.href = prefixBase(child.properties.href, base);
        walk(child);
      }
    };
    walk(tree);
  };
}
