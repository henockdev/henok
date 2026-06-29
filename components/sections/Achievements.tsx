'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Achievement, Certification, Testimonial } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Trophy, Award, Megaphone, Star, BookOpen, Flag, Quote, Star as StarIcon, ShieldCheck, ExternalLink } from 'lucide-react';

const typeIcons: Record<Achievement['category'], typeof Trophy> = {
  Award: Trophy,
  Recognition: Star,
  Publication: BookOpen,
  Speaking: Megaphone,
  Milestone: Flag,
};

export function Achievements({ items, certs, testimonials }: { items: Achievement[]; certs: Certification[]; testimonials: Testimonial[] }) {
  return (
    <section id="achievements" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Achievements"
          title={<>Recognition, certifications, and <span className="gradient-text">what people say</span></>}
          description="Independent confirmation that the work is moving in the right direction."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Trophy size={18} className="text-accent-blue" />
              Milestones
            </h3>
            <div className="space-y-4">
              {items.map((a, i) => {
                const Icon = typeIcons[a.category];
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="glass-card p-5 flex items-start gap-4 hover:bg-white/[0.06] transition"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-accent-blue/15 text-accent-blue flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-text-secondary mb-0.5">{formatDate(a.date, { year: 'numeric', month: 'long' })} · {a.category}</div>
                      <div className="font-medium mb-1">{a.title}</div>
                      <p className="text-sm text-text-secondary">{a.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent-purple" />
              Certifications
            </h3>
            <div className="space-y-4">
              {certs.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="glass-card p-5 hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold mb-1">{c.name}</div>
                      <div className="text-sm text-text-secondary mb-2">{c.issuer}</div>
                      <div className="text-xs text-text-secondary">
                        Issued {formatDate(c.issueDate, { year: 'numeric', month: 'short' })}
                        {c.credentialId && ` · ID: ${c.credentialId}`}
                      </div>
                    </div>
                    {c.verificationUrl && (
                      <a href={c.verificationUrl} target="_blank" rel="noopener" className="shrink-0 w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" aria-label="Verify">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Quote size={18} className="text-accent-cyan" />
          Testimonials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-6 hover:bg-white/[0.06] transition relative"
            >
              <Quote size={28} className="text-accent-blue/30 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <StarIcon key={k} size={14} className="text-warning fill-warning" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-text-primary mb-4">"{t.review}"</blockquote>
              <figcaption className="text-xs text-text-secondary border-t border-white/[0.06] pt-3">
                <div className="font-medium text-text-primary">{t.name}</div>
                <div>{t.position} · {t.company}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
