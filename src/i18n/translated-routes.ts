/**
 * Which lesson and topic routes exist in a translated language (Node only: reads the content folders).
 * Used by astro.config.mjs for the sitemap; topic pages use the same rule through the content collections.
 * Lesson translations live in content/i18n/<locale>/lessons/<topic letter>/<lesson>.md.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const isDraft = (file: string) => /^draft:\s*true\s*$/m.test(readFileSync(file, 'utf8').split('\n---')[0]);

/** Routes like "/de/learn/foundations/what-is-a-stock/" and, for fully translated topics, "/de/learn/foundations/". */
export function translatedRoutes(root = '.'): Set<string> {
  const out = new Set<string>();
  const categories: { id: string; slug: string }[] = JSON.parse(readFileSync(join(root, 'content/categories.json'), 'utf8'));
  const i18n = join(root, 'content/i18n');
  if (!existsSync(i18n)) return out;
  for (const loc of readdirSync(i18n)) {
    const dir = join(i18n, loc, 'lessons');
    if (!existsSync(dir)) continue;
    for (const c of categories) {
      const enDir = join(root, 'content/lessons', c.id);
      const trDir = join(dir, c.id);
      if (!existsSync(enDir) || !existsSync(trDir)) continue;
      const english = readdirSync(enDir).filter((f) => f.endsWith('.md') && !f.startsWith('_') && !isDraft(join(enDir, f)));
      const done = english.filter((f) => existsSync(join(trDir, f)));
      for (const f of done) out.add(`/${loc}/learn/${c.slug}/${f.replace(/\.md$/, '')}/`);
      if (english.length > 0 && done.length === english.length) out.add(`/${loc}/learn/${c.slug}/`);
    }
  }
  return out;
}
