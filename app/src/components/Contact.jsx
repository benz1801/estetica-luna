import { MapPin, Clock, MessageCircle, Mail, Phone } from 'lucide-react';
import useReveal from '../hooks/useReveal';
import useRevealStagger from '../hooks/useRevealStagger';
import Eyebrow from './Eyebrow';
import SplitText from './SplitText';
import ImageCurtain from './ImageCurtain';

const hours = [
  { day: 'Lunedì', time: '10:00 — 19:00' },
  { day: 'Martedì', time: '10:00 — 19:00' },
  { day: 'Mercoledì', time: '10:00 — 19:00' },
  { day: 'Giovedì', time: '10:00 — 21:00' },
  { day: 'Venerdì', time: '10:00 — 21:00' },
  { day: 'Sabato', time: '09:00 — 17:00' },
  { day: 'Domenica', time: 'Riposo' },
];

export default function Contact() {
  const eyebrowRef = useReveal();
  const leadRef = useReveal();
  const leftColRef = useReveal();
  const rightColRef = useReveal();
  const buttonGroupRef = useReveal();
  const contactListRef = useReveal();
  const hoursCardRef = useReveal({ threshold: 0.05 });
  const hoursHeaderRef = useReveal();
  const photoCardRef = useReveal({ threshold: 0.05 });
  // hours has a constant length, so calling a fixed number of hooks here is safe.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hoursItemRefs = hours.map(() => useReveal({ threshold: 0.05 }));

  const eyebrowStagger = useRevealStagger({ step: 0 });
  const leadStagger = useRevealStagger({ step: 200 });
  const leftStagger = useRevealStagger({ step: 0, base: 0 });
  const rightStagger = useRevealStagger({ step: 0, base: 200 });
  const buttonGroupStagger = useRevealStagger({ step: 300 });
  const contactListStagger = useRevealStagger({ step: 0 });
  const hoursCardStagger = useRevealStagger({ step: 0 });
  const hoursHeaderStagger = useRevealStagger({ step: 0 });
  const hoursItemStagger = useRevealStagger({ step: 60, base: 120 });
  const photoCardStagger = useRevealStagger({ step: 0, base: 200 });

  return (
    <section
      id="contatti"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-96 bg-gradient-to-b from-sage-50/0 via-sage-50/60 to-sage-50/0"
        aria-hidden="true"
      />

      <div className="container-luxe">
        <div className="grid gap-12 lg:grid-cols-12">
          <div
            ref={leftColRef}
            className="lg:col-span-5 reveal-rise"
            style={leftStagger.getItemStyle(0)}
          >
            <div ref={eyebrowRef} style={eyebrowStagger.getItemStyle(0)}>
              <Eyebrow>Ti aspettiamo</Eyebrow>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl text-balance">
              <SplitText as="span" text="Ti aspettiamo in via dei Tigli," />
              <br />
              <SplitText
                as="span"
                text="a due passi dal parco."
                className="text-sage-700"
                step={60}
                base={250}
              />
            </h2>
            <p
              ref={leadRef}
              className="mt-6 max-w-md text-base leading-relaxed text-ink-700 reveal text-pretty"
              style={leadStagger.getItemStyle(0)}
            >
              Scrivici su WhatsApp per prenotare il tuo rituale: rispondiamo entro un&apos;ora, in
              orario di apertura. Per richieste olistiche e pacchetti cerimonia, scrivici una mail
              e ti ricontatteremo con una proposta su misura.
            </p>

            <div
              ref={buttonGroupRef}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center reveal"
              style={buttonGroupStagger.getItemStyle(0)}
            >
              <a
                href="https://wa.me/390223334455?text=Ciao%20Lunarda%2C%20vorrei%20prenotare%20un%20appuntamento"
                target="_blank"
                rel="noreferrer"
                className="btn-primary justify-center"
              >
                <MessageCircle className="h-4 w-4" /> Scrivici su WhatsApp
              </a>
              <a href="tel:+390223334455" className="btn-ghost">
                <Phone className="h-4 w-4" /> 02 2333 4455
              </a>
            </div>

            <dl
              ref={contactListRef}
              className="mt-10 space-y-5 text-sm reveal"
              style={contactListStagger.getItemStyle(0)}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <dt className="font-medium text-ink-900">Indirizzo</dt>
                  <dd className="text-ink-700">Via dei Tigli 14, 20121 Milano (MI)</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <dt className="font-medium text-ink-900">Email</dt>
                  <dd className="text-ink-700">ciao@esteticaluna.it</dd>
                </div>
              </div>
            </dl>
          </div>

          <div
            ref={rightColRef}
            className="lg:col-span-7 reveal-rise"
            style={rightStagger.getItemStyle(0)}
          >
            <div className="overflow-hidden rounded-3xl border border-ink-900/5 bg-cream-100/60 shadow-soft">
              <div className="grid gap-0 sm:grid-cols-2">
                <div
                  ref={hoursCardRef}
                  className="border-b border-ink-900/5 p-8 sm:border-b-0 sm:border-r"
                  style={hoursCardStagger.getItemStyle(0)}
                >
                  <div
                    ref={hoursHeaderRef}
                    className="flex items-center gap-3 reveal-rise"
                    style={hoursHeaderStagger.getItemStyle(0)}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-botanical-900 text-cream-50">
                      <Clock className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-xl text-ink-900">Orari di apertura</h3>
                  </div>
                  <ul className="mt-6 divide-y divide-ink-900/5 text-sm">
                    {hours.map((h, i) => (
                      <li
                        key={h.day}
                        ref={hoursItemRefs[i]}
                        className="flex items-center justify-between py-2.5 text-ink-800 reveal-left"
                        style={hoursItemStagger.getItemStyle(i)}
                      >
                        <span>{h.day}</span>
                        <span
                          className={`tabular-nums ${
                            h.time === 'Riposo' ? 'text-rose-500' : 'text-ink-700'
                          }`}
                        >
                          {h.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  ref={photoCardRef}
                  className="relative min-h-[260px]"
                  style={photoCardStagger.getItemStyle(0)}
                >
                  <ImageCurtain
                    src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80"
                    alt="Interno del centro estetico con luci soffuse e piante"
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-botanical-900/70 via-botanical-900/10 to-transparent" />
                  <p className="absolute bottom-5 left-5 right-5 font-display text-lg italic text-cream-50">
                    «L&apos;appuntamento è il tuo tempo. Noi lo custodiamo.»
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
