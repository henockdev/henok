'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, BarChart3, Globe, TrendingUp, Mail, Download } from 'lucide-react';

interface AnalyticsData {
  totals: { visits: number; projectViews: number; blogViews: number; resumeDownloads: number; contactRequests: number; last7d: number; last30d: number };
  series: { date: string; visits: number; projectViews: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { host: string; count: number }[];
}

export default function AnalyticsAdmin() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics').then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-text-secondary text-sm">Loading…</div>;

  const maxV = Math.max(1, ...data.series.map((s) => Math.max(s.visits, s.projectViews)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-secondary text-sm mt-1">Live traffic to your portfolio.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tile icon={Eye} label="Total visits" value={data.totals.visits} accent="#38BDF8" />
        <Tile icon={BarChart3} label="Project views" value={data.totals.projectViews} accent="#8B5CF6" />
        <Tile icon={Mail} label="Contact requests" value={data.totals.contactRequests} accent="#10B981" />
        <Tile icon={Download} label="Resume downloads" value={data.totals.resumeDownloads} accent="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Last 14 days</h3>
              <div className="text-xs text-text-secondary">{data.totals.last7d} visits in the last 7 days</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-blue" /> Visits</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-purple" /> Project views</span>
            </div>
          </div>
          <Chart data={data.series} max={maxV} />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe size={14} /> Top referrers</h3>
            {data.topReferrers.length === 0 ? (
              <div className="text-text-secondary text-sm">No data yet.</div>
            ) : (
              <div className="space-y-3">
                {data.topReferrers.map((r) => (
                  <div key={r.host}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate">{r.host}</span>
                      <span className="text-text-secondary font-mono text-xs">{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${(r.count / data.topReferrers[0].count) * 100}%` }} transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-accent-cyan"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={14} /> Top pages</h3>
            {data.topPages.length === 0 ? (
              <div className="text-text-secondary text-sm">No data yet.</div>
            ) : (
              <div className="space-y-2">
                {data.topPages.map((p) => (
                  <div key={p.path} className="flex justify-between text-sm">
                    <span className="text-text-secondary truncate">{p.path || '/'}</span>
                    <span className="font-mono text-xs text-accent-blue">{p.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, label, value, accent }: { icon: typeof Eye; label: string; value: number; accent: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-secondary mb-1">{label}</div>
          <div className="text-2xl font-bold" style={{ color: accent }}>{value}</div>
        </div>
        <Icon size={22} style={{ color: accent }} className="opacity-60" />
      </div>
    </div>
  );
}

function Chart({ data, max }: { data: { date: string; visits: number; projectViews: number }[]; max: number }) {
  return (
    <div className="h-48 flex items-end gap-1">
      {data.map((d, i) => (
        <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1 group">
          <div className="w-full flex flex-col items-stretch justify-end h-full">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.visits / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-accent-blue rounded-t-sm min-h-[1px]"
              title={`${d.date}: ${d.visits} visits`}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.projectViews / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.02 + 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-accent-purple rounded-t-sm min-h-[1px] -mt-1"
              title={`${d.date}: ${d.projectViews} project views`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
