'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Experience } from '@/lib/types';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/experience');
    const data = await res.json();
    setItems(data.experiences ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Experience</h1>
          <p className="text-text-secondary text-sm mt-1">Roles, responsibilities, and achievements.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="btn-primary text-sm"><Plus size={14} /> New Experience</button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-sm">Loading…</div>
      ) : (
        <div className="space-y-2">
          {items.map((e) => (
            <div key={e.id} className="glass-card p-4 flex items-center gap-4 hover:bg-white/[0.06] transition">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{e.position} <span className="text-text-secondary">@ {e.company}</span></div>
                <div className="text-xs text-text-secondary truncate">{e.startDate} – {e.endDate ?? 'present'} · {e.location ?? '—'}</div>
              </div>
              <button onClick={() => setEditing(e)} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition"><Edit2 size={14} /></button>
              <button onClick={() => remove(e.id)} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-danger/20 hover:text-danger transition"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && <ExpEditor item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
}

function blank(): Experience {
  return {
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: undefined,
    current: false,
    description: '',
    responsibilities: [],
    achievements: [],
    technologies: [],
    createdAt: new Date().toISOString(),
  };
}

function ExpEditor({ item, onClose, onSaved }: { item: Experience; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Experience>(item);
  const [respInput, setRespInput] = useState('');
  const [achInput, setAchInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  function update<K extends keyof Experience>(key: K, value: Experience[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTo<K extends 'responsibilities' | 'achievements' | 'technologies'>(key: K, input: string, setInput: (v: string) => void) {
    const v = input.trim();
    if (!v) return;
    if ((form[key] as string[]).includes(v)) return;
    update(key, [...(form[key] as string[]), v] as Experience[K]);
    setInput('');
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Save failed');
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-3xl glass-strong rounded-2xl my-8 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/[0.06] glass-strong rounded-t-2xl">
          <h2 className="font-semibold text-lg">{form.id ? 'Edit experience' : 'New experience'}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-lg glass flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.position} onChange={(e) => update('position', e.target.value)} className="admin-input" placeholder="Position *" />
            <input value={form.company} onChange={(e) => update('company', e.target.value)} className="admin-input" placeholder="Company *" />
            <input value={form.location ?? ''} onChange={(e) => update('location', e.target.value || undefined)} className="admin-input" placeholder="Location" />
            <label className="flex items-center gap-2 text-sm cursor-pointer self-end">
              <input type="checkbox" checked={form.current ?? false} onChange={(e) => update('current', e.target.checked)} className="accent-accent-blue w-4 h-4" />
              Currently working here
            </label>
            <input type="date" value={form.startDate?.slice(0, 10)} onChange={(e) => update('startDate', e.target.value)} className="admin-input" />
            <input type="date" value={form.endDate?.slice(0, 10) ?? ''} onChange={(e) => update('endDate', e.target.value || undefined)} className="admin-input" placeholder="End date" />
          </div>
          <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} className="admin-input" placeholder="Description *" />
          <TagListInput label="Responsibilities" values={form.responsibilities} input={respInput} setInput={setRespInput} onAdd={() => addTo('responsibilities', respInput, setRespInput)} onRemove={(v) => update('responsibilities', form.responsibilities.filter((x) => x !== v))} />
          <TagListInput label="Achievements" values={form.achievements} input={achInput} setInput={setAchInput} onAdd={() => addTo('achievements', achInput, setAchInput)} onRemove={(v) => update('achievements', form.achievements.filter((x) => x !== v))} />
          <TagListInput label="Technologies" values={form.technologies} input={techInput} setInput={setTechInput} onAdd={() => addTo('technologies', techInput, setTechInput)} onRemove={(v) => update('technologies', form.technologies.filter((x) => x !== v))} />
        </div>
        <div className="sticky bottom-0 p-5 border-t border-white/[0.06] flex items-center justify-end gap-3 glass-strong rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition text-sm">Cancel</button>
          <button onClick={save} disabled={saving || !form.position || !form.company} className="btn-primary text-sm">
            <Save size={14} /> Save
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        .admin-input { width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: white; font-size: 0.875rem; transition: all 0.2s; }
        .admin-input:focus { outline: none; border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15); }
      `}</style>
    </motion.div>
  );
}

function TagListInput({ label, values, input, setInput, onAdd, onRemove }: { label: string; values: string[]; input: string; setInput: (v: string) => void; onAdd: () => void; onRemove: (v: string) => void }) {
  return (
    <div>
      <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">{label}</span>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }} className="admin-input flex-1" placeholder="Type and press Enter" />
        <button type="button" onClick={onAdd} className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition text-sm">Add</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span key={v} className="px-2 py-1 text-xs rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center gap-1">
            {v}
            <button type="button" onClick={() => onRemove(v)} className="text-text-secondary hover:text-danger">×</button>
          </span>
        ))}
      </div>
      <style jsx>{`.admin-input { width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: white; font-size: 0.875rem; }`}</style>
    </div>
  );
}
