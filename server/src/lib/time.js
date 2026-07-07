// Time helpers used by the seeder. Mirrors the dashboard's
// `app/src/dashboard/lib/time.js` for weekStart/addDays/toISODate — the
// server only needs the date-arithmetic bits, not the Italian formatters.
//
// Calendar model: local time, Monday-anchored week. Single studio, single
// timezone — no UTC drift.

/** Returns the Monday (00:00 local) of the week that contains `date`. */
export function weekStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun .. 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

/** Returns a new Date shifted by `days` days. */
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Returns the ISO date (YYYY-MM-DD) for a Date, local timezone. */
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
