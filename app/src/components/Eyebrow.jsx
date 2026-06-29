import PropTypes from 'prop-types';
import useReveal from '../hooks/useReveal';

export default function Eyebrow({ children, className = '' }) {
  const ref = useReveal();
  return (
    <p ref={ref} className={`eyebrow-anim ${className}`}>
      <span className="eyebrow-line" />
      <span className="eyebrow-label">{children}</span>
    </p>
  );
}

Eyebrow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};