'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogPost } from '@/lib/types';
import { Plus, Edit2, Trash2, X, Save, Eye, Calendar } from 'lucide-react';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/blog');
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-text-secondary text-sm mt-1">{posts.length} post{posts.length === 1 ? '' : 's'} · write in markdown.</p>
        </div>
        <button onClick={() => setEditing(blankPost())} className="btn-primary text-sm"><Plus size={14} /> New Post</button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-sm">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="glass-card p-10 text-center text-text-secondary">No posts yet. Write your first one.</div>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-4 hover:bg-white/[0.06] transition">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold truncate">{p.title}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${p.published ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                  {p.scheduledFor && <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent-blue/20 text-accent-blue inline-flex items-center gap-1"><Calendar size={9} />Scheduled</span>}
                </div>
                <div className="text-xs text-text-secondary truncate">{p.excerpt}</div>
                <div className="text-[11px] text-text-secondary mt-1">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Not published'} · {p.readingTime} min · {p.tags.join(', ') || 'no tags'}
                </div>
              </div>
              <a href={`/blog/${p.slug}`} target="_blank" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" title="View">
                <Eye size={14} />
              </a>
              <button onClick={() => setEditing(p)} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" title="Edit">
                <Edit2 size={14} />
              </button>
              <button onClick={() => remove(p.id)} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-danger/20 hover:text-danger transition" title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && <PostEditor post={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
}

function blankPost(): BlogPost {
  const now = new Date().toISOString();
  return {
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    category: 'Engineering',
    readingTime: 5,
    published: false,
    createdAt: now,
    updatedAt: now,
  };
}

function PostEditor({ post, onClose, onSaved }: { post: BlogPost; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<BlogPost>(post);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function update<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function addTag() {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) return;
    update('tags', [...form.tags, t]);
    setTagInput('');
  }

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-5xl glass-strong rounded-2xl my-8 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/[0.06] glass-strong rounded-t-2xl">
          <h2 className="font-semibold text-lg">{form.id ? 'Edit post' : 'New post'}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition text-xs flex items-center gap-1">
              <Eye size={13} /> {showPreview ? 'Editor' : 'Preview'}
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {err && <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">{err}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => update('title', e.target.value)} className="admin-input md:col-span-2 text-lg" placeholder="Post title" />
            <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className="admin-input" placeholder="auto-generated" />
            <input value={form.category} onChange={(e) => update('category', e.target.value)} className="admin-input" placeholder="Category" />
          </div>
          <textarea value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={2} className="admin-input" placeholder="One-paragraph excerpt" />

          <div className="flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="admin-input flex-1" placeholder="Add tag and press Enter" />
            <button type="button" onClick={addTag} className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition text-sm">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.tags.map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center gap-1">
                {t}
                <button onClick={() => update('tags', form.tags.filter((x) => x !== t))} className="text-text-secondary hover:text-danger">×</button>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Reading time (min)</span>
              <input type="number" min={1} value={form.readingTime} onChange={(e) => update('readingTime', Number(e.target.value) || 1)} className="admin-input" />
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer pt-7">
              <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="accent-accent-blue w-4 h-4" />
              Published
            </label>
            <label className="block">
              <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Schedule for</span>
              <input type="datetime-local" value={form.scheduledFor?.slice(0, 16) ?? ''} onChange={(e) => update('scheduledFor', e.target.value || undefined)} className="admin-input" />
            </label>
          </div>

          {showPreview ? (
            <div className="admin-input min-h-[400px] prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: simpleMarkdown(form.content) }} />
          ) : (
            <textarea value={form.content} onChange={(e) => update('content', e.target.value)} rows={20} className="admin-input font-mono text-sm" placeholder="# Title&#10;&#10;Write in markdown…" />
          )}
        </div>

        <div className="sticky bottom-0 p-5 border-t border-white/[0.06] flex items-center justify-end gap-3 glass-strong rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition text-sm">Cancel</button>
          <button onClick={save} disabled={saving || !form.title} className="btn-primary text-sm">
            {saving ? 'Saving…' : <><Save size={14} /> Save</>}
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .admin-input:focus {
          outline: none;
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }
      `}</style>
    </motion.div>
  );
}

// Tiny server-free markdown renderer for the preview pane.
// For richer rendering on the public site we use the same helpers on the server.
function simpleMarkdown(md: string): string {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
