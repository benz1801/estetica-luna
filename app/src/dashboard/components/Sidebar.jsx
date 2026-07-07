import PropTypes from 'prop-types';
import { Calendar, Users, Sparkles, Settings, LogOut } from 'lucide-react';
import LunarDot from './LunarDot';

const items = [
  { id: 'calendario',   label: 'Calendario',   icon: Calendar, hint: 'Settimana corrente' },
  { id: 'clienti',      label: 'Clienti',      icon: Users,    hint: 'Lista ospiti' },
  { id: 'trattamenti',  label: 'Trattamenti',  icon: Sparkles, hint: 'Catalogo rituali' },
  { id: 'impostazioni', label: 'Impostazioni', icon: Settings, hint: 'Profilo e orari' },
];

export default function Sidebar({ activeView, onChange, onCloseMobile, onLogout }) {
  return (
    <aside
      className="
        flex h-full w-full flex-col
        bg-botanical-900 text-cream-100
        md:w-[240px] md:flex-none
      "
    >
      {/* ── Brand block ─────────────────────────── */}
      <div className="flex items-center gap-3 px-6 pb-7 pt-7">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-cream-50/8 ring-1 ring-cream-50/15">
          <img
            src="/luna.svg"
            alt=""
            className="h-8 w-8 rotate-45 object-contain"
            aria-hidden="true"
          />
        </span>
        <div className="leading-tight">
          <p className="font-display text-lg text-cream-50">Estetica Luna</p>
          <p className="text-[10px] uppercase tracking-widest2 text-cream-100/55">
            Dashboard gestionale
          </p>
        </div>
      </div>

      {/* ── Nav ─────────────────────────────────── */}
      <nav className="flex-1 px-3" aria-label="Navigazione dashboard">
        <ul className="space-y-1">
          {items.map(({ id, label, icon: Icon, hint }) => {
            const active = id === activeView;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(id);
                    onCloseMobile?.();
                  }}
                  className={[
                    'group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                    active
                      ? 'bg-cream-50/8 text-cream-50'
                      : 'text-cream-100/75 hover:bg-cream-50/5 hover:text-cream-50',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={[
                      'absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r transition-opacity',
                      active ? 'bg-sage-300 opacity-100' : 'opacity-0',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                  <Icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.4} />
                  <span className="flex-1">
                    <span className="block text-sm font-medium leading-none">{label}</span>
                    <span className="mt-1 block text-[10.5px] uppercase tracking-widest2 text-cream-100/45">
                      {hint}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer profile ──────────────────────── */}
      <div className="mt-6 border-t border-cream-50/8 px-4 py-5">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 flex-none place-items-center rounded-full bg-cream-50/10 font-display text-sm text-cream-50 ring-1 ring-cream-50/15"
            aria-hidden="true"
          >
            LB
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm text-cream-50">Lunarda Bianchi</p>
            <div className="mt-1 flex items-center gap-2 text-[10.5px] uppercase tracking-widest2 text-cream-100/55">
              <LunarDot variant="full" size={8} className="bg-sage-500" />
              <span>Online · adesso</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Esci"
            onClick={onLogout}
            className="grid h-9 w-9 flex-none place-items-center rounded-full text-cream-100/55 transition-colors hover:bg-cream-50/8 hover:text-cream-50"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeView: PropTypes.string.isRequired,
  onChange:   PropTypes.func.isRequired,
  onCloseMobile: PropTypes.func,
  onLogout: PropTypes.func,
};
