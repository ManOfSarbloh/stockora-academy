/**
 * Build an internal link that respects the deploy base path
 * (e.g. "/stockora-academy/" on GitHub Pages project sites).
 * Page links get a trailing slash; file links (with an extension) and hashes are left alone.
 */
export function joinBase(base: string, path: string): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  const [pathPart, hash = ''] = path.split('#');
  let p = pathPart.replace(/^\/+/, '');
  const isFile = /\.[a-z0-9]+$/i.test(p);
  if (p && !isFile && !p.endsWith('/')) p += '/';
  return `${b}${p}${hash ? `#${hash}` : ''}`;
}

export function url(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}

/** Strip the base so the current page can be compared to nav hrefs. */
export function stripBase(base: string, pathname: string): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  const rest = pathname.startsWith(b) ? pathname.slice(b.length) : pathname.replace(/^\/+/, '');
  return `/${rest}`.replace(/\/+$/, '') || '/';
}

/** Absolute URL of an internal page (for canonical links and structured data). */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site).href;
}
