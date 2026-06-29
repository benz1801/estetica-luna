import {
  Hand,
  Sparkles,
  Flower2,
  Wind,
  Eye,
  Sun,
  ArrowUpRight,
} from 'lucide-react';
import useReveal from '../hooks/useReveal';
import useRevealStagger from '../hooks/useRevealStagger';
import SplitText from './SplitText';
import Eyebrow from './Eyebrow';
import Marquee from './Marquee';

const services = [
  {
    icon: Hand,
    title: 'Manicure & Nail Art',
    desc: 'Rituali di cura delle mani con formule biologiche e finiture su misura, dal nude più sobrio al dettaglio dorato.',
    accent: 'sage',
  },
  {
    icon: Sparkles,
    title: 'Pulizia del Viso',
    desc: 'Detoss profonda, estrusioni delicate e maschere illuminanti per una pelle che respira e riflette nuova luce.',
    accent: 'rose',
  },
  {
    icon: Flower2,
    title: 'Trattamenti Viso',
    desc: 'Protocolli personalizzati anti-età, idratazione profonda e siero-terapie con attivi puri di ultima generazione.',
    accent: 'sage',
  },
  {
    icon: Wind,
    title: 'Massaggi & Corpo',
    desc: 'Massaggi rilassanti, decontratturanti e drenanti con oli botanici spremuti a freddo e pietre aromatiche.',
    accent: 'rose',
  },
  {
    icon: Eye,
    title: 'Sopraciglia & Sguardo',
    desc: 'Design sopracciglia, laminazione ciglia e tinture naturali per uno sguardo che apre e definisce il viso.',
    accent: 'sage',
  },
  {
    icon: Sun,
    title: 'Cerimonie & Epilazione',
    desc: 'Epilazione progressiva con cere vegetali e percorsi corpo stagionali per preparare la pelle al sole.',
    accent: 'rose',
  },
];

const accents = {
  sage: 'bg-sage-50 text-sage-700 ring-sage-100',
  rose: 'bg-rose-50 text-rose-500 ring-rose-100',
};

export default function Services() {
  const eyebrowRef = useReveal();
  const leadRef = useReveal();

  // services has a constant length, so calling a fixed number of hooks here is safe.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cardRefs = services.map(() => useReveal());

  const headerStagger = useRevealStagger({ step: 110 });
  const gridStagger = useRevealStagger({ step: 90, base: 220 });

  return (
    <>
      <section
        id="servizi"
        className="relative scroll-mt-24 py-24 sm:py-32"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-sage-100/60 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-luxe">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div ref={eyebrowRef} style={headerStagger.getItemStyle(0)}>
                <Eyebrow>I nostri rituali</Eyebrow>
              </div>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl text-balance">
                <span className="block">
                  <SplitText text="Sei gesti, una sola" />
                </span>
                <span className="block">
                  <SplitText
                    text="promessa: farti brillare."
                    className="text-sage-700"
                    step={60}
                    base={200}
                  />
                </span>
              </h2>
            </div>
            <p
              ref={leadRef}
              className="reveal max-w-md text-base text-ink-700 text-pretty"
              style={headerStagger.getItemStyle(2)}
            >
              Ogni trattamento nasce da un consulto iniziale gratuito, per disegnare un percorso che
              rispetti la tua pelle, i tuoi tempi e il tuo momento.
            </p>
          </div>

          <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, desc, accent }, i) => (
              <li
                key={title}
                ref={cardRefs[i]}
                className="card-service reveal group"
                style={gridStagger.getItemStyle(i)}
              >
                <span
                  className={`inline-grid h-14 w-14 place-items-center rounded-2xl ring-1 ${accents[accent]}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-2xl text-ink-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{desc}</p>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-widest2 text-ink-500">
                    Scopri di più
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-cream-50 transition-all duration-300 group-hover:bg-sage-700 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Marquee
        tone="light"
        items={[
          'Viso luminoso',
          'Mani curate',
          'Massaggi su misura',
          'Ciglia intense',
          'Pelle che respira',
          'Piccoli rituali quotidiani',
        ]}
      />
    </>
  );
}
