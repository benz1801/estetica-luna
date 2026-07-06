// Time helpers for the dashboard calendar.
// All times are stored as "minutes from midnight" (integer) to keep the grid math
// trivial: each row is 60 minutes, startMinutes aligns to row top, height is
// (durationMinutes / 60) * rowHeight.

/** Returns the Monday (00:00) of the week that contains `date`. */
export function weekStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun .. 6=Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
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

/** Parses a "HH:MM" string into minutes from midnight. */
export function parseHHMM(s) {
  const [h, m] = s.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Formats minutes-from-midnight as "HH:MM". */
export function formatHour(min) {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/** "HH:MM — HH:MM" given start and duration in minutes. */
export function formatRange(startMin, durationMin) {
  return `${formatHour(startMin)} — ${formatHour(startMin + durationMin)}`;
}

/** Day of week 0..6 starting Monday (0=Lun, 6=Dom). */
export function isoWeekdayMonFirst(date) {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}

/** Italian long date e.g. "Lunedì 6 luglio". */
export function formatItalianLong(date) {
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Italian short day e.g. "lun". */
export function formatItalianWeekdayShort(date) {
  return date.toLocaleDateString('it-IT', { weekday: 'short' }).replace('.', '');
}

/** Italian month name e.g. "luglio". */
export function formatItalianMonth(date) {
  return date.toLocaleDateString('it-IT', { month: 'long' });
}

/** "HH:MM" formatted from a Date (now). */
export function formatClockTime(date) {
  return date.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Italian week number (rough — sufficient for label). */
export function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/** Returns true if two intervals overlap (a.start < b.end AND b.start < a.end). */
export function overlaps(a, b) {
  return a.start < b.start + b.duration && b.start < a.start + a.duration;
}
