# @dloizides/game-rng

Deterministic seeded randomness for games. The same seed always produces the same sequence, so a daily run, a ghost or a replay rebuilds exactly. Zero dependencies, ESM + CJS + types, runs in browsers and Node.

Extracted from Surge (`src/rng.ts`) and Aurora (`seededRandom`, `makeRng`). Outputs are bit-identical to all three; `src/goldenVectors.json` pins the first 10 outputs for string and numeric seeds.

## Install

```bash
npm install @dloizides/game-rng
```

## Quick start

```ts
import { createRng, dailySeed, pick, range } from '@dloizides/game-rng';

const rng = createRng(dailySeed());
const gap = range(rng, 120, 240);
const lane = pick(rng, ['left', 'mid', 'right'] as const);
```

## API

| Export | Signature | Behaviour |
|---|---|---|
| `Rng` | `() => number` | A generator returning floats in `[0, 1)`. |
| `Seed` | `number \| string` | Accepted by `createRng`. |
| `mulberry32` | `(seed: number) => Rng` | mulberry32 PRNG; the seed is coerced with `>>> 0`. Drop-in for Aurora's `seededRandom` / `makeRng`. |
| `hashString` | `(s: string) => number` | FNV-1a 32-bit over UTF-16 code units, unsigned. |
| `createRng` | `(seed: Seed) => Rng` | Strings go through `hashString`, numbers straight to `mulberry32`. |
| `range` | `(r, lo, hi) => number` | `lo + (hi - lo) * r()`. |
| `pick` | `(r, items) => T` | `items[floor(r() * length)]`; throws `RangeError` on an empty list. |
| `dailySeed` | `(date = new Date()) => string` | `"daily-YYYY-MM-DD"` for the UTC day. |
| `randomSeed` | `() => string` | `"run-<base36>"` from `Math.random`; not deterministic. |

## Migrating

- Surge: `import { mulberry32, hashString, range, pick, dailySeed, randomSeed, type Rng } from '@dloizides/game-rng'`.
- Aurora: replace `seededRandom(seed)` and `makeRng(seed)` with `mulberry32(seed)`.

## Golden vectors

`npm run golden:generate` (Node >= 22) re-reads `Surge/src/rng.ts` and Aurora's two generators from the SaaS checkout, fails if Aurora diverges from Surge, and rewrites `src/goldenVectors.json`. Any change to the vectors is a breaking change.

## License

MIT
