import { notFound } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, BookOpen } from 'lucide-react';

export async function generateStaticParams() {
  const projects = await store.listProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await store.getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: { title: project.title, description: project.shortDescription, images: project.banner ? [project.banner] : [] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await store.getProjectBySlug(slug);
  if (!project || !['published', 'featured', 'pinned'].includes(project.status)) notFound();
  const safeProject: import('@/lib/types').Project = project;

  const categoryColor = categoryColors[safeProject.category];

  return (
    <div className="pt-32 pb-20">
      <div className="container-tight px-6 md:px-12">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition mb-8">
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${categoryColor}30`, color: categoryColor }}>{safeProject.category}</span>
            {safeProject.featured && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-accent-blue/20 text-accent-blue">Featured</span>}
            {safeProject.pinned && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-warning/20 text-warning">Pinned</span>}
          </div>
          <h1 className="heading-1 mb-4 text-balance">{safeProject.title}</h1>
          <p className="text-xl text-text-secondary mb-6 leading-relaxed">{safeProject.shortDescription}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-8">
            <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {formatDate(safeProject.startDate, { year: 'numeric', month: 'short' })}{safeProject.endDate ? ` – ${formatDate(safeProject.endDate, { year: 'numeric', month: 'short' })}` : ' – Present'}</span>
            {safeProject.client && <span>· {safeProject.client}</span>}
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            {safeProject.githubUrl && <a href={safeProject.githubUrl} target="_blank" rel="noopener" className="btn-ghost"><Github size={14} /> View code</a>}
            {safeProject.liveUrl && <a href={safeProject.liveUrl} target="_blank" rel="noopener" className="btn-primary"><ExternalLink size={14} /> Live demo</a>}
            {safeProject.caseStudyUrl && <a href={safeProject.caseStudyUrl} target="_blank" rel="noopener" className="btn-ghost"><BookOpen size={14} /> Case study</a>}
          </div>

          {safeProject.metrics && safeProject.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-12">
              {safeProject.metrics.map((m: { label: string; value: string }) => (
                <div key={m.label} className="glass-card p-5 text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: categoryColor }}>{m.value}</div>
                  <div className="text-xs uppercase tracking-wider text-text-secondary">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none mb-12">
            <h2 className="heading-3 mb-4">Overview</h2>
            <div className="text-text-secondary leading-relaxed whitespace-pre-line">{safeProject.fullDescription}</div>
          </div>

          {safeProject.architecture && (
            <section className="mb-12">
              <h2 className="heading-3 mb-4">Architecture</h2>
              <p className="text-text-secondary leading-relaxed">{safeProject.architecture}</p>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {safeProject.challenges && (
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-3 text-accent-blue">Challenges</h3>
                <p className="text-text-secondary leading-relaxed">{safeProject.challenges}</p>
              </div>
            )}
            {safeProject.lessonsLearned && (
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-3 text-accent-purple">Lessons learned</h3>
                <p className="text-text-secondary leading-relaxed">{safeProject.lessonsLearned}</p>
              </div>
            )}
            {safeProject.businessImpact && (
              <div className="glass-card p-6 md:col-span-2">
                <h3 className="font-semibold mb-3 text-success">Business impact</h3>
                <p className="text-text-secondary leading-relaxed">{safeProject.businessImpact}</p>
              </div>
            )}
          </div>

          {safeProject.technologies.length > 0 && (
            <section className="mb-12">
              <h2 className="heading-3 mb-4">Stack</h2>
              <div className="flex flex-wrap gap-2">
                {safeProject.technologies.map((t: string) => (
                  <span key={t} className="px-3 py-1.5 text-sm rounded-full glass inline-flex items-center gap-1.5"><Tag size={11} /> {t}</span>
                ))}
              </div>
            </section>
          )}

          {safeProject.timeline && safeProject.timeline.length > 0 && (
            <section className="mb-12">
              <h2 className="heading-3 mb-6">Timeline</h2>
              <div className="space-y-3">
                {safeProject.timeline.map((t: { label: string; date: string }, i: number) => (
                  <div key={i} className="flex items-center gap-4 glass-card p-4">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: categoryColor }} />
                    <div className="text-xs text-text-secondary font-mono w-20 shrink-0">{t.date}</div>
                    <div className="text-sm">{t.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

const categoryColors: Record<string, string> = {
  AI: '#8B5CF6',
  Web: '#38BDF8',
  Mobile: '#A78BFA',
  ITSM: '#EF4444',
  Automation: '#F59E0B',
  'Open Source': '#10B981',
  Enterprise: '#22D3EE',
  Freelance: '#EC4899',
  Research: '#06B6D4',
  Personal: '#94A3B8',
};
