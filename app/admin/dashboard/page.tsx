'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Inbox, Award, BarChart3, Plus, TrendingUp, MessageSquare, Eye, Mail } from 'lucide-react';

interface Counts {
  projects: number;
  posts: number;
  experiences: number;
  messages: { unread?: number } | number;
}

export default function DashboardOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [analytics, setAnalytics] = useState<{ totals: { visits: number; projectViews: number; blogViews: number } } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/projects').then((r) => r.json()),
      fetch('/api/admin/blog').then((r) => r.json()),
      fetch('/api/admin/experience').then((r) => r.json()),
      fetch('/api/admin/messages').then((r) => r.json()),
      fetch('/api/admin/analytics').then((r) => r.json()),
    ]).then(([p, b, e, m, a]) => {
      setCounts({
        projects: p.projects?.length ?? 0,
        posts: b.posts?.length ?? 0,
        experiences: e.experiences?.length ?? 0,
        messages: m.counts ?? 0,
      });
      setAnalytics(a);
    });
  }, []);

  const unread = typeof counts?.messages === 'object' ? counts.messages.unread ?? 0 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-text-secondary text-sm mt-1">Manage everything from one place.</p>
        </div>
        <Link href="/admin/dashboard/projects" className="btn-primary text-sm">
          <Plus size={14} /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile icon={Briefcase} label="Projects" value={counts?.projects} accent="#38BDF8" />
        <StatTile icon={BookOpen} label="Blog posts" value={counts?.posts} accent="#8B5CF6" />
        <StatTile icon={Award} label="Experiences" value={counts?.experiences} accent="#10B981" />
        <StatTile icon={Inbox} label="Unread" value={unread} accent="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tile icon={Eye} label="Total visits" value={analytics?.totals.visits} accent="#22D3EE" />
        <Tile icon={BarChart3} label="Project views" value={analytics?.totals.projectViews} accent="#A78BFA" />
        <Tile icon={TrendingUp} label="Blog views" value={analytics?.totals.blogViews} accent="#38BDF8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/dashboard/projects" className="glass-card p-6 hover:bg-white/[0.06] transition group block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent-blue/15 text-accent-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase size={18} />
            </div>
            <h3 className="font-semibold">Manage Projects</h3>
          </div>
          <p className="text-sm text-text-secondary">Create, edit, publish, pin, and feature projects. Add images, videos, metrics, and case studies.</p>
        </Link>
        <Link href="/admin/dashboard/blog" className="glass-card p-6 hover:bg-white/[0.06] transition group block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent-purple/15 text-accent-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={18} />
            </div>
            <h3 className="font-semibold">Write Blog Post</h3>
          </div>
          <p className="text-sm text-text-secondary">Markdown editor, drafts, scheduling, tags, and SEO controls. Changes appear on the site instantly.</p>
        </Link>
        <Link href="/admin/dashboard/messages" className="glass-card p-6 hover:bg-white/[0.06] transition group block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-semibold">Read Messages</h3>
          </div>
          <p className="text-sm text-text-secondary">Every contact form submission lands here. Mark as read, replied, archived, or spam.</p>
        </Link>
        <Link href="/admin/dashboard/analytics" className="glass-card p-6 hover:bg-white/[0.06] transition group block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/15 text-success flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 size={18} />
            </div>
            <h3 className="font-semibold">View Analytics</h3>
          </div>
          <p className="text-sm text-text-secondary">Visits, project views, top pages, referrers — everything you need to know who is looking.</p>
        </Link>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, accent }: { icon: typeof Briefcase; label: string; value: number | undefined; accent: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary mb-2">
        <Icon size={13} style={{ color: accent }} />
        {label}
      </div>
      <div className="text-3xl font-bold" style={{ color: accent }}>{value ?? '—'}</div>
    </motion.div>
  );
}

function Tile({ icon: Icon, label, value, accent }: { icon: typeof Mail; label: string; value: number | undefined; accent: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-secondary mb-1">{label}</div>
          <div className="text-2xl font-bold" style={{ color: accent }}>{value ?? '—'}</div>
        </div>
        <Icon size={24} style={{ color: accent }} className="opacity-60" />
      </div>
    </div>
  );
}
