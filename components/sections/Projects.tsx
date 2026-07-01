'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Project, ProjectCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ArrowUpRight,
  Star,
  Pin,
  Github,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Zap,
} from 'lucide-react';

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'AI',
  'Web',
  'Mobile',
  'ITSM',
  'Automation',
  'Open Source',
  'Enterprise',
  'Freelance',
  'Research',
  'Personal',
];

const categoryThemes: Record<
  ProjectCategory,
  { main: string; light: string; gradient: string; soft: string }
> = {
  AI: { main: '#A78BFA', light: 'rgba(167,139,250,0.18)', gradient: 'linear-gradient(135deg,#A78BFA 0%,#8B5CF6 100%)', soft: 'rgba(167,139,250,0.08)' },
  Web: { main: '#60A5FA', light: 'rgba(56,189,248,0.18)', gradient: 'linear-gradient(135deg,#60A5FA 0%,#22D3EE 100%)', soft: 'rgba(56,189,248,0.08)' },
  Mobile: { main: '#C084FC', light: 'rgba(192,132,252,0.18)', gradient: 'linear-gradient(135deg,#C084FC 0%,#8B5CF6 100%)', soft: 'rgba(192,132,252,0.08)' },
  ITSM: { main: '#F87171', light: 'rgba(239,68,68,0.18)', gradient: 'linear-gradient(135deg,#F87171 0%,#EF4444 100%)', soft: 'rgba(239,68,68,0.08)' },
  Automation: { main: '#FBBF24', light: 'rgba(245,158,11,0.18)', gradient: 'linear-gradient(135deg,#FBBF24 0%,#F59E0B 100%)', soft: 'rgba(245,158,11,0.08)' },
  'Open Source': { main: '#34D399', light: 'rgba(16,185,129,0.18)', gradient: 'linear-gradient(135deg,#34D399 0%,#10B981 100%)', soft: 'rgba(16,185,129,0.08)' },
  Enterprise: { main: '#C4674A', light: 'rgba(196,103,74,0.22)', gradient: 'linear-gradient(135deg,#C9A876 0%,#B5462C 100%)', soft: 'rgba(196,103,74,0.10)' },
  Freelance: { main: '#F472B6', light: 'rgba(236,72,153,0.18)', gradient: 'linear-gradient(135deg,#F472B6 0%,#EC4899 100%)', soft: 'rgba(236,72,153,0.08)' },
  Research: { main: '#22D3EE', light: 'rgba(34,211,238,0.18)', gradient: 'linear-gradient(135deg,#22D3EE 0%,#06B6D4 100%)', soft: 'rgba(34,211,238,0.08)' },
  Personal: { main: '#94A3B8', light: 'rgba(148,163,184,0.18)', gradient: 'linear-gradient(135deg,#94A3B8 0%,#64748B 100%)', soft: 'rgba(148,163,184,0.08)' },
};

const allTheme = { main: '#38BDF8', light: 'rgba(56,189,248,0.18)', gradient: 'linear-gradient(135deg,#38BDF8 0%,#22D3EE 100%)', soft: 'rgba(56,189,248,0.08)' };

