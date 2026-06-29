import Link from 'next/link';
import { notFound } from 'next/navigation';
import { store } from '@/lib/data/store';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export async function generateStaticParams() {
  const posts = await store.listPosts(true);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await store.getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.publishedAt, tags: post.tags },
  };
}

function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^\* (.*)$/gm, '<li>$1</li>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await store.getPostBySlug(slug);
  if (!post || !post.published) notFound();
  const safePost: import('@/lib/types').BlogPost = post;

  const allPosts = await store.listPosts(true);
  const related = allPosts.filter((p) => p.id !== safePost.id && p.tags.some((t: string) => safePost.tags.includes(t))).slice(0, 3);

  return (
    <article className="pt-32 pb-20">
      <div className="container-tight px-6 md:px-12 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition mb-8">
          <ArrowLeft size={14} /> Back to all posts
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
            <span className="inline-flex items-center gap-1"><Calendar size={12} /> {safePost.publishedAt ? formatDate(safePost.publishedAt, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock size={12} /> {safePost.readingTime} min read</span>
            <span>·</span>
            <span>{safePost.category}</span>
          </div>
          <h1 className="heading-1 mb-4 text-balance">{safePost.title}</h1>
          <p className="text-xl text-text-secondary leading-relaxed">{safePost.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {safePost.tags.map((t: string) => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-full glass">#{t}</span>
            ))}
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none
            prose-headings:tracking-tight prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-text-secondary prose-p:leading-relaxed prose-p:my-5
            prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text-primary prose-strong:font-semibold
            prose-code:text-accent-cyan prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-xl prose-pre:p-4
            prose-ul:my-5 prose-li:text-text-secondary prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(safePost.content) }}
        />

        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/[0.06]">
            <h3 className="text-sm uppercase tracking-wider text-text-secondary mb-6">Related posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r: import('@/lib/types').BlogPost) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="glass-card p-5 hover:bg-white/[0.06] transition group block">
                  <h4 className="font-medium mb-2 group-hover:gradient-text transition-all line-clamp-2">{r.title}</h4>
                  <p className="text-xs text-text-secondary line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
