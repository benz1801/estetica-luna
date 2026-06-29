import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Two-layer "poster" card.
 * - Base layer: large icon, title, short tagline. Calm, editorial.
 * - Hover layer: colored panel slides up from the bottom, revealing the full
 *   description, duration, price and a CTA. Only on hover-capable pointers.
 */
const ServiceCard = forwardRef(function ServiceCard(
  {
    index = 0,
    icon: Icon,
    title,
    tagline,
    description,
    duration,
    price,
    accent = 'sage',
    align = 'left',
    transitionDelay = 0,
  },
  ref
) {
  const a =
    accent === 'rose'
      ? {
          ring: 'ring-rose-100',
          iconBg: 'bg-rose-50 text-rose-500',
          panel:
            'bg-gradient-to-br from-rose-300/95 via-rose-500/90 to-rose-500/85 text-rose-50',
          dot: 'bg-rose-50',
          chip: 'border-rose-50/40 text-rose-50/85',
        }
      : {
          ring: 'ring-sage-100',
          iconBg: 'bg-sage-50 text-sage-700',
          panel:
            'bg-gradient-to-br from-botanical-900/95 via-sage-700/90 to-sage-500/85 text-cream-50',
          dot: 'bg-cream-50',
          chip: 'border-cream-50/30 text-cream-50/90',
        };

  return (
    <li
      ref={ref}
      className="reveal group relative h-[340px] sm:h-[360px] lg:h-[380px]"
      style={{ transitionDelay: `${transitionDelay}ms` }}
    >
      <article
        className={`
          relative h-full w-full overflow-hidden rounded-3xl
          border border-ink-900/10 bg-cream-100/55
          transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          will-change-transform
          md:hover:-translate-y-2 md:hover:scale-[1.025] md:hover:shadow-leaf
          focus-within:-translate-y-2 focus-within:scale-[1.025] focus-within:shadow-leaf
        `}
      >
        {/* index marker — quiet editorial touch */}
        <span
          className={`
            absolute top-5 z-10 font-display text-sm italic text-ink-500/55
            ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-5'}
          `}
          aria-hidden="true"
        >
          — 0{index}
        </span>

        {/* ───── BASE LAYER ───── */}
        <div
          className={`
            relative z-0 flex h-full w-full flex-col p-6 sm:p-7
            ${align === 'center' ? 'items-center text-center' : ''}
            transition-opacity duration-500
            md:group-hover:opacity-0 md:group-focus-within:opacity-0
          `}
        >
          <span
            className={`inline-grid h-16 w-16 place-items-center rounded-2xl ring-1 ${a.iconBg} ${a.ring}`}
          >
            <Icon className="h-7 w-7" strokeWidth={1.25} />
          </span>

          <div className={`mt-auto pt-8 ${align === 'center' ? '' : ''}`}>
            <h3 className="font-display text-2xl leading-tight text-ink-900 sm:text-[1.7rem]">
              {title}
            </h3>
            <p className="mt-2 text-[13px] leading-snug text-ink-500">
              {tagline}
            </p>

            <div
              className={`
                mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ink-500
                ${align === 'center' ? '' : ''}
              `}
              aria-hidden="true"
            >
              <span className={`h-px w-6 bg-ink-500/40`} />
              <span>Scopri</span>
            </div>
          </div>
        </div>

        {/* ───── HOVER LAYER ───── */}
        <div
          className={`
            absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-7
            ${a.panel}
            translate-y-full
            transition-transform duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)]
            md:group-hover:translate-y-0 md:group-focus-within:translate-y-0
          `}
          aria-hidden="false"
        >
          <div className="flex items-start justify-between gap-4">
            <span
              className={`
                inline-grid h-11 w-11 place-items-center rounded-2xl bg-cream-50/10 ring-1 ring-cream-50/20
              `}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span
              className={`grid h-9 w-9 place-items-center rounded-full bg-cream-50/15 ring-1 ring-cream-50/30 transition-transform duration-500 ease-out group-hover:rotate-45`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <div>
            <h3 className="font-display text-2xl leading-tight sm:text-[1.7rem]">
              {title}
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-cream-50/90 sm:text-sm">
              {description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {duration && (
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] uppercase tracking-widest2 ${a.chip}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} aria-hidden="true" />
                  {duration}
                </span>
              )}
              {price && (
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] uppercase tracking-widest2 ${a.chip}`}
                >
                  {price}
                </span>
              )}
            </div>

            <a
              href="#contatti"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-widest2 text-cream-50"
            >
              Prenota questo rituale
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* decorative ring (visible only on base layer) */}
        <div
          className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full ring-deco opacity-50 transition-opacity duration-500 md:group-hover:opacity-0"
          aria-hidden="true"
        />
      </article>
    </li>
  );
});

ServiceCard.displayName = 'ServiceCard';
ServiceCard.propTypes = {
  index: PropTypes.number,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string,
  description: PropTypes.string,
  duration: PropTypes.string,
  price: PropTypes.string,
  accent: PropTypes.oneOf(['sage', 'rose']),
  align: PropTypes.oneOf(['left', 'center']),
  transitionDelay: PropTypes.number,
};

export default ServiceCard;

ServiceCard.propTypes = {
  index: PropTypes.number,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string,
  description: PropTypes.string,
  duration: PropTypes.string,
  price: PropTypes.string,
  accent: PropTypes.oneOf(['sage', 'rose']),
  align: PropTypes.oneOf(['left', 'center']),
  transitionDelay: PropTypes.number,
};