function getTheme(cat: ProjectCategory | 'All') {
  return cat === 'All' ? allTheme : categoryThemes[cat];
}

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
  const [query, setQuery] = useState('');

  const ordered = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [projects]);

  const pinned = ordered.find((p) => p.pinned);
  const rest = ordered.filter((p) => !p.pinned);

  const filtered = useMemo(() => {
    return rest
      .filter((p) => (filter === 'All' ? true : p.category === filter))
      .filter((p) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [rest, filter, query]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      featured: projects.filter((p) => p.featured).length,
      pinned: projects.filter((p) => p.pinned).length,
      stacks: new Set(projects.flatMap((p) => p.technologies)).size,
    }),
    [projects]
  );

  return (
    <section id="projects" className="section-pad relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)' }} />
        <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.35), transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(196,103,74,0.30), transparent 70%)' }} />
      </div>

      <div className="container-tight relative z-10">
        <SectionHeader
          eyebrow="Projects"
          title={<>Selected <span className="gradient-text">work</span></>}
          description="Every project here was built end-to-end — code, design, infrastructure, and the 2am pager. Click any card for the full story."
        />

        {/* Quick stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <StatChip icon={<Layers size={14} />} label="Projects" value={stats.total} accent="#38BDF8" />
          <StatChip icon={<Star size={14} />} label="Featured" value={stats.featured} accent="#A78BFA" />
          <StatChip icon={<Pin size={14} />} label="Spotlight" value={stats.pinned} accent="#F472B6" />
          <StatChip icon={<Zap size={14} />} label="Stacks" value={stats.stacks} accent="#34D399" />
        </motion.div>

        {/* Pinned spotlight */}
        {pinned && <ProjectSpotlight project={pinned} />}

        {/* Filter + search */}
        <motion.div
          className="mt-20 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full glass-strong border border-white/[0.08] focus:border-accent-blue/40 focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-white placeholder:text-text-secondary text-sm"
              />
            </div>
            <div className="text-xs uppercase tracking-wider text-text-secondary">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const count = c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;
              if (c !== 'All' && count === 0) return null;
              const isActive = filter === c;
              const theme = getTheme(c);
              return (
                <motion.button
                  key={c}
                  onClick={() => setFilter(c)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300',
                    isActive
                      ? 'text-bg'
                      : 'glass text-text-secondary hover:text-white border border-white/[0.08]'
                  )}
                  style={
                    isActive
                      ? { background: theme.gradient, boxShadow: `0 8px 32px ${theme.soft}` }
                      : undefined
                  }
                >
                  <span className="relative z-10">{c}</span>
                  <span className={cn('ml-2 text-[10px] tabular-nums', isActive ? 'opacity-70' : 'opacity-50')}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Project grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${filter}-${query}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="text-center py-24 glass-card rounded-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-text-secondary text-lg mb-3">No projects match those filters.</p>
              <button
                onClick={() => {
                  setFilter('All');
                  setQuery('');
                }}
                className="px-6 py-2 rounded-full glass hover:bg-white/[0.08] transition-all text-white text-sm"
              >
                Reset filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ============================================================
 * Stat chip
 * ============================================================ */
function StatChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="relative glass-card rounded-2xl p-5 overflow-hidden group">
      <div
        className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ background: accent }}
      />
      <div className="relative flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}25`, color: accent }}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
          <div className="text-xs uppercase tracking-wider text-text-secondary">{label}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Spotlight — the pinned hero card with tilt
 * ============================================================ */
