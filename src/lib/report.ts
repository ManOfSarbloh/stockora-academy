import { reportConfig } from '@/config/site';
import { url } from './url';

/**
 * Link for "Report a mistake": a prefilled GitHub issue once a repository is configured,
 * otherwise the Corrections page. No tracking either way.
 */
export function reportMistakeHref(pageTitle: string, pageUrl: string): string {
  if (!reportConfig.githubRepo) return url('/corrections');
  const params = new URLSearchParams({
    title: `Mistake on: ${pageTitle}`,
    labels: 'content-error',
    body: `Page: ${pageUrl}\n\nWhat is wrong:\n\n\nWhat is correct (with an official source if possible):\n`,
  });
  return `https://github.com/${reportConfig.githubRepo}/issues/new?${params}`;
}
