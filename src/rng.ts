export type Rng = () => number;

export type Seed = number | string;

const MULBERRY_INCREMENT = 0x6d2b79f5;
const UINT32_RANGE = 4294967296;
const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

/** mulberry32 PRNG: the same 32-bit seed always yields the same sequence of floats in [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + MULBERRY_INCREMENT) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

/** FNV-1a 32-bit hash of the string's UTF-16 code units, as an unsigned integer. */
export function hashString(s: string): number {
  let h = FNV_OFFSET_BASIS >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, FNV_PRIME);
  }
  return h >>> 0;
}

/** Seeds mulberry32 from a number directly or from a string via hashString. */
export function createRng(seed: Seed): Rng {
  return mulberry32(typeof seed === 'string' ? hashString(seed) : seed);
}

/** A float in [lo, hi) drawn from one call of r. */
export const range = (r: Rng, lo: number, hi: number): number => lo + (hi - lo) * r();

/** One element drawn uniformly from items with one call of r; throws RangeError on an empty list. */
export function pick<T>(r: Rng, items: readonly T[]): T {
  if (items.length === 0) {
    throw new RangeError('pick: items must not be empty');
  }
  return items[Math.floor(r() * items.length)] as T;
}
