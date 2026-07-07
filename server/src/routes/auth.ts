// /api/auth — login + token validation. Token issued as 12h JWT.
// Login is the only public endpoint; /me needs the bearer token.

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '../db/client.js';
import { verifyPassword } from '../auth/password.js';
import { signToken } from '../auth/jwt.js';
import { requireAuth } from '../auth/middleware.js';
import { loginSchema } from '../validation/schemas.js';

export const authRouter = new Hono();

type LoginBody = z.infer<typeof loginSchema>;

authRouter.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json') as LoginBody;
  const user = db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)
    .get();

  if (!user) {
    return c.json({ error: { code: 'invalid_credentials', message: 'Email o password non valide' } }, 401);
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return c.json({ error: { code: 'invalid_credentials', message: 'Email o password non valide' } }, 401);
  }

  const token = await signToken({ sub: user.id, email: user.email });
  return c.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

authRouter.get('/me', requireAuth, (c) => {
  const u = c.get('user');
  return c.json({ user: u });
});
