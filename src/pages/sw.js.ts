import type { APIRoute } from 'astro';
import { ACTIVE_LOCALES } from '@/i18n/pages';
import { defaultLocale } from '@/i18n/locales';
import { joinBase } from '@/lib/url';

/**
 * Service worker: makes the installed app (and the site) work offline for pages already visited.
 * - Pages: network first, so updates always show; the last copy is kept for offline reading.
 * - Hashed build files (/_astro/…): cache first, they never change.
 * - Other files (dictionaries, figures, icons, fonts): served from the cache and refreshed in the background.
 * - Search (Pagefind) is not cached: it needs the network.
 * Offline and nothing saved: the offline page in the visitor's language lists the pages that are saved.
 * Generated at build time so it knows the base path and the languages. Nothing is sent anywhere.
 */
export const GET: APIRoute = () => {
  const base = joinBase(import.meta.env.BASE_URL, '/');
  const offline = Object.fromEntries(ACTIVE_LOCALES.map((l) => [l, joinBase(import.meta.env.BASE_URL, l === defaultLocale ? '/offline' : `/${l}/offline`)]));
  const script = `/* Stockora Academy service worker (generated, see src/pages/sw.js.ts) */
const BASE = ${JSON.stringify(base)};
const OFFLINE = ${JSON.stringify(offline)};
const PAGES = 'stockora-pages-v1';
const ASSETS = 'stockora-assets-v1';
const MAX_PAGES = 150;
const MAX_ASSETS = 400;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(Object.values(OFFLINE))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('stockora-') && k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Keeps a cache below a number of entries by dropping the oldest. */
async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

function offlineFor(url) {
  const rest = url.pathname.slice(BASE.length);
  const lang = rest.split('/')[0];
  return OFFLINE[lang] || OFFLINE.en;
}

async function page(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      trim(PAGES, MAX_PAGES);
    }
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) || (await cache.match(offlineFor(new URL(request.url)))) || Response.error();
  }
}

async function asset(request, hashed) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  if (cached && hashed) return cached;
  const refresh = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
        trim(ASSETS, MAX_ASSETS);
      }
      return response;
    })
    .catch(() => cached || Response.error());
  if (cached) {
    refresh.catch(() => {});
    return cached;
  }
  return refresh;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  const rest = url.pathname.slice(BASE.length);
  if (rest.startsWith('pagefind/') || rest === 'sw.js') return;
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(page(request));
    return;
  }
  event.respondWith(asset(request, rest.startsWith('_astro/')));
});
`;
  return new Response(script, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
