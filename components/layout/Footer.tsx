import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { store } from '@/lib/data/store';

export async function Footer() {
  const settings = await store.getSettings();
  const { profile } = settings;

  return (
    <footer className="relative border-t border-white/[0.06] mt-24">
      <div className="container-tight px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold">H</span>
              </div>
              <div>
                <div className="font-semibold tracking-tight">{profile.name}</div>
                <div className="text-xs text-text-secondary">{profile.headline}</div>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {profile.bio}
            </p>
            <div className="flex items-center gap-3">
              {profile.social.github && (
                <a href={profile.social.github} target="_blank" rel="noopener" aria-label="GitHub" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                  <Github size={16} />
                </a>
              )}
              {profile.social.linkedin && (
                <a href={profile.social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                  <Linkedin size={16} />
                </a>
              )}
              {profile.social.twitter && (
                <a href={profile.social.twitter} target="_blank" rel="noopener" aria-label="Twitter" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                  <Twitter size={16} />
                </a>
              )}
              <a href={`mailto:${profile.email}`} aria-label="Email" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition">
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-text-secondary mb-4">Explore</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#about" className="text-text-secondary hover:text-text-primary transition">About</Link></li>
              <li><Link href="/#projects" className="text-text-secondary hover:text-text-primary transition">Projects</Link></li>
              <li><Link href="/blog" className="text-text-secondary hover:text-text-primary transition">Blog</Link></li>
              <li><Link href="/#experience" className="text-text-secondary hover:text-text-primary transition">Experience</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-text-secondary mb-4">Get in touch</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${profile.email}`} className="text-text-secondary hover:text-text-primary transition flex items-center gap-1">
                  {profile.email}
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li className="text-text-secondary">{profile.location}</li>
              <li>
                <Link href="/admin" className="text-text-secondary hover:text-text-primary transition">Admin</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-text-secondary">
          <div>© {new Date().getFullYear()} {profile.name}. Built end-to-end with Next.js, Three.js, and a lot of attention to detail.</div>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-text-primary transition">Sitemap</Link>
            <Link href="/feed.xml" className="hover:text-text-primary transition">RSS</Link>
            <Link href="/robots.txt" className="hover:text-text-primary transition">Robots</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
