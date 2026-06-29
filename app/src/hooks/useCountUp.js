import { useEffect, useRef, useState } from 'react';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a numeric value from 0 → target as the element scrolls into view.
 * Returns a ref to attach to the wrapper and the formatted display string.
 */
export default function useCountUp({
  to = 0,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
} = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(reducedMotionQuery?.matches ? to : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotionQuery?.matches) {
      setValue(to);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setValue(easeOutCubic(p) * to);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setValue(to);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  const display = `${prefix}${value.toFixed(decimals)}${suffix}`;
  return [ref, display];
}
