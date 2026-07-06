import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X, Save, Trash2, Calendar, Clock, User, Sparkles, DoorOpen, FileText } from 'lucide-react';
import LunarDot from './LunarDot';
import { APPOINTMENT_STATUSES, stateTokens } from '../lib/stateColors';
import { formatHour, parseHHMM } from '../lib/time';

const DURATIONS = [15, 30, 45, 60, 75, 90, 120];

/**
 * AppointmentModal — create / edit / view a single appointment.
 * Modes:
 *   - 'create' (no appointment): empty form
 *   - 'edit'   (appointment):    form prefilled, can save / delete
 * The state field always shows a live preview of the lunar-dot variant,
 * so the operator can see the status change as it would appear on the grid.
 */
export default function AppointmentModal({
  mode,
  appointment,
  defaults,
  services,
  clients,
  cabins,
  onSave,
  onDelete,
  onClose,
}) {
  // form state
  const [clientId, setClientId] = useState(
    appointment?.clientId || clients[0]?.id || ''
  );
  const [serviceId, setServiceId] = useState(
    appointment?.serviceId || services[0]?.id || ''
  );
  const [cabinId, setCabinId]   = useState(
    appointment?.cabinId || defaults?.cabinId || cabins[0]?.id || ''
  );
  const [dateISO, setDateISO]   = useState(
    appointment?.dateISO || defaults?.dateISO || new Date().toISOString().slice(0, 10)
  );
  const [startStr, setStartStr] = useState(
    appointment
      ? formatHour(appointment.startMinutes)
      : formatHour(defaults?.startMinutes ?? 10 * 60)
  );
  const [duration, setDuration] = useState(
    appointment
      ? (services.find((s) => s.id === appointment.serviceId)?.durationMinutes || 60)
      : (services.find((s) => s.id === (serviceId || services[0]?.id))?.durationMinutes || 60)
  );
  const [status, setStatus] = useState(appointment?.status || 'confirmed');
  const [notes, setNotes] = useState(appointment?.notes || '');

  // Keep duration in sync with chosen service (unless manually overridden)
  useEffect(() => {
    const s = services.find((x) => x.id === serviceId);
    if (s) setDuration(s.durationMinutes);
  }, [serviceId, services]);

  // ESC closes
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...(appointment || {}),
      clientId,
      serviceId,
      cabinId,
      dateISO,
      startMinutes: parseHHMM(startStr),
      durationMinutes: Number(duration),
      status,
      notes,
    });
  };

  const dotVariant = (() => {
    switch (status) {
      case 'in_corso':  return 'crescent';
      case 'confirmed': return 'full';
      case 'completed': return 'full';
      case 'cancelled': return 'dashed';
      default:          return 'empty';
    }
  })();

  const title = mode === 'create' ? 'Nuovo appuntamento' : 'Dettagli appuntamento';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-botanical-900/40 p-4 backdrop-blur"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-ink-900/10 bg-cream-50 shadow-leaf">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-ink-900/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <LunarDot
              variant={dotVariant}
              size={20}
              animate={status === 'in_corso'}
              title={stateTokens(status).label}
            />
            <div>
              <p className="eyebrow">
                <span className="h-px w-6 bg-bronze-500/70" />
                <span>{mode === 'create' ? 'Crea' : 'Modifica'}</span>
              </p>
              <h3 className="mt-1 font-display text-2xl text-ink-900">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="max-h-[75vh] overflow-y-auto px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cliente" icon={User}>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="form-select"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Trattamento" icon={Sparkles}>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="form-select"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} · {s.durationMinutes} min · € {s.price}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cabina" icon={DoorOpen} full>
              <div className="flex flex-wrap gap-2">
                {cabins.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCabinId(c.id)}
                    className={[
                      'rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-widest2 transition-colors',
                      cabinId === c.id
                        ? 'border-sage-700 bg-sage-700 text-cream-50'
                        : 'border-ink-900/15 text-ink-700 hover:border-ink-900/30',
                    ].join(' ')}
                    aria-pressed={cabinId === c.id}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Data" icon={Calendar}>
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="form-input"
              />
            </Field>

            <Field label="Orario inizio" icon={Clock}>
              <input
                type="time"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                step={900}
                className="form-input tabular-nums"
              />
            </Field>

            <Field label="Durata" icon={Clock}>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="form-select tabular-nums"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </Field>

            <Field label="Stato" icon={Sparkles} full>
              <div className="flex flex-wrap gap-2">
                {APPOINTMENT_STATUSES.map((s) => {
                  const v = (() => {
                    switch (s.id) {
                      case 'in_corso':  return 'crescent';
                      case 'confirmed': return 'full';
                      case 'completed': return 'full';
                      case 'cancelled': return 'dashed';
                      default:          return 'empty';
                    }
                  })();
                  const active = status === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStatus(s.id)}
                      className={[
                        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-widest2 transition-colors',
                        active
                          ? 'border-botanical-900 bg-botanical-900 text-cream-50'
                          : 'border-ink-900/15 text-ink-700 hover:border-ink-900/30',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      <LunarDot variant={v} size={9} animate={s.id === 'in_corso' && active} />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Note" icon={FileText} full>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Preferiti, allergie, richieste particolari…"
                className="
                  w-full resize-none rounded-2xl border border-ink-900/8 bg-cream-100/60
                  p-3 text-[13px] leading-relaxed text-ink-800 placeholder:text-ink-500/70
                  transition-all
                  focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100
                "
              />
            </Field>
          </div>

          {/* Footer actions */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/8 pt-5">
            <div>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={() => onDelete(appointment)}
                  className="
                    inline-flex items-center gap-2 rounded-full border border-rose-300/60 bg-rose-50/40
                    px-4 py-2 text-[11px] uppercase tracking-widest2 text-rose-500
                    transition-colors hover:bg-rose-50
                  "
                >
                  <Trash2 className="h-3.5 w-3.5" /> Elimina
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-5 py-2 text-[11px] uppercase tracking-widest2 text-ink-700 transition-colors hover:bg-cream-100"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Crea appuntamento' : 'Salva modifiche'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tiny scoped styles for inputs/selects. Tailwind doesn't ship a
          form-* plugin in this project, so we hand-roll the look to match
          the rest of the dashboard. */}
      <style>{`
        .form-input, .form-select {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid rgba(31, 27, 22, 0.10);
          background: rgba(246, 241, 231, 0.65);
          padding: 0.625rem 0.875rem;
          font-size: 13.5px;
          color: #1F1B16;
          transition: all 200ms;
        }
        .form-input:hover, .form-select:hover {
          border-color: rgba(31, 27, 22, 0.22);
        }
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #9DB28A;
          box-shadow: 0 0 0 3px rgba(157, 178, 138, 0.20);
        }
      `}</style>
    </div>
  );
}

function Field({ label, icon: Icon, children, full = false }) {
  return (
    <label className={full ? 'sm:col-span-2' : ''}>
      <span className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-widest2 text-bronze-700">
        {Icon && <Icon className="h-3 w-3" strokeWidth={1.5} />}
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  icon:  PropTypes.elementType,
  children: PropTypes.node,
  full: PropTypes.bool,
};

AppointmentModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  appointment: PropTypes.object,
  defaults: PropTypes.shape({
    dateISO: PropTypes.string,
    cabinId: PropTypes.string,
    startMinutes: PropTypes.number,
  }),
  services: PropTypes.array.isRequired,
  clients:  PropTypes.array.isRequired,
  cabins:   PropTypes.array.isRequired,
  onSave:   PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onClose:  PropTypes.func.isRequired,
};
