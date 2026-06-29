import PropTypes from 'prop-types';

export default function ScrollCue({ label = 'Scroll' }) {
  return (
    <a href="#servizi" className="scroll-cue" aria-label={`${label} per scoprire i servizi`}>
      <span>{label}</span>
      <span className="cue-line" aria-hidden="true" />
    </a>
  );
}

ScrollCue.propTypes = {
  label: PropTypes.string,
};
