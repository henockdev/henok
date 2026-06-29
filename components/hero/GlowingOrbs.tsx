'use client';

import { useEffect, useRef } from 'react';

export function GlowingOrbs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), rgba(56, 189, 248, 0.18), transparent 60%),
          radial-gradient(800px circle at 20% 80%, rgba(139, 92, 246, 0.18), transparent 60%),
          radial-gradient(700px circle at 80% 20%, rgba(34, 211, 238, 0.15), transparent 60%)
        `,
      }}
    />
  );
}
