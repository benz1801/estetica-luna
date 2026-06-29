import { useCallback } from 'react';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export default function useRevealStagger({
  step = 90,
  base = 0,
} = {}) {
  const getItemStyle = useCallback(
    (index) => {
      if (reducedMotionQuery?.matches) return undefined;
      return { transitionDelay: `${base + index * step}ms` };
    },
    [base, step]
  );

  return { getItemStyle };
}
