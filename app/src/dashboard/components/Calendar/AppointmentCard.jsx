import PropTypes from 'prop-types';
import { accentBorder, stateTokens } from '../../lib/stateColors';
import { formatHour } from '../../lib/time';
import LunarDot from '../LunarDot';

/**
 * AppointmentCard — a single appointment sitting on the calendar grid.
 * Positioned absolutely inside a CabinColumn.
 * Visual recipe:
 *   - cream-50/95 background, ink-900/8 border, rounded-2xl, ring shadow
 *   - 2px left bar in sage or rose depending on service accent
 *   - LunarDot top-right reflecting status
 *   - Client name in display, service name in Inter, time + price in caption
 *   - On hover: gentle lift + sage/300 ring (uses standard hover utilities)
 */
export default function AppointmentCard({
  appointment,
  service,
  client,
  top,
  height,
  onClick,
}) {
  const tokens = stateTokens(appointment.status);
  const variant = (() => {
    switch (appointment.status) {
      case 'in_corso':  return 'crescent';
      case 'confirmed': return 'full';
      case 'completed': return 'full';
      case 'cancelled': return 'dashed';
      default:          return 'empty';
    }
  })();

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ top, height }}
      className={[
        'absolute inset-x-1.5 overflow-hidden rounded-2xl border border-ink-900/8 text-left',
        'border-l-2',
        accentBorder(service.accent),
        tokens.softBg,
        'shadow-ring transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-leaf hover:border-ink-900/15',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-300',
      ].join(' ')}
      aria-label={`${client.name} · ${service.title} · ${formatHour(appointment.startMinutes)}`}
    >
      <div className="flex h-full flex-col p-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[13px] leading-tight text-ink-900 line-clamp-1">
            {client.name}
          </p>
          <LunarDot
            variant={variant}
            size={11}
            animate={appointment.status === 'in_corso'}
            title={tokens.label}
          />
        </div>
        <p className="mt-0.5 text-[11px] leading-snug text-ink-700 line-clamp-1">
          {service.title}
        </p>
        <div className="mt-auto flex items-end justify-between pt-1.5 text-[10.5px] tabular-nums text-ink-500">
          <span>
            {formatHour(appointment.startMinutes)}—{formatHour(appointment.startMinutes + service.durationMinutes)}
          </span>
          <span className="text-ink-700">€ {service.price}</span>
        </div>
      </div>
    </button>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    id:            PropTypes.string.isRequired,
    status:        PropTypes.string.isRequired,
    startMinutes:  PropTypes.number.isRequired,
  }).isRequired,
  service: PropTypes.shape({
    id:              PropTypes.string.isRequired,
    title:           PropTypes.string.isRequired,
    durationMinutes: PropTypes.number.isRequired,
    price:           PropTypes.number.isRequired,
    accent:          PropTypes.string,
  }).isRequired,
  client: PropTypes.shape({
    id:   PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  top:    PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
