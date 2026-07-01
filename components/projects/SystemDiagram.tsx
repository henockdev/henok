'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * SystemDiagram
 * ─────────────────────────────────────────────────────────────
 * An animated architecture diagram that draws itself as it
 * enters the viewport. Boxes fade in sequentially, then
 * connections draw from one node to the next.
 *
 * Use SystemDiagram.Neural or SystemDiagram.Olive presets, or
 * pass custom nodes/edges.
 */

export type Node = {
  id: string;
  label: string;
  description?: string;
  x: number; // 0-100 percent
  y: number; // 0-100 percent
  icon?: string;
  accent?: string;
  group?: 'frontend' | 'backend' | 'data' | 'service' | 'client' | 'integration';
};

export type Edge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

export function SystemDiagram({
  nodes,
  edges,
  height = 520,
  caption,
}: {
  nodes: Node[];
  edges: Edge[];
  height?: number;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  // Sequential stagger: nodes appear in left-to-right or top-to-bottom order
  const orderedIds = useRef<string[]>([]);
  if (orderedIds.current.length === 0) {
    // Sort by y first, then x, for a natural top-to-bottom / left-to-right reveal
    const sorted = [...nodes].sort((a, b) => (a.y - b.y) * 2 + (a.x - b.x));
    orderedIds.current = sorted.map((n) => n.id);
  }
  const orderIndex = (id: string) => orderedIds.current.indexOf(id);

  return (
    <div ref={ref} className="relative">
      <div
        className="relative w-full rounded-3xl glass-card border border-white/[0.08] overflow-hidden"
        style={{ height }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        {/* Soft gradient wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.10), transparent 60%)',
          }}
        />

        {/* SVG layer for edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="sys-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {edges.map((e, i) => {
            const fromNode = nodes.find((n) => n.id === e.from);
            const toNode = nodes.find((n) => n.id === e.to);
            if (!fromNode || !toNode) return null;
            const fromOrder = Math.max(orderIndex(e.from), orderIndex(e.to));
            const delay = 0.3 + fromOrder * 0.18 + i * 0.05;
            const x1 = `${fromNode.x}%`;
            const y1 = `${fromNode.y}%`;
            const x2 = `${toNode.x}%`;
            const y2 = `${toNode.y}%`;
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2 - 6;
            const path = `M ${x1} ${y1} Q ${midX}% ${midY}% ${x2} ${y2}`;
            return (
              <g key={`${e.from}-${e.to}`}>
                <motion.path
                  d={path}
                  stroke="url(#sys-line)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay, ease: 'easeInOut' }}
                />
                {e.dashed && (
                  <motion.path
                    d={path}
                    stroke="rgba(139,92,246,0.4)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 0.8, delay: delay + 0.2 }}
                  />
                )}
                {e.label && (
                  <motion.text
                    x={`${midX}%`}
                    y={`${midY - 1}%`}
                    fill="rgba(255,255,255,0.55)"
                    fontSize="10"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4, delay: delay + 0.4 }}
                    style={{ fontFamily: 'ui-monospace, monospace' }}
                  >
                    {e.label}
                  </motion.text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Node layer */}
        {nodes.map((node) => {
          const idx = orderIndex(node.id);
          const accent = node.accent || '#38BDF8';
          return (
            <motion.div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.5, delay: 0.05 + idx * 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative px-4 py-2.5 rounded-xl glass-strong border text-center min-w-[140px]"
                style={{ borderColor: `${accent}40`, boxShadow: `0 4px 24px ${accent}15` }}
              >
                {/* Glow dot */}
                <div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
                />
                <div
                  className="text-[10px] uppercase tracking-widest font-semibold mb-0.5"
                  style={{ color: accent }}
                >
                  {node.icon ? `${node.icon} ` : ''}
                  {node.group ? node.group : ''}
                </div>
                <div className="text-sm font-semibold text-white leading-tight">
                  {node.label}
                </div>
                {node.description && (
                  <div className="text-[10px] text-text-secondary mt-1 leading-tight max-w-[160px]">
                    {node.description}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {caption && (
        <div className="mt-3 text-xs text-text-secondary/70 text-center font-mono">{caption}</div>
      )}
    </div>
  );
}

/* ============================================================
 * Neural preset
 * ============================================================ */
export function NeuralDiagram() {
  const nodes: Node[] = [
    { id: 'visitor', label: 'Visitor', icon: '👤', x: 8, y: 50, accent: '#94A3B8', group: 'client' },
    { id: 'landing', label: 'Landing', description: 'Hero + features', x: 24, y: 30, accent: '#38BDF8', group: 'frontend' },
    { id: 'pricing', label: 'Pricing', description: 'Plan tiers', x: 24, y: 70, accent: '#38BDF8', group: 'frontend' },
    { id: 'signin', label: 'Sign in', description: 'JWT mock auth', x: 44, y: 22, accent: '#38BDF8', group: 'frontend' },
    { id: 'dashboard', label: 'Dashboard', description: 'Widgets + KPIs', x: 64, y: 18, accent: '#A78BFA', group: 'frontend' },
    { id: 'generator', label: 'AI Generator', description: 'Streaming output', x: 64, y: 40, accent: '#A78BFA', group: 'frontend' },
    { id: 'templates', label: 'Templates', description: 'Search + filter', x: 64, y: 62, accent: '#A78BFA', group: 'frontend' },
    { id: 'analytics', label: 'Analytics', description: 'Charts + funnels', x: 64, y: 84, accent: '#A78BFA', group: 'frontend' },
    { id: 'router', label: 'React Router 6', description: 'Route groups', x: 44, y: 50, accent: '#22D3EE', group: 'service' },
    { id: 'tokens', label: 'Design Tokens', description: 'Single source', x: 44, y: 78, accent: '#22D3EE', group: 'service' },
    { id: 'llm', label: 'LLM Provider', description: 'Swap-ready', x: 90, y: 50, accent: '#F472B6', group: 'integration', },
  ];

  const edges: Edge[] = [
    { from: 'visitor', to: 'landing' },
    { from: 'visitor', to: 'pricing' },
    { from: 'landing', to: 'signin', label: 'CTA' },
    { from: 'pricing', to: 'signin', label: 'Get started' },
    { from: 'signin', to: 'router' },
    { from: 'router', to: 'dashboard' },
    { from: 'router', to: 'generator' },
    { from: 'router', to: 'templates' },
    { from: 'router', to: 'analytics' },
    { from: 'generator', to: 'llm', label: 'stream', dashed: true },
    { from: 'tokens', to: 'dashboard', dashed: true, label: 'theme' },
    { from: 'tokens', to: 'generator', dashed: true },
    { from: 'tokens', to: 'templates', dashed: true },
    { from: 'tokens', to: 'analytics', dashed: true },
  ];

  return (
    <SystemDiagram
      nodes={nodes}
      edges={edges}
      caption="Marketing → Auth → App — design tokens flow into every authenticated surface"
    />
  );
};

// Compound component aliases (preserved for backward compatibility)
SystemDiagram.Neural = NeuralDiagram;

/* ============================================================
 * Olive & Atlas preset
 * ============================================================ */
export function OliveDiagram() {
  const nodes: Node[] = [
    { id: 'host', label: 'Multi-property', description: '4 properties · one product', icon: '🏨', x: 8, y: 50, accent: '#C4674A', group: 'client' },
    { id: 'app', label: 'Next.js App', description: 'App Router + RGs', x: 28, y: 50, accent: '#22D3EE', group: 'frontend' },
    { id: 'dash', label: 'Daily Ops', description: 'Revenue, occupancy, staffing', x: 50, y: 22, accent: '#FBBF24', group: 'frontend' },
    { id: 'olive', label: 'Olive AI', description: 'Grounded copilot', x: 50, y: 50, accent: '#F472B6', group: 'service' },
    { id: 'settings', label: 'Settings', description: '7 sections', x: 50, y: 78, accent: '#FBBF24', group: 'frontend' },
    { id: 'tokens', label: 'Atomic Design', description: 'Atoms → Layouts', x: 72, y: 30, accent: '#22D3EE', group: 'service' },
    { id: 'data', label: 'Mock Data Layer', description: 'Typed, swap-ready', x: 72, y: 70, accent: '#22D3EE', group: 'service' },
    { id: 'llm', label: 'LLM', description: 'Olive grounding', x: 92, y: 50, accent: '#A78BFA', group: 'integration' },
  ];

  const edges: Edge[] = [
    { from: 'host', to: 'app' },
    { from: 'app', to: 'dash' },
    { from: 'app', to: 'olive' },
    { from: 'app', to: 'settings' },
    { from: 'tokens', to: 'dash', dashed: true },
    { from: 'tokens', to: 'olive', dashed: true },
    { from: 'tokens', to: 'settings', dashed: true },
    { from: 'data', to: 'dash', dashed: true, label: 'props' },
    { from: 'data', to: 'olive', dashed: true, label: 'context' },
    { from: 'olive', to: 'llm', label: 'RAG' },
  ];

  return (
    <SystemDiagram
      nodes={nodes}
      edges={edges}
      caption="Hospitality ops · grounded AI · atomic design — one product, four properties"
    />
  );
};

// Compound component aliases (preserved for backward compatibility)
SystemDiagram.Olive = OliveDiagram;