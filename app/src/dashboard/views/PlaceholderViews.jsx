import PropTypes from 'prop-types';
import { Users, Sparkles, Scissors, Wind, Hand, Flower2, HeartPulse, Plus } from 'lucide-react';
import ServiceCard from '../../components/ServiceCard';

// Map service id → icon, used to rehydrate the visual side of the catalog.
// (Phase 1: catalog cards mirror the public site; phase 2: they'll become editable.)
const ICONS = {
  ceretta:            Scissors,
  'ceretta-brasiliana': Scissors,
  'filo-arabo':       Plus,
  massaggio:          Wind,
  manicure:           Hand,
  pedicure:           Hand,
  laminazione:        Flower2,
  pressoterapia:      HeartPulse,
  extension:          Sparkles,
};
const TAGLINES = {
  ceretta:            'Cere vegetali, pelle liscia a lungo.',
  'ceretta-brasiliana': 'Pulizia profonda, gesti precisi.',
  'filo-arabo':       'Sopracciglia disegnate, viso che si apre.',
  massaggio:          'Oli botanici, ritmo lento.',
  manicure:           'Mani curate come rituale quotidiano.',
  pedicure:           'Piedi leggeri, gesto che rigenera.',
  laminazione:        'Ciglia curve, sguardo naturale.',
  pressoterapia:      'Leggerezza, gambe sgonfie.',
  extension:          'Volume, lunghezza, personalità.',
};

/**
 * Placeholder views. Phase 1: no backend. Each view shows a quiet panel
 * saying it ships with phase 2, plus useful content where possible
 * (Trattamenti re-uses the site's ServiceCard as a visual reference).
 */

export function ClientiView() {
  return (
    <PlaceholderShell
      eyebrow="Rubrica"
      title="Le tue ospiti"
      lead="La rubrica clienti arriverà con il database. Per ora continui a gestire i nomi via WhatsApp e a ritrovarli qui, nel calendario."
      icon={Users}
    />
  );
}

export function TrattamentiView({ services }) {
  return (
    <div className="px-4 py-8 sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="eyebrow">
            <span className="h-px w-6 bg-bronze-500/70" />
            <span>Catalogo</span>
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl text-balance">
            I <em className="not-italic text-sage-700">rituali</em> che offri
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-700 text-pretty">
            Questa è la replica del catalogo pubblico del sito. Con il database,
            ogni trattamento sarà modificabile da qui: durata, prezzo, descrizione,
            e l&apos;icona che lo rappresenta.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = ICONS[s.id] || Sparkles;
            return (
              <ServiceCard
                key={s.id}
                index={i + 1}
                icon={Icon}
                title={s.title}
                tagline={TAGLINES[s.id] || ''}
                description={`${s.durationMinutes} min · € ${s.price}. Trattamento disponibile su prenotazione. Diventerà modificabile con la fase 2.`}
                duration={`${s.durationMinutes} min`}
                price={`€ ${s.price}`}
                accent={s.accent}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

TrattamentiView.propTypes = {
  services: PropTypes.array.isRequired,
};

export function ImpostazioniView() {
  return (
    <PlaceholderShell
      eyebrow="Profilo"
      title="Impostazioni del centro"
      lead="Qui potrai modificare i tuoi orari di apertura, i dati del centro, e le preferenze di notifica. In arrivo con la fase 2."
      icon={Sparkles}
    />
  );
}

function PlaceholderShell({ eyebrow, title, lead, icon: Icon }) {
  return (
    <div className="flex items-center justify-center px-4 py-16 sm:px-6 md:px-10">
      <div className="w-full max-w-xl rounded-3xl border border-ink-900/8 bg-cream-100/55 p-10 text-center shadow-soft">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-50 text-sage-700 ring-1 ring-sage-100 animate-floatY">
          <Icon className="h-7 w-7" strokeWidth={1.4} />
        </span>
        <p className="mt-6 eyebrow justify-center">
          <span className="h-px w-6 bg-bronze-500/70" />
          <span>{eyebrow}</span>
        </p>
        <h2 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-700 text-pretty">
          {lead}
        </p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-bronze-400/10 px-4 py-1.5 text-[10.5px] uppercase tracking-widest2 text-bronze-700">
          In arrivo con la fase 2 · database e API
        </p>
      </div>
    </div>
  );
}

PlaceholderShell.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title:   PropTypes.string.isRequired,
  lead:    PropTypes.string.isRequired,
  icon:    PropTypes.elementType.isRequired,
};
