import PropTypes from 'prop-types';
import { Flower2, Sparkles, Hand } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import EmptySlot from './EmptySlot';
import { FIRST_HOUR, LAST_HOUR, ROW_HEIGHT } from './TimeAxis';

const ICONS = {
  luna:  Flower2,
  sale:  Sparkles,
  bosco: Hand,
};

/**
 * CabinColumn — one column of the week grid for a single cabin on a single day.
 * Renders 12 hour rows; absolutely positions any appointments that fall in
 * this cabin/date. The empty rows are clickable via EmptySlot.
 */
export default function CabinColumn({
  cabin,
  dateISO,
  appointments,
  onAppointmentClick,
  onEmptySlotClick,
  services,
  clients,
}) {
  const HOURS = LAST_HOUR - FIRST_HOUR + 1;
  const totalHeight = HOURS * ROW_HEIGHT;

  // Sort by start time so the layering is predictable.
  const sorted = [...appointments].sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div className="flex min-w-0 flex-1 flex-col border-l border-ink-900/8 first:border-l-0">
      {/* Header: cabin name */}
      <div className="flex items-center gap-2 border-b border-ink-900/8 bg-cream-50 px-3 py-3">
        {(() => {
          const Icon = ICONS[cabin.id] || Flower2;
          return (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.4} />
            </span>
          );
        })()}
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-ink-900">{cabin.name}</p>
          <p className="truncate text-[10.5px] uppercase tracking-widest2 text-ink-500">
            {cabin.desc}
          </p>
        </div>
      </div>

      {/* Body: hour grid + overlaid appointments */}
      <div
        className="relative bg-cream-50"
        style={{ height: totalHeight }}
      >
        {/* Hour gridlines */}
        {Array.from({ length: HOURS + 1 }, (_, i) => (
          <div
            key={i}
            className={[
              'pointer-events-none absolute inset-x-0 border-t',
              i === 0 ? 'border-transparent' : 'border-ink-900/5',
            ].join(' ')}
            style={{ top: i * ROW_HEIGHT }}
          />
        ))}

        {/* Click targets for empty slots — one per hour row */}
        {Array.from({ length: HOURS }, (_, i) => {
          const hourStart = (FIRST_HOUR + i) * 60;
          // Skip the click target if there's an appointment covering this slot.
          const covered = sorted.some(
            (a) => a.startMinutes < hourStart + 60 && a.startMinutes + (services.find(s=>s.id===a.serviceId)?.durationMinutes||60) > hourStart
          );
          if (covered) return null;
          return (
            <EmptySlot
              key={i}
              top={i * ROW_HEIGHT}
              height={ROW_HEIGHT}
              dateISO={dateISO}
              cabinId={cabin.id}
              startMinutes={hourStart}
              onClick={onEmptySlotClick}
            />
          );
        })}

        {/* Appointments */}
        {sorted.map((a) => {
          const service = services.find((s) => s.id === a.serviceId);
          const client = clients.find((c) => c.id === a.clientId);
          if (!service || !client) return null;
          const top = (a.startMinutes - FIRST_HOUR * 60) * (ROW_HEIGHT / 60);
          const height = (service.durationMinutes * ROW_HEIGHT) / 60;
          return (
            <AppointmentCard
              key={a.id}
              appointment={a}
              service={service}
              client={client}
              top={top}
              height={height}
              onClick={() => onAppointmentClick(a)}
            />
          );
        })}
      </div>
    </div>
  );
}

CabinColumn.propTypes = {
  cabin: PropTypes.shape({
    id:   PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
  }).isRequired,
  dateISO: PropTypes.string.isRequired,
  appointments: PropTypes.array.isRequired,
  onAppointmentClick: PropTypes.func.isRequired,
  onEmptySlotClick:   PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
  clients:  PropTypes.array.isRequired,
};
