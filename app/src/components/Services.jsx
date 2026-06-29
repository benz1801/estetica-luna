import {
  Scissors,
  Sparkles,
  Hand,
  Wind,
  Eye,
  Flower2,
  HeartPulse,
  Plus,
} from 'lucide-react';
import useReveal from '../hooks/useReveal';
import useRevealStagger from '../hooks/useRevealStagger';
import SplitText from './SplitText';
import Eyebrow from './Eyebrow';
import Marquee from './Marquee';
import ServiceCard from './ServiceCard';

const services = [
  {
    icon: Scissors,
    title: 'Ceretta',
    tagline: 'Cere vegetali, pelle liscia a lungo.',
    description:
      'Epilazione progressiva con cere vegetali tiepide, stretch delicate e una routine post-trattamento che idrata e lenisce. Per gambe, braccia e zone estese.',
    duration: '30 — 60 min',
    price: 'da € 25',
    accent: 'rose',
    align: 'left',
  },
  {
    icon: Sparkles,
    title: 'Ceretta Brasiliana',
    tagline: 'Pulizia profonda, gesti precisi.',
    description:
      'Ceretta intima totale con tecnica brasiliana, prodotti ipoallergenici e attenzione assoluta a comfort e privacy. Igiene assoluta, zero giudizio.',
    duration: '40 min',
    price: 'da € 45',
    accent: 'rose',
    align: 'center',
  },
  {
    icon: Plus,
    title: 'Filo Arabo',
    tagline: 'Sopracciglia disegnate, viso che si apre.',
    description:
      'Design sopracciglia con la tradizionale tecnica del filo arabo: precisione millimetrica, traiettoria naturale del pelo, sguardo liftato senza pinzette aggressive.',
    duration: '15 — 20 min',
    price: 'da € 15',
    accent: 'sage',
    align: 'center',
  },
  {
    icon: Wind,
    title: 'Massaggi specifici',
    tagline: 'Oli botanici, ritmo lento.',
    description:
      'Massaggi mirati — decontratturante, rilassante, drenante o linfatico — costruiti sul tuo corpo e sul momento. Oli botanici spremuti a freddo e musica a basso volume.',
    duration: '50 — 75 min',
    price: 'da € 60',
    accent: 'sage',
    align: 'left',
  },
  {
    icon: Hand,
    title: 'Manicure e Pedicure',
    tagline: 'Mani e piedi come rituali quotidiani.',
    description:
      'Trattamenti completi per mani e piedi con bagni emollienti, cuticole curate, limatura studiata e finiture dal nude più sobrio allo smalto semipermanente. Formule biologiche.',
    duration: '45 — 75 min',
    price: 'da € 35',
    accent: 'rose',
    align: 'center',
  },
  {
    icon: Flower2,
    title: 'Laminazione',
    tagline: 'Ciglia curve, sguardo naturale.',
    description:
      'Laminazione ciglia e sopracciglia con cheratina e vitamine: curvatura naturale, volume disciplinato e un effetto "sveglia così" che dura fino a sei settimane.',
    duration: '45 min',
    price: 'da € 55',
    accent: 'rose',
    align: 'left',
  },
  {
    icon: HeartPulse,
    title: 'Pressoterapia',
    tagline: 'Leggerezza, gambe sgonfie.',
    description:
      'Pressoterapia sequenziale con gambali a 12 camere d&apos;aria per favorire il microcircolo, alleggerire le gambe e combattere ritenzione. Ideale dopo l&apos;estate o in gravidanza.',
    duration: '30 — 45 min',
    price: 'da € 40',
    accent: 'sage',
    align: 'center',
  },
  {
    icon: Eye,
    title: 'Extension Ciglia',
    tagline: 'Volume, lunghezza, personalità.',
    description:
      'Applicazione one-to-one di extension in seta o pelo sintetico di ultima generazione. Effetto ciglia finte che durano fino a cinque settimane, con refill periodici dedicati.',
    duration: '90 — 120 min',
    price: 'da € 90',
    accent: 'rose',
    align: 'left',
  },
];

export default function Services() {
  const eyebrowRef = useReveal();
  const leadRef = useReveal();

  // services has a constant length (8), so a fixed number of hooks here is safe.
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
                  <SplitText text="Otto gesti, una sola" />
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

          <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard
                key={s.title}
                ref={cardRefs[i]}
                index={i + 1}
                icon={s.icon}
                title={s.title}
                tagline={s.tagline}
                description={s.description}
                duration={s.duration}
                price={s.price}
                accent={s.accent}
                align={s.align}
                transitionDelay={(gridStagger.getItemStyle(i)?.transitionDelay || 0)
                  .replace('ms', '')}
              />
            ))}
          </ul>
        </div>
      </section>

      <Marquee
        tone="light"
        items={[
          'Ceretta brasiliana',
          'Filo arabo',
          'Pressoterapia',
          'Laminazione ciglia',
          'Extension ciglia',
          'Manicure curata',
        ]}
      />
    </>
  );
}
