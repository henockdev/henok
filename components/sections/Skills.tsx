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

const categoryColors: Record<Skill['category'], string> = {
  Frontend: '#38BDF8',
  Backend: '#10B981',
  Mobile: '#A78BFA',
  AI: '#8B5CF6',
  Databases: '#22D3EE',
  Cloud: '#06B6D4',
  DevOps: '#F59E0B',
  Networking: '#EC4899',
  ITSM: '#EF4444',
};

export function SkillsDashboard({ skills }: { skills: Skill[] }) {
  const categories = useMemo(() => Array.from(new Set(skills.map((s) => s.category))), [skills]);
  const [active, setActive] = useState<Skill['category']>(categories[0] ?? 'Frontend');

  const visible = useMemo(() => skills.filter((s) => s.category === active).sort((a, b) => b.proficiency - a.proficiency), [skills, active]);
  const totalSkills = skills.length;
  const avgProficiency = Math.round(skills.reduce((s, x) => s + x.proficiency, 0) / Math.max(1, skills.length));
  const totalYears = Math.max(...skills.map((s) => s.years));
  const totalProjects = skills.reduce((s, x) => s + x.projects, 0);

  return (
    <section id="skills" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Skills"
          title={<>Engineering command <span className="gradient-text">center</span></>}
          description="A live view of my stack — proficiency, years of use, and projects shipped. Click a category to dive in."
        />

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Skills tracked', value: totalSkills, color: '#38BDF8' },
            { label: 'Avg proficiency', value: `${avgProficiency}%`, color: '#8B5CF6' },
            { label: 'Years coding', value: `${totalYears}+`, color: '#22D3EE' },
            { label: 'Projects shipped', value: `${totalProjects}+`, color: '#10B981' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass-card p-5"
            >
              <div className="text-xs uppercase tracking-wider text-text-secondary">{stat.label}</div>
              <div className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                'px-4 py-2 rounded-full text-sm transition-all',
                active === c
                  ? 'bg-white text-bg font-medium shadow-lg shadow-white/10'
                  : 'glass hover:bg-white/[0.08]',
              )}
              style={active === c ? { background: categoryColors[c], color: '#050816' } : {}}
            >
              <span className="mr-2">{categoryIcons[c]}</span>
              {c}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {visible.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass-card p-5 group hover:bg-white/[0.06] transition"
              >
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{skill.name}</span>
                  </div>
                  <div className="text-xs text-text-secondary">{skill.years}y · {skill.projects} proj</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: categoryColors[skill.category] }}
                    />
                  </div>
                  <div className="text-sm font-mono w-10 text-right" style={{ color: categoryColors[skill.category] }}>
                    {skill.proficiency}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
