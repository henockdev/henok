'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Send, Github, Linkedin, Twitter, Mail, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContactSection({ email, location, social }: { email: string; location: string; social: Record<string, string | undefined> }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState('sending');
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          subject: fd.get('subject'),
          message: fd.get('message'),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setState('sent');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Failed to send');
    }
  }

  return (
    <section id="contact" className="section-pad relative">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Contact"
          title={<>Let's build something <span className="gradient-text">worth shipping</span></>}
          description="Open to full-time roles, contract work, and interesting side projects. I read every message."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 space-y-4"
          >
            <a href={`mailto:${email}`} className="glass-card p-5 flex items-center gap-4 hover:bg-white/[0.06] transition group">
              <div className="w-11 h-11 rounded-lg bg-accent-blue/15 text-accent-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-text-secondary uppercase tracking-wider">Email</div>
                <div className="font-medium truncate">{email}</div>
              </div>
            </a>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-accent-purple/15 text-accent-purple flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider">Based in</div>
                <div className="font-medium">{location}</div>
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="text-xs text-text-secondary uppercase tracking-wider mb-3">Around the web</div>
              <div className="flex items-center gap-3">
                {social.github && (
                  <a href={social.github} target="_blank" rel="noopener" aria-label="GitHub" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                    <Github size={16} />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                    <Linkedin size={16} />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener" aria-label="Twitter" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                    <Twitter size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="glass-card p-5 text-sm text-text-secondary leading-relaxed">
              <div className="font-semibold text-text-primary mb-1">Currently</div>
              Open to senior software engineering roles and select contract work. AI, mobile, ITSM, and full-stack web are my lanes.
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={onSubmit}
            className="md:col-span-3 glass-card p-6 md:p-8 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="name" label="Name" required placeholder="Your name" />
              <Field name="email" label="Email" type="email" required placeholder="you@example.com" />
            </div>
            <Field name="subject" label="Subject" required placeholder="What's this about?" />
            <Field name="message" label="Message" textarea required placeholder="Tell me about your project, role, or question…" rows={6} />

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-text-secondary">I usually respond within 24 hours.</p>
              <button
                type="submit"
                disabled={state === 'sending' || state === 'sent'}
                className={cn(
                  'btn-primary',
                  state === 'sent' && 'opacity-80',
                )}
              >
                {state === 'sending' && <><Loader2 size={14} className="animate-spin" /> Sending…</>}
                {state === 'sent' && <><CheckCircle2 size={14} /> Sent</>}
                {(state === 'idle' || state === 'error') && <><Send size={14} /> Send Message</>}
              </button>
            </div>

            {state === 'error' && (
              <div className="text-sm text-danger">{error}</div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  textarea,
  rows,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-text-secondary uppercase tracking-wider mb-2">{label}{required && <span className="text-danger"> *</span>}</span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={rows ?? 4}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue/40 transition resize-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue/40 transition"
        />
      )}
    </label>
  );
}
