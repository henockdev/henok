'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, Download, Briefcase, Sparkles } from 'lucide-react';
import { TypingAnimation } from './TypingAnimation';
import { GlowingOrbs } from './GlowingOrbs';

const HeroScene = dynamic(() => import('@/components/three/HeroScene').then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

const roles = ['Software Engineer', 'AI Developer', 'Mobile Developer', 'ITSM Professional'];

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <HeroScene />
      <GlowingOrbs />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,22,0.6)_60%,rgba(5,8,22,0.95)_100%)] pointer-events-none" />

      <div className="relative z-10 container-tight px-6 md:px-12 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Available for hire
          <Sparkles size={12} className="text-accent-blue" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-1 text-balance"
        >
          <span className="block text-white">Henok Amdiye</span>
          <span className="block gradient-text pb-2">Endeshaw</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-xl md:text-2xl lg:text-3xl text-text-secondary font-light"
        >
          <TypingAnimation words={roles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-2xl mx-auto text-text-secondary text-base md:text-lg leading-relaxed text-balance"
        >
          Building AI-powered, mobile-first, enterprise-grade systems from Addis Ababa, Ethiopia. I ship software that moves business metrics — not just code that compiles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="#projects" className="btn-primary group">
            <Briefcase size={16} />
            View Projects
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </Link>
          <Link href="#contact" className="btn-ghost">
            Hire Me
          </Link>
          <a href="/resume.pdf" className="btn-ghost" download>
            <Download size={16} />
            Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center gap-2 text-text-secondary text-xs uppercase tracking-widest"
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-text-secondary to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
