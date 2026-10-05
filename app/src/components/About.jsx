import { Check, Quote, Award, BadgeCheck } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import useRevealStagger from '../hooks/useRevealStagger';
import ImageCurtain from './ImageCurtain';
import SplitText from './SplitText';
import Eyebrow from './Eyebrow';
import Parallax from './Parallax';

const values = [
  'Ascolto e consulenza personalizzata in ogni appuntamento',
  'Cosmetici biologici, cruelty-free e made in Italy',
  'Ambiente silenzioso, profumato, con luce naturale',
];

// Editable list of the founder's professional certifications.
// Each entry has: year (string), title (certification name), issuer (issuing body / school),
// and an optional license (registration number / licence id).
const certifications = [
  {
    year: '2015',
    title: 'Estetista professionista',
    issuer: 'Accademia Beauty & Wellness, Milano',
    license: 'Iscr. Albo n. MI-2015-0841',
  },
  {
    year: '2017',
    title: 'Specializzazione trattamenti viso avanzati',
    issuer: 'Centro Formativo Cosmetologia Italia',
    license: 'Cert. CFI-VISO-17',
  },
  {
    year: '2019',
    title: 'Massaggio decontratturante e linfatico',
    issuer: 'Scuola di Massaggio Olistico, Roma',
    license: 'Cert. SMO-MASS-19',
  },
  {
    year: '2021',
    title: 'Laminazione ciglia & extension',
    issuer: 'Lash Master Academy',
    license: 'Cert. LMA-LEX-21',
  },
  {
    year: '2023',
    title: 'Filo arabo & design sopracciglia',
    issuer: 'Middle Eastern Brows Institute',
    license: 'Cert. MEBI-FA-23',
  },
];

