// Idempotent seeder. Runs on server boot. If the DB is empty, it inserts:
//  1. the admin user (from env)
//  2. the catalog (services, cabins, clients) — same IDs and data as the
//     dashboard's seed.js so the frontend keeps working unchanged
//  3. optionally, the 12 appointments for the current week (env SEED_APPOINTMENTS)
//
// Safe to call on every boot: the user-insert check short-circuits the rest.

import { env } from '../env.js';
import { db, rawDb } from './client.js';
import { appointments, cabins, clients, services, users } from './schema.js';
import { hashPassword } from '../auth/password.js';
import { addDays, toISODate, weekStart } from '../lib/time.js';

const seedServices = [
  { id: 'ceretta',            title: 'Ceretta',                       durationMinutes: 45,  priceCents: 2500, accent: 'rose' },
  { id: 'ceretta-brasiliana', title: 'Ceretta Brasiliana',            durationMinutes: 40,  priceCents: 4500, accent: 'rose' },
  { id: 'filo-arabo',         title: 'Filo Arabo',                    durationMinutes: 20,  priceCents: 1500, accent: 'sage' },
  { id: 'massaggio',          title: 'Massaggio decontratturante',    durationMinutes: 60,  priceCents: 6000, accent: 'sage' },
  { id: 'manicure',           title: 'Manicure',                      durationMinutes: 45,  priceCents: 3500, accent: 'rose' },
  { id: 'pedicure',           title: 'Pedicure',                      durationMinutes: 60,  priceCents: 4000, accent: 'rose' },
  { id: 'laminazione',        title: 'Laminazione ciglia',            durationMinutes: 45,  priceCents: 5500, accent: 'rose' },
  { id: 'pressoterapia',      title: 'Pressoterapia',                 durationMinutes: 45,  priceCents: 4000, accent: 'sage' },
  { id: 'extension',          title: 'Extension ciglia',              durationMinutes: 120, priceCents: 9000, accent: 'rose' },
];

const seedCabins = [
  { id: 'luna',  name: 'Cabina Luna',  short: 'L', description: 'Viso, laminazione, extension' },
  { id: 'sale',  name: 'Cabina Sale',  short: 'S', description: 'Corpo, massaggi, pressoterapia' },
  { id: 'bosco', name: 'Cabina Bosco', short: 'B', description: 'Mani, piedi, sopracciglia' },
];

const seedClients = [
  { id: 'c1', name: 'Sofia Marchetti',    phone: '345 112 8001', lastVisitIso: '2026-06-28', totalVisits: 14 },
  { id: 'c2', name: 'Giulia Rosi',        phone: '340 558 2210', lastVisitIso: '2026-07-01', totalVisits: 7 },
  { id: 'c3', name: 'Marta Bellini',      phone: '333 901 4477', lastVisitIso: '2026-05-19', totalVisits: 22 },
  { id: 'c4', name: 'Elena Conti',        phone: '348 220 9911', lastVisitIso: '2026-06-12', totalVisits: 4 },
  { id: 'c5', name: 'Francesca De Luca',  phone: '329 776 0033', lastVisitIso: '2026-07-03', totalVisits: 31 },
  { id: 'c6', name: 'Beatrice Romano',    phone: '345 882 1190', lastVisitIso: '2026-06-25', totalVisits: 9 },
  { id: 'c7', name: 'Chiara Vitale',      phone: '333 415 6622', lastVisitIso: '2026-07-04', totalVisits: 18 },
  { id: 'c8', name: 'Anna Pellegrini',    phone: '340 998 1145', lastVisitIso: '2026-04-30', totalVisits: 3 },
];

