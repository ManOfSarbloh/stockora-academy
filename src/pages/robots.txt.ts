import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/url';

/** robots.txt is generated so the sitemap line carries the real site URL and base path. */
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
