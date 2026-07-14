import PropTypes from 'prop-types';
import { forwardRef } from 'react';

/**
 * Two-layer "poster" card.
 * - Base layer: large icon centered in the middle, title and tagline below.
 *   Calm, editorial.
 * - Hover layer: colored panel slides up from the bottom, revealing the
 *   treatment icon (top right), title, description and a CTA.
 *   Only on hover-capable pointers.
 */
const ServiceCard = forwardRef(function ServiceCard(
  {
    icon: Icon,
    title,
    tagline,
    description,
    accent = 'sage',
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
        }
      : {
          ring: 'ring-sage-100',
          iconBg: 'bg-sage-50 text-sage-700',
          panel:
            'bg-gradient-to-br from-botanical-900/95 via-sage-700/90 to-sage-500/85 text-cream-50',
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
        {/* ───── BASE LAYER ───── */}
        <div
          className={`
            relative z-0 flex h-full w-full flex-col items-center p-6 sm:p-7
            transition-opacity duration-500
            md:group-hover:opacity-0 md:group-focus-within:opacity-0
          `}
        >
          <span
            className={`mt-12 inline-grid h-24 w-24 place-items-center rounded-3xl ring-1 ${a.iconBg} ${a.ring}`}
          >
            <Icon className="h-12 w-12" strokeWidth={1.15} />
          </span>

          <div className="mt-8 text-center">
            <h3 className="font-display text-2xl leading-tight text-ink-900 sm:text-[1.7rem]">
              {title}
            </h3>
            <p className="mt-2 px-2 text-[13px] leading-snug text-ink-500">
              {tagline}
            </p>
          </div>

          <div
            className="mt-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ink-500"
            aria-hidden="true"
          >
            <span className="h-px w-6 bg-ink-500/40" />
            <span>Scopri</span>
          </div>
        </div>

        {/* ───── HOVER LAYER ───── */}
        <div
          className={`
            absolute inset-0 z-10 flex flex-col p-6 sm:p-7
            ${a.panel}
            translate-y-full
            transition-transform duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)]
            md:group-hover:translate-y-0 md:group-focus-within:translate-y-0
          `}
          aria-hidden="false"
        >
          <div className="flex items-start justify-end">
            <span
              className={`
                inline-grid h-14 w-14 place-items-center rounded-2xl bg-cream-50/10 ring-1 ring-cream-50/20
              `}
            >
              <Icon className="h-7 w-7" strokeWidth={1.25} />
            </span>
          </div>

          <div className="mt-auto">
            <h3 className="font-display text-2xl leading-tight sm:text-[1.7rem]">
              {title}
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-cream-50/90 sm:text-sm">
              {description}
            </p>

            <a
              href="#contatti"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-widest2 text-cream-50"
            >
              Prenota questo rituale
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
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string,
  description: PropTypes.string,
  accent: PropTypes.oneOf(['sage', 'rose']),
  transitionDelay: PropTypes.number,
};

export default ServiceCard;
