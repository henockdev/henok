'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { ArrowUpRight, Clock, Tag } from 'lucide-react';

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section id="blog" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Writing"
          title={<>Notes from <span className="gradient-text">the workbench</span></>}
          description="Engineering notes, post-mortems, and the occasional opinion. Subscribe via RSS."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block glass-card overflow-hidden h-full hover:bg-white/[0.06] transition"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(139,92,246,0.2))' }} />
                  <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-xs">
                    {post.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} />{post.readingTime} min</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:gradient-text transition-all line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded bg-white/[0.04] text-text-secondary">
                          <Tag size={9} /> {t}
                        </span>
                      ))}
                    </div>
                    <ArrowUpRight size={14} className="text-text-secondary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog" className="btn-ghost">All posts <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}
