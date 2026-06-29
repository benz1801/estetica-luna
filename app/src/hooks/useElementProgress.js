import { useEffect, useState } from 'react';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

/**
 * Returns the current vertical progress (0..1) of an element through the viewport.
 * `offsetPx` lets you shift the window — e.g. 100 means "trigger when 100px from top".
 */
export default function useElementProgress(ref, { offsetPx = 0 } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotionQuery?.matches) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const start = viewH - offsetPx;
      const end = -rect.height + offsetPx;
      const total = start - end;
      const raw = (start - rect.top) / total;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, offsetPx]);

  return progress;
}
