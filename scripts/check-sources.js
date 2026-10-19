#!/usr/bin/env node
/**
 * Checks that the external links used as sources still work.
 * Collects every http(s) URL from content/ (lessons, JSON data) and src/ (pages and config),
 * requests each one and sorts the results:
 *   broken     404/410, unknown host or refused connection: fix or replace the link
 *   moved      redirected to a different page: check that it still says what we cite
 *   unchecked  the site blocks automated requests (401/403/429, timeouts): check by hand if in doubt
 * Exits with code 1 only if a link is broken. YouTube links are covered by check-videos.js.
 *
 *   npm run check:sources              # report
 *   npm run check:sources -- --verbose # also list moved and unchecked links
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const VERBOSE = process.argv.includes('--verbose');
const ROOTS = ['content', 'src'];
const EXTS = new Set(['.md', '.json', '.ts', '.tsx', '.astro']);
// Not sources: namespaces, the site itself and placeholders.
const SKIP = /^https?:\/\/(localhost|127\.0\.0\.1|schema\.org|www\.w3\.org|example\.(org|com)|(www\.)?youtube(-nocookie)?\.com|youtu\.be|img\.youtube\.com|i\.ytimg\.com)/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

/** url -> files that use it */
const uses = new Map();
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/https?:\/\/[^\s"'`<>\]\\]+/g)) {
      let url = m[0].replace(/[.,;:!?*]+$/, '');
      // Markdown links end with ")": drop closing brackets that have no opening one in the URL.
      while (url.endsWith(')') && (url.match(/\)/g) || []).length > (url.match(/\(/g) || []).length) url = url.slice(0, -1);
      url = url.replace(/[.,;:!?*]+$/, '');
      if (SKIP.test(url) || url.includes('${')) continue;
      if (!uses.has(url)) uses.set(url, new Set());
      uses.get(url).add(file);
    }
  }
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; StockoraAcademyLinkCheck/1.0; +https://github.com/)',
  Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en,de;q=0.8',
};

const sameDoc = (a, b) => {
  const norm = (u) => {
    const x = new URL(u);
    return (x.host.replace(/^www\./, '') + x.pathname.replace(/\/index(\.html?)?$/, '').replace(/\/+$/, '')).toLowerCase();
  };
  try {
    return norm(a) === norm(b);
  } catch {
    return false;
  }
};

async function check(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      if (res.body) await res.body.cancel().catch(() => {});
      // Some servers reject HEAD; retry those with GET.
      if (method === 'HEAD' && [400, 403, 404, 405, 406, 429, 500, 501, 503].includes(res.status)) continue;
      if (res.status === 404 || res.status === 410) return { url, kind: 'broken', note: `HTTP ${res.status}` };
      if (res.status >= 400) return { url, kind: 'unchecked', note: `HTTP ${res.status}` };
      // A home page that forwards to its start page (e.g. /index) is fine.
      if (res.redirected && new URL(url).pathname.replace(/\/+$/, '') !== '' && !sameDoc(url, res.url)) return { url, kind: 'moved', note: `→ ${res.url}` };
      return { url, kind: 'ok' };
    } catch (err) {
      const code = err.cause?.code ?? err.name;
      if (method === 'HEAD') continue;
      if (['ENOTFOUND', 'ECONNREFUSED', 'ERR_TLS_CERT_ALTNAME_INVALID'].includes(code)) return { url, kind: 'broken', note: code };
      return { url, kind: 'unchecked', note: code };
    }
  }
}

// Limited concurrency, and at most two requests at a time to the same host.
const urls = [...uses.keys()].sort();
const results = [];
const busyHosts = new Map();
let next = 0;
async function worker() {
  while (next < urls.length) {
    const i = next++;
    const host = new URL(urls[i]).host;
    while ((busyHosts.get(host) ?? 0) >= 2) await new Promise((r) => setTimeout(r, 200));
    busyHosts.set(host, (busyHosts.get(host) ?? 0) + 1);
    results.push(await check(urls[i]));
    busyHosts.set(host, busyHosts.get(host) - 1);
  }
}
console.log(`Checking ${urls.length} source links…`);
await Promise.all(Array.from({ length: 10 }, worker));

const by = (k) => results.filter((r) => r.kind === k).sort((a, b) => a.url.localeCompare(b.url));
const show = (r) => `  ${r.url}  ${r.note ?? ''}\n      in ${[...uses.get(r.url)].join(', ')}`;
const broken = by('broken');
const moved = by('moved');
const unchecked = by('unchecked');
if (broken.length) console.log(`\n✗ Broken (${broken.length}):\n${broken.map(show).join('\n')}`);
if (VERBOSE && moved.length) console.log(`\nMoved (${moved.length}):\n${moved.map(show).join('\n')}`);
if (VERBOSE && unchecked.length) console.log(`\nUnchecked (${unchecked.length}):\n${unchecked.map(show).join('\n')}`);
console.log(
  `\n${by('ok').length} ok, ${moved.length} moved, ${unchecked.length} unchecked (site blocks scripts), ${broken.length} broken.` +
    (VERBOSE ? '' : ' Use --verbose for details.'),
);
process.exit(broken.length ? 1 : 0);
