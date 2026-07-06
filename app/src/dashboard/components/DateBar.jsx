import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Plus, Eye, Calendar as CalIcon } from 'lucide-react';
import {
  addDays,
  formatClockTime,
  formatItalianLong,
  formatItalianMonth,
  isoWeekNumber,
  toISODate,
} from '../lib/time';

/**
 * DateBar — the editorial header of the dashboard.
 * Quotes the brand: a long Italian date, the time signature from the Hero's
 * corner mark, the week number, navigation arrows, and a contextual CTA.
 * Below: a thin "week strip" of 7 day pills, then a 7×4 mini heatmap of the
 * current month's intensity (mock). All driven by the current `weekStart`.
 */
export default function DateBar({
  currentWeekStart,
  onShiftWeek,
  selectedDateISO,
  onSelectDate,
  view,
  onChangeView,
  onNewAppointment,
}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // 7-day strip
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const todayISO = toISODate(new Date());

  // 4-row mini heatmap of the current month. Each row = a week, each cell
  // = a day. Mocked intensity 0..3 (0 empty, 3 packed).
  const monthStart = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), 1);
  const monthEnd = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth() + 1, 0);
  const monthCells = [];
  // pad start to align with Mon
  const startPad = (monthStart.getDay() + 6) % 7; // Mon=0
  for (let i = 0; i < startPad; i += 1) monthCells.push(null);
  for (let d = 1; d <= monthEnd.getDate(); d += 1) {
    monthCells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
  }
  while (monthCells.length % 7 !== 0) monthCells.push(null);

  // Mock intensity by hashing the date — deterministic but uneven.
  const intensity = (date) => {
    if (!date) return 0;
    const seed = date.getDate() * 13 + date.getMonth() * 7;
    const r = (seed * 9301 + 49297) % 233280;
    const v = r / 233280;
    if (v < 0.45) return 0;
    if (v < 0.7)  return 1;
    if (v < 0.9)  return 2;
    return 3;
  };

  const intensityClass = (n) => {
    switch (n) {
      case 0:  return 'bg-cream-100/60';
      case 1:  return 'bg-sage-100';
      case 2:  return 'bg-sage-300/70';
      case 3:  return 'bg-sage-500';
      default: return 'bg-cream-100/60';
    }
  };

  const weekNum = isoWeekNumber(currentWeekStart);
  const monthName = formatItalianMonth(currentWeekStart);

  return (
    <header className="border-b border-ink-900/8 bg-cream-50/85 backdrop-blur-sm">
      {/* ── Row 1: editorial date + actions ──────── */}
      <div className="flex flex-wrap items-end justify-between gap-y-4 px-4 pb-4 pt-5 sm:px-6 md:px-8">
        {/* Left: date + nav */}
        <div className="flex items-end gap-5">
          <div>
            <p className="eyebrow">
              <span className="h-px w-6 bg-bronze-500/70" />
              <span>Settimana {weekNum} · {monthName}</span>
            </p>
            <h1 className="mt-2 font-display text-3xl capitalize leading-tight text-ink-900 sm:text-[2.25rem]">
              {formatItalianLong(new Date())}
            </h1>
          </div>
          <div className="hidden items-center gap-1 self-end pb-1 sm:flex">
            <button
              type="button"
              onClick={() => onShiftWeek(-1)}
              aria-label="Settimana precedente"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-700 transition-colors hover:border-ink-900/25 hover:bg-cream-100/60"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => onShiftWeek(0)}
              className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-widest2 text-ink-700 transition-colors hover:bg-cream-100/60"
            >
              Oggi
            </button>
            <button
              type="button"
              onClick={() => onShiftWeek(1)}
              aria-label="Settimana successiva"
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-700 transition-colors hover:border-ink-900/25 hover:bg-cream-100/60"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Right: time signature + actions */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="hidden items-baseline gap-2 text-[10.5px] uppercase tracking-widest2 text-ink-500 md:flex animate-clockRock">
            <span>est. 2018</span>
            <span className="h-px w-4 bg-ink-500/40" />
            <span className="tabular-nums">43.46° N · 11.69° E</span>
            <span className="h-px w-4 bg-ink-500/40" />
            <span className="tabular-nums">{formatClockTime(now)} cet</span>
          </p>
          <div className="flex items-center rounded-full border border-ink-900/10 bg-cream-100/60 p-1 text-[11px] uppercase tracking-widest2 text-ink-700">
            <button
              type="button"
              onClick={() => onChangeView('week')}
              className={[
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors',
                view === 'week' ? 'bg-sage-700 text-cream-50' : 'hover:text-ink-900',
              ].join(' ')}
            >
              <CalIcon className="h-3.5 w-3.5" /> Settimana
            </button>
            <button
              type="button"
              onClick={() => onChangeView('day')}
              className={[
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors',
                view === 'day' ? 'bg-sage-700 text-cream-50' : 'hover:text-ink-900',
              ].join(' ')}
            >
              <Eye className="h-3.5 w-3.5" /> Giorno
            </button>
          </div>
          <button
            type="button"
            onClick={onNewAppointment}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" /> Nuovo appuntamento
          </button>
        </div>
      </div>

      {/* ── Row 2: week strip + month heatmap ────── */}
      <div className="flex flex-col gap-3 border-t border-ink-900/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
        {/* 7 day pills */}
        <div className="flex items-center gap-1.5">
          {weekDays.map((d) => {
            const iso = toISODate(d);
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDateISO;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectDate(iso)}
                className={[
                  'flex h-12 w-12 flex-col items-center justify-center rounded-2xl text-[10px] uppercase tracking-widest2 transition-all',
                  isSelected
                    ? 'bg-botanical-900 text-cream-50 shadow-soft'
                    : isToday
                      ? 'bg-sage-100 text-sage-900 ring-1 ring-sage-300'
                      : 'text-ink-700 hover:bg-cream-100/70',
                ].join(' ')}
                aria-pressed={isSelected}
              >
                <span className="leading-none">
                  {d.toLocaleDateString('it-IT', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className="mt-0.5 font-display text-base leading-none tabular-nums">
                  {d.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4×7 mini heatmap of the month */}
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest2 text-ink-500">
          <span className="hidden sm:inline">Intensità mese</span>
          <div className="grid grid-cols-7 gap-1">
            {monthCells.map((d, i) => {
              if (!d) return <span key={`pad-${i}`} className="h-3 w-3" />;
              const iso = toISODate(d);
              const n = intensity(d);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => onSelectDate(iso)}
                  aria-label={`Salta a ${d.getDate()} ${formatItalianMonth(d)}`}
                  className={[
                    'h-3 w-3 rounded-[3px] transition-transform hover:scale-125',
                    intensityClass(n),
                    iso === todayISO ? 'ring-1 ring-ink-900/40' : '',
                  ].join(' ')}
                />
              );
            })}
          </div>
          <span className="hidden sm:inline">↑ carico</span>
        </div>
      </div>
    </header>
  );
}

DateBar.propTypes = {
  currentWeekStart:   PropTypes.instanceOf(Date).isRequired,
  onShiftWeek:        PropTypes.func.isRequired,
  selectedDateISO:    PropTypes.string,
  onSelectDate:       PropTypes.func.isRequired,
  view:               PropTypes.oneOf(['week', 'day']).isRequired,
  onChangeView:       PropTypes.func.isRequired,
  onNewAppointment:   PropTypes.func.isRequired,
};
