'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Project, ProjectCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Star, Github, ExternalLink, Pin } from 'lucide-react';

const CATEGORIES: (ProjectCategory | 'All')[] = ['All', 'AI', 'Web', 'Mobile', 'ITSM', 'Automation', 'Open Source', 'Enterprise', 'Freelance', 'Research', 'Personal'];

const categoryColors: Record<ProjectCategory, string> = {
  AI: '#8B5CF6',
  Web: '#38BDF8',
  Mobile: '#A78BFA',
  ITSM: '#EF4444',
  Automation: '#F59E0B',
  'Open Source': '#10B981',
  Enterprise: '#22D3EE',
  Freelance: '#EC4899',
  Research: '#06B6D4',
  Personal: '#94A3B8',
};

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return projects
      .filter((p) => (filter === 'All' ? true : p.category === filter))
      .filter((p) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, filter, query]);

  return (
    <section id="projects" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Projects"
          title={<>Selected <span className="gradient-text">work</span></>}
          description="Every project here was built end-to-end. Filter by category or search by tech — case studies are linked where available."
        />

        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search projects, technologies…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
            />
          </div>
          <div className="text-sm text-text-secondary">{filtered.length} project{filtered.length === 1 ? '' : 's'}</div>
        </div>

        <LayoutGroup>
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((c) => {
              const count = c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;
              if (c !== 'All' && count === 0) return null;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-sm transition-all relative',
                    filter === c ? 'text-bg font-medium' : 'glass hover:bg-white/[0.08]',
                  )}
                  style={filter === c ? { background: c === 'All' ? 'white' : categoryColors[c as ProjectCategory], color: '#050816' } : {}}
                >
                  {c}
                  <span className={cn('ml-1.5 text-[10px]', filter === c ? 'opacity-70' : 'opacity-50')}>{count}</span>
                </button>
              );
            })}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-text-secondary">
            No projects match your filter. Try a different category or search term.
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const accent = categoryColors[project.category] ?? '#38BDF8';

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block relative h-full glass-card overflow-hidden hover:bg-white/[0.06] transition-all"
    >
      {/* Top banner */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${accent}30 0%, rgba(11, 17, 32, 0.95) 60%, rgba(5, 8, 22, 1) 100%)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ProjectSVG name={project.slug} accent={accent} />
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {project.pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider bg-white/90 text-bg font-medium">
              <Pin size={9} /> Pinned
            </span>
          )}
          {project.featured && !project.pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider" style={{ background: accent, color: '#050816' }}>
              <Star size={9} fill="#050816" /> Featured
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider glass-strong">{project.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 group-hover:gradient-text transition-all">{project.title}</h3>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">{project.shortDescription}</p>

        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-white/[0.06]">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-sm font-bold" style={{ color: accent }}>{m.value}</div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wider truncate">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 text-[11px] rounded bg-white/[0.04] text-text-secondary">{t}</span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] rounded bg-white/[0.04] text-text-secondary">+{project.technologies.length - 3}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            {project.githubUrl && <Github size={14} />}
            {project.liveUrl && <ExternalLink size={14} />}
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Procedural SVG thumbnails — lightweight, no external assets needed.
function ProjectSVG({ name, accent }: { name: string; accent: string }) {
  const id = name.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return (
    <svg viewBox="0 0 240 150" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="240" height="150" fill={`url(#bg-${id})`} />
      {/* abstract shapes */}
      <circle cx="60" cy="75" r="38" fill={accent} fillOpacity="0.12" />
      <circle cx="60" cy="75" r="24" fill={accent} fillOpacity="0.2" />
      <circle cx="60" cy="75" r="12" fill={accent} fillOpacity="0.4" />
      <rect x="120" y="40" width="90" height="6" rx="3" fill="white" fillOpacity="0.15" />
      <rect x="120" y="55" width="70" height="6" rx="3" fill="white" fillOpacity="0.1" />
      <rect x="120" y="70" width="80" height="6" rx="3" fill="white" fillOpacity="0.15" />
      <rect x="120" y="90" width="40" height="20" rx="4" fill={accent} fillOpacity="0.6" />
      <rect x="166" y="90" width="44" height="20" rx="4" fill="white" fillOpacity="0.06" />
    </svg>
  );
}
