/**
 * Puts the lesson animations into the page HTML at build time. The Markdown plugin
 * (src/lib/markdown/animations.ts) leaves only a placeholder, because Astro caches rendered Markdown
 * by its own text: inlining the SVG there would keep serving an old drawing after the SVG changes.
 */
const files = import.meta.glob<string>('../animations/*.svg', { query: '?raw', import: 'default', eager: true });

const PLACEHOLDER = /<div class="anim-stage" data-anim-src="([a-z0-9-]+)"><\/div>/g;

export function injectAnimations(html: string): string {
  if (!html.includes('data-anim-src')) return html;
  return html.replace(PLACEHOLDER, (_, name: string) => {
    const svg = files[`../animations/${name}.svg`];
    if (!svg) throw new Error(`Animation "${name}" not found in src/animations/`);
    return `<div class="anim-stage">${svg.trim()}</div>`;
  });
}
