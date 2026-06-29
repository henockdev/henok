import { NextRequest, NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/auth/guard';
import { store } from '@/lib/data/store';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const { id } = await params;
  await store.deleteExperience(id);
  return NextResponse.json({ ok: true });
}
