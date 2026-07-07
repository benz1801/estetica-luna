// Login form. Visual language matches the landing (cream / sage / bronze).
// On success stores the JWT in localStorage via `setToken` and redirects
// to /dashboard. App.jsx handles the actual auth guard for protected routes.

import { useState } from 'react';
import { api } from '../lib/api.js';
import { setToken } from '../lib/auth.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { token } = await api.post('/api/auth/login', { email, password });
      setToken(token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Accesso non riuscito');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-ink-900/8 bg-cream-100/55 p-8 shadow-soft sm:p-10">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-botanical-900">
            <img src="/luna.svg" alt="" className="h-8 w-8 rotate-45" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-xl text-ink-900">Estetica Luna</p>
            <p className="text-[10px] uppercase tracking-widest2 text-ink-500">
              Dashboard gestionale
            </p>
          </div>
        </div>

        <p className="eyebrow mb-2">
          <span className="h-px w-6 bg-bronze-500/70" />
          <span>Accesso</span>
        </p>
        <h1 className="mb-6 font-display text-2xl text-ink-900 sm:text-3xl">
          Bentornata, Lunarda.
        </h1>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-ink-500">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream-50 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
              placeholder="admin@esteticaluna.local"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-ink-500">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/10 bg-cream-50 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-2.5 text-[12px] text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-sage-700 px-5 py-3 text-[11px] uppercase tracking-widest2 text-cream-50 transition-colors hover:bg-sage-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Accesso in corso…' : 'Entra nella dashboard'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] uppercase tracking-widest2 text-ink-500">
          <a href="/" className="hover:text-sage-700">
            ← Torna al sito
          </a>
        </p>
      </div>
    </div>
  );
}
