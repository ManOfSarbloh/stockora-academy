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

/** Default titles in translated lessons (content/i18n/<locale>/…). */
export const CALLOUT_KINDS_BY_LOCALE: Record<string, Record<CalloutKind, string>> = {
  de: { example: 'Beispiel', takeaways: 'Das Wichtigste', mistake: 'Typischer Anfängerfehler', warning: 'Achtung', austria: 'Österreich-Hinweis', verify: 'Bitte prüfen', note: 'Hinweis', tip: 'Tipp' },
  es: { example: 'Ejemplo', takeaways: 'Ideas clave', mistake: 'Error típico de principiante', warning: 'Atención', austria: 'Nota sobre Austria', verify: 'Compruébalo', note: 'Nota', tip: 'Consejo' },
  fr: { example: 'Exemple', takeaways: 'À retenir', mistake: 'Erreur fréquente de débutant', warning: 'Attention', austria: 'Note sur l’Autriche', verify: 'À vérifier', note: 'Remarque', tip: 'Astuce' },
  it: { example: 'Esempio', takeaways: 'Punti chiave', mistake: 'Errore tipico da principiante', warning: 'Attenzione', austria: 'Nota sull’Austria', verify: 'Da verificare', note: 'Nota', tip: 'Consiglio' },
};

/** GitHub's own alert names, mapped onto ours so either works. */
const ALIASES: Record<string, CalloutKind> = {
  important: 'note',
  caution: 'warning',
  takeaway: 'takeaways',
};

const MARKER = /^\[!([A-Za-z]+)\][ \t]*([^\n]*)\n?/;

export function parseMarker(text: string, locale?: string): { kind: CalloutKind; title: string; rest: string } | null {
  const m = MARKER.exec(text);
  if (!m) return null;
  const raw = m[1].toLowerCase();
  const kind = (raw in CALLOUT_KINDS ? raw : ALIASES[raw]) as CalloutKind | undefined;
  if (!kind) return null;
  const fallback = (locale && CALLOUT_KINDS_BY_LOCALE[locale]?.[kind]) || CALLOUT_KINDS[kind];
  return { kind, title: m[2].trim() || fallback, rest: text.slice(m[0].length) };
}

export function remarkCallouts() {
  return (tree: Root, file?: { path?: string }) => {
    const locale = file?.path?.match(/[\\/]content[\\/]i18n[\\/]([a-z]{2})[\\/]/)?.[1];
    visit(tree, 'blockquote', (node: Blockquote) => {
      const first = node.children[0];
      if (first?.type !== 'paragraph') return;
      const lead = first.children[0];
      if (lead?.type !== 'text') return;
      const parsed = parseMarker(lead.value, locale);
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
