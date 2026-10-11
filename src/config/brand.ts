export type LogoVariant = 'slice' | 'path' | 'stack';

export const logoVariants: { id: LogoVariant; name: string; idea: string }[] = [
  {
    id: 'slice',
    name: 'A · Slice',
    idea: 'A circle with one wedge lifted out. A share is literally a slice of a company, the very first lesson on the site.',
  },
  {
    id: 'path',
    name: 'B · Path',
    idea: 'A geometric "S" drawn as one continuous road that ends in a teal dot: the learning path "from first share to world markets".',
  },
  {
    id: 'stack',
    name: 'C · Stack',
    idea: 'Three staggered blocks, like a stack of books, or the three levels Beginner, Intermediate and Advanced, with the top one highlighted.',
  },
];

/** Chosen 2026-10-11 (owner liked A and B; B picked for distinctiveness and the built-in "S"). */
export const logoVariant: LogoVariant = 'path';
