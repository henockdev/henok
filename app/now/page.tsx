import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import {
  Rocket,
  BookOpen,
  Library,
  Briefcase,
  Github,
  Sparkles,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Now — Henok Amdiye',
  description:
    'What Henok is shipping, learning, reading, and open to right now. A live status page.',
  openGraph: {
    title: 'Now — Henok Amdiye',
    description: 'What Henok is shipping, learning, reading, and open to right now.',
  },
};

export const revalidate = 3600; // refresh hourly

const ICON_MAP: Record<string, any> = {
  rocket: Rocket,
  book: BookOpen,
  library: Library,
  briefcase: Briefcase,
  github: Github,
};

async function getNow() {
  try {
    const p = path.join(process.cwd(), 'data', 'runtime', 'now.json');
    const raw = await readFile(p, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function NowPage() {
  const now = await getNow();

  return (
    <div className="relative pt-32 pb-24 min-h-screen overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent 70%)' }}
        />
      </div>

      <div className="container-tight px-6 md:px-12 relative z-10">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/[0.12] mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
            </span>
            <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Now — live status
            </span>
          </div>
          <h1 className="heading-1 mb-6 text-balance">
            <span className="text-white">What I&apos;m doing</span>
            <span className="block gradient-text">right now</span>
          </h1>
          {now?.intro && (
            <p className="text-lg text-text-secondary leading-relaxed text-balance">{now.intro}</p>
          )}
          {now?.lastUpdated && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-text-secondary/80">
              <Calendar size={12} />
              Last updated {formatDate(now.lastUpdated)}
            </div>
          )}
        </header>

        {/* Sections */}
        {now?.sections?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
            {now.sections.map((section: any) => {
              const Icon = ICON_MAP[section.icon] || Sparkles;
              const accent = section.accent || '#38BDF8';
              return (
                <article
                  key={section.title}
                  className="relative glass-card rounded-3xl p-6 md:p-7 border border-white/[0.08] overflow-hidden group"
                >
                  <div
                    className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ background: accent }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${accent}25`,
                          color: accent,
                          border: `1px solid ${accent}40`,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <h2 className="text-xl font-bold text-white">{section.title}</h2>
                    </div>
                    <ul className="space-y-2.5">
                      {section.items.map((item: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm md:text-base text-text-secondary leading-relaxed"
                        >
                          <span
                            className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full"
                            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-10 max-w-3xl text-text-secondary">
            <p>Status content unavailable.</p>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 max-w-3xl">
          <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 border border-white/[0.08]">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Inspired by Derek Sivers</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs">/now</code> page is
                a live status update — what you&apos;re focused on, not what you&apos;ve done. I update
                this roughly weekly so visitors (and recruiters) see a real human, not a frozen resume.
              </p>
            </div>
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/[0.12] hover:bg-white/[0.05] text-sm text-text-secondary hover:text-white transition w-fit shrink-0"
            >
              About /now pages <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}