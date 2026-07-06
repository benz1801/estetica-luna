// State → design token mapping.
// IMPORTANT: do NOT introduce a generic traffic-light palette.
// All states use the existing brand tokens (sage / bronze / rose) with
// distinct typographic + decorative treatments.

export const APPOINTMENT_STATUSES = [
  { id: 'proposed',   label: 'Proposto'    },
  { id: 'confirmed',  label: 'Confermato'  },
  { id: 'in_corso',   label: 'In corso'    },
  { id: 'completed',  label: 'Completato'  },
  { id: 'cancelled',  label: 'Annullato'   },
];

/**
 * Returns the design tokens for a given status.
 * - `dot`        : the lunar-dot variant class
 * - `border`     : the card left-bar accent (or '')
 * - `text`       : label color class
 * - `softBg`     : subtle background tint for cards
 * - `label`      : human-readable label
 */
export function stateTokens(status) {
  switch (status) {
    case 'confirmed':
      return {
        dot: 'lunar-dot--full',
        border: 'border-l-sage-500',
        text: 'text-sage-700',
        softBg: 'bg-sage-50/60',
        label: 'Confermato',
      };
    case 'in_corso':
      return {
        dot: 'lunar-dot--crescent',
        border: 'border-l-sage-700',
        text: 'text-sage-900',
        softBg: 'bg-sage-50',
        label: 'In corso',
      };
    case 'proposed':
      return {
        dot: 'lunar-dot--empty',
        border: 'border-l-bronze-400',
        text: 'text-bronze-700',
        softBg: 'bg-cream-100/80',
        label: 'Proposto',
      };
    case 'completed':
      return {
        dot: 'lunar-dot--full',
        border: 'border-l-ink-400',
        text: 'text-ink-500',
        softBg: 'bg-cream-100/50',
        label: 'Completato',
      };
    case 'cancelled':
      return {
        dot: 'lunar-dot--dashed',
        border: 'border-l-rose-300',
        text: 'text-rose-500',
        softBg: 'bg-rose-50/50',
        label: 'Annullato',
      };
    default:
      return {
        dot: 'lunar-dot--empty',
        border: 'border-l-ink-400',
        text: 'text-ink-700',
        softBg: 'bg-cream-100/50',
        label: '—',
      };
  }
}

/** Maps a service "accent" to the left-bar color class on appointment cards. */
export function accentBorder(accent) {
  return accent === 'rose' ? 'border-l-rose-500' : 'border-l-sage-500';
}
