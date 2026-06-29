'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Project, ProjectCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Star, Github, ExternalLink, Pin, Zap } from 'lucide-react';

const CATEGORIES: (ProjectCategory | 'All')[] = ['All', 'AI', 'Web', 'Mobile', 'ITSM', 'Automation', 'Open Source', 'Enterprise', 'Freelance', 'Research', 'Personal'];

const categoryColors: Record<ProjectCategory, { main: string; light: string }> = {
  AI: { main: '#8B5CF6', light: 'rgba(139, 92, 246, 0.1)' },
  Web: { main: '#38BDF8', light: 'rgba(56, 189, 248, 0.1)' },
  Mobile: { main: '#A78BFA', light: 'rgba(167, 139, 250, 0.1)' },
  ITSM: { main: '#EF4444', light: 'rgba(239, 68, 68, 0.1)' },
  Automation: { main: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)' },
  'Open Source': { main: '#10B981', light: 'rgba(16, 185, 129, 0.1)' },
  Enterprise: { main: '#22D3EE', light: 'rgba(34, 211, 238, 0.1)' },
  Freelance: { main: '#EC4899', light: 'rgba(236, 72, 153, 0.1)' },
  Research: { main: '#06B6D4', light: 'rgba(6, 182, 212, 0.1)' },
  Personal: { main: '#94A3B8', light: 'rgba(148, 163, 184, 0.1)' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
  },
};

export function ProjectsShowcaseEnhanced({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const stats = useMemo(
    () => ({
      total: projects.length,
      featured: projects.filter((p) => p.featured).length,
      pinned: projects.filter((p) => p.pinned).length,
    }),
    [projects]
  );

  return (
    <section id="projects" className="section-pad relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      <div className="container-tight relative z-10">
        <SectionHeader
          eyebrow="Projects"
          title={<>Featured <span className="gradient-text">work</span></>}
          description="A carefully curated selection of projects that showcase my ability to solve complex problems with elegant, scalable code."
        />

        {/* Project Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            { label: 'Total Projects', value: stats.total, icon: '📦' },
            { label: 'Featured', value: stats.featured, icon: '⭐' },
            { label: 'Pinned', value: stats.pinned, icon: '📌' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-text-secondary mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search and filter */}
        <motion.div
          className="mb-12 flex flex-col gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects by name, description, or technology..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full glass border-white/[0.1] focus:border-white/[0.2] outline-none transition-all focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-text-secondary"
            />
            <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
          </div>

          {/* Category filters with animation */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {CATEGORIES.map((cat, idx) => {
              const isActive = filter === cat;
              const color = cat === 'All' ? { main: '#38BDF8', light: 'rgba(56, 189, 248, 0.1)' } : categoryColors[cat as ProjectCategory];

              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
                    isActive
                      ? 'glass-strong border-white/[0.2] text-white'
                      : 'glass border-white/[0.08] text-text-secondary hover:text-white hover:border-white/[0.15]'
                  )}
                  style={{
                    ...(isActive && {
                      boxShadow: `0 0 20px ${color.light}, inset 0 0 20px ${color.light}`,
                      borderColor: `${color.main}40`,
                    }),
                  }}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="filter-badge"
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color.main }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key={`${filter}-${query}`}
            >
              {filtered.map((project, idx) => {
                const isHovered = hoveredId === project.id;
                const color = categoryColors[project.category];

                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group relative h-full"
                  >
                    {/* Card container */}
                    <div
                      className="glass-card p-6 h-full flex flex-col rounded-3xl overflow-hidden relative border-white/[0.1] transition-all duration-300"
                      style={{
                        borderColor: isHovered ? `${color.main}40` : 'rgba(255,255,255,0.1)',
                        boxShadow: isHovered ? `0 0 30px ${color.light}` : 'none',
                      }}
                    >
                      {/* Background glow */}
                      <motion.div
                        className="absolute inset-0 opacity-0 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${color.light}, transparent)`,
                          opacity: isHovered ? 0.4 : 0,
                        }}
                      />

                      {/* Pinned and Featured badges */}
                      <div className="relative z-10 flex items-start justify-between mb-4">
                        <div className="flex gap-2">
                          {project.featured && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="glass-strong px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-yellow-400"
                            >
                              <Star size={12} />
                              Featured
                            </motion.div>
                          )}
                          {project.pinned && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                              className="glass-strong px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-blue-400"
                            >
                              <Pin size={12} />
                              Pinned
                            </motion.div>
                          )}
                        </div>

                        {/* Category badge */}
                        <motion.div
                          className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: color.light,
                            color: color.main,
                          }}
                        >
                          {project.category}
                        </motion.div>
                      </div>

                      {/* Title and description */}
                      <div className="relative z-10 mb-6 flex-grow">
                        <h3 className="text-2xl font-bold text-white mb-2 leading-snug group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>

                      {/* Technologies */}
                      <motion.div
                        className="relative z-10 mb-6 flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0.7 }}
                      >
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2.5 py-1 rounded-full glass-strong border border-white/[0.1] text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-xs px-2.5 py-1 rounded-full glass-strong border border-white/[0.1] text-text-secondary">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </motion.div>

                      {/* Action buttons */}
                      <motion.div
                        className="relative z-10 flex items-center gap-3 pt-4 border-t border-white/[0.1]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/[0.08] transition-all text-sm font-medium text-white"
                          >
                            <ExternalLink size={14} />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/[0.08] transition-all text-sm font-medium text-white"
                          >
                            <Github size={14} />
                            Code
                          </a>
                        )}
                        <Link
                          href={`/projects/${project.slug}`}
                          className="px-4 py-2 rounded-lg transition-all text-sm font-medium"
                          style={{
                            background: isHovered ? color.light : 'transparent',
                            color: isHovered ? color.main : '#94A3B8',
                            border: `1px solid ${isHovered ? color.main : 'rgba(255,255,255,0.1)'}`,
                          }}
                        >
                          <ArrowUpRight size={14} />
                        </Link>
                      </motion.div>

                      {/* Hover border animation */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                          border: `2px solid ${color.main}`,
                          opacity: isHovered ? 0.5 : 0,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-text-secondary text-lg">No projects found matching your criteria.</p>
              <motion.button
                onClick={() => {
                  setFilter('All');
                  setQuery('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 rounded-full glass hover:bg-white/[0.08] transition-all text-white"
              >
                Reset filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}