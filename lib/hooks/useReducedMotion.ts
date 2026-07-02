'use client';

import { useEffect, useState } from 'react';

/**
 * useReducedMotion
 * ─────────────────────────────────────────────────────────────
 * Returns true when the user has `prefers-reduced-motion: reduce`
 * set at the OS level. Use this to gate heavy animations and 3D
 * scenes so motion-sensitive users (vestibular disorders, ~5% of
 * the population) don't get a bad experience.
 *
 * Matches the CSS media query in app/globals.css. Both must agree.
 *
 * Default to `false` during SSR / first paint so we don't flash a
 * reduced state to users who don't want it; sync on mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setReduced(e.matches);
    handler(mq);
    // Newer browsers: addEventListener; older Safari: addListener
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      (mq as unknown as { addListener: (cb: typeof handler) => void }).addListener(handler);
      return () => {
        (mq as unknown as { removeListener: (cb: typeof handler) => void }).removeListener(handler);
      };
    }
  }, []);

  return reduced;
}