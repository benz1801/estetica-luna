import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

function formatTime(d) {
  return d.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Hero() {
  // The corner mark keeps the time honest. Re-renders every minute.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden pt-24 sm:pt-28"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src={`${import.meta.env.BASE_URL}foto-centro-luna.JPG`}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-botanical-900/70 via-botanical-900/55 to-botanical-900/80" />
        <div className="absolute inset-0 grain" />
      </div>

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

      {/* Corner mark — a quiet typographic signature.
         Slowly rocks back and forth like a clock hand. */}
      <div
        className="pointer-events-none absolute bottom-6 right-6 hidden items-baseline gap-3 text-cream-100/55 sm:flex animate-clockRock"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-widest2">est. 2018</span>
        <span className="h-px w-6 bg-cream-100/30" />
        <span className="text-[10px] uppercase tracking-widest2 tabular-nums">
          43.46° N · 11.69° E
        </span>
        <span className="h-px w-6 bg-cream-100/30" />
        <span className="text-[10px] uppercase tracking-widest2 tabular-nums">
          {formatTime(now)} cet
        </span>
      </div>

      {/* The dots — a whisper of an index, doubling as a scroll cue. */}
      <a
        href="#servizi"
        aria-label="Vai ai servizi"
        className="group absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="flex flex-col items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cream-50/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream-50/40 transition-colors group-hover:bg-cream-50/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream-50/40 transition-colors group-hover:bg-cream-50/80" />
        </span>
      </a>
    </section>
  );
}
