import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const saasRoot = join(here, '..', '..', '..', '..');
const surge = await import(pathToFileURL(join(saasRoot, 'Surge', 'src', 'rng.ts')).href);

const OUTPUTS = 10;
const STRING_SEEDS = ['a', '', 'daily:2026-10-08', 'daily-2026-10-08', 'x:3', 'k:magnet:2', 'run-abc123', 'é漢🙂'];
const NUMERIC_SEEDS = [0, 1, 42, 123456789, 0xdeadbeef, 4294967295, -1, 4294967301, 1.5];

const take = (rng) => Array.from({ length: OUTPUTS }, () => rng());

const extractFn = (file, name) => {
  const src = readFileSync(join(saasRoot, 'Aurora', 'src', file), 'utf8');
  const start = src.indexOf('{', src.indexOf(`export function ${name}(seed: number)`)) + 1;
  const body = src.slice(start, src.indexOf('\n}', start));
  return new Function('seed', 'UINT32_RANGE', body);
};
const aurora = {
  seededRandom: extractFn('boot/beginRealmMotes.ts', 'seededRandom'),
  makeRng: extractFn('audio/ambientPlan.ts', 'makeRng'),
};

const strings = STRING_SEEDS.map((seed) => ({ seed, hash: surge.hashString(seed), outputs: take(surge.mulberry32(surge.hashString(seed))) }));
const numbers = NUMERIC_SEEDS.map((seed) => ({ seed, outputs: take(surge.mulberry32(seed)) }));

for (const { seed, outputs } of numbers) {
  for (const [name, make] of Object.entries(aurora)) {
    const got = take(make(seed, 4294967296));
    if (JSON.stringify(got) !== JSON.stringify(outputs)) {
      throw new Error(`Aurora ${name} diverges from Surge mulberry32 for seed ${seed}`);
    }
  }
}

writeFileSync(join(here, '..', 'src', 'goldenVectors.json'), JSON.stringify({ source: 'Surge/src/rng.ts', strings, numbers }, null, 2) + '\n');
process.stdout.write(`wrote ${strings.length} string + ${numbers.length} numeric vectors; Aurora seededRandom + makeRng match\n`);
