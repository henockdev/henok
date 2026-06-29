import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { store, newId } from '@/lib/data/store';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

// Very simple in-memory rate limiter keyed by IP. Good enough for a portfolio.
// For production swap with @upstash/ratelimit + Redis.
const ipBuckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = ipBuckets.get(ip);
  if (!b || b.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX_PER_WINDOW) return false;
  b.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Please fill out every field correctly.' }, { status: 400 });

    const msg = {
      id: newId('msg'),
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      status: 'unread' as const,
      createdAt: new Date().toISOString(),
    };
    await store.createMessage(msg);

    // Optional email notification via Resend if configured.
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Portfolio <noreply@henok.dev>',
            to: [process.env.CONTACT_TO || 'henok@example.com'],
            subject: `[Portfolio] ${msg.subject}`,
            text: `From: ${msg.name} <${msg.email}>\n\n${msg.message}`,
          }),
        });
      } catch {
        // Don't fail the user-facing request if email fails.
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
