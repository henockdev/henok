'use client';

import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import { Save, Loader2 } from 'lucide-react';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then((d) => setSettings(d.settings));
  }, []);

  if (!settings) return <div className="text-text-secondary text-sm">Loading…</div>;

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => s ? { ...s, [key]: value } : s);
  }
  function updateProfile<K extends keyof SiteSettings['profile']>(key: K, value: SiteSettings['profile'][K]) {
    setSettings((s) => s ? { ...s, profile: { ...s.profile, [key]: value } } : s);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Profile, SEO defaults, and theme.</p>
      </div>

      <section className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <Field label="Name">
          <input className="admin-input" value={settings.profile.name} onChange={(e) => updateProfile('name', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input className="admin-input" value={settings.profile.headline} onChange={(e) => updateProfile('headline', e.target.value)} />
        </Field>
        <Field label="Location">
          <input className="admin-input" value={settings.profile.location} onChange={(e) => updateProfile('location', e.target.value)} />
        </Field>
        <Field label="Email">
          <input className="admin-input" type="email" value={settings.profile.email} onChange={(e) => updateProfile('email', e.target.value)} />
        </Field>
        <Field label="Bio">
          <textarea rows={4} className="admin-input" value={settings.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="GitHub">
            <input className="admin-input" value={settings.profile.social.github ?? ''} onChange={(e) => updateProfile('social', { ...settings.profile.social, github: e.target.value || undefined })} />
          </Field>
          <Field label="LinkedIn">
            <input className="admin-input" value={settings.profile.social.linkedin ?? ''} onChange={(e) => updateProfile('social', { ...settings.profile.social, linkedin: e.target.value || undefined })} />
          </Field>
          <Field label="Twitter">
            <input className="admin-input" value={settings.profile.social.twitter ?? ''} onChange={(e) => updateProfile('social', { ...settings.profile.social, twitter: e.target.value || undefined })} />
          </Field>
          <Field label="Website">
            <input className="admin-input" value={settings.profile.social.website ?? ''} onChange={(e) => updateProfile('social', { ...settings.profile.social, website: e.target.value || undefined })} />
          </Field>
        </div>
        <Field label="Languages (comma-separated)">
          <input className="admin-input" value={settings.profile.languages.join(', ')} onChange={(e) => updateProfile('languages', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
        </Field>
      </section>

      <section className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">SEO</h2>
        <Field label="Default title">
          <input className="admin-input" value={settings.seo.title} onChange={(e) => update('seo', { ...settings.seo, title: e.target.value })} />
        </Field>
        <Field label="Default description">
          <textarea rows={3} className="admin-input" value={settings.seo.description} onChange={(e) => update('seo', { ...settings.seo, description: e.target.value })} />
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-primary text-sm">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save settings
        </button>
        {saved && <span className="text-success text-sm">Saved.</span>}
      </div>

      <style jsx>{`
        .admin-input { width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: white; font-size: 0.875rem; transition: all 0.2s; }
        .admin-input:focus { outline: none; border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15); }
      `}</style>
    </div>
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
