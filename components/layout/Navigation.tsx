'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
  { href: '/#achievements', label: 'Achievements' },
  { href: '/#contact', label: 'Contact' },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled ? 'py-3' : 'py-5',
        )}
      >
        <div className="container-tight px-4 md:px-8">
          <div
            className={cn(
              'flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-500',
              scrolled ? 'glass-strong shadow-2xl shadow-black/20' : 'bg-transparent',
            )}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-sm">H</span>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold tracking-tight">Henok</div>
                <div className="text-[10px] text-text-secondary -mt-0.5">Software Engineer</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link
                href="/#contact"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Sparkles size={14} />
                Hire Me
              </Link>
              <button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                className="lg:hidden w-9 h-9 rounded-lg glass flex items-center justify-center"
              >
                {open ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 pt-24 px-4"
          >
            <div className="glass-strong rounded-2xl p-4 shadow-2xl">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    className="block px-4 py-3 rounded-xl text-text-primary hover:bg-white/5 transition"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
