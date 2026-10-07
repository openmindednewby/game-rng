import * as api from './index';

describe('index', () => {
  it('with the package entry, exposes the runtime API', () => {
    const result = Object.keys(api).sort();

    expect(result).toEqual(['createRng', 'dailySeed', 'hashString', 'mulberry32', 'pick', 'randomSeed', 'range']);
  });
});
