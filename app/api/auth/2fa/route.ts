import { NextRequest, NextResponse } from 'next/server';
import { completeTwoFactor, logout } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.code !== 'string') return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    const ok = await completeTwoFactor(body.code);
    if (!ok) return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ ok: true });
}
