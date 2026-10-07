const ISO_DATE_LENGTH = 10;
const RANDOM_SEED_SPAN = 1e9;
const BASE36 = 36;

/** The daily-run seed for the UTC calendar day of date, e.g. "daily-2026-10-08". */
export function dailySeed(date: Date = new Date()): string {
  return 'daily-' + date.toISOString().slice(0, ISO_DATE_LENGTH);
}

/** A fresh non-deterministic run seed, e.g. "run-abc123". */
export function randomSeed(): string {
  return 'run-' + Math.floor(Math.random() * RANDOM_SEED_SPAN).toString(BASE36);
}
