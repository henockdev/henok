import { store } from '@/lib/data/store';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const [posts, settings] = await Promise.all([store.listPosts(true), store.getSettings()]);
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://henok.dev';

  const items = posts
    .map((p: import('@/lib/types').BlogPost) => {
      const url = `${base}/blog/${p.slug}`;
      const pub = p.publishedAt ?? p.createdAt;
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(pub).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      <author>noreply@henok.dev (${escapeXml(settings.profile.name)})</author>
      ${p.tags.map((t: string) => `<category>${escapeXml(t)}</category>`).join('')}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(settings.profile.name)} — Blog</title>
    <link>${base}/blog</link>
    <description>${escapeXml(settings.seo.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
