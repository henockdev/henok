'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, Shield, AlertCircle } from 'lucide-react';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'creds' | '2fa'>('creds');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submitCreds(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.pendingTwoFactor) {
        setStep('2fa');
      } else {
        router.push(next);
        router.refresh();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function submit2FA(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      router.push(next);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md glass-strong rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Lock size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold">Admin</div>
            <div className="text-xs text-text-secondary">Henok's portfolio CMS</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{step === 'creds' ? 'Sign in' : 'Two-factor code'}</h1>
        <p className="text-sm text-text-secondary mb-6">
          {step === 'creds' ? 'Enter your admin credentials.' : 'Enter the 6-digit code from your authenticator app.'}
        </p>

        {err && (
          <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        {step === 'creds' ? (
          <form onSubmit={submitCreds} className="space-y-4">
            <label className="block">
              <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Email</span>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition"
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Password</span>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition"
                />
              </div>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <>Sign in</>}
            </button>
          </form>
        ) : (
          <form onSubmit={submit2FA} className="space-y-4">
            <label className="block">
              <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                <Shield size={11} /> 6-digit code
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition"
              />
              <span className="block text-[11px] text-text-secondary mt-2">Demo: any code ending in 42 passes.</span>
            </label>
            <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full justify-center">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <>Verify</>}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-[11px] text-text-secondary">
          Default: <code className="text-text-primary">admin@henok.dev</code> / <code className="text-text-primary">changeme-admin</code>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-text-secondary" /></div>}>
      <LoginInner />
    </Suspense>
  );
}
