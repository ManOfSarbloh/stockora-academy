/**
 * Remark plugin: embeds a lesson animation from src/animations/<name>.svg.
 *
 *   > [!ANIMATION] candle-forming
 *   > One trading day becomes one candle.
 *
 * The SVG is inlined (so its CSS animations can be paused) inside a figure with a play/pause button;
 * the text after the marker line becomes the caption. src/components/AnimationScript.astro starts
 * each animation when it scrolls into view, unless the visitor prefers reduced motion; until then,
 * and without JavaScript, the SVG shows its final frame.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Blockquote, Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

const MARKER = /^\[!ANIMATION\][ \t]+([a-z0-9-]+)[ \t]*\n?/;
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function animationFigure(name: string, caption: string, dir = join(process.cwd(), 'src/animations')): string {
  const svg = readFileSync(join(dir, `${name}.svg`), 'utf8').trim();
  return (
    `<figure class="anim not-prose" data-anim="${name}">` +
    `<div class="anim-stage">${svg}</div>` +
    `<figcaption class="anim-caption"><button type="button" class="anim-btn" hidden></button>` +
    `<span>${escapeHtml(caption)}</span></figcaption></figure>`
  );
}

export function remarkAnimations() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
      const first = node.children[0];
      if (first?.type !== 'paragraph' || first.children[0]?.type !== 'text') return;
      const m = MARKER.exec(first.children[0].value);
      if (!m || !parent || index === undefined) return;
      const caption = toString(node).replace(MARKER, '').replace(/\s+/g, ' ').trim();
      parent.children[index] = { type: 'html', value: animationFigure(m[1], caption) };
    });
  };
}
