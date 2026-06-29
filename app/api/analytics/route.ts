import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { store, newId } from '@/lib/data/store';

const schema = z.object({
  type: z.enum(['visit', 'project_view', 'resume_download', 'contact_request', 'blog_view']),
  path: z.string().optional(),
  ref: z.string().optional(),
  ua: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });

    await store.trackEvent({
      id: newId('evt'),
      type: parsed.data.type,
      path: parsed.data.path,
      ref: parsed.data.ref,
      ua: parsed.data.ua,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
