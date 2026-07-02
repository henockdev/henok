'use client';

import dynamic from 'next/dynamic';

/**
 * HeavySections
 * ─────────────────────────────────────────────────────────────
 * Lazy-loaded, client-only wrappers for the heaviest below-the-fold
 * sections. Lives as its own client component because Next 15 forbids
 * `dynamic(..., { ssr: false })` inside Server Components.
 *
 * Each section ships its own skeleton via the `loading` option so the
 * page never pops in blank — visitors see a calm shimmer in the
 * correct shape, then the real section takes over.
 */

const DemoBooth = dynamic(
  () => import('./sections/DemoBooth').then((m) => m.DemoBooth),
  {
    ssr: false,
    loading: () => <DemoBoothSkeleton />,
  },
);

const AIDemoSection = dynamic(
  () => import('./sections/AIDemoSection').then((m) => m.AIDemoSection),
  {
    ssr: false,
    loading: () => <AISkeleton />,
  },
);

export function HeavySections() {
  return (
    <>
      <DemoBooth />
      <AIDemoSection />
    </>
  );
}

function DemoBoothSkeleton() {
  return (
    <section id="demo" className="section-pad" aria-hidden="true">
      <div className="container-tight">
        <div className="text-center mb-12">
          <div className="h-6 w-40 mx-auto rounded-full bg-white/[0.06] mb-6" />
          <div className="h-12 w-80 mx-auto rounded-lg bg-white/[0.04] mb-4" />
          <div className="h-5 w-96 max-w-full mx-auto rounded bg-white/[0.03]" />
        </div>
        <div className="mx-auto rounded-2xl glass-strong border border-white/[0.1] overflow-hidden">
          <div className="h-12 border-b border-white/[0.08] bg-black/40" />
          <div className="w-full bg-black/30" style={{ aspectRatio: '16 / 10' }} />
        </div>
      </div>
    </section>
  );
}

function AISkeleton() {
  return (
    <section id="ai" className="section-pad" aria-hidden="true">
      <div className="container-tight">
        <div className="text-center mb-12">
          <div className="h-6 w-40 mx-auto rounded-full bg-white/[0.06] mb-6" />
          <div className="h-12 w-72 mx-auto rounded-lg bg-white/[0.04] mb-4" />
          <div className="h-5 w-[28rem] max-w-full mx-auto rounded bg-white/[0.03]" />
        </div>
        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 min-h-[28rem]" />
      </div>
    </section>
  );
}