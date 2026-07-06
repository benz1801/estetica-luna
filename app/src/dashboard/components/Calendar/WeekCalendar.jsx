import PropTypes from 'prop-types';
import TimeAxis from './TimeAxis';
import CabinColumn from './CabinColumn';

/**
 * WeekCalendar — the main editorial grid.
 * 3 cabin columns × 12 hour rows, with appointments absolutely positioned
 * inside their column. Wraps in a horizontal scroll on narrow viewports so
 * we never squash a single cabin to illegibility.
 */
export default function WeekCalendar({
  dateISO,
  cabins,
  appointments,
  services,
  clients,
  onAppointmentClick,
  onEmptySlotClick,
}) {
  return (
    <section
      className="
        relative overflow-hidden rounded-3xl border border-ink-900/8 bg-cream-50 shadow-soft
      "
      aria-label="Calendario settimanale"
    >
      <div className="overflow-x-auto">
        <div className="flex min-w-[760px]">
          <TimeAxis />
          {cabins.map((cabin) => {
            const cabinAppts = appointments.filter(
              (a) => a.cabinId === cabin.id && a.dateISO === dateISO
            );
            return (
              <CabinColumn
                key={cabin.id}
                cabin={cabin}
                dateISO={dateISO}
                appointments={cabinAppts}
                services={services}
                clients={clients}
                onAppointmentClick={onAppointmentClick}
                onEmptySlotClick={onEmptySlotClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

WeekCalendar.propTypes = {
  dateISO:    PropTypes.string.isRequired,
  cabins:     PropTypes.array.isRequired,
  appointments: PropTypes.array.isRequired,
  services:   PropTypes.array.isRequired,
  clients:    PropTypes.array.isRequired,
  onAppointmentClick: PropTypes.func.isRequired,
  onEmptySlotClick:   PropTypes.func.isRequired,
};
