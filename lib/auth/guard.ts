import { NextResponse } from 'next/server';
import { requireAdmin } from './session';

export async function ensureAdmin(): Promise<NextResponse | null> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}
