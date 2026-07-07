// /api/clients — full CRUD. The Clienti view in the dashboard is still a
// placeholder in v1, but the endpoints are wired so the next phase can
// plug them in without touching the server.

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../auth/middleware.js';
import { clientCreateSchema, clientUpdateSchema } from '../validation/schemas.js';

export const clientsRouter = new Hono();

clientsRouter.use('*', requireAuth);

type ClientRow = typeof schema.clients.$inferSelect;
type CreateBody = z.infer<typeof clientCreateSchema>;
type UpdateBody = z.infer<typeof clientUpdateSchema>;

function shape(c: ClientRow) {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    lastVisit: c.lastVisitIso ?? null,
    totalVisits: c.totalVisits,
  };
}

clientsRouter.get('/', (c) => {
  const rows = db.select().from(schema.clients).all();
  return c.json({ clients: rows.map(shape) });
});

clientsRouter.post('/', zValidator('json', clientCreateSchema), (c) => {
  const data = c.req.valid('json') as CreateBody;
  db.insert(schema.clients)
    .values({
      id: data.id,
      name: data.name,
      phone: data.phone ?? '',
      lastVisitIso: data.lastVisitIso ?? null,
      totalVisits: data.totalVisits ?? 0,
    })
    .run();
  return c.json({ client: shape({
    id: data.id,
    name: data.name,
    phone: data.phone ?? '',
    lastVisitIso: data.lastVisitIso ?? null,
    totalVisits: data.totalVisits ?? 0,
  } as ClientRow) }, 201);
});

clientsRouter.patch('/:id', zValidator('json', clientUpdateSchema), (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json') as UpdateBody;
  const existing = db.select().from(schema.clients).where(eq(schema.clients.id, id)).get();
  if (!existing) {
    return c.json({ error: { code: 'not_found', message: 'Cliente non trovato' } }, 404);
  }
  const patch: Partial<typeof schema.clients.$inferInsert> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.phone !== undefined) patch.phone = data.phone;
  if (data.lastVisitIso !== undefined) patch.lastVisitIso = data.lastVisitIso;
  if (data.totalVisits !== undefined) patch.totalVisits = data.totalVisits;
  db.update(schema.clients).set(patch).where(eq(schema.clients.id, id)).run();
  const updated = db.select().from(schema.clients).where(eq(schema.clients.id, id)).get();
  return c.json({ client: shape(updated!) });
});

clientsRouter.delete('/:id', (c) => {
  const id = c.req.param('id');
  const existing = db.select().from(schema.clients).where(eq(schema.clients.id, id)).get();
  if (!existing) {
    return c.json({ error: { code: 'not_found', message: 'Cliente non trovato' } }, 404);
  }
  db.delete(schema.clients).where(eq(schema.clients.id, id)).run();
  return c.json({ ok: true });
});
