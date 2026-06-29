import PropTypes from 'prop-types';
import useRevealStagger from '../hooks/useRevealStagger';
import useReveal from '../hooks/useReveal';

/**
 * Splits the children text into per-word spans, each clipped and translated.
 * Use as a wrapper around plain text (or a single tag holding a string).
 *
 *   <SplitText text="La pelle che sogni" />
 *   <SplitText as="h2" text="..." />
 */
export default function SplitText({
  text = '',
  as: Tag = 'span',
  className = '',
  step = 60,
  base = 0,
  reveal = true,
}) {
  const ref = useReveal();
  const { getItemStyle } = useRevealStagger({ step, base });

  const words = String(text).split(' ');

  return (
    <Tag
      ref={ref}
      className={className}
      data-revealed={reveal ? undefined : 'true'}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="split-text"
          data-revealed={reveal ? undefined : 'true'}
          style={getItemStyle(i)}
        >
          <span>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}

SplitText.propTypes = {
  text: PropTypes.string,
  as: PropTypes.elementType,
  className: PropTypes.string,
  step: PropTypes.number,
  base: PropTypes.number,
  reveal: PropTypes.bool,
};
