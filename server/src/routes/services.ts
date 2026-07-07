// /api/services — read-only catalog (CRD stub: no update/delete in v1 since
// the dashboard doesn't edit services yet). The Trattamenti view is still a
// placeholder — endpoints are here for the next phase.

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../auth/middleware.js';
import { serviceCreateSchema } from '../validation/schemas.js';

export const servicesRouter = new Hono();

servicesRouter.use('*', requireAuth);

type CreateBody = z.infer<typeof serviceCreateSchema>;

servicesRouter.get('/', (c) => {
  const rows = db.select().from(schema.services).all();
  return c.json({
    services: rows.map((s) => ({
      id: s.id,
      title: s.title,
      durationMinutes: s.durationMinutes,
      priceCents: s.priceCents,
      accent: s.accent,
    })),
  });
});

servicesRouter.post('/', zValidator('json', serviceCreateSchema), (c) => {
  const data = c.req.valid('json') as CreateBody;
  db.insert(schema.services)
    .values({
      id: data.id,
      title: data.title,
      durationMinutes: data.durationMinutes,
      priceCents: data.priceCents,
      accent: data.accent ?? 'sage',
    })
    .run();
  return c.json({ service: { ...data, accent: data.accent ?? 'sage' } }, 201);
});
