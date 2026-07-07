// Centralised env access. Reads from process.env, with .env loaded once
// at import time from server/.env if present.

import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  jwtSecret: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(6),
  seedAppointments: z.boolean().default(true),
  port: z.coerce.number().int().positive().default(8787),
  databasePath: z.string().min(1).default('./data.db'),
});

const parsed = schema.safeParse({
  jwtSecret: process.env.JWT_SECRET ?? 'dev-insecure-secret-change-me-please-32+',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@esteticaluna.local',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'cambiami-subito',
  seedAppointments: (process.env.SEED_APPOINTMENTS ?? 'true').toLowerCase() === 'true',
  port: process.env.PORT ?? 8787,
  databasePath: process.env.DATABASE_PATH ?? './data.db',
});

if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
