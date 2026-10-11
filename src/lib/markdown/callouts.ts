/**
 * Remark plugin: turns GitHub-style alert blockquotes into callout boxes.
 *
 *   > [!EXAMPLE]
 *   > You buy 25 of the company's 1,000 shares ...
 *
 *   > [!MISTAKE] Thinking a low share price means "cheap"
 *   > ...
 *
 * An optional title can follow the marker on the same line; otherwise the default label is used.
 */
import type { Blockquote, Paragraph, Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

export const CALLOUT_KINDS = {
  example: 'Example',
  takeaways: 'Key takeaways',
  mistake: 'Common beginner mistake',
  warning: 'Warning',
  austria: 'Austria note',
  verify: 'Verify this',
  note: 'Note',
  tip: 'Tip',
} as const;

export type CalloutKind = keyof typeof CALLOUT_KINDS;

/** GitHub's own alert names, mapped onto ours so either works. */
const ALIASES: Record<string, CalloutKind> = {
  important: 'note',
  caution: 'warning',
  takeaway: 'takeaways',
};

const MARKER = /^\[!([A-Za-z]+)\][ \t]*([^\n]*)\n?/;

export function parseMarker(text: string): { kind: CalloutKind; title: string; rest: string } | null {
  const m = MARKER.exec(text);
  if (!m) return null;
  const raw = m[1].toLowerCase();
  const kind = (raw in CALLOUT_KINDS ? raw : ALIASES[raw]) as CalloutKind | undefined;
  if (!kind) return null;
  return { kind, title: m[2].trim() || CALLOUT_KINDS[kind], rest: text.slice(m[0].length) };
}

export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote) => {
      const first = node.children[0];
      if (first?.type !== 'paragraph') return;
      const lead = first.children[0];
      if (lead?.type !== 'text') return;
      const parsed = parseMarker(lead.value);
      if (!parsed) return;

      // Remove the marker line from the first paragraph (drop the paragraph if nothing is left).
      lead.value = parsed.rest;
      if (!lead.value) first.children.shift();
      if (first.children[0]?.type === 'break') first.children.shift();
      if (first.children.length === 0) node.children.shift();

      const title: Paragraph = {
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: parsed.title } as Text],
      };
      node.children.unshift(title);
      node.data = {
        ...node.data,
        hName: 'aside',
        hProperties: { className: ['callout', `callout-${parsed.kind}`], 'aria-label': parsed.title },
      };
    });
  };
}
