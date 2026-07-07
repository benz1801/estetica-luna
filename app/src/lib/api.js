// Minimal fetch client. The dev proxy in vite.config.js takes care of
// forwarding /api/* to the Hono server, so the base URL is just the
// Vite origin (no env var needed in dev). For production builds served
// from the same origin, this works as-is; for cross-origin deploys, set
// VITE_API_BASE in app/.env.

import { getToken } from './auth.js';

const BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error?.message ?? `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.code = data?.error?.code;
    throw err;
  }
  return data;
}

export const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  delete: (path)       => request('DELETE', path),
};
