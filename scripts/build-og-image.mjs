#!/usr/bin/env node
/**
 * Renders the social preview image (public/og-default.png, 1200×630) shown when a page is shared.
 * It is an HTML card screenshotted by a headless Chromium browser (Chrome, Brave, Edge, …) over the
 * DevTools protocol (Node's built-in WebSocket, so no extra dependency):
 *
 *   CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run build:og-image
 *
 * Run it after changing the name, tagline or brand colours, and commit the PNG.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.env.CHROME_PATH;
if (!chrome) {
  console.error('Set CHROME_PATH to a Chromium-based browser binary.');
  process.exit(1);
}

const font = pathToFileURL(resolve('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).href;
const out = resolve('public/og-default.png');

// Decorative candles (fixed values, not market data).
const candles = [
  [300, 360, 280, 380], [355, 330, 320, 372], [335, 300, 290, 350], [305, 318, 280, 330], [318, 270, 255, 330],
  [272, 250, 238, 290], [252, 268, 240, 280], [266, 220, 205, 275], [222, 196, 180, 236], [198, 160, 150, 210],
];
const candleSvg = candles
  .map(([o, c, h, l], i) => {
    const x = 40 + i * 34;
    const up = c < o; // smaller y = higher price
    const colour = up ? '#c8b8db' : '#6c7393';
    return `<line x1="${x + 9}" y1="${h}" x2="${x + 9}" y2="${l}" stroke="${colour}" stroke-width="3" stroke-linecap="round"/>
      <rect x="${x}" y="${Math.min(o, c)}" width="18" height="${Math.max(Math.abs(o - c), 4)}" rx="3" fill="${colour}"/>`;
  })
  .join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url(${font}) format('woff2'); font-weight: 100 900; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { font-family: Inter, sans-serif; background: #0b132b; color: #f9f4f5; position: relative; }
.wrap { position: absolute; left: 80px; top: 92px; width: 700px; }
.brand { display: flex; align-items: center; gap: 28px; }
h1 { margin: 0; font-size: 72px; line-height: 1.02; font-weight: 800; letter-spacing: -0.02em; }
h1 span { display: block; color: #c8b8db; font-size: 40px; font-weight: 700; letter-spacing: 0.24em; margin-top: 10px; }
p { margin: 52px 0 0; font-size: 40px; line-height: 1.25; font-weight: 600; color: #f9f4f5; }
.foot { position: absolute; left: 80px; bottom: 64px; font-size: 26px; color: #adb0cb; font-weight: 500; }
.chart { position: absolute; right: 60px; top: 120px; }
</style></head><body>
<div class="wrap">
  <div class="brand">
    <svg viewBox="0 0 48 48" width="132" height="132"><rect width="48" height="48" rx="10" fill="#1c2541"/>
      <path d="M34 10 H22 A7 7 0 0 0 22 24 H26 A7 7 0 0 1 26 38 H14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="35" cy="10" r="5" fill="#c8b8db"/></svg>
    <h1>Stockora<span>ACADEMY</span></h1>
  </div>
  <p>Learn how the stock market<br>really works.</p>
</div>
<svg class="chart" width="380" height="400" viewBox="0 0 380 400" aria-hidden="true">${candleSvg}</svg>
<div class="foot">Free · Beginner-friendly · Education only, no investment advice</div>
</body></html>`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Minimal DevTools protocol client: send(method, params, sessionId) resolves with the result. */
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  return new Promise((resolve, reject) => {
    ws.addEventListener('open', () => resolve({ send, close: () => ws.close() }));
    ws.addEventListener('error', reject);
  });
}

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const profile = join(dir, 'profile');
const browser = spawn(chrome, ['--headless=new', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], {
  stdio: 'ignore',
});
try {
  const page = join(dir, 'og.html');
  writeFileSync(page, html);

  // The browser writes its DevTools port to <profile>/DevToolsActivePort once it is ready.
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const [port, path] = readFileSync(portFile, 'utf8').trim().split('\n');
  const cdp = await connect(`ws://127.0.0.1:${port}${path}`);

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false }, sessionId);
  await cdp.send('Page.navigate', { url: pathToFileURL(page).href }, sessionId);
  await sleep(1500); // let the font load
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
  writeFileSync(out, Buffer.from(data, 'base64'));
  cdp.close();
  console.log(`Wrote ${out}`);
} finally {
  browser.kill();
  await sleep(300);
  rmSync(dir, { recursive: true, force: true });
}
