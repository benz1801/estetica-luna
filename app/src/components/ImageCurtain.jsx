import PropTypes from 'prop-types';
import useReveal from '../hooks/useReveal';

/**
 * Wraps an <img> with a colored "curtain" that slides off as it enters the viewport.
 * The image also gently scales into place.
 */
export default function ImageCurtain({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  ...rest
}) {
  const ref = useReveal({ threshold: 0.25 });
  return (
    <div ref={ref} className={`img-curtain ${className}`} {...rest}>
      <img src={src} alt={alt} className={imgClassName} loading="lazy" />
    </div>
  );
}

ImageCurtain.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
};
