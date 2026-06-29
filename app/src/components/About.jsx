import { Check, Quote } from 'lucide-react';
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

export default function About() {
  const eyebrowRef = useReveal();
  // values has a constant length, so calling a fixed number of hooks here is safe.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const valuesRefs = values.map(() => useReveal());
  const actionRef = useReveal();

  const valueStagger = useRevealStagger({ step: 100 });
  const actionStagger = useRevealStagger({ step: 400 });
  return (
    <section id="chi-sono" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-luxe">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <ImageCurtain
              src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=80"
              alt="Estetista al lavoro all'interno del centro Estetica Luna"
              className="relative overflow-hidden rounded-3xl shadow-soft"
              imgClassName="h-[480px] w-full object-cover sm:h-[560px]"
            />

            <Parallax
              speed={50}
              className="absolute -bottom-8 -left-6 hidden w-60 sm:block"
            >
              <div className="rounded-3xl bg-botanical-900 p-6 text-cream-50 shadow-soft">
                <Quote className="h-5 w-5 text-bronze-400" />
                <p className="mt-3 font-display text-lg italic leading-snug">
                  «Lunarda, perché ogni donna ha una luna interiore che merita di splendere.»
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-widest2 text-cream-100/60">
                  Lunarda Bianchi · Fondatrice
                </p>
              </div>
            </Parallax>

            <Parallax speed={-80} className="absolute -right-6 -top-6 hidden sm:block">
              <div
                className="h-28 w-28 rounded-full ring-deco animate-slowSpin"
                aria-hidden="true"
              />
            </Parallax>
          </div>

          <div className="reveal-rise">
            <div ref={eyebrowRef}>
              <Eyebrow>Chi sono</Eyebrow>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl text-balance">
              <SplitText
                as="span"
                text="Una filosofia di bellezza,"
              />
              <br />
              <SplitText
                as="span"
                text="lenta e consapevole."
                className="text-sage-700"
                step={60}
                base={250}
              />
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-700 sm:text-lg text-pretty reveal">
              Sono Lunarda, estetista e formatrice, e ho aperto Estetica Luna con un&apos;idea semplice:
              creare un luogo dove la cura del corpo diventa un piccolo rito di presenza. Qui la
              tecnologia incontra le mani, il profumo degli oli essenziali e il silenzio che
              rigenera.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-700 text-pretty reveal">
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

            <div className="mt-10 reveal" ref={actionRef} style={actionStagger.getItemStyle(0)}>
              <a href="#contatti" className="btn-ghost">
                Conosciamoci di persona
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
