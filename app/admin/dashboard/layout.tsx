'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Award,
  Inbox,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/dashboard/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/dashboard/experience', label: 'Experience', icon: Award },
  { href: '/admin/dashboard/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/status')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setUser({ email: d.email, role: d.role });
          setAuthChecked(true);
        } else {
          router.replace('/admin/login');
        }
      })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  useEffect(() => { setOpen(false); }, [pathname]);

  async function logout() {
    await fetch('/api/auth/2fa', { method: 'DELETE' });
    router.replace('/admin/login');
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary text-sm">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 glass-strong border-r border-white/[0.06] flex flex-col transition-transform',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Admin</div>
              <div className="text-[10px] text-text-secondary">CMS Dashboard</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  active ? 'bg-white/[0.08] text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
                )}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition">
            <ExternalLink size={15} /> View site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/10 transition">
            <LogOut size={15} /> Sign out
          </button>
          {user && (
            <div className="mt-2 px-3 py-2 text-[10px] text-text-secondary border-t border-white/[0.06]">
              <div className="truncate">{user.email}</div>
              <div className="text-accent-blue">{user.role}</div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 glass-strong border-b border-white/[0.06] px-4 md:px-8 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-lg glass flex items-center justify-center" aria-label="Menu">
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="text-sm text-text-secondary">
            <span className="text-text-primary font-medium">Welcome back,</span> {user?.email}
          </div>
          <div className="w-9 h-9 rounded-lg glass flex items-center justify-center text-xs font-medium">
            {user?.email?.slice(0, 1).toUpperCase() ?? 'A'}
          </div>
        </header>
        <main className="p-4 md:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
