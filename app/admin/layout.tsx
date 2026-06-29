import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The login page lives under /admin/login so we don't gate it.
  return <div className="min-h-screen">{children}</div>;
}
