import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureAdmin } from '@/lib/auth/guard';
import { store } from '@/lib/data/store';

const updateSchema = z.object({
  id: z.string(),
  status: z.enum(['unread', 'read', 'replied', 'archived', 'spam']),
});

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const messages = await store.listMessages();
  const counts = messages.reduce<Record<string, number>>((acc, m) => {
    acc[m.status] = (acc[m.status] ?? 0) + 1;
    return acc;
  }, {});
  return NextResponse.json({ messages, counts });
}

export async function PATCH(req: NextRequest) {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  await store.updateMessageStatus(parsed.data.id, parsed.data.status);
  return NextResponse.json({ ok: true });
}
