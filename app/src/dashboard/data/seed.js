// Mock data for the dashboard. Phase 1 — no backend yet.
// IMPORTANT: services here mirror the site catalog in
// src/components/Services.jsx (subset, normalized to a single durationMinutes).
// Appointments are seeded relative to the *current* week so the dashboard
// always shows "live" data the first time you open it.

import { addDays, toISODate, weekStart } from '../lib/time';

// ─────────────────────────────────────────────────────────────
// Catalog
// ─────────────────────────────────────────────────────────────

export const services = [
  {
    id: 'ceretta',
    title: 'Ceretta',
    durationMinutes: 45,
    price: 25,
    accent: 'rose',
  },
  {
    id: 'ceretta-brasiliana',
    title: 'Ceretta Brasiliana',
    durationMinutes: 40,
    price: 45,
    accent: 'rose',
  },
  {
    id: 'filo-arabo',
    title: 'Filo Arabo',
    durationMinutes: 20,
    price: 15,
    accent: 'sage',
  },
  {
    id: 'massaggio',
    title: 'Massaggio decontratturante',
    durationMinutes: 60,
    price: 60,
    accent: 'sage',
  },
  {
    id: 'manicure',
    title: 'Manicure',
    durationMinutes: 45,
    price: 35,
    accent: 'rose',
  },
  {
    id: 'pedicure',
    title: 'Pedicure',
    durationMinutes: 60,
    price: 40,
    accent: 'rose',
  },
  {
    id: 'laminazione',
    title: 'Laminazione ciglia',
    durationMinutes: 45,
    price: 55,
    accent: 'rose',
  },
  {
    id: 'pressoterapia',
    title: 'Pressoterapia',
    durationMinutes: 45,
    price: 40,
    accent: 'sage',
  },
  {
    id: 'extension',
    title: 'Extension ciglia',
    durationMinutes: 120,
    price: 90,
    accent: 'rose',
  },
];

// ─────────────────────────────────────────────────────────────
// Cabins
// ─────────────────────────────────────────────────────────────

export const cabins = [
  {
    id: 'luna',
    name: 'Cabina Luna',
    short: 'L',
    desc: 'Viso, laminazione, extension',
  },
  {
    id: 'sale',
    name: 'Cabina Sale',
    short: 'S',
    desc: 'Corpo, massaggi, pressoterapia',
  },
  {
    id: 'bosco',
    name: 'Cabina Bosco',
    short: 'B',
    desc: 'Mani, piedi, sopracciglia',
  },
];

// ─────────────────────────────────────────────────────────────
// Clients
// ─────────────────────────────────────────────────────────────

export const clients = [
  { id: 'c1', name: 'Sofia Marchetti',     phone: '345 112 8001', lastVisit: '2026-06-28', totalVisits: 14 },
  { id: 'c2', name: 'Giulia Rosi',         phone: '340 558 2210', lastVisit: '2026-07-01', totalVisits: 7 },
  { id: 'c3', name: 'Marta Bellini',       phone: '333 901 4477', lastVisit: '2026-05-19', totalVisits: 22 },
  { id: 'c4', name: 'Elena Conti',         phone: '348 220 9911', lastVisit: '2026-06-12', totalVisits: 4 },
  { id: 'c5', name: 'Francesca De Luca',   phone: '329 776 0033', lastVisit: '2026-07-03', totalVisits: 31 },
  { id: 'c6', name: 'Beatrice Romano',     phone: '345 882 1190', lastVisit: '2026-06-25', totalVisits: 9 },
  { id: 'c7', name: 'Chiara Vitale',       phone: '333 415 6622', lastVisit: '2026-07-04', totalVisits: 18 },
  { id: 'c8', name: 'Anna Pellegrini',     phone: '340 998 1145', lastVisit: '2026-04-30', totalVisits: 3 },
];

// ─────────────────────────────────────────────────────────────
// Appointments — relative to current week (Monday 00:00).
// Each entry: { id, clientId, serviceId, cabinId, dayOffset (0=Mon..6=Sun),
//              startMinutes, status, notes? }
// ─────────────────────────────────────────────────────────────

// `referenceMonday` is computed at module load — keeps the seed honest
// across page reloads. If the host clock changes, refresh the page.
const refMonday = weekStart(new Date());
const iso = (offset) => toISODate(addDays(refMonday, offset));

export const seedAppointments = [
  // ── lunedì (offset 0) ─────────────────────────────
  { id: 'a01', clientId: 'c1', serviceId: 'pressoterapia',    cabinId: 'sale',  dayOffset: 0, startMinutes: 9 * 60 + 30, status: 'confirmed', notes: 'Seconda seduta del ciclo.' },
  { id: 'a02', clientId: 'c2', serviceId: 'filo-arabo',       cabinId: 'bosco', dayOffset: 0, startMinutes: 10 * 60,      status: 'confirmed' },
  { id: 'a03', clientId: 'c5', serviceId: 'massaggio',        cabinId: 'sale',  dayOffset: 0, startMinutes: 11 * 60,      status: 'confirmed' },
  { id: 'a04', clientId: 'c6', serviceId: 'manicure',         cabinId: 'bosco', dayOffset: 0, startMinutes: 14 * 60,      status: 'proposed',  notes: 'Vuole smalto nude.' },

  // ── martedì (offset 1) ────────────────────────────
  { id: 'a05', clientId: 'c3', serviceId: 'extension',        cabinId: 'luna',  dayOffset: 1, startMinutes: 9 * 60,       status: 'confirmed' },
  { id: 'a06', clientId: 'c7', serviceId: 'ceretta',          cabinId: 'luna',  dayOffset: 1, startMinutes: 11 * 60 + 30, status: 'confirmed' },
  { id: 'a07', clientId: 'c4', serviceId: 'laminazione',      cabinId: 'luna',  dayOffset: 1, startMinutes: 15 * 60,      status: 'in_corso' },

  // ── mercoledì (offset 2) ──────────────────────────
  { id: 'a08', clientId: 'c5', serviceId: 'massaggio',        cabinId: 'sale',  dayOffset: 2, startMinutes: 10 * 60,      status: 'confirmed' },
  { id: 'a09', clientId: 'c8', serviceId: 'pedicure',         cabinId: 'bosco', dayOffset: 2, startMinutes: 14 * 60 + 30, status: 'proposed' },

  // ── giovedì (offset 3) ────────────────────────────
  { id: 'a10', clientId: 'c1', serviceId: 'ceretta-brasiliana', cabinId: 'luna', dayOffset: 3, startMinutes: 9 * 60 + 30, status: 'confirmed' },
  { id: 'a11', clientId: 'c2', serviceId: 'manicure',         cabinId: 'bosco', dayOffset: 3, startMinutes: 16 * 60,      status: 'confirmed' },

  // ── venerdì (offset 4) ────────────────────────────
  { id: 'a12', clientId: 'c3', serviceId: 'pressoterapia',    cabinId: 'sale',  dayOffset: 4, startMinutes: 11 * 60,      status: 'cancelled', notes: 'Cancellato per influenza.' },
];

// Decorate appointments with a computed `dateISO` so consumers don't
// re-derive it from dayOffset each time.
export function hydrateAppointments(list) {
  return list.map((a) => ({ ...a, dateISO: iso(a.dayOffset) }));
}

/** Returns the ISO date of the Monday of the current week. */
export function getReferenceMondayISO() {
  return iso(0);
}
