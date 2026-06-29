import type { MetadataRoute } from 'next';
import { store } from '@/lib/data/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://henok.dev';
  const [projects, posts] = await Promise.all([store.listProjects(), store.listPosts(true)]);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const projectUrls = projects
    .filter((p) => ['published', 'featured', 'pinned'].includes(p.status))
    .map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: 'monthly' as const, priority: 0.7 }));

  const postUrls = posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: 'monthly' as const, priority: 0.6 }));

  return [...staticUrls, ...projectUrls, ...postUrls];
}