function ProjectSpotlight({ project }: { project: Project }) {
  const theme = getTheme(project.category);
  const banner = project.banner || project.thumbnail;
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center p-6 md:p-10 rounded-[2rem] glass-strong overflow-hidden group"
      style={{ borderColor: `${theme.main}40` }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, ${theme.light}, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 grid-bg" />
      </div>

      {/* Left content */}
      <div className="lg:col-span-5 relative z-10">
        <motion.div className="flex items-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold"
            style={{ background: theme.gradient, color: '#0B1120' }}
          >
            <Pin size={11} fill="#0B1120" /> Pinned Spotlight
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] glass border border-white/10 text-text-secondary">
            <Sparkles size={11} /> Featured
          </span>
        </motion.div>

        <h3 className="heading-2 mb-4 leading-[1.05] text-balance">
          <span className="text-white">{project.title.split(' — ')[0]}</span>
          {project.title.includes(' — ') && (
            <span className="block gradient-text text-3xl md:text-4xl font-semibold mt-2">
              {project.title.split(' — ')[1]}
            </span>
          )}
        </h3>

        <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6 text-balance">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.technologies.slice(0, 5).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] rounded-full glass border border-white/[0.06] text-text-secondary"
            >
              {t}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="px-2.5 py-1 text-[11px] rounded-full glass border border-white/[0.06] text-text-secondary">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-bg transition-all"
            style={{ background: theme.gradient, boxShadow: `0 8px 28px ${theme.soft}` }}
          >
            View case study
            <ArrowUpRight size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 hover:bg-white/[0.08] transition-all text-white text-sm"
            >
              <Github size={15} /> Source
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 hover:bg-white/[0.08] transition-all text-white text-sm"
            >
              <ExternalLink size={15} /> Live
            </a>
          )}
        </div>

        {/* Metrics row */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-white/10">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <div className="text-xl md:text-2xl font-bold" style={{ color: theme.main }}>
                  {m.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-text-secondary mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: image with 3D tilt */}
      <div className="lg:col-span-7 relative z-10">
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
          className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card border-2"
          // border color tinted
          // using inline style via theme
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${theme.light} 0%, transparent 50%)`,
              opacity: 0.6,
            }}
          />
          {banner ? (
            <Image
              src={banner}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              style={{ transform: 'translateZ(40px)' }}
              unoptimized={banner.endsWith('.svg')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm">
              No preview
            </div>
          )}
          {/* glow ring */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 80px ${theme.light}, inset 0 0 0 1px ${theme.main}30`,
              borderRadius: '1rem',
            }}
          />
        </motion.div>

        {/* Floating caption */}
        {project.media?.[0]?.caption && (
          <div className="mt-4 text-xs text-text-secondary font-mono">{project.media[0].caption}</div>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================
 * Project card with image, glow, and tilt
 * ============================================================ */
function ProjectCard({ project }: { project: Project }) {
  const theme = getTheme(project.category);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 22 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block relative h-full"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={ref} style={{ perspective: 1000 }} className="h-full">
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
          className="relative h-full glass-card rounded-2xl overflow-hidden border"
        >
          {/* glow background that pulses on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 0%, ${theme.light}, transparent 60%)`,
            }}
          />

          {/* Image area */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                unoptimized={project.thumbnail.endsWith('.svg')}
                style={{ transform: 'translateZ(20px)' }}
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: theme.gradient }}
              >
                <span className="text-white/80 font-mono text-xs">No preview</span>
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent opacity-90" />

            {/* Top-right badges */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              {project.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider bg-white/90 text-bg font-semibold backdrop-blur">
                  <Star size={9} fill="#0B1120" /> Featured
                </span>
              )}
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider backdrop-blur"
                style={{ background: `${theme.main}30`, color: theme.main }}
              >
                {project.category}
              </span>
            </div>

            {/* Card title overlay on image bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white leading-tight truncate">
                    {project.title}
                  </h3>
                </div>
                <motion.div
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur"
                  style={{ background: `${theme.main}40`, color: theme.main }}
                  initial={{ x: 0, y: 0 }}
                  whileHover={{ x: 3, y: -3 }}
                >
                  <ArrowUpRight size={15} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="relative p-5 bg-gradient-to-b from-bg/60 to-bg" style={{ transform: 'translateZ(30px)' }}>
            <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
              {project.shortDescription}
            </p>

            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-y border-white/[0.06]">
                {project.metrics.slice(0, 3).map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="text-sm font-bold tabular-nums" style={{ color: theme.main }}>
                      {m.value}
                    </div>
                    <div className="text-[9px] text-text-secondary uppercase tracking-wider truncate">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10px] rounded bg-white/[0.04] text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-0.5 text-[10px] rounded bg-white/[0.04] text-text-secondary">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                {project.githubUrl && <Github size={13} />}
                {project.liveUrl && <ExternalLink size={13} />}
              </div>
            </div>
          </div>

          {/* Border on hover */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none border"
            style={{
              borderColor: 'transparent',
              transition: 'border-color 0.4s',
            }}
          />
        </motion.div>
      </div>

      {/* Hover border ring (outside the 3d layer to avoid clipping) */}
      <style jsx>{`
        :global(.group:hover) .ring-hover {
          border-color: ${theme.main}80 !important;
        }
      `}</style>
    </Link>
  );
}
