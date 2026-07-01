import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { store } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  Calendar,
  Tag,
  BookOpen,
  Star,
  Pin,
  Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemDiagram, NeuralDiagram, OliveDiagram } from '@/components/projects/SystemDiagram';

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

const categoryThemes: Record<
  string,
  { main: string; light: string; gradient: string; soft: string }
> = {
  AI: { main: '#A78BFA', light: 'rgba(167,139,250,0.18)', gradient: 'linear-gradient(135deg,#A78BFA 0%,#8B5CF6 100%)', soft: 'rgba(167,139,250,0.10)' },
  Web: { main: '#60A5FA', light: 'rgba(56,189,248,0.18)', gradient: 'linear-gradient(135deg,#60A5FA 0%,#22D3EE 100%)', soft: 'rgba(56,189,248,0.10)' },
  Mobile: { main: '#C084FC', light: 'rgba(192,132,252,0.18)', gradient: 'linear-gradient(135deg,#C084FC 0%,#8B5CF6 100%)', soft: 'rgba(192,132,252,0.10)' },
  ITSM: { main: '#F87171', light: 'rgba(239,68,68,0.18)', gradient: 'linear-gradient(135deg,#F87171 0%,#EF4444 100%)', soft: 'rgba(239,68,68,0.10)' },
  Automation: { main: '#FBBF24', light: 'rgba(245,158,11,0.18)', gradient: 'linear-gradient(135deg,#FBBF24 0%,#F59E0B 100%)', soft: 'rgba(245,158,11,0.10)' },
  'Open Source': { main: '#34D399', light: 'rgba(16,185,129,0.18)', gradient: 'linear-gradient(135deg,#34D399 0%,#10B981 100%)', soft: 'rgba(16,185,129,0.10)' },
  Enterprise: { main: '#C9A876', light: 'rgba(196,103,74,0.22)', gradient: 'linear-gradient(135deg,#C9A876 0%,#B5462C 100%)', soft: 'rgba(196,103,74,0.10)' },
  Freelance: { main: '#F472B6', light: 'rgba(236,72,153,0.18)', gradient: 'linear-gradient(135deg,#F472B6 0%,#EC4899 100%)', soft: 'rgba(236,72,153,0.10)' },
  Research: { main: '#22D3EE', light: 'rgba(34,211,238,0.18)', gradient: 'linear-gradient(135deg,#22D3EE 0%,#06B6D4 100%)', soft: 'rgba(34,211,238,0.10)' },
  Personal: { main: '#94A3B8', light: 'rgba(148,163,184,0.18)', gradient: 'linear-gradient(135deg,#94A3B8 0%,#64748B 100%)', soft: 'rgba(148,163,184,0.10)' },
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await store.getProjectBySlug(slug);
  if (!project || !['published', 'featured', 'pinned'].includes(project.status)) notFound();

  const theme = categoryThemes[project.category] ?? categoryThemes.Web;
  const banner = project.banner || project.thumbnail;
  const heroMedia = project.media?.[0];
  const galleryMedia = (project.media ?? []).slice(1).filter((m) => m.type === 'image');

  // Find next pinned/featured project to suggest at the bottom
  const all = await store.listProjects();
  const visible = all.filter((p) => ['published', 'featured', 'pinned'].includes(p.status));
  const ordered = [...visible].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const idx = ordered.findIndex((p) => p.slug === project.slug);
  const nextProject = idx >= 0 ? ordered[(idx + 1) % ordered.length] : undefined;

  return (
    <div className="relative pt-28 pb-24">
      {/* Back link */}
      <div className="container-tight px-6 md:px-12">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to projects
        </Link>
      </div>

      {/* Hero image */}
      {banner && (
        <div className="container-tight px-6 md:px-12 mb-12">
          <div
            className="relative aspect-[16/9] rounded-3xl overflow-hidden glass-card border"
            style={{ borderColor: `${theme.main}40` }}
          >
            <Image
              src={banner}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              unoptimized={banner.endsWith('.svg')}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent 40%, rgba(5,8,22,0.5) 100%), radial-gradient(circle at 20% 80%, ${theme.light}, transparent 60%)`,
              }}
            />
            {project.pinned && (
              <div
                className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold backdrop-blur"
                style={{ background: theme.gradient, color: '#0B1120' }}
              >
                <Pin size={11} fill="#0B1120" /> Pinned
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container-tight px-6 md:px-12">
        <div className="max-w-4xl">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span
              className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-semibold"
              style={{ background: theme.gradient, color: '#0B1120' }}
            >
              {project.category}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full glass border border-white/10 text-yellow-300">
                <Star size={10} fill="currentColor" /> Featured
              </span>
            )}
            {project.client && (
              <span className="text-xs text-text-secondary">· {project.client}</span>
            )}
            <span className="text-xs text-text-secondary inline-flex items-center gap-1.5">
              <Calendar size={11} />
              {formatDate(project.startDate, { year: 'numeric', month: 'short' })}
              {project.endDate ? ` – ${formatDate(project.endDate, { year: 'numeric', month: 'short' })}` : ' – Present'}
            </span>
          </div>

          {/* Title */}
          <h1 className="heading-1 mb-6 text-balance">
            {project.title.split(' — ').map((part, i, arr) => (
              <span key={i} className={cn(i === arr.length - 1 && arr.length > 1 ? 'block gradient-text' : 'block text-white')}>
                {part}
              </span>
            ))}
          </h1>

          <p className="text-xl text-text-secondary mb-8 leading-relaxed text-balance">
            {project.shortDescription}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-16">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 hover:bg-white/[0.08] transition-all text-white text-sm"
              >
                <Github size={14} /> View code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-bg transition-all"
                style={{ background: theme.gradient, boxShadow: `0 8px 28px ${theme.soft}` }}
              >
                <ExternalLink size={14} /> Live demo
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 hover:bg-white/[0.08] transition-all text-white text-sm"
              >
                <BookOpen size={14} /> Case study
              </a>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-16">
              {project.metrics.map((m: { label: string; value: string }) => (
                <div
                  key={m.label}
                  className="relative glass-card rounded-2xl p-5 text-center overflow-hidden"
                >
                  <div
                    className="absolute -inset-px rounded-2xl opacity-30 pointer-events-none"
                    style={{ background: theme.gradient, filter: 'blur(20px)' }}
                  />
                  <div className="relative">
                    <div className="text-2xl md:text-3xl font-bold tabular-nums mb-1" style={{ color: theme.main }}>
                      {m.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-text-secondary">
                      {m.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          <section className="mb-16">
            <h2 className="heading-3 mb-5 text-white">Overview</h2>
            <div className="text-text-secondary leading-relaxed whitespace-pre-line text-lg">
              {project.fullDescription}
            </div>
          </section>

          {/* Gallery */}
          {galleryMedia.length > 0 && (
            <section className="mb-16">
              <h2 className="heading-3 mb-6 text-white">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryMedia.map((m) => (
                  <div
                    key={m.id}
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card border border-white/[0.06]"
                  >
                    <Image
                      src={m.url}
                      alt={m.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover hover:scale-[1.03] transition-transform duration-500"
                      unoptimized={m.url.endsWith('.svg')}
                    />
                    {m.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-bg/90 to-transparent text-xs text-text-secondary">
                        {m.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Animated system diagram (where applicable) */}
          {(project.slug === 'neural-ai-content-studio' || project.slug === 'olive-atlas') && (
            <section className="mb-16">
              <h2 className="heading-3 mb-2 text-white flex items-center gap-2">
                <Network size={20} style={{ color: theme.main }} /> System architecture
              </h2>
              <p className="text-text-secondary mb-6 max-w-2xl">
                How the pieces fit together — drawn on scroll.
              </p>
              {project.slug === 'neural-ai-content-studio' ? <NeuralDiagram /> : <OliveDiagram />}
            </section>
          )}

          {/* Architecture + challenges grid */}
          {(project.architecture || project.challenges || project.lessonsLearned || project.businessImpact) && (
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.architecture && (
                  <div className="glass-card rounded-2xl p-6 md:col-span-2">
                    <h3 className="font-semibold mb-3 text-white text-base">Architecture</h3>
                    <p className="text-text-secondary leading-relaxed text-sm">{project.architecture}</p>
                  </div>
                )}
                {project.challenges && (
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-semibold mb-3 text-sm" style={{ color: theme.main }}>
                      Challenges
                    </h3>
                    <p className="text-text-secondary leading-relaxed text-sm">{project.challenges}</p>
                  </div>
                )}
                {project.lessonsLearned && (
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-semibold mb-3 text-accent-purple text-sm">Lessons learned</h3>
                    <p className="text-text-secondary leading-relaxed text-sm">{project.lessonsLearned}</p>
                  </div>
                )}
                {project.businessImpact && (
                  <div className="glass-card rounded-2xl p-6 md:col-span-2">
                    <h3 className="font-semibold mb-3 text-success text-sm">Business impact</h3>
                    <p className="text-text-secondary leading-relaxed text-sm">{project.businessImpact}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Stack */}
          {project.technologies.length > 0 && (
            <section className="mb-16">
              <h2 className="heading-3 mb-5 text-white">Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t: string) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 text-sm rounded-full glass border border-white/[0.06] inline-flex items-center gap-1.5"
                  >
                    <Tag size={11} className="text-text-secondary" />
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Timeline */}
          {project.timeline && project.timeline.length > 0 && (
            <section className="mb-16">
              <h2 className="heading-3 mb-6 text-white">Timeline</h2>
              <div className="relative space-y-3">
                <div
                  className="absolute left-[7px] top-3 bottom-3 w-px"
                  style={{ background: `linear-gradient(180deg, ${theme.main}80, transparent)` }}
                />
                {project.timeline.map((t: { label: string; date: string }, i: number) => (
                  <div
                    key={i}
                    className="relative flex items-center gap-4 glass-card rounded-xl p-4"
                  >
                    <div
                      className="shrink-0 w-4 h-4 rounded-full ring-4"
                      style={{
                        background: theme.gradient,
                        // ring color matches bg
                        boxShadow: `0 0 0 4px rgba(5,8,22,1), 0 0 12px ${theme.light}`,
                      }}
                    />
                    <div className="text-xs text-text-secondary font-mono w-20 shrink-0">{t.date}</div>
                    <div className="text-sm text-text-primary">{t.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Next project */}
        {nextProject && nextProject.slug !== project.slug && (
          <div className="mt-20 max-w-4xl">
            <div className="text-xs uppercase tracking-[0.2em] text-text-secondary mb-4">Next project</div>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group block relative overflow-hidden rounded-3xl glass-card hover:bg-white/[0.05] transition-all border border-white/[0.06]"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                {nextProject.thumbnail && (
                  <Image
                    src={nextProject.thumbnail}
                    alt={nextProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={nextProject.thumbnail.endsWith('.svg')}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                  <span
                    className="inline-block text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-semibold mb-3 w-fit"
                    style={{
                      background: categoryThemes[nextProject.category]?.gradient ?? '#3B82F6',
                      color: '#0B1120',
                    }}
                  >
                    {nextProject.category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold text-white text-balance">
                    {nextProject.title}
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base mt-2 max-w-2xl line-clamp-2">
                    {nextProject.shortDescription}
                  </p>
                  <div className="inline-flex items-center gap-2 mt-4 text-sm text-accent-blue">
                    View project <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
