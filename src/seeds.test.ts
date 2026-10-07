import { dailySeed, randomSeed } from './seeds';

describe('dailySeed', () => {
  it('with a late-evening UTC date, returns the UTC calendar day', () => {
    const date = new Date('2026-10-08T23:59:59.000Z');

    const result = dailySeed(date);

    expect(result).toBe('daily-2026-10-08');
  });

  it('with no date, uses the current time', () => {
    jest.useFakeTimers().setSystemTime(new Date('2027-01-02T03:04:05.000Z'));

    const result = dailySeed();

    jest.useRealTimers();
    expect(result).toBe('daily-2027-01-02');
  });
});

describe('randomSeed', () => {
  afterEach(() => jest.restoreAllMocks());

  it('with Math.random at 0.5, returns run- plus 500000000 in base 36', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const result = randomSeed();

    expect(result).toBe('run-' + (500000000).toString(36));
  });
});
