#!/usr/bin/env node
/**
 * Checks every entry in content/videos.json against YouTube's public oEmbed endpoint:
 *  - the video must still exist and be embeddable
 *  - the title must still roughly match (catches re-used or replaced video IDs)
 *  - the channel must match
 * Prints a report and exits with code 1 if any video fails.
 */
import { readFileSync } from 'node:fs';

const videos = JSON.parse(readFileSync('content/videos.json', 'utf8'));

const normalise = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

/** Share of the stored title's words that still appear in the live title. */
function titleSimilarity(stored, live) {
  const a = normalise(stored);
  const b = new Set(normalise(live));
  return a.length ? a.filter((w) => b.has(w)).length / a.length : 0;
}

async function check(v) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${v.id}`)}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { v, ok: false, reason: `HTTP ${res.status} (removed, private or not embeddable)` };
    const data = await res.json();
    const sim = titleSimilarity(v.title, data.title);
    if (sim < 0.6) return { v, ok: false, reason: `title changed: now "${data.title}" (${Math.round(sim * 100)}% match)` };
    if (data.author_name.trim().toLowerCase() !== v.channel.trim().toLowerCase())
      return { v, ok: false, reason: `channel changed: now "${data.author_name}"` };
    return { v, ok: true };
  } catch (err) {
    return { v, ok: false, reason: `request failed: ${err.message}` };
  }
}

const results = [];
for (const v of videos) results.push(await check(v)); // sequential: be gentle with the endpoint

console.log(`Checked ${results.length} video(s)`);
for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.v.id}  ${r.v.channel}: ${r.v.title}${r.ok ? '' : `\n      → ${r.reason}`}`);

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(`\n${failed.length} video(s) need attention. Replace them or remove them from content/videos.json.`);
  process.exit(1);
}
console.log('\n✓ All videos available.');
