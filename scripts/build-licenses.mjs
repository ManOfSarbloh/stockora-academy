// Writes public/third-party-licenses.txt: the licence texts of the third-party code, fonts and data
// that are delivered to visitors (MIT, ISC and the SIL Open Font License all ask for their notice to
// travel with copies). Runs before every build, so the versions always match package-lock.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const packages = [
  { name: 'react', use: 'interactive tools (bundled JavaScript)' },
  { name: 'react-dom', use: 'interactive tools (bundled JavaScript)' },
  { name: 'scheduler', use: 'part of React DOM (bundled JavaScript)' },
  { name: 'astro', use: 'site framework; small client scripts for interactive parts' },
  { name: 'tailwindcss', use: 'parts of the stylesheet (base styles)' },
  { name: 'pagefind', use: 'site search (files under /pagefind/)', license: 'LICENSE/LICENSE' },
  { name: '@fontsource-variable/inter', use: 'the Inter font' },
  { name: 'world-atlas', use: 'country shapes of the world map (Natural Earth data, public domain)' },
];

const pkgDir = (n) => join('node_modules', ...n.split('/'));
const parts = [
  'Third-party licences for Stockora Academy',
  '==========================================',
  '',
  'Stockora Academy uses the following open-source software, fonts and data. Their licence notices',
  'are reproduced below, as the licences require. Data sources are credited on the pages that use them.',
  '',
  'Data: market capitalisation and number of listed companies (World Markets pages) come from the',
  'World Bank, World Development Indicators (source: World Federation of Exchanges), licensed under',
  'Creative Commons Attribution 4.0 (CC BY 4.0, https://creativecommons.org/licenses/by/4.0/).',
  'Values are shown rounded and converted to readable units.',
  'https://data.worldbank.org/indicator/CM.MKT.LCAP.CD',
  '',
];

for (const p of packages) {
  const dir = pkgDir(p.name);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const candidates = p.license ? [p.license] : ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE'];
  const file = candidates.map((f) => join(dir, f)).find((f) => existsSync(f));
  if (!file) throw new Error(`No licence file found for ${p.name}`);
  parts.push('-'.repeat(100), `${p.name} ${pkg.version} (${pkg.license ?? 'see below'}): ${p.use}`, '-'.repeat(100), '', readFileSync(file, 'utf8').trim(), '');
}

writeFileSync('public/third-party-licenses.txt', parts.join('\n') + '\n');
console.log(`third-party-licenses.txt: ${packages.length} packages`);
