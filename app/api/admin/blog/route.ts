import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { store, newId, slugify } from '@/lib/data/store';
import { ensureAdmin } from '@/lib/auth/guard';

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  category: z.string().default('Engineering'),
  readingTime: z.number().int().min(1).default(5),
  published: z.boolean().default(false),
  scheduledFor: z.string().optional().nullable(),
});

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const posts = await store.listPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid post data' }, { status: 400 });

    const data = parsed.data;
    const now = new Date().toISOString();
    const post = {
      id: data.id ?? newId('post'),
      slug: data.slug?.trim() || slugify(data.title),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage ?? undefined,
      tags: data.tags,
      category: data.category,
      readingTime: data.readingTime,
      published: data.published,
      publishedAt: data.published ? (body.publishedAt ?? now) : undefined,
      scheduledFor: data.scheduledFor ?? undefined,
      createdAt: body.createdAt ?? now,
      updatedAt: now,
    };
    const saved = await store.upsertPost(post);
    return NextResponse.json({ post: saved });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
