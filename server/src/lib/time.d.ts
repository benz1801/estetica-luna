// Type declarations for the JS-only time helpers, so TS files (like
// `db/seed.ts`) can import them without losing type-safety.
export function weekStart(date: Date): Date;
export function addDays(date: Date, days: number): Date;
export function toISODate(date: Date): string;
