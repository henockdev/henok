'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { GitHubSummary } from '@/lib/data/github';
import { Star, GitFork, ExternalLink, Github, Code2 } from 'lucide-react';

const langColors: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  Go: '#00ADD8',
  Java: '#B07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  Rust: '#DEA584',
  Ruby: '#701516',
  Shell: '#89E051',
};

export function GithubStats({ data }: { data: GitHubSummary }) {
  const topLangs = data.languages.slice(0, 6);
  const total = topLangs.reduce((s, l) => s + l.count, 0);

  return (
    <section id="github" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Open Source"
          title={<>Code on <span className="gradient-text">GitHub</span></>}
          description="Tools, experiments, and the occasional useful utility. Live data from the GitHub API."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Stat label="Public repos" value={data.totalRepos} accent="#38BDF8" />
          <Stat label="Stars earned" value={data.totalStars} accent="#F59E0B" icon={Star} />
          <Stat label="Languages" value={data.languages.length} accent="#8B5CF6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Star size={13} className="text-warning fill-warning" />
              Pinned repositories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.pinned.map((r, i) => (
                <motion.a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="glass-card p-5 hover:bg-white/[0.06] transition group block"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Github size={14} className="shrink-0 text-text-secondary" />
                      <span className="font-medium truncate">{r.name}</span>
                    </div>
                    <ExternalLink size={12} className="shrink-0 text-text-secondary group-hover:text-text-primary transition" />
                  </div>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2 min-h-[2.5rem]">{r.description ?? 'No description.'}</p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    {r.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: langColors[r.language] ?? '#94A3B8' }} />
                        {r.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1"><Star size={11} />{r.stars}</span>
                    <span className="inline-flex items-center gap-1"><GitFork size={11} />{r.forks}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2 mb-4">
              <Code2 size={13} />
              Languages
            </h3>
            <div className="glass-card p-5 space-y-3">
              {topLangs.map((l) => {
                const pct = total ? Math.round((l.count / total) * 100) : 0;
                return (
                  <div key={l.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: langColors[l.name] ?? '#94A3B8' }} />
                        {l.name}
                      </span>
                      <span className="text-text-secondary font-mono text-xs">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: langColors[l.name] ?? '#94A3B8' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent, icon: Icon }: { label: string; value: number; accent: string; icon?: typeof Star }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary mb-2">
        {Icon && <Icon size={13} />}
        {label}
      </div>
      <div className="text-3xl font-bold" style={{ color: accent }}>{value}</div>
    </motion.div>
  );
}
