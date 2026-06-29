import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ask } from '@/lib/ai/assistant';

const schema = z.object({ question: z.string().min(2).max(500) });

// Simple rate limit on AI endpoint to keep costs bounded.
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX = 12;
function rateLimit(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX) return false;
  b.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    if (!rateLimit(ip)) return NextResponse.json({ error: 'Too many questions. Slow down.' }, { status: 429 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid question' }, { status: 400 });

    const result = await ask(parsed.data.question);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
