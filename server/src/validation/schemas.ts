// zod schemas for request bodies. Used by Hono's zValidator middleware.
// Field names are camelCase to match the JSON shape the frontend already
// uses (startMinutes, dateISO, etc.). Convert to DB columns in the routes.

import { z } from 'zod';
import { APPOINTMENT_STATUS_LIST } from '../db/schema.js';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD');
const slug = z
  .string()
  .min(1)
  .max(40)
  .regex(/^[a-z0-9-]+$/, 'lowercase letters, digits, dashes only');

const minutesFromMidnight = z.number().int().min(0).max(24 * 60 - 1);
const durationMinutes = z.number().int().min(5).max(8 * 60);

const appointmentStatus = z.enum(APPOINTMENT_STATUS_LIST as [string, ...string[]]);

// ─── auth ──────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── services ──────────────────────────────────────────────
export const serviceCreateSchema = z.object({
  id: slug,
  title: z.string().min(1),
  durationMinutes: durationMinutes,
  priceCents: z.number().int().nonnegative(),
  accent: z.enum(['rose', 'sage']).default('sage'),
});
export const serviceUpdateSchema = serviceCreateSchema.partial();

// ─── cabins ────────────────────────────────────────────────
export const cabinCreateSchema = z.object({
  id: slug,
  name: z.string().min(1),
  short: z.string().min(1).max(3),
  description: z.string().default(''),
});
export const cabinUpdateSchema = cabinCreateSchema.partial();

// ─── clients ───────────────────────────────────────────────
export const clientCreateSchema = z.object({
  id: slug,
  name: z.string().min(1),
  phone: z.string().default(''),
  lastVisitIso: isoDate.nullable().optional(),
  totalVisits: z.number().int().nonnegative().default(0),
});
export const clientUpdateSchema = clientCreateSchema.partial();

// ─── appointments ──────────────────────────────────────────
export const appointmentCreateSchema = z.object({
  clientId: z.string().min(1),
  serviceId: z.string().min(1),
  cabinId: z.string().min(1),
  dateISO: isoDate,
  startMinutes: minutesFromMidnight,
  durationMinutes: durationMinutes,
  status: appointmentStatus.default('confirmed'),
  notes: z.string().nullable().optional(),
});
export const appointmentUpdateSchema = appointmentCreateSchema.partial();

// ─── list queries ──────────────────────────────────────────
export const appointmentQuerySchema = z.object({
  from: isoDate.optional(),
  to: isoDate.optional(),
});