export default function About() {
  const eyebrowRef = useReveal();
  const descRef = useReveal();
  const descRef2 = useReveal();
  const actionRef = useReveal();

  // Certifications block
  const certBlockRef = useReveal({
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px',
  });
  const certHeaderRef = useReveal({
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px',
  });
  const certNoteRef = useReveal({
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px',
  });

  // values has a constant length, so calling a fixed number of hooks here is safe.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const valuesRefs = values.map(() => useReveal());

  // certifications — fixed-length array, so calling a fixed number of hooks is safe.
  const certRefs = certifications.map(
    () =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useReveal({ threshold: 0.05, rootMargin: '0px 0px 0px 0px' })
  );

  const valueStagger = useRevealStagger({ step: 100 });
  const actionStagger = useRevealStagger({ step: 400 });
  const certStagger = useRevealStagger({ step: 80, base: 100 });

  return (
    <section id="chi-sono" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-luxe">
        {/* ───── ROW 1: PHOTO + PRESENTATION ───── */}
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* LEFT: PHOTO + QUOTE */}
          <div className="relative lg:col-span-5">
            <ImageCurtain
              src={`${import.meta.env.BASE_URL}claudia.jpg`}
              alt="Estetista al lavoro all'interno del centro Estetica Luna"
              className="relative overflow-hidden rounded-3xl shadow-soft"
              imgClassName="h-[560px] w-full object-cover object-[center_28%] sm:h-[640px]"
            />

            <Parallax
              speed={28}
              className="absolute -bottom-14 -left-6 hidden w-[88%] lg:block"
            >
              <figure className="rounded-3xl bg-botanical-900 p-7 text-cream-50 shadow-soft">
                <Quote
                  className="h-7 w-7 text-bronze-400"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <blockquote className="mt-5 font-display text-[1.65rem] italic leading-snug sm:text-3xl">
                  «Lunarda, perché ogni donna ha una luna interiore che merita di splendere.»
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-cream-50/15 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cream-50/10 text-bronze-400 ring-1 ring-cream-50/15">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-base text-cream-50">
                      Lunarda Bianchi
                    </p>
                    <p className="mt-0.5 text-[10.5px] uppercase tracking-widest2 text-cream-100/65">
                      Fondatrice · Estetica Luna · est. 2018
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Parallax>

            <Parallax
              speed={-60}
              className="absolute -right-6 -top-6 hidden lg:block"
            >
              <div
                className="h-28 w-28 rounded-full ring-deco animate-slowSpin"
                aria-hidden="true"
              />
            </Parallax>

            {/* quote shown up to the point the two-column layout kicks in */}
            <figure className="mt-6 rounded-3xl bg-botanical-900 p-6 text-cream-50 shadow-soft lg:hidden">
              <Quote className="h-6 w-6 text-bronze-400" strokeWidth={1.25} />
              <blockquote className="mt-4 font-display text-xl italic leading-snug">
                «Lunarda, perché ogni donna ha una luna interiore che merita di splendere.»
              </blockquote>
              <p className="mt-4 text-[10.5px] uppercase tracking-widest2 text-cream-100/65">
                Lunarda Bianchi · Fondatrice
              </p>
            </figure>

            {/* breathing room so the parallaxed quote never overlaps the
                right column on shorter viewports. */}
            <div aria-hidden="true" className="hidden h-40 lg:block" />
          </div>

          {/* RIGHT: PRESENTATION + VALUES + CTA */}
          <div className="lg:col-span-7">
            <div ref={eyebrowRef}>
              <Eyebrow>Chi sono</Eyebrow>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl text-balance">
              <SplitText as="span" text="Una filosofia di bellezza," />
              <br />
              <SplitText
                as="span"
                text="lenta e consapevole."
                className="text-sage-700"
                step={60}
                base={250}
              />
            </h2>
            <p
              ref={descRef}
              className="mt-6 text-base leading-relaxed text-ink-700 sm:text-lg text-pretty reveal"
            >
              Sono Lunarda, estetista e formatrice, e ho aperto Estetica Luna con un&apos;idea
              semplice: creare un luogo dove la cura del corpo diventa un piccolo rito di
              presenza. Qui la tecnologia incontra le mani, il profumo degli oli essenziali e
              il silenzio che rigenera.
            </p>
            <p
              ref={descRef2}
              className="mt-4 text-base leading-relaxed text-ink-700 text-pretty reveal"
            >
              Ti accoglierò in uno spazio intimo, con tre cabine dedicate, una selezione di
              cosmetici biologici e un calendario disegnato per darti tutto il tempo che meriti —
              mai di corsa, mai un trattamento uguale a un altro.
            </p>

            <ul className="mt-8 space-y-3">
              {values.map((v, i) => (
                <li
                  key={v}
                  ref={valuesRefs[i]}
                  className="flex items-start gap-3 text-ink-800 reveal"
                  style={valueStagger.getItemStyle(i)}
                >
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm sm:text-base">{v}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-10 reveal"
              ref={actionRef}
              style={actionStagger.getItemStyle(0)}
            >
              <a href="#contatti" className="btn-ghost">
                Conosciamoci di persona
              </a>
            </div>
          </div>
        </div>

        {/* ───── DIVIDER ───── */}
        <div
          aria-hidden="true"
          className="mt-24 flex items-center gap-4 sm:mt-32"
        >
          <span className="h-px flex-1 bg-ink-900/10" />
          <span className="grid h-10 w-10 place-items-center rounded-full border border-ink-900/15 bg-cream-100/60 text-bronze-700">
            <Award className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <span className="h-px flex-1 bg-ink-900/10" />
        </div>

        {/* ───── ROW 2: CERTIFICATIONS — full-width strip ───── */}
        <div ref={certBlockRef} className="mt-16 sm:mt-20">
          <div
            ref={certHeaderRef}
            className="reveal-rise flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-2xl">
              <span className="eyebrow">Formazione</span>
              <h3 className="mt-3 font-display text-3xl leading-tight sm:text-[2.5rem] text-balance">
                Le mie <em className="not-italic text-sage-700">certificazioni</em>
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ink-500">
              <span className="h-px w-8 bg-bronze-500" />
              <span>Registro aggiornato al 2025</span>
            </div>
          </div>

          {/* horizontal registry of stamps */}
          <ol className="mt-10 grid grid-cols-1 divide-y divide-ink-900/10 overflow-hidden rounded-3xl border border-ink-900/10 bg-cream-100/55 shadow-ring sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:divide-y-0">
            {certifications.map((c, i) => (
              <li
                key={`${c.year}-${c.title}`}
                ref={certRefs[i]}
                className={`reveal-blur group relative p-6 transition-all duration-500 hover:bg-cream-100/80 sm:p-7 ${
                  i === certifications.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
                style={certStagger.getItemStyle(i)}
              >
                {/* stamp circle */}
                <div
                  aria-hidden="true"
                  className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-full border border-dashed border-bronze-400/40 text-bronze-700 transition-transform duration-700 group-hover:rotate-12 sm:-right-5 sm:-top-5 sm:h-20 sm:w-20"
                >
                  <span className="font-display text-sm leading-none">
                    {c.year}
                  </span>
                </div>

                <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100">
                  <BadgeCheck className="h-4 w-4" strokeWidth={1.75} />
                </span>

                <p className="mt-5 font-display text-[1.05rem] leading-tight text-ink-900">
                  {c.title}
                </p>
                <p className="mt-2 text-[12.5px] leading-snug text-ink-700">
                  {c.issuer}
                </p>
                {c.license && (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-500 ring-1 ring-ink-900/5">
                    {c.license}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <p
            ref={certNoteRef}
            className="reveal mt-10 text-center text-[13px] leading-relaxed text-ink-500 text-pretty italic sm:text-sm"
          >
            Ogni anno scelgo almeno un corso di aggiornamento — dalla cosmetologia green alle
            tecniche olistiche — perché la pelle cambia, le formule evolvono, e il vostro tempo
            merita il meglio.
          </p>
        </div>
      </div>
    </section>
  );
}