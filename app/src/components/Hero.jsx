import PropTypes from 'prop-types';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import useCountUp from '../hooks/useCountUp';
import ScrollCue from './ScrollCue';

function Stat({ value, suffix = '', decimals = 0, label, prefix = '' }) {
  const [ref, display] = useCountUp({ to: value, decimals, suffix, prefix });
  return (
    <div ref={ref} className="text-cream-50/90">
      <p className="stat-num font-display text-3xl sm:text-4xl">{display}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest2 text-cream-100/60">
        {label}
      </p>
    </div>
  );
}

Stat.propTypes = {
  value: PropTypes.number.isRequired,
  suffix: PropTypes.string,
  decimals: PropTypes.number,
  label: PropTypes.string.isRequired,
  prefix: PropTypes.string,
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden pt-24 sm:pt-28"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-botanical-900/70 via-botanical-900/55 to-botanical-900/80" />
        <div className="absolute inset-0 grain" />
      </div>

      <div
        className="pointer-events-none absolute -right-32 top-32 -z-10 h-72 w-72 rounded-full bg-sage-500/30 blur-3xl animate-floatY"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-12 -z-10 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-luxe relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-16 sm:py-20">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-cream-50/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest2 text-cream-100 backdrop-blur animate-riseIn">
              <Sparkles className="h-3.5 w-3.5" /> Nuovo capitolo di bellezza
            </span>

            <h1 className="mt-8 font-display text-5xl leading-[1.05] text-cream-50 sm:text-6xl md:text-7xl lg:text-[5.5rem] text-balance animate-riseIn">
              La pelle che sogni,
              <br />
              <em className="not-italic text-bronze-400">il tempo che meriti.</em>
            </h1>

            <p
              className="mt-7 max-w-xl text-base text-cream-100/85 sm:text-lg animate-riseIn delay-200"
            >
              Estetica Luna è un piccolo santuario nel cuore della città, dove ogni trattamento
              è un rituale pensato per restituire luce, quiete e una nuova armonia al tuo corpo.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 animate-riseIn delay-300">
              <a href="#contatti" className="btn-primary">
                Prenota un appuntamento <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#servizi" className="btn-ghost !border-cream-50/30 !bg-cream-50/10 !text-cream-50 hover:!bg-cream-50/20">
                Scopri i rituali
              </a>
            </div>
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="relative ml-auto w-full max-w-sm rounded-3xl border border-cream-50/15 bg-cream-50/10 p-6 backdrop-blur-md animate-riseIn delay-400">
              <div className="flex items-center gap-1 text-bronze-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 font-display text-xl italic leading-snug text-cream-50">
                «Un&apos;esperienza che riconcilia con il proprio riflesso.»
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest2 text-cream-100/70">
                — Sofia M., ospite abituale
              </p>
              <div
                className="absolute -top-6 -right-6 h-24 w-24 rounded-full ring-deco"
                aria-hidden="true"
              />
            </div>
          </aside>
        </div>
      </div>

      <div className="container-luxe relative pb-10">
        <div className="grid grid-cols-2 gap-6 border-t border-cream-50/15 pt-8 sm:grid-cols-4">
          <Stat value={8} suffix="" label="Anni di esperienza" />
          <Stat value={1.2} decimals={1} suffix="k" label="Ospiti coccolate" />
          <Stat value={24} suffix="" label="Rituali su misura" />
          <Stat value={4.9} decimals={1} suffix="★" label="Valutazione media" />
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
