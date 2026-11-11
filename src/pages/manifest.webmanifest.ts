import type { APIRoute } from 'astro';
import { joinBase } from '@/lib/url';

const url = (path: string) => joinBase(import.meta.env.BASE_URL, path);

/**
 * Web app manifest: lets visitors install Stockora Academy as an app. Generated so the paths carry the base path
 * (GitHub Pages serves the site from /stockora-academy/). Icons come from scripts/build-pwa-icons.mjs.
 */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: 'Stockora Academy',
        short_name: 'Stockora',
        description: 'A free, beginner-friendly learning site about stocks and stock markets. Education only, no investment advice.',
        start_url: url('/'),
        scope: url('/'),
        display: 'standalone',
        background_color: '#fdfdfe',
        theme_color: '#0096fa',
        icons: [
          { src: url('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: url('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
          { src: url('/icons/maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