// 12 appointments for the current week, matching the dashboard seed.
const seedAppointments = [
  { id: 'a01', clientId: 'c1', serviceId: 'pressoterapia',      cabinId: 'sale',  dayOffset: 0, startMinutes: 9 * 60 + 30, status: 'confirmed', notes: 'Seconda seduta del ciclo.' },
  { id: 'a02', clientId: 'c2', serviceId: 'filo-arabo',         cabinId: 'bosco', dayOffset: 0, startMinutes: 10 * 60,      status: 'confirmed' },
  { id: 'a03', clientId: 'c5', serviceId: 'massaggio',          cabinId: 'sale',  dayOffset: 0, startMinutes: 11 * 60,      status: 'confirmed' },
  { id: 'a04', clientId: 'c6', serviceId: 'manicure',           cabinId: 'bosco', dayOffset: 0, startMinutes: 14 * 60,      status: 'proposed',  notes: 'Vuole smalto nude.' },
  { id: 'a05', clientId: 'c3', serviceId: 'extension',          cabinId: 'luna',  dayOffset: 1, startMinutes: 9 * 60,       status: 'confirmed' },
  { id: 'a06', clientId: 'c7', serviceId: 'ceretta',            cabinId: 'luna',  dayOffset: 1, startMinutes: 11 * 60 + 30, status: 'confirmed' },
  { id: 'a07', clientId: 'c4', serviceId: 'laminazione',        cabinId: 'luna',  dayOffset: 1, startMinutes: 15 * 60,      status: 'in_corso' },
  { id: 'a08', clientId: 'c5', serviceId: 'massaggio',          cabinId: 'sale',  dayOffset: 2, startMinutes: 10 * 60,      status: 'confirmed' },
  { id: 'a09', clientId: 'c8', serviceId: 'pedicure',           cabinId: 'bosco', dayOffset: 2, startMinutes: 14 * 60 + 30, status: 'proposed' },
  { id: 'a10', clientId: 'c1', serviceId: 'ceretta-brasiliana', cabinId: 'luna',  dayOffset: 3, startMinutes: 9 * 60 + 30,  status: 'confirmed' },
  { id: 'a11', clientId: 'c2', serviceId: 'manicure',           cabinId: 'bosco', dayOffset: 3, startMinutes: 16 * 60,      status: 'confirmed' },
  { id: 'a12', clientId: 'c3', serviceId: 'pressoterapia',      cabinId: 'sale',  dayOffset: 4, startMinutes: 11 * 60,      status: 'cancelled', notes: 'Cancellato per influenza.' },
];

export async function seedIfEmpty(): Promise<{ seeded: boolean; userEmail?: string }> {
  const existing = db.select().from(users).limit(1).all();
  if (existing.length > 0) return { seeded: false };

  console.log('[seed] DB vuoto, popolo con dati iniziali…');

  // 1. admin user
  const passwordHash = await hashPassword(env.adminPassword);
  db.insert(users)
    .values({
      email: env.adminEmail,
      passwordHash,
      name: 'Lunarda Bianchi',
    })
    .run();

  // 2. catalog
  db.insert(services).values(seedServices).run();
  db.insert(cabins).values(seedCabins).run();
  db.insert(clients).values(seedClients).run();

  // 3. optional appointments for the current week
  if (env.seedAppointments) {
    const monday = weekStart(new Date());
    const toDate = (offset: number) => toISODate(addDays(monday, offset));
    db.insert(appointments)
      .values(
        seedAppointments.map((a) => ({
          id: a.id,
          clientId: a.clientId,
          serviceId: a.serviceId,
          cabinId: a.cabinId,
          dateIso: toDate(a.dayOffset),
          startMinutes: a.startMinutes,
          durationMinutes:
            (seedServices as Array<{ id: string; durationMinutes: number }>)
              .find((s) => s.id === a.serviceId)?.durationMinutes ?? 60,
          status: a.status,
          notes: a.notes ?? null,
        }))
      )
      .run();
    console.log(`[seed] Inseriti ${seedAppointments.length} appuntamenti della settimana corrente.`);
  }

  // quick sanity: row count
  const userCount = rawDb.prepare('SELECT COUNT(*) as n FROM users').get() as { n: number };
  console.log(`[seed] Completato. Users: ${userCount.n}. Admin: ${env.adminEmail}`);

  return { seeded: true, userEmail: env.adminEmail };
}
