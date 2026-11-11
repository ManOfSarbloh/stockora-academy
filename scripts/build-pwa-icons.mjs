#!/usr/bin/env node
/**
 * Renders the app icons used when Stockora Academy is installed (web app manifest, Apple touch icon) from the
 * logo mark in public/favicon.svg. Run after changing the logo or brand colours, and commit the PNGs:
 *
 *   node scripts/build-pwa-icons.mjs
 */
import { mkdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

const BG = '#fdfdfe';
const mark = readFileSync('public/favicon.svg', 'utf8')
  // librsvg ignores the dark-mode media query anyway; drop it so the light colours are used for sure.
  .replace(/@media[^{]*\{[^}]*\{[^}]*\}[^}]*\{[^}]*\}\s*\}/, '');

mkdirSync('public/icons', { recursive: true });

/** The mark centred on a square background; `scale` is the mark's share of the icon width. */
async function icon(size, scale, file) {
  const inner = Math.round(size * scale);
  const png = await sharp(Buffer.from(mark), { density: 72 * (inner / 48) * 2 })
    .resize(inner, inner)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: png, gravity: 'center' }])
    .png()
    .toFile(`public/icons/${file}`);
  console.log(`Wrote public/icons/${file}`);
}

await icon(192, 0.7, 'icon-192.png');
await icon(512, 0.7, 'icon-512.png');
// Maskable icons may be cropped to a circle: keep the mark inside the central 80% safe zone.
await icon(512, 0.5, 'maskable-512.png');
await icon(180, 0.7, 'apple-touch-icon.png');
