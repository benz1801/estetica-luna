import PropTypes from 'prop-types';
import { useRef } from 'react';
import useElementProgress from '../hooks/useElementProgress';

/**
 * Translates children on the Y axis based on their progress through the viewport.
 * `speed` is the total Y travel in px (positive = moves down slower than scroll,
 * negative = moves up faster than scroll).
 */
export default function Parallax({ children, speed = 60, className = '' }) {
  const ref = useRef(null);
  const progress = useElementProgress(ref);
  // progress 0 = element bottom at viewport top, 1 = element top at viewport top
  // We want the element to drift by `speed` over its full traverse.
  const offset = (0.5 - progress) * speed;
  return (
    <div
      ref={ref}
      className={`parallax ${className}`}
      style={{ transform: `translate3d(0, ${offset.toFixed(2)}px, 0)` }}
    >
      {children}
    </div>
  );
}

Parallax.propTypes = {
  children: PropTypes.node,
  speed: PropTypes.number,
  className: PropTypes.string,
};
