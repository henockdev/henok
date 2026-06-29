#!/usr/bin/env node
// Seeds the runtime JSON store from data/seed.json plus a default admin user.
// Run with: npm run seed

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const RUNTIME = path.join(ROOT, 'data', 'runtime');
const SEED = path.join(ROOT, 'data', 'seed.json');

function newId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

async function writeJson(name, value) {
  await fs.mkdir(RUNTIME, { recursive: true });
  await fs.writeFile(path.join(RUNTIME, name), JSON.stringify(value, null, 2), 'utf8');
  console.log(`✓ ${name}`);
}

async function main() {
  const seed = JSON.parse(await fs.readFile(SEED, 'utf8'));

  const now = new Date().toISOString();
  const projects = seed.projects.map((p) => ({
    ...p,
    media: p.media ?? [],
    featured: p.featured ?? false,
    pinned: p.pinned ?? false,
    createdAt: p.createdAt ?? now,
    updatedAt: p.updatedAt ?? now,
    publishedAt: p.publishedAt ?? null,
  }));

  await writeJson('projects.json', projects);
  await writeJson('blog-posts.json', seed.posts.map((p) => ({
    ...p,
    published: p.published ?? true,
    readingTime: p.readingTime ?? 5,
    tags: p.tags ?? [],
    createdAt: p.createdAt ?? now,
    updatedAt: p.updatedAt ?? now,
  })));
  await writeJson('experiences.json', seed.experiences.map((e) => ({
    ...e,
    current: e.current ?? (!e.endDate),
    responsibilities: e.responsibilities ?? [],
    achievements: e.achievements ?? [],
    technologies: e.technologies ?? [],
    createdAt: e.createdAt ?? now,
  })));
  await writeJson('skills.json', seed.skills);
  await writeJson('certifications.json', seed.certifications);
  await writeJson('testimonials.json', seed.testimonials);
  await writeJson('achievements.json', seed.achievements);
  await writeJson('messages.json', []);
  await writeJson('analytics.json', []);

  // Default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@henok.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme-admin';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await writeJson('admin-users.json', [
    {
      id: newId('admin'),
      email: adminEmail,
      name: 'Henok Amdiye',
      role: 'owner',
      twoFactorEnabled: false,
      passwordHash,
      createdAt: now,
    },
  ]);

  await writeJson('settings.json', {
    profile: seed.profile,
    seo: {
      title: `${seed.profile.name} — ${seed.profile.headline}`,
      description: seed.profile.bio,
    },
    theme: { defaultMode: 'dark' },
  });

  console.log('\nSeed complete.');
  console.log(`Admin login: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}  (change this on first login)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
