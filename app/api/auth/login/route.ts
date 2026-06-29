import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { login } from '@/lib/auth/session';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const result = await login(parsed.data.email, parsed.data.password);
    if (!result) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (result.pendingTwoFactor) {
      return NextResponse.json({ ok: true, pendingTwoFactor: true });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
