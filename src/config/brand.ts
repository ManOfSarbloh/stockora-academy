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

/** Provisional until the owner picks one (Phase 2 review). */
export const logoVariant: LogoVariant = 'slice';
