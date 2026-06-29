'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Skill } from '@/lib/types';
import { cn } from '@/lib/utils';

const categoryIcons: Record<Skill['category'], string> = {
  Frontend: '⚛️',
  Backend: '🟢',
  Mobile: '📱',
  AI: '🧠',
  Databases: '🗄️',
  Cloud: '☁️',
  DevOps: '🛠️',
  Networking: '🌐',
  ITSM: '🎫',
};

const categoryColors: Record<Skill['category'], { main: string; glow: string }> = {
  Frontend: { main: '#38BDF8', glow: 'rgba(56, 189, 248, 0.5)' },
  Backend: { main: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' },
  Mobile: { main: '#A78BFA', glow: 'rgba(167, 139, 250, 0.5)' },
  AI: { main: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.5)' },
  Databases: { main: '#22D3EE', glow: 'rgba(34, 211, 238, 0.5)' },
  Cloud: { main: '#06B6D4', glow: 'rgba(6, 182, 212, 0.5)' },
  DevOps: { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' },
  Networking: { main: '#EC4899', glow: 'rgba(236, 72, 153, 0.5)' },
  ITSM: { main: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' },
};

export function SkillsDashboardEnhanced({ skills }: { skills: Skill[] }) {
  const categories = useMemo(() => Array.from(new Set(skills.map((s) => s.category))), [skills]);
  const [active, setActive] = useState<Skill['category']>(categories[0] ?? 'Frontend');

  const visible = useMemo(
    () => skills.filter((s) => s.category === active).sort((a, b) => b.proficiency - a.proficiency),
    [skills, active]
  );

  const totalSkills = skills.length;
  const avgProficiency = Math.round(skills.reduce((s, x) => s + x.proficiency, 0) / Math.max(1, skills.length));
  const totalYears = Math.max(...skills.map((s) => s.years));
  const totalProjects = skills.reduce((s, x) => s + x.projects, 0);

  const statVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const stats = [
    { label: 'Skills tracked', value: totalSkills, color: '#38BDF8', icon: '📊' },
    { label: 'Avg proficiency', value: `${avgProficiency}%`, color: '#8B5CF6', icon: '⚡' },
    { label: 'Years coding', value: `${totalYears}+`, color: '#22D3EE', icon: '📅' },
    { label: 'Projects shipped', value: `${totalProjects}+`, color: '#10B981', icon: '🚀' },
  ];

  return (
    <section id="skills" className="section-pad relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      <div className="container-tight relative z-10">
        <SectionHeader
          eyebrow="Skills"
          title={<>Engineering command <span className="gradient-text">center</span></>}
          description="A live view of my stack — proficiency, years of use, and projects shipped. Click a category to dive in."
        />

        {/* Enhanced stat grid with cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              whileHover={{ y: -8, scale: 1.05 }}
              className="glass-card p-6 relative overflow-hidden group"
              style={{ borderColor: `${stat.color}20` }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at center, ${stat.color}, transparent)` }}
              />

              <div className="relative z-10">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xs uppercase tracking-wider text-text-secondary font-semibold">{stat.label}</div>
                <div className="text-3xl md:text-4xl font-bold mt-3 tracking-tight" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>

              {/* Animated border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"
                style={{
                  background: `linear-gradient(45deg, transparent 30%, ${stat.color}20, transparent 70%)`,
                  backgroundPosition: '200% 200%',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Category tabs with enhanced styling */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-white/[0.08]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {categories.map((c) => (
            <motion.button
              key={c}
              onClick={() => setActive(c)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2',
                active === c
                  ? 'glass-strong text-white border-white/[0.2]'
                  : 'text-text-secondary hover:text-text-primary glass border-white/[0.08] hover:border-white/[0.15]'
              )}
              style={{
                ...(active === c && {
                  boxShadow: `0 0 20px ${categoryColors[c].glow}`,
                  borderColor: `${categoryColors[c].main}40`,
                }),
              }}
            >
              <span>{categoryIcons[c]}</span>
              {c}
              {active === c && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: categoryColors[c].main }}
                  layoutId="active-tab"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced skill cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {visible.map((skill, idx) => {
              const color = categoryColors[skill.category];
              return (
                <motion.div
                  key={`${skill.category}-${skill.name}`}  // fixed: no id property, using unique composite key
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass-card p-6 group cursor-pointer relative overflow-hidden"
                  style={{ borderColor: `${color.main}30` }}
                >
                  {/* Enhanced glow background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at top right, ${color.main}, transparent)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header with icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">{skill.name}</h3>
                        <p className="text-xs text-text-secondary mt-1 uppercase tracking-wide">{skill.category}</p>
                      </div>
                      <motion.div
                        className="text-2xl"
                        whileHover={{ rotate: 20, scale: 1.2 }}
                      >
                        ⚙️
                      </motion.div>
                    </div>

                    {/* Proficiency with animated bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-secondary">Proficiency</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: color.main }}
                        >
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full glass-strong overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 + 0.3, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${color.main}, ${color.main}80)`,
                            boxShadow: `0 0 20px ${color.glow}`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="glass rounded-lg p-2.5">
                        <div className="text-text-secondary">Experience</div>
                        <div className="font-bold text-white mt-0.5">{skill.years}+ years</div>
                      </div>
                      <div className="glass rounded-lg p-2.5">
                        <div className="text-text-secondary">Projects</div>
                        <div className="font-bold text-white mt-0.5">{skill.projects}+</div>
                      </div>
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      border: `2px solid ${color.main}`,
                      boxShadow: `inset 0 0 20px ${color.glow}`,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}