// Hono entry point. Boots the SQLite DB, applies the migration on first run
// (idempotent — uses CREATE TABLE IF NOT EXISTS, see below), runs the
// idempotent seeder, then mounts the API.

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { env } from './env.js';
import { rawDb } from './db/client.js';
import { seedIfEmpty } from './db/seed.js';
import { authRouter } from './routes/auth.js';
import { servicesRouter } from './routes/services.js';
import { cabinsRouter } from './routes/cabins.js';
import { clientsRouter } from './routes/clients.js';
import { appointmentsRouter } from './routes/appointments.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Migrations ────────────────────────────────────────────────
// Apply every .sql file under ./drizzle/ that hasn't been applied yet.
// We track applied migrations in a meta table. The migration files are the
// ones drizzle-kit generates — we don't try to parse them, just split on
// the marker and run each statement.
function applyMigrations() {
  const drizzleDir = resolve(__dirname, '..', 'drizzle');
  let files = [];
  try {
    files = readdirSync(drizzleDir).filter((f) => f.endsWith('.sql')).sort();
  } catch {
    console.log('[migrate] nessuna cartella drizzle, skip.');
    return;
  }
  if (files.length === 0) return;

  rawDb.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );
  `);
  const applied = new Set(
    (rawDb.prepare('SELECT name FROM _migrations').all() as { name: string }[]).map((r) => r.name)
  );

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = readFileSync(join(drizzleDir, file), 'utf8');
    const statements = sql
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter(Boolean);
    const tx = rawDb.transaction(() => {
      for (const stmt of statements) rawDb.exec(stmt);
      rawDb.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
    });
    tx();
    console.log(`[migrate] applicata ${file}`);
  }
}

// ── App ───────────────────────────────────────────────────────
const app = new Hono();

app.get('/api/health', (c) => c.json({ ok: true }));

app.route('/api/auth', authRouter);
app.route('/api/services', servicesRouter);
app.route('/api/cabins', cabinsRouter);
app.route('/api/clients', clientsRouter);
app.route('/api/appointments', appointmentsRouter);

// Centralised error handler — never leaks stacks to the client.
app.onError((err, c) => {
  console.error('[err]', err);
  return c.json(
    { error: { code: 'internal_error', message: 'Errore interno del server' } },
    500
  );
});

app.notFound((c) =>
  c.json({ error: { code: 'not_found', message: 'Risorsa non trovata' } }, 404)
);

// ── Boot ──────────────────────────────────────────────────────
async function main() {
  try {
    applyMigrations();
  } catch (e) {
    console.error('[migrate] fallita:', e);
    process.exit(1);
  }
  try {
    const result = await seedIfEmpty();
    if (result.seeded) {
      console.log(`[seed] OK. Admin: ${result.userEmail}`);
    } else {
      console.log('[seed] DB già popolato, skip.');
    }
  } catch (e) {
    console.error('[seed] fallita:', e);
    process.exit(1);
  }

  serve({ fetch: app.fetch, port: env.port }, (info) => {
    console.log(`[server] Hono in ascolto su http://localhost:${info.port}`);
  });
}

main();
