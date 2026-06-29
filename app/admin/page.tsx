import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminRoot() {
  const admin = await requireAdmin();
  if (!admin) redirect('/admin/login');
  redirect('/admin/dashboard');
}
