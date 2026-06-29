'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project, ProjectCategory, ProjectStatus } from '@/lib/types';
import { Plus, Edit2, Trash2, X, Star, Pin, Save, Upload, Loader2, ExternalLink, Github } from 'lucide-react';

const CATEGORIES: ProjectCategory[] = ['AI', 'Web', 'Mobile', 'ITSM', 'Automation', 'Open Source', 'Enterprise', 'Freelance', 'Research', 'Personal'];
const STATUSES: ProjectStatus[] = ['draft', 'scheduled', 'published', 'archived', 'featured', 'pinned'];

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    const data = await res.json();
    setProjects(data.projects ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">{projects.length} project{projects.length === 1 ? '' : 's'} · click "New Project" to add one in under 2 minutes.</p>
        </div>
        <button
          onClick={() => setEditing(blankProject())}
          className="btn-primary text-sm"
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-sm">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-10 text-center text-text-secondary">
          No projects yet. Create your first one — it appears on the site immediately.
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} onEdit={() => setEditing(p)} onDelete={() => remove(p.id)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <ProjectEditor
            project={editing}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectRow({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="glass-card p-4 md:p-5 flex items-center gap-4 hover:bg-white/[0.06] transition">
      <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(139,92,246,0.2))' }}>
        <span className="text-xs font-mono text-text-secondary">{project.title.slice(0, 2).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold truncate">{project.title}</span>
          {project.pinned && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-warning/20 text-warning"><Pin size={9} />Pinned</span>}
          {project.featured && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-accent-blue/20 text-accent-blue"><Star size={9} />Featured</span>}
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-text-secondary uppercase">{project.status}</span>
        </div>
        <div className="text-xs text-text-secondary truncate">{project.shortDescription}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" title="GitHub"><Github size={14} /></a>}
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" title="Live"><ExternalLink size={14} /></a>}
        <button onClick={onEdit} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" title="Edit"><Edit2 size={14} /></button>
        <button onClick={onDelete} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-danger/20 hover:text-danger transition" title="Delete"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

function blankProject(): Project {
  const now = new Date().toISOString();
  return {
    id: '',
    slug: '',
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Web',
    startDate: now.slice(0, 10),
    status: 'draft',
    technologies: [],
    media: [],
    featured: false,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

function ProjectEditor({ project, onClose, onSaved }: { project: Project; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Project>(project);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTech() {
    const t = techInput.trim();
    if (!t) return;
    if (form.technologies.includes(t)) return;
    update('technologies', [...form.technologies, t]);
    setTechInput('');
  }

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/projects', {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-4xl glass-strong rounded-2xl my-8 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/[0.06] glass-strong rounded-t-2xl">
          <div>
            <h2 className="font-semibold text-lg">{form.id ? 'Edit project' : 'New project'}</h2>
            <p className="text-xs text-text-secondary">Changes appear on the public site instantly after save.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {err && <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">{err}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title *">
              <input value={form.title} onChange={(e) => update('title', e.target.value)} className="admin-input" placeholder="SmartDesk AI" />
            </Field>
            <Field label="Slug">
              <input value={form.slug} onChange={(e) => update('slug', e.target.value)} className="admin-input" placeholder="auto-generated from title" />
            </Field>
          </div>

          <Field label="Short description *">
            <input value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="admin-input" placeholder="One-sentence pitch" />
          </Field>

          <Field label="Full description * (markdown supported)">
            <textarea rows={6} value={form.fullDescription} onChange={(e) => update('fullDescription', e.target.value)} className="admin-input font-mono text-sm" placeholder="Full case-study description…" />
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Category *">
              <select value={form.category} onChange={(e) => update('category', e.target.value as ProjectCategory)} className="admin-input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status *">
              <select value={form.status} onChange={(e) => update('status', e.target.value as ProjectStatus)} className="admin-input">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Start date *">
              <input type="date" value={form.startDate?.slice(0, 10)} onChange={(e) => update('startDate', e.target.value)} className="admin-input" />
            </Field>
            <Field label="End date">
              <input type="date" value={form.endDate?.slice(0, 10) ?? ''} onChange={(e) => update('endDate', e.target.value || undefined)} className="admin-input" />
            </Field>
          </div>

          <Field label="Client">
            <input value={form.client ?? ''} onChange={(e) => update('client', e.target.value || undefined)} className="admin-input" />
          </Field>

          <Field label="Technologies">
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                className="admin-input flex-1"
                placeholder="Type and press Enter"
              />
              <button type="button" onClick={addTech} className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition text-sm">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.technologies.map((t) => (
                <span key={t} className="px-2 py-1 text-xs rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center gap-1">
                  {t}
                  <button type="button" onClick={() => update('technologies', form.technologies.filter((x) => x !== t))} className="text-text-secondary hover:text-danger">×</button>
                </span>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="GitHub URL">
              <input value={form.githubUrl ?? ''} onChange={(e) => update('githubUrl', e.target.value || undefined)} className="admin-input" placeholder="https://github.com/…" />
            </Field>
            <Field label="Live URL">
              <input value={form.liveUrl ?? ''} onChange={(e) => update('liveUrl', e.target.value || undefined)} className="admin-input" placeholder="https://…" />
            </Field>
            <Field label="Case study URL">
              <input value={form.caseStudyUrl ?? ''} onChange={(e) => update('caseStudyUrl', e.target.value || undefined)} className="admin-input" />
            </Field>
          </div>

          <Field label="Architecture">
            <textarea rows={2} value={form.architecture ?? ''} onChange={(e) => update('architecture', e.target.value || undefined)} className="admin-input" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Challenges">
              <textarea rows={3} value={form.challenges ?? ''} onChange={(e) => update('challenges', e.target.value || undefined)} className="admin-input" />
            </Field>
            <Field label="Business impact">
              <textarea rows={3} value={form.businessImpact ?? ''} onChange={(e) => update('businessImpact', e.target.value || undefined)} className="admin-input" />
            </Field>
          </div>

          <Field label="Lessons learned">
            <textarea rows={3} value={form.lessonsLearned ?? ''} onChange={(e) => update('lessonsLearned', e.target.value || undefined)} className="admin-input" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Thumbnail URL">
              <MediaField value={form.thumbnail} onChange={(url) => update('thumbnail', url)} />
            </Field>
            <Field label="Banner URL">
              <MediaField value={form.banner} onChange={(url) => update('banner', url)} />
            </Field>
          </div>

          <Field label="Metrics (label → value)">
            <MetricsEditor metrics={form.metrics ?? []} onChange={(m) => update('metrics', m)} />
          </Field>

          <Field label="Timeline (date → label)">
            <TimelineEditor timeline={form.timeline ?? []} onChange={(t) => update('timeline', t)} />
          </Field>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-accent-blue w-4 h-4" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.pinned} onChange={(e) => update('pinned', e.target.checked)} className="accent-accent-blue w-4 h-4" />
              Pinned to top
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 p-5 border-t border-white/[0.06] flex items-center justify-end gap-3 glass-strong rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition text-sm">Cancel</button>
          <button onClick={save} disabled={saving || !form.title} className="btn-primary text-sm">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save & Publish
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
        .admin-input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }
      `}</style>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">{label}</span>
      {children}
    </label>
  );
}

function MediaField({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const [uploading, setUploading] = useState(false);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="flex gap-2">
      <input value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)} className="admin-input flex-1" placeholder="/uploads/…" style={{ width: '100%' }} />
      <label className="shrink-0 px-3 py-2 rounded-lg glass hover:bg-white/10 transition text-sm cursor-pointer flex items-center gap-1">
        {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
        Upload
        <input type="file" className="hidden" accept="image/*,video/*,application/pdf" onChange={upload} />
      </label>
    </div>
  );
}

function MetricsEditor({ metrics, onChange }: { metrics: { label: string; value: string }[]; onChange: (m: { label: string; value: string }[]) => void }) {
  return (
    <div className="space-y-2">
      {metrics.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input value={m.label} onChange={(e) => onChange(metrics.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="admin-input flex-1" placeholder="Label (e.g. DAU increase)" />
          <input value={m.value} onChange={(e) => onChange(metrics.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="admin-input flex-1" placeholder="Value (e.g. +64%)" />
          <button type="button" onClick={() => onChange(metrics.filter((_, j) => j !== i))} className="px-3 rounded-lg glass hover:bg-danger/20 hover:text-danger transition text-sm">×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...metrics, { label: '', value: '' }])} className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition text-xs">+ Add metric</button>
    </div>
  );
}

function TimelineEditor({ timeline, onChange }: { timeline: { label: string; date: string }[]; onChange: (t: { label: string; date: string }[]) => void }) {
  return (
    <div className="space-y-2">
      {timeline.map((t, i) => (
        <div key={i} className="flex gap-2">
          <input value={t.date} onChange={(e) => onChange(timeline.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} className="admin-input flex-1" placeholder="2024-08" />
          <input value={t.label} onChange={(e) => onChange(timeline.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="admin-input flex-1" placeholder="Production launch" />
          <button type="button" onClick={() => onChange(timeline.filter((_, j) => j !== i))} className="px-3 rounded-lg glass hover:bg-danger/20 hover:text-danger transition text-sm">×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...timeline, { label: '', date: '' }])} className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition text-xs">+ Add milestone</button>
    </div>
  );
}
