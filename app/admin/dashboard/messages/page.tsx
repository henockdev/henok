'use client';

import { useEffect, useState } from 'react';
import type { ContactMessage } from '@/lib/types';
import { Mail, MailOpen, Archive, Trash2, Reply, AlertTriangle } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

const statusColors: Record<ContactMessage['status'], string> = {
  unread: '#38BDF8',
  read: '#94A3B8',
  replied: '#10B981',
  archived: '#64748B',
  spam: '#EF4444',
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<ContactMessage['status'] | 'all'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  async function load() {
    const res = await fetch('/api/admin/messages');
    const data = await res.json();
    setMessages(data.messages ?? []);
    setCounts(data.counts ?? {});
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: ContactMessage['status']) {
    await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (selected?.id === id) setSelected({ ...selected, status });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    load();
  }

  const visible = filter === 'all' ? messages : messages.filter((m) => m.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-text-secondary text-sm mt-1">Contact form submissions.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'unread', 'read', 'replied', 'archived', 'spam'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5',
              filter === s ? 'bg-white text-bg font-medium' : 'glass hover:bg-white/[0.08]',
            )}
          >
            {s === 'all' ? 'All' : s}
            <span className={cn('text-[10px]', filter === s ? 'opacity-70' : 'opacity-50')}>
              {s === 'all' ? messages.length : (counts[s] ?? 0)}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {visible.length === 0 ? (
            <div className="glass-card p-10 text-center text-text-secondary text-sm">No messages.</div>
          ) : visible.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelected(m); if (m.status === 'unread') setStatus(m.id, 'read'); }}
              className={cn(
                'w-full text-left glass-card p-4 hover:bg-white/[0.06] transition',
                selected?.id === m.id && 'bg-white/[0.08] border-accent-blue/40',
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium truncate">{m.name}</span>
                <span className="text-[10px] text-text-secondary shrink-0">{formatDate(m.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="text-xs text-text-secondary truncate mb-1">{m.subject}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase" style={{ background: `${statusColors[m.status]}20`, color: statusColors[m.status] }}>{m.status}</span>
                {m.status === 'unread' && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-lg font-semibold">{selected.subject}</div>
                  <div className="text-sm text-text-secondary mt-1">From <span className="text-text-primary">{selected.name}</span> &lt;<a href={`mailto:${selected.email}`} className="text-accent-blue hover:underline">{selected.email}</a>&gt;</div>
                  <div className="text-xs text-text-secondary mt-1">{formatDate(selected.createdAt, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded uppercase" style={{ background: `${statusColors[selected.status]}20`, color: statusColors[selected.status] }}>{selected.status}</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line mb-6 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                {selected.message}
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="btn-primary text-sm"><Reply size={14} /> Reply</a>
                {selected.status !== 'replied' && <button onClick={() => setStatus(selected.id, 'replied')} className="px-3 py-2 rounded-lg glass hover:bg-white/10 transition text-xs flex items-center gap-1"><MailOpen size={13} /> Mark replied</button>}
                {selected.status !== 'archived' && <button onClick={() => setStatus(selected.id, 'archived')} className="px-3 py-2 rounded-lg glass hover:bg-white/10 transition text-xs flex items-center gap-1"><Archive size={13} /> Archive</button>}
                {selected.status !== 'spam' && <button onClick={() => setStatus(selected.id, 'spam')} className="px-3 py-2 rounded-lg glass hover:bg-warning/20 hover:text-warning transition text-xs flex items-center gap-1"><AlertTriangle size={13} /> Spam</button>}
                <button onClick={() => remove(selected.id)} className="px-3 py-2 rounded-lg glass hover:bg-danger/20 hover:text-danger transition text-xs flex items-center gap-1 ml-auto"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-10 text-center text-text-secondary text-sm">
              <Mail size={32} className="mx-auto mb-3 opacity-40" />
              Select a message to read it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
