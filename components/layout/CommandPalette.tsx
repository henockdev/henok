'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  Briefcase,
  Code2,
  GraduationCap,
  FileText,
  Hash,
  Home,
  Mail,
  Layers,
  Cpu,
} from 'lucide-react';

/**
 * CommandPalette
 * ─────────────────────────────────────────────────────────────
 * ⌘K / Ctrl+K — searches everything: projects, blog posts,
 * experience entries, and quick navigation shortcuts. Result
 * selected with arrow keys + Enter.
 */

type ItemKind = 'project' | 'post' | 'experience' | 'nav' | 'quick';

export type IndexItem = {
  kind: ItemKind;
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string[];
  icon?: string; // lucide name override
};

interface Props {
  index: IndexItem[];
}

const ICONS: Record<ItemKind, any> = {
  project: Code2,
  post: FileText,
  experience: Briefcase,
  nav: Hash,
  quick: Sparkles,
};

function isMac() {
  if (typeof navigator === 'undefined') return false;
  return /mac/i.test(navigator.platform || navigator.userAgent || '');
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent-blue/30 text-white rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function CommandPalette({ index }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mac, setMac] = useState(false);

  useEffect(() => {
    setMac(isMac());
  }, []);

  // Keyboard shortcut to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setActive(0);
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) {
      // Default: show recent / quick nav
      return index.slice(0, 8);
    }
    const q = query.toLowerCase();
    return index
      .map((item) => {
        const haystack = [
          item.title,
          item.subtitle || '',
          item.kind,
          ...(item.keywords || []),
        ]
          .join(' ')
          .toLowerCase();
        // Simple fuzzy: every char of q appears in order
        let i = 0;
        for (const c of haystack) {
          if (c === q[i]) i++;
          if (i === q.length) break;
        }
        const matched = i === q.length;
        const score = matched ? haystack.indexOf(q) : -1;
        return { item, score: matched ? score : 9999 };
      })
      .filter((r) => r.score < 9999)
      .sort((a, b) => a.score - b.score)
      .slice(0, 10)
      .map((r) => r.item);
  }, [query, index]);

  useEffect(() => {
    setActive(0);
  }, [results.length]);

  function pick(idx: number) {
    const item = results[idx];
    if (!item) return;
    setOpen(false);
    // Smooth in-page scroll for hash links, router push for full pages
    if (item.href.includes('#') && item.href.startsWith('/#')) {
      const id = item.href.split('#')[1];
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      router.push(item.href);
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`) as HTMLElement | null;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <>
      {/* Trigger chip (small, bottom-right corner) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-30 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/[0.08] hover:bg-white/[0.05] transition text-xs text-text-secondary hover:text-white shadow-lg"
        aria-label="Open command palette"
      >
        <Search size={13} />
        <span>Search</span>
        <span className="flex items-center gap-0.5 ml-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">
            {mac ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono">
            K
          </kbd>
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl glass-strong rounded-2xl shadow-2xl border border-white/[0.1] overflow-hidden"
              style={{ boxShadow: '0 30px 80px -20px rgba(56,189,248,0.25)' }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <Search size={16} className="text-text-secondary shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setActive((a) => Math.min(results.length - 1, a + 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActive((a) => Math.max(0, a - 1));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      pick(active);
                    }
                  }}
                  placeholder="Search projects, posts, experience, anywhere…"
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-text-secondary"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:bg-white/[0.06] hover:text-white transition"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-text-secondary">
                    No results for &ldquo;{query}&rdquo;.
                  </div>
                ) : (
                  results.map((item, idx) => {
                    const Icon = ICONS[item.kind] || Hash;
                    const activeRow = idx === active;
                    return (
                      <button
                        key={`${item.kind}-${item.href}-${idx}`}
                        data-idx={idx}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => pick(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                          activeRow ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div
                          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                            activeRow ? 'bg-accent-blue/15 text-accent-blue' : 'bg-white/[0.04] text-text-secondary'
                          }`}
                        >
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {highlight(item.title, query)}
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-text-secondary truncate">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-text-secondary/70 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                            {item.kind}
                          </span>
                          {activeRow && (
                            <CornerDownLeft size={12} className="text-accent-blue" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-text-secondary/70">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">
                      <ArrowUp size={9} />
                    </kbd>
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">
                      <ArrowDown size={9} />
                    </kbd>
                    Navigate
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">
                      ↵
                    </kbd>
                    Open
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">
                      Esc
                    </kbd>
                    Close
                  </span>
                </div>
                <div>{results.length} {results.length === 1 ? 'result' : 'results'}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}