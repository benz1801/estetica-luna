// /api/cabins — read-only catalog for v1. Same shape the dashboard already
// consumes: { id, name, short, desc } (note: `desc`, not `description`).

import { Hono } from 'hono';
import { db, schema } from '../db/client.js';
import { requireAuth } from '../auth/middleware.js';

export const cabinsRouter = new Hono();

cabinsRouter.use('*', requireAuth);

cabinsRouter.get('/', (c) => {
  const rows = db.select().from(schema.cabins).all();
  return c.json({
    cabins: rows.map((c) => ({
      id: c.id,
      name: c.name,
      short: c.short,
      desc: c.description,
    })),
  });
});
