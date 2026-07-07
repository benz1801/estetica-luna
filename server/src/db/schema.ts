// DB schema for Estetica Luna — gestionale.
// Mirrors the shape of app/src/dashboard/data/seed.js so the frontend
// (services/cabins/clients/appointments) can keep using the same keys.
//
// Time model: the dashboard uses minutes-from-midnight + a local YYYY-MM-DD
// string. We keep that here — single studio, single timezone, no UTC drift.

import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

const APPOINTMENT_STATUSES = ['proposed', 'confirmed', 'in_corso', 'completed', 'cancelled'];

// ─────────────────────────────────────────────────────────────
// users
// ─────────────────────────────────────────────────────────────
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name').notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    emailIdx: uniqueIndex('users_email_idx').on(t.email),
  })
);

// ─────────────────────────────────────────────────────────────
// services (catalogo rituali)
// ─────────────────────────────────────────────────────────────
export const services = sqliteTable('services', {
  id: text('id').primaryKey(), // slug, e.g. "ceretta"
  title: text('title').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  priceCents: integer('price_cents').notNull(),
  accent: text('accent').notNull().default('sage'), // 'rose' | 'sage'
});

// ─────────────────────────────────────────────────────────────
// cabins
// ─────────────────────────────────────────────────────────────
export const cabins = sqliteTable('cabins', {
  id: text('id').primaryKey(), // slug, e.g. "luna"
  name: text('name').notNull(),
  short: text('short').notNull(),
  description: text('description').notNull().default(''),
});

// ─────────────────────────────────────────────────────────────
// clients
// ─────────────────────────────────────────────────────────────
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(), // slug, e.g. "c1"
  name: text('name').notNull(),
  phone: text('phone').notNull().default(''),
  lastVisitIso: text('last_visit_iso'),
  totalVisits: integer('total_visits').notNull().default(0),
});

// ─────────────────────────────────────────────────────────────
// appointments
// ─────────────────────────────────────────────────────────────
export const appointments = sqliteTable(
  'appointments',
  {
    id: text('id').primaryKey(), // human-readable id, e.g. "a01"
    clientId: text('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
    serviceId: text('service_id')
      .notNull()
      .references(() => services.id, { onDelete: 'restrict' }),
    cabinId: text('cabin_id')
      .notNull()
      .references(() => cabins.id, { onDelete: 'restrict' }),
    dateIso: text('date_iso').notNull(), // 'YYYY-MM-DD' locale
    startMinutes: integer('start_minutes').notNull(), // 0..1439
    durationMinutes: integer('duration_minutes').notNull(),
    status: text('status').notNull().default('confirmed'),
    notes: text('notes'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ({
    dateCabinIdx: index('appts_date_cabin_idx').on(t.dateIso, t.cabinId),
    clientIdx: index('appts_client_idx').on(t.clientId),
    statusChk: check(
      'appts_status_chk',
      sql`${t.status} IN ('proposed','confirmed','in_corso','completed','cancelled')`
    ),
  })
);

export const APPOINTMENT_STATUS_LIST = APPOINTMENT_STATUSES;
