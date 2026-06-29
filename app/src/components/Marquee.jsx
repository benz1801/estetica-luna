import PropTypes from 'prop-types';

export default function Marquee({ items = [], tone = 'light' }) {
  // duplicate the items so the -50% translateX loops seamlessly
  const loop = [...items, ...items];

  return (
    <div
      className={`relative ${
        tone === 'dark'
          ? 'bg-botanical-900 text-cream-50'
          : 'bg-cream-100/70 text-ink-900'
      } border-y border-ink-900/5 py-6`}
    >
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {loop.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className={`marquee-item ${
                tone === 'dark' ? '!text-cream-50/90' : ''
              }`}
            >
              <span className="dot" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

Marquee.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  tone: PropTypes.oneOf(['light', 'dark']),
};
