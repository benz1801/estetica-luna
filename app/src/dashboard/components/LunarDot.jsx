import PropTypes from 'prop-types';

/**
 * LunarDot — the signature status marker of the dashboard.
 * Mirrors the brand's "ring-deco" at a miniature scale, with 4 states:
 *   - empty:    dashed outline (proposed / awaiting confirmation)
 *   - full:     solid sage (confirmed / completed)
 *   - crescent: partial fill, animated lunarTide (in progress)
 *   - dashed:   rose outline (cancelled / attention)
 */
export default function LunarDot({ variant = 'empty', size = 14, animate = false, className = '', title }) {
  const sizeStyle = { width: `${size}px`, height: `${size}px`, '--lunar-size': `${size}px` };
  return (
    <span
      className={[
        'lunar-dot',
        `lunar-dot--${variant}`,
        animate ? 'animate-lunarTide' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={sizeStyle}
      aria-label={title}
      role={title ? 'img' : undefined}
    />
  );
}

LunarDot.propTypes = {
  variant: PropTypes.oneOf(['empty', 'full', 'crescent', 'dashed']),
  size: PropTypes.number,
  animate: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
};
