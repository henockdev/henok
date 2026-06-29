import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, ...admin });
}
