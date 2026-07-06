import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';

/**
 * EmptySlot — a clickable hour cell that opens the "new appointment" modal
 * pre-filled with the date/cabin/startMinutes. Stays invisible until hover,
 * revealing a dashed sage border and a tiny + icon.
 */
export default function EmptySlot({ top, height, dateISO, cabinId, startMinutes, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick({ dateISO, cabinId, startMinutes })}
      style={{ top, height }}
      className="
        group absolute inset-x-1.5 flex items-center justify-center
        rounded-xl border border-dashed border-transparent
        text-ink-500/0
        transition-all duration-200
        hover:border-sage-300 hover:bg-sage-50/40 hover:text-sage-700
        focus:outline-none focus-visible:border-sage-300 focus-visible:text-sage-700
      "
      aria-label={`Aggiungi appuntamento ore ${Math.floor(startMinutes / 60).toString().padStart(2,'0')}:${(startMinutes % 60).toString().padStart(2,'0')}`}
    >
      <Plus className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
    </button>
  );
}

EmptySlot.propTypes = {
  top:          PropTypes.number.isRequired,
  height:       PropTypes.number.isRequired,
  dateISO:      PropTypes.string.isRequired,
  cabinId:      PropTypes.string.isRequired,
  startMinutes: PropTypes.number.isRequired,
  onClick:      PropTypes.func.isRequired,
};
