import { NextRequest, NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/auth/guard';
import { store } from '@/lib/data/store';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const { id } = await params;
  await store.deleteProject(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const { id } = await params;
  const existing = await store.getProject(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
  const saved = await store.upsertProject(updated);
  return NextResponse.json({ project: saved });
}
