import Link from 'next/link';
import { store } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import { Clock, Tag, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Engineering notes, post-mortems, and opinions from Henok.',
};

export default async function BlogIndex() {
  const posts = await store.listPosts(true);

  const tags = Array.from(new Set(posts.flatMap((p: import('@/lib/types').BlogPost) => p.tags))).sort();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="pt-32 pb-20">
      <div className="container-tight px-6 md:px-12">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-4">Writing</div>
          <h1 className="heading-1 mb-4">Notes from <span className="gradient-text">the workbench</span></h1>
          <p className="text-text-secondary text-lg">Engineering notes, post-mortems, and the occasional opinion.</p>
        </div>

        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block glass-card p-8 md:p-10 mb-12 hover:bg-white/[0.06] transition"
          >
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
              <span className="px-2 py-0.5 rounded bg-accent-blue/20 text-accent-blue uppercase tracking-wider">Featured</span>
              <span>·</span>
              <span>{formatDate(featured.publishedAt ?? featured.createdAt)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Clock size={11} /> {featured.readingTime} min read</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 group-hover:gradient-text transition-all text-balance">{featured.title}</h2>
            <p className="text-text-secondary text-lg leading-relaxed">{featured.excerpt}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {featured.tags.map((t: string) => <span key={t} className="px-2 py-0.5 text-xs rounded bg-white/[0.04] text-text-secondary">{t}</span>)}
            </div>
          </Link>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((t: string) => (
              <span key={t} className="px-3 py-1 text-xs rounded-full glass inline-flex items-center gap-1">
                <Tag size={11} /> {t}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group glass-card p-6 hover:bg-white/[0.06] transition flex flex-col"
            >
              <div className="text-xs text-text-secondary mb-3 flex items-center gap-2">
                <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock size={11} /> {post.readingTime} min</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:gradient-text transition-all line-clamp-2">{post.title}</h3>
              <p className="text-sm text-text-secondary line-clamp-3 flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((t: string) => <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-white/[0.04] text-text-secondary">{t}</span>)}
                </div>
                <ArrowUpRight size={14} className="text-text-secondary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 text-text-secondary">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
