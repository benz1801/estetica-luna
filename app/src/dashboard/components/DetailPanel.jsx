import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NotebookPen, X } from 'lucide-react';
import LunarDot from './LunarDot';
import { stateTokens } from '../lib/stateColors';
import { formatHour } from '../lib/time';

const MEMO_KEY = 'estetica-luna.dashboard.memo';

/**
 * DetailPanel — right column (collapsible) of the dashboard.
 * 3 sections stacked:
 *   1. KPI rapidi: incasso stimato, confermati, da confermare
 *   2. Timeline del giorno: lista appuntamenti in ordine cronologico
 *   3. Memo del giorno: textarea, salvata in localStorage
 */
export default function DetailPanel({
  dateISO,
  appointments,
  services,
  clients,
  onAppointmentClick,
  onClose,
}) {
  const [memo, setMemo] = useState(() => {
    try { return localStorage.getItem(MEMO_KEY) || ''; } catch { return ''; }
  });

  useEffect(() => {
    try { localStorage.setItem(MEMO_KEY, memo); } catch { /* ignore */ }
  }, [memo]);

  const dayAppts = appointments
    .filter((a) => a.dateISO === dateISO)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  // KPI
  const confirmed = dayAppts.filter((a) => a.status === 'confirmed' || a.status === 'in_corso');
  const proposed  = dayAppts.filter((a) => a.status === 'proposed');
  const revenue   = dayAppts
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (services.find((s) => s.id === a.serviceId)?.price || 0), 0);
  const minutes   = dayAppts
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (services.find((s) => s.id === a.serviceId)?.durationMinutes || 0), 0);
  const hoursBooked = Math.floor(minutes / 60);
  const minutesBooked = minutes % 60;

  return (
    <aside
      className="
        flex h-full w-full flex-col
        border-l border-ink-900/8 bg-cream-50
        lg:w-[340px] lg:flex-none
      "
      aria-label="Dettaglio giornata"
    >
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-start justify-between border-b border-ink-900/8 px-5 pb-4 pt-5">
        <div>
          <p className="eyebrow">
            <span className="h-px w-6 bg-bronze-500/70" />
            <span>La giornata</span>
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink-900">
            {dayAppts.length} {dayAppts.length === 1 ? 'rituale' : 'rituali'}
          </h2>
          <p className="mt-1 text-[12px] text-ink-500">
            {hoursBooked}h{minutesBooked ? `${minutesBooked.toString().padStart(2,'0')}` : ''} prenotate
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi pannello"
            className="grid h-9 w-9 flex-none place-items-center rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── KPI ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 border-b border-ink-900/8 px-5 py-4">
        <Kpi label="Incasso" value={`€ ${revenue}`} />
        <Kpi label="Confermati" value={confirmed.length} />
        <Kpi label="Proposti" value={proposed.length} />
      </div>

      {/* ── Timeline ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {dayAppts.length === 0 && (
          <p className="font-display text-base italic text-ink-500">
            Un giorno di respiro — niente in agenda.
          </p>
        )}
        <ol className="space-y-3">
          {dayAppts.map((a) => {
            const service = services.find((s) => s.id === a.serviceId);
            const client = clients.find((c) => c.id === a.clientId);
            const tokens = stateTokens(a.status);
            const variant = (() => {
              switch (a.status) {
                case 'in_corso':  return 'crescent';
                case 'confirmed': return 'full';
                case 'completed': return 'full';
                case 'cancelled': return 'dashed';
                default:          return 'empty';
              }
            })();
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onAppointmentClick(a)}
                  className="
                    group flex w-full items-start gap-3 rounded-2xl border border-ink-900/8
                    bg-cream-100/55 p-3 text-left transition-all
                    hover:-translate-y-0.5 hover:border-ink-900/20 hover:bg-cream-100 hover:shadow-ring
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-300
                  "
                >
                  <div className="flex w-14 flex-none flex-col items-center justify-center rounded-xl bg-cream-50 px-1 py-1.5 ring-1 ring-ink-900/8">
                    <span className="font-display text-base leading-none tabular-nums text-ink-900">
                      {formatHour(a.startMinutes)}
                    </span>
                    <span className="mt-0.5 text-[9px] uppercase tracking-widest2 text-ink-500">
                      {service && `${service.durationMinutes}m`}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm text-ink-900">{client?.name || '—'}</p>
                      <LunarDot
                        variant={variant}
                        size={9}
                        animate={a.status === 'in_corso'}
                        title={tokens.label}
                      />
                    </div>
                    <p className="truncate text-[12px] text-ink-700">{service?.title || '—'}</p>
                    <p className={`mt-1 text-[10.5px] uppercase tracking-widest2 ${tokens.text}`}>
                      {tokens.label}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── Memo del giorno ─────────────────────── */}
      <div className="border-t border-ink-900/8 px-5 py-4">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-bronze-700">
          <NotebookPen className="h-3.5 w-3.5" /> Memo del giorno
        </p>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Note, promemoria, preferiti di oggi…"
          rows={3}
          className="
            mt-2 w-full resize-none rounded-2xl border border-ink-900/8 bg-cream-100/60
            p-3 text-[13px] leading-relaxed text-ink-800 placeholder:text-ink-500/70
            transition-all
            focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100
          "
        />
        <p className="mt-1.5 text-[10.5px] uppercase tracking-widest2 text-ink-500/70">
          Salvato automaticamente · solo su questo browser
        </p>
      </div>
    </aside>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink-900/8 bg-cream-100/55 p-2.5">
      <p className="text-[10px] uppercase tracking-widest2 text-ink-500">{label}</p>
      <p className="mt-1 font-display text-lg leading-none text-ink-900 tabular-nums">{value}</p>
    </div>
  );
}

Kpi.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

DetailPanel.propTypes = {
  dateISO:    PropTypes.string.isRequired,
  appointments: PropTypes.array.isRequired,
  services:   PropTypes.array.isRequired,
  clients:    PropTypes.array.isRequired,
  onAppointmentClick: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};
