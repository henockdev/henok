'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Experience } from '@/lib/types';
import { formatDateRange } from '@/lib/utils';
import { Briefcase, MapPin, CheckCircle2, Trophy } from 'lucide-react';

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Experience"
          title={<>A career built on <span className="gradient-text">shipping real things</span></>}
          description="From graduate trainee to ITSM officer to independent software developer. Each role added a layer: technical depth, business context, and the discipline to ship."
        />

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-blue via-accent-purple to-accent-cyan opacity-40 md:-translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
              >
                {/* Marker */}
                <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: 'var(--gradient-primary)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)' }} />

                <div className={`pl-12 md:pl-0 ${i % 2 === 1 ? 'md:pr-12' : 'md:pl-12'} md:[direction:ltr]`}>
                  <div className="glass-card p-6 md:p-7 hover:bg-white/[0.06] transition">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{exp.position}</h3>
                      <span className="text-accent-blue">@ {exp.company}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4">
                      <span className="inline-flex items-center gap-1"><Briefcase size={13} />{formatDateRange(exp.startDate, exp.endDate)}</span>
                      {exp.location && <span className="inline-flex items-center gap-1"><MapPin size={13} />{exp.location}</span>}
                      {exp.current && <span className="inline-flex items-center gap-1 text-success"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />Current</span>}
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-5">{exp.description}</p>

                    <div className="mb-4">
                      <div className="text-xs uppercase tracking-wider text-text-secondary mb-2">Responsibilities</div>
                      <ul className="space-y-1.5">
                        {exp.responsibilities.slice(0, 4).map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-text-secondary">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-accent-blue" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1">
                          <Trophy size={11} /> Achievements
                        </div>
                        <ul className="space-y-1.5">
                          {exp.achievements.slice(0, 3).map((a) => (
                            <li key={a} className="flex items-start gap-2 text-sm">
                              <span className="text-accent-purple font-mono mt-0.5">→</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                        {exp.technologies.slice(0, 8).map((t) => (
                          <span key={t} className="px-2.5 py-1 text-xs rounded-md bg-white/[0.04] border border-white/[0.06] text-text-secondary">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
