import useScrollY from '../hooks/useScrollY';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export default function ScrollProgress() {
  const y = useScrollY();
  const reduced = reducedMotionQuery?.matches;

  let progress = 0;
  if (!reduced && typeof document !== 'undefined') {
    const h =
      (document.documentElement.scrollHeight || 0) - window.innerHeight;
    progress = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
  } else {
    progress = 1;
  }

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
