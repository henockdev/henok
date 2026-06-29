import { NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/auth/guard';
import { store } from '@/lib/data/store';

export async function GET() {
  const guard = await ensureAdmin();
  if (guard) return guard;
  const events = await store.listAnalytics();

  const now = Date.now();
  const last7d = events.filter((e) => now - +new Date(e.createdAt) < 7 * 24 * 3600 * 1000);
  const last30d = events.filter((e) => now - +new Date(e.createdAt) < 30 * 24 * 3600 * 1000);

  const visits = events.filter((e) => e.type === 'visit').length;
  const projectViews = events.filter((e) => e.type === 'project_view').length;
  const blogViews = events.filter((e) => e.type === 'blog_view').length;
  const resumeDownloads = events.filter((e) => e.type === 'resume_download').length;
  const contactRequests = events.filter((e) => e.type === 'contact_request').length;

  // Daily series last 14 days
  const days: { date: string; visits: number; projectViews: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 3600 * 1000);
    const dayKey = d.toISOString().slice(0, 10);
    const day = events.filter((e) => e.createdAt.startsWith(dayKey));
    days.push({
      date: dayKey,
      visits: day.filter((e) => e.type === 'visit').length,
      projectViews: day.filter((e) => e.type === 'project_view').length,
    });
  }

  // Top pages
  const pathCounts = new Map<string, number>();
  events.forEach((e) => {
    if (!e.path) return;
    pathCounts.set(e.path, (pathCounts.get(e.path) ?? 0) + 1);
  });
  const topPages = [...pathCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, count]) => ({ path, count }));

  // Referrers
  const refCounts = new Map<string, number>();
  events.forEach((e) => {
    if (!e.ref) return;
    try {
      const host = new URL(e.ref).hostname || 'direct';
      refCounts.set(host, (refCounts.get(host) ?? 0) + 1);
    } catch {
      refCounts.set('direct', (refCounts.get('direct') ?? 0) + 1);
    }
  });
  const topReferrers = [...refCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([host, count]) => ({ host, count }));

  return NextResponse.json({
    totals: {
      visits,
      projectViews,
      blogViews,
      resumeDownloads,
      contactRequests,
      last7d: last7d.length,
      last30d: last30d.length,
    },
    series: days,
    topPages,
    topReferrers,
  });
}
