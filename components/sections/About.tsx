'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GraduationCap, Briefcase, Code2, Brain, Building2, Sparkles } from 'lucide-react';

const milestones = [
  {
    icon: GraduationCap,
    year: '2020',
    title: 'Adama Science and Technology University',
    description: 'B.Sc. Electronics and Communication Engineering. Where the engineering mindset started.',
    color: '#38BDF8',
  },
  {
    icon: Building2,
    year: '2020 — 2021',
    title: 'Graduate Trainee · Telecom',
    description: 'Rotational program across network ops, BSS, and software. Found my lane: software.',
    color: '#22D3EE',
  },
  {
    icon: Briefcase,
    year: '2021 — 2022',
    title: 'Customer Service Officer · Banking',
    description: 'Owned tier-2 escalations on digital banking products. The on-the-ground view of what users need.',
    color: '#A78BFA',
  },
  {
    icon: Code2,
    year: '2022 →',
    title: 'Software Developer · Indie + Contract',
    description: 'Shipping web, mobile, and AI products end-to-end. Side projects became real products.',
    color: '#10B981',
  },
  {
    icon: Brain,
    year: '2023 →',
    title: 'ITSM Officer · Banking',
    description: 'Owning incident, change, and problem management at an enterprise scale. Bridging engineering and operations.',
    color: '#8B5CF6',
  },
  {
    icon: Sparkles,
    year: 'Now',
    title: 'Building what comes next',
    description: 'AI-powered systems that ship, scale, and survive contact with reality. Always learning, always shipping.',
    color: '#38BDF8',
  },
];

export function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="About"
          title={<>An engineer who ships <span className="gradient-text">software that moves metrics</span></>}
          description="From ITSM in a bank to ML models in production to mobile apps with offline sync — I work where reliability, speed, and craft all have to be true at the same time."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-6 md:p-7 hover:bg-white/[0.06] transition group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${m.color}20`, color: m.color }}
                >
                  <m.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-text-secondary mb-1">{m.year}</div>
                  <div className="text-lg font-semibold mb-2 text-balance">{m.title}</div>
                  <p className="text-text-secondary text-sm leading-relaxed">{m.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
