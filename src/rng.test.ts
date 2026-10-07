import golden from './goldenVectors.json';
import { createRng, hashString, mulberry32, pick, range } from './rng';

const OUTPUTS = 10;
const take = (rng: () => number): number[] => Array.from({ length: OUTPUTS }, () => rng());

describe('hashString', () => {
  it.each(golden.strings)('with seed "$seed", returns the Surge FNV-1a hash', ({ seed, hash }) => {
    const result = hashString(seed);

    expect(result).toBe(hash);
  });
});

describe('createRng', () => {
  it.each(golden.strings)('with string seed "$seed", yields the first 10 Surge outputs', ({ seed, outputs }) => {
    const rng = createRng(seed);

    const result = take(rng);

    expect(result).toEqual(outputs);
  });

  it.each(golden.numbers)('with numeric seed $seed, yields the first 10 Surge outputs', ({ seed, outputs }) => {
    const rng = createRng(seed);

    const result = take(rng);

    expect(result).toEqual(outputs);
  });
});

describe('mulberry32', () => {
  it.each(golden.numbers)('with seed $seed, yields the first 10 Surge outputs', ({ seed, outputs }) => {
    const rng = mulberry32(seed);

    const result = take(rng);

    expect(result).toEqual(outputs);
  });

  it('with two generators on one seed, yields independent identical sequences', () => {
    const first = mulberry32(7);
    const second = mulberry32(7);
    first();

    const result = [first(), second(), second()];

    expect(result[0]).toBe(result[2]);
  });
});

describe('range', () => {
  it('with r returning 0.25 over [10, 20), returns 12.5', () => {
    const r = (): number => 0.25;

    const result = range(r, 10, 20);

    expect(result).toBe(12.5);
  });
});

describe('pick', () => {
  it('with r returning 0.5 over three items, returns the middle item', () => {
    const r = (): number => 0.5;

    const result = pick(r, ['a', 'b', 'c']);

    expect(result).toBe('b');
  });

  it('with r just below 1, returns the last item', () => {
    const r = (): number => 0.9999999;

    const result = pick(r, [1, 2, 3, 4]);

    expect(result).toBe(4);
  });

  it('with an empty list, throws RangeError without consuming r', () => {
    const r = jest.fn(() => 0.5);

    const act = (): unknown => pick(r, []);

    expect(act).toThrow(RangeError);
    expect(r).not.toHaveBeenCalled();
  });
});
