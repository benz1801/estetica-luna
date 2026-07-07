// /api/appointments — CRUD + range query for the calendar grid.
// Body keys are camelCase (dateISO, startMinutes, durationMinutes) to match
// the dashboard; we convert to snake_case columns on write.

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { and, asc, eq, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../auth/middleware.js';
import {
  appointmentCreateSchema,
  appointmentQuerySchema,
  appointmentUpdateSchema,
} from '../validation/schemas.js';

export const appointmentsRouter = new Hono();

appointmentsRouter.use('*', requireAuth);

type AppointmentRow = typeof schema.appointments.$inferSelect;
type CreateBody = z.infer<typeof appointmentCreateSchema>;
type UpdateBody = z.infer<typeof appointmentUpdateSchema>;
type QueryBody = z.infer<typeof appointmentQuerySchema>;

function shape(a: AppointmentRow) {
  return {
    id: a.id,
    clientId: a.clientId,
    serviceId: a.serviceId,
    cabinId: a.cabinId,
    dateISO: a.dateIso,
    startMinutes: a.startMinutes,
    durationMinutes: a.durationMinutes,
    status: a.status,
    notes: a.notes ?? null,
  };
}

function generateId() {
  // human-readable id, e.g. a01 → a02 … but new ones look like a_l8x3k2.
  // The seed uses `a01..a12`; new IDs start with `a_` to avoid collisions.
  return `a_${Math.random().toString(36).slice(2, 9)}`;
}

appointmentsRouter.get('/', zValidator('query', appointmentQuerySchema), (c) => {
  const { from, to } = c.req.valid('query') as QueryBody;
  const conditions = [];
  if (from) conditions.push(gte(schema.appointments.dateIso, from));
  if (to) conditions.push(lte(schema.appointments.dateIso, to));
  const where = conditions.length ? and(...conditions) : undefined;
  const rows = db
    .select()
    .from(schema.appointments)
    .where(where)
    .orderBy(asc(schema.appointments.dateIso), asc(schema.appointments.startMinutes))
    .all();
  return c.json({ appointments: rows.map(shape) });
});

appointmentsRouter.post('/', zValidator('json', appointmentCreateSchema), (c) => {
  const data = c.req.valid('json') as CreateBody;
  const id = generateId();
  db.insert(schema.appointments)
    .values({
      id,
      clientId: data.clientId,
      serviceId: data.serviceId,
      cabinId: data.cabinId,
      dateIso: data.dateISO,
      startMinutes: data.startMinutes,
      durationMinutes: data.durationMinutes,
      status: data.status ?? 'confirmed',
      notes: data.notes ?? null,
    })
    .run();
  const row = db
    .select()
    .from(schema.appointments)
    .where(eq(schema.appointments.id, id))
    .get();
  return c.json({ appointment: shape(row!) }, 201);
});

appointmentsRouter.patch(
  '/:id',
  zValidator('json', appointmentUpdateSchema),
  (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('json') as UpdateBody;
    const existing = db
      .select()
      .from(schema.appointments)
      .where(eq(schema.appointments.id, id))
      .get();
    if (!existing) {
      return c.json(
        { error: { code: 'not_found', message: 'Appuntamento non trovato' } },
        404
      );
    }
    const patch: Partial<typeof schema.appointments.$inferInsert> = {};
    if (data.clientId !== undefined) patch.clientId = data.clientId;
    if (data.serviceId !== undefined) patch.serviceId = data.serviceId;
    if (data.cabinId !== undefined) patch.cabinId = data.cabinId;
    if (data.dateISO !== undefined) patch.dateIso = data.dateISO;
    if (data.startMinutes !== undefined) patch.startMinutes = data.startMinutes;
    if (data.durationMinutes !== undefined) patch.durationMinutes = data.durationMinutes;
    if (data.status !== undefined) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;
    patch.updatedAt = new Date().toISOString();
    db.update(schema.appointments)
      .set(patch)
      .where(eq(schema.appointments.id, id))
      .run();
    const row = db
      .select()
      .from(schema.appointments)
      .where(eq(schema.appointments.id, id))
      .get();
    return c.json({ appointment: shape(row!) });
  }
);

appointmentsRouter.delete('/:id', (c) => {
  const id = c.req.param('id');
  const existing = db
    .select()
    .from(schema.appointments)
    .where(eq(schema.appointments.id, id))
    .get();
  if (!existing) {
    return c.json(
      { error: { code: 'not_found', message: 'Appuntamento non trovato' } },
      404
    );
  }
  db.delete(schema.appointments)
    .where(eq(schema.appointments.id, id))
    .run();
  return c.json({ ok: true });
});
