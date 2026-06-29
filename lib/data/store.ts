import { promises as fs } from 'fs';
import path from 'path';
import type {
  Project,
  BlogPost,
  Experience,
  Certification,
  Testimonial,
  Achievement,
  Skill,
  ContactMessage,
  AnalyticsEvent,
  SiteSettings,
  AdminUser,
} from '@/lib/types';

// File-based JSON store. Works without a database, persists across restarts,
// and writes are atomic-enough for a single-process Next.js server.
// Swap with Prisma/Postgres by replacing the read/write helpers.

const DATA_DIR = path.join(process.cwd(), 'data', 'runtime');

const FILES = {
  projects: 'projects.json',
  posts: 'blog-posts.json',
  experiences: 'experiences.json',
  certifications: 'certifications.json',
  testimonials: 'testimonials.json',
  achievements: 'achievements.json',
  skills: 'skills.json',
  messages: 'messages.json',
  analytics: 'analytics.json',
  settings: 'settings.json',
  admin: 'admin-users.json',
} as const;

type FileKey = keyof typeof FILES;

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(key: FileKey, fallback: T): Promise<T> {
  await ensureDir();
  const file = path.join(DATA_DIR, FILES[key]);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: FileKey, value: T): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, FILES[key]);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

export function newId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const store = {
  // --- Projects ---
  async listProjects(): Promise<Project[]> {
    return readJson<Project[]>('projects', []);
  },
  async getProject(id: string): Promise<Project | undefined> {
    return (await this.listProjects()).find((p) => p.id === id);
  },
  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return (await this.listProjects()).find((p) => p.slug === slug);
  },
  async upsertProject(project: Project): Promise<Project> {
    const all = await this.listProjects();
    const idx = all.findIndex((p) => p.id === project.id);
    const next = { ...project, updatedAt: new Date().toISOString() };
    if (idx === -1) all.unshift(next);
    else all[idx] = next;
    await writeJson('projects', all);
    return next;
  },
  async deleteProject(id: string): Promise<void> {
    const all = await this.listProjects();
    await writeJson('projects', all.filter((p) => p.id !== id));
  },

  // --- Blog ---
  async listPosts(onlyPublished = false): Promise<BlogPost[]> {
    const all = await readJson<BlogPost[]>('posts', []);
    if (!onlyPublished) return all;
    return all.filter((p) => p.published && (!p.scheduledFor || new Date(p.scheduledFor) <= new Date()));
  },
  async getPost(id: string): Promise<BlogPost | undefined> {
    return (await this.listPosts()).find((p) => p.id === id);
  },
  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return (await this.listPosts()).find((p) => p.slug === slug);
  },
  async upsertPost(post: BlogPost): Promise<BlogPost> {
    const all = await this.listPosts();
    const idx = all.findIndex((p) => p.id === post.id);
    const next = { ...post, updatedAt: new Date().toISOString() };
    if (idx === -1) all.unshift(next);
    else all[idx] = next;
    await writeJson('posts', all);
    return next;
  },
  async deletePost(id: string): Promise<void> {
    const all = await this.listPosts();
    await writeJson('posts', all.filter((p) => p.id !== id));
  },

  // --- Experience ---
  async listExperience(): Promise<Experience[]> {
    return readJson<Experience[]>('experiences', []);
  },
  async upsertExperience(exp: Experience): Promise<Experience> {
    const all = await this.listExperience();
    const idx = all.findIndex((e) => e.id === exp.id);
    if (idx === -1) all.unshift(exp);
    else all[idx] = exp;
    await writeJson('experiences', all);
    return exp;
  },
  async deleteExperience(id: string): Promise<void> {
    const all = await this.listExperience();
    await writeJson('experiences', all.filter((e) => e.id !== id));
  },

  // --- Skills / Certs / Testimonials / Achievements ---
  async listSkills(): Promise<Skill[]> {
    return readJson<Skill[]>('skills', []);
  },
  async upsertSkills(skills: Skill[]): Promise<void> {
    await writeJson('skills', skills);
  },

  async listCertifications(): Promise<Certification[]> {
    return readJson<Certification[]>('certifications', []);
  },
  async upsertCertification(cert: Certification): Promise<Certification> {
    const all = await this.listCertifications();
    const idx = all.findIndex((c) => c.id === cert.id);
    if (idx === -1) all.unshift(cert);
    else all[idx] = cert;
    await writeJson('certifications', all);
    return cert;
  },
  async deleteCertification(id: string): Promise<void> {
    const all = await this.listCertifications();
    await writeJson('certifications', all.filter((c) => c.id !== id));
  },

  async listTestimonials(): Promise<Testimonial[]> {
    return readJson<Testimonial[]>('testimonials', []);
  },
  async upsertTestimonial(t: Testimonial): Promise<Testimonial> {
    const all = await this.listTestimonials();
    const idx = all.findIndex((x) => x.id === t.id);
    if (idx === -1) all.unshift(t);
    else all[idx] = t;
    await writeJson('testimonials', all);
    return t;
  },
  async deleteTestimonial(id: string): Promise<void> {
    const all = await this.listTestimonials();
    await writeJson('testimonials', all.filter((x) => x.id !== id));
  },

  async listAchievements(): Promise<Achievement[]> {
    return readJson<Achievement[]>('achievements', []);
  },
  async upsertAchievement(a: Achievement): Promise<Achievement> {
    const all = await this.listAchievements();
    const idx = all.findIndex((x) => x.id === a.id);
    if (idx === -1) all.unshift(a);
    else all[idx] = a;
    await writeJson('achievements', all);
    return a;
  },
  async deleteAchievement(id: string): Promise<void> {
    const all = await this.listAchievements();
    await writeJson('achievements', all.filter((x) => x.id !== id));
  },

  // --- Messages ---
  async listMessages(): Promise<ContactMessage[]> {
    return readJson<ContactMessage[]>('messages', []);
  },
  async createMessage(m: ContactMessage): Promise<ContactMessage> {
    const all = await this.listMessages();
    all.unshift(m);
    await writeJson('messages', all);
    return m;
  },
  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    const all = await this.listMessages();
    const msg = all.find((m) => m.id === id);
    if (msg) {
      msg.status = status;
      await writeJson('messages', all);
    }
  },
  async deleteMessage(id: string): Promise<void> {
    const all = await this.listMessages();
    await writeJson('messages', all.filter((m) => m.id !== id));
  },

  // --- Analytics ---
  async listAnalytics(): Promise<AnalyticsEvent[]> {
    return readJson<AnalyticsEvent[]>('analytics', []);
  },
  async trackEvent(e: AnalyticsEvent): Promise<void> {
    const all = await this.listAnalytics();
    all.unshift(e);
    // Keep last 5000 events to avoid unbounded growth.
    if (all.length > 5000) all.length = 5000;
    await writeJson('analytics', all);
  },

  // --- Settings ---
  async getSettings(): Promise<SiteSettings> {
    return readJson<SiteSettings>('settings', defaultSettings);
  },
  async updateSettings(s: SiteSettings): Promise<SiteSettings> {
    await writeJson('settings', s);
    return s;
  },

  // --- Admin users ---
  async listAdmins(): Promise<AdminUser[]> {
    return readJson<AdminUser[]>('admin', []);
  },
  async upsertAdmin(u: AdminUser): Promise<AdminUser> {
    const all = await this.listAdmins();
    const idx = all.findIndex((x) => x.id === u.id);
    if (idx === -1) all.push(u);
    else all[idx] = u;
    await writeJson('admin', all);
    return u;
  },
};

export const defaultSettings: SiteSettings = {
  profile: {
    name: 'Henok Amdiye Endeshaw',
    headline: 'Software Engineer | AI Developer | Mobile App Developer | ITSM Professional',
    location: 'Addis Ababa, Ethiopia',
    bio: 'Software engineer building AI-powered, mobile-first, enterprise-grade systems. From ITSM in banking to ML in production — I ship software that moves metrics.',
    email: 'henok@example.com',
    social: {
      github: 'https://github.com/Henok-Endeshaw',
      linkedin: 'https://linkedin.com/in/henok-endeshaw',
    },
    languages: ['English', 'Amharic', 'Afan Oromo'],
  },
  seo: {
    title: 'Henok Amdiye Endeshaw — Software Engineer, AI Developer, ITSM Professional',
    description:
      'Portfolio of Henok Amdiye Endeshaw — software engineer, AI developer, mobile app developer, and ITSM professional building world-class products from Addis Ababa, Ethiopia.',
  },
  theme: {
    defaultMode: 'dark',
  },
};
