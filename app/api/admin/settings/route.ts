import { NextRequest, NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/auth/guard';
import { store } from '@/lib/data/store';

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) return guard;
  return NextResponse.json({ settings: await store.getSettings() });
}

export async function PATCH(req: NextRequest) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  try {
    const body = await req.json();
    const current = await store.getSettings();
    const updated = { ...current, ...body };
    const saved = await store.updateSettings(updated);
    return NextResponse.json({ settings: saved });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
