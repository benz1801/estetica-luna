import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DateBar from './components/DateBar';
import WeekCalendar from './components/Calendar/WeekCalendar';
import DetailPanel from './components/DetailPanel';
import AppointmentModal from './components/AppointmentModal';
import { ClientiView, TrattamentiView, ImpostazioniView } from './views/PlaceholderViews';
import {
  cabins as seedCabins,
  clients as seedClients,
  services as seedServices,
  seedAppointments,
  hydrateAppointments,
} from './data/seed';
import { addDays, toISODate, weekStart } from './lib/time';

/**
 * Dashboard — the editorial shell of the gestionale.
 *
 * State machine:
 *   - activeView:    'calendario' | 'clienti' | 'trattamenti' | 'impostazioni'
 *   - view:          'week' | 'day'          (granularity of the calendar)
 *   - currentWeekStart: Date                (anchor for navigation)
 *   - selectedDateISO:   string             (which day the calendar focuses on)
 *   - appointments:  array                  (in-memory; refresh returns to seed)
 *   - modal:         { mode, payload }      (create / edit a single appointment)
 *   - showSidebar:   boolean                (mobile drawer)
 *   - showDetail:    boolean                (mobile detail drawer)
 */
export default function Dashboard() {
  // ── Static catalog (in fase 1 è seed; in fase 2 verrà dal backend) ──
  const [cabins]   = useState(seedCabins);
  const [clients]  = useState(seedClients);
  const [services] = useState(seedServices);

  // ── Navigation state ──
  const [activeView, setActiveView] = useState('calendario');
  const [view, setView]             = useState('week');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => weekStart(new Date()));
  const [selectedDateISO, setSelectedDateISO]   = useState(() => toISODate(new Date()));

  // ── Appointments (in-memory) ──
  const [appointments, setAppointments] = useState(() => hydrateAppointments(seedAppointments));

  // ── Modal state ──
  const [modal, setModal] = useState(null); // { mode, appointment?, defaults? }

  // ── Mobile drawers ──
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDetail,  setShowDetail]  = useState(false);

  // Keep selectedDateISO inside the current week
  useEffect(() => {
    const start = currentWeekStart;
    const end   = addDays(start, 6);
    if (selectedDateISO < toISODate(start) || selectedDateISO > toISODate(end)) {
      // Anchor to today's date if it's in this week, else Monday
      const todayISO = toISODate(new Date());
      if (todayISO >= toISODate(start) && todayISO <= toISODate(end)) {
        setSelectedDateISO(todayISO);
      } else {
        setSelectedDateISO(toISODate(start));
      }
    }
  }, [currentWeekStart, selectedDateISO]);

  // ── Handlers ──
  const shiftWeek = (delta) => {
    if (delta === 0) {
      setCurrentWeekStart(weekStart(new Date()));
    } else {
      setCurrentWeekStart((d) => addDays(d, delta * 7));
    }
  };

  const openCreate = (defaults = {}) => {
    setModal({ mode: 'create', defaults });
  };
  const openEdit = (appointment) => {
    setModal({ mode: 'edit', appointment });
  };
  const closeModal = () => setModal(null);

  const handleSave = (data) => {
    if (!modal) return;
    if (modal.mode === 'create') {
      const id = `a${Date.now().toString(36)}`;
      setAppointments((prev) => [...prev, { id, ...data }]);
    } else {
      setAppointments((prev) =>
        prev.map((a) => (a.id === modal.appointment.id ? { ...a, ...data } : a))
      );
    }
    closeModal();
  };

  const handleDelete = (appointment) => {
    if (!appointment) return;
    setAppointments((prev) => prev.filter((a) => a.id !== appointment.id));
    closeModal();
  };

  // Compute the appointments list (memoized to avoid re-creating per render)
  const apptList = useMemo(() => appointments, [appointments]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream-50 text-ink-800">
      {/* ── Mobile sidebar drawer ──────────────── */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-botanical-900/50 md:hidden"
          onClick={() => setShowSidebar(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={[
          'fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform md:static md:translate-x-0',
          showSidebar ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <Sidebar
          activeView={activeView}
          onChange={setActiveView}
          onCloseMobile={() => setShowSidebar(false)}
        />
        <button
          type="button"
          onClick={() => setShowSidebar(false)}
          aria-label="Chiudi menu"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cream-50/10 text-cream-50 ring-1 ring-cream-50/15 md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Main column ─────────────────────────── */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Mobile topbar (sidebar toggle + quick CTA) */}
        <div className="flex items-center justify-between border-b border-ink-900/8 bg-cream-50 px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            aria-label="Apri menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-900/10 text-ink-900"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-botanical-900">
              <img src="/luna.svg" alt="" className="h-6 w-6 rotate-45" />
            </span>
            <span className="font-display text-base text-ink-900">Estetica Luna</span>
          </div>
          <button
            type="button"
            onClick={() => openCreate()}
            className="rounded-full bg-sage-700 px-3 py-1.5 text-[11px] uppercase tracking-widest2 text-cream-50"
          >
            Nuovo
          </button>
        </div>

        {activeView === 'calendario' && (
          <>
            <DateBar
              currentWeekStart={currentWeekStart}
              onShiftWeek={shiftWeek}
              selectedDateISO={selectedDateISO}
              onSelectDate={setSelectedDateISO}
              view={view}
              onChangeView={setView}
              onNewAppointment={() => openCreate({
                dateISO: selectedDateISO,
                cabinId: cabins[0]?.id,
                startMinutes: 10 * 60,
              })}
            />

            <div className="flex min-h-0 flex-1">
              {/* Calendar (scrolls independently) */}
              <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                {view === 'week' ? (
                  <WeekCalendar
                    dateISO={selectedDateISO}
                    cabins={cabins}
                    appointments={apptList}
                    services={services}
                    clients={clients}
                    onAppointmentClick={openEdit}
                    onEmptySlotClick={(defaults) => openCreate(defaults)}
                  />
                ) : (
                  <DayView
                    dateISO={selectedDateISO}
                    cabins={cabins}
                    appointments={apptList}
                    services={services}
                    clients={clients}
                    onAppointmentClick={openEdit}
                    onEmptySlotClick={(defaults) => openCreate(defaults)}
                  />
                )}

                {/* Mobile: open detail panel */}
                <div className="mt-6 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setShowDetail(true)}
                    className="w-full rounded-2xl border border-ink-900/8 bg-cream-100/55 p-4 text-left transition-colors hover:bg-cream-100"
                  >
                    <p className="eyebrow">
                      <span className="h-px w-6 bg-bronze-500/70" />
                      <span>La giornata</span>
                    </p>
                    <p className="mt-2 font-display text-lg text-ink-900">
                      Apri il riepilogo di oggi →
                    </p>
                  </button>
                </div>
              </div>

              {/* DetailPanel — desktop sticky, mobile sheet */}
              <div
                className={[
                  'fixed inset-0 z-30 flex bg-botanical-900/40 backdrop-blur lg:static lg:bg-transparent lg:backdrop-blur-0',
                  showDetail ? 'flex' : 'hidden lg:flex',
                ].join(' ')}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowDetail(false);
                }}
              >
                <DetailPanel
                  dateISO={selectedDateISO}
                  appointments={apptList}
                  services={services}
                  clients={clients}
                  onAppointmentClick={openEdit}
                  onClose={() => setShowDetail(false)}
                />
              </div>
            </div>
          </>
        )}

        {activeView === 'clienti'      && <ClientiView />}
        {activeView === 'trattamenti'  && <TrattamentiView services={services} />}
        {activeView === 'impostazioni' && <ImpostazioniView />}
      </div>

      {/* ── Modal ───────────────────────────────── */}
      {modal && (
        <AppointmentModal
          mode={modal.mode}
          appointment={modal.appointment}
          defaults={modal.defaults}
          services={services}
          clients={clients}
          cabins={cabins}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DayView — minimal alternative to WeekCalendar, used when the
   "Giorno" toggle is active. Single column, all cabins stacked.
   Renders the same EmptySlot/AppointmentCard primitives so the
   visual language is identical.
   ───────────────────────────────────────────────────────────── */
function DayView({ dateISO, cabins, appointments, services, clients, onAppointmentClick, onEmptySlotClick }) {
  return (
    <div className="space-y-6">
      {cabins.map((cabin) => {
        const cabinAppts = appointments.filter((a) => a.cabinId === cabin.id && a.dateISO === dateISO);
        return (
          <div key={cabin.id} className="rounded-3xl border border-ink-900/8 bg-cream-50 p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100">
                <span className="font-display text-sm">{cabin.short}</span>
              </span>
              <div>
                <p className="font-display text-lg text-ink-900">{cabin.name}</p>
                <p className="text-[10.5px] uppercase tracking-widest2 text-ink-500">{cabin.desc}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {cabinAppts.length === 0 && (
                <li className="rounded-2xl border border-dashed border-ink-900/10 p-3 text-[12px] text-ink-500">
                  Nessun appuntamento — giornata libera.
                </li>
              )}
              {cabinAppts
                .sort((a, b) => a.startMinutes - b.startMinutes)
                .map((a) => {
                  const service = services.find((s) => s.id === a.serviceId);
                  const client  = clients.find((c) => c.id === a.clientId);
                  if (!service || !client) return null;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => onAppointmentClick(a)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-ink-900/8 bg-cream-100/55 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:bg-cream-100 hover:shadow-ring"
                      >
                        <div>
                          <p className="font-display text-base text-ink-900">{client.name}</p>
                          <p className="text-[12px] text-ink-700">{service.title}</p>
                        </div>
                        <p className="font-display text-base tabular-nums text-ink-700">
                          {String(Math.floor(a.startMinutes / 60)).padStart(2,'0')}:{String(a.startMinutes % 60).padStart(2,'0')}
                        </p>
                      </button>
                    </li>
                  );
                })}
            </ul>
            <button
              type="button"
              onClick={() => onEmptySlotClick({ dateISO, cabinId: cabin.id, startMinutes: 10 * 60 })}
              className="mt-3 w-full rounded-2xl border border-dashed border-sage-300/70 px-4 py-2 text-[12px] uppercase tracking-widest2 text-sage-700 transition-colors hover:bg-sage-50/40"
            >
              + Aggiungi in {cabin.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}

DayView.propTypes = {
  dateISO: PropTypes.string.isRequired,
  cabins:  PropTypes.array.isRequired,
  appointments: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired,
  clients:  PropTypes.array.isRequired,
  onAppointmentClick: PropTypes.func.isRequired,
  onEmptySlotClick:   PropTypes.func.isRequired,
};
