'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ExternalLink,
  Maximize2,
  Sparkles,
  Home,
  Layers,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Zap,
  ChevronRight,
} from 'lucide-react';

/**
 * DemoBooth
 * ─────────────────────────────────────────────────────────────
 * A desktop-browser-style frame around an embedded live demo
 * (Neural). It looks like a browser window with controls, lets
 * visitors click around, and lets recruiters feel the product.
 *
 * HashRouter is used by Neural so URLs stay under
 * /demos/neural/#/... and don't collide with Next.js routing.
 */

const innerPages = [
  { hash: '#/', label: 'Landing', icon: Home },
  { hash: '#/pricing', label: 'Pricing', icon: Sparkles },
  { hash: '#/sign-in', label: 'Sign in', icon: ChevronRight },
  { hash: '#/app/dashboard', label: 'Dashboard', icon: Layers },
  { hash: '#/app/generator', label: 'Generator', icon: Zap },
  { hash: '#/app/analytics', label: 'Analytics', icon: BarChart3 },
  { hash: '#/app/team', label: 'Team', icon: Users },
  { hash: '#/app/billing', label: 'Billing', icon: CreditCard },
  { hash: '#/app/settings', label: 'Settings', icon: Settings },
];

const metrics = [
  { value: '17', label: 'Screens shipped' },
  { value: '8', label: 'Auth pages' },
  { value: '0', label: 'External deps' },
];

export function DemoBooth() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeHash, setActiveHash] = useState('#/');
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<string[]>(['#/']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Listen for iframe hash changes via polling the iframe URL.
  useEffect(() => {
    const t = setInterval(() => {
      try {
        const w = iframeRef.current?.contentWindow;
        if (!w) return;
        const h = w.location.hash || '#/';
        if (h !== activeHash) {
          setActiveHash(h);
          // Sync history
          setHistory((prev) => {
            const last = prev[prev.length - 1];
            if (last === h) return prev;
            const next = [...prev.slice(0, historyIdx + 1), h];
            setHistoryIdx(next.length - 1);
            return next;
          });
        }
      } catch {
        // Cross-origin restriction can happen if Neural somehow ends up
        // on a different origin. Safe to ignore.
      }
    }, 300);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHash, historyIdx]);

  function navigate(hash: string) {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.location.hash = hash;
    setActiveHash(hash);
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last === hash) return prev;
      const next = [...prev.slice(0, historyIdx + 1), hash];
      setHistoryIdx(next.length - 1);
      return next;
    });
  }

  function back() {
    if (historyIdx <= 0) return;
    const idx = historyIdx - 1;
    const h = history[idx];
    setHistoryIdx(idx);
    setActiveHash(h);
    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.location.hash = h;
  }

  function forward() {
    if (historyIdx >= history.length - 1) return;
    const idx = historyIdx + 1;
    const h = history[idx];
    setHistoryIdx(idx);
    setActiveHash(h);
    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.location.hash = h;
  }

  function refresh() {
    setRefreshKey((k) => k + 1);
    setLoading(true);
  }

  const fullSrc = `https://henokamdiye.com/demos/neural/${activeHash}`;
  const localSrc = `/demos/neural/${activeHash}`;

  return (
    <section id="demo" className="section-pad relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 left-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.5), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)' }}
        />
      </div>

      <div className="container-tight relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/[0.12] mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
            </span>
            <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Live demo — click around
            </span>
          </div>
          <h2 className="heading-2 mb-4 text-balance">
            <span className="text-white">Try it</span>{' '}
            <span className="gradient-text">yourself</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-base md:text-lg leading-relaxed text-balance">
            Most portfolios show screenshots. This one lets you <span className="text-white font-medium">use</span> the product.
            Neural is fully wired — auth, dashboard, generator, billing — and it&apos;s running right here.
          </p>
        </motion.div>

        {/* Browser-frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`relative mx-auto rounded-2xl overflow-hidden glass-strong border border-white/[0.1] shadow-2xl shadow-black/40 ${
            fullscreen ? 'fixed inset-4 z-50' : ''
          }`}
          style={{
            boxShadow:
              '0 30px 80px -20px rgba(56,189,248,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          {/* Window header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-black/40 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={back}
                disabled={historyIdx <= 0}
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition"
                aria-label="Back"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                onClick={forward}
                disabled={historyIdx >= history.length - 1}
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition"
                aria-label="Forward"
              >
                <ArrowRight size={14} />
              </button>
              <button
                onClick={refresh}
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/[0.06] transition"
                aria-label="Reload"
              >
                <RotateCw size={13} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* URL bar */}
            <div className="flex-1 mx-2 hidden sm:flex">
              <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-text-secondary truncate">
                  neural.henokamdiye.com
                  <span className="text-accent-blue">{activeHash}</span>
                </span>
              </div>
            </div>

            {/* Right buttons */}
            <div className="flex items-center gap-1">
              <a
                href={fullSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/[0.06] transition"
                aria-label="Open in new tab"
                title="Open in new tab"
              >
                <ExternalLink size={13} />
              </a>
              <button
                onClick={() => setFullscreen((f) => !f)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/[0.06] transition"
                aria-label="Fullscreen"
                title="Fullscreen"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* URL bar (mobile) */}
          <div className="sm:hidden flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-black/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-text-secondary truncate">
              neural.henokamdiye.com
              <span className="text-accent-blue">{activeHash}</span>
            </span>
          </div>

          {/* Iframe */}
          <div className={`relative w-full bg-black ${fullscreen ? 'h-[calc(100%-7rem)]' : ''}`} style={!fullscreen ? { aspectRatio: '16 / 10' } : undefined}>
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-bg"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white/10 border-t-accent-blue animate-spin"
                      aria-hidden
                    />
                    <div className="text-xs text-text-secondary">Loading Neural…</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <iframe
              key={refreshKey}
              ref={iframeRef}
              src={localSrc}
              title="Neural — AI Content Studio (live demo)"
              className="absolute inset-0 w-full h-full border-0"
              onLoad={() => setLoading(false)}
              allow="clipboard-write"
            />
          </div>

          {/* Footer / Page picker */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-white/[0.08] bg-black/40 backdrop-blur">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary/70 mr-2 hidden md:block">
              Quick jump
            </div>
            <div className="flex flex-wrap gap-1.5">
              {innerPages.map((p) => {
                const Icon = p.icon;
                const active = activeHash === p.hash;
                return (
                  <button
                    key={p.hash}
                    onClick={() => navigate(p.hash)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-all ${
                      active
                        ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                        : 'text-text-secondary hover:text-white border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon size={11} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Metrics row beneath */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto"
        >
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="relative glass-card rounded-2xl p-5 text-center overflow-hidden"
            >
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl opacity-40"
                style={{ background: i === 0 ? '#38BDF8' : i === 1 ? '#A78BFA' : '#34D399' }}
              />
              <div className="relative">
                <div className="text-3xl md:text-4xl font-bold gradient-text tabular-nums">
                  {m.value}
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-text-secondary mt-1.5">
                  {m.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-text-secondary mb-4">
            More projects coming — Olive &amp; Atlas and TemariAi get full embeds next.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/henockdev/neural"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] text-sm text-text-secondary hover:text-white transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.1 0 4.44-2.69 5.41-5.25 5.7.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              Source on GitHub
            </a>
            <a
              href={fullSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] text-sm text-text-secondary hover:text-white transition"
            >
              <ExternalLink size={14} /> Open demo full-screen
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}