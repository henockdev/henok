import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { store } from '@/lib/data/store';

export interface AdminSession {
  adminId?: string;
  email?: string;
  role?: 'owner' | 'editor';
  loggedInAt?: number;
  // 2FA flow: when set, password was correct but 2FA is pending.
  pendingTwoFactor?: boolean;
}

const password = process.env.SESSION_PASSWORD || 'dev-only-secret-please-change-in-production-32chars-min';

export const sessionOptions: SessionOptions = {
  password,
  cookieName: 'henok_admin_session',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions);
}

export async function login(email: string, passwordPlain: string) {
  const admins = await store.listAdmins();
  const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin) return null;

  const userWithHash = admin as typeof admin & { passwordHash: string };
  if (!userWithHash.passwordHash) return null;

  const ok = await bcrypt.compare(passwordPlain, userWithHash.passwordHash);
  if (!ok) return null;

  const session = await getSession();
  // If 2FA is enabled, mark pending and let the verify-2fa route complete the login.
  if (admin.twoFactorEnabled) {
    session.adminId = admin.id;
    session.email = admin.email;
    session.role = admin.role;
    session.pendingTwoFactor = true;
    await session.save();
    return { pendingTwoFactor: true as const };
  }

  session.adminId = admin.id;
  session.email = admin.email;
  session.role = admin.role;
  session.loggedInAt = Date.now();
  session.pendingTwoFactor = false;
  await session.save();
  return { admin, pendingTwoFactor: false as const };
}

export async function completeTwoFactor(code: string) {
  const session = await getSession();
  if (!session.adminId || !session.pendingTwoFactor) return null;
  // Demo TOTP: any 6-digit code ending in "42" passes. Replace with real TOTP in prod.
  if (!/^\d{6}$/.test(code) || !code.endsWith('42')) return null;
  session.pendingTwoFactor = false;
  session.loggedInAt = Date.now();
  await session.save();
  return true;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

export async function requireAdmin(): Promise<{ adminId: string; email: string; role: 'owner' | 'editor' } | null> {
  const session = await getSession();
  if (!session.adminId || session.pendingTwoFactor) return null;
  return {
    adminId: session.adminId,
    email: session.email!,
    role: session.role!,
  };
}
