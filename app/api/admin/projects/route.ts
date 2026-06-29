import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { store, newId, slugify } from '@/lib/data/store';
import { ensureAdmin } from '@/lib/auth/guard';

const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  category: z.enum(['AI', 'Web', 'Mobile', 'ITSM', 'Automation', 'Open Source', 'Enterprise', 'Freelance', 'Research', 'Personal']),
  client: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  status: z.enum(['draft', 'scheduled', 'published', 'archived', 'featured', 'pinned']),
  technologies: z.array(z.string()).default([]),
  architecture: z.string().optional().nullable(),
  lessonsLearned: z.string().optional().nullable(),
  challenges: z.string().optional().nullable(),
  businessImpact: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  caseStudyUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  pinned: z.boolean().default(false),
  thumbnail: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  media: z.array(z.object({
    id: z.string(),
    type: z.enum(['image', 'video', 'pdf', 'diagram']),
    url: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })).default([]),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  timeline: z.array(z.object({ label: z.string(), date: z.string() })).default([]),
  publishedAt: z.string().optional().nullable(),
});

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const projects = await store.listProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const guard = await ensureAdmin();
  if (guard) return guard;

  try {
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid project data', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const id = data.id ?? newId('proj');
    const slug = data.slug?.trim() || slugify(data.title);

    const now = new Date().toISOString();
    const project = {
      id,
      slug,
      title: data.title,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      category: data.category,
      client: data.client ?? undefined,
      startDate: data.startDate,
      endDate: data.endDate ?? undefined,
      status: data.status,
      technologies: data.technologies,
      architecture: data.architecture ?? undefined,
      lessonsLearned: data.lessonsLearned ?? undefined,
      challenges: data.challenges ?? undefined,
      businessImpact: data.businessImpact ?? undefined,
      githubUrl: data.githubUrl ?? undefined,
      liveUrl: data.liveUrl ?? undefined,
      caseStudyUrl: data.caseStudyUrl ?? undefined,
      featured: data.featured,
      pinned: data.pinned,
      thumbnail: data.thumbnail ?? undefined,
      banner: data.banner ?? undefined,
      media: data.media,
      metrics: data.metrics,
      timeline: data.timeline,
      publishedAt: data.publishedAt ?? (data.status === 'published' ? now : undefined),
      createdAt: body.createdAt ?? now,
      updatedAt: now,
    };
    const saved = await store.upsertProject(project);
    return NextResponse.json({ project: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', message: err instanceof Error ? err.message : 'unknown' }, { status: 500 });
  }
}
