import { useEffect, useRef } from 'react';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export default function useReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
  selector,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (reducedMotionQuery?.matches) {
      const targets = selector
        ? root.querySelectorAll(selector)
        : [root];
      targets.forEach((el) => el.setAttribute('data-revealed', 'true'));
      root.setAttribute('data-revealed', 'true');
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      const targets = selector ? root.querySelectorAll(selector) : [root];
      targets.forEach((el) => el.setAttribute('data-revealed', 'true'));
      root.setAttribute('data-revealed', 'true');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.removeAttribute('data-revealed');
          }
        }
      },
      { threshold, rootMargin }
    );

    if (selector) {
      const targets = root.querySelectorAll(selector);
      // mark the root too so it can act as a container
      root.setAttribute('data-revealed', 'true');
      targets.forEach((el) => io.observe(el));
    } else {
      io.observe(root);
    }
    return () => io.disconnect();
  }, [threshold, rootMargin, once, selector]);

  return ref;
}
