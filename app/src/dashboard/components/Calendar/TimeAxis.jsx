import { formatHour } from '../../lib/time';

const FIRST_HOUR = 9;   // 09:00
const LAST_HOUR  = 20;  // 20:00 (inclusive label)
const ROW_HEIGHT = 64;  // px per hour
const HOURS = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);

export { ROW_HEIGHT, FIRST_HOUR, LAST_HOUR };

/**
 * TimeAxis — leftmost vertical column. Renders a label every hour.
 * Renders as a stack of hour rows of `ROW_HEIGHT`px so it lines up with
 * the calendar grid.
 */
export default function TimeAxis() {
  return (
    <div
      className="relative w-14 flex-none border-r border-ink-900/8 bg-cream-50"
      style={{ height: HOURS.length * ROW_HEIGHT }}
    >
      {HOURS.map((h, i) => (
        <div
          key={h}
          className="absolute right-2 -translate-y-1/2 text-[10.5px] uppercase tracking-widest2 text-ink-500 tabular-nums"
          style={{ top: i * ROW_HEIGHT + 4 }}
        >
          {formatHour(h * 60)}
        </div>
      ))}
    </div>
  );
}

TimeAxis.propTypes = {};
