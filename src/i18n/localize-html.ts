/**
 * Keeps visitors in their language: on a /de/ page, an internal page link like href="/learn/x/"
 * becomes href="/de/learn/x/". Needed for HTML that does not go through url(), such as links
 * written in Markdown lessons. Pure function, unit-tested.
 *
 * Left alone: links with an hreflang attribute (the language switcher), files (anything with an
 * extension), links already in a language, external links and fragments.
 */
import { isLocale, type Locale } from './locales';
import { localizePath } from './routes';

export function localizeHtml(html: string, locale: Locale, base: string): string {
  if (locale === 'en') return html;
  const b = base.endsWith('/') ? base : `${base}/`;
  return html.replace(/<(a|form)\b[^>]*>/gi, (tag) => {
    if (/\shreflang=/i.test(tag)) return tag;
    return tag.replace(/\s(href|action)="([^"]*)"/i, (attr, name: string, value: string) => {
      if (!value.startsWith(b)) return attr;
      const rest = `/${value.slice(b.length)}`;
      const first = rest.split('/')[1];
      if (isLocale(first)) return attr;
      return ` ${name}="${b}${localizePath(rest, locale).slice(1)}"`;
    });
  });
}
