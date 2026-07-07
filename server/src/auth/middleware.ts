// Bearer-token middleware. Verifies the JWT, attaches { id, email } to
// context, otherwise returns 401. Used by every protected route.

import type { Context, Next } from 'hono';
import { verifyToken, type JwtPayload } from './jwt.js';

export type AuthUser = { id: number; email: string };

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export async function requireAuth(c: Context, next: Next) {
  const header = c.req.header('authorization') ?? '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) {
    return c.json({ error: { code: 'unauthorized', message: 'Missing bearer token' } }, 401);
  }
  try {
    const payload: JwtPayload = await verifyToken(m[1]);
    c.set('user', { id: payload.sub, email: payload.email });
  } catch {
    return c.json({ error: { code: 'unauthorized', message: 'Invalid or expired token' } }, 401);
  }
  await next();
}
