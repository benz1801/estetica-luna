// JWT sign/verify with HS256, 12h expiry. Token claim is minimal:
// { sub: userId, email }.
import { SignJWT, jwtVerify } from 'jose';
import { env } from '../env.js';

const SECRET = new TextEncoder().encode(env.jwtSecret);
const ALG = 'HS256';
const EXP = '12h';

export type JwtPayload = { sub: number; email: string };

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setSubject(String(payload.sub))
    .setIssuedAt()
    .setExpirationTime(EXP)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, SECRET, { algorithms: [ALG] });
  return {
    sub: Number(payload.sub),
    email: String(payload.email ?? ''),
  };
}
