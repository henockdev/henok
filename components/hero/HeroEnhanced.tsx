'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, Download, Briefcase, Sparkles, Zap, Github, Linkedin, Twitter } from 'lucide-react';
import { TypingAnimation } from './TypingAnimation';
import { GlowingOrbs } from './GlowingOrbs';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { Project } from '@/lib/types';

// Three.js + WebGL is heavy (~200KB JS, GPU compositing). Skip it
// entirely for users who prefer reduced motion; the rest of the hero
// still renders, just without the 3D carousel.
const ProjectCarousel3D = dynamic(
  () => import('@/components/three/ProjectCarousel3D').then((m) => m.ProjectCarousel3D),
  { ssr: false, loading: () => null },
);

const roles = ['Software Engineer', 'AI Developer', 'Mobile Developer', 'ITSM Professional'];

const socialLinks = [
  { icon: Github, href: 'https://github.com/henockdev', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/henokamdiye/', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/henokamdiye', label: 'Twitter' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const CATEGORY_ACCENT: Record<string, string> = {
  AI: '#A78BFA',
  Web: '#38BDF8',
  Mobile: '#C084FC',
  ITSM: '#F87171',
  Automation: '#FBBF24',
  'Open Source': '#34D399',
  Enterprise: '#C4674A',
  Freelance: '#F472B6',
  Research: '#22D3EE',
  Personal: '#94A3B8',
};

export function HeroEnhanced({ projects = [] }: { projects?: Project[] }) {
  const reducedMotion = useReducedMotion();
  const carouselProjects = projects.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    thumb: p.thumbnail || '/projects/neural/00-cover.jpg',
    accent: CATEGORY_ACCENT[p.category] || '#38BDF8',
  }));
  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* 3D carousel — decorative; skip on reduced motion, expose a
          sr-only list of featured projects so screen readers get the
          same information. */}
      {carouselProjects.length > 0 && !reducedMotion && (
        <ProjectCarousel3D projects={carouselProjects} />
      )}
      {carouselProjects.length > 0 && (
        <ul className="sr-only">
          {carouselProjects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`}>{p.title}</Link> — {p.category}
            </li>
          ))}
        </ul>
      )}
      <GlowingOrbs />

      {/* Enhanced vignette with gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,22,0.4)_50%,rgba(5,8,22,0.95)_100%)] pointer-events-none" />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(45deg, rgba(56, 189, 248, 0.05) 0%, transparent 50%, rgba(139, 92, 246, 0.05) 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: 21.4, top: 38.4 },
          { left: 97.5, top: 98.4 },
          { left: 52.5, top: 1.5 },
          { left: 34.9, top: 72.4 },
          { left: 27.6, top: 11.9 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-500/40"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -100 - i * 50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container-tight px-6 md:px-12 pt-32 pb-20 text-center">
        <motion.div
          className="flex flex-col items-center gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge with enhanced animation */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-strong border border-white/[0.2] backdrop-blur-xl"
          >
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-green-400"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(74, 222, 128, 0.7)',
                  '0 0 0 8px rgba(74, 222, 128, 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-sm font-medium text-white">Available for hire</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={14} className="text-blue-400" />
            </motion.div>
          </motion.div>

          {/* Main heading with gradient text */}
          <motion.div variants={itemVariants} className="max-w-4xl">
            <h1 id="hero-heading" className="heading-1 text-balance">
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Henok Amdiye
              </motion.span>
              <motion.span
                className="block gradient-text pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Endeshaw
              </motion.span>
            </h1>
          </motion.div>

          {/* Typing animation with enhanced styling */}
          <motion.div
            variants={itemVariants}
            className="mt-6 relative"
          >
            <div className="text-xl md:text-2xl lg:text-3xl text-text-secondary font-light">
              <span className="inline-flex items-center gap-2">
                <Zap size={20} className="text-blue-400" />
                <TypingAnimation words={roles} />
              </span>
            </div>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-text-secondary text-base md:text-lg leading-relaxed text-balance"
          >
            Building AI-powered, mobile-first, enterprise-grade systems from{' '}
            <span className="font-semibold text-white">Addis Ababa, Ethiopia</span>. I ship software that moves business
            metrics — not just code that compiles.
          </motion.p>

          {/* CTA Buttons with enhanced effects */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#projects" className="btn-primary group">
                <Briefcase size={18} />
                View Projects
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowDown size={16} />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#contact" className="btn-ghost">
                Get in Touch
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="/resume.pdf" className="btn-ghost" download>
                <Download size={18} />
                Resume
              </a>
            </motion.div>
          </motion.div>

          {/* Social links row */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 pt-4"
          >
            {socialLinks.map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full glass hover:bg-white/[0.08] transition-all text-text-secondary hover:text-white"
                title={link.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + idx * 0.1 }}
              >
                <link.icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator with enhanced animation */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <span className="text-xs uppercase tracking-widest text-text-secondary/60 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <div className="w-6 h-10 rounded-full border-2 border-text-secondary/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 rounded-full bg-text-secondary/60"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
