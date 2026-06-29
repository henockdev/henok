import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { store, newId } from '@/lib/data/store';
import { ensureAdmin } from '@/lib/auth/guard';

const schema = z.object({
  id: z.string().optional(),
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  logo: z.string().optional().nullable(),
});

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) return guard;
  return NextResponse.json({ experiences: await store.listExperience() });
}

export async function POST(req: NextRequest) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const data = parsed.data;
    const exp = {
      id: data.id ?? newId('exp'),
      company: data.company,
      position: data.position,
      location: data.location ?? undefined,
      startDate: data.startDate,
      endDate: data.endDate ?? undefined,
      current: data.current,
      description: data.description,
      responsibilities: data.responsibilities,
      achievements: data.achievements,
      technologies: data.technologies,
      logo: data.logo ?? undefined,
      createdAt: body.createdAt ?? new Date().toISOString(),
    };
    const saved = await store.upsertExperience(exp);
    return NextResponse.json({ experience: saved });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
